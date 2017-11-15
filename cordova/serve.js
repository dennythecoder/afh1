
let path = require('path');
let express = require('./node_modules/express');

let app = express();

let staticPath = path.join(__dirname, '/www');
app.use(express.static(staticPath));

app.listen(3000);