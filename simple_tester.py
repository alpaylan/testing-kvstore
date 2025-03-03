
from client import Client
from message import Insert
from threading import Thread

def client(prefix: str, n: int):
    c = Client('localhost', 8000, prefix)
    
    for i in range(n):
        c.request(Insert(k=str(i), v=i))
    
    c.close()


if __name__ == '__main__':
    threads = []
    for i in range(8):
        threads.append(Thread(target=client, args=(f"c{i}", 100)).start())
    
    for t in threads:
        t.join()

    print("Done")