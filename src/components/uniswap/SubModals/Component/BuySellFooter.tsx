import React, {useContext, useState} from 'react'
import styled, {ThemeContext} from 'styled-components'
import {Repeat} from 'react-feather'
import {Text} from 'rebass'
import {TYPE} from '../../../../theme'
import {AutoColumn} from '../../Column'
import QuestionHelper from '../../QuestionHelper'
import {RowBetween, RowFixed} from '../../Row'
import Spacer from "../../../Spacer";


export const StyledBalanceMaxMini = styled.button`
  height: 22px;
  width: 22px;
  background-color: ${({ theme }) => theme.color.bg2};
  border: none;
  border-radius: 50%;
  padding: 0.2rem;
  font-size: 0.875rem;
  font-weight: 400;
  margin-left: 0.4rem;
  cursor: pointer;
  color: ${({ theme }) => theme.color.text2};
  display: flex;
  justify-content: center;
  align-items: center;
  float: right;

  :hover {
    background-color: ${({ theme }) => theme.color.bg3};
  }
  :focus {
    background-color: ${({ theme }) => theme.color.bg3};
    outline: none;
  }
`
const StyledModalTitle = styled.div`
  color: ${props => props.theme.color.grey[300]};
  flex: 1;
  font-size: 18px;
  font-weight: 700;
`;

export default function BuySellFooter({
  trade,
}: {
  trade: boolean
}) {
  const theme = useContext(ThemeContext)
  const [showInverted, setShowInverted] = useState<boolean>(false)


  return (
      <AutoColumn gap="0px">
        <StyledModalTitle>
        {'TRADE INFO'}
      </StyledModalTitle>
      <Spacer size="sm"/>
        <RowBetween align="center">
          <Text fontWeight={400} fontSize={14} color={theme.color.text2}>
            Price
          </Text>
          <Text
            fontWeight={500}
            fontSize={14}
            color={theme.color.text1}
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              display: 'flex',
              textAlign: 'right',
              paddingLeft: '10px'
            }}
          >
            999
            <StyledBalanceMaxMini onClick={() => setShowInverted(!showInverted)}>
              <Repeat size={14} />
            </StyledBalanceMaxMini>
          </Text>
        </RowBetween>

        <RowBetween>
          <RowFixed>
            <TYPE.black fontSize={14} fontWeight={400} color={theme.color.text2}>
              {'Minimum received'}
            </TYPE.black>
            <QuestionHelper text="Your transaction will revert if there is a large, unfavorable price movement before it is confirmed." />
          </RowFixed>
          <RowFixed>
            <TYPE.black fontSize={14}>
              test1
            </TYPE.black>
            <TYPE.black fontSize={14} marginLeft={'4px'}>
              test2
            </TYPE.black>
          </RowFixed>
        </RowBetween>
        <RowBetween>
          <RowFixed>
            <TYPE.black color={theme.color.text2} fontSize={14} fontWeight={400}>
              Price Impact
            </TYPE.black>
            <QuestionHelper text="The difference between the market price and your price due to trade size." />
          </RowFixed>
          10%
        </RowBetween>
        <RowBetween>
          <RowFixed>
            <TYPE.black fontSize={14} fontWeight={400} color={theme.color.text2}>
              Liquidity Provider Fee
            </TYPE.black>
            <QuestionHelper text="A portion of each trade (0.30%) goes to liquidity providers as a protocol incentive." />
          </RowFixed>
          <TYPE.black fontSize={14}>
            230
          </TYPE.black>
        </RowBetween>
      </AutoColumn>
  )
}
