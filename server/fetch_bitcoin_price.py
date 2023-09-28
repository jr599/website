import yfinance as yf

def fetch_bitcoin_price():
    bitcoin = yf.Ticker("BTC-USD")
    current_price = bitcoin.history(period="1d")['Close'][0]
    return current_price