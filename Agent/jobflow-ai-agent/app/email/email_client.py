from imapclient import IMAPClient
import email
from email.header import decode_header


class EmailClient:

    def __init__(self, host, user, password):
        self.host = host
        self.user = user
        self.password = password

    def fetch_unseen(self):
        with IMAPClient(self.host) as client:
            client.login(self.user, self.password)
            client.select_folder("INBOX")

            messages = client.search(["UNSEEN"])

            emails = []

            for uid in messages:
                raw = client.fetch([uid], ["RFC822"])[uid][b"RFC822"]
                msg = email.message_from_bytes(raw)

                subject = self.decode(msg["Subject"])
                body = self.get_body(msg)

                emails.append({
                    "uid": uid,
                    "subject": subject,
                    "body": body
                })

            return emails

    def decode(self, value):
        if not value:
            return ""
        parts = decode_header(value)
        return "".join(
            str(p[0], p[1] or "utf-8") if isinstance(p[0], bytes) else p[0]
            for p in parts
        )

    def get_body(self, msg):
        if msg.is_multipart():
            for part in msg.walk():
                if part.get_content_type() == "text/plain":
                    return part.get_payload(decode=True).decode(errors="ignore")
        return msg.get_payload(decode=True).decode(errors="ignore")