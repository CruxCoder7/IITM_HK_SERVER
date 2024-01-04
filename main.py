from fastapi import FastAPI
from models.User import User
from db.models import users_table
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, MetaData
from sqlalchemy.orm import sessionmaker

app = FastAPI()

db_url = "postgresql://postgres:Fbfa31eBgDCge2*1dfd2EFB4GGe*e-64@monorail.proxy.rlwy.net:31965/railway"
engine = create_engine(db_url)

metadata = MetaData()
metadata.create_all(engine)

# Create a Session
Session = sessionmaker(bind=engine)
session = Session()

@app.post('/login')
def login(user:User):
    username = user.name
    ph_no = user.phone_number  
    print(username,ph_no)

@app.post('/register')
def register(user:User):

    db_user = {
        'id':user.id,
        'name':user.name,
        'email':user.email,
        'password':user.password,
        # 'transactions':json.dumps(user.transactions,separators=(',', ':')),
        'phone_number': user.phone_number
    }
    
    insert_query = users_table.insert().values(db_user)
    db_user = session.execute(insert_query)
    session.commit()
    return db_user
    

@app.get('/')
def root():
    return {"msg":"Hi"}