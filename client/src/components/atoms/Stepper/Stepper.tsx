import { Stepper as MuiStepper, type StepperProps as MuiStepperProps } from '@mui/material';

export type StepperProps = MuiStepperProps;

export const Stepper = (props: StepperProps) => {
  return <MuiStepper {...props} />;
};
