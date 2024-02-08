const headers = require('./headers.js');

function errorHandle({ res, message }) {
  res.writeHead(400, headers);
  res.write(
    JSON.stringify({
      success: false,
      message,
    })
  );
  res.end();
}

module.exports = errorHandle;
