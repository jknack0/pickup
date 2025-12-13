import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AccordionDetails } from './AccordionDetails';

describe('AccordionDetails', () => {
  it('renders correctly', () => {
    render(<AccordionDetails>Details</AccordionDetails>);
    expect(screen.getByText('Details')).toBeInTheDocument();
  });
});
