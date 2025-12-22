import { render, screen } from '@/test-utils';
import { describe, it, expect } from 'vitest';
import { StepContent } from './StepContent';
import { Stepper } from '@atoms/Stepper';
import { Step } from '@atoms/Step';
import { StepLabel } from '@atoms/StepLabel';

describe('StepContent', () => {
  it('renders correctly', () => {
    render(
      <Stepper orientation="vertical">
        <Step expanded>
          <StepLabel>Label</StepLabel>
          <StepContent>Content</StepContent>
        </Step>
      </Stepper>,
    );
    expect(screen.getByText('Content')).toBeInTheDocument();
  });
});
