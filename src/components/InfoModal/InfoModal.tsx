import React from 'react';
import Modal from '../Modal'; // Adjust path if needed
import KeyValueTable from '../KeyValueTable';
import { InfoModalProps } from './types';



const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose, title, columns, data }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="md" disableOutsideClick={false}>
      <KeyValueTable data={data} columns={columns} />
    </Modal>
  );
};

export default InfoModal;
