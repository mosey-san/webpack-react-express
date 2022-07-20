import fs from 'fs';
import http from 'http';
import https from 'https';
import express from 'express';
import config from '../../config/server.config.json';

const privateKey = fs.readFileSync('./sslcert/key.pem', 'utf8');
const certificate = fs.readFileSync('./sslcert/cert.pem', 'utf8');
const credentials = { key: privateKey, cert: certificate };
const app = express();

app.use(express.static('build'));
app.use(express.json());

const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);
httpServer.listen(80, () => {
  console.log('App listening on http');
});
httpsServer.listen(443, () => {
  console.log('App listening on https');
});
