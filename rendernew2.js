//set framework and dependencies
var express = require('express');
var app = express();
var url = require('url');

//mapnik and dependecies
var mapnik = require('mapnik');
var fs = require('fs');

var mapProjection = '+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext  +no_defs';
var map = new mapnik.Map(512, 512, mapProjection);

//mapnik
//mapnik.register_default_fonts();
//mapnik.register_default_input_plugins();

//mapnik pool
var mapnikPool = require('mapnik-pool')(mapnik);
var pool = mapnikPool.fromString(fs.readFileSync('./style.xml', 'utf8'), {
    'size': 512,
    'height': 512,
    'width': 512,
}, {});

//postgis
var settings = require('./settings.js');
var postgis = new mapnik.Datasource(settings.postgis);

app.get('/render', function (req, res) {
    console.log('request' + "\n");

    pool.acquire(function (err, map) {
        //console.log(map);

        var query = req.url.split('&');
        //console.log(query);

        var bbox = query[13].replace('BBOX=', '').split('%2C').map(function (item) {
            return parseFloat(item);
        });
        //get layer
        var layerName = query[5].replace('LAYERS=', '').split('%3A')[1];


        //set style, datasource
        var layer = new mapnik.Layer(layerName, mapProjection);
        layer.datasource = postgis;
        layer.styles = ['style_pg'];

        map.add_layer(layer);
        map.extent = bbox;
        //map.zoomAll(bbox);

        //console.log(map);

        var im = new mapnik.Image(512, 512);
        map.render(im, function (err, im) {
            if (err) throw err;
            im.encode('png', function (err, buffer) {
                if (err) throw err;
                fs.writeFile('./tiles/map' + Math.round(Math.random() * 10000) + '.png', buffer, function (err) {
                    if (err) throw err;


                    //send file must be here because async functions
                    res.setHeader('Content-Length', buffer.length);
                    res.setHeader('Content-Type', 'image/png');
                    /*res.sendFile('map' + Math.round(Math.random() * 10000) + '.png', {
                        'root': '/var/www/fmp/etc/nodejs/'
                    });*/
                    res.send(buffer);
                    //console.log('saved map image to map.png');
                });
            });
        });
        //});
    });
});

app.listen(3003, () => {
    console.log('Server is running on port 3003');
  });
