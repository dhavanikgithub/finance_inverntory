// components/ClientManagementModal.jsx
import React, { useState, useEffect } from 'react';
import { Save, X } from 'lucide-react';
import { Client } from '@/app/model/Client';

const ClientManagementModal = ({ 
    isOpen,
    clientToEdit,
    onClose,
    onSave
}:{
    isOpen:boolean,
    clientToEdit:Client|null,
    onClose:()=>void,
    onSave:(clientData:Client) => void
}) => {
    const [name, setName] = useState<string>('');
    const [isEditing, setIsEditing] = useState<boolean>(false);

    useEffect(() => {
        if (clientToEdit) {
            setName(clientToEdit.name);
            setIsEditing(true);
        } else {
            setName('');
            setIsEditing(false);
        }
    }, [clientToEdit]);

    const handleSave = () => {
        if (name.trim() === '') {
            alert('Name is required');
            return;
        }
        const client:Client = {
            id: clientToEdit?.id || undefined,
            name: name,
            create_date: clientToEdit?.create_date || undefined,
            create_time: clientToEdit?.create_time || undefined
        }
        onSave(client);
        handleClose();
    };

    const handleClose = () => {
        setName('');
        onClose();
    }

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50 ">
            <div className="relative bg-white p-6 rounded-lg shadow-lg w-1/2 dark:bg-gray-900 dark:text-gray-200">
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-xl dark:hover:text-gray-400"
                    aria-label="Close"
                >
                    <X className='w-4 h-4' />
                </button>
                <h1 className="text-2xl font-bold mb-6">{isEditing ? 'Update Client' : 'Add Client'}</h1>
                <div className="mt-4">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Name:</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        placeholder='Client name...'
                        onChange={(e) => setName(e.target.value)}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
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
