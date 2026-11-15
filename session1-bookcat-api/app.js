const express = require('express');
const sql = require('mssql');
const app = express();
app.use(express.json());

const dbConfig={
    server : 'localhost',
    database : 'NPBookstore',
    user : 'npbookstore_user',
    password : '',
    options : {
        trustServerCertificate : true
    }
}

app.get('/', (req, res) => {
res.send('Welcome to the Book Category API');
});
app.get('/categories', (req, res) => {
res.json([
{ id: 1, name: 'Fiction' },
{ id: 2, name: 'Non-Fiction' },
{ id: 3, name: 'Biography' }
]);
});
app.get('about')
app.listen(3000, () => {
console.log('Listening on port 3000');
});
// GET /authors/:id
app.get('/authors/:id', async (req, res) => {
    const authorId = parseInt(req.params.id);
    if (isNaN(authorId)) {
        return res.status(400).json({ error: 'Invalid id' });
    }
    let connection;
    try {
        connection = await sql.connect(dbConfig);
        const request = connection.request();
        request.input('id', authorId);
        const sqlQuery = `SELECT AuthorID, Name
                          FROM Author
                          WHERE AuthorID = @id`;
        const result = await request.query(sqlQuery);
        if (result.recordset.length === 0) {
            return res.status(404).json({ error: 'Not found' });
        }
        res.status(200).json(result.recordset[0]);
    } catch (err) {
        res.status(500).json({ error: 'Database error' });
    } finally {
        if (connection) await connection.close();
    }
});
app.post('/echo/:id', (req, res ) => {
    console.log('params: ', req.params);
    console.log('query: ', req.query);
    console.log('body: ',req.body);
    res.status(200).json({ok:true});
})