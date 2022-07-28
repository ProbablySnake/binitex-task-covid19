import React, { ChangeEvent } from 'react'
import { Button } from 'react-bootstrap'
import SelectSearch, { fuzzySearch, SelectSearchOption } from 'react-select-search'
import './SelectSearch.css'
import { IFilterSelectedPeriod } from '../types';
import { filterFieldsPeriod } from '../utils';

interface IFiltersSelectPeriodProps {
  isActive: boolean,
  countries: SelectSearchOption[],
  countrySelected: string | undefined,
  setCountrySelected: React.Dispatch<React.SetStateAction<string | undefined>>,
  filterSelected: IFilterSelectedPeriod,
  setFilterSelected: React.Dispatch<React.SetStateAction<IFilterSelectedPeriod>>,
  filterRange: { min: string | undefined, max: string | undefined },
  setFilterRange: React.Dispatch<React.SetStateAction<{ min: string | undefined, max: string | undefined }>>,
}

function FiltersSelectPeriod({ isActive, countries, countrySelected, setCountrySelected, filterSelected, setFilterSelected, filterRange, setFilterRange }: IFiltersSelectPeriodProps) {


  function handleFilterMinChange(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.value.match(/^(\d+((\.\d+)|\.)?)$/)) //   /^(\d+((\.\d+)|\.)?)$/  =>  number || number with dot || number dot number
      setFilterRange((prev: { min: string | undefined, max: string | undefined }) => { return { ...prev, min: event.target.value } });
    if (event.target.value === '')
      setFilterRange((prev: { min: string | undefined, max: string | undefined }) => { return { ...prev, min: undefined } });
  }

  function handleFilterMaxChange(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.value.match(/^(\d+((\.\d+)|\.)?)$/))
      setFilterRange((prev: { min: string | undefined, max: string | undefined }) => { return { ...prev, max: event.target.value } });
    if (event.target.value === '')
      setFilterRange((prev: { min: string | undefined, max: string | undefined }) => { return { ...prev, max: undefined } });
  }

  if (!isActive) return <></>

  return (
    <>
      <div className='row mt-2'>
        <div className='col-xl-4 col-lg-5 col-md-6 my-1'>
          <SelectSearch
            options={[{ name: '', value: '' }, ...countries]}
            filterOptions={fuzzySearch}
            value={countrySelected}
            search={true}
            placeholder='Country or region'
            onChange={(v: any) => { setCountrySelected(v.length > 0 ? v : undefined) }}
          />
        </div>
        <div className='col-xl-4 col-lg-5 col-md-6 my-1'>
          <SelectSearch
            options={filterFieldsPeriod}
            value={filterSelected}
            placeholder='Filtering field'
            onChange={(v: any) => { setFilterSelected(v) }}
          />
        </div>
      </div>
      <div className='row mb-2'>
        <div className='col-md-2 col-sm-3 col-4 my-1'>
          <input className='form-control border-dark' placeholder='Min value' value={filterRange.min ?? ''} onChange={handleFilterMinChange} />
        </div >
        <div className='col-md-2 col-sm-3 col-4 my-1'>
          <input className='form-control border-dark' placeholder='Max value' value={filterRange.max ?? ''} onChange={handleFilterMaxChange} />
        </div>
        <div className='col-sm-auto col-4 my-1 d-flex'>
          <Button
            className='d-flex'
            variant='outline-secondary'
            onClick={() => {
              setCountrySelected('World');
              setFilterSelected(undefined);
              setFilterRange({ min: undefined, max: undefined });
            }}
          >
            Reset
          </Button>
        </div>
      </div>
    </>
  )
}

export default React.memo(FiltersSelectPeriod);
