import React from 'react'
import styled from 'styled-components'
import {AutoColumn} from '../../Column'
import Spacer from "../../../Spacer";
import PoolAccountInfo from "../../../../para/component/PoolAccountInfo";

const StyledModalTitle = styled.div`
  color: ${props => props.theme.color.white};
  flex: 1;
  font-size: 20px;
  font-weight: 500;
`;

export default function PoolInfoBulletin() {
  return (
    <AutoColumn gap="0px">
      <StyledModalTitle>
        {'Pool Balance'}
      </StyledModalTitle>
      <Spacer size="md"/>
      <PoolAccountInfo/>
    </AutoColumn>
  )
}
