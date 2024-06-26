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
    console.log('Login request received:', req.body); // Log request body
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

// app.post('/ask', async (req, res) => {
//     try {
//         const { question } = req.body;

//         // Try to fetch data from the database
//         db.query('SELECT * FROM connections', async (err, data) => {
//             let formattedData = "No additional data available due to a database error.";
//             if (!err) {
//                 // Format the data if no error occurs
//                 formattedData = data.map(item => `ID: ${item.id}, Name: ${item.name}, Type: ${item.type}, Resources: ${item.resources}, Contact: ${item.contact}`).join('\n');
//             } else {
//                 console.error('Error fetching data from the database:', err.stack);
//             }

//             // Combine the prompt with either the fetched data or an error message
//             const combinedPrompt = `
//                 The following is a list of partners and their details:
//                 ${formattedData}
                
//                 User question: ${question}
//             `;

//             // Call the OpenAI API with the combined prompt
//             const response = await axios.post('https://api.openai.com/v1/chat/completions', {
//                 model: "gpt-4-turbo",
//                 messages: [
//                     { role: "system", content: "You are a helpful assistant called 'MySchool AI' on a school's career and technical education partner management website. Provide clear and concise answers to the user's questions. Only provide answers to questions that are relevant to the program as well as the provided data." },
//                     { role: "user", content: combinedPrompt }
//                 ],
//                 max_tokens: 250
//             }, {
//                 headers: {
//                     'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
//                     'Content-Type': 'application/json'
//                 }
//             });

//             res.json({ answer: response.data.choices[0].message.content.trim() });
//         });
//     } catch (error) {
//         console.error('Error communicating with OpenAI:', error.response ? error.response.data : error.message);
//         res.status(500).json({ error: 'Failed to get response from OpenAI' });
//     }
// });

