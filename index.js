const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
        const completedTasksCollection = client.db('taskManager').collection('completedTask');

        app.post('/task', async(req, res) =>{
            const task = req.body;
            const result = await tasksCollection.insertOne(task);
            res.send(result); 
        })
        
        app.put('/task/:id', async (req, res) => {
            const id = req.params.id
            console.log(id)
            const filter = { _id: ObjectId(id) }
            const option = { upsert: true };
            const updatedDoc = {
                $set: {
                    status: 'completed'
                }
            }
            const result = await tasksCollection.updateOne(filter, updatedDoc, option)
            res.send(result);
        })
        
        app.get('/task', async(req, res) => {
            let query = {};
            if(req.query.email){
                query = {
                    email: req.query.email
                }
            }
            const cursor = tasksCollection.find(query);
            const task = await cursor.toArray();
            res.send(task);
        })
        app.get('/completedTask', async(req, res) => {
            const query = {}
            const cursor = completedTasksCollection.find(query);
            const completed = await cursor.toArray();
            res.send(completed);
        })

        app.delete('/task/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id) };
            const result = await tasksCollection.deleteOne(query);
            res.send(result);
        })

        // app.get('/task/:id', async(req, res) => {
        //     const id = req.params.id;
        //     const query = { _id: ObjectId(id)};
        //     const task = await tasksCollection.findOne(query);
        //     res.send(task);
        // })

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