import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Tab } from './Tab';
import { Tabs } from '../Tabs';

describe('Tab', () => {
  it('renders correctly', () => {
    render(
      <Tabs value={0}>
        <Tab label="My Tab" />
      </Tabs>,
    );
    expect(screen.getByText('My Tab')).toBeInTheDocument();
  });
});