app.post('/ask', async (req, res) => {
    console.log('Ask request received:', req.body); // Log request body
    try {
        const { question } = req.body;
        db.query(`
            SELECT c.id, c.name, c.type, r.resource_type, pr.specific_resource_desc, c.contact
            FROM connections c
            JOIN partner_resources pr ON c.id = pr.partner_id
            JOIN resources r ON pr.resource_id = r.resource_id
        `, async (err, data) => {
            let formattedData = "No additional data available due to a database error.";
            if (!err) {
                formattedData = data.map(item => `ID: ${item.id}, Name: ${item.name}, Type: ${item.type}, Resource Type: ${item.resource_type}, Specific Resource Description: ${item.specific_resource_desc}, Contact: ${item.contact}`).join('\n');
            } else {
                console.error('Error fetching data from the database:', err.stack);
            }

            const combinedPrompt = `
                The following is a list of partners and their details:
                ${formattedData}
                
                User question: ${question}
            `;

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


// // Fetch all connections with resource descriptions
// app.get('/connections', (req, res) => {
//     const sql = `
//         SELECT c.id, c.name, c.type, r.ResourceType, r.ResourceDesc, c.contact
//         FROM connections c
//         JOIN Resources r ON c.resource_id = r.ResourceId
//     `;
//     db.query(sql, (err, data) => {
//         if (err) return res.json(err);
//         return res.json(data);
//     });
// });

// Fetch all connections with resource descriptions
app.get('/connections', (req, res) => {
    console.log('Get connections request received'); // Log request
    const sql = `
        SELECT c.id, c.name, c.type, r.resource_type, pr.specific_resource_desc, c.contact
        FROM connections c
        JOIN partner_resources pr ON c.id = pr.partner_id
        JOIN resources r ON pr.resource_id = r.resource_id
    `;
    db.query(sql, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
});

// Fetch all resources
app.get('/resources', (req, res) => {
    console.log('Get resources request received'); // Log request
    const sql = "SELECT * FROM resources";
    db.query(sql, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
});

app.post('/resources', (req, res) => {
    const sql = "INSERT INTO resources (`resource_type`) VALUES (?)";
    const values = [
        req.body.resourceType
    ];
    db.query(sql, [values], (err, data) => {
        if (err) return res.json(err);
        return res.json({ resource_id: data.insertId }); // Return the new resource_id
    });
});

// app.get('/user/:id', (req, res) => {
//     const sql = `SELECT c.id, c.name, c.type, r.ResourceType, r.ResourceDesc, c.contact
//         FROM connections c
//         JOIN Resources r ON c.resource_id = r.ResourceId
//         WHERE c.id = ?`
//     const id = req.params.id
//     db.query(sql, [id], (err, data) => {
//         if(err) return res.json(err)
//         if(data.length === 0) {
//             return res.status(404).json({message: 'User not found'})
//         }
//         return res.json(data[0])
//     })
// })

// Fetch a single user by ID
app.get('/user/:id', (req, res) => {
    console.log('Get user by ID request received:', req.params.id); // Log request params
    const sql = `
        SELECT c.id, c.name, c.type, r.resource_type, pr.specific_resource_desc, c.contact
        FROM connections c
        JOIN partner_resources pr ON c.id = pr.partner_id
        JOIN resources r ON pr.resource_id = r.resource_id
        WHERE c.id = ?
    `;
    const id = req.params.id;
    db.query(sql, [id], (err, data) => {
        if (err) return res.json(err);
        if (data.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.json(data[0]);
    });
});

// app.post('/create', (req, res) => {
//     const sql = "INSERT INTO connections (`name`, `type`, `resource_id`, `contact`) VALUES (?)";
//     const values = [
//         req.body.name,
//         req.body.type,
//         req.body.resourceType,
//         req.body.contact
//     ]
//     db.query(sql, [values], (err, data) => {
//         if (err) return res.json(err);
//         return res.json("created");
//     })
// });

app.post('/create', (req, res) => {
    console.log('Create request received:', req.body); // Log request body
    const sqlConnection = "INSERT INTO connections (`name`, `type`, `contact`) VALUES (?, ?, ?)";
    const connectionValues = [
        req.body.name,
        req.body.type,
        req.body.contact
    ];
    db.query(sqlConnection, connectionValues, (err, connectionData) => {
        if (err) return res.json(err);
        const partner_id = connectionData.insertId;
        const sqlPartnerResource = "INSERT INTO partner_resources (`partner_id`, `resource_id`, `specific_resource_desc`) VALUES (?, ?, ?)";
        const partnerResourceValues = [
            partner_id,
            req.body.resourceType,
            req.body.specificResourceDesc 
        ];
        db.query(sqlPartnerResource, partnerResourceValues, (err, partnerResourceData) => {
            if (err) return res.json(err);
            return res.json("created");
        });
    });
});

// app.put('/update/:id', (req, res) => {
//     const sql = "UPDATE connections SET `name` = ?, `type` = ?, `resource_id` = ?, `contact` = ? WHERE id = ?";
//     const id = req.params.id;
//     const values = [
//         req.body.name,
//         req.body.type,
//         req.body.resourceType,
//         req.body.contact
//     ];
//     db.query(sql, [...values, id], (err, data) => {
//         if (err) return res.json(err);
//         return res.json("updated");
//     });
// });

app.put('/update/:id', (req, res) => {
    console.log('Update request received:', req.body, req.params.id); // Log request body and params
    const sqlConnection = "UPDATE connections SET `name` = ?, `type` = ?, `contact` = ? WHERE id = ?";
    const connectionValues = [
        req.body.name,
        req.body.type,
        req.body.contact,
        req.params.id
    ];
    db.query(sqlConnection, connectionValues, (err, connectionData) => {
        if (err) return res.json(err);
        const sqlPartnerResource = "UPDATE partner_resources SET `resource_id` = ?, `specific_resource_desc` = ? WHERE partner_id = ?";
        const partnerResourceValues = [
            req.body.resourceType, // Ensure this matches the name in the frontend
            req.body.specificResourceDesc, // Ensure this matches the name in the frontend
            req.params.id
        ];
        db.query(sqlPartnerResource, partnerResourceValues, (err, partnerResourceData) => {
            if (err) return res.json(err);
            return res.json("updated");
        });
    });
});


// app.delete('/delete/:id', (req, res) => {
//     const sql = "DELETE FROM connections WHERE id =?";
//     const id = req.params.id;

//     db.query(sql, [id], (err, data) =>{
//         if(err) return res.json(err);
//         return res.json("deleted")
//     })
// })

// app.delete('/delete/:id', (req, res) => {
//     console.log('Delete request received:', req.params.id); // Log request params
//     const sql = "DELETE FROM connections WHERE id =?";
//     const id = req.params.id;
//     db.query(sql, [id], (err, data) => {
//         if (err) return res.json(err);
//         return res.json("deleted");
//     });
// });

app.delete('/delete/:id', (req, res) => {
    console.log('Delete request received:', req.params.id); // Log request params
    const id = req.params.id;

    db.beginTransaction((err) => {
        if (err) {
            console.error('Error starting transaction:', err);
            return res.status(500).json(err);
        }

        const sqlDeletePartnerResources = "DELETE FROM partner_resources WHERE partner_id = ?";
        db.query(sqlDeletePartnerResources, [id], (err, partnerResourceData) => {
            if (err) {
                return db.rollback(() => {
                    console.error('Error deleting from partner_resources:', err);
                    return res.status(500).json(err);
                });
            }

            const sqlDeleteConnections = "DELETE FROM connections WHERE id = ?";
            db.query(sqlDeleteConnections, [id], (err, connectionData) => {
                if (err) {
                    return db.rollback(() => {
                        console.error('Error deleting from connections:', err);
                        return res.status(500).json(err);
                    });
                }

                db.commit((err) => {
                    if (err) {
                        return db.rollback(() => {
                            console.error('Error committing transaction:', err);
                            return res.status(500).json(err);
                        });
                    }

                    console.log('Transaction completed successfully');
                    return res.json("deleted");
                });
            });
        });
    });
});

app.delete('/resources/:id', (req, res) => {
    const resourceIdToDelete = req.params.id;
    const { newResourceType, isNewResource } = req.body;

    console.log('Delete resource request received:', resourceIdToDelete, newResourceType, isNewResource);

    db.beginTransaction(err => {
        if (err) {
            console.error('Error starting transaction:', err);
            return res.status(500).json(err);
        }

        const proceedWithDelete = (newResourceId) => {
            const sqlUpdatePartnerResources = 'UPDATE partner_resources SET resource_id = ? WHERE resource_id = ?';
            db.query(sqlUpdatePartnerResources, [newResourceId, resourceIdToDelete], (err, updateData) => {
                if (err) {
                    console.error('Error updating partner resources:', err);
                    return db.rollback(() => {
                        res.status(500).json(err);
                    });
                }

                const sqlDeleteOldResource = 'DELETE FROM resources WHERE resource_id = ?';
                db.query(sqlDeleteOldResource, [resourceIdToDelete], (err, deleteData) => {
                    if (err) {
                        console.error('Error deleting old resource:', err);
                        return db.rollback(() => {
                            res.status(500).json(err);
                        });
                    }

                    db.commit(err => {
                        if (err) {
                            console.error('Error committing transaction:', err);
                            return db.rollback(() => {
                                res.status(500).json(err);
                            });
                        }

                        console.log('Old resource deleted successfully');
                        return res.json('Resource type replaced and old resource deleted');
                    });
                });
            });
        };

        if (isNewResource) {
            const sqlInsertResource = 'INSERT INTO resources (resource_type) VALUES (?)';
            db.query(sqlInsertResource, [newResourceType], (err, insertData) => {
                if (err) {
                    console.error('Error inserting new resource:', err);
                    return db.rollback(() => {
                        res.status(500).json(err);
                    });
                }

                const newResourceId = insertData.insertId;
                console.log('New resource inserted with ID:', newResourceId);
                proceedWithDelete(newResourceId);
            });
        } else {
            const sqlGetResourceId = 'SELECT resource_id FROM resources WHERE resource_type = ?';
            db.query(sqlGetResourceId, [newResourceType], (err, data) => {
                if (err) {
                    console.error('Error fetching resource ID:', err);
                    return db.rollback(() => {
                        res.status(500).json(err);
                    });
                }

                if (data.length > 0) {
                    const newResourceId = data[0].resource_id;
                    console.log('Existing resource found with ID:', newResourceId);
                    proceedWithDelete(newResourceId);
                } else {
                    console.error('New resource type not found');
                    return db.rollback(() => {
                        res.status(404).json({ message: 'New resource type not found' });
                    });
                }
            });
        }
    });
});


app.listen(8081, () => {
    console.log("listening...")
})