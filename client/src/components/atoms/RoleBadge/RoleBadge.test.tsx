import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { RoleBadge } from './RoleBadge';
import { GroupRole } from '@pickup/shared';

describe('RoleBadge', () => {
  it('renders Admin role correctly', () => {
    render(<RoleBadge role={GroupRole.ADMIN} />);
    expect(screen.getByText('Admin')).toBeInTheDocument();
  });

  it('renders Moderator role correctly', () => {
    render(<RoleBadge role={GroupRole.MODERATOR} />);
    expect(screen.getByText('Moderator')).toBeInTheDocument();
  });

  it('renders Member role correctly', () => {
    render(<RoleBadge role={GroupRole.MEMBER} />);
    expect(screen.getByText('Member')).toBeInTheDocument();
  });

  it('renders without icon when showIcon is false', () => {
    const { container } = render(<RoleBadge role={GroupRole.ADMIN} showIcon={false} />);
    expect(container.querySelector('.MuiChip-icon')).toBeNull();
  });

  it('renders medium size correctly', () => {
    const { container } = render(<RoleBadge role={GroupRole.ADMIN} size="medium" />);
    expect(container.querySelector('.MuiChip-sizeMedium')).toBeInTheDocument();
  });
});
