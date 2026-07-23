from app.services.email_service import EmailService

from app.graph.workflow import graph

from app.scheduler import *

from app.services.jobflow_client import *

reader = EmailService()

emails = reader.get_unseen_emails()

api = JobFlowClient()


api.start_heartbeat()

for mail in emails:

    print("=" * 80)

    print(mail["subject"])

    result = graph.invoke({

        "email":

        f"""
Subject:
{mail['subject']}

{mail['body']}
"""

    })

    print(result)