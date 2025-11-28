from js import document, window
from pyodide.ffi import create_proxy
from store import Store
import json
import re
import secrets


# Initialize in-browser store
store = Store("webstore")

# ---- LocalStorage persistence for the store ----
LS_KEY = "kv_store_data"


def store_items_to_dict(items_list):
    data = {}
    try:
        for entry in items_list or []:
            for key in entry.keys():
                data[str(key)] = entry[key]
    except Exception:
        pass
    return data


def persist_store():
    try:
        items = store.select(".*")
        data = store_items_to_dict(items)
        window.localStorage.setItem(LS_KEY, json.dumps(data))
    except Exception:
        pass


def load_store():
    try:
        raw = window.localStorage.getItem(LS_KEY)
        if not raw:
            return
        data = json.loads(raw)
        # Clear current store then hydrate
        existing = store.select(".*")
        for entry in existing or []:
            for key in entry.keys():
                store.delete(key)
        for key, value in data.items():
            store.insert(key, value)
    except Exception:
        pass


load_store()


# ---- Per-session username (implicit) ----
def ensure_username() -> str:
    u = window.sessionStorage.getItem("username")
    if not u:
        u = f"user-{secrets.token_hex(3)}"
        window.sessionStorage.setItem("username", u)
        add_user(u)
    document.getElementById("username").textContent = u
    return u


def add_user(u: str):
    USERS.append(u)
    window.localStorage.setItem("users", json.dumps(USERS))


def get_users() -> list[str]:
    users = window.localStorage.getItem("users")
    try:
        users = json.loads(users) if users else None
    except Exception:
        users = None
    if not users:
        users = ["admin"]
        window.localStorage.setItem("users", json.dumps(users))
    return users


USERS = get_users()
USERNAME = ensure_username()
ADMIN = USERNAME == "admin"
PREFIX = "" if ADMIN else f"{USERNAME}_"


def with_prefix_key(k: str) -> str:
    k = k or ""
    if ADMIN:
        return k
    return k if k.startswith(PREFIX) else f"{PREFIX}{k}"


def with_prefix_regex(r: str) -> str:
    r = (r or ".*").strip()
    if ADMIN:
        return r
    # If the regex already starts with the prefix, keep as is
    if r.startswith("^" + re.escape(PREFIX)) or r.startswith(PREFIX):
        return r if r.startswith("^") else "^" + r
    return "^" + re.escape(PREFIX) + r


def populate_user_selector():
    sel = document.getElementById("username")
    # Clear
    sel.innerHTML = ""

    # Options
    def add_option(value: str):
        opt = document.createElement("option")
        opt.value = value
        opt.textContent = value
        sel.appendChild(opt)

    for u in USERS:
        add_option(u)
    add_option("new user")
    # Select current
    sel.value = USERNAME


def set_current_user(u: str):
    global USERNAME, ADMIN, PREFIX
    USERNAME = u
    ADMIN = USERNAME == "admin"
    PREFIX = "" if ADMIN else f"{USERNAME}_"
    window.sessionStorage.setItem("username", USERNAME)
    document.getElementById("username").textContent = USERNAME
    populate_user_selector()
    refresh_state()


def parse_value(text: str):
    text = (text or "").strip()
    if text == "":
        return None
    try:
        return json.loads(text)
    except Exception:
        return text


def set_output(text: str):
    document.getElementById("output").textContent = text


def display_key(k) -> str:
    s = str(k)
    if not ADMIN and s.startswith(PREFIX):
        return s[len(PREFIX) :]
    return s


