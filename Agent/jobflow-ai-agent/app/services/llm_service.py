import os
import requests

from app.config import LLM_MODEL,NVIDIA_API_KEY,NVIDIA_URL 


class LLMService:

    def invoke(
        self,
        prompt: str
    ):

        payload = {

            "model": LLM_MODEL,

            "messages": [
                {
                    "role": "user",
                    "content": prompt
                }
            ],

            "max_tokens": 1000,

            "temperature": 0.1,

            "stream": False
        }

        headers = {
            "Authorization": f"Bearer {NVIDIA_API_KEY}"
        }

        response = requests.post(
            NVIDIA_URL,
            json=payload,
            headers=headers,
            timeout=30
        )

        response.raise_for_status()

        return (
            response
            .json()
            ["choices"][0]
            ["message"]
            ["content"]
        )