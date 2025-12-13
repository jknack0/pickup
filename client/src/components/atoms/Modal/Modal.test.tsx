import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Modal } from './Modal';

describe('Modal', () => {
  it('renders correctly', () => {
    render(
      <Modal open={true}>
        <div data-testid="modal-content">Content</div>
      </Modal>,
    );
    expect(screen.getByTestId('modal-content')).toBeInTheDocument();
  });
});
