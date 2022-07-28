import React from 'react'
import { Button } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

import { IDateRangeSelectProps } from '../types';

import './DateRangeSelect.css'

export default function DateRangeSelect({ minDate, maxDate, dateRange, setDateRange }: IDateRangeSelectProps) {
  return (
    <div className='row mt-3 mt-md-5'>
        <div className='col-sm-3 my-1'>
          <DatePicker
            dateFormat="yyyy/MM/dd"
            selectsStart
            selected={dateRange.start}
            minDate={minDate}
            maxDate={maxDate}
            startDate={dateRange.start}
            endDate={dateRange.end}
            onChange={date => { setDateRange((prev: { start: Date | null, end: Date | null }) => { return { ...prev, start: date } }) }}
            className='form-control' />
        </div>
        <div className='col-sm-3 my-1'>
          <DatePicker
            dateFormat="yyyy/MM/dd"
            selectsEnd
            selected={dateRange.end}
            minDate={minDate}
            maxDate={maxDate}
            startDate={dateRange.start}
            endDate={dateRange.end}
            onChange={date => { setDateRange((prev: { start: Date | null, end: Date | null }) => { return { ...prev, end: date } }) }}
            className='form-control' />
        </div>
        <div className='col-sm-auto my-1'>
          <Button
            variant='light'
            onClick={() => { setDateRange({ start: minDate, end: maxDate }) }}
          >
            Reset dates
          </Button>
        </div>
    </div>
  )
}