import { render } from '@testing-library/react';
import { APIProvider } from '@vis.gl/react-google-maps';
import MapPreview from './MapPreview';
import { describe, it } from 'vitest';

describe('MapPreview', () => {
  it('renders without crashing', () => {
    render(
      <APIProvider apiKey="test-key">
        <MapPreview lat={40.7128} lng={-74.006} />
      </APIProvider>,
    );
    // Basic render test since the actual map requires valid API key and canvas support
    // which JSDOM doesn't fully emulate.
  });
});
