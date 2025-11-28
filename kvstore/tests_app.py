from js import document, window
from pyodide.ffi import create_proxy
import sys
import types
import importlib
import io
import ast
import json
import os
import inspect

# Make package-style imports work (e.g. from kvstore.message import ...)
pkg = types.ModuleType("kvstore")
sys.modules.setdefault("kvstore", pkg)
import message as _message

sys.modules["kvstore.message"] = _message
import store as _store

sys.modules["kvstore.store"] = _store
import client as _client

sys.modules["kvstore.client"] = _client
import trace as _trace

sys.modules["kvstore.trace"] = _trace


def find_test_modules() -> list[str]:
    try:
        files = os.listdir(".")
    except Exception:
        files = []
    mods = sorted(
        fn[:-3] for fn in files if fn.startswith("test_") and fn.endswith(".py")
    )
    return mods


CURRENT = "test_message"
DISCOVERY = {}  # module -> {'tests': [names], 'generators': [names], 'gen_argcounts': {name: num_args}}


def set_active_tab(name: str):
    global CURRENT
    CURRENT = name
    # button states
    tabs = document.getElementById("tabs").children
    for i in range(len(tabs)):
        el = tabs.item(i)
        if el.getAttribute("data-test") == name:
            el.classList.add("active")
        else:
            el.classList.remove("active")
    # load source
    load_source(name)


def load_source(module_name: str):
    path = f"{module_name}.py"
    code_el = document.getElementById("test-code")
    view_el = document.getElementById("code-view")
    editor_el = document.getElementById("editor")
    btn_edit = document.getElementById("btn-edit")
    btn_save = document.getElementById("btn-save")
    btn_cancel = document.getElementById("btn-cancel")
    try:
        with open(path, "r") as f:
            code = f.read()
        # reset code element and ensure language class
        code_el.classList.add("language-python")
        code_el.classList.remove("hljs")  # drop previous highlight class if present
        code_el.textContent = code
        # sync editor content and ensure view mode
        editor_el.value = code
        view_el.style.display = ""
        editor_el.style.display = "none"
        btn_edit.style.display = ""
        btn_save.style.display = "none"
        btn_cancel.style.display = "none"

        # highlight after render
        def do_hl(_evt=None):
            try:
                if hasattr(window, "hljs") and window.hljs:
                    # ensure raw text then apply highlighter
                    code_el.classList.remove("hljs")
                    try:
                        code_el.removeAttribute("data-highlighted")
                    except Exception:
                        pass
                    code_el.textContent = code
                    window.hljs.highlightElement(code_el)
            except Exception:
                pass

        window.setTimeout(create_proxy(do_hl), 0)
        populate_components(module_name, code)
        note_el = document.getElementById("test-note")
        if module_name == "test_message":
            note_el.textContent = (
                "Runnable in-browser. Uses Hypothesis to fuzz message serialization."
            )
        else:
            note_el.textContent = "Note: This module may reference sockets/threads; running may fail in-browser. You can still run @composite generators."
    except Exception as e:
        code_el.textContent = f"Could not load {path}: {e}"


def discover_hypothesis_items(module_name: str, source_code: str):
    tests = []
    gens = []
    gen_argcounts = {}
    try:
        tree = ast.parse(source_code, filename=f"{module_name}.py")
        for node in tree.body:
            if isinstance(node, ast.FunctionDef):
                has_given = False
                has_composite = False
                for dec in node.decorator_list:
                    target = dec.func if isinstance(dec, ast.Call) else dec
                    if isinstance(target, ast.Name):
                        name = target.id
                    elif isinstance(target, ast.Attribute):
                        name = target.attr
                    else:
                        name = None
                    if name == "given":
                        has_given = True
                    if name == "composite":
                        has_composite = True
                if has_given:
                    tests.append(node.name)
                if has_composite:
                    num_args = max(0, len(node.args.args) - 1)
                    gens.append(node.name)
                    gen_argcounts[node.name] = num_args
    except Exception:
        pass
    DISCOVERY[module_name] = {
        "tests": tests,
        "generators": gens,
        "gen_argcounts": gen_argcounts,
    }
    return DISCOVERY[module_name]


