import { Step as MuiStep, type StepProps as MuiStepProps } from '@mui/material';

export type StepProps = MuiStepProps;

export const Step = (props: StepProps) => {
  return <MuiStep {...props} />;
};
