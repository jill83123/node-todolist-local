const headers = {
  'Content-Type': 'application/json',
  // CORS 標頭設定
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
  'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE',
};

module.exports = headers;
