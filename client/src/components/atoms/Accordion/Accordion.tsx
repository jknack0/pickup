import { Accordion as MuiAccordion, type AccordionProps as MuiAccordionProps } from '@mui/material';

export type AccordionProps = MuiAccordionProps;

export const Accordion = (props: AccordionProps) => {
  return <MuiAccordion {...props} />;
};
