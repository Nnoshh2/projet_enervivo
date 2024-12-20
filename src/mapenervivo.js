import Map from 'ol/Map';
import View from 'ol/View';
import Feature from 'ol/Feature';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import {Style, Fill, Stroke, Icon} from 'ol/style';
import TileWMS from 'ol/source/TileWMS';
import Vector from 'ol/source/Vector';
import * as olProj from 'ol/proj';
import GeoJSON from 'ol/format/GeoJSON';
import Point from 'ol/geom/Point';
import {OSM} from 'ol/source';


class CadastreMap {
    constructor(container, options = {}) {
        this.primary_color = options.primary_color || '#3f85e8';
        this.zoom = options.zoom !== undefined && options.zoom !== null ? options.zoom : 6;
        this.zoom_min = options.zoom_min !== undefined && options.zoom_min !== null ? options.zoom_min : 0;
        this.zoom_max = options.zoom_max !== undefined && options.zoom_max !== null ? options.zoom_max : 100;
        this.center = options.center || [2.5, 46.85]
        this.selected_cadastre = {};
        this.container = container;
        this.map = null;
        this._create_map()
    }

    _create_map() {
        var cadastreLayer = new TileLayer({
            source: new TileWMS({
                url: 'https://data.geopf.fr/wms-r',
                params: {
                    'LAYERS': 'CADASTRALPARCELS.PARCELLAIRE_EXPRESS',
                    'FORMAT': 'image/png',
                    'TRANSPARENT': true
                }
            })
        });

        var photoLayer = new TileLayer({
            source: new TileWMS({
                url: 'https://data.geopf.fr/wms-r',
                params: {'LAYERS': 'ORTHOIMAGERY.ORTHOPHOTOS'} // Remplacez par les paramètres appropriés
            })
        });

        this.map = new Map({
            target: this.container,
            layers: [
                photoLayer,
                cadastreLayer,
            ],
            view: new View({
                center: olProj.fromLonLat(this.center),
                zoom: this.zoom,
                maxZoom: this.zoom_max,
                minZoom: this.zoom_min,
            })
        });
    }

    // Allows you to centre the map on a specific point
    // Used, for example, for an address search with https://data.geopf.fr/geocodage/search
    center_map_to(latitude, longitude, zoom = 17) {
        this.map.getView().setCenter(olProj.fromLonLat([latitude, longitude]));
        this.map.getView().setZoom(zoom);
        this.center = [latitude, longitude]
    }

