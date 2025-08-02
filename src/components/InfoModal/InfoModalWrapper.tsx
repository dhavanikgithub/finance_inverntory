import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useReducer,
} from 'react';
import InfoModal from './InfoModal';
import { InfoModalRef, InfoModalWrapperProps } from './types';



const InfoModalWrapper = forwardRef<InfoModalRef, InfoModalWrapperProps>((_, ref) => {
  const dataRef = useRef<Record<string, any> | null>(null);
  const titleRef = useRef<string>('Information');
  const columnsRef = useRef<{ label: string; accessor: string }[]>([]);
  // Dummy state to force refresh
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  const isOpen = useRef(false);

  useImperativeHandle(ref, () => ({
    open: (data, columns, title = 'Information') => {
      dataRef.current = data;
      titleRef.current = title;
      isOpen.current = true;
      columnsRef.current = columns || [];
      forceUpdate();
    },
    close: () => {
      isOpen.current = false;
      forceUpdate();
    },
  }));

  return (
    <InfoModal
      isOpen={isOpen.current}
      onClose={() => {
        isOpen.current = false;
        forceUpdate();
      }}
      columns={columnsRef.current}
      title={titleRef.current}
      data={dataRef.current || {}}
    />
  );
});

export default InfoModalWrapper;
