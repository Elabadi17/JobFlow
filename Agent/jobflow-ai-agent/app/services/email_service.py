import imaplib
import email

from app.config import (
    EMAIL_HOST,
    EMAIL_PORT,
    EMAIL_USER,
    EMAIL_PASSWORD
)


class EmailService:

    def __init__(self):

        self.mail = imaplib.IMAP4_SSL(
            EMAIL_HOST,
            EMAIL_PORT
        )

        self.mail.login(
            EMAIL_USER,
            EMAIL_PASSWORD
        )

        self.mail.select("INBOX")

    def get_unseen_emails(self):

        status, messages = self.mail.search(
            None,
            "UNSEEN"
        )

        emails = []

        for num in messages[0].split():

            status, data = self.mail.fetch(
                num,
                "(RFC822)"
            )

            raw_email = data[0][1]

            msg = email.message_from_bytes(
                raw_email
            )

            subject = msg["Subject"]

            body = ""

            if msg.is_multipart():

                for part in msg.walk():

                    if (
                        part.get_content_type()
                        ==
                        "text/plain"
                    ):

                        body = (
                            part.get_payload(decode=True)
                            .decode()
                        )

                        break

            else:

                body = (
                    msg.get_payload(decode=True)
                    .decode()
                )

            emails.append({

                "id": num.decode(),

                "subject": subject,

                "body": body

            })

        return emails