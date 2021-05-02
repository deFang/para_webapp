import React from 'react'
import styled from 'styled-components'

import Footer from '../Footer'
import TopBar from '../TopBar'

const Page: React.FC = ({ children }) => (
  <StyledPage>
    <TopBar />
    <StyledMain>
      {children}
    </StyledMain>
    <Footer />
  </StyledPage>
)

const StyledPage = styled.div`
    background-color: ${props => props.theme.color.black};
`

const StyledMain = styled.div`
  align-items: center;
  justify-content: center;
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - ${props => props.theme.topBarSize * 2}px);
  padding-bottom: ${props => props.theme.spacing[5]}px;
`

export default Page