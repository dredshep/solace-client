import { ethers, EventFilter, Signer, BigNumber, BigNumberish, PopulatedTransaction } from 'ethers'
import { Contract, ContractTransaction, CallOverrides } from '@ethersproject/contracts'
import { BytesLike } from '@ethersproject/bytes'
import { Listener, Provider } from '@ethersproject/providers'
import { FunctionFragment, EventFragment, Result } from '@ethersproject/abi'

interface AaveProtocolDataProviderInterface extends ethers.utils.Interface {
  functions: {
    'ADDRESSES_PROVIDER()': FunctionFragment
    'getAllATokens()': FunctionFragment
    'getAllReservesTokens()': FunctionFragment
    'getReserveConfigurationData(address)': FunctionFragment
    'getReserveData(address)': FunctionFragment
    'getReserveTokensAddresses(address)': FunctionFragment
    'getUserReserveData(address,address)': FunctionFragment
  }

  encodeFunctionData(functionFragment: 'ADDRESSES_PROVIDER', values?: undefined): string
  encodeFunctionData(functionFragment: 'getAllATokens', values?: undefined): string
  encodeFunctionData(functionFragment: 'getAllReservesTokens', values?: undefined): string
  encodeFunctionData(functionFragment: 'getReserveConfigurationData', values: [string]): string
  encodeFunctionData(functionFragment: 'getReserveData', values: [string]): string
  encodeFunctionData(functionFragment: 'getReserveTokensAddresses', values: [string]): string
  encodeFunctionData(functionFragment: 'getUserReserveData', values: [string, string]): string

  decodeFunctionResult(functionFragment: 'ADDRESSES_PROVIDER', data: BytesLike): Result
  decodeFunctionResult(functionFragment: 'getAllATokens', data: BytesLike): Result
  decodeFunctionResult(functionFragment: 'getAllReservesTokens', data: BytesLike): Result
  decodeFunctionResult(functionFragment: 'getReserveConfigurationData', data: BytesLike): Result
  decodeFunctionResult(functionFragment: 'getReserveData', data: BytesLike): Result
  decodeFunctionResult(functionFragment: 'getReserveTokensAddresses', data: BytesLike): Result
  decodeFunctionResult(functionFragment: 'getUserReserveData', data: BytesLike): Result

  events: {}
}

export class AaveProtocolDataProvider extends Contract {
  connect(signerOrProvider: Signer | Provider | string): this
  attach(addressOrName: string): this
  deployed(): Promise<this>

  on(event: EventFilter | string, listener: Listener): this
  once(event: EventFilter | string, listener: Listener): this
  addListener(eventName: EventFilter | string, listener: Listener): this
  removeAllListeners(eventName: EventFilter | string): this
  removeListener(eventName: any, listener: Listener): this

  interface: AaveProtocolDataProviderInterface

