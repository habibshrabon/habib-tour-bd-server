const express = require("express");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;

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
    const orderCollection = database.collection("orders");

    //GET API
    app.get("/packages", async (req, res) => {
      const cursor = packageCollection.find({});
      const packages = await cursor.toArray();
      res.send(packages);
    });

    //GET ORDERS API
    app.get("/orders", async (req, res) => {
      const cursor = orderCollection.find({});
      const orders = await cursor.toArray();
      res.send(orders);
    });

    //GET Single Package API
    app.get("/packages/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const package = await packageCollection.findOne(query);
      res.json(package);
    });

    //GET orders single API
    app.get("/orders/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const orders = await orderCollection.findOne(query);
      res.json(orders);
    });

    //POST API
    app.post("/packages", async (req, res) => {
      const package = req.body;
      console.log("Hit the post api", package);

      const result = await packageCollection.insertOne(package);
      console.log(result);
      res.json(result);
    });

    //POST ADD ORDERS API
    app.post("/orders", async (req, res) => {
      const order = req.body;
      const result = await orderCollection.insertOne(order);
      res.json(result);
    });

    //DELETE API

    app.delete("/orders/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await orderCollection.deleteOne(query);
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
  console.log("Running Traveler server on port", port);
});
