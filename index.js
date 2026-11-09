import express from 'express';
import cors from 'cors';
import { MongoClient } from 'mongodb';
import 'dotenv/config';

const app = express();

const port = process.env.PORT || 5001;

//middleware
app.use(express.json());
app.use(cors());


const client = new MongoClient(`mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@ac-ejr4asu-shard-00-00.kltcu33.mongodb.net:27017,ac-ejr4asu-shard-00-01.kltcu33.mongodb.net:27017,ac-ejr4asu-shard-00-02.kltcu33.mongodb.net:27017/?ssl=true&replicaSet=atlas-jh1i8m-shard-0&authSource=admin`);


export async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("You successfully connected to MongoDB!");
    return client;
  } catch (err) {
    console.dir(err);
  }
}

const connectedClient = await connectToMongoDB();
const database = connectedClient.db("hireloopdb");
const users = database.collection("user");
const jobs = database.collection("jobs");



app.get('/', (req, res) => {
  res.send('hire loop is looping');
});


app.get('/users', async (req,res) => {
      const cursor = users.find({});
      const result = await cursor.toArray();
      res.send(result);
})


//jobs related apis
app.post('/jobs' , async (req,res) => {
   const job = req.body;
   const result = await jobs.insertOne(job);
   res.send(result);
})

app.listen(port, () => {
  console.log(`hireloop is running on port ${port}`);
});