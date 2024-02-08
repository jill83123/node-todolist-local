const headers = require('./headers.js');

function successHandle({ res, ...args }) {
  res.writeHead(200, headers);
  res.write(
    JSON.stringify({
      success: true,
      ...args,
    })
  );
  res.end();
}

module.exports = successHandle;
