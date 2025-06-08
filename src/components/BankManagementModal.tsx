import React, { useEffect, useState } from 'react';
import { Bank, BankInput } from '@/app/model/Bank';
import { CardType } from '@/app/model/CardType';
import Modal from '@/components/Modal';
import InputField from '@/components/InputField';
import { Text } from 'lucide-react';
import Dropdown from './Dropdown';

interface BankManagementModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (bank: Bank) => void;
    bankToEdit: Bank | null;
    cardTypes: CardType[];
}

const BankManagementModal: React.FC<BankManagementModalProps> = ({
    isOpen,
    onClose,
    onSave,
    bankToEdit,
    cardTypes,
}) => {
    const [name, setName] = useState('');
    const [selectedCardType, setSelectedCardType] = useState<string>("");

    useEffect(() => {
        if (bankToEdit) {
            setName(bankToEdit.name);
            setSelectedCardType(bankToEdit.card_type_name!);
        } else {
            setName('');
            setSelectedCardType("");
        }
    }, [bankToEdit]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const bankData: Bank = {
            id: bankToEdit?.id || 0,
            name,
            card_type_id: cardTypes.find(ct => ct.name === selectedCardType)?.id || 0,
            card_type_name: selectedCardType,
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
        setSelectedCardType("");
        onClose();
    }

    const onItemSelect = (item:string) => {
        setSelectedCardType(item);
    }

    const items = cardTypes.map((item) => item.name);

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title={bankToEdit ? 'Edit Bank' : 'Add New Bank'}
        >
            <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                    <InputField
                        label="Bank Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        placeholder="e.g., HDFC Bank"
                        icon={<Text/>}
                    />

                    <div className="flex flex-col">
                        <label className="mb-1 font-medium text-sm text-gray-700">Card Type</label>
                        <Dropdown placeholder="Select card type..." className='mb-3 mt-2' items={items} selectedItem={selectedCardType} onItemSelect={onItemSelect} />
                    </div>
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
                        type="submit"
                        className="btn-primary"
                    >
                        {bankToEdit ? 'Update' : 'Save'}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default BankManagementModal;
