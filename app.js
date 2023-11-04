const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const exphbs = require('express-handlebars');
const hbs = exphbs.create({ extname: '.hbs' });
const port = process.env.PORT || 3000;

// Define a Handlebars helper to replace empty strings with "unknown" and add a class for highlighting
hbs.handlebars.registerHelper('replaceEmptyAndHighlight', function (value) {
    if (value === '') {
        return 'unknown';
    }
    return value;
});


// Configure Handlebars as the view engine
app.engine('.hbs', hbs.engine);
app.set('view engine', 'hbs');

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

let jsonData = [];

fs.readFile(path.join(__dirname, 'CarSales.json'), 'utf8', (err, data) => {
  if (err) {
    console.error(err);
  } else {
    jsonData = JSON.parse(data);
    console.log('JSON data is loaded and ready!');
  }
});

app.get('/', function (req, res) {
  res.render('index', { title: 'Express' });
});

app.get('/users', function (req, res) {
  res.send('respond with a resource');
});

app.get('/about', (req, res) => {
  res.redirect('https://chintan-w-portfolio.netlify.app/');
});

app.get('/allData', (req, res) => {
  if (jsonData) {
    res.render('layouts/allData', { title: 'All Sales Data', data: jsonData });
  } else {
    res.status(500).send('Error reading JSON file');
  }
});

app.get('/alldata/invoiceNo/:index', (req, res) => {
  const index = parseInt(req.params.index);

  if (jsonData && index >= 0 && index < jsonData.length) {
    const invoiceNo = jsonData[index].InvoiceNo;
    if (invoiceNo) {
      res.send(`InvoiceNo: ${invoiceNo}`);
    } else {
      res.status(400).send('InvoiceNo not found for this index');
    }
  } else {
    res.status(400).send('Invalid index or data not found');
  }
});
app.get('/allData/Step6', (req, res) => {
    const searchQuery = req.query.search;
    let filteredData = jsonData;

    if (searchQuery) {
        // Filter data based on searchQuery (InvoiceNo or Manufacturer)
        filteredData = jsonData.filter(item => {
            return (
                item.InvoiceNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.Manufacturer.toLowerCase().includes(searchQuery.toLowerCase())
            );
        });
    }

    if (filteredData.length > 0) {
        res.render('layouts/allDataStep6', { title: 'All Sales Data', data: filteredData });
    } else {
        res.status(404).send('No matching data found.');
    }
});

app.get('/allData/Step8', (req, res) => {
  const filteredData = jsonData.filter(item => item.class !== '');

  if (filteredData.length > 0) {
    res.render('layouts/allData', { title: 'All Sales Data', data: filteredData });
  } else {
    res.status(500).send('No data with a non-blank "class" field found');
  }
});

app.get('/allData/Step9', (req, res) => {
    res.render('layouts/allData', { title: 'All Sales Data', data: jsonData });
});
  
 
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
