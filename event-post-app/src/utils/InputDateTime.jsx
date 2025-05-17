import 'react-datepicker/dist/react-datepicker.css';
import React from 'react';
import DatePicker from 'react-datepicker';

/**
 * @param selectedTime - 選択された時間
 * @param onChange - 時間が変更されたときのコールバック関数
 */
const InputDateTime = ({ selectedTime, onChange }) => {
  return (
    <DatePicker
      selected={selectedTime} // ✅ **選択された時間を反映**
      onChange={(time) => onChange(time)} // ✅ **変更時に親コンポーネントの状態を更新**
      showTimeSelect
      showTimeSelectOnly // ⬅️ **時間のみ選択可能にする**
      timeFormat="HH:mm"
      timeIntervals={15} // ⬅️ **15分刻みで選択**
      dateFormat="HH:mm"
      //   timeCaption="時間"
      className="border p-2 rounded w-full"
    />
  );
};

export default InputDateTime;
