import useBodyScrollLock from "@/hooks/useBodyScrollLock";
import { formatDate, formatTime } from "@/utils/helper";
import React, { useEffect } from "react";
import KeyValueTable from "./KeyValueTable";


const DeactivateAccountModal = (
    {
        title,
        description,
        positiveButtonText,
        negativeButtonText,
        isOpen,
        onClose,
        onDelete
    }: {
        title: string,
        description: string,
        positiveButtonText: string,
        negativeButtonText: string,
        isOpen: any,
        onClose: () => void,
        onDelete: (data: any) => void

    }
) => {
    useBodyScrollLock(isOpen);
    if (!isOpen) return null;
    return (
        <main className="fixed inset-0 antialiased flex items-center justify-center z-50 bg-gray-800 bg-opacity-50  text-gray-900 font-sans overflow-x-hidden">
            <div className="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">

                {/* 
                    Background backdrop, show/hide based on modal state.
                    Entering: "ease-out duration-300"
                    From: "opacity-0"
                    To: "opacity-100"
                    Leaving: "ease-in duration-200"
                    From: "opacity-100"
                    To: "opacity-0" 
                */}
                <div className="fixed inset-0 bg-gray-500/75 transition-opacity" aria-hidden="true"></div>

                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0 ">
                        {/*
                            Modal panel, show/hide based on modal state.
                            Entering: "ease-out duration-300"
                            From: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            To: "opacity-100 translate-y-0 sm:scale-100"
                            Leaving: "ease-in duration-200"
                            From: "opacity-100 translate-y-0 sm:scale-100"
                            To: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        */}
                        <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg 
                        dark:bg-gray-800">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 dark:bg-gray-800">
                                <div className="sm:flex sm:items-start">
                                    <div className="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-red-300 sm:mx-0 sm:size-10">
                                        <svg className="size-6 text-red-600 dark:text-red-900" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                                        </svg>
                                    </div>
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                        <h3 className="text-base font-semibold text-gray-900 dark:text-gray-300" id="modal-title">{title}</h3>
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-500">{description}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {isOpen && typeof isOpen === 'object' && (
                                <KeyValueTable data={isOpen} />
                            )}


                            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 dark:bg-gray-800">
                                <button onClick={() => {
                                    onDelete(isOpen); // Perform the delete action
                                    onClose(); // Close the dialog after the delete action
                                }}
                                    type="button"
                                    className="inline-flex w-full justify-center rounded-md bg-red-600 dark:bg-red-800 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-red-500 sm:ml-3 sm:w-auto ">
                                    {positiveButtonText}
                                </button>
                                <button onClick={onClose} type="button" className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50 sm:mt-0 sm:w-auto dark:bg-gray-900 dark:text-gray-400 dark:ring-gray-500">{negativeButtonText}</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
export default DeactivateAccountModal;