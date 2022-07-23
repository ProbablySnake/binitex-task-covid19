import React from 'react'
import { ButtonGroup, ToggleButton } from 'react-bootstrap'
import './TabSelect.css'

interface Props {
  tabs: { name: string, value: string }[],
  selectedTab: string,
  setSelectedTab: React.Dispatch<React.SetStateAction<string>>,
}

export default function TabSelect({ tabs, selectedTab, setSelectedTab }: Props) {
  return (
    <div className='row mt-4 btn-flat-bottom'>
      <div className='col-sm-auto'>
        <ButtonGroup>
          {tabs.map((radio, idx) => (
            <ToggleButton
              key={idx}
              id={`radio-${idx}`}
              type="radio"
              variant='light'
              name="radio"
              value={radio.value}
              checked={selectedTab === radio.value}
              onChange={(e) => setSelectedTab(e.currentTarget.value)}
            >
              {radio.name}
            </ToggleButton>
          ))}
        </ButtonGroup>
      </div>
    </div>
  )
}