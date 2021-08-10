/*************************************************************************************

    Table of Contents:

    import react
    import components

    ConfirmStep function
      Render

  *************************************************************************************/

/* import react */
import React from 'react'

/* import components */
import { StyledNavLink } from '../../components/atoms/Link'
import { Button } from '../../components/atoms/Button'
import { TableDataGroup } from '../../components/atoms/Table'
import { Heading1, Heading2 } from '../../components/atoms/Typography'
import { HeroContainer } from '../../components/atoms/Layout'
import { formProps } from './MultiStepForm'

export const ConfirmStep: React.FC<formProps> = ({ navigation }) => {
  /*************************************************************************************

  Render

  *************************************************************************************/

  return (
    <HeroContainer>
      <Heading1 textAlignCenter>Transaction Submitted!</Heading1>
      <Heading1 textAlignCenter>Your Solace coverage is on the way!</Heading1>
      <Heading2 textAlignCenter>You can manage your policies on the dashboard or start a new one.</Heading2>
      <div style={{ marginTop: '24px' }}>
        <TableDataGroup>
          <StyledNavLink to="/">
            <Button secondary>Go to Dashboard</Button>
          </StyledNavLink>
          <Button secondary onClick={() => navigation.go(0)}>
            Start New Quote
          </Button>
        </TableDataGroup>
      </div>
    </HeroContainer>
  )
}
