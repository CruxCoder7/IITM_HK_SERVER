import pickle

def get_food_clusters():
    with open(r"C:\Programming\iitm-server\py_server\models\amount_by_food_dining\clusters.pkl",'rb') as f:
        model = pickle.load(f)
        return model

def get_grocery():
    model = ""
    with open(r"C:\Programming\iitm-server\py_server\models\amount_by_grocery\clusters.pkl",'rb') as f:
        model = pickle.load(f)
    return model

def get_misc():
    model = ""
    with open(r"C:\Programming\iitm-server\py_server\models\amount_by_misc\clusters.pkl",'rb') as f:
        model = pickle.load(f)
    return model
    
def get_shopping():
    model = ""
    with open(r"C:\Programming\iitm-server\py_server\models\amount_by_shopping\clusters.pkl",'rb') as f:
        model = pickle.load(f)
    return model    
def get_travel():
    model = ""
    with open(r"C:\Programming\iitm-server\py_server\models\amount_by_travel\clusters.pkl",'rb') as f:
        model = pickle.load(f)
    return model    