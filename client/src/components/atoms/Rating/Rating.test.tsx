import { render, screen } from '@/test-utils';
import { describe, it, expect } from 'vitest';
import { Rating } from './Rating';

describe('Rating', () => {
  it('renders correctly', () => {
    render(<Rating defaultValue={3} name="rating-test" />);
    // MUI Rating renders radio buttons for each star.
    // We can check if we can find the radio buttons or just ensure it renders.
    // screen.getAllByRole('radio') should work.
    const radios = screen.getAllByRole('radio');
    expect(radios.length).toBeGreaterThan(0);
  });
});
