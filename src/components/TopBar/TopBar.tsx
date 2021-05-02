import React from 'react'
import styled from 'styled-components'

import Container from '../Container'
import Logo from '../Logo'

import PositionButton from './components/PositionButton'
import TxButton from './components/TxButton'
import ClaimTestBUSD from "./components/ClaimTestBUSD";


const TopBar: React.FC = () => {
  return (
    <StyledTopBar>
      <Container size="lg">
        <StyledTopBarInner>
          <div style={{ flex: 1 }}>
            <Logo />
          </div>
          <div style={{
            flex: 1,
            display: 'flex',
            justifyContent: 'flex-end'
          }}>
            <ClaimTestBUSD />
            <TxButton />
            <PositionButton />
          </div>
        </StyledTopBarInner>
      </Container>
    </StyledTopBar>
  )
}

const StyledTopBar = styled.div``

const StyledTopBarInner = styled.div`
  align-items: center;
  display: flex;
  height: ${props => props.theme.topBarSize}px;
  justify-content: space-between;
  max-width: ${props => props.theme.siteWidth}px;
  width: 100%;
  flex-wrap: wrap;
`

export default TopBar