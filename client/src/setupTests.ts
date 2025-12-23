import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock matchMedia for MUI components
window.matchMedia =
  window.matchMedia ||
  function () {
    return {
      matches: false,
      addListener: function () {},
      removeListener: function () {},
      addEventListener: function () {},
      removeEventListener: function () {},
    };
  };

// Global mock for MUI Icons to prevent EMFILE errors (too many open files)
vi.mock('@mui/icons-material', async () => {
  const React = await import('react');
  return new Proxy(
    {},
    {
      get: (_target, prop) => {
        // Return a simple functional component for any icon import
        const MockIcon = (props: React.HTMLAttributes<HTMLSpanElement>) =>
          React.createElement('span', { ...props, 'data-testid': `icon-${String(prop)}` });
        (MockIcon as { displayName?: string }).displayName = `MockIcon(${String(prop)})`;
        return MockIcon;
      },
    },
  );
});
