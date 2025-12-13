import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { StepLabel } from './StepLabel';
import { Stepper } from '../Stepper';
import { Step } from '../Step';

describe('StepLabel', () => {
  it('renders correctly', () => {
    render(
      <Stepper>
        <Step>
          <StepLabel>Test Label</StepLabel>
        </Step>
      </Stepper>,
    );
    expect(screen.getByText('Test Label')).toBeInTheDocument();
  });
});
