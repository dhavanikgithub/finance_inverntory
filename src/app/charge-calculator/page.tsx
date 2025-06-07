'use client';

import React, { useState } from 'react';
import Modal from '@/components/Modal';
import InputField from '@/components/InputField';
import Dashboard from '@/components/Dashboard';
import { SectionContent, SectionHeader, SectionHeaderLeft, SectionHeaderRight, SubHeading, Heading } from '@/components/Section';
import { IndianRupee, Percent } from 'lucide-react';


export default function ChargeCalculationScreen() {
    const [amount, setAmount] = useState('');
    const [bankCharge, setBankCharge] = useState('');
    const [myCharge, setMyCharge] = useState('');
    const [platformCharge, setPlatformCharge] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [results, setResults] = useState({
        total: 0,
        payable: 0,
        profit: 0,
    });

    const resetForm = () => {
        setAmount('');
        setBankCharge('');
        setMyCharge('');
        setPlatformCharge('');
        setIsModalOpen(false);
        setResults({ total: 0, payable: 0, profit: 0 });
    };

    const handleCalculate = () => {
        const amt = parseFloat(amount);
        const bankRate = parseFloat(bankCharge) / 100;
        
        const gst = 18;
        
        const myRate = parseFloat(myCharge) / 100;
        const platform = parseFloat(platformCharge);

        const totalBankWithGst = bankRate + (bankRate * (gst / 100));
        
        const markup = myRate - totalBankWithGst;

        const earned = amt * markup;
        const profit = earned - platform;
        const payable = amt - (amt * myRate);

        setResults({ total: amt, payable, profit });
        setIsModalOpen(true);
    };

    return (
        <Dashboard>
            <SectionHeader>
                <SectionHeaderLeft>
                    <Heading>Charge Calculator</Heading>
                    {/* <SubHeading>
                        Manage, review, add, update, or delete client records and their transactions.
                    </SubHeading> */}
                </SectionHeaderLeft>
            </SectionHeader>
            <SectionContent>
               <div className="max-w-md mx-auto mt-10 p-6 rounded-lg shadow">
                        <div className="space-y-4">
                            <InputField
                                label="Amount (₹)"
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="e.g., 50000"
                                icon={<IndianRupee />}
                            />
                            <InputField
                                label="Bank Charge (%) + GST (18% auto include at background)"
                                type="number"
                                value={bankCharge}
                                onChange={(e) => setBankCharge(e.target.value)}
                                placeholder="e.g., 1.27"
                                icon={<Percent />}
                            />
                            <InputField
                                label="My Charge (%)"
                                type="number"
                                value={myCharge}
                                onChange={(e) => setMyCharge(e.target.value)}
                                placeholder="e.g., 1.8"
                                icon={<Percent />}
                            />
                            <InputField
                                label="Platform Charge (₹)"
                                type="number"
                                value={platformCharge}
                                onChange={(e) => setPlatformCharge(e.target.value)}
                                placeholder="e.g., 25"
                                icon={<IndianRupee />}
                            />
                            <div className="flex gap-4 mt-4">
                                <button className="btn-secondary-outline" onClick={handleCalculate}>Calculate</button>
                                <button className="btn-secondary" onClick={resetForm}>Reset</button>
                            </div>
                        </div>

                        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Calculation Result">
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="font-medium">Total Amount:</span>
                                    <span>₹{results.total.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium">Payable Amount:</span>
                                    <span>₹{results.payable.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium">Profit:</span>
                                    <span>₹{results.profit.toFixed(2)}</span>
                                </div>
                            </div>
                        </Modal>
                    </div>
            </SectionContent>
        </Dashboard>

    );
}