  functions: {
    ADDRESSES_PROVIDER(
      overrides?: CallOverrides
    ): Promise<{
      0: string
    }>

    'ADDRESSES_PROVIDER()'(
      overrides?: CallOverrides
    ): Promise<{
      0: string
    }>

    getAllATokens(
      overrides?: CallOverrides
    ): Promise<{
      0: { symbol: string; tokenAddress: string; 0: string; 1: string }[]
    }>

    'getAllATokens()'(
      overrides?: CallOverrides
    ): Promise<{
      0: { symbol: string; tokenAddress: string; 0: string; 1: string }[]
    }>

    getAllReservesTokens(
      overrides?: CallOverrides
    ): Promise<{
      0: { symbol: string; tokenAddress: string; 0: string; 1: string }[]
    }>

    'getAllReservesTokens()'(
      overrides?: CallOverrides
    ): Promise<{
      0: { symbol: string; tokenAddress: string; 0: string; 1: string }[]
    }>

    getReserveConfigurationData(
      asset: string,
      overrides?: CallOverrides
    ): Promise<{
      decimals: BigNumber
      ltv: BigNumber
      liquidationThreshold: BigNumber
      liquidationBonus: BigNumber
      reserveFactor: BigNumber
      usageAsCollateralEnabled: boolean
      borrowingEnabled: boolean
      stableBorrowRateEnabled: boolean
      isActive: boolean
      isFrozen: boolean
      0: BigNumber
      1: BigNumber
      2: BigNumber
      3: BigNumber
      4: BigNumber
      5: boolean
      6: boolean
      7: boolean
      8: boolean
      9: boolean
    }>

    'getReserveConfigurationData(address)'(
      asset: string,
      overrides?: CallOverrides
    ): Promise<{
      decimals: BigNumber
      ltv: BigNumber
      liquidationThreshold: BigNumber
      liquidationBonus: BigNumber
      reserveFactor: BigNumber
      usageAsCollateralEnabled: boolean
      borrowingEnabled: boolean
      stableBorrowRateEnabled: boolean
      isActive: boolean
      isFrozen: boolean
      0: BigNumber
      1: BigNumber
      2: BigNumber
      3: BigNumber
      4: BigNumber
      5: boolean
      6: boolean
      7: boolean
      8: boolean
      9: boolean
    }>

    getReserveData(
      asset: string,
      overrides?: CallOverrides
    ): Promise<{
      availableLiquidity: BigNumber
      totalStableDebt: BigNumber
      totalVariableDebt: BigNumber
      liquidityRate: BigNumber
      variableBorrowRate: BigNumber
      stableBorrowRate: BigNumber
      averageStableBorrowRate: BigNumber
      liquidityIndex: BigNumber
      variableBorrowIndex: BigNumber
      lastUpdateTimestamp: number
      0: BigNumber
      1: BigNumber
      2: BigNumber
      3: BigNumber
      4: BigNumber
      5: BigNumber
      6: BigNumber
      7: BigNumber
      8: BigNumber
      9: number
    }>

    'getReserveData(address)'(
      asset: string,
      overrides?: CallOverrides
    ): Promise<{
      availableLiquidity: BigNumber
      totalStableDebt: BigNumber
      totalVariableDebt: BigNumber
      liquidityRate: BigNumber
      variableBorrowRate: BigNumber
      stableBorrowRate: BigNumber
      averageStableBorrowRate: BigNumber
      liquidityIndex: BigNumber
      variableBorrowIndex: BigNumber
      lastUpdateTimestamp: number
      0: BigNumber
      1: BigNumber
      2: BigNumber
      3: BigNumber
      4: BigNumber
      5: BigNumber
      6: BigNumber
      7: BigNumber
      8: BigNumber
      9: number
    }>

    getReserveTokensAddresses(
      asset: string,
      overrides?: CallOverrides
    ): Promise<{
      aTokenAddress: string
      stableDebtTokenAddress: string
      variableDebtTokenAddress: string
      0: string
      1: string
      2: string
    }>

    'getReserveTokensAddresses(address)'(
      asset: string,
      overrides?: CallOverrides
    ): Promise<{
      aTokenAddress: string
      stableDebtTokenAddress: string
      variableDebtTokenAddress: string
      0: string
      1: string
      2: string
    }>

    getUserReserveData(
      asset: string,
      user: string,
      overrides?: CallOverrides
    ): Promise<{
      currentATokenBalance: BigNumber
      currentStableDebt: BigNumber
      currentVariableDebt: BigNumber
      principalStableDebt: BigNumber
      scaledVariableDebt: BigNumber
      stableBorrowRate: BigNumber
      liquidityRate: BigNumber
      stableRateLastUpdated: number
      usageAsCollateralEnabled: boolean
      0: BigNumber
      1: BigNumber
      2: BigNumber
      3: BigNumber
      4: BigNumber
      5: BigNumber
      6: BigNumber
      7: number
      8: boolean
    }>

    'getUserReserveData(address,address)'(
      asset: string,
      user: string,
      overrides?: CallOverrides
    ): Promise<{
      currentATokenBalance: BigNumber
      currentStableDebt: BigNumber
      currentVariableDebt: BigNumber
      principalStableDebt: BigNumber
      scaledVariableDebt: BigNumber
      stableBorrowRate: BigNumber
      liquidityRate: BigNumber
      stableRateLastUpdated: number
      usageAsCollateralEnabled: boolean
      0: BigNumber
      1: BigNumber
      2: BigNumber
      3: BigNumber
      4: BigNumber
      5: BigNumber
      6: BigNumber
      7: number
      8: boolean
    }>
  }

  ADDRESSES_PROVIDER(overrides?: CallOverrides): Promise<string>

  'ADDRESSES_PROVIDER()'(overrides?: CallOverrides): Promise<string>

  getAllATokens(overrides?: CallOverrides): Promise<{ symbol: string; tokenAddress: string; 0: string; 1: string }[]>

  'getAllATokens()'(
    overrides?: CallOverrides
  ): Promise<{ symbol: string; tokenAddress: string; 0: string; 1: string }[]>

