import React from 'react';
import { Card } from '@/app/model/Card';
import Modal from '@/components/Modal'
import InputField from '@/components/InputField';
import { Text } from 'lucide-react';

interface CardManagementModalProps {
    isOpen: boolean;
    cardToEdit: Card | null;
    onClose: () => void;
    onSave: (cardType: Card) => void;
}

const CardManagementModal: React.FC<CardManagementModalProps> = ({
    isOpen,
    cardToEdit: cardToEdit,
    onClose,
    onSave,
}) => {
    const [name, setName] = React.useState(cardToEdit?.name || '');

    React.useEffect(() => {
        if (cardToEdit) {
            setName(cardToEdit.name);
        } else {
            setName('');
        }
    }, [cardToEdit]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const cardData: Card = {
            id: cardToEdit?.id || 0,
            name,
        };
        onSave(cardData);
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
            title={cardToEdit ? 'Edit Card' : 'Add New Card'}
        >
            <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                    <InputField
                        label="Card Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        placeholder="e.g., Visa, MasterCard"
                        icon={<Text/>}
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
                        type="submit"
                        className="btn-primary"
                    >
                        {cardToEdit ? 'Update' : 'Save'}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default CardManagementModal;