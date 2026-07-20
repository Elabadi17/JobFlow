import os
import httpx



from app.config import SPRING_URL,SPRING_TOKEN

class SpringAPI:

    def __init__(self):

        self.client = httpx.Client(
            headers={
                "Authorization": f"Bearer {SPRING_TOKEN}",
                "Content-Type": "application/json"
            }
        )

    # --------------------
    # COMPANIES
    # --------------------

    def create_company(self, name):

        return self.client.post(
            f"{SPRING_URL}/api/companies",
            json={"name": name}
        ).json()

    def get_companies(self):

        return self.client.get(
            f"{SPRING_URL}/api/companies"
        ).json()

    # --------------------
    # APPLICATIONS
    # --------------------

    def create_application(self, company_id, position):

        return self.client.post(
            f"{SPRING_URL}/api/applications",
            json={
                "companyId": company_id,
                "position": position,
                "status": "APPLIED",
                "notes": "created by AI agent",
                "cvId": "default-cv",
                "salaryMin": None,
                "salaryMax": None
            }
        ).json()

    def update_status(self, app_id, status):

        return self.client.patch(
            f"{SPRING_URL}/api/applications/{app_id}/status",
            params={"status": status}
        ).json()

    def get_user_applications(self):

        return self.client.get(
            f"{SPRING_URL}/api/applications/user"
        ).json()