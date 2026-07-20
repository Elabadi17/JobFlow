from app.services.jobflow_client import JobFlowClient

api = JobFlowClient()

def company_node(state):

    extraction = state.get("extraction")

    if not extraction:
        return {**state, "error": "missing_extraction"}

    company_name = extraction.get("company")

    if not company_name:
        return {**state, "error": "missing_company"}

    company = api.find_company(company_name)

    if not company:
        company = api.create_company(company_name)

    # 🔥 IMPORTANT: injecter extraction + company dans state
    return {
        **state,
        "company": company,
        "company_id": company["id"]
    }