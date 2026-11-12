import express from 'express';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';


const app = express()
const port = 3000;

const __dirname = dirname(fileURLToPath(import.meta.url));

const db = new pg.Client({
    database: "world",
    host: "localhost",
    user: "postgres",
    password: "champion",
    port: 5432
})

db.connect()

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render(__dirname + '/views/index.ejs');
})

app.listen(port, () => {
    console.log(`server is running on port ${port}`);
})