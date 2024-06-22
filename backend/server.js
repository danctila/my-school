const express = require('express')
const mysql = require('mysql')
const cors = require('cors')
const axios = require('axios');
require('dotenv').config()

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})

db.connect(err => {
    if (err) {
        console.error('Error connecting to the database:', err.stack);
        return;
    }
    console.log('Connected to the database.');
});

// Function to test OpenAI connection
const testOpenAIConnection = async () => {
    try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: "You are a helpful assistant." },
                { role: "user", content: "This is a test prompt to check OpenAI connection." }
            ],
            max_tokens: 5
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });
        console.log('Successfully connected to OpenAI API.');
    } catch (error) {
        console.error('Error connecting to OpenAI:', error.response ? error.response.data : error.message);
    }
};

// Test OpenAI connection on server start
testOpenAIConnection();

app.post('/ask', async (req, res) => {
    try {
        const { question } = req.body;
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: "You are a helpful assistant called 'MySchool AI' on a school's career and technical education partner management website. Provide clear and concise answers to the user's questions. Only provide answers to questions that are relevant to the program." },
                { role: "user", content: question }
            ],
            max_tokens: 150
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });
        res.json({ answer: response.data.choices[0].message.content.trim() });
    } catch (error) {
        console.error('Error communicating with OpenAI:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Failed to get response from OpenAI' });
    }
});

app.get('/', (req, res) => {
    const sql = "SELECT * FROM connections";
    db.query(sql, (err, data) => {
        if(err) return res.json(err);
        return res.json(data);
    })
})

app.get('/user/:id', (req, res) => {
    const sql = 'SELECT * FROM connections WHERE id =?'
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
    const sql = "INSERT INTO connections (`name`, `type`, `resources`, `contact`) VALUES (?)";
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
    const sql = "UPDATE connections set `name` =?, `type` =?, `resources` =?, `contact` =? WHERE id =?";
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
    const sql = "DELETE FROM connections WHERE id =?";
    const id = req.params.id;

    db.query(sql, [id], (err, data) =>{
        if(err) return res.json(err);
        return res.json("deleted")
    })
})

app.listen(8081, () => {
    console.log("listening...")
})