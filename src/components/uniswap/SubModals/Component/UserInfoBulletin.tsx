import React, {useContext, useState} from 'react'
import styled, {ThemeContext} from 'styled-components'
import {AutoColumn} from '../../Column'
import useMarginAccount from "../../../../hooks/useMarginAccount";
import Spacer from "../../../Spacer";
import UserAccountInfo from "../../../../para/component/UserAccountInfo";
import {Text} from "rebass";


const StyledModalTitle = styled.div`
  color: ${props => props.theme.color.white};
  flex: 1;
  font-size: 20px;
  font-weight: 500;
`;


export default function UserInfoBulletin() {
  const theme = useContext(ThemeContext)
  const [showInverted, setShowInverted] = useState<boolean>(false)
  const marginAccount = useMarginAccount()
  return (
    <AutoColumn gap="0px">
      <StyledModalTitle>
        {'User Balance'}
      </StyledModalTitle>
      <Spacer size="md"/>
      <UserAccountInfo />
    </AutoColumn>
  )
}
