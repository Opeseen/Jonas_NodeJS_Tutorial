console.log('hello from the client side');
const locations = JSON.parse(document.getElementById('map').dataset.locations);

mapboxgl.accessToken = 'pk.eyJ1Ijoib3Blc2VlbiIsImEiOiJjbHc5Ymhrb3owMXJyMmtwbDE2aWw1eTlqIn0.wSmxYwrSmTXIL91Ma7s2sA';
const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v11',
  projection: 'globe', // Display the map as a globe, since satellite-v9 defaults to Mercator
  scrollZoom: false
});

const bonds = new mapboxgl.LngLatBounds();

locations.forEach(loc => {
  // Cresate marker
  const element = document.createElement('div');
  element.className = 'marker';

  // Add marker
  new mapboxgl.Marker({
    el: element,
    anchor: 'buttom'
  }).setLngLat(loc.coordinates).addTo(map);
  // Add popup
  new mapboxgl.Popup({offset: 30})
    .setLngLat(loc.coordinates)
    .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
    .addTo(map)
  // Extend map bounds to include current location
  bonds.extend(loc.coordinates);
});

map.fitBounds(bonds, {
  padding: {
    top: 150,
    left: 100,
    bottom: 150,
    right: 100
  }
});