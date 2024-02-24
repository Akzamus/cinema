const express = require('express');
const mongoose = require('mongoose');
const authRouter = require('./routers/authRouter');
const movieRouter = require('./routers/movieRouter')
const { MONGODB_CONNECT_URL, PORT } = require('./config');

const app = express();

app.use(express.json());
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/movies", movieRouter)

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

