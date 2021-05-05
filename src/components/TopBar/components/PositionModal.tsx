import React, {useContext} from 'react';
import Modal, {ModalProps} from '../../Modal';
import Button from '../../Button';
import styled, {ThemeContext} from 'styled-components';
import {TextProps} from 'rebass'
import {TextWrapper, TYPE} from "../../../theme";
import QuestionHelper from "../../uniswap/QuestionHelper";
import CurrencyLogo from "../../uniswap/CurrencyLogo";

const MAX_TRANSACTION_HISTORY = 10;

const PositionModal: React.FC<ModalProps> = ({onDismiss}) => {
  const theme = useContext(ThemeContext)


  return (
    <StyledModal>
      <StyledTitleArea>
        <StyledModalTitle>Position</StyledModalTitle>
      </StyledTitleArea>
      <StyledContentArea>
        <RowBetweenA>
          <RowFixed>
            <PositionText fontSize={14} fontWeight={400} color={theme.color.text2}>
              {'Contract'}
            </PositionText>
            <QuestionHelper text="The difference between the market price and your price due to trade size."/>
          </RowFixed>
          <RowFixed>
            <CurrencyLogo name={'ETH'} style={{paddingRight: '5%'}}/>
            <PositionText fontSize={14} fontWeight={400} color={theme.color.white}>
              {"BTC/USDT"}
            </PositionText>
          </RowFixed>
        </RowBetweenA>

        <RowBetweenB>
          <RowFixed>
            <PositionText fontSize={14} fontWeight={400} color={theme.color.text2}>
              {'Side'}
            </PositionText>
          </RowFixed>
          <RowFixed>
            <PositionText fontSize={14} fontWeight={400} color={theme.color.green1}>
              {"BUY/LONG"}
            </PositionText>
          </RowFixed>
        </RowBetweenB>

        <RowBetweenA>
          <RowFixed>
            <PositionText fontSize={14} fontWeight={400} color={theme.color.text2}>
              {'Position Size'}
            </PositionText>
          </RowFixed>
          <RowFixed gap={"5px"}>
            <RowFixed>
              <PositionText fontSize={14} fontWeight={400} color={theme.color.white}>
                {"1.12 BTC"}
              </PositionText>
            </RowFixed>
            <RowFixed gap={""}>
              <Button
                onClick={() => {
                }}
                size="sm"
                text="Market Close"
                variant="secondary"
                disabled={false}
              />
            </RowFixed>
          </RowFixed>
        </RowBetweenA>

        <RowBetweenB>
          <RowFixed>
            <PositionText fontSize={14} fontWeight={400} color={theme.color.text2}>
              {'Average Entry Price'}
            </PositionText>
          </RowFixed>
          <RowFixed>
            <PositionText fontSize={14} fontWeight={400} color={theme.color.white}>
              {"62003.23"}
            </PositionText>
          </RowFixed>
        </RowBetweenB>

        <RowBetweenA>
          <RowFixed>
            <PositionText fontSize={14} fontWeight={400} color={theme.color.text2}>
              {'Notional Entry Value'}
            </PositionText>
          </RowFixed>
          <RowFixed>
            <PositionText fontSize={14} fontWeight={400} color={theme.color.white}>
              {"70022.22"}
            </PositionText>
          </RowFixed>
        </RowBetweenA>

        <RowBetweenB>
          <RowFixed>
            <PositionText fontSize={14} fontWeight={400} color={theme.color.text2}>
              {'Margin/Leverage'}
            </PositionText>
          </RowFixed>
          <RowFixed>
            <PositionText fontSize={14} fontWeight={400} color={theme.color.white}>
              {"50000 / 1.1X"}
            </PositionText>
          </RowFixed>
        </RowBetweenB>

        <RowBetweenA>
          <RowFixed>
            <PositionText fontSize={14} fontWeight={400} color={theme.color.text2}>
              {'Unrealized PNL/ROE'}
            </PositionText>
          </RowFixed>
          <RowFixed>
            <PositionText fontSize={14} fontWeight={400} color={theme.color.white}>
              {"100.23 TestUSDT / +3.44%"}
            </PositionText>
          </RowFixed>
        </RowBetweenA>

        <RowBetweenB>
          <RowFixed>
            <TYPE.black fontSize={14} fontWeight={400} color={theme.color.text2}>
              {'Liquidation Price'}
            </TYPE.black>
          </RowFixed>
          <RowFixed>
            <PositionText color={theme.color.white}>
              {"30000"}
            </PositionText>
          </RowFixed>
        </RowBetweenB>
      </StyledContentArea>


    </StyledModal>
  )
}


function PositionText(props: TextProps) {
  return <TextWrapper fontWeight={400} fontSize={14} padding={"10px 0 10px 0"} {...props} />
}


const StyledModal = styled(Modal)`
  width: 360px;
`;

const StyledTitleArea = styled.div`
  display: flex;
  align-items: center;
  height: ${props => props.theme.topBarSize}px;
  margin-top: ${props => -props.theme.spacing[4]}px;
`;

const StyledContentArea = styled.div`
  margin-left: 50px;
  margin-right: 50px;
  margin-bottom: 50px;
`;

const StyledModalTitle = styled.div`
  color: ${props => props.theme.color.grey[300]};
  flex: 1;
  font-size: 18px;
  font-weight: 700;
`;


const Row = styled.div<{ align?: string; padding?: string; border?: string; borderRadius?: string }>`
  width: 100%;
  display: flex;
  padding: 0;
  align-items: ${({align}) => (align ? align : 'center')};
  padding: ${({padding}) => padding};
  border: ${({border}) => border};
  border-radius: ${({borderRadius}) => borderRadius};
`

const RowBetweenA = styled(Row)`
  justify-content: space-between;
  background-color: ${({theme}) => theme.color.grey[800]};
  padding: 0px 5px 0px 5px;
  :hover {
    background-color: ${({theme}) => theme.color.grey[600]};
  }
`

const RowBetweenB = styled(Row)`
  justify-content: space-between;
  background-color: ${({theme}) => theme.color.grey[800]};
  padding: 0px 5px 0px 5px;
  :hover {
    background-color: ${({theme}) => theme.color.grey[600]};
  }
`

const RowFixed = styled(Row)<{ gap?: string; justify?: string }>`
  width: fit-content;
  margin: ${({gap}) => gap && `-${gap}`};
`

export default PositionModal;