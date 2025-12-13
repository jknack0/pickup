import { Chip as MuiChip, type ChipProps as MuiChipProps } from '@mui/material';

export type ChipProps = MuiChipProps;

export const Chip = (props: ChipProps) => {
  return <MuiChip {...props} />;
};
