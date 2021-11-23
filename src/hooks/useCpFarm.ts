import { BigNumber } from 'ethers'
import { useContracts } from '../context/ContractsManager'
import { FunctionName, TransactionCondition } from '../constants/enums'
import { GasConfiguration, LocalTx, TxResult } from '../constants/types'
import { FunctionGasLimits } from '../constants/mappings'

export const useCpFarm = () => {
  const { cpFarm } = useContracts()

  const depositEth = async (parsedAmount: BigNumber, txVal: string, gasConfig: GasConfiguration): Promise<TxResult> => {
    if (!cpFarm) return { tx: null, localTx: null }
    const tx = await cpFarm.depositEth({
      value: parsedAmount,
      ...gasConfig,
      gasLimit: FunctionGasLimits['cpFarm.depositEth'],
    })
    const localTx: LocalTx = {
      hash: tx.hash,
      type: FunctionName.DEPOSIT_ETH,
      value: txVal,
      status: TransactionCondition.PENDING,
    }
    return { tx, localTx }
  }

  const depositCp = async (parsedAmount: BigNumber, txVal: string, gasConfig: GasConfiguration): Promise<TxResult> => {
    if (!cpFarm) return { tx: null, localTx: null }
    const tx = await cpFarm.depositCp(parsedAmount, {
      ...gasConfig,
      gasLimit: FunctionGasLimits['cpFarm.depositCp'],
    })
    const localTx: LocalTx = {
      hash: tx.hash,
      type: FunctionName.DEPOSIT_CP,
      value: txVal,
      status: TransactionCondition.PENDING,
    }
    return { tx, localTx }
  }

  const withdrawCp = async (parsedAmount: BigNumber, txVal: string, gasConfig: GasConfiguration): Promise<TxResult> => {
    if (!cpFarm) return { tx: null, localTx: null }
    const tx = await cpFarm.withdrawCp(parsedAmount, {
      ...gasConfig,
      gasLimit: FunctionGasLimits['cpFarm.withdrawCp'],
    })
    const localTx: LocalTx = {
      hash: tx.hash,
      type: FunctionName.WITHDRAW_CP,
      value: txVal,
      status: TransactionCondition.PENDING,
    }
    return { tx, localTx }
  }

  return { depositEth, depositCp, withdrawCp }
}
