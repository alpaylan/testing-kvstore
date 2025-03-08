from hypothesis import given, settings, Verbosity
from kvstore.message import Message, Startup, Stop, Select
from kvstore.trace import Trace, MyServer
from kvstore.test_trace import traces
from kvstore.client import Client

import datetime
import subprocess
import json

def check_isolation(result: str, client: Client, message: Message):
    match message:
        case Select(k):
            try:
                result = json.loads(result)
            except Exception as e:
                print(f"could not load '{result}' due to '{e}'")
            if isinstance(result, list):
                for obj in result:
                    key: str = next(iter(obj))
                    prefix = key[: key.find("_")]
                    assert prefix == client.prefix, f"select({k}) leaks data from client '{prefix}' to '{client.prefix}'"
        case _:
            pass

def execute(trace: Trace):
    admin = Client("localhost", 8000, "admin")
    server = MyServer()
    server.start()

    for interaction in trace:
        match interaction:
            case ("startup",):
                print("Starting up server")
                admin.request(Startup())
            case ("stop",):
                print("Stopping server")
                admin.request(Stop())
            case ("shutdown",):
                print("Shutting down server")
                server.stop()
            case ("message", client, message):
                result = client.request(message)
                check_isolation(result, client, message)

    # delete the store
    subprocess.run("rm -rf store/*", shell=True)


@given(traces())
@settings(deadline=datetime.timedelta(milliseconds=5000), verbosity=Verbosity.verbose)
def test_isolation(trace: Trace) -> None:
    execute(trace)


if __name__ == "__main__":
    test_isolation()
    print("Done")
