from abc import ABC, abstractmethod
from typing import Literal
import json

type msg_typ = Literal["null", "string", "number", "object"]


def serialize(typ: msg_typ, data: str | dict) -> bytes:
    msg = b""

    match typ:
        case "null":
            msg += "$-1\r\n".encode()
        case "string":
            msg += f"${len(data)}\r\n{data}\r\n".encode()
        case "number":
            msg += f":{data}\r\n".encode()
        case "boolean":
            msg += f"|{'true' if data else 'false'}\r\n".encode()
        case "object":
            msg += f"*{len(data)}\r\n".encode()
            for key, value in data.items():
                msg += serialize("string", key)
                match value:
                    case str():
                        msg += serialize("string", value)
                    case True | False:
                        msg += serialize("boolean", value)
                    case int():
                        msg += serialize("number", value)
                    case dict():
                        msg += serialize("object", value)
                    case None:
                        msg += serialize("null", value)
                    case _:
                        raise ValueError(f"Unsupported value type: {type(value)}")
        case _:
            raise ValueError(f"Unsupported type: {typ}")
    return msg


def deserialize(data: bytes) -> None | tuple[msg_typ, str, bytes]:
    # check the first character to determine the type
    if len(data) == 0:
        return None

    typ = data[0:1].decode()
    match typ:
        case "$":
            # string
            length_end = data.find(b"\r\n")
            length = int(data[1:length_end])
            if length == -1:
                return ("null", None, data[length_end + 2 :])
            end = length_end + 2 + length
            return ("string", data[length_end + 2 : end].decode(), data[end + 2 :])
        case ":":
            # number
            end = data.find(b"\r\n")
            num = int(data[1:end].decode())
            return ("number", num, data[end + 2 :])
        case "|":
            # boolean
            end = data.find(b"\r\n")
            boolean = data[1:end].decode() == "true"
            return ("boolean", boolean, data[end + 2 :])
        case "*":
            # object
            length_end = data.find(b"\r\n")
            length = int(data[1:length_end])
            end = length_end + 2
            obj = {}
            data = data[end:]

            while length > 0:
                typ, key, data = deserialize(data)
                end += len(data)
                typ, value, data = deserialize(data)
                obj[key] = value
                length -= 1
            return ("object", obj, data)
        case _:
            raise ValueError(f"Unsupported type: {typ}")


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
        msg = b""
        for typ, data in parts:
            msg += serialize(typ, data)
        return msg

    @staticmethod
    def deserialize(data: bytes) -> "Message":
        parts = []
        rest = data
        while len(rest) > 0:
            typ, data, rest = deserialize(rest)
            parts.append((typ, data))

        message_classes = {
            "insert": Insert,
            "get": Get,
            "delete": Delete,
            "select": Select,
            "startup": Startup,
            "stop": Stop,
            "shutdown": Shutdown,
        }

        cls = message_classes[parts[0][1]]

        return cls.from_parts(parts)

    """
    # Serialization Bug:
    # The serialization/deserialization scheme is pretty fragile.
    # - Empty messages fail
    # - Messages with leading newlines fail
    # - Messages with double newlines in the middle fail

    def serialize(self) -> bytes:
        parts = self.parts()
        return b"\n\n".join(
            f"{typ}\r\n{data}".encode()
            for typ, data in parts
        )

    @staticmethod
    def deserialize(data: bytes) -> "Message":
        # This is a buggy method, if the string starts with `\n` or it
        # contains `\n\n` in the middle it will not work as expected
        def de(typ: msg_typ, data: bytes) -> str | int | bool | dict:
            match typ:
                case b'null':
                    return None
                case b'string':
                    return data.decode()
                case b'number':
                    return int(data)
                case b'boolean':
                    return data.decode() == "True"
                case b'object':
                    return eval(data)
                case _:
                    raise ValueError(f"Unsupported type: {typ}")
        parts = [
            (typ, de(typ, data))
            for typ, data in (
                part.split(b"\r\n", 1)
                for part in data.split(b"\n\n")
            )
        ]
        message_classes = {
            "insert": Insert,
            "get": Get,
            "delete": Delete,
            "select": Select,
            "startup": Startup,
            "stop": Stop,
            "shutdown": Shutdown,
        }

        cls = message_classes[parts[0][1]]

        return cls.from_parts(parts)
    """

    def __repr__(self) -> str:
        return f"{self.__class__.__name__}({', '.join(f'{k}={repr(v)}' for k, v in self.__dict__.items())})"

    def __eq__(self, other: object) -> bool:
        return isinstance(other, self.__class__) and self.__dict__ == other.__dict__


def type_(v: object) -> msg_typ:
    if v is None:
        return "null"
    if isinstance(v, str):
        return "string"
    if v is True or v is False:
        return "boolean"
    if isinstance(v, int):
        return "number"
    if isinstance(v, dict):
        return "object"
    raise ValueError(f"Unsupported type: {type(v)}")

class Insert(Message):
    __match_args__ = ("k", "v")

    def __init__(self, **kwargs) -> None:
        self.k = kwargs["k"]
        self.v = kwargs["v"]

    def parts(self) -> list[tuple[msg_typ, str | int | bool | dict]]:
        return [
            ("string", "insert"),
            ("string", self.k),
            (type_(self.v), self.v),
        ]

    def from_parts(parts: list[tuple[msg_typ, str]]) -> "Insert":
        assert parts[0][1] == "insert"
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
        assert parts[0][1] == "get"
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
        assert parts[0][1] == "delete"
        return Delete(k=parts[1][1])


class Select(Message):
    __match_args__ = ("k",)

    def __init__(self, **kwargs) -> None:
        self.k = kwargs["k"]

    def parts(self) -> list[tuple[msg_typ, str]]:
        return [
            ("string", "select"),
            ("string", self.k),
        ]

    def from_parts(parts: list[tuple[msg_typ, str]]) -> "Select":
        assert parts[0][1] == "select"
        return Select(k=parts[1][1])


class Startup(Message):
    def parts(self) -> list[tuple[msg_typ, str]]:
        return [("string", "startup")]

    def from_parts(parts: list[tuple[msg_typ, str]]) -> "Startup":
        assert parts[0][1] == "startup"
        return Startup()


class Stop(Message):
    def parts(self) -> list[tuple[msg_typ, str]]:
        return [("string", "stop")]

    def from_parts(parts: list[tuple[msg_typ, str]]) -> "Stop":
        assert parts[0][1] == "stop"
        return Stop()


class Shutdown(Message):
    def parts(self) -> list[tuple[msg_typ, str]]:
        return [("string", "shutdown")]

    def from_parts(parts: list[tuple[msg_typ, str]]) -> "Shutdown":
        assert parts[0][1] == "shutdown"
        return Shutdown()


if __name__ == "__main__":
    msg = Insert(k="foo", v={"bar": 42})
    print(msg)
    print(msg.serialize())
    print(Message.deserialize(msg.serialize()))

    msg = Get(k="foo")
    print(msg)
    print(msg.serialize())
    print(Message.deserialize(msg.serialize()))

    msg = Delete(k="foo")
    print(msg)
    print(msg.serialize())
    print(Message.deserialize(msg.serialize()))

    msg = Insert(k="", v="")
    print(msg)
    print(msg.serialize())
    print(Message.deserialize(msg.serialize()))

    msg = Select(k="fo\n\no")
    print(msg)
    print(msg.serialize())
    print(Message.deserialize(msg.serialize()))
