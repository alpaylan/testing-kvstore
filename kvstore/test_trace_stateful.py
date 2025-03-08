from hypothesis import given, settings
from hypothesis.strategies import (
    integers,
    composite,
    DrawFn,
    one_of,
    sampled_from,
    lists,
    text,
    booleans,
)

from client import Client
from message import Insert, Get, Delete, Select, Message, Startup, Stop
from trace import Trace, Interaction, ServerInteraction, MyServer
from message import inserts

import string
import datetime
import json
import subprocess


@composite
def startups(draw: DrawFn) -> ServerInteraction:
    return ("startup",)


@composite
def stops(draw: DrawFn) -> ServerInteraction:
    return ("stop",)


@composite
def gets(draw: DrawFn, st: dict) -> Get:
    keys = list(st.keys())

    if draw(booleans()) or len(keys) == 0:
        k = draw(text(alphabet=string.ascii_letters + string.digits))
    else:
        k = draw(sampled_from(keys))

    return Get(k=k)


@composite
def deletes(draw: DrawFn, st: dict) -> Delete:
    keys = list(st.keys())

    if draw(booleans()) or len(keys) == 0:
        k = draw(text(alphabet=string.ascii_letters + string.digits))
    else:
        k = draw(sampled_from(keys))

    return Delete(k=k)


@composite
def selects(draw: DrawFn, st) -> Select:
    keys = list(st.keys())

    if draw(booleans()) or len(keys) == 0:
        k = draw(text(alphabet=string.ascii_letters + string.digits))
    else:
        k = draw(sampled_from(keys))

    # randomly switch subsequences with *
    try:
        left = draw(integers(min_value=0, max_value=len(k) - 1))
        right = draw(integers(min_value=left, max_value=len(k)))
        k = k[:left] + "*" + k[right:]
    except Exception:
        pass

    return Select(k=k)


@composite
def messages(draw: DrawFn, st: dict) -> Message:
    return draw(one_of(inserts(), gets(st), deletes(st), selects(st)))


@composite
def interactions(draw: DrawFn, clients: list[Client], st: dict) -> Interaction:
    choices = [
        (1, startups()),
        (1, stops()),
        (6, inserts()),
        (10, gets(st)),
        (4, deletes(st)),
        (10, selects(st)),
    ]
    # Flatten the list by repeating each choice by its weight
    flat = [choice for (weight, choice) in choices for _ in range(weight)]
    choice = draw(one_of(flat))

    # If the choice is a client interaction, choose a client
    if not isinstance(choice, tuple):
        client = draw(sampled_from(clients))
        choice = ("message", client, choice)

    return choice


@composite
def clients(draw: DrawFn) -> Client:
    prefix = draw(text(alphabet=string.ascii_letters + string.digits))
    return Client(
        "localhost",
        8000,
        prefix,
    )


@composite
def traces(draw: DrawFn) -> Trace:
    n = draw(integers(min_value=1, max_value=1000))
    cs = draw(lists(clients(), min_size=1, max_size=30, unique_by=lambda c: c.prefix))
    trace = []
    st = {}

    for _ in range(n):
        interaction = draw(interactions(cs, st))
        match interaction:
            case ("message", client, message):
                match message:
                    case Insert(k, v):
                        k = client.prefix + "_" + k
                        st[k] = v

                    case Delete(k):
                        k = client.prefix + "_" + k
                        if k in st:
                            del st[k]

                    case _:
                        pass
        trace.append(interaction)

    trace.append(("shutdown",))

    return trace


def check_state_model(result: str, client: Client, message: Message, st: dict):
    match message:
        case Insert(k, v):
            print(f"Inserting {k} -> {v}")
            st[k] = v

        case Delete(k):
            print(f"Deleting {k}")
            if k in st:
                del st[k]

        case Get(k):
            print(f"Getting {k}")
            if k in st:
                assert st[k] == result, f"get({k}) returned '{result}' instead of '{st[k]}'"
        case _:
            pass


def execute(trace: Trace):
    admin = Client("localhost", 8000, "admin")
    server = MyServer()
    server.start()
    st = {}

    for interaction in trace:
        match interaction:
            case ("startup",):
                print("Starting up server")
                admin.request(Startup())
            case ("stop",):
                print("Stopping server")
                admin.request(Stop())
            case ("shutdown",):
                print("Shutting down server")
                server.stop()
            case ("message", client, message):
                result = client.request(message)
                if server.server.running:
                    check_state_model(result, client, message, st)

    # delete the store
    subprocess.run("rm -rf store/*", shell=True)


@given(traces())
@settings(deadline=datetime.timedelta(milliseconds=5000), verbosity=2)
def test_execute(trace: Trace) -> None:
    execute(trace)


if __name__ == "__main__":
    # test_execute()
    test_execute()
    print("Done")
