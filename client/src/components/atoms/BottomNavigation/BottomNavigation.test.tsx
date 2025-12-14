import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BottomNavigation } from './BottomNavigation';
import { BottomNavigationAction } from '@atoms/BottomNavigationAction';
import { Icon } from '@atoms/Icon';

describe('BottomNavigation', () => {
  it('renders correctly', () => {
    render(
      <BottomNavigation showLabels>
        <BottomNavigationAction label="Recents" icon={<Icon>restore</Icon>} />
      </BottomNavigation>,
    );
    expect(screen.getByText('Recents')).toBeInTheDocument();
  });
});
