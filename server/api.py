from flask import Flask
from flask_cors import CORS
from flask_restful import reqparse, abort, Api, Resource

app = Flask(__name__)
CORS(app)
api = Api(app)

class get_data(Resource):
    def get(self):
        return {'data': 'Hello World'}

api.add_resource(get_data, '/get_data')

if __name__ == '__main__':
    app.run(debug=True)