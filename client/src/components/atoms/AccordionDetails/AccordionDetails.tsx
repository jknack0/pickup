import {
  AccordionDetails as MuiAccordionDetails,
  type AccordionDetailsProps as MuiAccordionDetailsProps,
} from '@mui/material';

export type AccordionDetailsProps = MuiAccordionDetailsProps;

export const AccordionDetails = (props: AccordionDetailsProps) => {
  return <MuiAccordionDetails {...props} />;
};
