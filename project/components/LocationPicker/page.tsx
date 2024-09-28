'use client'
import React, { useState, useEffect, useRef } from "react";

import {
  APIProvider,
  ControlPosition,
  MapControl,
  AdvancedMarker,
  Map,
  useMap,
  useMapsLibrary,
  useAdvancedMarkerRef,
} from "@vis.gl/react-google-maps";

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "YOUR_API_KEY";

const LocationPicker = ({ onLocationSelect }) => {
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [markerRef, marker] = useAdvancedMarkerRef();
  const mapRef = useRef(null);

  useEffect(() => {
    if (selectedPlace) {
      onLocationSelect({
        address: selectedPlace.formatted_address,
        lat: selectedPlace.geometry.location.lat(),
        lng: selectedPlace.geometry.location.lng(),
      });
    }
  }, [selectedPlace, onLocationSelect]);

  return (
    <div className="w-full h-[500px]">
      <APIProvider apiKey={API_KEY}>
        <Map
          mapId="bf51a910020fa25a"
          defaultZoom={3}
          defaultCenter={{ lat: 22.54992, lng: 0 }}
          gestureHandling="greedy"
          disableDefaultUI={true}
          ref={mapRef}
          className="w-full h-full"
        >
          {selectedPlace && (
            <AdvancedMarker
              ref={markerRef}
              position={selectedPlace.geometry.location}
            />
          )}
          <MapControl position={ControlPosition.TOP_LEFT}>
            <div className="m-2">
              <PlaceAutocomplete onPlaceSelect={setSelectedPlace} />
            </div>
          </MapControl>
          <MapHandler place={selectedPlace} marker={marker} mapRef={mapRef} />
        </Map>
      </APIProvider>
    </div>
  );
};

const MapHandler = ({ place, marker, mapRef }) => {
  const map = useMap();
  useEffect(() => {
    if (!map || !place || !marker) return;
    if (place.geometry?.viewport) {
      map.fitBounds(place.geometry.viewport);
    } else if (place.geometry?.location) {
      map.setCenter(place.geometry.location);
      map.setZoom(17);
    }
  }, [map, place, marker]);
  return null;
};

const PlaceAutocomplete = ({ onPlaceSelect }) => {
    const [autocomplete, setAutocomplete] = useState(null);
    const inputRef = useRef(null);
    const places = useMapsLibrary("places");
  
    useEffect(() => {
      if (!places || !inputRef.current) return;
      
      let autocompleteInstance = null;
      try {
        const options = {
          fields: ["geometry", "name", "formatted_address"],
        };
        autocompleteInstance = new places.Autocomplete(inputRef.current, options);
        setAutocomplete(autocompleteInstance);
      } catch (error) {
        console.error("Error initializing Autocomplete:", error);
      }
  
      return () => {
        if (autocompleteInstance && autocompleteInstance.unbindAll) {
          autocompleteInstance.unbindAll();
        }
      };
    }, [places]);

    useEffect(() => {
        if (!autocomplete) return;
    
        const placeChangedListener = () => {
          try {
            const place = autocomplete.getPlace();
            onPlaceSelect(place);
          } catch (error) {
            console.error("Error getting selected place:", error);
          }
        };
    
        autocomplete.addListener("place_changed", placeChangedListener);
    
        return () => {
          if (autocomplete.removeListener) {
            autocomplete.removeListener("place_changed", placeChangedListener);
          }
        };
      }, [autocomplete, onPlaceSelect]);
    

  return (
    <div className="autocomplete-container">
      <input
        ref={inputRef}
        placeholder="Search for a place"
        className="p-2 border rounded w-64"
      />
    </div>
  );
};

export default LocationPicker;