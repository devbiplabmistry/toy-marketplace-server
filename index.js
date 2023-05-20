const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const port = process.env.PORT || 5000

// 

// middleware
app.use(cors())
app.use(express.json());



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = "mongodb+srv://edukit:HPEqY4BGa9G24egv@cluster0.ovmmvr6.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const database = client.db("edukit");
    const eduCollection = database.collection("eduProducts");
    const toyCollection = database.collection("addToy");

    app.get('/toy', async (req, res) => {
      const cursor = eduCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })
    app.get('/toy/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) }
      const user = await eduCollection.findOne(query)
      res.send(user)
    })

    app.post('/addToy', async (req, res) => {
      const doc =req.body;
      const result = await toyCollection.insertOne(doc);
      res.send(result)
    })
    app.get('/allToy', async (req, res) => {
      const cursor = toyCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })










    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);













app.get('/', (req, res) => {
  res.send('Edukit website is running now...')
})

app.listen(port, () => {
  console.log(`Edukit server is running on port ${port}`)
})