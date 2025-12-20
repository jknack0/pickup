import { render, screen } from '@testing-library/react';
import SortableItem from './SortableItem';
import { describe, it, expect, vi } from 'vitest';

// Mock dnd-kit hook since it requires context
vi.mock('@dnd-kit/sortable', () => ({
  useSortable: () => ({
    attributes: {},
    listeners: {},
    setNodeRef: vi.fn(),
    transform: null,
    transition: null,
  }),
}));

describe('SortableItem', () => {
  it('renders correctly', () => {
    render(<SortableItem id="Test Item" index={0} />);
    expect(screen.getByText('1. Test Item')).toBeInTheDocument();
  });
});
