const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const fs = require('fs');
const http = require('http');
const https = require('https');
const bodyParser = require('body-parser')
const nets = require('os').networkInterfaces()
const credentials = {}

// Certificate
if (process.argv[2] == undefined || process.argv[2] != '-dev') {
  const privateKey = fs.readFileSync('/etc/letsencrypt/live/netshoes-marketplaces.webstore.net.br/privkey.pem', 'utf8');
  const certificate = fs.readFileSync('/etc/letsencrypt/live/netshoes-marketplaces.webstore.net.br/cert.pem', 'utf8');
  const ca = fs.readFileSync('/etc/letsencrypt/live/netshoes-marketplaces.webstore.net.br/chain.pem', 'utf8');
  
  credentials['key'] = privateKey
  credentials['cert'] = certificate
  credentials['ca'] = ca
}

/* Global Variables */
global.axios 	  = require('axios')
global.baseurl 	= 'http://api-sandbox.netshoes.com.br'
if (process.argv[2] == undefined || process.argv[2] != '-dev') {
  global.host 	  = 'https://netshoes-marketplaces.webstore.net.br'
} else {
  global.host 	  = `http://${nets['Ethernet'][1].address}:3000/`
}

const app = express()
app.use(express.static(__dirname, { dotfiles: 'allow' } ));

app.use(morgan('dev'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.json())
app.use(cors())

// Include Routas
fs.readdirSync(__dirname + '/routes/').forEach(file => { app.use(require(__dirname + '/routes/'+file)) });

app.use((error, req, res, next) => {
  return res.status(400).json({'sucesso': false, 'mensagem': error.toString() });
});

// Starting both http & https servers
if (process.argv[2] == undefined || process.argv[2] != '-dev') {
  const httpServer = http.createServer(app);

  httpServer.listen(80, console.log('HTTP Server running on port 80'))

  const httpsServer = https.createServer(credentials, app);

  httpsServer.listen(443, console.log('HTTPS Server running on port 443'))
} else {
  const httpServer = http.createServer(app);

  httpServer.listen(3000, console.log(`HTTP Server running on http://${nets['Ethernet'][1].address}:3000`))
}