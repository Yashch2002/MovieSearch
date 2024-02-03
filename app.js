const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const app = express();
const axios = require('axios');

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'movies-api',
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to the database');
});
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});



app.get('/', (req, res) => {
  res.render('index');
});

app.get('/search', async (req, res) => {
  const searchString = req.query.searchString;
  const respond = await axios.get(`http://www.omdbapi.com/?s=${searchString}&apikey=c4757302`)
  const searchResults = respond.data.Search;
  if (!searchResults || searchResults.length === 0) {
    res.send('No results found.');
    return;
  }

  // searchResults.map((value)=>{

  // })

  res.render('search-results', { results: searchResults });

  // .then((response) => {
  //   const searchResults = response.data.Search;

  //   if (!searchResults || searchResults.length === 0) {
  //     res.send('No results found.');
  //     return;
  //   }

  //   res.render('search-results', { results: searchResults });
  // })
  // .catch((error) => {
  //   console.error(error);
  //   res.send('An error occurred during the API call.');
  // });
});

app.post('/insert', (req, res) => {
  const { title, year, type, poster } = req.body;

  const query = 'INSERT INTO  (Title, Year, Type, Poster) VALUES (?, ?, ?, ?)';
  db.query(query, [title, year, type, poster], (err, result) => {
    if (err) {
      console.error(err);
      res.send('Error inserting movie into database.');
    } else {
      console.log('Movie inserted successfully.');
      res.redirect('/');
    }
  });
});

app.get('/favorite', (req, res) => {
  db.query('SELECT * FROM favourites', (err, results) => {
    if (err) throw err;
    res.render('favourite', { favorites: results });
  });
});