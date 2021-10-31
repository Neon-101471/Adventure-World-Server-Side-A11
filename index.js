const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();

const ObjectId = require('mongodb').ObjectId;

const app = express();
const port = process.env.PORT || 7000;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xffah.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('topDestination');
        const destinationCollection = database.collection('destinations');
        const attractivePlaceCollection = database.collection('attractivePlaces');
        const orderCollection = database.collection('orders');

        //GET Top Destinations API
        app.get('/destinations', async (req, res) => {
            const cursor = destinationCollection.find({});
            const destinations = await cursor.toArray();

            res.send(destinations);
        });

        //GET Single API
        app.get("/destinations/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const singleDestination = await destinationCollection.findOne(query);
            res.json(singleDestination);
        });

        //GET Top Attractions API
        app.get('/attractive-place', async (req, res) => {
            const cursor = attractivePlaceCollection.find({});
            const attractivePlaces = await cursor.toArray();

            res.send(attractivePlaces);
        });

        //GET Booking API
        app.get('/booking', async (req, res) => {
            const cursor = orderCollection.find({});
            const booking = await cursor.toArray();

            res.send(booking);
        })

        //POST API to MONGO-DB server
        app.post('/destinations', async (req, res) => {
            const addPlace = req.body;
            const result = await destinationCollection.insertOne(addPlace);
            console.log(result);
            res.json(result);
        });

        //POST API to Orders
        app.post('/my-orders', async (req, res) => {
            const newOrder = req.body;
            const result = await orderCollection.insertOne(newOrder);
            res.json(result);
        });

        //DELETE API
        app.delete("/destinations/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await destinationCollection.deleteOne(query);
            res.json(result);
        });

        //DELETE Order API
        app.delete("/booking/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await orderCollection.deleteOne(query);
            res.json(result);
        });
    }

    finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})