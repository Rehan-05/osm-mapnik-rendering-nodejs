

const mapnik = require('mapnik');
const express = require('express');
const app = express();
const { Pool } = require('pg'); // PostgreSQL client library
const path = require('path'); // Import the 'path' module
const fs = require('fs');
//mapnik.register_default_fonts();
mapnik.register_default_input_plugins();

const styleXMLString  = fs.readFileSync('./style.xml', 'utf8');


// Configure PostgreSQL connection
const pool = new Pool({
  user: 'osmrehan05',
  host: 'localhost',
  database: 'osm',
  password: 'pakistan12@',
  port: 5432, // Default PostgreSQL port
});


// Verify PostgreSQL Connection
pool.connect((connectError, client, release) => {
  if (connectError) {
    console.error('Error connecting to PostgreSQL:', connectError);
  } else {
    console.log('Connected to PostgreSQL');
  }
  release();
});


// Load Mapnik XML style
const map = new mapnik.Map(800, 600);
//const styleXMLString  = fs.readFileSync('./style.xml', 'utf8'); 
//map.fromStringSync(styleXMLString);


app.get('/render', (req, res) => {
//const query = 'SELECT * FROM morocco_roads';
//console.log('Executing PostgreSQL query:', query);

  //pool.query(query, (error, result) => {

 // if (error) {
   // console.error('Error retrieving data from PostgreSQL:', error);
   // res.status(500).send('Error retrieving data from PostgreSQL');
   // return;
 // }

 // const map = new mapnik.Map(800, 600);
   // try {
    //  map.fromStringSync(styleXMLString);
   // } catch (parseError) {
     // console.error('Error parsing Mapnik stylesheet:', parseError);
     // res.status(500).send('Error parsing Mapnik stylesheet');
     // return;
   // }  

    // Create a Mapnik layer and add it to the map
   // const layer = new mapnik.Layer('osm_layer');
 // console.log("here is the layer", layer);   
// layer.datasource = new mapnik.Datasource({
  //    type: 'postgis',
    //  host: 'localhost',
     // dbname: 'osm',
     // table: 'morocco_roads',
     // user: 'osmrehan05',
     // password: 'pakistan12@',
   // });
   // layer.styles = [styleXMLString]; // Replace with the appropriate style name from your Mapnik XML

   // map.add_layer(layer);

    // Render the map
   // map.zoomAll();
   // map.render(new mapnik.Image(800, 600), (renderError, image) => {
     // if (renderError) {
       // console.error('Error rendering map:', renderError);
       // res.status(500).send('Error rendering map');
       // return;
     // }

      // Send the rendered image as a response
     // res.setHeader('Content-Type', 'image/png');
     // res.send(image.encodeSync('png'));
   // });
 // });

   // Get a Mapnik datasource object from the pool
 map.fromStringSync(styleXMLString);
  pool.acquire((error, datasource, release) => {
    if (error) {
      console.error('Error getting datasource from pool:', error);
      res.status(500).send('Error getting datasource from pool');
      return;
    }
    
    const datasources = new mapnik.Datasource({
    type: 'mapserver',
    file: '/path/to/MapServer/shapefile.shp',
    });

    // Create a Mapnik layer and add it to the map
    const layer = new mapnik.Layer('world');
    layer.datasource = datasources;
    layer.styles = [styleXMLString];

    map.add_layer(layer);

    // Render the map
    map.zoomAll();
    map.render(new mapnik.Image(800, 600), (renderError, image) => {
      release(); // Release the datasource back to the pool

      if (renderError) {
        console.error('Error rendering map:', renderError);
        res.status(500).send('Error rendering map');
        return;
      }

      // Send the rendered image as a response
      res.setHeader('Content-Type', 'image/png');
      res.send(image.encodeSync('png'));
    });
  });

});

app.listen(3003, () => {
  console.log('Server is running on port 3003');
});
