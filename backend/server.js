const express = require('express')
const mysql = require('mysql')
const cors = require('cors')

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: '192.168.0.75',
    user: 'roottwo',
    password: 'superpi',
    database: 'test_connections'
})


app.get('/', (req, res) => {
    const sql = "SELECT * FROM test_connections.connections";
    db.query(sql, (err, data) => {
        if(err) return res.json(err);
        return res.json(data);
    })
})

app.get('/user/:id', (req, res) => {
    const sql = 'SELECT * FROM test_connections.connections WHERE id =?'
    const id = req.params.id
    db.query(sql, [id], (err, data) => {
        if(err) return res.json(err)
        if(data.length === 0) {
            return res.status(404).json({message: 'User not found'})
        }
        return res.json(data[0])
    })
})

app.post('/create', (req, res) => {
    const sql = "INSERT INTO test_connections.connections (`name`, `type`, `resources`, `contact`) VALUES (?)";
    const values = [
        req.body.name,
        req.body.type,
        req.body.resources,
        req.body.contact
    ]
    db.query(sql, [values], (err, data) =>{
        if(err) return res.json(err);
        return res.json("created")
    })
})

app.put('/update/:id', (req, res) => {
    const sql = "UPDATE test_connections.connections set `name` =?, `type` =?, `resources` =?, `contact` =? WHERE id =?";
    const id = req.params.id;
    const values = [
        req.body.name,
        req.body.type,
        req.body.resources,
        req.body.contact
    ]
    db.query(sql, [...values, id], (err, data) =>{
        if(err) return res.json(err);
        return res.json("updated")
    })
})

app.delete('/delete/:id', (req, res) => {
    const sql = "DELETE FROM test_connections.connections WHERE id =?";
    const id = req.params.id;

    db.query(sql, [id], (err, data) =>{
        if(err) return res.json(err);
        return res.json("deleted")
    })
})

app.listen(8081, () => {
    console.log("listening...")
})