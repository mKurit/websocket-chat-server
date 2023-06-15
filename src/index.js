const WebSocket = require('ws');

const wss = new WebSocket.Server({ port:443 });

// WebSocket接続を格納するオブジェクト
const clients = {};

wss.on('connection', (ws) => {
  // クライアントIDを生成
  const clientId = generateClientId();
  
  // クライアントを接続リストに追加
  clients[clientId] = ws;
  
  // クライアントに接続IDを送信
  ws.send(JSON.stringify({ type: 'connect', clientId }));
  
  ws.on('message', (message) => {
    const data = JSON.parse(message);
    const { type, to, from, content } = data;
    
    if (type === 'message') {
      // メッセージを指定の相手に送信
      if (clients[to]) {
        clients[to].send(JSON.stringify({ type: 'message', from, content }));
      }
    }
  });
  
  ws.on('close', () => {
    // クライアントが切断した場合、接続リストから削除
    delete clients[clientId];
  });
});

function generateClientId() {
  return Math.random().toString(36).substr(2, 9);
}