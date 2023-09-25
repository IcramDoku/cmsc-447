from app import Flask, request, jsonify

app = Flask(__name__)

data = []

@app.route('/api/items', methods=['GET', 'POST'])
def items():
    if request.method == 'GET':
        return jsonify(data)
    elif request.method == 'POST':
        item = request.get_json()
        data.append(item)
        return jsonify(item), 201

@app.route('/api/items/<int:id>', methods=['PUT', 'DELETE'])
def item(id):
    if request.method == 'PUT':
        item = request.get_json()
        data[id] = item
        return jsonify(item)
    elif request.method == 'DELETE':
        deleted_item = data.pop(id)
        return jsonify(deleted_item), 204

if __name__ == '__main__':
    app.run(debug=True)
