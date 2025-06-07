import React, { useEffect, useState } from 'react';
import { Bank, BankInput } from '@/app/model/Bank';
import { CardType } from '@/app/model/CardType';
import Modal from '@/components/Modal';
import InputField from '@/components/InputField';

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
    const [cardTypeId, setCardTypeId] = useState<number>(0);

    useEffect(() => {
        if (bankToEdit) {
            setName(bankToEdit.name);
            setCardTypeId(bankToEdit.card_type_id);
        } else {
            setName('');
            setCardTypeId(0);
        }
    }, [bankToEdit]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const bankData: Bank = {
            id: bankToEdit?.id || 0,
            name,
            card_type_id: cardTypeId,
            card_type_name: cardTypes.find(ct => ct.id === cardTypeId)?.name || '',
            create_date: bankToEdit?.create_date ?? null,
            create_time: bankToEdit?.create_time ?? null,
            modify_date: null,
            modify_time: null,
        };

        onSave(bankData);
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
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
                    />

                    <div className="flex flex-col">
                        <label className="mb-1 font-medium text-sm text-gray-700">Card Type</label>
                        <select
                            value={cardTypeId}
                            onChange={(e) => setCardTypeId(Number(e.target.value))}
                            required
                            className="form-select border border-gray-300 rounded px-3 py-2"
                        >
                            <option value="" disabled>Select card type</option>
                            {cardTypes.map((cardType) => (
                                <option key={cardType.id} value={cardType.id}>
                                    {cardType.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                    <button
                        type="button"
                        onClick={onClose}
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
