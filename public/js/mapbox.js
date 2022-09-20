// var mapboxgl = require('mapbox-gl/dist/mapbox-gl');
// console.log('Hello from the client side')

// const locations = JSON.parse(document.getElementById('map').dataset.locations);

// console.log(locations)

// mapboxgl.accessToken = 'pk.eyJ1IjoiZ29tYmFsIiwiYSI6ImNsODF3YTczZDBrN2Yzd3IxOTZhc2c2OHIifQ.MTGzlp_E__kT6dnY6TMgkg';

//   var map = new mapboxgl.Map({
//     container: 'map',
//     style: 'mapbox://styles/gombal/cl81wx6gc001x14qgc8kbnnxf',
//     center: [34.111745,-118.113491],
//     zoom: 4,
//     interactive: false
// });

/* eslint-disable */
export const displayMap = locations => {
  mapboxgl.accessToken = 'pk.eyJ1IjoiZ29tYmFsIiwiYSI6ImNsODF3YTczZDBrN2Yzd3IxOTZhc2c2OHIifQ.MTGzlp_E__kT6dnY6TMgkg';

  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/gombal/cl81wx6gc001x14qgc8kbnnxf',
    scrollZoom: false
    // center: [-118.113491, 34.111745],
    // zoom: 10,
    // interactive: false
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach(loc => {
    // Create marker
    const el = document.createElement('div');
    el.className = 'marker';

    // Add marker
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom'
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    // Add popup
    new mapboxgl.Popup({
      offset: 30
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map);

    // Extend map bounds to include current location
    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 100,
      right: 100
    }
  });
};
