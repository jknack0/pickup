import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Stepper } from './Stepper';
import { Step } from '@atoms/Step';
import { StepLabel } from '@atoms/StepLabel';

describe('Stepper', () => {
  it('renders correctly', () => {
    render(
      <Stepper activeStep={0}>
        <Step>
          <StepLabel>Step 1</StepLabel>
        </Step>
      </Stepper>,
    );
    expect(screen.getByText('Step 1')).toBeInTheDocument();
  });
});
