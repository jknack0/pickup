import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Breadcrumbs } from './Breadcrumbs';
import { Link } from '@atoms/Link';

describe('Breadcrumbs', () => {
  it('renders correctly', () => {
    render(
      <Breadcrumbs>
        <Link href="/">Home</Link>
        <Link href="/catalog">Catalog</Link>
      </Breadcrumbs>,
    );
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Catalog')).toBeInTheDocument();
  });
});
