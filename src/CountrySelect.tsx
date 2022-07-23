import React from 'react'
import { Button } from 'react-bootstrap';
import SelectSearch, { fuzzySearch, SelectSearchOption } from 'react-select-search'

interface Props {
  isActive: boolean,
  countries: SelectSearchOption[],
  countrySelected: string | undefined,
  setCountrySelected: React.Dispatch<React.SetStateAction<string | undefined>>,
}

export default function CountrySelect({ isActive, countries, countrySelected, setCountrySelected }: Props) {

  if (!isActive) return <></>

  return (
    <div className='row my-2'>
      <div className='col-md-3 my-1'>
        <SelectSearch
          options={countries}
          filterOptions={fuzzySearch}
          value={countrySelected}
          search={true}
          placeholder='Country or region'
          onChange={(v: any) => { setCountrySelected(v) }}
        />
      </div>
      <div className='col-sm-auto my-1 ms-auto'>
        <Button
          variant='outline-dark'
          onClick={() => { setCountrySelected(undefined) }}
        >
          Reset
        </Button>
      </div>
    </div>
  )
}