    // Launches the "click" event manager on the map
    listen_cadastre_click(url_action) {

        var obj = this

        this.map.on('click', function (event) {
            var coordinate = event.coordinate;
            var params = new URLSearchParams({x: coordinate[0], y: coordinate[1]}).toString()

            // Adds a temporary mark on the map where the user has clicked
            var marker = new VectorLayer({
                source: new Vector({
                    features: [
                        new Feature({
                            geometry: new Point(coordinate),
                        })
                    ],
                }),
            })
            this.addLayer(marker);

            // Retrieves information about the parcel clicked
            fetch(`${url_action}?${params}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('HTTP Error : ' + response.status);
                    }
                    return response.json();
                })
                .then(data => {
                    if (data.error) {
                        alert(data.error.message);
                    } else if (data.feature) {
                        if (data.feature.id in obj.selected_cadastre) {
                            obj.remove_cadastre_layer(data.feature);
                        } else {
                            obj.add_cadastre_layer(data.feature);
                        }
                    }
                    obj.map.removeLayer(marker);
                })
                .catch(error => {
                    alert('Error :', error);
                    obj.map.removeLayer(marker);
                });

        });
    }

    add_cadastre_layers(data) {
        var obj = this
        var jsonData = JSON.parse(data);
        if (jsonData.length) {
            jsonData.forEach(function (feature) {
                obj.add_cadastre_layer(feature)
            });
        }
    }

    // Adds the cadastral parcel to the list of selections and adds a mask to it
    add_cadastre_layer(data) {

        var selected_cadastre_style = new Style({
            fill: new Fill({
                color: this.primary_color + '44'
            }),
            stroke: new Stroke({
                color: this.primary_color + 'CC', // Couleur de la bordure (rouge dans cet exemple)
                width: 2 // Largeur de la bordure
            }),
        });

        var vectorSource = new Vector({
            features: new GeoJSON().readFeatures(data)
        });

        var vectorLayer = new VectorLayer({
            source: vectorSource,
            style: selected_cadastre_style
        });

        this.selected_cadastre[data.id] = {'feature': data, 'layer': vectorLayer}

        this.map.addLayer(vectorLayer);

        document.getElementById(this.container).dispatchEvent(new CustomEvent('cadastre_selected_change', {
            detail: {
                selected_cadastre: this.selected_cadastre,
            }
        }))
    }

    remove_cadastre_layer_by_id(id) {
        this.map.removeLayer(this.selected_cadastre[id]['layer']);
        delete this.selected_cadastre[id]

        document.getElementById(this.container).dispatchEvent(new CustomEvent('cadastre_selected_change', {
            detail: {
                selected_cadastre: this.selected_cadastre,
            }
        }))
    }

    // Remove the cadastral parcel to the list of selections and remove its mask
    remove_cadastre_layer(data) {
        this.remove_cadastre_layer_by_id(data.id)
    }

    add_marker(latitude, longitude) {
        var marker = new VectorLayer({
            source: new Vector({
                features: [
                    new Feature({
                        geometry: new Point(olProj.fromLonLat([latitude, longitude])),
                    })
                ],
            }),
        })
        this.map.addLayer(marker);
    }
}

/*
Object to simplify the use of the OpenLayer library
Generates a map
 */
class SimpleMap {
    constructor(container, options = {}) {
        this.primary_color = options.primary_color || '#000000';
        this.marker_color = options.marker_color || '#fb5c5c';
        this.zoom = options.zoom !== undefined && options.zoom !== null ? options.zoom : 6;
        this.zoom_min = options.zoom_min !== undefined && options.zoom_min !== null ? options.zoom_min : 0;
        this.zoom_max = options.zoom_max !== undefined && options.zoom_max !== null ? options.zoom_max : 100;
        this.lock_map = options.lock_map || false
        this.mod_world = options.mod_world || false
        this.center = options.center || [2.5, 46.85]
        this.show_departments = options.show_departments !== undefined && options.show_departments !== null ? options.show_departments : true;
        this.show_regions = options.show_regions !== undefined && options.show_regions !== null ? options.show_regions : true;
        this.map = null;
        this.container = container;
        this._create_map()
    }

    _create_map() {
        var photoLayer = new TileLayer({
            source: new TileWMS({
                url: 'https://data.geopf.fr/wms-r',
                params: {'LAYERS': 'ORTHOIMAGERY.ORTHOPHOTOS'} // Remplacez par les paramètres appropriés
            })
        });

        var borderLayer = new VectorLayer({
            source: new Vector({
                url: '/static/carto/asset/fr.json',
                format: new GeoJSON()
            }),
            style: new Style({
                fill: new Fill({
                    color: '#00000000',
                }),
                stroke: new Stroke({
                    color: this.primary_color + 'FF',
                    width: 2 // Largeur de la bordure
                }),
            })
        });

        var regionLayer = new VectorLayer({
            source: new Vector({
                url: '/static/carto/asset/fr_region.json',
                format: new GeoJSON()
            }),
            style: new Style({
                fill: new Fill({
                    color: '#00000000',
                }),
                stroke: new Stroke({
                    color: this.primary_color + '55',
                    width: 1 // Largeur de la bordure
                }),
            })
        });

        var departmentLayer = new VectorLayer({
            source: new Vector({
                url: '/static/carto/asset/fr_department.json',
                format: new GeoJSON()
            }),
            style: new Style({
                fill: new Fill({
                    color: '#00000000', // Couleur de remplissage avec transparence (rouge dans cet exemple)
                }),
                stroke: new Stroke({
                    color: this.primary_color + '22',
                    width: 1 // Largeur de la bordure
                }),
            })
        });

        var layers = [borderLayer];
        if (this.show_regions)
            layers.push(regionLayer);
        if (this.show_departments)
            layers.push(departmentLayer);

        if (this.mod_world)
            layers = [photoLayer];

        this.map = new Map({
            target: this.container,
            layers: layers,
            view: new View({
                center: olProj.fromLonLat(this.center),
                zoom: this.zoom,
                maxZoom: this.zoom_max,
                minZoom: this.zoom_min,
            }),
            controls: []
        });
        if (this.lock_map) {
            this.map.getInteractions().forEach(function (interaction) {
                interaction.setActive(false);
            });
        }
    }

    add_marker(latitude, longitude) {
        var marker = new VectorLayer({
            source: new Vector({
                features: [
                    new Feature({
                        geometry: new Point(olProj.fromLonLat([latitude, longitude])),
                    })
                ],
            }),
            style: new Style({
                image: new Icon({
                    src: 'data:image/svg+xml;charset=utf-8,%3Csvg fill="%23' + this.marker_color.substring(1) + '" width="50" height="50" viewBox="-41 -25 100 100" xmlns="http://www.w3.org/2000/svg"%3E%3Cg id="SVGRepo_bgCarrier" stroke-width="0"%3E%3C/g%3E%3Cg id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"%3E%3C/g%3E%3Cg id="SVGRepo_iconCarrier"%3E%3Cpath d="m8.075 23.52c-6.811-9.878-8.075-10.891-8.075-14.52 0-4.971 4.029-9 9-9s9 4.029 9 9c0 3.629-1.264 4.64-8.075 14.516-.206.294-.543.484-.925.484s-.719-.19-.922-.48l-.002-.004zm.925-10.77c2.07 0 3.749-1.679 3.749-3.75s-1.679-3.75-3.75-3.75-3.75 1.679-3.75 3.75c0 2.071 1.679 3.75 3.75 3.75z"%3E%3C/path%3E%3C/g%3E%3C/svg%3E',
                    scale: 2.5
                })
            })
        })
        this.map.addLayer(marker);
    }
}

export default {CadastreMap: CadastreMap, SimpleMap: SimpleMap};
