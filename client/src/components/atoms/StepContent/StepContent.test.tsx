import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { StepContent } from './StepContent';
import { Stepper } from '../Stepper';
import { Step } from '../Step';
import { StepLabel } from '../StepLabel';

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
