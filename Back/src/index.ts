import { getUSDValue, getGBPValue } from './controllers/values';
import exchange from "./controllers/exchange";
import { login, query, register } from './controllers/database';
require('dotenv').config();
const mongoose = require('mongoose');
const express = require("express");
const http = require("http");
const app = express();
const { Server } = require("socket.io");
const cors = require("cors");

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3001",
        methods: ["GET"],
    },
});
io.on("connection", async (socket) => {
    socket.on('register', async (data) => {
        socket.emit('registerReturn', await register(data));
    })
    socket.on("login", async (data: { email: string, password: string }) => {
        socket.emit("loginResponse", await login(data));
    })
    socket.on("main", async (data) => {
        socket.emit("USDValue", await getUSDValue());
        socket.emit("GBPValue", await getGBPValue());
        const exchangeHistory = await query(data);
        socket.emit('userHistory', exchangeHistory);
        setInterval(async () => {
            const USDValue: number = await getUSDValue();
            const GBPValue: number = await getGBPValue();
            socket.emit("USDValue", USDValue);
            socket.emit("GBPValue", GBPValue);
        }, 20000)
    })
    socket.on("exchange", async (data) => {
        socket.emit("exchangeReturn", await exchange(data));

    })
})

mongoose.connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.hialjhn.mongodb.net/exchanges?retryWrites=true&w=majority`)
    .then()
    .catch((error) => console.log(error))

server.listen(4000, () => {
    console.log("SERVER IS RUNNING");
})
