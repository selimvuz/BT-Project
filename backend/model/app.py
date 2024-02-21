from main import generate_output
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"])


@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    user_query = data['message']
    response = generate_output(user_query)
    return jsonify({"reply": response})


if __name__ == '__main__':
    app.run(debug=False, port=5000)
