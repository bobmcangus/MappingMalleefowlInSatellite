/*  Bring in study area envelope and basic map view settings: */
var constants = require('users/RichardF/MappingMalleefowl:StudyArea');
var box = constants.StudyEnvelope;
var mapArea = constants.StudyMapArea;

/* Import Sentinel image collections: */
var Sent2 = ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED")
var SenTOA = ee.ImageCollection("COPERNICUS/S2_HARMONIZED")

/*  Define variables to allow easier code reading: */
var startDate = '2022-10-01'; 
var endDate = '2022-10-31';

/*  Sentinel 2 variables: */
var BLUE = 'B2';//10m 496.6nm (S2A) / 492.1nm (S2B)
var GREEN = 'B3';//10m 560nm (S2A) / 559nm (S2B)
var RED = 'B4';//10m 664.5nm (S2A) / 665nm (S2B)
var RE1 = 'B5';//20m 703.9nm (S2A) / 703.8nm (S2B)
var RE2 = 'B6';//20m 740.2nm (S2A) / 739.1nm (S2B)
var RE3 = 'B7';//20m 782.5nm (S2A) / 779.7nm (S2B)
var NIR = 'B8';//10m 835.1nm (S2A) / 833nm (S2B)
var RE4 = 'B8A';//20m 864.8nm (S2A) / 864nm (S2B)
var SWIR1 = 'B11';//20m 1613.7nm (S2A) / 1610.4nm (S2B)
var SWIR2 = 'B12';//20m 2202.4nm (S2A) / 2185.7nm (S2B)
var visParams = {
  bands: [RED, GREEN, BLUE], 
  min: 0.0, 
  max: 4000
};


/*  Build and print image which just has the 10m-resolution bands for the surface reflectance product: */
var Sentinel2_SR_10mBands_20221010 = ee.Image(
  Sent2.filterDate(startDate, endDate)
    .filterBounds(box)
    .sort('CLOUD_COVERAGE_ASSESSMENT')
    .first()
    .select(BLUE, GREEN, RED, NIR)
);
print(Sentinel2_SR_10mBands_20221010);

/*  Build and print image which just has the 20m-resolution bands for the surface reflectance product: */
var Sentinel2_SR_20mBands_20221010 = ee.Image(
  Sent2.filterDate(startDate, endDate)
    .filterBounds(box)
    .sort('CLOUD_COVERAGE_ASSESSMENT')
    .first()
    .select(RE1, RE2, RE3, RE4, SWIR1, SWIR2)
);
print(Sentinel2_SR_20mBands_20221010);

/*  Build and print image which just has the 10m-resolution bands for the TOA reflectance product: */
var Sentinel2_TOA_10mBands_20221010 = ee.Image(
  SenTOA.filterDate(startDate, endDate)
    .filterBounds(box)
    .sort('CLOUD_COVERAGE_ASSESSMENT')
    .first()
    .select(BLUE, GREEN, RED, NIR)
);
print(Sentinel2_TOA_10mBands_20221010);

/*  Build and print image which just has the 20m-resolution bands for the TOA reflectance product: */
var Sentinel2_TOA_20mBands_20221010 = ee.Image(
  SenTOA.filterDate(startDate, endDate)
    .filterBounds(box)
    .sort('CLOUD_COVERAGE_ASSESSMENT')
    .first()
    .select(RE1, RE2, RE3, RE4, SWIR1, SWIR2)
);
print(Sentinel2_TOA_20mBands_20221010);

var sentProj10 = Sentinel2_SR_10mBands_20221010.projection().getInfo()
print(sentProj10)
var sentProj20 = Sentinel2_SR_20mBands_20221010.projection().getInfo()
print(sentProj20)

Map.setCenter(mapArea);
Map.addLayer(Sentinel2_SR_10mBands_20221010, visParams, 'Sentinel 2 Image');

/* Export the image, specifying the CRS */
Export.image.toDrive({
  image: Sentinel2_SR_10mBands_20221010,
  description: 'Sentinel2_SR_10m_20221010',
  scale: 10,
  maxPixels: 500000000,
  crs: sentProj10.crs
  //crsTransform: projection.transform
});

/* Export the image, specifying the CRS */
Export.image.toDrive({
  image: Sentinel2_SR_20mBands_20221010,
  description: 'Sentinel2_SR_20m_20221010',
  scale: 20,
  maxPixels: 500000000,
  crs: sentProj20.crs
  //crsTransform: projection.transform
});

/* Export the image, specifying the CRS */
Export.image.toDrive({
  image: Sentinel2_TOA_10mBands_20221010,
  description: 'Sentinel2_TOA_10m_20221010',
  scale: 10,
  maxPixels: 500000000,
  crs: sentProj10.crs
  //crsTransform: projection.transform
});

/* Export the image, specifying the CRS */
Export.image.toDrive({
  image: Sentinel2_TOA_20mBands_20221010,
  description: 'Sentinel2_TOA_20m_20221010',
  scale: 20,
  maxPixels: 500000000,
  crs: sentProj20.crs
  //crsTransform: projection.transform
});