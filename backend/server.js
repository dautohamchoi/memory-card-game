import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import gameRoute from './routes/gameRoute';
import userRoute from './routes/userRoute';
import feedbackRoute from './routes/feedbackRoute';
import path from 'path';

dotenv.config();

const mongodbUrl = process.env.MONGODB_URL;
mongoose.connect(mongodbUrl, { useUnifiedTopology: true, useCreateIndex: true, useNewUrlParser: true}).catch(error => console.log(error));
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB is connected successfully")
});

const app = express();

app.use(bodyParser.json());

app.use("/api/games", gameRoute);
app.use("/api/users", userRoute);
app.use("/api/feedbacks", feedbackRoute);

app.use(express.static(path.join(__dirname, '/../frontend/build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(`${__dirname}/../frontend/build/index.html`));
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log('Server is working on ' + port);
});