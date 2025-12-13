import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AccordionSummary } from './AccordionSummary';

describe('AccordionSummary', () => {
  it('renders correctly', () => {
    render(<AccordionSummary>Summary</AccordionSummary>);
    expect(screen.getByText('Summary')).toBeInTheDocument();
  });
});
