from dotenv import load_dotenv
import os

load_dotenv()

NVIDIA_API_KEY = os.getenv("NVIDIA_API_KEY")
LLM_MODEL = os.getenv("LLM_MODEL")
NVIDIA_URL = os.getenv("NVIDIA_URL")
SPRING_URL = os.getenv("SPRING_URL")

JOBFLOW_EMAIL=os.getenv("JOBFLOW_EMAIL")
JOBFLOW_PASSWORD=os.getenv("JOBFLOW_PASSWORD")


REDIS_HOST=os.getenv("REDIS_HOST")
REDIS_PORT=os.getenv("REDIS_PORT")
REDIS_DB=os.getenv("REDIS_DB")


EMAIL_HOST = os.getenv("EMAIL_HOST")

EMAIL_PORT = int(os.getenv("EMAIL_PORT"))

EMAIL_USER = os.getenv("EMAIL_USER")

EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD")