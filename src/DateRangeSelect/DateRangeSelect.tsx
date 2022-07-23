import React from 'react'
import { Button } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import './DateRangeSelect.css'

interface Props {
  minDate: Date,
  maxDate: Date,
  dateRange: { start: Date | null, end: Date | null },
  setDateRange: React.Dispatch<React.SetStateAction<{ start: Date | null, end: Date | null }>>,
}

export default function DateRangeSelect({ minDate, maxDate, dateRange, setDateRange }: Props) {
  return (
    <>
      <div className='row mt-3 mt-md-5'>
        <h5>Date range</h5>
      </div>
      <div className='row'>
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
    </>
  )
}