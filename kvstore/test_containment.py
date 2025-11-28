from hypothesis import given, settings
from hypothesis.strategies import (
    integers,
    composite,
    DrawFn,
    one_of,
    sampled_from,
    lists,
    text,
)

from kvstore.client import Client
from kvstore.store import Store
from kvstore.message import Insert
from kvstore.trace import Trace, Interaction, ServerInteraction, execute
from kvstore.test_message import inserts, gets, deletes, selects
from kvstore.client import Client

import string
import datetime


@composite
def startups(draw: DrawFn) -> ServerInteraction:
    return ("startup",)


@composite
def stops(draw: DrawFn) -> ServerInteraction:
    return ("stop",)


@composite
def interactions(draw: DrawFn, clients: list[Client]) -> Interaction:
    choices = [
        (1, startups()),
        (1, stops()),
        (6, inserts()),
        (10, gets()),
        (4, deletes()),
        (10, selects()),
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
def stores(draw: DrawFn) -> Store:
    cs: list[Client] = draw(
        lists(clients(), min_size=1, max_size=30, unique_by=lambda c: c.prefix)
    )

    store = Store("test")
    for c in cs:
        n = draw(integers(min_value=1, max_value=20))
        for _ in range(n):
            ins = draw(inserts())
            ins.k = c.prefix + "_" + ins.k
            store.insert(ins.k, ins.v)

    return store


@given(stores(), clients(), inserts())
@settings(deadline=datetime.timedelta(milliseconds=5000), verbosity=2)
def test_containment(store: Store, client: Client, insert: Insert) -> None:
    insert.k = client.prefix + "_" + insert.k
    store.insert(insert.k, insert.v)
    assert store.get(insert.k) == insert.v


if __name__ == "__main__":
    test_containment()
    print("Done")
