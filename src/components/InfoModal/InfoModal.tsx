import React from 'react';
import Modal from '../Modal'; // Adjust path if needed
import KeyValueTable from '../KeyValueTable';
import { InfoModalProps } from './types';



const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose, title, data }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="md">
      <KeyValueTable data={data} />
    </Modal>
  );
};

export default InfoModal;
