
from hypothesis import given
from hypothesis.strategies import integers


@given(integers())
def test_incr_decr_roundtrip(i):
    assert (i + 1) - 1 == i


if __name__ == '__main__':
    test_incr_decr_roundtrip()