import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Collapse } from './Collapse';

describe('Collapse', () => {
  it('renders correctly', () => {
    render(
      <Collapse in={true}>
        <div>Content</div>
      </Collapse>,
    );
    expect(screen.getByText('Content')).toBeInTheDocument();
  });
});
