var path = require('path');

module.exports.styles = path.join(__dirname, 'styles');

module.exports.postgis = {
    'dbname' : 'osm',
    'table': 'morocco_roads',
    'geometry_field' : 'geom',
    'srid' : 3857,
    'user' : 'osmrehan05',
    'password': 'Pakistan12@',
    'max_size' : 10,
    'type' : 'postgis',
    'port': '5432',
    'host': 'localhost',
    'extent' : '-20005048.4188,-9039211.13765,19907487.2779,17096598.5401'  //set for epsg: 3857
};
