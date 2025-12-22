import { render, screen } from '@/test-utils';
import { describe, it, expect } from 'vitest';
import { StepLabel } from './StepLabel';
import { Stepper } from '@atoms/Stepper';
import { Step } from '@atoms/Step';

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
