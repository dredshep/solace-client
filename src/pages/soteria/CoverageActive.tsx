import React from 'react'
import { Flex } from '../../components/atoms/Layout'
import { Button } from '../../components/atoms/Button'
import { useFunctions } from '../../hooks/useSolaceCoverProduct'
import { useWallet } from '../../context/WalletManager'
import { useTransactionExecution } from '../../hooks/useInputAmount'
import { FunctionName } from '../../constants/enums'
import { Text } from '../../components/atoms/Typography'
import { Card } from '.'

export function CoverageActive({ policyStatus }: { policyStatus: boolean }) {
  const { deactivatePolicy } = useFunctions()
  const { account } = useWallet()
  const { handleToast, handleContractCallError } = useTransactionExecution()

  const callDeactivatePolicy = async () => {
    if (!account) return
    await deactivatePolicy()
      .then((res) => handleToast(res.tx, res.localTx))
      .catch((err) => handleContractCallError('callDeactivatePolicy', err, FunctionName.SOTERIA_DEACTIVATE))
  }

  return (
    <Card>
      <Flex between itemsCenter>
        <Flex col gap={6}>
          <Flex stretch gap={7}>
            <Text t2s bold>
              Coverage
            </Text>
            <Text t2s bold success={policyStatus} warning={!policyStatus}>
              {policyStatus ? 'Active' : 'Inactive'}
            </Text>
          </Flex>
        </Flex>
        <Flex between itemsCenter>
          {policyStatus && (
            <Button onClick={callDeactivatePolicy} error>
              Deactivate
            </Button>
          )}
        </Flex>
      </Flex>
    </Card>
  )
}
