import {
  StepContent as MuiStepContent,
  type StepContentProps as MuiStepContentProps,
} from '@mui/material';

export type StepContentProps = MuiStepContentProps;

export const StepContent = (props: StepContentProps) => {
  return <MuiStepContent {...props} />;
};
