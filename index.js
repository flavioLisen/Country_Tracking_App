import express from 'express';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';
import pg from 'pg';
import { error } from 'console';


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

app.use(bodyParser.urlencoded({extends: true}));

let currentUser;

db.connect()

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render(__dirname + '/views/index.ejs');
})

app.post('/user', async (req, res) => {

    let list = []

    try{
        currentUser = await db.query("SELECT (id) FROM users WHERE f_name = $1", [req.body['username']]);

        const UserVisitedCountries = await db.query("SELECT (country_code) FROM countries_visited WHERE userid = $1", [currentUser.rows[0].id])

        UserVisitedCountries.rows.forEach(element => {
            list.push(element.country_code);
        });

        console.log(list);

        if (UserVisitedCountries.rows.length != 0) {
            res.render(__dirname + '/views/index.ejs', {
                userData: list,
                numOfCountries: UserVisitedCountries.rows.length
            });
        } else {
            res.render(__dirname + '/views/index.ejs', {
                errorMessage: "Seems you have not recorded any country. Please add a country that you have visited."
            });
        }
    } catch (err) {
        console.error("Oops, there seems to be an error: " + err)
    }
})

app.post('/add', async (req, res) => {
    const country = req.body['country'];

    try {
        const countryCode = await db.query("SELECT (country_code) FROM countries WHERE country_name = $1", [country]);

        await db.query("INSERT INTO countries_visited (userid, country_code) VALUES ($1, $2)", [currentUser.rows[0].id, countryCode.rows[0].country_code]);

    } catch (err) {
        console.error("Oops, there seems to be an error: " + err)
    }   
})

app.listen(port, () => {
    console.log(`server is running on port ${port}`);
})