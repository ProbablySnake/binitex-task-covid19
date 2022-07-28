import React from 'react'
import { Button } from 'react-bootstrap';
import SelectSearch, { fuzzySearch, SelectSearchOption } from 'react-select-search'

interface IFiltersSelectChartProps {
  isActive: boolean,
  countries: SelectSearchOption[],
  countrySelected: string | undefined,
  setCountrySelected: React.Dispatch<React.SetStateAction<string>>,
  infoSelected: 'day' | 'total',
  setInfoSelected: React.Dispatch<React.SetStateAction<'day' | 'total'>>,
}

function FiltersSelectChart({ isActive, countries, countrySelected, setCountrySelected, infoSelected, setInfoSelected }: IFiltersSelectChartProps) {

  if (!isActive) return <></>

  return (
    <div className='row my-2'>
      <div className='col-xl-4 col-lg-5 col-md-6 col-sm-8 my-1'>
        <SelectSearch
          options={countries}
          filterOptions={fuzzySearch}
          value={countrySelected}
          search={true}
          placeholder='Country or region'
          onChange={(v: any) => { setCountrySelected(v) }}
        />
      </div>
      <div className='col-xl-4 col-lg-5 col-md-6 col-sm-8 my-1'>
        <SelectSearch
          options={[{ name: 'Per day', value: 'day' }, { name: 'Total', value: 'total' }]}
          value={infoSelected}
          placeholder='Filtering field'
          onChange={(v: any) => { setInfoSelected(v) }}
        />
      </div>
      <div className='col-sm-auto my-1 ms-auto'>
        <Button
          variant='outline-dark'
          onClick={() => { setCountrySelected('World'); setInfoSelected('day') }}
        >
          Reset
        </Button>
      </div>
    </div>
  )
}

export default React.memo(FiltersSelectChart);
