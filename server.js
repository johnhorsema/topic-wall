var express = require('express')
var path = require('path')
var app = express()

app.set('port', (process.env.PORT || 8000));

app.use(express.static(path.join(__dirname)));
app.get('/tnc', function (req, res) {
    res.sendFile(path.join(__dirname, '/tnc.html'));
});
app.get('/privacy', function (req, res) {
    res.sendFile(path.join(__dirname, '/privacy.html'));
});
app.get('/[-a-z0-9]+/', function (req, res) {
    res.sendFile(path.join(__dirname, '/index.html'));
});
app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, '/404.html'));
});

app.listen(app.get('port'), function () {
  console.log('Topic Wall listening on port '+app.get('port')+'.')
});