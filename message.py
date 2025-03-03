from abc import ABC, abstractmethod
from typing import Literal
import json

type msg_typ = Literal["string"] | Literal["number"] | Literal["object"]

class Message(ABC):
    @abstractmethod
    def parts(self) -> list[tuple[msg_typ, str]]:
        pass

    @staticmethod
    @abstractmethod
    def from_parts(parts: list[tuple[msg_typ, str]]) -> "Message":
        pass

    def serialize(self) -> bytes:
        parts = self.parts()
        return b"\n\n".join(
            f"{typ}\r\n{data}".encode()
            for typ, data in parts
        )

    @staticmethod
    def deserialize(data: bytes) -> "Message":
        parts = [
            (typ, data)
            for typ, data in (
                part.split(b"\r\n", 1)
                for part in data.split(b"\n\n")
            )
        ]
        message_classes = {
            "insert": Insert,
            "get": Get,
            "delete": Delete,
        }

        cls = message_classes[parts[0][1].decode()]

        return cls.from_parts(parts)


class Insert(Message):
    __match_args__ = ("k", "v")
    def __init__(self, **kwargs) -> None:
        self.k = kwargs["k"]
        self.v = kwargs["v"]

    def parts(self) -> list[tuple[msg_typ, str]]:
        return [
            ("string", "insert"),
            ("string", self.k),
            ("object", json.dumps(self.v)),
        ]

    def from_parts(parts: list[tuple[msg_typ, str]]) -> "Insert":
        print(parts)
        assert parts[0][1] == b"insert"
        return Insert(k=parts[1][1], v=parts[2][1])

class Get(Message):
    __match_args__ = ("k",)

    def __init__(self, **kwargs) -> None:
        self.k = kwargs["k"]

    def parts(self) -> list[tuple[msg_typ, str]]:
        return [
            ("string", "get"),
            ("string", self.k),
        ]

    def from_parts(parts: list[tuple[msg_typ, str]]) -> "Get":
        assert parts[0][1] == b"get"
        return Get(k=parts[1][1])

class Delete(Message):
    __match_args__ = ("k",)

    def __init__(self, **kwargs) -> None:
        self.k = kwargs["k"]

    def parts(self) -> list[tuple[msg_typ, str]]:
        return [
            ("string", "delete"),
            ("string", self.k),
        ]

    def from_parts(parts: list[tuple[msg_typ, str]]) -> "Delete":
        assert parts[0][1] == b"delete"
        return Delete(k=parts[1][1])

if __name__ == "__main__":
    msg = Insert("foo", {"bar": 42})
    print(msg.serialize())
    print(Message.deserialize(msg.serialize()))

    msg = Get("foo")
    print(msg.serialize())
    print(Message.deserialize(msg.serialize()))

    msg = Delete("foo")
    print(msg.serialize())
    print(Message.deserialize(msg.serialize()))