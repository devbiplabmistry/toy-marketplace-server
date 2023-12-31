const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const port = process.env.PORT || 5000

// middleware
app.use(cors())
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ovmmvr6.mongodb.net/?retryWrites=true&w=majority`;

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
    const feedBackCollection = database.collection("feedBack");

    app.get('/feedBack', async (req, res) => {
      const cursor = feedBackCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })

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

    app.get('/addToy', async (req, res) => {
      const cursor = toyCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })
    app.get('/addToy/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) }
      const user = await toyCollection.findOne(query)
      res.send(user)
    })
    app.post('/addToy', async (req, res) => {
      const doc = req.body;
      const result = await toyCollection.insertOne(doc);
      res.send(result)
    })
    app.delete('/allToy/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) };
      const result = await toyCollection.deleteOne(query);;
      res.send(result)
    })
    app.put('/addToy/:id', async(req, res) =>{
      const id = req.params.id;
      const user = req.body; 
      const filter = {_id: new ObjectId(id)}
      const options = {upsert: true}
      const updatedUser = {
          $set: {
              name: user.name,
              sellerEmail: user.sellerEmail,
              price:user.price,
              sellername:user.sellername,
              discription:user.discription,
              subQuantity:user.subQuantity,
              rattings:user.rattings
          }
      }

      const result = await toyCollection.updateOne(filter, updatedUser, options );
      res.send(result);

  })
    app.get('/allToy/:id', async (req, res) => {
      const id =req.params.id;
      const query = { _id:new ObjectId(id) };
      const result = await toyCollection.findOne(query);
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