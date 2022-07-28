import React from 'react'
import { ButtonGroup, ToggleButton } from 'react-bootstrap'
import { ITabSelectProps } from '../types'

import './TabSelect.css'

export default function TabSelect({ tabs, selectedTab, setSelectedTab }: ITabSelectProps) {
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