  getAllReservesTokens(
    overrides?: CallOverrides
  ): Promise<{ symbol: string; tokenAddress: string; 0: string; 1: string }[]>

  'getAllReservesTokens()'(
    overrides?: CallOverrides
  ): Promise<{ symbol: string; tokenAddress: string; 0: string; 1: string }[]>

  getReserveConfigurationData(
    asset: string,
    overrides?: CallOverrides
  ): Promise<{
    decimals: BigNumber
    ltv: BigNumber
    liquidationThreshold: BigNumber
    liquidationBonus: BigNumber
    reserveFactor: BigNumber
    usageAsCollateralEnabled: boolean
    borrowingEnabled: boolean
    stableBorrowRateEnabled: boolean
    isActive: boolean
    isFrozen: boolean
    0: BigNumber
    1: BigNumber
    2: BigNumber
    3: BigNumber
    4: BigNumber
    5: boolean
    6: boolean
    7: boolean
    8: boolean
    9: boolean
  }>

  'getReserveConfigurationData(address)'(
    asset: string,
    overrides?: CallOverrides
  ): Promise<{
    decimals: BigNumber
    ltv: BigNumber
    liquidationThreshold: BigNumber
    liquidationBonus: BigNumber
    reserveFactor: BigNumber
    usageAsCollateralEnabled: boolean
    borrowingEnabled: boolean
    stableBorrowRateEnabled: boolean
    isActive: boolean
    isFrozen: boolean
    0: BigNumber
    1: BigNumber
    2: BigNumber
    3: BigNumber
    4: BigNumber
    5: boolean
    6: boolean
    7: boolean
    8: boolean
    9: boolean
  }>

  getReserveData(
    asset: string,
    overrides?: CallOverrides
  ): Promise<{
    availableLiquidity: BigNumber
    totalStableDebt: BigNumber
    totalVariableDebt: BigNumber
    liquidityRate: BigNumber
    variableBorrowRate: BigNumber
    stableBorrowRate: BigNumber
    averageStableBorrowRate: BigNumber
    liquidityIndex: BigNumber
    variableBorrowIndex: BigNumber
    lastUpdateTimestamp: number
    0: BigNumber
    1: BigNumber
    2: BigNumber
    3: BigNumber
    4: BigNumber
    5: BigNumber
    6: BigNumber
    7: BigNumber
    8: BigNumber
    9: number
  }>

  'getReserveData(address)'(
    asset: string,
    overrides?: CallOverrides
  ): Promise<{
    availableLiquidity: BigNumber
    totalStableDebt: BigNumber
    totalVariableDebt: BigNumber
    liquidityRate: BigNumber
    variableBorrowRate: BigNumber
    stableBorrowRate: BigNumber
    averageStableBorrowRate: BigNumber
    liquidityIndex: BigNumber
    variableBorrowIndex: BigNumber
    lastUpdateTimestamp: number
    0: BigNumber
    1: BigNumber
    2: BigNumber
    3: BigNumber
    4: BigNumber
    5: BigNumber
    6: BigNumber
    7: BigNumber
    8: BigNumber
    9: number
  }>

  getReserveTokensAddresses(
    asset: string,
    overrides?: CallOverrides
  ): Promise<{
    aTokenAddress: string
    stableDebtTokenAddress: string
    variableDebtTokenAddress: string
    0: string
    1: string
    2: string
  }>

  'getReserveTokensAddresses(address)'(
    asset: string,
    overrides?: CallOverrides
  ): Promise<{
    aTokenAddress: string
    stableDebtTokenAddress: string
    variableDebtTokenAddress: string
    0: string
    1: string
    2: string
  }>

  getUserReserveData(
    asset: string,
    user: string,
    overrides?: CallOverrides
  ): Promise<{
    currentATokenBalance: BigNumber
    currentStableDebt: BigNumber
    currentVariableDebt: BigNumber
    principalStableDebt: BigNumber
    scaledVariableDebt: BigNumber
    stableBorrowRate: BigNumber
    liquidityRate: BigNumber
    stableRateLastUpdated: number
    usageAsCollateralEnabled: boolean
    0: BigNumber
    1: BigNumber
    2: BigNumber
    3: BigNumber
    4: BigNumber
    5: BigNumber
    6: BigNumber
    7: number
    8: boolean
  }>