def render_state_table(items):
    container = document.getElementById("state")
    container.innerHTML = ""
    table = document.createElement("table")
    table.className = "state-table"
    thead = document.createElement("thead")
    trh = document.createElement("tr")
    th_key = document.createElement("th")
    th_key.textContent = "Key"
    th_val = document.createElement("th")
    th_val.textContent = "Value"
    trh.appendChild(th_key)
    trh.appendChild(th_val)
    thead.appendChild(trh)
    tbody = document.createElement("tbody")
    try:
        for entry in items or []:
            for key in entry.keys():
                val = entry[key]
                tr = document.createElement("tr")
                td_key = document.createElement("td")
                td_key.textContent = display_key(key)
                td_val = document.createElement("td")
                try:
                    if isinstance(val, (dict, list)):
                        code = document.createElement("code")
                        code.textContent = json.dumps(val, indent=2)
                        td_val.appendChild(code)
                    else:
                        td_val.textContent = str(val)
                except Exception:
                    td_val.textContent = str(val)
                tr.appendChild(td_key)
                tr.appendChild(td_val)
                tbody.appendChild(tr)
    except Exception as e:
        err = document.createElement("pre")
        err.textContent = f"Error rendering table: {e}"
        container.appendChild(err)
        return
    table.appendChild(thead)
    table.appendChild(tbody)
    container.appendChild(table)


def refresh_state():
    try:
        r = ".*" if ADMIN else "^" + re.escape(PREFIX) + ".*"
        items = store.select(r)
        render_state_table(items)
    except Exception as e:
        container = document.getElementById("state")
        container.innerHTML = ""
        pre = document.createElement("pre")
        pre.textContent = f"Error: {e}"
        container.appendChild(pre)


def py_insert(evt=None):
    try:
        k = with_prefix_key(document.getElementById("key").value)
        v_text = document.getElementById("value").value
        v = parse_value(v_text)
        prev = store.insert(k, v)
        persist_store()
        refresh_state()
        set_output("OK" if prev is None else json.dumps(prev, indent=2))
    except Exception as e:
        set_output(f"Error: {e}")


def py_get(evt=None):
    try:
        k = with_prefix_key(document.getElementById("key").value)
        v = store.get(k)
        set_output("NOT FOUND" if v is None else json.dumps(v, indent=2))
    except Exception as e:
        set_output(f"Error: {e}")


def py_delete(evt=None):
    try:
        k = with_prefix_key(document.getElementById("key").value)
        v = store.delete(k)
        persist_store()
        refresh_state()
        set_output("NOT FOUND" if v is None else json.dumps(v, indent=2))
    except Exception as e:
        set_output(f"Error: {e}")


def py_select(evt=None):
    try:
        r = with_prefix_regex(document.getElementById("regex").value)
        vs = store.select(r)
        # Present keys without prefix for user view
        if not ADMIN:
            stripped = []
            for entry in vs or []:
                for key in entry.keys():
                    stripped.append({display_key(key): entry[key]})
            set_output(json.dumps(stripped, indent=2))
        else:
            set_output(json.dumps(vs, indent=2))
    except Exception as e:
        set_output(f"Error: {e}")


def py_clear_output(evt=None):
    set_output("")


def py_on_user_change(evt=None):
    try:
        target = (
            evt.target
            if evt and hasattr(evt, "target")
            else document.getElementById("username")
        )
        if target.value == "new user":
            u = f"user-{secrets.token_hex(3)}"
            add_user(u)
        else:
            u = target.value
        set_current_user(u)
    except Exception as e:
        # log to console
        print(f"Error switching user: {e}")


def py_on_unload(evt=None):
    persist_store()


# Wire up events
document.getElementById("btn-insert").addEventListener("click", create_proxy(py_insert))
document.getElementById("btn-get").addEventListener("click", create_proxy(py_get))
document.getElementById("btn-delete").addEventListener("click", create_proxy(py_delete))
document.getElementById("btn-select").addEventListener("click", create_proxy(py_select))
document.getElementById("btn-clear-output").addEventListener(
    "click", create_proxy(py_clear_output)
)
document.getElementById("username").addEventListener(
    "change", create_proxy(py_on_user_change)
)
window.addEventListener("beforeunload", create_proxy(py_on_unload))

# Initial render
populate_user_selector()
refresh_state()
