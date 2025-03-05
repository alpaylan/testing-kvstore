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
from trace import Trace, Interaction, ServerInteraction, execute
from hypothesis_message import inserts, gets, deletes, selects
from client import Client
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
        (0, startups()),
        (0, stops()),
        (3, inserts()),
        (5, gets()),
        (2, deletes()),
        (5, selects()),
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
    n = draw(integers(min_value=100, max_value=1000))
    cs = draw(lists(clients(), min_size=3, max_size=30, unique_by=lambda c: c.prefix))
    trace = []

    for _ in range(n):
        interaction = draw(interactions(cs))
        trace.append(interaction)
    
    trace.append(("shutdown",))

    return trace


@given(traces())
@settings(deadline=datetime.timedelta(milliseconds=5000))
def test_execute(trace: Trace) -> None:
    execute(trace)

if __name__ == "__main__":
    # test_execute()
    test_execute()
    print("Done")
