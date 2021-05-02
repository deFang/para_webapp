import React, { useState } from 'react'
import { PaddedColumn, Separator } from './styleds'
import { RowBetween } from '../Row'
import { Text } from 'rebass'
import styled from 'styled-components'
import { ArrowLeft, X } from 'react-feather'
import ManageTokens from "./ManageTokens";

const CloseIcon = styled(X)<{ onClick: () => void }>`
  cursor: pointer;
`

const Wrapper = styled.div`
  width: 100%;
  position: relative;
  padding-bottom: 80px;
`

const ToggleWrapper = styled(RowBetween)`
  background-color: ${({ theme }) => theme.color.bg3};
  border-radius: 12px;
  padding: 0px;
`

const ToggleOption = styled.div<{ active?: boolean }>`
  width: 50%;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  font-weight: 600;
  background-color: ${({ theme, active }) => (active ? theme.color.primary1 : theme.color.bg3)};
  color: ${({ theme, active }) => (active ? theme.color.text1 : theme.color.text2)};
  user-select: none;
`

export default function DepositWithdraw({onDismiss,
}: {
  onDismiss: () => void
}) {
  // toggle between tokens and lists
  const [showLists, setShowLists] = useState(true)

  return (
    <Wrapper>
      <PaddedColumn>
        <RowBetween>
          <ArrowLeft style={{ cursor: 'pointer' }} onClick={onDismiss} />
          <Text fontWeight={500} fontSize={20}>
            Select
          </Text>
          <CloseIcon onClick={onDismiss} />
        </RowBetween>
      </PaddedColumn>
      <Separator />
      <PaddedColumn style={{ paddingBottom: 0 }}>
        <ToggleWrapper>
          <ToggleOption onClick={() => setShowLists(!showLists)} active={showLists}>
            DEPOSIT
          </ToggleOption>
          <ToggleOption onClick={() => setShowLists(!showLists)} active={!showLists}>
            WITHDRAW
          </ToggleOption>
        </ToggleWrapper>
      </PaddedColumn>
      <ManageTokens/>
    </Wrapper>
  )
}
