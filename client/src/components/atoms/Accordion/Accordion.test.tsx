import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Accordion } from './Accordion';
import { AccordionSummary } from '@atoms/AccordionSummary';
import { AccordionDetails } from '@atoms/AccordionDetails';

describe('Accordion', () => {
  it('renders correctly', () => {
    render(
      <Accordion>
        <AccordionSummary>Summary</AccordionSummary>
        <AccordionDetails>Details</AccordionDetails>
      </Accordion>,
    );
    expect(screen.getByText('Summary')).toBeInTheDocument();
  });
});
