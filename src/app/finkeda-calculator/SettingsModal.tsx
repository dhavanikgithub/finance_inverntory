import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateFinkedaSettings } from '@/store/actions/finkedaSettingsActions';
import Modal from '@/components/Modal';
import { IndianRupee, Percent } from 'lucide-react';
import InputField from '@/components/InputField';
import { AppDispatch } from '@/store/store';

interface Props {
  isOpen: boolean;
  onClose: (rupay?:number,master?:number) => void;
  settings: {
    id?: number;
    rupay_card_charge_amount: number;
    master_card_charge_amount: number;
  } | null;
}

const SettingsModal: React.FC<Props> = ({ isOpen, onClose, settings }) => {
  const dispatch: AppDispatch = useDispatch();
  const [rupay, setRupay] = useState('');
  const [master, setMaster] = useState('');

  useEffect(() => {
    if (isOpen && settings) {
      setRupay(settings.rupay_card_charge_amount.toString());
      setMaster(settings.master_card_charge_amount.toString());
    }
  }, [isOpen, settings]);

  const handleSubmit = () => {
    if (!settings) return;
    dispatch(
      updateFinkedaSettings({
        ...settings,
        rupay_card_charge_amount: parseFloat(rupay),
        master_card_charge_amount: parseFloat(master),
      })
    );
    handleOnClose();
  };

  const handleOnClose = () => {
    onClose(parseFloat(rupay),parseFloat(master));
    setMaster('');
    setRupay('');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Finkeda Card Charges">
      <div className="space-y-4">
        <InputField
          label="RuPay Charge (%)"
          type="number"
          value={rupay}
          onChange={(e) => setRupay(e.target.value)}
          disabled={false}
          placeholder="e.g., 25"
          icon={<Percent />}
        />
        <InputField
          label="MasterCard Charge (%)"
          type="number"
          value={master}
          onChange={(e) => setMaster(e.target.value)}
          disabled={false}
          placeholder="e.g., 25"
          icon={<Percent />}
        />
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save Changes
        </button>
      </div>
    </Modal>
  );
};

export default SettingsModal;
