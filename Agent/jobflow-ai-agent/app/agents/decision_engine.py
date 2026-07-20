from app.services.jobflow_client import JobFlowClient


class DecisionEngine:

    def __init__(self):

        self.api = JobFlowClient()

    def process(
        self,
        extraction
    ):
        print(extraction)
        company = self.api.find_company(
            extraction["company"]
        )

        if not company:

            company = (
                self.api
                .create_company(
                    extraction["company"]
                )
            )

        if (
            extraction["action"]
            ==
            "CREATE_JOB_APPLICATION"
        ):

            return (
                self.api
                .create_application(
                    extraction,
                    company["id"]
                )
            )

        app = self.api.find_application(

            extraction["company"],

            extraction["position"]
        )

        if not app:

            return {

                "error":
                "application not found"
            }

        return (
            self.api
            .update_status(
                app["id"],
                extraction["status"]
            )
        )