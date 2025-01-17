import { NetworkConfig, Token } from '../../../../constants/types'
import { getContract } from '../../../../utils'
import { THEGRAPH_API_KEY, ZERO } from '../../../../constants'
import masterchefStakingPoolABI from '../_contracts/IMasterChefStakingPool.json'
import { BigNumber } from 'ethers'

import { ApolloClient, InMemoryCache, gql } from '@apollo/client'

export const getAmounts_MasterChefStakingPool = async (
  user: string,
  provider: any,
  activeNetwork: NetworkConfig,
  tokens: Token[]
): Promise<BigNumber[]> => {
  /*
  
      farm contract segment
  
    */

  const GRAPH_URL = `https://gateway.thegraph.com/api/${String(
    THEGRAPH_API_KEY
  )}/subgraphs/id/0x4bb4c1b0745ef7b4642feeccd0740dec417ca0a0-1`

  const client = new ApolloClient({
    uri: GRAPH_URL,
    cache: new InMemoryCache(),
  })

  const masterChefStakingContract = getContract(
    '0xc2edad668740f1aa35e4d8f227fb8e17dca888cd',
    masterchefStakingPoolABI,
    provider
  )

  const apolloData = await client
    .query({
      query: gql`
        query pools($lpAddrs: [String]) {
          pools(where: { pair_in: $lpAddrs }) {
            id
            pair
          }
        }
      `,
      variables: {
        lpAddrs: tokens.map((t) => t.token.address.toLowerCase()),
      },
    })
    .then((res) => res.data.pools)
    .catch((e) => {
      console.log(`apollo fetch at getBalances_MasterChefStakingPool failed`, e)
      return []
    })

  const pools = apolloData
  const amounts: BigNumber[] = []

  for (let i = 0; i < tokens.length; i++) {
    const matchingPool = pools.find((pool: any) => pool.pair.toLowerCase() == tokens[i].token.address.toLowerCase())

    if (matchingPool) {
      // check staking contract for balances
      const userInfo = await masterChefStakingContract.userInfo(
        BigNumber.from(matchingPool.id),
        tokens[i].metadata.user
      )

      const amount: BigNumber = userInfo.amount
      amounts.push(amount)
    } else {
      amounts.push(ZERO)
    }
  }
  return amounts
}
