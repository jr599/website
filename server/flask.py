from flask import Flask, jsonify
app = Flask(__name__)

@app.route('/flask', methods=['GET'])
def get_bitcoin_price():
    price = fetch_bitcoin_price()
    return jsonify({"price": price})

if __name__ == '__main__':
    app.run(port=5000)