def populate_components(module_name: str, source_code: str):
    info = discover_hypothesis_items(module_name, source_code)
    tests_container = document.getElementById("tests-list")
    gens_container = document.getElementById("gens-list")
    tests_container.innerHTML = ""
    gens_container.innerHTML = ""
    # Add buttons for tests
    for name in info["tests"]:
        btn = document.createElement("button")
        btn.textContent = name

        def make_handler(nm):
            def handler(_evt=None):
                run_given_test(module_name, nm)

            return handler

        btn.addEventListener("click", create_proxy(make_handler(name)))
        tests_container.appendChild(btn)
    # Add buttons for generators
    for name in info["generators"]:
        btn = document.createElement("button")
        btn.textContent = name
        # Filter out unsupported generators (those with non-default extra args)
        try:
            mod = importlib.import_module(module_name)
            fn = getattr(mod, name)
            sig = inspect.signature(fn)
            params = list(sig.parameters.values())
            print(f"For {name}: params={params}")
            # Skip first param (draw); remaining must have defaults
            extras = params
            print(f"For {name}: extras={extras}")
            supported = all(p.default is not inspect._empty for p in extras)
            print(f"For {name}: supported={supported}")
        except Exception:
            supported = False
        if not supported:
            continue

        def make_handler(nm):
            def handler(_evt=None):
                try:
                    n = int(document.getElementById("component-count").value or "5")
                except Exception:
                    n = 5
                run_composite_generator(module_name, nm, n)

            return handler

        btn.addEventListener("click", create_proxy(make_handler(name)))
        gens_container.appendChild(btn)


def on_kind_change(evt=None):
    pass


def run_given_test(module_name: str, func_name: str):
    buf = io.StringIO()
    old_out, old_err = sys.stdout, sys.stderr
    sys.stdout = sys.stderr = buf
    status = "PASS"
    try:
        if module_name in sys.modules:
            del sys.modules[module_name]
        mod = importlib.import_module(module_name)
        fn = getattr(mod, func_name)
        fn()
    except Exception as e:
        status = f"FAIL: {e}"
    finally:
        sys.stdout, sys.stderr = old_out, old_err
    document.getElementById("test-output").textContent = (
        f"[{status}]\n" + buf.getvalue()
    )


def run_composite_generator(module_name: str, func_name: str, n: int):
    out_lines = []
    try:
        mod = importlib.import_module(module_name)
        fn = getattr(mod, func_name)
        # Validate signature: any extra params beyond first (draw) must have defaults
        sig = inspect.signature(fn)
        params = list(sig.parameters.values())
        extras = params[1:]
        if any(p.default is inspect._empty for p in extras):
            document.getElementById(
                "test-output"
            ).textContent = (
                f"Generator '{func_name}' requires non-default args; omitted from UI."
            )
            return
        # Use defaults by not passing arguments
        strat = fn()
        for _ in range(max(1, n)):
            try:
                sample = strat.example()
            except Exception as e:
                sample = f"<error: {e}>"
            try:
                out_lines.append(json.dumps(sample))
            except Exception:
                out_lines.append(str(sample))
        document.getElementById("test-output").textContent = "\n".join(out_lines)
    except Exception as e:
        document.getElementById("test-output").textContent = f"Error: {e}"


def on_run_component(evt=None):
    pass


def on_edit(evt=None):
    document.getElementById("code-view").style.display = "none"
    document.getElementById("editor").style.display = ""
    document.getElementById("btn-edit").style.display = "none"
    document.getElementById("btn-save").style.display = ""
    document.getElementById("btn-cancel").style.display = ""


def on_cancel(evt=None):
    # Revert editor to current file contents and switch to view
    try:
        with open(f"{CURRENT}.py", "r") as f:
            code = f.read()
        document.getElementById("editor").value = code
        document.getElementById("test-code").textContent = code
    except Exception:
        pass
    document.getElementById("code-view").style.display = ""
    document.getElementById("editor").style.display = "none"
    document.getElementById("btn-edit").style.display = ""
    document.getElementById("btn-save").style.display = "none"
    document.getElementById("btn-cancel").style.display = "none"
    try:
        if hasattr(window, "hljs") and window.hljs:
            el = document.getElementById("test-code")
            el.classList.remove("hljs")
            try:
                el.removeAttribute("data-highlighted")
            except Exception:
                pass
            window.hljs.highlightElement(el)
    except Exception:
        pass


def on_save(evt=None):
    code = document.getElementById("editor").value
    try:
        with open(f"{CURRENT}.py", "w") as f:
            f.write(code)
    except Exception as e:
        document.getElementById("test-output").textContent = f"Save error: {e}"
        return
    # Reload to update discovery and highlighting
    load_source(CURRENT)
    # Invalidate module cache so subsequent runs pick up changes
    try:
        if CURRENT in sys.modules:
            del sys.modules[CURRENT]
    except Exception:
        pass


def bind_tabs():
    tabs = document.getElementById("tabs")
    tabs.innerHTML = ""
    for mod in find_test_modules():
        btn = document.createElement("button")
        btn.className = "tab"
        btn.textContent = mod
        btn.setAttribute("data-test", mod)

        def make_handler(target):
            def handler(_evt=None):
                set_active_tab(target.getAttribute("data-test"))

            return handler

        btn.addEventListener("click", create_proxy(make_handler(btn)))
        tabs.appendChild(btn)
    set_active_tab(CURRENT)


# Initialize
bind_tabs()
document.getElementById("btn-edit").addEventListener("click", create_proxy(on_edit))
document.getElementById("btn-save").addEventListener("click", create_proxy(on_save))
document.getElementById("btn-cancel").addEventListener("click", create_proxy(on_cancel))
