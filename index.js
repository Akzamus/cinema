const express = require('express');
const mongoose = require('mongoose');
const authRouter = require('./authRouter');
const { MONGODB_CONNECT_URL, PORT } = require('./config');

const app = express();

app.use(express.json());
app.use("/auth", authRouter);

const start = async () => {
    try {
        await mongoose.connect(MONGODB_CONNECT_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
    } catch (e) {
        console.log(e);
    }
};

start();

