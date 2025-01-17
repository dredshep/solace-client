import { BondName } from '../../enums'
import { TellerToken } from '../../types'
import { TELLER_ADDRS_V1, TELLER_ADDRS_V2 } from '../../addresses/mainnet'
import {
  DAI_ADDRESS,
  FRAX_ADDRESS,
  SCP_ADDRESS,
  SOLACE_USDC_SLP_ADDRESS,
  USDC_ADDRESS,
  USDT_ADDRESS,
  WBTC_ADDRESS,
  WETH9_ADDRESS,
} from '../../mappings/tokenAddressMapping'

import bondTellerErc20Abi_V1 from '../../abi/contracts/BondTellerErc20.sol/BondTellerErc20.json'
import bondTellerErc20Abi_V2 from '../../metadata/BondTellerErc20_V2.json'
import bondTellerEthAbi_V1 from '../../abi/contracts/BondTellerEth.sol/BondTellerEth.json'
import bondTellerEthAbi_V2 from '../../metadata/BondTellerEth_V2.json'

import ierc20Json from '../../metadata/IERC20Metadata.json'
import weth9 from '../../abi/contracts/WETH9.sol/WETH9.json'
import sushiswapLpAbi from '../../metadata/ISushiswapMetadataAlt.json'

const chainId = 1

