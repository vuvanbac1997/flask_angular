from flask import Flask,flash,render_template,redirect
from flask_pymongo import PyMongo
from flask_restful import Resource, Api
from bson.objectid import ObjectId
from flask import request
from flask import jsonify
from bson import json_util
from flask import json,make_response,Response

app = Flask(__name__)
api = Api(app)
app.secret_key = 'super secret key'
app.config['SESSION_TYPE'] = 'filesystem'
app.config["MONGO_URI"] = "mongodb://localhost:27017/myDb"
mongo = PyMongo(app)

 # api
 #all article
@app.route('/api/v1/article', methods=['GET'])
def articleAPI():
    data = mongo.db.articles.find()
    result = [doc for doc in data]

    resp = Response(json.dumps({'data': result}, default=json_util.default),
                    mimetype='application/json')
    return make_response(resp)

# Create article
@app.route('/api/v1/article', methods=['POST'])
def createArticleAPI():
    data = request.get_json()
    title = data.get('title')
    content = data.get('content')

    article = {
        "title": title,
        "content": content
    }

    mongo.db.articles.insert_one(article)
    return '1'

# delete article
@app.route('/api/v1/article', methods=['DELETE'])
def deleteArticleAPI():
    # data = request.get_json()
    id = request.args.get('_id')

    mongo.db.articles.delete_one(
        {
            "_id": ObjectId(id)
        }
    )
    return '1'

# update article
@app.route('/api/v1/article', methods=['PUT'])
def updateArticleAPI():
    data = request.get_json()

    id = data.get('_id')
    title = data.get('title')
    content = data.get('content')

    result = mongo.db.articles
    result.update_one(
        {
            '_id': ObjectId(id)
        },
        {
            "$set": {
                'title': title,
                'content': content
            }},

        upsert=False
    )
    return '1'

@app.route('/api/v1/article/edit', methods=['GET'])
def editArticles():
    id = request.args.get('id')
    data = mongo.db.articles.find_one({
        '_id': ObjectId(id)
    })

    resp = Response(json.dumps({'data': data}, default=json_util.default),
                    mimetype='application/json')
    return make_response(resp)

#   Admin
@app.route('/')
def hello_world():
    return render_template('index.html')
