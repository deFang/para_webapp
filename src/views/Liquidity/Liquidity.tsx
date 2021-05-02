import React, {useCallback, useContext, useEffect, useState} from 'react';
import styled from 'styled-components';
import {useWallet} from 'use-wallet';
import Page from '../../components/Page';
import Spacer from '../../components/Spacer';
import Button from "../../components/Button";
import {ButtonDropdownLight} from "../../components/uniswap/ButtonDropdown";
import Row from "../../components/uniswap/Row";
import {Text} from 'rebass'
import CurrencyLogo from "../../components/uniswap/CurrencyLogo";
import SelectContract from "../../components/uniswap/SubModals/SelectContract";
import Modal from "../../components/uniswap/Modal";
import usePara from "../../hooks/usePara";
import useApprove, {ApprovalState} from "../../hooks/useApprove";
import {TestUSDTAddress, ParaAddress} from "../../deployment/const";
import BuySellFooter from "../../components/uniswap/SubModals/Component/BuySellFooter";
import LiquidityAddRemove from "../../components/uniswap/SubModals/LiquidityAddRemove";

const FooterWrapper = styled.div`
  width: 100%;
  position: relative;
  background-color: ${({theme}) => theme.color.bg3};
  border-radius: 20px;
`

const Liquidity: React.FC = () => {
  const onConfirm = () => {
    return
  };
  const onDismiss = () => {
    return
  };


  const handleConfirm = useCallback(() => {
    onConfirm();
    // onDismiss();
  }, [onConfirm, onDismiss]);
  const handleDismiss = useCallback(() => onDismiss(), [onDismiss]);
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const handleSearchDismiss = useCallback(() => {
    setShowSearch(false)
  }, [setShowSearch])

  const {account, connect, status, error} = useWallet()
  const para = usePara()

  const [addOpen, setAddOpen] = useState<boolean>(false);
  const [removeOpen, setRemoveOpen] = useState<boolean>(false);

  const handleDismissAddRemove = useCallback(
    () => {
      addOpen ? setAddOpen(false) : setRemoveOpen(false)
    },
    [addOpen, removeOpen]
  );

  const ApproveSector: React.FC = () => {
    const [approveStatus, approve] = useApprove(para?.TestUSDT, ParaAddress);

    return (
    <>
      {
        approveStatus !== ApprovalState.APPROVED ? (
          <StyledModalAction>
            <Button
              onClick={approve}
              size="lg"
              text="Approve TestUSDT"
              variant="secondary"
              disabled={approveStatus === ApprovalState.PENDING}
            />
          </StyledModalAction>
        ) : (
          <Wrapper>
            <StyledModalAction>
              <Button
                size="lg"
                text="ADD LP"
                onClick={() => {
                  setAddOpen(true)
                }}
                variant="default"
              />
            </StyledModalAction>
            <StyledModalAction>
              <Button
                size="lg"
                text="REMOVE LP"
                onClick={() => {
                  setRemoveOpen(true)
                }}
                variant="tertiary"
              />
            </StyledModalAction>
          </Wrapper>
        )
      }
    </>
    )
  }

  const DepositModal: React.FC = () => {
    return (
      <>
        {!account || !para ? (
          <StyledModalAction>
            <Button
              onClick={() => {
                connect('injected')
              }}
              size="lg"
              text="Unlock Wallet"
              variant="secondary"
            />
          </StyledModalAction>
        ) : (<ApproveSector />)
        }
      </>
    )
  }


  return (
    <>
      <Page>
        <StyledCard>
          <ButtonDropdownLight
            onClick={() => {
              setShowSearch(true)
            }}
          >
            <Row>
              <CurrencyLogo name={"ETHER"}/>
              <Text fontWeight={500} fontSize={20} marginLeft={'12px'}>
                {"BTC/USDT"}
              </Text>
            </Row>
          </ButtonDropdownLight>
          <Spacer size="md"/>
          <FooterWrapper>
            <BuySellFooter
              trade={true}
            />
          </FooterWrapper>
          <Spacer size="md"/>
          <Wrapper>
            <DepositModal/>
          </Wrapper>


          <Modal isOpen={showSearch} onDismiss={handleSearchDismiss} maxHeight={80} minHeight={10}>
            <SelectContract
              onDismiss={handleSearchDismiss}
            />
          </Modal>


          <Modal isOpen={ addOpen || removeOpen } onDismiss={() => {}} maxHeight={80} minHeight={10}>
            <LiquidityAddRemove
              onDismiss={handleDismissAddRemove}
              addOpen={addOpen}
            />
          </Modal>

        </StyledCard>


      </Page>

    </>
  );
};




const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
`;




const StyledModalAction = styled.div`
  flex: 1;
`

const StyledCard = styled.div`
  width: 420px;
  background-color: ${({theme}) => theme.color.bg1};
  border: 1px solid ${(props) => props.theme.color.grey[900]};
  box-sizing: border-box;
  padding: 36px;
  border-radius: 48px;

  display: flex;
  align-items: center;
  flex-direction: column;
`;


export default Liquidity;
