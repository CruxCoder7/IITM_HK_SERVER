from sqlalchemy import create_engine, Column, Integer, String, MetaData, Table, JSON,text
from sqlalchemy.orm import sessionmaker

# Replace the placeholder with your PostgreSQL credentials and database name
db_url = "postgresql://postgres:Fbfa31eBgDCge2*1dfd2EFB4GGe*e-64@monorail.proxy.rlwy.net:31965/railway"
engine = create_engine(db_url)

# Define a metadata object
metadata = MetaData()

# Define the 'users' table
users_table = Table(
    'users',
    metadata,
    Column('id', Integer, primary_key=True),
    Column('username', String),
    Column('email', String),
    Column('transactions',JSON)
)

# Create the table
metadata.create_all(engine)

# Create a Session
Session = sessionmaker(bind=engine)
session = Session()
# Insert a user
new_user = {'username': 'john_doe', 'email': 'john.doe@example.com','transactions':{'data':[{'msg':'hi1'},{'msg':'hi2'}]}}
# insert_query = users_table.insert().values(new_user)
session.execute(text('drop table users'));
# session.execute(insert_query)
session.commit()

print("User inserted successfully.")
