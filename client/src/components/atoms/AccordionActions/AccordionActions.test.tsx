import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AccordionActions } from './AccordionActions';
import { Button } from '@atoms/Button';

describe('AccordionActions', () => {
  it('renders correctly', () => {
    render(
      <AccordionActions>
        <Button>Action</Button>
      </AccordionActions>,
    );
    expect(screen.getByText('Action')).toBeInTheDocument();
  });
});
