import { render, screen } from '@/test-utils';
import { describe, it, expect } from 'vitest';
import { Tabs } from './Tabs';
import { Tab } from '@atoms/Tab';

describe('Tabs', () => {
  it('renders correctly', () => {
    render(
      <Tabs value={0}>
        <Tab label="Tab 1" />
      </Tabs>,
    );
    expect(screen.getByText('Tab 1')).toBeInTheDocument();
  });
});
