import React from 'react';
import { CardType } from '@/app/model/CardType';
import Modal from '@/components/Modal'
import InputField from '@/components/InputField';
import { Text } from 'lucide-react';

interface CardTypeManagementModalProps {
    isOpen: boolean;
    cardTypeToEdit: CardType | null;
    onClose: () => void;
    onSave: (cardType: CardType) => void;
}

const CardTypeManagementModal: React.FC<CardTypeManagementModalProps> = ({
    isOpen,
    cardTypeToEdit,
    onClose,
    onSave,
}) => {
    const [name, setName] = React.useState(cardTypeToEdit?.name || '');

    React.useEffect(() => {
        if (cardTypeToEdit) {
            setName(cardTypeToEdit.name);
        } else {
            setName('');
        }
    }, [cardTypeToEdit]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const cardTypeData: CardType = {
            id: cardTypeToEdit?.id || 0,
            name,
        };
        onSave(cardTypeData);
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
            title={cardTypeToEdit ? 'Edit Card Type' : 'Add New Card Type'}
        >
            <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                    <InputField
                        label="Card Type Name"
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
                        {cardTypeToEdit ? 'Update' : 'Save'}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default CardTypeManagementModal;