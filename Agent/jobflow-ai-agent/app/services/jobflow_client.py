import os
import httpx


from app.config import SPRING_URL,JOBFLOW_EMAIL,JOBFLOW_PASSWORD,DEFAULT_CV_ID


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
                "Authorization":
                f"Bearer {self.token}"
            }
        )

    def find_company(self, name):

        page = self.client.get(
            f"{SPRING_URL}/api/companies"
        ).json()

        for c in page["content"]:

            if c["name"].lower() == name.lower():

                return c

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
    

    def create_application(
            self,
            extraction,
            company_id
    ):

        response = self.client.post(

            f"{SPRING_URL}/api/applications",

            json={

                "position":
                    extraction["position"],

                "status":
                    extraction["status"],

                "notes":
                    "Created automatically from email",

                "companyId":
                    company_id,

                "salaryMin":
                    None,

                "salaryMax":
                    None,

                "cvId":
                    DEFAULT_CV_ID
            }
        )

        response.raise_for_status()

        return response.json()
    
    def find_application(
            self,
            company_name,
            position
    ):

        page = self.client.get(
            f"{SPRING_URL}/api/applications/user"
        ).json()
        print(page)
        for app in page["content"]:

            same_company = (
                app["companyName"].lower()
                ==
                company_name.lower()
            )

            same_position = (
                app["position"]
                .lower()
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