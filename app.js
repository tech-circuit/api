const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
const socketIO = require("socket.io");

require("dotenv").config();

const indexRouter = require("./routes/index");
const userRouter = require("./routes/user");
const workRouter = require("./routes/work");
const projectRouter = require("./routes/project");
const imageRouter = require("./routes/image");
const forumRouter = require("./routes/forum");
const mailingListRouter = require("./routes/mailingList");
const orgRouter = require("./routes/org");
const orgEvent = require("./routes/event");
const notifs = require("./routes/notifs");
const authRouter = require("./routes/auth");

const db = process.env.MONGODB_URL;

const app = express();

const port = process.env.PORT || 4000;
const server = app.listen(port, (err) => {
    console.log(`API listening on ${port}!`);
    if (err) throw err;
});

const io = socketIO(server, { cors: true, origins: "*:*" });

mongoose
    .connect(db, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useCreateIndex: true,
    })
    .then(() => console.log("MongoDB Connected..."))
    .catch((err) => console.log(err));
mongoose.set("useFindAndModify", false);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
// settings
app.use(express.json({ limit: "50mb", extended: true }));
app.use(express.urlencoded({ limit: "50mb", extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());

app.use("/", indexRouter);
app.use("/user", userRouter);
app.use("/work", workRouter);
app.use("/project", projectRouter);
app.use("/image", imageRouter);
app.use("/forum", forumRouter);
app.use("/ml", mailingListRouter);
app.use("/org", orgRouter);
app.use("/event", orgEvent);
app.use("/notifs", notifs);
app.use("/auth", authRouter);

io.on("connection", (socket) => {
    socket.on("notif", (receivers) => {
        console.log(receivers);
        receivers.forEach((id) => {
            io.emit("notif", id);
        });
    });
});

module.exports = app;
