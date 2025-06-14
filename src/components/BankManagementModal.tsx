import React, { useEffect, useState } from 'react';
import { Bank, BankInput } from '@/app/model/Bank';
import { Card } from '@/app/model/Card';
import Modal from '@/components/Modal';
import InputField from '@/components/InputField';
import { Text } from 'lucide-react';
import Dropdown from './Dropdown';

interface BankManagementModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (bank: Bank) => void;
    bankToEdit: Bank | null;
}

const BankManagementModal: React.FC<BankManagementModalProps> = ({
    isOpen,
    onClose,
    onSave,
    bankToEdit,
}) => {
    const [name, setName] = useState('');

    useEffect(() => {
        if (bankToEdit) {
            setName(bankToEdit.name);
        } else {
            setName('');
        }
    }, [bankToEdit]);

    const handleSubmit = () => {

        const bankData: Bank = {
            id: bankToEdit?.id || 0,
            name,
            create_date: bankToEdit?.create_date ?? null,
            create_time: bankToEdit?.create_time ?? null,
            modify_date: null,
            modify_time: null,
        };

        onSave(bankData);
        handleClose();
    };

    const handleClose = () => {
        setName("");
        onClose();
    }


    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title={bankToEdit ? 'Edit Bank' : 'Add New Bank'}
        >
            <div className="space-y-4">
                <InputField
                    label="Bank Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="e.g., HDFC Bank"
                    icon={<Text />}
                />
            </div>

            <div className="mt-6 flex justify-end space-x-3">
                <button
                    type="button"
                    onClick={handleClose}
                    className="btn-secondary"
                >
                    Cancel
                </button>
                <button
                    className="btn-primary"
                    onClick={handleSubmit}
                >
                    {bankToEdit ? 'Update' : 'Save'}
                </button>
            </div>
        </Modal>
    );
};

export default BankManagementModal;
