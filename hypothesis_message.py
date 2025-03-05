from hypothesis import given, settings, Verbosity
from message import Insert, Get, Delete, Select, Message
from hypothesis.strategies import (
    composite,
    DrawFn,
    one_of,
    text,
    integers,
    none,
    booleans,
    dictionaries,
)

import string

@composite
def weighted_choice(draw: DrawFn, choices: list[tuple[int, any]]) -> any:
    flat = [choice for (weight, choice) in choices for _ in range(weight)]
    return draw(one_of(flat))

@composite
def json(draw: DrawFn, depth: int = 3) -> any:
    return draw(weighted_choice(
        [
            (1, none()),
            (1, booleans()),
            (1, integers()),
            (1, text(alphabet=string.ascii_letters + string.digits, min_size=1)),
            (depth, dictionaries(
                keys=text(alphabet=string.ascii_letters + string.digits, min_size=1),
                values=json(depth=depth - 1),
                min_size=0,
                max_size=10,
            )),
        ],
    ))


@composite
def inserts(draw: DrawFn) -> Insert:
    k = draw(text(alphabet=string.ascii_letters + string.digits, min_size=1))
    v = draw(json())
    return Insert(k=k, v=v)


@composite
def gets(draw: DrawFn) -> Get:
    k = draw(text(alphabet=string.ascii_letters + string.digits, min_size=1))
    return Get(k=k)


@composite
def deletes(draw: DrawFn) -> Delete:
    k = draw(text(alphabet=string.ascii_letters + string.digits, min_size=1))
    return Delete(k=k)


@composite
def selects(draw: DrawFn) -> Select:
    k = draw(text(alphabet=string.ascii_letters + string.digits, min_size=1))
    # randomly switch subsequences with *
    try:
        left = draw(integers(min_value=0, max_value=len(k) - 1))
        right = draw(integers(min_value=left, max_value=len(k)))
        k = k[:left] + "*" + k[right:]
    except Exception:
        pass

    return Select(k=k)


@composite
def messages(draw: DrawFn) -> Message:
    return draw(one_of(inserts(), gets(), deletes(), selects()))


@given(messages())
@settings(max_examples=1000, verbosity=Verbosity.verbose)
def test_serialize_deserialize(msg: Message) -> None:
    serialized = msg.serialize()
    deserialized = Message.deserialize(serialized)
    assert msg == deserialized, f"{msg} != {deserialized}"


if __name__ == "__main__":
    test_serialize_deserialize()
