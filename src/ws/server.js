import { error } from 'console';
import WebSocket from 'ws';
import { WebSocketServer } from 'ws';
function sendJson(socket, payload){
    if(socket.readyState !== WebSocket.OPEN) return;
    socket.send(JSON.stringify(payload));
}

function broadcast(wss, payload) {
    for (const client in wss.clients) {
        if (client.readyState !== WebSocket.OPEN) {
            return;
        }
        client.send(JSON.stringify(payload));
    }
}

export function attachWebSocketServer(server) {
    const wss = new WebSocketServer({
        server,
        path : '/ws',
        maxPayload : 1024 * 1024,
    });
    wss.on('connection',(socket) => {
        sendJson(socket, { message : 'Welcome to the Sports API WebSocket Server!' });
        socket.on('message', console.error);
    });

    function broadcastMatchCreated(match) {
        broadcast(wss, { type : 'MATCH_CREATED', data : match });
    }

    return { broadcastMatchCreated };
}