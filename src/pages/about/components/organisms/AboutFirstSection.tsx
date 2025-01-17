import React, { RefObject, useEffect, useMemo } from 'react'
import { Flex } from '../../../../components/atoms/Layout'
import { Text } from '../../../../components/atoms/Typography'
import { useWindowDimensions } from '../../../../hooks/useWindowDimensions'
import { Button } from '../../../../components/atoms/Button'
import { StyledNavLink } from '../../../../components/atoms/Link'
import whiteLogo from '../../../../resources/svg/solace-logo-white.svg'
import grantsFrom from '../../../../resources/svg/grants/grants-from.svg'

// export const AboutFirstSection = <AboutFirstSectionFunction />

export function AboutFirstSection({
  sectionRef: ref,
  getScrollerForThisRef,
  isVisible,
}: {
  sectionRef?: React.Ref<HTMLDivElement>
  getScrollerForThisRef?: (ref: ((instance: HTMLDivElement | null) => void) | RefObject<HTMLDivElement>) => () => void
  isVisible?: boolean
}): JSX.Element {
  const { isMobile } = useWindowDimensions()
  const scroller = useMemo(
    () => (ref && getScrollerForThisRef ? getScrollerForThisRef(ref) : () => console.log('no ref')),
    [ref, getScrollerForThisRef]
  )
  useEffect(() => {
    if (isVisible) {
      scroller()
    }
  }, [isVisible, scroller, ref])

  return (
    <Flex
      col
      px={isMobile ? 47 : undefined}
      itemsCenter
      justifyCenter={!isMobile}
      mt={isMobile ? 100 : undefined}
      ref={ref}
    >
      <Flex col w={isMobile ? undefined : 507} itemsCenter={isMobile}>
        {/* LOGO */}
        <img
          src={whiteLogo}
          style={{
            width: isMobile ? '232px' : '507px',
            // padding left if mobile is 40px
            paddingLeft: isMobile ? '25px' : undefined,
          }}
        />
        {/* TEXT */}
        <Flex col pr={isMobile ? undefined : 50} mt={isMobile ? 30 : 40}>
          <Text
            // t2s
            light
            regular
            textAlignCenter={isMobile}
            style={{
              fontSize: !isMobile ? '20px' : '16px',
              lineHeight: '1.6',
              fontWeight: 400,
              // padding: !isMobile ? '0px' : '46px',
            }}
            pl={isMobile ? undefined : 46}
            pr={isMobile ? undefined : 46}
          >
            Insurance protocol built to secure DeFi&apos;s future by solving complexity of risk management with
            user-friendly, intelligent and transparent tools.
          </Text>
        </Flex>
        {/* BUTTONS */}
        <Flex col={isMobile} gap={24} mt={62} px={isMobile ? 39 : undefined}>
          <StyledNavLink to="/cover">
            <Button secondary light width={200} style={{ padding: '15px 50px', borderRadius: '55px' }}>
              <Text warmgradient>Buy Cover</Text>
            </Button>
            {/* <Button secondary light width={200} style={{ padding: '15px 50px', borderRadius: '55px' }}>
              <Text techygradient>Buy Solace Token</Text>
            </Button> */}
          </StyledNavLink>
          <StyledNavLink to="/bond">
            <Button light width={200} style={{ padding: '15px 50px', borderRadius: '55px' }}>
              <Text nowrap style={{ color: 'inherit' }}>
                Underwrite Risk
              </Text>
            </Button>
          </StyledNavLink>
        </Flex>
        {!isMobile && isVisible ? (
          <Flex
            justifyCenter
            style={{
              width: '100%',
              position: 'absolute',
              bottom: '40px',
              right: '40px',
            }}
          >
            <img src={grantsFrom} />
          </Flex>
        ) : (
          <Flex mt={90}>
            <img src={grantsFrom} />
          </Flex>
        )}
      </Flex>
    </Flex>
  )
}
