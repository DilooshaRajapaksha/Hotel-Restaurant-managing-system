import React from 'react';
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import './DateRangePickerWrapper.css';

const DateRangePickerWrapper = ({ onChange, ranges }) => {
  return (
    <div className="date-range-wrapper">
      <DateRangePicker
        ranges={ranges}
        onChange={onChange}
        direction="horizontal"
        months={2}
        showDateDisplay={true}
        showSelectionPreview={true}
        moveRangeOnFirstSelection={false}
        minDate={new Date()}
        rangeColors={['#d4af37', '#d4af37']}
      />
    </div>
  );
};

export default DateRangePickerWrapper;