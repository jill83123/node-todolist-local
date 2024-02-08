const http = require('http');
const { v4: uuidv4 } = require('uuid');

const headers = require('./headers.js');
const successHandle = require('./successHandle.js');
const errorHandle = require('./errorHandle.js');

const todos = [];

const requestListener = (req, res) => {
  let body = '';

  // 組封包，取得完整的 body 資料
  req.on('data', (chunk) => {
    body += chunk;
  });

  // 取得
  if (req.url === '/todos' && req.method === 'GET') {
    successHandle({ res, data: { todos } });
  }

  // 新增
  else if (req.url === '/todos' && req.method === 'POST') {
    req.on('end', () => {
      try {
        const content = JSON.parse(body).content;

        if (content !== undefined) {
          const todo = {
            id: uuidv4(),
            content,
          };

          todos.push(todo);

          successHandle({ res, message: '新增成功', data: { todos } });
        } else {
          errorHandle({ res, message: 'content 為必填欄位' });
        }
      } catch (err) {
        errorHandle({ res, message: '格式錯誤' });
      }
    });
  }

  // 編輯
  else if (req.url.startsWith('/todos/') && req.method === 'PATCH') {
    req.on('end', () => {
      try {
        const id = req.url.split('/').pop();
        const index = todos.findIndex((todo) => todo.id === id);
        const content = JSON.parse(body).content;

        if (content === undefined) {
          errorHandle({ res, message: 'content 為必填欄位' });
        } else if (index === -1) {
          const message = id ? `找不到 id: ${id}` : `id 不得為空`;
          errorHandle({ res, message });
        } else {
          todos[index].content = content;
          successHandle({ res, message: '修改成功', data: { todos } });
        }
      } catch (err) {
        errorHandle({ res, message: '格式錯誤' });
      }
    });
  }

  // 刪除所有
  else if (req.url === '/todos' && req.method === 'DELETE') {
    if (todos.length > 0) {
      todos.length = 0;
      successHandle({ res, message: '已刪除所有資料', data: { todos } });
    } else {
      errorHandle({ res, message: '待辦資料為空' });
    }
  }

  // 刪除單筆
  else if (req.url.startsWith('/todos/') && req.method === 'DELETE') {
    const id = req.url.split('/').pop();
    const index = todos.findIndex((todo) => todo.id === id);

    if (index >= 0) {
      todos.splice(index, 1);
      successHandle({ res, message: '刪除成功', data: { todos } });
    } else {
      const message = id ? `找不到 id: ${id}` : `id 不得為空`;
      errorHandle({ res, message });
    }
  }

  // Preflight 預檢請求
  else if (req.method === 'OPTIONS') {
    res.writeHead(200, headers);
    res.end();
  }

  // 404
  else {
    res.writeHead(404, headers);
    res.write(
      JSON.stringify({
        success: false,
        message: '此 API 路徑不存在',
      })
    );
    res.end();
  }
};

const server = http.createServer(requestListener);
server.listen(3000);
