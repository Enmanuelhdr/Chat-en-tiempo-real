import express from 'express';
import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io'

// Creacion de la app
const app = express()

// Habilitando cors
app.use(cors())


// Creando un servirdor
const server = http.createServer(app)

// Crea una nueva instancia del servidor Socket.io
const io = new Server(server, {
    // Configura CORS para permitir conexiones desde el frontend.
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET","POST"]
    }
})

// Escucha el evento "connection" para cada nuevo cliente que se conecta.
io.on("connection", (socket) => {
    // Imprime el ID del cliente conectado a la consola.
    console.log(`Usuario actual: ${socket.id}`);

    // Escucha el evento "join_room" para el cliente actual.
    socket.on("join__room", (data) => {
        console.log(`Usuario con id: ${socket.id} se unio a la sala: ${data}`);
        socket.join(data)
    })

    // Escucha el evento "send_message" para el cliente actual y envia el mensaje a una sala especifica
    socket.on("send_message", (data) => {
        socket.to(data.room).emit("recieve_message", data)
    })

    // Escucha el evento "disconnect" para el cliente actual.
    socket.on("disconnect", () => {
        // Imprime un mensaje a la consola indicando que el usuario se ha desconectado.
        console.log("Usuario desconectado", socket.id);
    })
})

// Definir puerto y aarrancar el proyecto
const port = process.env.PORT || 3001;
server.listen(port, () => {
    console.log(`El servidor esta en el puerto http://localhost:${port}`);
});