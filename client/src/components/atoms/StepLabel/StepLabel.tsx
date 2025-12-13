import { StepLabel as MuiStepLabel, type StepLabelProps as MuiStepLabelProps } from '@mui/material';

export type StepLabelProps = MuiStepLabelProps;

export const StepLabel = (props: StepLabelProps) => {
  return <MuiStepLabel {...props} />;
};
