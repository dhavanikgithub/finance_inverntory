export interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  columns: { label: string; accessor: string }[]; // Array of columns with label and accessor
  data: Record<string, string | number | boolean>; // Adjust types if needed
}

export interface InfoModalWrapperProps {
  // No props needed
}

export interface InfoModalRef {
  open: (data: Record<string, any>, columns: { label: string; accessor: string }[], title?: string) => void;
  close: () => void;
}