export const tellerToTokenMapping: {
  [key: string]: TellerToken
} = {
  [TELLER_ADDRS_V1.DAI_TELLER]: {
    name: BondName.DAI,
    addr: DAI_ADDRESS[chainId],
    principalAbi: ierc20Json.abi,
    tellerAbi: bondTellerErc20Abi_V1,
    mainnetAddr: DAI_ADDRESS[1],
    tokenId: 'dai',
    isBondTellerErc20: true,
    isLp: false,
    isDisabled: false,
    cannotBuy: true,
    version: 1,
  },
  [TELLER_ADDRS_V1.ETH_TELLER]: {
    name: BondName.ETH,
    addr: WETH9_ADDRESS[chainId],
    principalAbi: weth9,
    tellerAbi: bondTellerEthAbi_V1,
    mainnetAddr: WETH9_ADDRESS[1],
    tokenId: 'ethereum',
    isBondTellerErc20: false,
    isLp: false,
    isDisabled: false,
    cannotBuy: true,
    version: 1,
  },
  [TELLER_ADDRS_V1.USDC_TELLER]: {
    name: BondName.USDC,
    addr: USDC_ADDRESS[chainId],
    principalAbi: ierc20Json.abi,
    tellerAbi: bondTellerErc20Abi_V1,
    mainnetAddr: USDC_ADDRESS[1],
    tokenId: '',
    isBondTellerErc20: true,
    isLp: false,
    isDisabled: false,
    cannotBuy: true,
    version: 1,
  },
  [TELLER_ADDRS_V1.SOLACE_USDC_SLP_TELLER]: {
    name: BondName.SOLACE_USDC_SLP,
    addr: SOLACE_USDC_SLP_ADDRESS[chainId],
    principalAbi: sushiswapLpAbi,
    tellerAbi: bondTellerErc20Abi_V1,
    mainnetAddr: SOLACE_USDC_SLP_ADDRESS[1],
    tokenId: '',
    isBondTellerErc20: true,
    isLp: true,
    sdk: 'sushi',
    isDisabled: false,
    cannotBuy: true,
    version: 1,
  },
  [TELLER_ADDRS_V1.SCP_TELLER]: {
    name: BondName.SCP,
    addr: SCP_ADDRESS[chainId],
    principalAbi: ierc20Json.abi,
    tellerAbi: bondTellerErc20Abi_V1,
    mainnetAddr: SCP_ADDRESS[1],
    tokenId: '',
    isBondTellerErc20: true,
    isLp: false,
    isDisabled: false,
    cannotBuy: true,
    version: 1,
  },
  [TELLER_ADDRS_V1.WBTC_TELLER]: {
    name: BondName.WBTC,
    addr: WBTC_ADDRESS[chainId],
    principalAbi: ierc20Json.abi,
    tellerAbi: bondTellerErc20Abi_V1,
    mainnetAddr: WBTC_ADDRESS[1],
    tokenId: '',
    isBondTellerErc20: true,
    isLp: false,
    isDisabled: false,
    cannotBuy: true,
    version: 1,
  },
  [TELLER_ADDRS_V1.USDT_TELLER]: {
    name: BondName.USDT,
    addr: USDT_ADDRESS[chainId],
    principalAbi: ierc20Json.abi,
    tellerAbi: bondTellerErc20Abi_V1,
    mainnetAddr: USDT_ADDRESS[1],
    tokenId: 'tether',
    isBondTellerErc20: true,
    isLp: false,
    isDisabled: false,
    cannotBuy: true,
    version: 1,
  },
  [TELLER_ADDRS_V2.DAI_TELLER]: {
    name: BondName.DAI,
    addr: DAI_ADDRESS[chainId],
    principalAbi: ierc20Json.abi,
    tellerAbi: bondTellerErc20Abi_V2.abi,
    mainnetAddr: DAI_ADDRESS[1],
    tokenId: 'dai',
    isBondTellerErc20: true,
    isLp: false,
    isDisabled: false,
    version: 2,
  },
  [TELLER_ADDRS_V2.ETH_TELLER]: {
    name: BondName.ETH,
    addr: WETH9_ADDRESS[chainId],
    principalAbi: ierc20Json.abi,
    tellerAbi: bondTellerEthAbi_V2.abi,
    mainnetAddr: WETH9_ADDRESS[1],
    tokenId: 'ethereum',
    isBondTellerErc20: false,
    isLp: false,
    isDisabled: false,
    version: 2,
  },
  [TELLER_ADDRS_V2.USDC_TELLER]: {
    name: BondName.USDC,
    addr: USDC_ADDRESS[chainId],
    principalAbi: ierc20Json.abi,
    tellerAbi: bondTellerErc20Abi_V2.abi,
    mainnetAddr: USDC_ADDRESS[1],
    tokenId: '',
    isBondTellerErc20: true,
    isLp: false,
    isDisabled: false,
    version: 2,
  },
  [TELLER_ADDRS_V2.WBTC_TELLER]: {
    name: BondName.WBTC,
    addr: WBTC_ADDRESS[chainId],
    principalAbi: ierc20Json.abi,
    tellerAbi: bondTellerErc20Abi_V2.abi,
    mainnetAddr: WBTC_ADDRESS[1],
    tokenId: '',
    isBondTellerErc20: true,
    isLp: false,
    isDisabled: false,
    version: 2,
  },
  [TELLER_ADDRS_V2.USDT_TELLER]: {
    name: BondName.USDT,
    addr: USDT_ADDRESS[chainId],
    principalAbi: ierc20Json.abi,
    tellerAbi: bondTellerErc20Abi_V2.abi,
    mainnetAddr: USDT_ADDRESS[1],
    tokenId: 'tether',
    isBondTellerErc20: true,
    isLp: false,
    isDisabled: false,
    version: 2,
  },
  [TELLER_ADDRS_V2.SCP_TELLER]: {
    name: BondName.SCP,
    addr: SCP_ADDRESS[chainId],
    principalAbi: ierc20Json.abi,
    tellerAbi: bondTellerErc20Abi_V2.abi,
    mainnetAddr: SCP_ADDRESS[1],
    tokenId: '',
    isBondTellerErc20: true,
    isLp: false,
    isDisabled: false,
    version: 2,
  },
  [TELLER_ADDRS_V2.FRAX_TELLER]: {
    name: BondName.FRAX,
    addr: FRAX_ADDRESS[chainId],
    principalAbi: ierc20Json.abi,
    tellerAbi: bondTellerErc20Abi_V2.abi,
    mainnetAddr: FRAX_ADDRESS[1],
    tokenId: 'frax',
    isBondTellerErc20: true,
    isLp: false,
    isDisabled: false,
    version: 2,
  },
}
