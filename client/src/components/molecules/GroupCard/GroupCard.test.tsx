import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material';
import { theme } from '@/theme';
import GroupCard from './GroupCard';
import { GroupVisibility, GroupJoinPolicy, GroupRole } from '@pickup/shared';

const mockGroup = {
  _id: 'group-1',
  name: 'Test Volleyball Group',
  description: 'A group for volleyball enthusiasts',
  visibility: GroupVisibility.PUBLIC,
  joinPolicy: GroupJoinPolicy.OPEN,
  members: [
    { user: 'user-1', role: GroupRole.ADMIN, joinedAt: new Date() },
    { user: 'user-2', role: GroupRole.MEMBER, joinedAt: new Date() },
  ],
  membershipRequests: [],
  owner: 'user-1',
  defaultSportTypes: [],
  location: 'San Francisco, CA',
  createdAt: new Date(),
  updatedAt: new Date(),
};

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      <MemoryRouter>{ui}</MemoryRouter>
    </ThemeProvider>,
  );
};

// Mock useNavigate
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

describe('GroupCard', () => {
  it('renders group name', () => {
    renderWithProviders(<GroupCard group={mockGroup} />);
    expect(screen.getByText('Test Volleyball Group')).toBeInTheDocument();
  });

  it('renders group description', () => {
    renderWithProviders(<GroupCard group={mockGroup} />);
    expect(screen.getByText('A group for volleyball enthusiasts')).toBeInTheDocument();
  });

  it('renders member count', () => {
    renderWithProviders(<GroupCard group={mockGroup} />);
    expect(screen.getByText('2 members')).toBeInTheDocument();
  });

  it('renders location when provided', () => {
    renderWithProviders(<GroupCard group={mockGroup} />);
    expect(screen.getByText('San Francisco, CA')).toBeInTheDocument();
  });

  it('renders Public badge for public groups', () => {
    renderWithProviders(<GroupCard group={mockGroup} />);
    expect(screen.getByText('Public')).toBeInTheDocument();
  });

  it('renders Private badge for private groups', () => {
    const privateGroup = { ...mockGroup, visibility: GroupVisibility.PRIVATE };
    renderWithProviders(<GroupCard group={privateGroup} />);
    expect(screen.getByText('Private')).toBeInTheDocument();
  });

  it('renders user role badge when provided', () => {
    renderWithProviders(<GroupCard group={mockGroup} userRole={GroupRole.ADMIN} />);
    expect(screen.getByText('Admin')).toBeInTheDocument();
  });
});
