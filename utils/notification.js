const { Server } = require("socket.io");

let io;

const initializeNotification = (server) => {
    io = new Server(server);

    io.on("connection", (socket) => {
        console.log("Pengguna terhubung:", socket.id);

        socket.on("sendNotification", (data) => {
            console.log("Notifikasi diterima:", data);

            io.emit("receiveNotification", data);
        });

        socket.on("disconnect", () => {
            console.log("Pengguna terputus:", socket.id);
        });
    });
};

const successNotification = (message) => {
    if (io) {
        console.log("Mengirim pesan sukses:", message);
        io.emit("receiveSuccessMessage", message);
    } else {
        console.error("Socket.IO tidak diinisialisasi.");
    }
};

const errorNotification = (errorMessage) => {
    if (io) {
        console.log("Mengirim pesan kesalahan:", errorMessage);
        io.emit("receiveErrorMessage", errorMessage);
    } else {
        console.error("Socket.IO tidak diinisialisasi.");
    }
};

module.exports = { initializeNotification, successNotification, errorNotification };