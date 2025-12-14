import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BottomNavigationAction } from './BottomNavigationAction';
import { BottomNavigation } from '@atoms/BottomNavigation';

describe('BottomNavigationAction', () => {
  it('renders correctly', () => {
    render(
      <BottomNavigation>
        <BottomNavigationAction label="Action" />
      </BottomNavigation>,
    );
    expect(screen.getByText('Action')).toBeInTheDocument();
  });
});
