from flask import Flask,request
import pickle
import numpy as np
from pickles import get_food_clusters,get_grocery,get_misc,get_shopping,get_travel

app = Flask(__name__)

amt_cluster_model = ""
with open(r"C:\Programming\iitm-server\py_server\models\amount_clusters.pkl",'rb') as f:
    amt_cluster_model = pickle.load(f)


amnt_cluster_mapping = {
    0: 'high',
    1: 'low'
}

@app.route('/', methods=['GET', 'POST'])
def home():
    return {'msg': 'hello'}

@app.route('/detect',methods=['GET','POST'])
def detect():
    data = request.get_json()
    mean = data['mean']        
    print(data)
    user_classification = amt_cluster_model.predict([[mean]])
    print(user_classification)

    if(user_classification[0] == 0):
        return {'data':1}
    else:
        return {'data':0}

models = {
    'food_dining': get_food_clusters(),
    'grocery': get_grocery(),
    'misc': get_misc(),
    'shopping': get_shopping(),
    'travel': get_travel(),
    'gas_transport': '',
    'grocery': '',
    'health_fitness': '',
    'home': '',
    'kids_pets': '',
    'personal_care': ''
}


@app.route('/transaction',methods=['GET',"POST"])
def transaction():
    data = request.get_json()
    time = data['time']
    transId = data['transId']
    accNum = data['accNum']
    amount = data['amount']
    category = data['category']
    city = data['city']
    user = data['user']

    transactions = user['transactions']['data']
    amt = []
    for i in transactions:
        amt.append(i['amount'])
    sum = 0
    print(amt)
    for i in amt:
        sum+=float(i)
        
    mean = sum/len(amt)
    print(mean)
    print(category)
    print(models[category])
    cluster = models[category].predict([[np.log(mean)]])
    print(cluster)
    forest_model = ""

    # if cluster[0] == 0:
    #     with open(r'C:\Programming\iitm-server\py_server\models\amount_by_food_dining\segment_1_iForest.pkl','rb') as f:
    #         forest_model = pickle.load(f)
    # else:
    #     with open(r'C:\Programming\iitm-server\py_server\models\amount_by_food_dining\segment_0_iForest.pkl','rb') as f:
    #         forest_model = pickle.load(f)

    # response = forest_model.predict([[np.log(amount)]])

    return {"msg":'sdg'}

if __name__ == "__main__":
    app.run(port=5555, debug=True, threaded=True)