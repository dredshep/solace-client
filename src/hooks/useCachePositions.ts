import { useEffect, useRef, useState, useCallback } from 'react'
import {
  LiquityPosition,
  NetworkConfig,
  Position,
  PositionNamesCache,
  PositionNamesCacheValue,
  PositionsCache,
  PositionsCacheValue,
  SupportedProduct,
  Token,
} from '../constants/types'
import { useWallet } from '../context/WalletManager'
import { useNetwork } from '../context/NetworkManager'
import { useSessionStorage } from 'react-use-storage'
import { NetworkCache } from '../constants/types'
import { ProductName } from '../constants/enums'
import { getTroveContract } from '../products/positionGetters/liquity/getPositions'
import { ZERO } from '../constants'

export const useCachePositions = () => {
  const { library } = useWallet()
  const { activeNetwork, networks, findNetworkByChainId } = useNetwork()
  const [storedPositionData, setStoredPositionData] = useSessionStorage<NetworkCache[]>('sol_position_data', [])
  const running = useRef(false)
  const [dataInitialized, setDataInitialized] = useState<boolean>(false)

  const setStoredData = useCallback(() => {
    // on mount, if stored data exists in session already, return that data, else return newly made data
    if (storedPositionData.length == 0) {
      const unsetPositionData: NetworkCache[] = []
      networks.forEach((network) => {
        const supportedProducts = network.cache.supportedProducts.map((product: SupportedProduct) => product.name)

        const cachedPositions: PositionsCache = {}
        const cachedPositionNames: PositionNamesCache = {}

        supportedProducts.forEach((name: ProductName) => {
          cachedPositions[name] = { savedPositions: [], positionsInitialized: false }
          cachedPositionNames[name] = { positionNames: {}, positionNamesInitialized: false }
        })

        unsetPositionData.push({
          name: network.name,
          chainId: network.chainId,
          positions: cachedPositions,
          positionNames: cachedPositionNames,
        })
      })
      setStoredPositionData(unsetPositionData)
      return unsetPositionData
    }
    return storedPositionData
  }, [])

  const getAllPositionsforChain = useCallback(
    async (data: NetworkCache[], _activeNetwork: NetworkConfig, _library: any) => {
      if (running.current || _library == undefined || _activeNetwork.chainId == undefined) return
      setDataInitialized(false)
      running.current = true
      if (!findNetworkByChainId(_activeNetwork.chainId)) {
        running.current = false
        return
      }

      // given the input data, find the dataset from that data appropriate to the current network
      const newCache = data.find((dataset) => dataset.name == _activeNetwork.name)
      if (!newCache) return
      const supportedProducts = _activeNetwork.cache.supportedProducts
      let changeOccurred = false

      // for every supported product in this network, initialize the positions, if any
      await Promise.all(
        supportedProducts.map(async (supportedProduct: SupportedProduct) => {
          const productName = supportedProduct.name
          if (
            !newCache.positions[productName].positionsInitialized &&
            !newCache.positionNames[productName].positionNamesInitialized
          ) {
            const { initializedPositions, initializedPositionNames } = await handleInitPositions(
              supportedProduct,
              newCache,
              library,
              activeNetwork
            )
            newCache.positions[productName] = initializedPositions
            newCache.positionNames[productName] = initializedPositionNames
            changeOccurred = true
          }
        })
      )
      if (!changeOccurred) {
        console.log('useCachePositions: no position init needed')
      } else {
        const editedData = data.filter((data) => data.name != newCache.name)
        const newData = [...editedData, newCache]
        setStoredPositionData(newData)
        console.log('useCachePositions: position init completed')
      }
      setDataInitialized(true)
      running.current = false
    },
    []
  )

  // return initializedPositions and initializedPositionNames
  const handleInitPositions = async (
    supportedProduct: SupportedProduct,
    newCache: NetworkCache,
    _library: any,
    _activeNetwork: NetworkConfig
  ) => {
    let initializedPositions: PositionsCacheValue = {
      savedPositions: [],
      positionsInitialized: false,
    }
    let _positionNames: any = null
    switch (supportedProduct.positionsType) {
      case 'erc20':
        if (typeof supportedProduct.getTokens !== 'undefined') {
          const tokens: Token[] = await supportedProduct.getTokens(_library, _activeNetwork)
          initializedPositions = {
            ...newCache.positions[supportedProduct.name],
            savedPositions: tokens.map((token) => {
              return { type: 'erc20', position: token }
            }) as Position[],
            positionsInitialized: true,
          }
          const positionNames = tokens.reduce(
            (names: any, token: Token) => ({
              ...names,
              [token.token.address.toLowerCase()]: token.underlying.symbol,
            }),
            {}
          )
          _positionNames = positionNames
          break
        } else break
      case 'liquity':
        const troveManagerContract = getTroveContract(library, activeNetwork.chainId)
        const stabilityPoolAddr: string = await troveManagerContract.stabilityPool()
        const lqtyStakingAddr: string = await troveManagerContract.lqtyStaking()
        const lusdTokenAddr: string = await troveManagerContract.lusdToken()
        const lqtyTokenAddr: string = await troveManagerContract.lqtyToken()
        const liquityPositions: LiquityPosition[] = [
          {
            positionAddress: troveManagerContract.address,
            positionName: 'Trove',
            amount: ZERO,
            nativeAmount: ZERO,
            associatedToken: {
              address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
              name: 'Ether',
              symbol: 'ETH',
            },
          },
          {
            positionAddress: stabilityPoolAddr,
            positionName: 'Stability Pool',
            amount: ZERO,
            nativeAmount: ZERO,
            associatedToken: { address: lusdTokenAddr, name: 'LUSD', symbol: 'LUSD' },
          },
          {
            positionAddress: lqtyStakingAddr,
            positionName: 'Staking Pool',
            amount: ZERO,
            nativeAmount: ZERO,
            associatedToken: { address: lqtyTokenAddr, name: 'LQTY', symbol: 'LQTY' },
          },
        ]
        initializedPositions = {
          ...newCache.positions[supportedProduct.name],
          savedPositions: liquityPositions.map((liquityPos) => {
            return { type: 'liquity', position: liquityPos }
          }) as Position[],
          positionsInitialized: true,
        }
        const positionNames = liquityPositions.reduce(
          (names: any, liquityPos: LiquityPosition) => ({
            ...names,
            [liquityPos.positionAddress.toLowerCase()]: liquityPos.positionName,
          }),
          {}
        )
        _positionNames = positionNames
        break
      case 'other':
      default:
    }
    const initializedPositionNames: PositionNamesCacheValue = {
      ...newCache.positionNames[supportedProduct.name],
      positionNames: _positionNames,
      positionNamesInitialized: true,
    }
    return { initializedPositions, initializedPositionNames }
  }

  useEffect(() => {
    const data = setStoredData()
    getAllPositionsforChain(data, activeNetwork, library)
  }, [activeNetwork])

  return { dataInitialized, storedPositionData }
}
