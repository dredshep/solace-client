/*************************************************************************************

    Table of Contents:

    import packages
    import managers
    import constants
    import components
    import hooks
    import utils

    UnderwritingPool
      hooks

  *************************************************************************************/

/* import packages */
import React from 'react'

/* import managers */
import { useWallet } from '../../../context/WalletManager'
import { useGeneral } from '../../../context/GeneralManager'

/* import constants */
import { BKPT_4, BKPT_6 } from '../../../constants'
import { FunctionName } from '../../../constants/enums'

/* import components */
import { Content, Flex } from '../../atoms/Layout'
import { Text } from '../../atoms/Typography'
import { Table, TableHead, TableRow, TableHeader, TableBody, TableData, TableDataGroup } from '../../atoms/Table'
import { Button, ButtonWrapper } from '../../atoms/Button'
import { Card } from '../../atoms/Card'

/* import hooks */
import { useCapitalPoolSize, useUserVaultDetails } from '../../../hooks/useVault'
import { useWindowDimensions } from '../../../hooks/useWindowDimensions'

/* import utils */
import { truncateValue } from '../../../utils/formatting'

interface UnderwritingPoolProps {
  openModal: (func: FunctionName, modalTitle: string, farmName: string) => void
}

export const UnderwritingPool: React.FC<UnderwritingPoolProps> = ({ openModal }) => {
  /*************************************************************************************

  hooks

  *************************************************************************************/

  const { haveErrors } = useGeneral()
  const { account } = useWallet()
  const { userVaultAssets, userVaultShare } = useUserVaultDetails()
  const capitalPoolSize = useCapitalPoolSize()
  const { width } = useWindowDimensions()

  return (
    <Content>
      <Text bold t1 mb={0} info>
        Underwriting Pool
      </Text>
      <Text t4 pt={10} pb={10}>
        This capital is utilized to back the risk of coverage policies and earns revenue from policy sales.
      </Text>
      {width > BKPT_6 ? (
        <Table isHighlight textAlignCenter>
          <TableHead>
            <TableRow>
              {account ? <TableHeader>My Assets</TableHeader> : null}
              <TableHeader>Total Assets</TableHeader>
              <TableHeader>ROI (1Y)</TableHeader>
              {account ? <TableHeader>My Vault Share</TableHeader> : null}
              <TableHeader></TableHeader>
              <TableHeader></TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow light>
              {account ? <TableData t3>{truncateValue(userVaultAssets, 2)}</TableData> : null}
              <TableData t3>{truncateValue(capitalPoolSize, 2)}</TableData>
              <TableData t3>N/A</TableData>
              {account ? <TableData t3>{`${truncateValue(userVaultShare, 2)}%`}</TableData> : null}
              <TableData t3></TableData>
              <TableData t3></TableData>
              {account ? (
                <TableData textAlignRight>
                  <TableDataGroup width={200} style={{ float: 'right' }}>
                    <Button
                      light
                      disabled={haveErrors}
                      onClick={() => openModal(FunctionName.WITHDRAW_ETH, 'Withdraw', 'uw')}
                    >
                      Withdraw
                    </Button>
                  </TableDataGroup>
                </TableData>
              ) : null}
            </TableRow>
          </TableBody>
        </Table>
      ) : (
        // tablet version
        <Card isHighlight>
          {account && (
            <Flex stretch between mb={24}>
              <Text light>My Assets:</Text>
              <Text light t2>
                {truncateValue(userVaultAssets, 2)}
              </Text>
            </Flex>
          )}
          <Flex stretch between mb={24}>
            <Text light>Total Assets:</Text>
            <Text light t2>
              {truncateValue(capitalPoolSize, 2)}
            </Text>
          </Flex>
          <Flex stretch between mb={24}>
            <Text light>ROI:</Text>
            <Text light t2>
              N/A
            </Text>
          </Flex>
          {account && (
            <Flex stretch between mb={24}>
              <Text light>My Vault Share:</Text>
              <Text light t2>{`${truncateValue(userVaultShare, 2)}%`}</Text>
            </Flex>
          )}
          {account && (
            <ButtonWrapper isColumn={width <= BKPT_4}>
              <Button
                widthP={100}
                disabled={haveErrors}
                onClick={() => openModal(FunctionName.WITHDRAW_ETH, 'Withdraw', 'uw')}
                light
              >
                Withdraw
              </Button>
            </ButtonWrapper>
          )}
        </Card>
      )}
    </Content>
  )
}
