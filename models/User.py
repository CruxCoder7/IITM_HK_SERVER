from pydantic import BaseModel,Json

class User(BaseModel):
    id: str
    name:str
    email:str
    password: str
    phone_number: int 
    # transactions: Json


