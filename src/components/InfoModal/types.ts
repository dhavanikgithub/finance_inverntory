export interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  data: Record<string, string | number | boolean>; // Adjust types if needed
}

export interface InfoModalWrapperProps {
  // No props needed
}

export interface InfoModalRef {
  open: (data: Record<string, any>, title?: string) => void;
  close: () => void;
}