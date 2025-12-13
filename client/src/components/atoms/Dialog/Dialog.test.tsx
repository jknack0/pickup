import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Dialog } from './Dialog';

describe('Dialog', () => {
  it('renders correctly', () => {
    render(
      <Dialog open={true}>
        <div data-testid="dialog-content">Content</div>
      </Dialog>,
    );
    expect(screen.getByTestId('dialog-content')).toBeInTheDocument();
  });
});
