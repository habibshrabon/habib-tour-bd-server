const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

//Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ewzy7.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
// console.log(uri);
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//database connection
async function run() {
  try {
    await client.connect();
    const database = client.db("traveler");
    const packageCollection = database.collection("packages");

    //POST API
    app.post("/packages", async (req, res) => {
      const package = req.body;
      console.log("Hit the post api", package);

      const result = await packageCollection.insertOne(package);
      console.log(result);
      res.json(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello from db it's working working");
});

app.listen(port, () => {
  console.log("Running Genius server on port", port);
});
