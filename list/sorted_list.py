from hypothesis import given, Verbosity, settings
from hypothesis.strategies import composite, integers, lists, DrawFn

class SortedList:
    def __init__(self, values=None):
        if values is None:
            values = []
        self.values = sorted(values)

    def insert(self, value):
        values = self.values.copy()
        i = 0
        while i < len(values) \
              and values[i] < value:
            i += 1
        values.insert(i, value)
        return SortedList(values)

    def delete(self, value):
        values = self.values.copy()
        v = self.find(value)
        if v != -1:
            values.pop(v)
        return SortedList(values)

    def last(self):
        return self.values[-1]
    
    def first(self):
        return self.values[0]

    def find(self, value) -> int:
        left = 0
        right = len(self.values) - 1
        while left <= right:
            mid = (left + right) // 2
            if self.values[mid] == value:
                return mid
            elif self.values[mid] < value:
                left = mid + 1
            else:
                right = mid - 1
        return -1

    def is_sorted(self):
        for i in range(1, len(self.values)):
            if self.values[i] < self.values[i - 1]:
                return False
        return True

    def __contains__(self, value):
        return value in self.values
    
    def __eq__(self, other):
        return self.values == other.values

    def __len__(self):
        return len(self.values)
    
@composite
def sorted_lists(draw: DrawFn) -> SortedList:
    values = []

    lower_bound = draw(integers())
    length = draw(integers(min_value=0, max_value=100))
    for _ in range(length):
        value = draw(integers(min_value=lower_bound))
        lower_bound = value
        values.append(value)

    sl = SortedList()
    sl.values = values
    return sl

@given(sorted_lists(), integers())
def test_sorting_validity(sl: SortedList, x: int):
    assert sl.insert(x).is_sorted()
    assert sl.delete(x).is_sorted()

@given(sorted_lists(), integers())
def test_sorting_postcondition(sl: SortedList, x: int):
    assert x in sl.insert(x)

@given(sorted_lists(), integers(), integers())
def test_sorting_metamorphic(sl: SortedList, x: int, y: int):
    assert sl.insert(x).insert(y) == sl.insert(y).insert(x)

@given(...)
@settings(verbosity=Verbosity.verbose)
def test_sorting_model(l: list[int], x: int):
    sl = SortedList(l)
    if len(l) != 0:
        assert sl.last() == max(l), f"{sl.last()} != {max(l)}"
        assert sl.first() == min(l), f"{sl.first()} != {min(l)}"
        assert (sl.find(x) != -1) == (x in l), f"{sl.find(x)} != {x in l}"
    else:
        assert len(sl) == 0

if __name__ == "__main__":
    test_sorting_validity()
    test_sorting_postcondition()
    test_sorting_metamorphic()
    test_sorting_model()