import time
import threading
import httpx

from app.config import SPRING_URL


def send_heartbeat():

    while True:

        try:

            httpx.post(
                f"{SPRING_URL}/api/agent/heartbeat"
            )

        except Exception as e:
            print(
                "Heartbeat failed",
                e
            )

        time.sleep(10)



def start_heartbeat():

    thread = threading.Thread(
        target=send_heartbeat,
        daemon=True
    )

    thread.start()