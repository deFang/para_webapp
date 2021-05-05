import React from 'react'
import styled from 'styled-components'
import {AutoColumn} from '../../Column'
import Spacer from "../../../Spacer";
import UserAccountInfo from "../../../../para/component/UserAccountInfo";


const StyledModalTitle = styled.div`
  color: ${props => props.theme.color.white};
  flex: 1;
  font-size: 20px;
  font-weight: 500;
`;

interface MarketCloseProps {
  showMarketClose?: boolean;
  handleMarketClose?: () => void;
}


const UserInfoBulletin: React.FC<MarketCloseProps> = (
  {
    showMarketClose = false,
    handleMarketClose
  }) => {
  return (
    <AutoColumn gap="0px">
      <StyledModalTitle>
        {'User Balance'}
      </StyledModalTitle>
      <Spacer size="md"/>
      <UserAccountInfo showMarketClose={showMarketClose} handleMarketClose={handleMarketClose}/>
    </AutoColumn>
  )
}

export default UserInfoBulletin;