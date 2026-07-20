from pydantic import BaseModel


class MailExtraction(
    BaseModel
):

    action:str

    company:str|None

    position:str|None

    status:str|None