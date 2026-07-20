import json

from app.services.llm_service import LLMService
from app.prompts.extraction_prompt import PROMPT
from app.agents.decision_engine import DecisionEngine


class MailAgent:

    def __init__(self):

        self.llm = LLMService()

        self.engine = DecisionEngine()

    def extract(
        self,
        email
    ):

        result = (
            self.llm
            .invoke(
                PROMPT.format(
                    email=email
                )
            )
            .strip()
        )

        if result.startswith("```"):

            result = (
                result
                .removeprefix("```json")
                .removeprefix("```")
            )

            result = (
                result
                .removesuffix("```")
                .strip()
            )

        return json.loads(
            result
        )

    def process(
        self,
        email
    ):

        extraction = self.extract(
            email
        )

        print("\nEXTRACTION:")
        print(extraction)

        result = (
            self.engine
            .process(
                extraction
            )
        )

        return {
            "extraction": extraction,
            "jobflow_result": result
        }