  'getUserReserveData(address,address)'(
    asset: string,
    user: string,
    overrides?: CallOverrides
  ): Promise<{
    currentATokenBalance: BigNumber
    currentStableDebt: BigNumber
    currentVariableDebt: BigNumber
    principalStableDebt: BigNumber
    scaledVariableDebt: BigNumber
    stableBorrowRate: BigNumber
    liquidityRate: BigNumber
    stableRateLastUpdated: number
    usageAsCollateralEnabled: boolean
    0: BigNumber
    1: BigNumber
    2: BigNumber
    3: BigNumber
    4: BigNumber
    5: BigNumber
    6: BigNumber
    7: number
    8: boolean
  }>

  callStatic: {
    ADDRESSES_PROVIDER(overrides?: CallOverrides): Promise<string>

    'ADDRESSES_PROVIDER()'(overrides?: CallOverrides): Promise<string>

    getAllATokens(overrides?: CallOverrides): Promise<{ symbol: string; tokenAddress: string; 0: string; 1: string }[]>

    'getAllATokens()'(
      overrides?: CallOverrides
    ): Promise<{ symbol: string; tokenAddress: string; 0: string; 1: string }[]>

    getAllReservesTokens(
      overrides?: CallOverrides
    ): Promise<{ symbol: string; tokenAddress: string; 0: string; 1: string }[]>

    'getAllReservesTokens()'(
      overrides?: CallOverrides
    ): Promise<{ symbol: string; tokenAddress: string; 0: string; 1: string }[]>

    getReserveConfigurationData(
      asset: string,
      overrides?: CallOverrides
    ): Promise<{
      decimals: BigNumber
      ltv: BigNumber
      liquidationThreshold: BigNumber
      liquidationBonus: BigNumber
      reserveFactor: BigNumber
      usageAsCollateralEnabled: boolean
      borrowingEnabled: boolean
      stableBorrowRateEnabled: boolean
      isActive: boolean
      isFrozen: boolean
      0: BigNumber
      1: BigNumber
      2: BigNumber
      3: BigNumber
      4: BigNumber
      5: boolean
      6: boolean
      7: boolean
      8: boolean
      9: boolean
    }>

    'getReserveConfigurationData(address)'(
      asset: string,
      overrides?: CallOverrides
    ): Promise<{
      decimals: BigNumber
      ltv: BigNumber
      liquidationThreshold: BigNumber
      liquidationBonus: BigNumber
      reserveFactor: BigNumber
      usageAsCollateralEnabled: boolean
      borrowingEnabled: boolean
      stableBorrowRateEnabled: boolean
      isActive: boolean
      isFrozen: boolean
      0: BigNumber
      1: BigNumber
      2: BigNumber
      3: BigNumber
      4: BigNumber
      5: boolean
      6: boolean
      7: boolean
      8: boolean
      9: boolean
    }>

    getReserveData(
      asset: string,
      overrides?: CallOverrides
    ): Promise<{
      availableLiquidity: BigNumber
      totalStableDebt: BigNumber
      totalVariableDebt: BigNumber
      liquidityRate: BigNumber
      variableBorrowRate: BigNumber
      stableBorrowRate: BigNumber
      averageStableBorrowRate: BigNumber
      liquidityIndex: BigNumber
      variableBorrowIndex: BigNumber
      lastUpdateTimestamp: number
      0: BigNumber
      1: BigNumber
      2: BigNumber
      3: BigNumber
      4: BigNumber
      5: BigNumber
      6: BigNumber
      7: BigNumber
      8: BigNumber
      9: number
    }>

    'getReserveData(address)'(
      asset: string,
      overrides?: CallOverrides
    ): Promise<{
      availableLiquidity: BigNumber
      totalStableDebt: BigNumber
      totalVariableDebt: BigNumber
      liquidityRate: BigNumber
      variableBorrowRate: BigNumber
      stableBorrowRate: BigNumber
      averageStableBorrowRate: BigNumber
      liquidityIndex: BigNumber
      variableBorrowIndex: BigNumber
      lastUpdateTimestamp: number
      0: BigNumber
      1: BigNumber
      2: BigNumber
      3: BigNumber
      4: BigNumber
      5: BigNumber
      6: BigNumber
      7: BigNumber
      8: BigNumber
      9: number
    }>

    getReserveTokensAddresses(
      asset: string,
      overrides?: CallOverrides
    ): Promise<{
      aTokenAddress: string
      stableDebtTokenAddress: string
      variableDebtTokenAddress: string
      0: string
      1: string
      2: string
    }>

    'getReserveTokensAddresses(address)'(
      asset: string,
      overrides?: CallOverrides
    ): Promise<{
      aTokenAddress: string
      stableDebtTokenAddress: string
      variableDebtTokenAddress: string
      0: string
      1: string
      2: string
    }>

    getUserReserveData(
      asset: string,
      user: string,
      overrides?: CallOverrides
    ): Promise<{
      currentATokenBalance: BigNumber
      currentStableDebt: BigNumber
      currentVariableDebt: BigNumber
      principalStableDebt: BigNumber
      scaledVariableDebt: BigNumber
      stableBorrowRate: BigNumber
      liquidityRate: BigNumber
      stableRateLastUpdated: number
      usageAsCollateralEnabled: boolean
      0: BigNumber
      1: BigNumber
      2: BigNumber
      3: BigNumber
      4: BigNumber
      5: BigNumber
      6: BigNumber
      7: number
      8: boolean
    }>

    'getUserReserveData(address,address)'(
      asset: string,
      user: string,
      overrides?: CallOverrides
    ): Promise<{
      currentATokenBalance: BigNumber
      currentStableDebt: BigNumber
      currentVariableDebt: BigNumber
      principalStableDebt: BigNumber
      scaledVariableDebt: BigNumber
      stableBorrowRate: BigNumber
      liquidityRate: BigNumber
      stableRateLastUpdated: number
      usageAsCollateralEnabled: boolean
      0: BigNumber
      1: BigNumber
      2: BigNumber
      3: BigNumber
      4: BigNumber
      5: BigNumber
      6: BigNumber
      7: number
      8: boolean
    }>
  }

