from app.services.jobflow_client import JobFlowClient

api = JobFlowClient()

def create_app_node(state):


    extraction = state.get("extraction")
    company = state.get("company")

    if not extraction:
        return {**state, "error": "missing_extraction"}

    if not company:
        return {**state, "error": "missing_company"}

    result = api.create_application(
        extraction,
        company["id"]
    )

    return {
        **state,
        "result": result
    }