import os
import http.server
import json
from message import Message, Insert, Get, Delete

class StoreServer(http.server.HTTPServer):
    def __init__(self, server_address, handler_class):
        super().__init__(server_address, handler_class)
        self.store = Store('store')

class StoreHandler(http.server.SimpleHTTPRequestHandler):
    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        msg = self.rfile.read(content_length)
        msg = Message.deserialize(msg)

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
            case _:
                self.send_response(400)
                self.end_headers()
            
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
                    return v.decode('utf-8')
                case _:
                    return v

        for k in self.__items:
            with open(f"{self.__name}/{stringify(k)}", 'w') as f:
                print("stringify(self.__items[k])", stringify(self.__items[k]))
                f.write(json.dumps(stringify(self.__items[k])))

    def load(self) -> None:
        for k in os.listdir(self.__name):
            with open(f"{self.__name}/{k}", 'r') as f:
                self.__items[k] = json.loads(f.read())

    def insert(self, k: bytes, v: bytes) -> None | dict:
        k = k.decode('utf-8')
        v = json.loads(v)
        print("[insert+] self.__items", self.__items)
        
        result = self.__items.get(k)
        self.__items[k] = v

        print("[insert-] self.__items", self.__items)
        return result

    def get(self, k: bytes) -> None | dict:
        k = k.decode('utf-8')

        print("[get+] self.__items", self.__items)
        print("[get+] k", k)
        result = self.__items.get(k)
        print("[get-] self.__items", self.__items)
        return result
    
    def delete(self, k: bytes) -> None | dict:
        k = k.decode('utf-8')

        print("[delete+] self.__items", self.__items)
        result = self.__items.get(k)
        if result is not None:
            del self.__items[k]
        print("[delete-] self.__items", self.__items)
        print("[delete-] result", result)
        return result


        
        