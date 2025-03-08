from hypothesis import given
from hypothesis.strategies import lists, integers

def test_append():
    l = [1, 2, 3]
    l.append(4)
    assert l == [1, 2, 3, 4]

def test_append2():
    l = [1, 2, 3]
    l.append(4)
    assert 4 in l

@given(lists(integers()))
def test_append3(l: list):
    l.append(4)
    assert 4 in l

@given(lists(integers()), integers())
def test_append4(l: list, x: int):
    l.append(x)
    assert x in l

def append(l: list, x: any):
    l = l.copy()
    l.append(x)
    return l

# List contains the appended element
@given(lists(integers()), integers())
def test_contains(l: list, x: int):
    assert x in append(l, x)

# List length increases by one
@given(lists(integers()), integers())
def test_length(l: list, x: int):
    assert len(append(l, x)) == len(l) + 1

# Last element is the appended element
@given(lists(integers()), integers())
def test_last(l: list, x: int):
    assert append(l, x)[-1] == x

# Prefix of the list is the same
@given(lists(integers()), integers())
def test_prefix(l: list, x: int):
    assert append(l, x)[:-1] == l

# Sorting is idempotent
@given(lists(integers()))
def test_sorting(l: list[int]):
    assert sorted(sorted(l)) == sorted(l)

# Reversing a list twice results in the original list
@given(lists(integers()))
def test_reverse(l: list[int]):
    assert list(reversed(list(reversed(l)))) == l