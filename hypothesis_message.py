from hypothesis import given
from hypothesis.strategies import composite, DrawFn, one_of, text, integers
from message import Insert, Get, Delete, Select, Message
import string

@composite
def inserts(draw: DrawFn) -> Insert:
    # todo: generate random keys and values
    k = draw(text(alphabet=string.ascii_letters + string.digits))
    v = draw(text(alphabet=string.ascii_letters + string.digits))
    return Insert(k=k, v=v)


@composite
def gets(draw: DrawFn) -> Get:
    k = draw(text(alphabet=string.ascii_letters + string.digits))
    return Get(k=k)


@composite
def deletes(draw: DrawFn) -> Delete:
    k = draw(text(alphabet=string.ascii_letters + string.digits))
    return Delete(k=k)


@composite
def selects(draw: DrawFn) -> Select:
    k = draw(text(alphabet=string.ascii_letters + string.digits))
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
def test_serialize_deserialize(msg: Message) -> None:
    serialized = msg.serialize()
    deserialized = Message.deserialize(serialized)
    assert msg == deserialized, f"{msg} != {deserialized}"


if __name__ == "__main__":
    test_serialize_deserialize()