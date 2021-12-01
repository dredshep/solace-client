import { ChainId, AddressMap } from '@sushiswap/sdk'

export const WETH9_ADDRESS: AddressMap = {
  [ChainId.MAINNET]: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  [ChainId.ROPSTEN]: '0xc778417E063141139Fce010982780140Aa0cD5Ab',
  [ChainId.RINKEBY]: '0xc778417E063141139Fce010982780140Aa0cD5Ab',
  [ChainId.GÖRLI]: '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',
  [ChainId.KOVAN]: '0xd0A1E359811322d97991E03f863a0C30C2cF029C',
  [ChainId.ARBITRUM]: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
  [ChainId.ARBITRUM_TESTNET]: '0xf8456e5e6A225C2C1D74D8C9a4cB2B1d5dc1153b',
  [ChainId.BSC]: '0x2170Ed0880ac9A755fd29B2688956BD959F933F8',
  [ChainId.FANTOM]: '0x74b23882a30290451A17c44f4F05243b6b58C76d',
  [ChainId.MATIC]: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
  [ChainId.OKEX]: '0x2170Ed0880ac9A755fd29B2688956BD959F933F8',
  [ChainId.HECO]: '0x64FF637fB478863B7468bc97D30a5bF3A428a1fD',
  [ChainId.HARMONY]: '0x6983D1E6DEf3690C4d616b13597A09e6193EA013',
  [ChainId.XDAI]: '0x6A023CCd1ff6F2045C3309768eAd9E68F978f6e1',
  [ChainId.AVALANCHE]: '0xf20d962a6c8f70c731bd838a3a388D7d48fA6e15',
}

export const USDC_ADDRESS: AddressMap = {
  [ChainId.MAINNET]: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  [ChainId.RINKEBY]: '0x4DBCdF9B62e891a7cec5A2568C3F4FAF9E8Abe2b',
  [ChainId.KOVAN]: '0xeFD4E002d58A66E9ea53F9EbF0583Aecc6E183F0',
}

export const USDT_ADDRESS: AddressMap = {
  [ChainId.MAINNET]: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
  [ChainId.RINKEBY]: '0xD9BA894E0097f8cC2BBc9D24D308b98e36dc6D02',
  [ChainId.KOVAN]: '0xAEA2B0F4763c8Ffc33A4c454CD08F803B02B6B53',
}

export const DAI_ADDRESS: AddressMap = {
  [ChainId.MAINNET]: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
  [ChainId.RINKEBY]: '0x5592EC0cfb4dbc12D3aB100b257153436a1f0FEa',
  [ChainId.KOVAN]: '0xC56010E957c325b140f182b4FBEE61C2Fb95FDb3',
}
