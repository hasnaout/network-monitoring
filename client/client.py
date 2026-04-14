import requests
import socket
import time
import datetime   


URL = "http://127.0.0.1:8000/heartbeat"

def get_info():
    return {
        "pcName": socket.gethostname(),
        "ip": socket.gethostbyname(socket.gethostname()),
        "user": "test_user",
        "timestamp": str(datetime.datetime.now())
    }

while True:
    data = get_info()
    try:
        res = requests.post(URL, json=data)
        print("Sent:", res.json())
    except Exception as e:
        print("Error:", e)

    time.sleep(30)