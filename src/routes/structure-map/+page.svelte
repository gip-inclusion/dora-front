<script lang="ts">
	import MapToolbar from './toolbar.svelte';
	const library = `<svg style="width:30px;height:30px" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"></path></svg>`;
	let map;
	import { getStructuresPublic } from "$lib/requests/structures";
	import MarkerPopup from './markerPopup.svelte';

	const initialView = [48.854338, 2.650104];
	function createMap(container) {
	  let m = L.map(container, {preferCanvas: true }).setView(initialView, 7);
    L.tileLayer(
	    'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
	    {
	      attribution: `&copy;<a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>,
	        &copy;<a href="https://carto.com/attributions" target="_blank">CARTO</a>`,
	      subdomains: 'abcd',
	      maxZoom: 14,
	    }
	  ).addTo(m);

    return m;
  }

	let eye = true;
	let lines = true;

	let toolbar = L.control({ position: 'topright' });
	let toolbarComponent;
	toolbar.onAdd = (map) => {
		let div = L.DomUtil.create('div');
		toolbarComponent = new MapToolbar({
			target: div,
			props: {}
		});

		toolbarComponent.$on('click-eye', ({ detail }) => eye = detail);
		toolbarComponent.$on('click-lines', ({ detail }) => lines = detail);
		toolbarComponent.$on('click-reset', () => {
			map.setView(initialView, 5, { animate: true })
		})

		return div;
	}

	toolbar.onRemove = () => {
		if(toolbarComponent) {
			toolbarComponent.$destroy();
			toolbarComponent = null;
		}
	};

	let markers = new Map();

	function markerIcon() {
		let html = `<div class="map-marker"><div>${library}</div></div>`;
		return L.divIcon({
			html,
			className: 'map-marker'
		});
	}


	function createMarker(loc, name) {
		let icon = markerIcon();
		let marker = L.marker(loc, {icon});
		let n = name;
        bindPopup(marker, (m) => {
			let c = new MarkerPopup({
				target: m,
				props: {
					n
				}
			});
			return c;
		});

		return marker;
	}

    function bindPopup(marker, createFn) {
		let popupComponent;
		marker.bindPopup(() => {
			let container = L.DomUtil.create('div');
			popupComponent = createFn(container);
			return container;
		});

		marker.on('popupclose', () => {
			if(popupComponent) {
				let old = popupComponent;
				popupComponent = null;
				setTimeout(() => {
					old.$destroy();
				}, 500);

			}
		});
	}
	let markerLayers;

  async function mapAction(container) {
    map = createMap(container);
		toolbar.addTo(map);
		markerLayers = L.layerGroup()
        const structures =  await getStructuresPublic();
 		for(let structure of structures) {
 		debugger;
 		  if(structure.geocoding_score > 0.5)
 		  {
 			let m = createMarker({'lat': structure.latitude, 'lon': structure.longitude}    , structure.nom);
			markerLayers.addLayer(m);
		  }
 		}

		markerLayers.addTo(map);
    return {
       destroy: () => {
				 toolbar.remove();
				 map.remove();
				 map = null;
			 }
    };
	}
	$: if(markerLayers && map) {
		if(eye) {
			markerLayers.addTo(map);
		} else {
			markerLayers.remove();
		}
	}

	function resizeMap() {
	  if(map) { map.invalidateSize(); }
  }

</script>
<svelte:window on:resize={resizeMap} />

<style>
	.map :global(.marker-text) {
		width:100%;
		text-align:center;
		font-weight:600;
		background-color:#444;
		color:#EEE;
		border-radius:0.5rem;
	}

	.map :global(.map-marker) {
		width:30px;
		transform:translateX(-50%) translateY(-25%);
	}
</style>

<link rel="stylesheet" href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css"
   integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ=="
   crossorigin=""/>
<div class="map" style="height:400px;width:100%" use:mapAction />
