import React, { useEffect, useState } from 'react';
import { IndianRupee, Percent, Save, X } from 'lucide-react';
import Dropdown from './Dropdown';
import { formatAmount, getTransactionTypeStr, parseFormattedAmount } from '@/utils/helper';
import { Client } from '@/app/model/Client';
import Transaction, { Deposit, TransactionType } from '@/app/model/Transaction';

const AmountManagementModal = ({
    clients,
    transactionToEdit,
    isOpen,
    onClose,
    onSave,
    transactionType
}: {
    clients: Client[]
    transactionToEdit: Transaction | null,
    isOpen: boolean,
    onClose: () => void;
    onSave: (transactionData: Transaction) => void;
    transactionType: TransactionType
}) => {
    // Define the type for the form data
    interface FormData {
        action: TransactionType;  // Assuming action can be 'deposit' or 'widthdraw'
        remark: string;
        selectedClient: string | null;  // Assuming Client is a type you're using
        deductionAmount: number;
        widthdrawCharge: number;
        transactionAmount: string;
    }

    // Define initial form data
    const initialFormData: FormData = {
        action: transactionType,
        remark: '',
        selectedClient: null,
        deductionAmount: 0,
        widthdrawCharge: 0,
        transactionAmount: '0',
    };

    // Use the useState hook with typed initial state
    const [formData, setFormData] = useState<FormData>(initialFormData);

    useEffect(() => {
        if (transactionToEdit) {
            const temp = (transactionToEdit.transaction_amount * transactionToEdit.widthdraw_charges) / 100;
            setFormData({
                action: getTransactionTypeStr(transactionToEdit.transaction_type),
                remark: transactionToEdit.remark,
                selectedClient: transactionToEdit.client_name,
                deductionAmount: temp,
                widthdrawCharge: transactionToEdit.widthdraw_charges,
                transactionAmount: formatAmount(transactionToEdit.transaction_amount.toString()),
            })
        }
        else {
            setFormData(initialFormData)
        }
    }, [transactionToEdit])

    const toggleAction = (selectedAction: TransactionType) => {
        setFormData((prevState) => ({ ...prevState, action: selectedAction }));
    };

    const validateTransaction = (formData: FormData, clients: Client[]) => {
        // Validate client selection
        if (!formData.selectedClient) {
            return "Please select a client.";
        }
        const selectedClientObj = clients.find((element) => element.name === formData.selectedClient);
        if (!selectedClientObj) {
            return "Invalid client selected.";
        }

        const parsedWidthdrawCharge = parseFormattedAmount(formData.widthdrawCharge.toString())
        // Validate withdraw charges (must be a valid percentage)
        if (isNaN(parsedWidthdrawCharge) || parsedWidthdrawCharge < 0 || parsedWidthdrawCharge > 100) {
            return "Please enter a valid withdraw charge percentage (0-100).";
        }

        // Validate transaction amount (must be a valid number and not zero)
        const parsedTransactionAmount = parseFormattedAmount(formData.transactionAmount.toString());
        if (isNaN(parsedTransactionAmount) || parsedTransactionAmount <= 0) {
            return `Please enter a valid ${transactionType} amount.`;
        }

        return null;  // If no validation errors
    };


    const handleSave = () => {
        // Validate the form data
        const validationError = validateTransaction(formData, clients);
        if (validationError) {
            alert(validationError); // Show the error message
            return; // Stop the function execution if there's an error
        }
        const tempFormData = updateAmount();
        setFormData(tempFormData);
        const selectedClientObj = clients.find((element) => element.name === tempFormData.selectedClient) as Client;


        // Create the transaction object
        let transaction: Transaction = {
            id: transactionToEdit?.id || undefined,
            client_id: selectedClientObj.id!!,
            client_name: tempFormData.selectedClient!!,
            remark: tempFormData.remark,
            widthdraw_charges: parseFormattedAmount(tempFormData.widthdrawCharge.toString()),
            transaction_amount: parseFormattedAmount(tempFormData.transactionAmount),
            transaction_type: tempFormData.action === Deposit ? 0 : 1,
            create_date: transactionToEdit?.create_date || undefined,
            create_time: transactionToEdit?.create_time || undefined
        };

        // If all fields are valid, save the transaction
        onSave(transaction);
        handleClose();
    };


    const updateAmount = () => {
        let tempFormData:FormData = formData;
        let totalAmountInput = 0;
        // if (isNaN(totalAmountInput) || totalAmountInput < 0) {
        //     return;
        // }
        let newTotalAmount = totalAmountInput;
        if (formData.action === Deposit) {
            const depositAmount = parseFormattedAmount(formData.transactionAmount);
            // if (isNaN(depositAmount) || depositAmount < 0) {
            //     return;
            // }
            newTotalAmount += depositAmount;
        } else {
            const withdrawAmount = parseFormattedAmount(formData.transactionAmount);
            const rateDeduction = parseFloat(formData.widthdrawCharge.toString());
            // if (isNaN(withdrawAmount) || withdrawAmount < 0 || isNaN(rateDeduction) || rateDeduction < 0 || rateDeduction > 100) {
            //     return;
            // }
            const deduction = (withdrawAmount * rateDeduction) / 100;
            tempFormData = { ...tempFormData, deductionAmount: deduction}
            newTotalAmount -= withdrawAmount;
        }
        return tempFormData;
    };



    const onItemSelect = (item: string) => {
        setFormData((prevState) => ({ ...prevState, selectedClient: item }));
    };

    const handleClose = () => {
        setFormData(initialFormData)
        onClose();
    }

    // Dropdown items list
    const items = clients.map((item) => item.name);

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
                <h1 className="text-2xl font-bold mb-6">{transactionToEdit ? 'Update ' : 'Add '}{transactionType}</h1>

                <div className="grid grid-cols-1 gap-4">
                    <div>
                        <label htmlFor="client" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Client</label>
                        <Dropdown placeholder="Select Client..." className='mb-3 mt-2' items={items} selectedItem={formData.selectedClient} onItemSelect={onItemSelect} />
                    </div>
                </div>
                
                {formData.action === Deposit ? (

                    <div className="mt-4">
                        <label htmlFor="depositAmount" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Deposit Amount</label>
                        <div className="relative mb-6">
                            <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                                <IndianRupee className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                            </div>
                            <input
                                type="text"
                                id="depositAmount"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="Enter deposit amount"
                                value={formData.transactionAmount}
                                onInput={(e) => setFormData((prevState) => ({ ...prevState, transactionAmount: formatAmount((e.target as HTMLInputElement).value) }))}
                            />
                        </div>
                    </div>
                ) : (
                    <div className="mt-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="withdrawAmount" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Widthdraw Amount</label>
                                <div className="relative mb-6">
                                    <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                                        <IndianRupee className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        id="withdrawAmount"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        placeholder="Enter withdraw amount"
                                        value={formData.transactionAmount}
                                        onInput={(e) => setFormData((prevState) => ({ ...prevState, transactionAmount: formatAmount((e.target as HTMLInputElement).value) }))}
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="rateDeduction" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Rate Deduction (%)</label>
                                <div className="relative mb-6">
                                    <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                                        <Percent className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                    </div>
                                    <input
                                        type="number"
                                        id="rateDeduction"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        placeholder="Enter rate deduction"
                                        value={formData.widthdrawCharge}
                                        onInput={(e) => setFormData((prevState) => ({ ...prevState, widthdrawCharge: parseFloat((e.target as HTMLInputElement).value) }))}
                                    />
                                </div>
                            </div>

                        </div>

                    </div>
                )}
                <div>
                    <label htmlFor="remark" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your Remark</label>
                    <textarea
                        rows={4}
                        className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Write your remark here..."
                        value={formData.remark || ''}
                        onInput={(e) => setFormData((prevState) => ({ ...prevState, remark: (e.target as HTMLInputElement).value }))}
                    />
                </div>

                <div className="flex mt-6 gap-2">
                    <button onClick={handleSave} className="btn-secondary-outline flex-1">
                        <Save className='w-5 h-5' />
                        <span>{transactionToEdit ? 'Update' : 'Save'}</span>
                    </button>
                    
                    <button onClick={handleClose} className="btn-secondary flex-1">
                        <X className='w-5 h-5' />
                        <span>Close</span>
                    </button>
                </div>
                
            </div>
        </div>
    );
};

export default AmountManagementModal;
