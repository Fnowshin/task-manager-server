const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// user: taskManager
//password: 0iD0dXKsJRVebkn1



const uri = "mongodb+srv://taskManager:0iD0dXKsJRVebkn1@cluster0.lt8wotk.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run(){
    try{
        const tasksCollection = client.db('taskManager').collection('addedTask');

        app.post('/task', async(req, res) =>{
            const task = req.body;
            const result = await tasksCollection.insertOne(task);
            res.send(result); 
        })
        
        app.get('/task', async(req, res) => {
            const query = {}
            const cursor = tasksCollection.find(query);
            const task = await cursor.toArray();
            res.send(task);
        })
    }
    catch{
    
    }
}

run().catch(err => console.log(err));

app.get('/', (req, res) => {
    res.send('Welcome to task man server');
});

app.listen(port, () => {
    console.log(`Listenting to port ${port}`)
})