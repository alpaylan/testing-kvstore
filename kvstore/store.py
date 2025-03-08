import os
import http.server
import json
import re
from message import Message, Insert, Get, Delete, Select, Startup, Stop, Shutdown


class StoreServer(http.server.HTTPServer):
    def __init__(self, server_address, handler_class):
        super().__init__(server_address, handler_class)
        self.store = Store(".store")
        self.running = True

class StoreHandler(http.server.SimpleHTTPRequestHandler):
    def do_POST(self):
        content_length = int(self.headers["Content-Length"])
        msg = self.rfile.read(content_length)
        msg = Message.deserialize(msg)

        if not self.server.running and not isinstance(msg, Startup):
            self.send_response(503)
            self.end_headers()
            self.wfile.write(b"SERVER IS NOT RUNNING")
            return

        match msg:
            case Insert(k, v):
                v = self.server.store.insert(k, v)
                self.send_response(200)
                self.end_headers()
                if v is not None:
                    self.wfile.write(str(v).encode())
                else:
                    self.wfile.write(b"OK")
            case Get(k):
                v = self.server.store.get(k)
                if v is not None:
                    self.send_response(200)
                    self.end_headers()
                    self.wfile.write(str(v).encode())
                else:
                    self.send_response(404)
                    self.end_headers()
                    self.wfile.write(b"NOT FOUND")
            case Delete(k):
                v = self.server.store.delete(k)
                if v is not None:
                    self.send_response(200)
                    self.end_headers()
                    self.wfile.write(str(v).encode())
                else:
                    self.send_response(404)
                    self.end_headers()
                    self.wfile.write(b"NOT FOUND")
            case Select(k):
                vs = self.server.store.select(k)
                vs = json.dumps(vs)
                self.send_response(200)
                self.end_headers()
                self.wfile.write(vs.encode())
            case Startup():
                self.server.running = True
                self.send_response(200)
                self.end_headers()
                self.wfile.write(b"SERVER STARTED")
            case Stop():
                self.server.running = False
                self.send_response(200)
                self.end_headers()
                self.wfile.write(b"SERVER STOPPED")
            case Shutdown():
                self.send_response(200)
                self.end_headers()
                self.wfile.write(b"SERVER SHUTDOWN")
                self.server.shutdown()
                self.server.server_close()
            case _:
                self.send_response(400)
                self.end_headers()
                self.wfile.write(b"BAD REQUEST")

        self.server.store.save()


class Store:
    def __init__(self, name: str) -> None:
        self.__name = name
        self.__items = {}
        if os.path.exists(self.__name):
            self.load()
        else:
            os.makedirs(self.__name, exist_ok=True)

    def save(self) -> None:
        def stringify(v):
            match v:
                case dict():
                    return {k: stringify(v) for k, v in v.items()}
                case list():
                    return [stringify(v) for v in v]
                case bytes():
                    return v.decode("utf-8")
                case _:
                    return v

        for k in self.__items:
            with open(f"{self.__name}/{stringify(k)}", "w") as f:
                f.write(json.dumps(stringify(self.__items[k])))

    def load(self) -> None:
        for k in os.listdir(self.__name):
            with open(f"{self.__name}/{k}", "r") as f:
                self.__items[k] = json.loads(f.read())

    def insert(self, k: str, v: dict) -> None | dict:

        result = self.__items.get(k)
        self.__items[k] = v

        return result

    def get(self, k: str) -> None | dict:
        return self.__items.get(k)

    def select(self, k: str) -> list[dict]:
        k = re.compile(k)
        result = []
        for key in self.__items:
            if k.match(key):
                result.append({key: self.__items[key]})
        return result

    def delete(self, k: str) -> None | dict:
        result = self.__items.get(k)

        if result is not None:
            del self.__items[k]

        return result
