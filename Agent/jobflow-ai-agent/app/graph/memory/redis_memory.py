import redis
import hashlib
import json
from datetime import datetime

from app.config import REDIS_DB,REDIS_HOST,REDIS_PORT

class RedisMemory:

    def __init__(self, host=REDIS_HOST, port=REDIS_PORT, db=REDIS_DB):

        self.client = redis.Redis(
            host=host,
            port=port,
            db=db,
            decode_responses=True
        )

    # ---------------------------
    # EMAIL MEMORY
    # ---------------------------

    def _email_key(self, email: str) -> str:

        email_hash = hashlib.sha256(email.encode()).hexdigest()

        return f"email:{email_hash}"

    def is_email_seen(self, email: str) -> bool:

        key = self._email_key(email)

        return self.client.exists(key) == 1

    def mark_email(self, email: str):

        key = self._email_key(email)

        self.client.set(
            key,
            json.dumps({
                "created_at": str(datetime.utcnow())
            })
        )

    # ---------------------------
    # APPLICATION MEMORY
    # ---------------------------

    def _app_key(self, company: str, position: str) -> str:

        raw = f"{company}:{position}"

        return "app:" + hashlib.sha256(raw.encode()).hexdigest()

    def is_application_seen(self, company: str, position: str) -> bool:

        key = self._app_key(company, position)

        return self.client.exists(key) == 1

    def mark_application(self, company: str, position: str):

        key = self._app_key(company, position)

        self.client.set(
            key,
            json.dumps({
                "company": company,
                "position": position,
                "created_at": str(datetime.utcnow())
            })
        )

    # ---------------------------
    # OPTIONAL: DEBUG
    # ---------------------------

    def clear_all(self):

        self.client.flushdb()