import React, { useState, useEffect } from 'react';
import { Save, Text, X, Mail, Phone, MapPin } from 'lucide-react';
import { Client } from '@/app/model/Client';
import useBodyScrollLock from '@/hooks/useBodyScrollLock';
import InputField from './InputField';
import TextAreaField from './TextAreaField';
import { isValidContact, isValidEmail } from '@/utils/validators';

const ClientManagementModal = ({
    isOpen,
    clientToEdit,
    onClose,
    onSave
}: {
    isOpen: boolean,
    clientToEdit: Client | null,
    onClose: () => void,
    onSave: (clientData: Client) => void
}) => {
    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [contact, setContact] = useState<string>('');
    const [address, setAddress] = useState<string>('');
    const [isEditing, setIsEditing] = useState<boolean>(false);

    useEffect(() => {
        if (clientToEdit) {
            setName(clientToEdit.name || '');
            setEmail(clientToEdit.email || '');
            setContact(clientToEdit.contact || '');
            setAddress(clientToEdit.address || '');
            setIsEditing(true);
        } else {
            setName('');
            setEmail('');
            setContact('');
            setAddress('');
            setIsEditing(false);
        }
    }, [clientToEdit]);

    const handleSave = () => {
        if (name.trim() === '') {
            alert('Client name is required');
            return;
        }

        if (email && !isValidEmail(email)) {
            alert('Invalid email format');
            return;
        }

        if (contact && !isValidContact(contact)) {
            alert('Invalid contact number');
            return;
        }

        const client: Client = {
            id: clientToEdit?.id || undefined,
            name,
            email: email !== '' && email !== undefined && email !== null ? email : (email === '' ? '' : undefined),
            contact: contact !== '' && contact !== undefined && contact !== null ? contact : (contact === '' ? '' : undefined),
            address: address !== '' && address !== undefined && address !== null ? address : (address === '' ? '' : undefined),
            create_date: clientToEdit?.create_date || undefined,
            create_time: clientToEdit?.create_time || undefined
        };

        onSave(client);
        handleClose();
    };

    const handleClose = () => {
        setName('');
        setEmail('');
        setContact('');
        setAddress('');
        onClose();
    };

    useBodyScrollLock(isOpen);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
            <div className="relative bg-white p-6 rounded-lg shadow-lg w-1/2 dark:bg-gray-900 dark:text-gray-200">
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-xl dark:hover:text-gray-400"
                    aria-label="Close"
                >
                    <X className='w-4 h-4' />
                </button>
                <h1 className="text-2xl font-bold mb-6">{isEditing ? 'Update Client' : 'Add Client'}</h1>

                <div className="space-y-4">
                    <InputField
                        label="Client Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        placeholder="e.g., John Doe"
                        icon={<Text />}
                    />
                    <InputField
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g., john@example.com"
                        icon={<Mail />}
                    />
                    <InputField
                        label="Contact Number"
                        type="tel"
                        value={contact}
                        onChange={(e) => setContact(e.target.value)}
                        placeholder="e.g., +919876543210"
                        icon={<Phone />}
                    />
                    <TextAreaField
                        label="Address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="e.g., 123 Main Street"
                        icon={<MapPin />}
                    />
                </div>

                <div className="mt-6 flex space-x-2">
                    <button
                        onClick={handleSave}
                        className="btn-secondary flex-1"
                    >
                        <Save className='w-5 h-5' />
                        <span>{isEditing ? 'Update Client' : 'Add Client'}</span>
                    </button>
                    <button
                        onClick={handleClose}
                        className="btn-secondary-outline flex-1"
                    >
                        <X className='w-5 h-5' />
                        <span>Close</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ClientManagementModal;
