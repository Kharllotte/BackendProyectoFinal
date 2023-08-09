import express from "express";
import productRouter from "./routes/mongodb/products.routes.js";
import productsRouterView from "./routes/views/products.routes.js";
import cartRouter from "./routes/mongodb/carts.routes.js";
import env from "./config/env.js";
import { Server } from "socket.io";
import mongoose from "mongoose";
import messageManager from "./dao/managers/mongodb/messages.js";
import connectMongoDB from "connect-mongo";
import __dirname from "./utils/index.js";

import * as http from "http";

import handlebars from "express-handlebars";
import Handlebars from "handlebars";
import { allowInsecurePrototypeAccess } from "@handlebars/allow-prototype-access";

import session from "express-session";
import morgan from "morgan";

import chatRouter from "./routes/chat.routes.js";
import authRouterView from "./routes/views/auth.routes.js";

//passport
import initializePassport from "./config/passport.js";
import passport from "passport";

// save express framework
const app = express();

// server http
const server = http.createServer(app);

// inicialize web sockets
const io = new Server(server);

// connect to mongodb
const mongoUrl = env.MONGO_URL;

await mongoose
  .connect(mongoUrl)
  .then(() => {
    console.log("DB CONNECTED");
  })
  .catch((e) => {
    console.log("Error connecting to database");
  });

const message = new messageManager();

// config mongodb
app.use(
  session({
    store: connectMongoDB.create({
      mongoUrl: env.MONGO_URL,
      ttl: 3600,
    }),
    secret: "lilianaforero",
    resave: false,
    saveUninitialized: true,
  })
);

// Inicialize passport
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.userIsAuthenticated = req.isAuthenticated();

  let cart = null;
  if (req.isAuthenticated()) cart = req.user.cart;
  res.locals.cart = cart;
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// config handlebars
app.engine(
  "handlebars",
  handlebars.engine({
    handlebars: allowInsecurePrototypeAccess(Handlebars),
    helpers: {
      jsonify: function (context) {
        return JSON.stringify(context);
      },
    },
  })
);
app.set("view engine", "handlebars");
app.set("views", `${__dirname}/views`);

// public path
app.use("/", express.static(__dirname + "/public"));

// -- routes
// apis
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
//web
app.use("/chat", chatRouter);
app.use("/products", productsRouterView);
app.use("/auth", authRouterView);

// config port
const port = env.PORT;
server.listen(port, () => {
  console.log(`SERVER ON PORT: ${port}`);
});

// config socket
io.on("connection", (socket) => {
  console.log("Nuevo usuario conectado", socket.id);

  socket.on("newUser", (user) => {
    console.log(`> ${user} ha iniciado sesion`);
  });

  socket.on("chat:message", async (msg) => {
    await message.save(msg);
    io.emit("messages", await message.getAll());
  });

  socket.on("newUser", (user) => {
    socket.broadcast.emit("newUser", user);
  });

  socket.on("chat:typing", (data) => {
    socket.broadcast.emit("chat:typing", data);
  });

  socket.on("disconnect", () => {
    console.log("usuario desconectado", socket.id);
  });
});
