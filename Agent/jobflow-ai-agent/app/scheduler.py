import datetime
import time
import schedule

from app.services.email_service import EmailService
from app.graph.workflow import graph
from app.services.jobflow_client import JobFlowClient




def check_mail():

    print("=" * 80)
    print("Checking mailbox...")
    reader = EmailService()

    emails = reader.get_unseen_emails()

    print(f"{len(emails)} new email(s)")

    for mail in emails:
        result = graph.invoke({
            "email": f"""
Subject:
{mail['subject']}

{mail['body']}
"""
        })

        print(result)



api = JobFlowClient()


def heartbeat():
    api.send_heartbeat()


schedule.every(10).seconds.do(check_mail)
schedule.every(30).seconds.do(heartbeat)


print("JobFlow AI Agent started")


while True:

    schedule.run_pending()

    time.sleep(1)


