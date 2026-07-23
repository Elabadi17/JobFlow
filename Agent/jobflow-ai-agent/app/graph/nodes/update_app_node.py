from app.services.jobflow_client import JobFlowClient

api = JobFlowClient()


def update_app_node(state):

    print("NODE: update_app_node")
    print("STATE:", state)


    extraction = state.get("extraction")
    company = state.get("company")


    if not extraction:
        return {
            **state,
            "error": "missing_extraction"
        }


    if not company:
        return {
            **state,
            "error": "missing_company"
        }


    position = extraction.get("position")
    status = extraction.get("status")


    app = api.find_application(
        extraction.get("company"),
        position
    )


    if not app:

        result = api.create_application(
            extraction,
            company["id"]
        )


        return {
            **state,
            "result": result,
            "created_from_update": True
        }



    result = api.update_status(
        app["id"],
        status
    )


    return {
        **state,
        "result": result
    }