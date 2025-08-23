import { formatDate } from '@/utils/helper';
import React, { useEffect, useState } from 'react';
import Dropdown from './Dropdown';
import { File, UserRound, X } from 'lucide-react';
import { Client } from '@/app/model/Client';
import useBodyScrollLock from '@/hooks/useBodyScrollLock';
import CustomCheckbox from './CustomCheckbox';
interface GenerateReportModalProps {
    isOpen: boolean;
    onClose: () => void;
    clients: Client[];
}
const GenerateReportModal: React.FC<GenerateReportModalProps> = ({ isOpen, onClose, clients }) => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [isClientSpecific, setIsClientSpecific] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedClient, setSelectedClient] = useState<string | null>(null);
    const [error, setError] = useState('');

    // Validation function
    const validateForm = () => {
        setError(''); // Reset previous errors

        // Validate client selection if isClientSpecific is checked
        if (isClientSpecific && !selectedClient) {
            setError('Please select a client.');
            return false;
        }

        // Validate start and end dates
        if (!startDate || startDate === '') {
            setError('Start date is required.');
            return false;
        }
        if (!endDate || endDate === '') {
            setError('End date is required.');
            return false;
        }

        // Check if start date is before end date
        if (new Date(startDate) > new Date(endDate)) {
            setError('Start date cannot be after end date.');
            return false;
        }

        return true; // All validations passed
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }
        setIsLoading(true);

        const selectedClientObj = clients.find((element) => element.name === selectedClient) as Client;
        const requestData = {
            clientId: isClientSpecific ? selectedClientObj?.id || null : null,
            startDate,
            endDate,
        };
        try {
            const response = await fetch('/api/generate-report', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestData),
            });

            const data = await response.json();

            // Generate the filename with the formatted date and time
            let filename = `finance_inverntory_report_${formatDate(startDate)}_${formatDate(endDate)}.pdf`;
            if (isClientSpecific && selectedClient) {
                filename = `${selectedClientObj.name}_${filename}`;
            }
            else {
                filename = `al_client_data_${filename}`;
            }

            if (response.ok) {
                const link = document.createElement('a');
                link.href = `data:application/pdf;base64,${data.pdfContent}`;
                link.download = filename;
                link.click();
                handleOnClose(); // Close modal after successful download
            } else {
                alert('Error generating report: ' + data.error);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while generating the report.');
        } finally {
            setIsLoading(false);
        }
    };
    const onItemSelect = (item: string) => {
        setSelectedClient(item)
    }

    const handleOnClose = () => {
        setIsLoading(false);
        setStartDate('');
        setEndDate('');
        setSelectedClient(null);
        setIsClientSpecific(true);
        onClose();
    }
    // Dropdown items list
    const items = clients.map((item) => item.name);
    useBodyScrollLock(isOpen);
    if (!isOpen) return null;
    return (
        <main className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50 text-gray-900 font-sans overflow-hidden">
            {/* Modal */}
            <div className="relative bg-white rounded-lg md:max-w-md w-full mx-4 md:mx-auto p-6 shadow-lg transform transition-all duration-300 ease-in-out dark:bg-gray-900 dark:text-gray-200">
                <div className="modal-overlay absolute inset-0  bg-opacity-50 rounded-lg" />
                <div className="modal-content relative z-10">
                    <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6 dark:text-gray-200">Generate Report</h2>
                    {error && <p className="text-red-600 text-center mb-4">{error}</p>}
                    <div className="grid space-y-2 mb-2">
                        <div
                            onClick={() => setIsClientSpecific(!isClientSpecific)}
                            className="cursor-pointer max-w-xs p-3 w-full bg-white border border-gray-300 rounded-lg focus:border-black focus:ring-black dark:bg-gray-900 dark:border-gray-700 dark:text-neutral-400">
                            <CustomCheckbox
                                key={""}
                                value={"Generate for specific client."}
                                checked={isClientSpecific}
                                onChange={() => setIsClientSpecific(!isClientSpecific)}
                            />
                        </div>

                    </div>


                    {isClientSpecific && (
                        <div className="mb-4">
                            <label className="block text-gray-700 font-medium mb-2 text-sm">Client:</label>
                            <Dropdown className='mb-3 mt-2' items={items} selectedItem={selectedClient} onItemSelect={onItemSelect} icon={UserRound}/>
                        </div>
                    )}
                    <div className="flex justify-between items-center mb-6 space-x-2">
                        <div className="w-full">
                            <label className="block text-gray-700 font-medium mb-2 text-sm">
                                Start Date:
                            </label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                onClick={(e) => e.currentTarget.showPicker?.()}
                                className="w-full h-10 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black dark:bg-gray-800 dark:border-gray-600 cursor-pointer"
                            />
                        </div>

                        <div className="w-full">
                            <label className="block text-gray-700 font-medium mb-2 text-sm">
                                End Date:
                            </label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                onClick={(e) => e.currentTarget.showPicker?.()}
                                className="w-full h-10 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black dark:bg-gray-800 dark:border-gray-600 cursor-pointer"
                            />
                        </div>
                    </div>



                    <div className="mt-6 flex space-x-2">
                        <button
                            onClick={handleSubmit}
                            disabled={isLoading}
                            className="btn-secondary flex-1"
                        >
                            <File className='w-5 h-5' />
                            {isLoading ? 'Generating...' : 'Generate Report'}
                        </button>
                        <button
                            onClick={handleOnClose}
                            className="btn-secondary-outline flex-1"
                        >
                            <X className='w-5 h-5' />
                            <span>Close</span>
                        </button>
                    </div>
                </div>
            </div>
        </main>

    );
};

export default GenerateReportModal;
