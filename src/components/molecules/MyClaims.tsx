/*************************************************************************************

    Table of Contents:

    import react
    import packages
    import managers
    import components
    import constants
    import hooks
    import utils

    MyClaims function
      custom hooks
      contract functions
      Render

  *************************************************************************************/

/* import react */
import React, { Fragment, useState } from 'react'

/* import packages */
import { formatUnits } from '@ethersproject/units'
import { BigNumber } from 'ethers'

/* import managers */
import { useWallet } from '../../context/WalletManager'
import { useCachedData } from '../../context/CachedDataManager'
import { useToasts } from '../../context/NotificationsManager'
import { useContracts } from '../../context/ContractsManager'
import { useNetwork } from '../../context/NetworkManager'
import { useGeneral } from '../../context/GeneralProvider'

/* import components */
import { CardContainer, Card } from '../atoms/Card'
import { Box, BoxItem, BoxItemTitle } from '../atoms/Box'
import { Button, ButtonWrapper } from '../atoms/Button'
import { Heading1, Text } from '../atoms/Typography'
import { Content } from '../atoms/Layout'
import { StyledArrowDropDownCircle } from '../../components/atoms/Icon'
import { Accordion } from '../atoms/Accordion/Accordion'

/* import constants */
import { FunctionName, TransactionCondition, Unit } from '../../constants/enums'
import { GAS_LIMIT, MAX_MOBILE_SCREEN_WIDTH } from '../../constants'
import { ClaimDetails } from '../../constants/types'

/* import hooks */
import { useGetClaimsDetails } from '../../hooks/useClaimsEscrow'
import { useWindowDimensions } from '../../hooks/useWindowDimensions'
import { useGasConfig } from '../../hooks/useFetchGasPrice'

/* import utils */
import { truncateBalance } from '../../utils/formatting'
import { timeToDate } from '../../utils/time'

export const MyClaims: React.FC = () => {
  /*************************************************************************************

    custom hooks

  *************************************************************************************/
  const { errors } = useGeneral()
  const { claimsEscrow } = useContracts()
  const { account } = useWallet()
  const { activeNetwork, currencyDecimals } = useNetwork()
  const { addLocalTransactions, reload, gasPrices } = useCachedData()
  const { makeTxToast } = useToasts()
  const claimsDetails = useGetClaimsDetails(account)
  const { gasConfig } = useGasConfig(gasPrices.selected?.value)
  const [openClaims, setOpenClaims] = useState<boolean>(true)
  const { width } = useWindowDimensions()

  /*************************************************************************************

    contract functions

  *************************************************************************************/

  const withdrawPayout = async (_claimId: string) => {
    if (!claimsEscrow || !_claimId) return
    const txType = FunctionName.WITHDRAW_CLAIMS_PAYOUT
    try {
      const tx = await claimsEscrow.withdrawClaimsPayout(_claimId, {
        ...gasConfig,
        gasLimit: GAS_LIMIT,
      })
      const txHash = tx.hash
      const localTx = {
        hash: txHash,
        type: txType,
        value: String(_claimId),
        status: TransactionCondition.PENDING,
        unit: Unit.ID,
      }
      addLocalTransactions(localTx)
      reload()
      makeTxToast(txType, TransactionCondition.PENDING, txHash)
      await tx.wait().then((receipt: any) => {
        const status = receipt.status ? TransactionCondition.SUCCESS : TransactionCondition.FAILURE
        makeTxToast(txType, status, txHash)
        reload()
      })
    } catch (err) {
      makeTxToast(txType, TransactionCondition.CANCELLED)
      reload()
    }
  }

  /*************************************************************************************

    Render

  *************************************************************************************/

  return (
    <Fragment>
      {claimsDetails.length > 0 && (
        <Content>
          <Heading1>
            Your Claims
            <Button style={{ float: 'right' }} onClick={() => setOpenClaims(!openClaims)}>
              <StyledArrowDropDownCircle
                style={{ transform: openClaims ? 'rotate(180deg)' : 'rotate(0deg)' }}
                size={30}
              />
              {openClaims ? 'Hide Claims' : 'Show Claims'}
            </Button>
          </Heading1>
          <Accordion isOpen={openClaims}>
            <CardContainer cardsPerRow={2}>
              {claimsDetails.map((claim: ClaimDetails) => {
                return (
                  <Card key={claim.id}>
                    <Box pt={20} pb={20} glow={claim.canWithdraw} green={claim.canWithdraw}>
                      <BoxItem>
                        <BoxItemTitle t4>ID</BoxItemTitle>
                        <Text h4 high_em>
                          {claim.id}
                        </Text>
                      </BoxItem>
                      <BoxItem>
                        <BoxItemTitle t4>Amount</BoxItemTitle>
                        <Text h4 high_em>
                          {BigNumber.from(formatUnits(claim.amount, currencyDecimals)).gte('1')
                            ? truncateBalance(
                                formatUnits(claim.amount, currencyDecimals),
                                width > MAX_MOBILE_SCREEN_WIDTH ? currencyDecimals : 2
                              )
                            : truncateBalance(
                                formatUnits(claim.amount, currencyDecimals),
                                width > MAX_MOBILE_SCREEN_WIDTH ? currencyDecimals : 6
                              )}{' '}
                          {activeNetwork.nativeCurrency.symbol}
                        </Text>
                      </BoxItem>
                      <BoxItem>
                        <BoxItemTitle t4>Payout Status</BoxItemTitle>
                        <Text h4 high_em>
                          {claim.canWithdraw
                            ? 'Available'
                            : `${claim.cooldown == '0' ? '-' : timeToDate(parseInt(claim.cooldown) * 1000)} left`}
                        </Text>
                      </BoxItem>
                    </Box>
                    <ButtonWrapper mb={0} mt={20}>
                      <Button
                        widthP={100}
                        onClick={() => withdrawPayout(claim.id)}
                        disabled={!claim.canWithdraw || errors.length > 0}
                      >
                        Withdraw Payout
                      </Button>
                    </ButtonWrapper>
                  </Card>
                )
              })}
            </CardContainer>
          </Accordion>
        </Content>
      )}
    </Fragment>
  )
}
