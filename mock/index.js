const express = require('express');
const app = express();

const list = require('./list');

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.use('/list', function (req, res) {
  res.json(list);
});

app.listen('8090', () => {
  console.log('mock service is already running...');
  console.log('port：8090');
  console.log('time：' + new Date().toLocaleString());
});
