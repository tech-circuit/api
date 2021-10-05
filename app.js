const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const indexRouter = require('./routes/index');
const userRouter = require('./routes/user');
const workRouter = require('./routes/work');
const projectRouter = require('./routes/project');
const imageRouter = require('./routes/image');
const forumRouter = require('./routes/forum');
const mailingListRouter = require('./routes/mailingList');

const db = process.env.MONGODB_URL;

const app = express();

const port = process.env.PORT || 5000;
const server = app.listen(port, (err) => {
    console.log(`API listening on ${port}!`);
    if (err) throw err;
});

mongoose.connect(db, { useUnifiedTopology: true, useNewUrlParser: true })
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));
mongoose.set('useFindAndModify', false);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json({ limit: '50mb', extended: true }));
app.use(express.urlencoded({ limit: '50mb', extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/work', workRouter);
app.use('/project', projectRouter);
app.use('/image', imageRouter);
app.use('/forum', forumRouter);
app.use('/ml', mailingListRouter);

module.exports = app;