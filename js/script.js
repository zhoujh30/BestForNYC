//////////////////////////////////////////////////
//  Design and code: Jorge Cortes, MGIS Unit    //
//  Created: June, 2015                         //
//                                              //
//////////////////////////////////////////////////

//JS and Leaflet code  

//Loads "EDC" base map outside of layer control
L.mapbox.accessToken = 'pk.eyJ1IjoibnljZWRjbWlzZ2lzIiwiYSI6ImViWWc2bXMifQ.tQLdsPcTjM1Db66vk8YoPA';
var map=L.mapbox.map('map', 'nycedcmisgis.ndh346pj', {attributionControl:false}).setView([40.717869, -73.956973],11);

//Shortened attribution, provided by Mapbox support
var credits = L.control.attribution({prefix:''}).addTo(map);
credits.addAttribution('© Mapbox © OpenStreetMap');

//Creates icon class for markers
var classIcon=L.Icon.extend({
    options:{
        iconSize:[27,35],
        iconAnchor:[13.5,35],
        popupAnchor:[0,-30]
    }
});

//Unique icons for classification
var Green = new classIcon({iconUrl: 'Images/Green-Marker.png'}),
    Red = new classIcon({iconUrl: 'Images/Red-Marker.png'}),
    Amber = new classIcon({iconUrl: 'Images/Amber-Marker.png'});

//Layers to receive classified csv data
var Finalist = new L.LayerGroup(),
    Participant = new L.LayerGroup();

//Add all data layers to map
var hireLayer=L.layerGroup([Finalist, Participant])
  .addTo(map);

//Function to sort csv data by "status" field
function lSort(marker) {
    L.setOptions(marker, {riseOnHover:true, riseOffset:100});
    var BestForNYC = marker.toGeoJSON();
    if (BestForNYC.properties.status=='Finalist'){
        Finalist.addLayer(marker).eachLayer(FinalistPopUp);
        marker.setIcon(Green);
        }
    else if (BestForNYC.properties.status=='Participant'){
        Participant.addLayer(marker).eachLayer(ParticipantPopUp);
        marker.setIcon(Amber);
        }
    }

//Load csv file
var points = omnivore.csv('Data/BestForNYC.csv', {delimiter: ','})
    .on('ready', function(){
        points.eachLayer(lSort)
    });

//Layer selection
    //For base layers
var layers = {
      Basemap: L.mapbox.tileLayer(), //keep empty for base map
      Aerial: L.mapbox.tileLayer('nycedcmisgis.lmlfhbhh',{attribution:''}) 
  };

    //For data layers
var groupedOverlays = {
    "Companies":{
    Finalist: Finalist,
    Participant: Participant
    }
};

//Defines which base layer will load as default
  layers.Basemap.addTo(map);

//Layer controls
  L.control.groupedLayers(layers, groupedOverlays, {position:'topleft'}).addTo(map);

//POPUP FUNCTIONS
function FinalistPopUp(layer){
layer.bindPopup("<div class='popup'><table><tbody><tr><td colspan='2'><br><b>Company: </b>"+layer.feature.properties.company+"</td></tr><tr><td colspan='3'></br><b>Status: </b>"+layer.feature.properties.status+"</td></tr><tr><td colspan='3'></br><b>Industry: </b>"+layer.feature.properties.industry+"</td></tr><tr><td colspan='3'></br><b>Size: </b>"+layer.feature.properties.size+"</td></tr><tr><td colspan='3'></br><b>Score: </b>"+layer.feature.properties.score+"</td></tr></tbody></table></div>");
}

function ParticipantPopUp(layer){
layer.bindPopup("<div class='popup'><table><tbody><tr><td colspan='2'><br><b>Company: </b>"+layer.feature.properties.company+"</td></tr><tr><td colspan='3'></br><b>Status: </b>"+layer.feature.properties.status+"</td></tr><tr><td colspan='3'></br><b>Industry: </b>"+layer.feature.properties.industry+"</td></tr><tr><td colspan='3'></br><b>Size: </b>"+layer.feature.properties.size+"</td></tr><tr><td colspan='3'></br><b>Score: </b>"+layer.feature.properties.score+"</td></tr></tbody></table></div>");
}
