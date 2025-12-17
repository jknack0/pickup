import React from 'react';
import { Map, Marker } from '@vis.gl/react-google-maps';
import { Box } from '@mui/material';

interface MapPreviewProps {
  lat: number;
  lng: number;
  height?: string | number;
}

const MapPreview: React.FC<MapPreviewProps> = ({ lat, lng, height = 200 }) => {
  const position = { lat, lng };

  return (
    <Box sx={{ height, width: '100%', borderRadius: 1, overflow: 'hidden', mt: 1 }}>
      <Map
        defaultCenter={position}
        defaultZoom={15}
        gestureHandling={'cooperative'}
        disableDefaultUI={true}
      >
        <Marker position={position} />
      </Map>
    </Box>
  );
};

export default MapPreview;
