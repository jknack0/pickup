import {
  AccordionActions as MuiAccordionActions,
  type AccordionActionsProps as MuiAccordionActionsProps,
} from '@mui/material';

export type AccordionActionsProps = MuiAccordionActionsProps;

export const AccordionActions = (props: AccordionActionsProps) => {
  return <MuiAccordionActions {...props} />;
};
