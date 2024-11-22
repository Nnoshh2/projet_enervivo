 /* Application web codée en React par Noé LAROCHE pour EnerVivo
 Pour toute question ou renseignement : laroche.noe@orange.fr*/

import React, { useEffect, useRef, forwardRef, useImperativeHandle, useState } from 'react';
import 'ol/ol.css';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import TileWMS from 'ol/source/TileWMS';
import { fromLonLat } from 'ol/proj';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import GeoJSON from 'ol/format/GeoJSON';
import { Style, Fill, Stroke } from 'ol/style';
import $ from 'jquery';
import proj4 from 'proj4';
import './Main.css';

proj4.defs("EPSG:2154", "+proj=lcc +lat_1=49 +lat_2=44 +lat_0=46.5 +lon_0=3 +x_0=700000 +y_0=6600000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");

const MapComponent = forwardRef(({data,onSurfaceUpdate,onNumParcellesUpdate}, ref) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const selectedCadastre = useRef({});
  const primaryColor = '#3f85e8';
  const [totalSurface, setTotalSurface] = useState(0);
  const [numParcelles, setNumParcelles] = useState(0);


  useImperativeHandle(ref, () => ({
    centerMapTo(latitude, longitude, zoom = 17) {
      if (mapInstance.current) {
        mapInstance.current.getView().setCenter(fromLonLat([longitude, latitude]));
        mapInstance.current.getView().setZoom(zoom);
      }
    }
  }));

  useEffect(() => {
    if (mapRef.current) {
      const cadastreLayer = new TileLayer({
        source: new TileWMS({
          url: 'https://data.geopf.fr/wms-r',
          params: {
            'LAYERS': 'CADASTRALPARCELS.PARCELLAIRE_EXPRESS',
            'FORMAT': 'image/png',
            'TRANSPARENT': true
          }
        })
      });

      const photoLayer = new TileLayer({
        source: new TileWMS({
          url: 'https://data.geopf.fr/wms-r',
          params: { 'LAYERS': 'ORTHOIMAGERY.ORTHOPHOTOS' }
        })
      });

      mapInstance.current = new Map({
        target: mapRef.current,
        layers: [photoLayer, cadastreLayer],
        view: new View({
          center: fromLonLat([2.5, 46.85]),
          zoom: 6,
          maxZoom: 100,
          minZoom: 0
        })
      });

      console.log('Carte initialisée avec succès.');

      if (data) {
        const vectorSource = new VectorSource({
          features: new GeoJSON().readFeatures(data, {
            dataProjection: 'EPSG:4326',
            featureProjection: 'EPSG:3857'
          })
        });

        const selectedCadastreStyle = new Style({
          fill: new Fill({
            color: primaryColor + '44'
          }),
          stroke: new Stroke({
            color: primaryColor + 'CC',
            width: 2
          }),
        });

        const vectorLayer = new VectorLayer({
          source: vectorSource,
          style: selectedCadastreStyle
        });

        mapInstance.current.addLayer(vectorLayer);
      }

      mapInstance.current.on('click', function (event) {
        const coordinate = event.coordinate;
        const [longitude, latitude] = proj4('EPSG:3857', 'EPSG:4326', coordinate);  

        const geoJsonPoint = {
          type: "Point",
          coordinates: [longitude, latitude]
        };
        const params = encodeURIComponent(JSON.stringify(geoJsonPoint));

        const marker = new VectorLayer({
          source: new VectorSource({
            features: [
              new Feature({
                geometry: new Point(coordinate),
              })
            ],
          }),
        });
        mapInstance.current.addLayer(marker);

        $.ajax({
          url: `https://apicarto.ign.fr/api/cadastre/parcelle?geom=${params}`,
          method: 'GET',
          headers: {
            'accept': 'application/json'
          },
          success: function (data) {
            if (data.error) {
              console.error('Erreur de l\'API :', data.error.message);
              alert(data.error.message);
            } else if (data.features) {
              data.features.forEach((feature) => {
                if (feature.id in selectedCadastre.current) {
                  removeCadastreLayer(feature.id);
                  const numerosParcelles = majCadastreNum();
                  setNumParcelles(numerosParcelles);
                  onNumParcellesUpdate(numerosParcelles);
                  majCadastreSurf();
                  const newSurface = sumArray(majCadastreSurf());
                  setTotalSurface(newSurface);
                  onSurfaceUpdate(newSurface);
                
                } else {
                  addCadastreLayer(feature);
                  majCadastreNum();
                  majCadastreSurf();
                  const numerosParcelles = majCadastreNum();
                  setNumParcelles(numerosParcelles);
                  onNumParcellesUpdate(numerosParcelles);
                  majCadastreSurf();
                  const newSurface = sumArray(majCadastreSurf());
                  setTotalSurface(newSurface);
                  onSurfaceUpdate(newSurface);
                }
              });
            }
            
            mapInstance.current.removeLayer(marker);
          },
          error: function (error) {
            console.error('Erreur lors de l\'appel AJAX :', error);
            alert('Erreur lors de la récupération des données.');
            mapInstance.current.removeLayer(marker);
          }
        });
      });

      return () => {
        mapInstance.current.setTarget(null);
      };
    }
  }, [data]);

  const addCadastreLayer = (data) => {
    
    const selectedCadastreStyle = new Style({
      fill: new Fill({
        color: '#00B68544' 
      }),
      stroke: new Stroke({
        color: '#1C7861CC', 
        width: 2
      }),
    });

  
    const vectorLayer = new VectorLayer({
      source: new VectorSource({
        features: new GeoJSON().readFeatures(data, {
          dataProjection: 'EPSG:4326',
          featureProjection: 'EPSG:3857'
        })
      }),
      style: selectedCadastreStyle
    });

    selectedCadastre.current[data.id] = { 'feature': data, 'layer': vectorLayer };  
    mapInstance.current.addLayer(vectorLayer);  
    
  };

  const removeCadastreLayer = (id) => {
    if (selectedCadastre.current[id]) {
      mapInstance.current.removeLayer(selectedCadastre.current[id]['layer']);
      delete selectedCadastre.current[id];      
    } 
  };

  const majCadastreNum = () => {  
    const parcelNumbers = Object.keys(selectedCadastre.current).map((key) => {
      const feature = selectedCadastre.current[key].feature;
      return feature.properties.section+feature.properties.numero;
    });  
    return parcelNumbers;
  };
  const majCadastreSurf = () => {
      const parcelSurf = Object.keys(selectedCadastre.current).map((key) => {
      const feature = selectedCadastre.current[key].feature;
      return feature.properties.contenance;
    });
      return parcelSurf;
  };


  const sumArray = (array) => {
    let sum = 0; 
    for (let i = 0; i < array.length; i++) {
      sum += array[i]; 
    }
    sum = (sum/10000).toFixed(1);
    console.log('Somme des surfaces :', sum); 
    return sum; 
  };
  
  return (
  <div>
    <div ref={mapRef} className="map"></div>
  </div>)
});

export default MapComponent;
