const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const axios = require('axios');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Serve static files
app.use('/js', express.static(path.join(__dirname)));
app.use('/css', express.static(path.join(__dirname, '../css')));

// Serve your HTML file at the root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

io.on('connection', (socket) => {
  console.log('New client connected');

  setInterval(async () => {
    const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
    const price = response.data.bitcoin.usd;
    socket.emit('updatePrice', price);
  }, 5000); // Update every 5 seconds

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

server.listen(4000, () => {
  console.log('Server running on port 4000');
});