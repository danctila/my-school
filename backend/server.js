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

app.post('/login', (req, res) => {
    const { password } = req.body;
    console.log('Received password:', password); // Debug logging
    console.log('Expected password:', process.env.ADMIN_PASSWORD); // Debug logging
    if (password === process.env.ADMIN_PASSWORD) {
        res.json({ success: true });
    } else {
        res.status(401).json({ success: false, message: 'Invalid password' });
    }
});

// Test OpenAI connection
const testOpenAIConnection = async () => {
    try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: "gpt-4-turbo",
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

        // Try to fetch data from the database
        db.query('SELECT * FROM connections', async (err, data) => {
            let formattedData = "No additional data available due to a database error.";
            if (!err) {
                // Format the data if no error occurs
                formattedData = data.map(item => `ID: ${item.id}, Name: ${item.name}, Type: ${item.type}, Resources: ${item.resources}, Contact: ${item.contact}`).join('\n');
            } else {
                console.error('Error fetching data from the database:', err.stack);
            }

            // Combine the prompt with either the fetched data or an error message
            const combinedPrompt = `
                The following is a list of partners and their details:
                ${formattedData}
                
                User question: ${question}
            `;

            // Call the OpenAI API with the combined prompt
            const response = await axios.post('https://api.openai.com/v1/chat/completions', {
                model: "gpt-4-turbo",
                messages: [
                    { role: "system", content: "You are a helpful assistant called 'MySchool AI' on a school's career and technical education partner management website. Provide clear and concise answers to the user's questions. Only provide answers to questions that are relevant to the program as well as the provided data." },
                    { role: "user", content: combinedPrompt }
                ],
                max_tokens: 250
            }, {
                headers: {
                    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            });

            res.json({ answer: response.data.choices[0].message.content.trim() });
        });
    } catch (error) {
        console.error('Error communicating with OpenAI:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Failed to get response from OpenAI' });
    }
});

// Fetch all connections with resource descriptions
app.get('/connections', (req, res) => {
    const sql = `
        SELECT c.id, c.name, c.type, r.ResourceType, r.ResourceDesc, c.contact
        FROM connections c
        JOIN Resources r ON c.resource_id = r.ResourceId
    `;
    db.query(sql, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
});

// Fetch all resources
app.get('/resources', (req, res) => {
    const sql = "SELECT * FROM Resources";
    db.query(sql, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
});

app.get('/user/:id', (req, res) => {
    const sql = `SELECT c.id, c.name, c.type, r.ResourceType, r.ResourceDesc, c.contact
        FROM connections c
        JOIN Resources r ON c.resource_id = r.ResourceId
        WHERE c.id = ?`
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
    const sql = "INSERT INTO connections (`name`, `type`, `resource_id`, `contact`) VALUES (?)";
    const values = [
        req.body.name,
        req.body.type,
        req.body.resourceType,
        req.body.contact
    ]
    db.query(sql, [values], (err, data) => {
        if (err) return res.json(err);
        return res.json("created");
    })
});

app.put('/update/:id', (req, res) => {
    const sql = "UPDATE connections SET `name` = ?, `type` = ?, `resource_id` = ?, `contact` = ? WHERE id = ?";
    const id = req.params.id;
    const values = [
        req.body.name,
        req.body.type,
        req.body.resourceType,
        req.body.contact
    ];
    db.query(sql, [...values, id], (err, data) => {
        if (err) return res.json(err);
        return res.json("updated");
    });
});

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