import { Popover as MuiPopover, type PopoverProps as MuiPopoverProps } from '@mui/material';

export type PopoverProps = MuiPopoverProps;

export const Popover = (props: PopoverProps) => {
  return <MuiPopover {...props} />;
};
