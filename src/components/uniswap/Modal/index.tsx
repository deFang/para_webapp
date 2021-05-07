import React from 'react'
import styled from 'styled-components'
import {animated, useSpring, useTransition} from 'react-spring'

import {DialogContent, DialogOverlay} from '@reach/dialog'
import {isMobile} from 'react-device-detect'
import '@reach/dialog/styles.css'
import {transparentize} from 'polished'
import {useGesture} from 'react-use-gesture'

const AnimatedDialogOverlay = animated(DialogOverlay)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const StyledDialogOverlay = styled(AnimatedDialogOverlay)`
  &[data-reach-dialog-overlay] {
    z-index: 2;
    background-color: transparent;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
  }

`

const AnimatedDialogContent = animated(DialogContent)
// destructure to not pass custom props to Dialog DOM element
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const StyledDialogContent = styled(({minHeight, maxHeight, singleCol, mobile, isOpen, ...rest}) => (
  <AnimatedDialogContent {...rest} />
)).attrs({
  'aria-label': 'dialog'
})`  
  overflow-y: ${({mobile}) => (mobile ? 'scroll' : 'hidden')};

  &[data-reach-dialog-content] {
    margin: 0 0 0 0;
    color: ${({theme}) => theme.color.white};
    background-color: ${({theme}) => theme.color.black};
    box-shadow: 0 4px 8px 0 ${({theme}) => transparentize(0.95, theme.shadow1)};
    padding: 0px;
    overflow-y: ${({mobile}) => (mobile ? 'scroll' : 'hidden')};
    overflow-x: hidden;

    align-self: ${({mobile}) => (mobile ? 'flex-end' : 'center')};

    min-height: ${({minHeight}) => `${minHeight}vh`};
    max-height: ${({maxHeight}) => `${maxHeight}vh`};

    
    max-width: ${({mobile, singleCol}) =>
      mobile || singleCol
        ? "600px"
        : "1200px"
    };
    min-width: ${({mobile, singleCol}) =>
      mobile || singleCol
        ? "400px"
        : "800px"
    };
    
    display: flex;
    border: 0px;
    border-radius: 20px;
  }
`

interface ModalProps {
  isOpen: boolean
  onDismiss: () => void
  minHeight?: number | false
  maxHeight?: number
  singleCol?: boolean
  initialFocusRef?: React.RefObject<any>
  children?: React.ReactNode
}

export default function Modal({
                                isOpen,
                                onDismiss,
                                minHeight = 50,
                                maxHeight = 80,
                                singleCol = false,
                                initialFocusRef,
                                children
                              }: ModalProps) {
  const fadeTransition = useTransition(isOpen, null, {
    config: {duration: 200},
    from: {opacity: 0},
    enter: {opacity: 1},
    leave: {opacity: 0}
  })

  const [{y}, set] = useSpring(() => ({y: 0, config: {mass: 1, tension: 210, friction: 20}}))
  const bind = useGesture({
    onDrag: state => {
      set({
        y: state.down ? state.movement[1] : 0
      })
      if (state.movement[1] > 300 || (state.velocity > 3 && state.direction[1] > 0)) {
        onDismiss()
      }
    }
  })
  console.log('maxHeight', maxHeight, 'minHeight', minHeight)
  console.log("isMobile", isMobile)

  return (
    <>
      {fadeTransition.map(
        ({item, key, props}) =>
          item && (
            <StyledDialogOverlay
              key={key}
              style={props}
              onDismiss={onDismiss}
              initialFocusRef={initialFocusRef}
              unstable_lockFocusAcrossFrames={false}
            >
              <StyledDialogContent
                {...(isMobile
                  ? {
                    ...bind(),
                    style: {transform: y.interpolate(y => `translateY(${0}px)`)}
                  }
                  : {})}
                aria-label="dialog content"
                minHeight={minHeight}
                maxHeight={maxHeight}
                singleCol={singleCol}
                mobile={isMobile}
              >
                {/* prevents the automatic focusing of inputs on mobile by the reach dialog */}
                {!initialFocusRef && isMobile ? <div tabIndex={1}/> : null}
                {children}
              </StyledDialogContent>
            </StyledDialogOverlay>
          )
      )}
    </>
  )
}
