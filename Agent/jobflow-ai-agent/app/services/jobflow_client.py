import httpx

from app.config import SPRING_URL, JOBFLOW_EMAIL, JOBFLOW_PASSWORD

import time
import threading

class JobFlowClient:

    def __init__(self):
        self.client = httpx.Client()
        self.token = None
        self.login()


    def login(self):

        response = self.client.post(
            f"{SPRING_URL}/api/auth/login",
            json={
                "email": JOBFLOW_EMAIL,
                "password": JOBFLOW_PASSWORD
            }
        )

        response.raise_for_status()

        data = response.json()

        self.token = data["token"]

        self.client.headers.update(
            {
                "Authorization": f"Bearer {self.token}"
            }
        )


    # --------------------
    # COMPANIES
    # --------------------

    def find_company(self, name):

        page = self.client.get(
            f"{SPRING_URL}/api/companies"
        ).json()


        for company in page["content"]:

            if company["name"].lower() == name.lower():
                return company


        return None



    def create_company(self, name):

        response = self.client.post(
            f"{SPRING_URL}/api/companies",
            json={
                "name": name,
                "website": None,
                "location": None
            }
        )

        response.raise_for_status()

        return response.json()



    # --------------------
    # APPLICATIONS
    # --------------------

    def create_application(
            self,
            extraction,
            company_id
    ):

        response = self.client.post(
            f"{SPRING_URL}/api/applications",
            json={

                "position": extraction["position"],

                "status": extraction["status"],

                "notes": "Created automatically from email",

                "companyId": company_id,

                "salaryMin": None,

                "salaryMax": None
            }
        )

        response.raise_for_status()

        return response.json()



    def find_application(
            self,
            company_name,
            position
    ):

        response = self.client.get(
            f"{SPRING_URL}/api/applications/user"
        )

        response.raise_for_status()

        page = response.json()


        for app in page["content"]:

            company = app.get("company")


            if not company:
                continue


            same_company = (
                company["name"].lower()
                ==
                company_name.lower()
            )


            same_position = (
                app["position"].lower()
                ==
                position.lower()
            )


            if same_company and same_position:
                return app


        return None



    def update_status(
            self,
            app_id,
            status
    ):

        response = self.client.patch(
            f"{SPRING_URL}/api/applications/{app_id}/status",
            params={
                "status": status
            }
        )

        response.raise_for_status()

        return response.json()




    def send_heartbeat(self):

        while True:

            try:

                response = self.client.post(
                    f"{SPRING_URL}/api/agent/heartbeat"
                )

                response.raise_for_status()

                print("Agent heartbeat sent")

            except Exception as e:

                print(
                    "Heartbeat failed:",
                    e
                )

            time.sleep(10)

    def start_heartbeat(self):

        thread = threading.Thread(
            target=self.send_heartbeat,
            daemon=True
        )

        thread.start()