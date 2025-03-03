import store
import os

if __name__ == '__main__':
    s = store.Store('store')
    httpd = store.StoreServer(('localhost', 8000), store.StoreHandler)
    httpd.serve_forever()

    
