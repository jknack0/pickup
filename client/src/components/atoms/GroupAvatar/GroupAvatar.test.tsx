import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { GroupAvatar } from './GroupAvatar';

describe('GroupAvatar', () => {
  it('renders with group name initials', () => {
    render(<GroupAvatar name="Test Group" />);
    expect(screen.getByText('TG')).toBeInTheDocument();
  });

  it('renders with avatar image when provided', () => {
    render(<GroupAvatar name="Test Group" avatarUrl="https://example.com/avatar.jpg" />);
    const avatar = screen.getByRole('img');
    expect(avatar).toHaveAttribute('src', 'https://example.com/avatar.jpg');
  });

  it('renders single word initials correctly', () => {
    render(<GroupAvatar name="Volleyball" />);
    expect(screen.getByText('VO')).toBeInTheDocument();
  });

  it('renders small size correctly', () => {
    const { container } = render(<GroupAvatar name="Test" size="small" />);
    const avatar = container.querySelector('.MuiAvatar-root');
    expect(avatar).toHaveStyle({ width: '32px', height: '32px' });
  });

  it('renders large size correctly', () => {
    const { container } = render(<GroupAvatar name="Test" size="large" />);
    const avatar = container.querySelector('.MuiAvatar-root');
    expect(avatar).toHaveStyle({ width: '56px', height: '56px' });
  });
});
