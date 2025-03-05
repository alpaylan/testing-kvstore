
import http.client
from message import Insert, Get, Delete, Select, Message
import json
import sys

def parse_json_and_rest(s: str):
    s = s.strip()  # Remove leading/trailing spaces
    try:
        parsed_value, index = json.JSONDecoder().raw_decode(s)
        rest = s[index:].strip()  # Remaining unparsed part
        return parsed_value, rest
    except json.JSONDecodeError:
        return None, s  # Return original string if not valid JSON


class Client:
    def __init__(self, host, port, prefix=""):
        self.prefix = prefix
        self.host = host
        self.port = port
        self.conn = http.client.HTTPConnection(self.host, self.port)

    def request(self, msg: Message):
        # Add prefix to key
        # important: This is a bug
        if hasattr(msg, "k"):
            msg.k = self.prefix + "_" + msg.k

        payload = msg.serialize()
        self.conn.request("POST", "/", payload)
        resp = self.conn.getresponse()
        return resp.read().decode()

    def close(self):
        self.conn.close()

    def __str__(self):
        return f"Client<{self.prefix}>({self.host}, {self.port})"
        
if __name__ == '__main__':
    prefix = sys.argv[1] if len(sys.argv) > 1 else ""
    c = Client('localhost', 8000, prefix)
    
    while True:
        cmd = input("skv> ")
        typ = None
        if len(cmd.split(" ", 1)) > 0:
            typ = cmd.split(" ", 1)[0].lower()
        
        match typ:
            case ".insert":
                args = cmd.split(" ", 2)
                if len(args) != 3:
                    print("Usage: .insert <key> <value>")
                    continue

                (_, k, v) = args

                c.request(Insert(k=k, v=json.loads(v)))
            
            case ".insertmany":
                args = cmd.split(" ", 1)
                if len(args) != 2:
                    print("Usage: .insertMany <value>+")
                    continue

                (_, v) = args

                documents = []
                while True:
                    doc, v = parse_json_and_rest(v)
                    if doc is None:
                        break
                    documents.append(doc)

                for doc in documents:
                    assert isinstance(doc, dict)
                    for key in doc:
                        c.request(Insert(k=key, v=doc[key]))

            case ".get":
                args = cmd.split(" ", 1)
                if len(args) != 2:
                    print("Usage: .get <key>")
                    continue

                (_, k) = args
                c.request(Get(k=k))

            case ".select":
                args = cmd.split(" ", 1)
                if len(args) != 2:
                    print("Usage: .select <key>")
                    continue

                (_, k) = args
                c.request(Select(k=k))

            case ".delete":
                args = cmd.split(" ", 1)
                if len(args) != 2:
                    print("Usage: .delete <key>")
                    continue

                (_, k) = args
                c.request(Delete(k=k))

            case ".exit":
                c.close()
                break
            case _:
                print(f"Invalid command '{cmd}'")

            
