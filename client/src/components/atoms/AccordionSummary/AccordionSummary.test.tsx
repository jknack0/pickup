import { render, screen } from '@/test-utils';
import { describe, it, expect } from 'vitest';
import { AccordionSummary } from './AccordionSummary';

describe('AccordionSummary', () => {
  it('renders correctly', () => {
    render(<AccordionSummary>Summary</AccordionSummary>);
    expect(screen.getByText('Summary')).toBeInTheDocument();
  });
});
