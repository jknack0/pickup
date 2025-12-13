import {
  AccordionSummary as MuiAccordionSummary,
  type AccordionSummaryProps as MuiAccordionSummaryProps,
} from '@mui/material';

export type AccordionSummaryProps = MuiAccordionSummaryProps;

export const AccordionSummary = (props: AccordionSummaryProps) => {
  return <MuiAccordionSummary {...props} />;
};