  filters: {}

  estimateGas: {
    ADDRESSES_PROVIDER(overrides?: CallOverrides): Promise<BigNumber>

    'ADDRESSES_PROVIDER()'(overrides?: CallOverrides): Promise<BigNumber>

    getAllATokens(overrides?: CallOverrides): Promise<BigNumber>

    'getAllATokens()'(overrides?: CallOverrides): Promise<BigNumber>

    getAllReservesTokens(overrides?: CallOverrides): Promise<BigNumber>

    'getAllReservesTokens()'(overrides?: CallOverrides): Promise<BigNumber>

    getReserveConfigurationData(asset: string, overrides?: CallOverrides): Promise<BigNumber>

    'getReserveConfigurationData(address)'(asset: string, overrides?: CallOverrides): Promise<BigNumber>

    getReserveData(asset: string, overrides?: CallOverrides): Promise<BigNumber>

    'getReserveData(address)'(asset: string, overrides?: CallOverrides): Promise<BigNumber>

    getReserveTokensAddresses(asset: string, overrides?: CallOverrides): Promise<BigNumber>

    'getReserveTokensAddresses(address)'(asset: string, overrides?: CallOverrides): Promise<BigNumber>

    getUserReserveData(asset: string, user: string, overrides?: CallOverrides): Promise<BigNumber>

    'getUserReserveData(address,address)'(asset: string, user: string, overrides?: CallOverrides): Promise<BigNumber>
  }

  populateTransaction: {
    ADDRESSES_PROVIDER(overrides?: CallOverrides): Promise<PopulatedTransaction>

    'ADDRESSES_PROVIDER()'(overrides?: CallOverrides): Promise<PopulatedTransaction>

    getAllATokens(overrides?: CallOverrides): Promise<PopulatedTransaction>

    'getAllATokens()'(overrides?: CallOverrides): Promise<PopulatedTransaction>

    getAllReservesTokens(overrides?: CallOverrides): Promise<PopulatedTransaction>

    'getAllReservesTokens()'(overrides?: CallOverrides): Promise<PopulatedTransaction>

    getReserveConfigurationData(asset: string, overrides?: CallOverrides): Promise<PopulatedTransaction>

    'getReserveConfigurationData(address)'(asset: string, overrides?: CallOverrides): Promise<PopulatedTransaction>

    getReserveData(asset: string, overrides?: CallOverrides): Promise<PopulatedTransaction>

    'getReserveData(address)'(asset: string, overrides?: CallOverrides): Promise<PopulatedTransaction>

    getReserveTokensAddresses(asset: string, overrides?: CallOverrides): Promise<PopulatedTransaction>

    'getReserveTokensAddresses(address)'(asset: string, overrides?: CallOverrides): Promise<PopulatedTransaction>

    getUserReserveData(asset: string, user: string, overrides?: CallOverrides): Promise<PopulatedTransaction>

    'getUserReserveData(address,address)'(
      asset: string,
      user: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>
  }
}
