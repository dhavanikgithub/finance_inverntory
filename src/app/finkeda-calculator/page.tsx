'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Modal from '@/components/Modal';
import InputField from '@/components/InputField';
import Dashboard from '@/components/Dashboard/Dashboard';
import { SectionContent, SectionHeader, SectionHeaderLeft, SectionHeaderRight, SubHeading, Heading } from '@/components/Section';
import { IndianRupee, Percent, Settings } from 'lucide-react';
import SegmentSelector from '@/components/SegmentSelector/SegmentSelector';
import SettingsModal from './SettingsModal';
import { AppDispatch, RootState } from '@/store/store';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFinkedaSettings } from '@/store/actions/finkedaSettingsActions';


export default function FinkedaCalculationScreen() {
    const [amount, setAmount] = useState('');
    const [bankCharge, setBankCharge] = useState('1.3');
    const [myCharge, setMyCharge] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
    const [results, setResults] = useState({
        total: 0,
        payable: 0,
        profit: 0,
        platformCharge: 0,
        portalAmount: 0
    });
    const [platformChargeSelectedOption, setPlaformChargeSelectedOption] = useState<string | null>(null);
    const dispatch: AppDispatch = useDispatch();
    const { settings } = useSelector((state: RootState) => state.finkedaSettings);
    const [platformCharge, setPlatformCharge] = useState<string>('0')
    useEffect(() => {
        console.log("Selected Plat form charges: ", platformChargeSelectedOption)
        setPlatformCharge((platformChargeSelectedOption === 'Rupay' ? settings!!.rupay_card_charge_amount : platformChargeSelectedOption === 'Master' ? settings!!.master_card_charge_amount : 0).toString());
    }, [settings, platformChargeSelectedOption]);

    useEffect(() => {
        dispatch(fetchFinkedaSettings());
    }, []);

    const handleSettingsModalOpen = () => {
        setIsSettingsModalOpen(true);
    }

    const resetForm = () => {
        setAmount('');
        setMyCharge('');
        setPlaformChargeSelectedOption(null);
        setIsModalOpen(false);
        setResults({ total: 0, payable: 0, profit: 0, platformCharge: 0, portalAmount: 0 });
    };

    const handleCalculate = () => {

        const amt = parseFloat(amount);
        const bankRate = parseFloat(bankCharge) / 100;



        const myRate = parseFloat(myCharge) / 100;


        const platform = parseFloat(platformCharge) / 100;

        const markup = myRate - bankRate;

        const earned = amt * markup;

        const profit = earned - (amt * platform);
        const payable = amt - (amt * myRate);

        setResults({ total: amt, payable, profit, platformCharge: (amt * platform), portalAmount: (amt - (amt * platform))  });
        setIsModalOpen(true);
    };

    const platformChargeOptions = ['Rupay', 'Master']

    function handleOnSettingModalClose(rupayAmount?: number, masterAmoount?: number) {
        if (masterAmoount && rupayAmount) {
            dispatch(fetchFinkedaSettings());
        }
        setIsSettingsModalOpen(false);
    }
    return (
        <Dashboard>
            <SectionHeader>
                <SectionHeaderLeft>
                    <Heading>Finkeda Calculator</Heading>
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
                            required={true}
                        />
                        <InputField
                            label="Bank Charge (%)"
                            type="number"
                            value={bankCharge}
                            onChange={(e) => null}
                            placeholder="e.g., 1.27"
                            disabled={true}
                            icon={<Percent />}

                        />
                        <InputField
                            label="My Charge (%)"
                            type="number"
                            value={myCharge}
                            onChange={(e) => setMyCharge(e.target.value)}
                            placeholder="e.g., 1.8"
                            icon={<Percent />}
                            required={true}
                        />

                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Platform Charges <span className="text-red-500">*</span>
                        </label>
                        <SegmentSelector
                            options={platformChargeOptions}
                            multiSelect={false}
                            onSelect={(value) => setPlaformChargeSelectedOption(value[0])}
                            disabled={settings === undefined || settings === null}
                            required={false}
                        />
                        {platformChargeSelectedOption &&
                            <InputField
                                label={`${platformChargeSelectedOption} Card Charge (%)`}
                                type="number"
                                value={platformCharge}
                                // onChange={(e) => setPlatformCharge(e.target.value)}
                                onChange={(e) => null}
                                disabled={true}
                                placeholder="e.g., 25"
                                icon={<Percent />}
                            />
                        }

                        

                        <div className="flex gap-4 mt-4">
                            <button className="btn-secondary" onClick={handleCalculate}>Calculate</button>
                            <button className="btn-secondary-outline" onClick={resetForm}>Reset</button>
                            <button className="btn-secondary-outline" onClick={handleSettingsModalOpen}>
                                <Settings className='w-4 h-4' />
                            </button>
                        </div>
                    </div>
                    <SettingsModal isOpen={isSettingsModalOpen} onClose={handleOnSettingModalClose} settings={settings} />
                    <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Calculation Result">
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="font-medium">Total Amount:</span>
                                <span>₹ {results.total.toFixed(2)}/-</span>
                            </div>
                            <div className="flex justify-between border border-red-400 p-2">
                                <span className="font-medium ">Portal Amount:</span>
                                <span className='text-red-400'>₹ {results.portalAmount.toFixed(2)}/-</span>
                            </div>
                            <div className="flex justify-between border border-blue-400 p-2">
                                <span className="font-medium ">Payable Amount:</span>
                                <span className='text-blue-400'>₹ {results.payable.toFixed(2)}/-</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium">Platform Charges Amount:</span>
                                <span>₹ {results.platformCharge.toFixed(2)}/-</span>
                            </div>
                            
                            <div className="flex justify-between border border-yellow-400 p-2">
                                <span className="font-medium">Profit:</span>
                                <span className='text-yellow-400'>₹ {results.profit.toFixed(2)}/-</span>
                            </div>
                        </div>
                    </Modal>
                </div>
            </SectionContent>
        </Dashboard>

    );
}
