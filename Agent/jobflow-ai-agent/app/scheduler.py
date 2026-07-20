import time
import schedule

from app.services.email_service import EmailService
from app.graph.workflow import graph


def check_mail():

    print("=" * 80)
    print("Checking mailbox...")

    reader = EmailService()

    emails = reader.get_unseen_emails()

    print(f"{len(emails)} new email(s)")

    for mail in emails:

        print("-" * 80)
        print(mail["subject"])

        result = graph.invoke({

            "email": f"""
Subject:
{mail['subject']}

{mail['body']}
"""

        })

        print(result)

    print("Done.")


# Tous les jours à 09:00
schedule.every(10).seconds.do(check_mail)

print("JobFlow AI Agent started.")

while True:

    schedule.run_pending()

    time.sleep(1)