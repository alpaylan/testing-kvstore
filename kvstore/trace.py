from typing import Literal
from message import Message, Insert, Startup, Stop
from client import Client
from store import StoreServer, StoreHandler
from threading import Thread
import subprocess
import os
import signal
type ServerInteraction = tuple[Literal["startup", "stop", "shutdown"]]
type ClientInteraction = tuple[Literal["message"], Client, Message]

type Interaction = ServerInteraction | ClientInteraction

type Trace = list[Interaction]


# Find process using port 8000
def kill_old_server(port=8000):
    try:
        output = subprocess.check_output(f"lsof -t -i:{port}", shell=True, text=True)
        for pid in output.strip().split("\n"):
            os.kill(int(pid), signal.SIGTERM)
        print(f"Killed previous server on port {port}")
    except subprocess.CalledProcessError:
        pass  # No process was using the port


class MyServer:
    def __init__(self, host="localhost", port=8000):
        kill_old_server(port)
        self.server = StoreServer((host, port), StoreHandler)
        self.thread = Thread(target=self.server.serve_forever)
        self.thread.daemon = True  # Stops when main program exits

    def start(self):
        print(f"Starting server on {self.server.server_address}")
        self.thread.start()

    def stop(self):
        print("Stopping server...")
        self.server.shutdown()  # Gracefully stops the server
        self.server.server_close()  # Closes socket
        self.thread.join()
        print("Server stopped.")


def server_thread():
    server = StoreServer(("localhost", 8000), StoreHandler)
    server.serve_forever()

def client_thread(prefix: str, n: int):
    c = Client("localhost", 8000, prefix)

    for i in range(n):
        c.request(Insert(k=str(i), v=i))

    c.close()

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
                client.request(message)


    # delete the store
    subprocess.run("rm -rf store/*", shell=True)


if __name__ == "__main__":
    trace: Trace = [
        ("startup",),
        ("message", Client("localhost", 8000, "c1"), Insert(k="1", v=1)),
        ("message", Client("localhost", 8000, "c2"), Insert(k="2", v=2)),
        ("message", Client("localhost", 8000, "c3"), Insert(k="3", v=3)),
        ("shutdown",),
    ]
    execute(trace)
    print("Done")
