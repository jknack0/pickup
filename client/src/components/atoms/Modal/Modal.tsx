import { Modal as MuiModal, type ModalProps as MuiModalProps } from '@mui/material';

export type ModalProps = MuiModalProps;

export const Modal = (props: ModalProps) => {
  return <MuiModal {...props} />;
};
