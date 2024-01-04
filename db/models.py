from sqlalchemy import create_engine, Column, Integer, String, MetaData, Table, JSON

metadata = MetaData()

users_table = Table(
    'users',
    metadata,
    Column('id', Integer, primary_key=True),
    Column('name', String),
    Column('email', String),
    Column('password', String),
    # Column('transactions',JSON),
    Column('phone_number',String)
)