import React from 'react'
import { Flex, ShadowDiv } from '../../../../components/atoms/Layout'
import { RaisedBox } from '../../../../components/atoms/Box'
import { Text } from '../../../../components/atoms/Typography'
import { Button } from '../../../../components/atoms/Button'
import styled, { css } from 'styled-components'
import { StakingVersion } from '../../../../constants/enums'
import { BKPT_5 } from '../../../../constants'
import { useWindowDimensions } from '../../../../hooks/useWindowDimensions'

/*
          style={{
            width: '378px',
            // py = 40px, px = 24px
            padding: '40px 24px',
          }} */
const StyledRaisedBox = styled(RaisedBox)<{
  theme: any
  width: number
  techyGradient?: boolean
}>`
  /* width: ${({ width }) => (BKPT_5 > width ? '%' : '378px')}; */
  ${({ width }) => {
    if (BKPT_5 < width) {
      return css`
        width: 378px;
      `
    } else {
      return css`
        width: 250px;
      `
    }
  }}
  /* margin auto if width under BKPT_5 */
  padding: 40px 24px;
  // techy-gradient
  ${({ techyGradient }) =>
    techyGradient &&
    css`
      background-image: linear-gradient(
        to bottom right,
        ${({ theme }) => theme.typography.techyGradientA},
        ${({ theme }) => theme.typography.techyGradientB}
      );
    `}
`

export default function DifferenceBoxes({
  setStakingVersion,
}: {
  setStakingVersion: (tab: StakingVersion) => void
}): JSX.Element {
  const { width } = useWindowDimensions()
  return (
    <Flex center gap={BKPT_5 > width ? 20 : 100} column={BKPT_5 > width}>
      <ShadowDiv>
        <StyledRaisedBox width={width}>
          <Flex center column gap={40}>
            <Text t1 extrabold>
              Staking V1
            </Text>
            <Flex column gap={20} center>
              <Text t2>Rewards distributed weekly</Text>
              <Text t2 lineThrough>
                Governance Rights
              </Text>
              <Text t2 lineThrough>
                Multipliers
              </Text>
            </Flex>
            <Button
              pl={23}
              pr={23}
              pt={10}
              pb={10}
              techygradient
              secondary
              noborder
              onClick={() => setStakingVersion(StakingVersion.v1)}
            >
              <Text bold light t4>
                Migrate to V2
              </Text>
            </Button>
          </Flex>
        </StyledRaisedBox>
      </ShadowDiv>
      <ShadowDiv>
        <StyledRaisedBox width={width} techyGradient>
          <Flex center column gap={40}>
            <Text t1 extrabold light>
              Staking V2
            </Text>
            {/* <Text t5s light textAlignCenter style={{ fontWeight: 400, margin: '10px 55px 0px 55px' }}>
              Users are in more control of their funds and returns. Users can utilize safes to take ad
            </Text> */}
            <Flex column gap={20} center>
              <Text t2 light textAlignCenter>
                Rewards Distributed Each Second
              </Text>
              <Text t2 light>
                Governance Rights
              </Text>
              <Text t2 light>
                Locking multipliers
              </Text>
            </Flex>
            <Button pl={23} pr={23} noborder secondary light onClick={() => setStakingVersion(StakingVersion.v2)}>
              <Text bold dark t4>
                Start Using V2
              </Text>
            </Button>
          </Flex>
        </StyledRaisedBox>
      </ShadowDiv>
    </Flex>
  )
}
