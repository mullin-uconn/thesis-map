
	mapboxgl.accessToken = 'pk.eyJ1IjoiYnBkMDEwMDEiLCJhIjoiY2pyd2YxM2g2MGMzeDQ0bzR4dXptN21tdyJ9.fyLty-7Dtf7q0oMJiHvAjg';
    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/dark-v10',
        center: [-72.6, 41.5],
        zoom: 8
    });

    map.on('load', () => {
        // Add a geojson point source.
        // Heatmap layers also work with a vector tile source.
        map.addSource('sightings', {
            'type': 'geojson',
            'data': './data.geojson'
        });

        map.addLayer(
            {
                'id': 'sightings-heat',
                'type': 'heatmap',
                'source': 'sightings',
                'maxzoom': 9,
                'paint': {
                    // Increase the heatmap weight based on frequency and property magnitude
                    'heatmap-weight': [
                        'interpolate',
                        ['linear'],
                        ['get', 'mag'],
                        0,
                        0,
                        6,
                        1
                    ],
                    // Increase the heatmap color weight weight by zoom level
                    // heatmap-intensity is a multiplier on top of heatmap-weight
                    'heatmap-intensity': [
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        0,
                        1,
                        9,
                        3
                    ],
                    // Color ramp for heatmap.  Domain is 0 (low) to 1 (high).
                    // Begin color ramp at 0-stop with a 0-transparancy color
                    // to create a blur-like effect.
                    'heatmap-color': [
                        'interpolate',
                        ['linear'],
                        ['heatmap-density'],
                        0,
                        'rgba(67, 73, 103,0)',
                        0.2,
                        'rgb(60, 73, 129)',
                        0.4,
                        'rgb(207, 212, 233)',
                        0.6,
                        'rgb(226, 248, 229)',
                        0.8,
                        'rgb(185, 237, 192)',
                        1,
                        'rgb(118, 221, 132)'
                    ],
                    // Adjust the heatmap radius by zoom level
                    'heatmap-radius': [
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        0,
                        2,
                        9,
                        20
                    ],
                    // Transition from heatmap to circle layer by zoom level
                    'heatmap-opacity': [
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        7,
                        1,
                        9,
                        0
                    ]
                }
            },
            'waterway-label'
        );

        map.addLayer(
            {
                'id': 'sightings-point',
                'type': 'circle',
                'source': 'sightings',
                'minzoom': 7,
                'paint': {
                    // Size circle radius by earthquake magnitude and zoom level
                    'circle-radius': [
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        7,
                        ['interpolate', ['linear'], ['get', 'mag'], 1, 1, 6, 4],
                        16,
                        ['interpolate', ['linear'], ['get', 'mag'], 1, 5, 6, 50]
                    ],
                    // Color circle by earthquake magnitude
                    'circle-color': [
                        'interpolate',
                        ['linear'],
                        ['get', 'mag'],
                        1,
                        'rgba(33,102,172,0)',
                        2,
                        'rgb(103,169,207)',
                        3,
                        'rgb(209,229,240)',
                        4,
                        'rgb(253,219,199)',
                        5,
                        'rgb(239,138,98)',
                        6,
                        'rgb(178,24,43)'
                    ],
                    'circle-stroke-color': 'white',
                    'circle-stroke-width': 1,
                    // Transition from heatmap to circle layer by zoom level
                    'circle-opacity': [
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        7,
                        0,
                        8,
                        1
                    ]
                }
            },
            'waterway-label'
        );
    });
