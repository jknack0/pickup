import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Step } from './Step';
import { Stepper } from '../Stepper';
import { StepLabel } from '../StepLabel';

describe('Step', () => {
  it('renders correctly', () => {
    render(
      <Stepper>
        <Step>
          <StepLabel>Label</StepLabel>
        </Step>
      </Stepper>,
    );
    expect(screen.getByText('Label')).toBeInTheDocument();
  });
});
