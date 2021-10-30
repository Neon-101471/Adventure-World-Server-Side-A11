const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();

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

        //GET Top Destinations API
        app.get('/destinations', async (req, res) => {
            const cursor = destinationCollection.find({});
            const destinations = await cursor.toArray();

            res.send(destinations);
        })

        //GET Top Attractions API
        app.get('/attractive-place', async (req, res) => {
            const cursor = attractivePlaceCollection.find({});
            const attractivePlaces = await cursor.toArray();

            res.send(attractivePlaces);
        })

    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get('/services', (req, res) => {
    res.send()
})

app.get('/check', (req, res) => {
    res.send('Check the server');
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})