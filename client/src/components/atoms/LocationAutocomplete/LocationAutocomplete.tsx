import React, { useEffect, useRef, useState } from 'react';
import { useMapsLibrary } from '@vis.gl/react-google-maps';
import { TextField, Autocomplete } from '@mui/material';

interface LocationAutocompleteProps {
  onPlaceSelect: (place: google.maps.places.PlaceResult | null) => void;
  defaultValue?: string;
  error?: boolean;
  helperText?: string;
}

const LocationAutocomplete: React.FC<LocationAutocompleteProps> = ({
  onPlaceSelect,
  defaultValue = '',
  error,
  helperText,
}) => {
  const places = useMapsLibrary('places');
  const [sessionToken, setSessionToken] = useState<google.maps.places.AutocompleteSessionToken>();
  const [autocompleteService, setAutocompleteService] =
    useState<google.maps.places.AutocompleteService | null>(null);
  const [placesService, setPlacesService] = useState<google.maps.places.PlacesService | null>(null);
  const [predictionResults, setPredictionResults] = useState<
    Array<google.maps.places.AutocompletePrediction>
  >([]);
  const [inputValue, setInputValue] = useState<string>(defaultValue);
  const [options, setOptions] = useState<Array<string>>([]);
  const loaded = useRef(false);

  useEffect(() => {
    if (!places || loaded.current) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAutocompleteService(new places.AutocompleteService());
    setPlacesService(new places.PlacesService(document.createElement('div')));
    setSessionToken(new places.AutocompleteSessionToken());
    loaded.current = true;
  }, [places]);

  const fetchPredictions = (inputValue: string) => {
    if (!autocompleteService || !inputValue) {
      setPredictionResults([]);
      return;
    }

    autocompleteService.getPlacePredictions(
      { input: inputValue, sessionToken },
      (predictions, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
          setPredictionResults(predictions);
          setOptions(predictions.map((prediction) => prediction.description));
        } else {
          setPredictionResults([]);
          setOptions([]);
        }
      },
    );
  };

  const handleInputChange = (_event: React.SyntheticEvent, newInputValue: string) => {
    setInputValue(newInputValue);
    fetchPredictions(newInputValue);
  };

  const handleChange = (_event: React.SyntheticEvent, newValue: string | null) => {
    setOptions(newValue ? [newValue, ...options] : options);
    setInputValue(newValue || '');

    if (!newValue) {
      onPlaceSelect(null);
      return;
    }

    const prediction = predictionResults.find((p) => p.description === newValue);
    if (prediction && placesService) {
      placesService.getDetails(
        { placeId: prediction.place_id, fields: ['geometry', 'formatted_address', 'name'] },
        (place, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && place) {
            onPlaceSelect(place);
          }
        },
      );
    }
  };

  return (
    <Autocomplete
      freeSolo
      id="location-autocomplete"
      getOptionLabel={(option) => option}
      filterOptions={(x) => x}
      options={options}
      autoComplete
      includeInputInList
      filterSelectedOptions
      value={inputValue}
      noOptionsText="No locations found"
      onChange={handleChange}
      onInputChange={handleInputChange}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Location"
          fullWidth
          error={error}
          helperText={helperText}
          required
        />
      )}
    />
  );
};

export default LocationAutocomplete;
