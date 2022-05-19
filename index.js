const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");
const app = express();
const jwt = require('jsonwebtoken');
// Middleware cors and express json
app.use(cors());
app.use(express.json());
// dotenv code
require("dotenv").config();
// Port
const port = process.env.PORT || 5000;


const uri = `mongodb+srv://${process.env.user}:${process.env.password}@cluster0.dgjpm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
async function run() {
  try {
    await client.connect();
    const data = client.db("TodoApp").collection("Task");
    console.log("DB Connected");
    // all product
    app.get("/alltask", async (req, res) => {
      const query = {};
      const cursor = data.find(query);
      products = await cursor.toArray();
      res.send(products);
    });

    //finding my items thorugh my email address

    app.get("/task", async (req, res) => {
      
      const email = req.query.email;
        const quantity = req.body;
        const query = { email: email };
        const cursor = data.find(query);
        const orders = await cursor.toArray();
        res.send(orders);

    });

    // single product
    app.get(`/task/:id`, async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const product = await data.findOne(query);
      res.send(product);
    });

    //delete product

    app.delete(`/task/:id`, async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await data.deleteOne(query);
      res.send(result);
    });

    //adding product
    app.post("/task", async (req, res) => {
      const newProduct = req.body;
      console.log(`newProduct added ${newProduct}`);
      const product = await data.insertOne(newProduct);
      res.send(product);
    });


    app.put(`/task/:id`, async (req, res) => {
      const id = req.params.id;
      const updatedProduct = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          name: updatedProduct.name,
        },
      };
      const result = await data.updateOne(filter, updatedDoc, options);
      res.send(result);
    });
  } finally {
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Server is Running");
});

app.listen(port, () => {
  console.log(`Port is listening to ${port}`);
});