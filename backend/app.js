const express = require ('express');
const app = express();
const mongoose = require('./database/mongoose');

const List = require('./database/models/list');
const Task = require('./database/models/task');

app.use(express.json());

/*
CORS- Cross Origin Request Sharing
localhost:3000 - backend API
localhost:4200 - front-end
*/

//app.use(cors())

app.use((req, res, next)=> {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, HEAD, OPTIONS, PUT, PATCH, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization");
    next();
});

/*
List: Create, Update, ReadOne, ReadAll, Delete
Task: Create, Update, ReadOne, ReadAll, Delete

GET -> Get Data
POST -> Save Data
Put/Patch -> Update Row/Document
Delete -> Delete Document
*/

//LIST URL

//get all lists
app.get('/lists',(req, res)=> {
    List.find({})
        .then(lists => res.send(lists))
        .catch((error)=> console.log(error));
});

//create a list
app.post('/lists',(req, res)=> { 
    (new List({ 'title': req.body.title }))
        .save()
        .then((list)=>res.send(list))
        .catch((error)=> console.log(error));
});

//get one list
app.get('/lists/:listId', (req, res)=> {
    List.find({ _id: req.params.listId })
    .then((list)=>res.send(list))
    .catch((error)=> console.log(error));
}) 

//update list
app.patch('/lists/:listId', (req, res) => {
    List.findOneAndUpdate({ '_id': req.params.listId }, { $set: req.body })
        .then((list)=>res.send(list))
        .catch((error)=> console.log(error));
});

//delete list
app.delete('/lists/:listId', (req, res) => {
    const deleteTasks = (list) => {
        Task.deleteMany({_listId: list._id})
            .then(() => list)
            .catch((error)=> console.log(error));
    };
    const list = List.findByIdAndDelete(req.params.listId)
        .then((list) => res.send(deleteTasks(list)))
        .catch((error)=> console.log(error));
    res.status(200).send(list);
});

/*
TASKS URL
http://localhost:3000/lists/:listId/tasks/:taskid
*/

//get all tasks
app.get('/lists/:listId/tasks/', (req, res) => {
    Task.find({ _listId: req.params.listId})
        .then((tasks)=>res.send(tasks))
        .catch((error)=> console.log(error));
});

//create a task
app.post('/lists/:listId/tasks/', (req, res) => {
    (new Task({ 'title': req.body.title, '_listId': req.params.listId }))
        .save()
        .then((task)=>res.send(task))
        .catch((error)=> console.log(error));
});

//get one task
app.get('/lists/:listId/tasks/:taskId', (req, res) => {
    Task.findOne({ _listId: req.params.listId, _id: req.params.taskId })
        .then((task)=>res.send(task))
        .catch((error)=> console.log(error));
});

//update task
app.patch('/lists/:listId/tasks/:taskId', (req, res) => {
    Task.findOneAndUpdate({ _listId: req.params.listId, _id: req.params.taskId }, { $set: req.body })
        .then((task)=>res.send(task))
        .catch((error)=> console.log(error));
});

//delete task
app.delete('/lists/:listId/tasks/:taskId', (req, res) => {
    Task.findOneAndDelete({ _listId: req.params.listId, _id: req.params.taskId })
        .then((task)=>res.send(task))
        .catch((error)=> console.log(error));
});


app.listen(3000, ()=>console.log("Connected"));