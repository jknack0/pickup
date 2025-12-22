import { render, screen } from '@/test-utils';
import { describe, it, expect } from 'vitest';
import { ButtonGroup } from './ButtonGroup';
import { Button } from '@atoms/Button';

describe('ButtonGroup', () => {
  it('renders correctly', () => {
    render(
      <ButtonGroup>
        <Button>One</Button>
        <Button>Two</Button>
      </ButtonGroup>,
    );
    expect(screen.getByText('One')).toBeInTheDocument();
    expect(screen.getByText('Two')).toBeInTheDocument();
  });
});
