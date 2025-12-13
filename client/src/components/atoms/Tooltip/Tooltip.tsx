import { Tooltip as MuiTooltip, type TooltipProps as MuiTooltipProps } from '@mui/material';

export type TooltipProps = MuiTooltipProps;

export const Tooltip = (props: TooltipProps) => {
  return <MuiTooltip {...props} />;
};
