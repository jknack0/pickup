import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SpeedDial } from './SpeedDial';
import { SpeedDialIcon } from '@atoms/SpeedDialIcon';
import { SpeedDialAction } from '@atoms/SpeedDialAction';
import { Icon } from '@atoms/Icon';

describe('SpeedDial', () => {
  it('renders correctly', () => {
    render(
      <SpeedDial ariaLabel="SpeedDial" icon={<SpeedDialIcon />}>
        <SpeedDialAction icon={<Icon>save</Icon>} tooltipTitle="Save" />
      </SpeedDial>,
    );
    expect(screen.getByLabelText('SpeedDial')).toBeInTheDocument();
  });
});
