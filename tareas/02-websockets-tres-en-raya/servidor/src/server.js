const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

let tablero = [
    [' ', ' ', ' '],
    [' ', ' ', ' '],
    [' ', ' ', ' ']
];
let turno = 'X';
let terminado = false;

function verificarGanador() {
    for (let i = 0; i < 3; i++) {
        if (tablero[i][0] !== ' ' && tablero[i][0] === tablero[i][1] && tablero[i][1] === tablero[i][2]) return tablero[i][0];
        if (tablero[0][i] !== ' ' && tablero[0][i] === tablero[1][i] && tablero[1][i] === tablero[2][i]) return tablero[0][i];
    }
    if (tablero[0][0] !== ' ' && tablero[0][0] === tablero[1][1] && tablero[1][1] === tablero[2][2]) return tablero[0][0];
    if (tablero[0][2] !== ' ' && tablero[0][2] === tablero[1][1] && tablero[1][1] === tablero[2][0]) return tablero[0][2];

    let lleno = tablero.every(fila => fila.every(c => c !== ' '));
    if (lleno) return 'Empate';

    return null;
}

function enviarATodos(datos) {
    const json = JSON.stringify(datos);
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(json);
        }
    });
}

function reiniciar() {
    tablero = [
        [' ', ' ', ' '],
        [' ', ' ', ' '],
        [' ', ' ', ' ']
    ];
    turno = 'X';
    terminado = false;
}

wss.on('connection', (ws) => {
    console.log('Cliente conectado');

    ws.send(JSON.stringify({ tablero, turno, mensaje: `Turno de: ${turno}` }));

    ws.on('message', (message) => {
        const msg = message.toString().trim();
        console.log(`Mensaje recibido: ${msg}`);

        if (msg === 'reiniciar' || msg === 'Iniciar') {
            reiniciar();
            enviarATodos({ tablero, turno, mensaje: 'Juego reiniciado. Turno de: X' });
            return;
        }

        if (terminado) {
            ws.send(JSON.stringify({ tablero, turno, mensaje: 'El juego terminó. Presiona Reiniciar.' }));
            return;
        }

        const partes = msg.split(',');
        if (partes.length === 2) {
            const fila = parseInt(partes[0]);
            const col = parseInt(partes[1]);

            if (fila >= 0 && fila <= 2 && col >= 0 && col <= 2) {
                if (tablero[fila][col] === ' ') {
                    tablero[fila][col] = turno;
                    const ganador = verificarGanador();

                    if (ganador) {
                        terminado = true;
                        const msgFinal = (ganador === 'Empate') ? '¡Empate!' : `¡Ganó el jugador ${ganador}!`;
                        enviarATodos({ tablero, turno, mensaje: msgFinal });
                    } else {
                        turno = (turno === 'X') ? 'O' : 'X';
                        enviarATodos({ tablero, turno, mensaje: `Turno de: ${turno}` });
                    }
                } else {
                    ws.send(JSON.stringify({ tablero, turno, mensaje: 'Casilla ocupada, intenta otra.' }));
                }
            }
        }
    });

    ws.on('close', () => {
        console.log('Cliente desconectado');
    });
});

console.log('Servidor WebSocket corriendo en ws://localhost:8080');
