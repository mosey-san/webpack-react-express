"use strict";

var _fs = _interopRequireDefault(require("fs"));

var _http = _interopRequireDefault(require("http"));

var _https = _interopRequireDefault(require("https"));

var _express = _interopRequireDefault(require("express"));

var _serverConfig = _interopRequireDefault(require("../../config/server.config.json"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const privateKey = _fs.default.readFileSync('./sslcert/key.pem', 'utf8');

const certificate = _fs.default.readFileSync('./sslcert/cert.pem', 'utf8');

const credentials = {
  key: privateKey,
  cert: certificate
};
const app = (0, _express.default)();
app.use(_express.default.static('build'));
app.use(_express.default.json());

const httpServer = _http.default.createServer(app);

const httpsServer = _https.default.createServer(credentials, app);

httpServer.listen(80, () => {
  console.log('App listening on http');
});
httpsServer.listen(443, () => {
  console.log('App listening on https');
});
