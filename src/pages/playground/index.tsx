import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react'
import { Contract } from '@ethersproject/contracts'

import { useWallet } from '../../context/Web3Manager'
import { useContracts } from '../../context/ContractsManager'
import { ethers, BigNumber as BN, constants } from 'ethers'
import { formatEther } from '@ethersproject/units'

import { BigNumber } from '@ethersproject/bignumber'

import Coins from '../../components/ui/Coins'
import { getPermitDigest, sign, getDomainSeparator } from '../../utils/signature'

import { NUM_BLOCKS_PER_DAY, NUM_DAYS_PER_MONTH, DAYS_PER_YEAR, TOKEN_NAME } from '../../constants'

function Playground(): any {
  const wallet = useWallet()
  const status = wallet.isActive ? <div>Playground, connected</div> : <div>Playground, disconnected</div>

  const [assets, setAssets] = useState<number>(0)
  const [farms, setFarms] = useState<string>('0')
  const [solaceBalance, setSolaceBalance] = useState<number>(0)

  const [rewardsPerDay, setRewardsPerDay] = useState<number>(0)
  const [userRewardsPerDay, setUserRewardsPerDay] = useState<number>(0)
  const [userRewards, setUserRewards] = useState<number>(0)

  const [amount, setAmount] = useState<number>(5)
  const [maxLoss, setMaxLoss] = useState<number>(5)
  const [loading, setLoading] = useState<boolean>(false)
  const [scp, setScp] = useState<number>(0)
  const [valueStaked, setValueStaked] = useState<number>(0)
  const [userCpValueStaked, setUserCpValueStaked] = useState<number>(0)
  const [userVaultShare, setUserVaultShare] = useState<number>(0)

  const masterContractRef = useRef<Contract | null>()
  const vaultContractRef = useRef<Contract | null>()
  const solaceContractRef = useRef<Contract | null>()
  const cpFarmContractRef = useRef<Contract | null>()
  const lpFarmContractRef = useRef<Contract | null>()

  const { master, vault, solace, cpFarm, lpFarm } = useContracts()

  const refresh = async () => {
    getSolaceBalance()
    getTotalAssets()
    getNumFarms()
    getUserRewards()
    getUserRewardsPerDay()
    getRewardsPerDay()
    getUserVaultShare()
  }

  const getUserVaultShare = async () => {
    console.log('calling getUserVaultShare')
    if (!cpFarmContractRef.current?.provider || !vaultContractRef.current?.provider || !wallet.account) return
    try {
      const totalSupply = await vaultContractRef.current.totalSupply()
      const userInfo = await cpFarmContractRef.current.userInfo(wallet.account)
      const value = userInfo.value
      const cpBalance = await getScp()
      const share = totalSupply > 0 ? (parseFloat(formatEther(BigNumber.from(cpBalance))) + value) / totalSupply : 0
      setUserVaultShare(share)
      console.log('success getUserVaultShare')
      return value
    } catch (err) {
      console.log('error getUserVaultShare ', err)
    }
  }

  const getUserCpValueStaked = async () => {
    console.log('calling getUserCpValueStaked')
    if (!cpFarmContractRef.current?.provider || !wallet.account) return
    try {
      const userInfo = await cpFarmContractRef.current.userInfo(wallet.account)
      const value = userInfo.value
      // if (userValueStaked !== value)
      setUserCpValueStaked(value)
      console.log('success getUserCpValueStaked')
      return value
    } catch (err) {
      console.log('error getUserCpValueStaked ', err)
    }
  }

  const getRewardsPerDay = async () => {
    console.log('calling getRewardsPerDay')

    if (!masterContractRef.current) return

    try {
      const allocPoints = await masterContractRef.current.allocPoints(1)
      const totalAllocPoints = await masterContractRef.current.totalAllocPoints()
      const solacePerBlock = await masterContractRef.current.solacePerBlock()
      const rewards = solacePerBlock * NUM_BLOCKS_PER_DAY * (allocPoints / totalAllocPoints)
      if (rewardsPerDay !== rewards) setRewardsPerDay(rewards)
      console.log('success getRewardsPerDay')
    } catch (err) {
      console.log('error getRewardsPerDay ', err)
    }
  }

  const getUserRewardsPerDay = async () => {
    console.log('calling getUserRewardsPerDay')

    if (!masterContractRef.current || !wallet.account) return
    try {
      const farmValue = await getFarmValueStaked()
      if (farmValue <= 0) {
        setUserRewardsPerDay(0)
        return
      }
      const userValue = await getUserCpValueStaked()
      const allocPoints = await masterContractRef.current.allocPoints(1)
      const totalAllocPoints = await masterContractRef.current.totalAllocPoints()
      const solacePerBlock = await masterContractRef.current.solacePerBlock()
      const userRewards =
        solacePerBlock * NUM_BLOCKS_PER_DAY * (userValue / farmValue) * (allocPoints / totalAllocPoints)
      if (userRewardsPerDay !== userRewards) setUserRewardsPerDay(userRewards)
      console.log('success getUserRewardsPerDay')
    } catch (err) {
      console.log('error getUserRewardsPerDay ', err)
    }
  }

  const getUserRewards = async () => {
    console.log('calling getUserRewards')

    if (!cpFarmContractRef.current || farms === '' || !wallet.account) return
    try {
      let rewards = 0
      for (let i = 0; i < parseInt(farms); i++) {
        const pendingReward = await cpFarmContractRef.current.pendingRewards(wallet.account)
        rewards += pendingReward
      }
      if (userRewards !== rewards) setUserRewards(rewards)
      console.log('success getUserRewards')
    } catch (err) {
      console.log('error getUserRewards ', err)
    }
  }

  const getFarmValueStaked = async () => {
    console.log('calling getFarmValueStaked')

    if (!cpFarmContractRef.current || farms === '') return
    try {
      const farmValueStaked = await cpFarmContractRef.current.valueStaked()
      if (valueStaked !== farmValueStaked) setValueStaked(farmValueStaked)
      console.log('success getFarmValueStaked')
      return farmValueStaked
    } catch (err) {
      console.log('error getFarmValueStaked ', err)
    }
  }

  const getScp = async () => {
    console.log('calling getCp')

    if (!vaultContractRef.current?.provider || !wallet.account) return

    try {
      const balance = await vaultContractRef.current.balanceOf(wallet.account)
      if (scp !== balance) setScp(balance)
      console.log('success getCp')
      return balance
    } catch (err) {
      console.log('error getCp ', err)
    }
  }

  const getSolaceBalance = async () => {
    console.log('calling getSolaceBalance')

    if (!solaceContractRef.current?.provider || !wallet.account) return

    try {
      const balance = await solaceContractRef.current.balanceOf(wallet.account)
      if (solaceBalance !== balance) setSolaceBalance(balance)
      console.log('success getSolaceBalance')
    } catch (err) {
      console.log('error getSolaceBalance ', err)
    }
  }

  const getNumFarms = async () => {
    console.log('calling getNumFarms')

    if (!masterContractRef.current) return
    try {
      const ans = await masterContractRef.current.numFarms()
      setFarms(ans.toString())
      console.log('success getNumFarms')
    } catch (err) {
      console.log('error getNumFarms ', err)
    }
  }

  const getTotalAssets = async () => {
    console.log('calling getTotalAssets')

    if (!vaultContractRef.current) return
    try {
      const ans = await vaultContractRef.current.totalAssets().then((ans: any) => {
        return ans
      })
      setAssets(ans)
      console.log('success getTotalAssets')
    } catch (err) {
      console.log('error getTotalAssets ', err)
    }
  }

  // user deposits ETH into Vault for SCP
  const callDepositVault = async () => {
    setLoading(true)
    if (!vaultContractRef.current) return

    try {
      const tx = await vaultContractRef.current.deposit({ value: ethers.utils.parseEther(amount.toString()) })
      await tx.wait()
      const r = await vaultContractRef.current.on('DepositMade', (sender, amount, shares, tx) => {
        console.log('depositVault event: ', tx)
        wallet.updateBalance(wallet.balance.sub(amount))
        refresh()
        setLoading(false)
      })
    } catch (err) {
      console.log('callDepositVault ', err)
    }
  }

  // user deposits ETH into vault and stake in CP farm
  const callDepositEth = async () => {
    console.log('calling callDepositEth')
    setLoading(true)
    if (!cpFarmContractRef.current || !vaultContractRef.current) return
    try {
      const deposit = await cpFarmContractRef.current.depositEth({ value: ethers.utils.parseEther(amount.toString()) })
      await deposit.wait()
      const depositEvent = await cpFarmContractRef.current.on('DepositEth', (sender, amount, tx) => {
        console.log('DepositEth event: ', tx)
        wallet.updateBalance(wallet.balance.sub(amount))
        refresh()
        setLoading(false)
      })
    } catch (err) {
      console.log('error callDepositEth ', err)
    }
  }

  // user deposits SCP into CP farm
  const callDepositCp = async () => {
    console.log('calling callDepositCp')
    setLoading(true)
    if (!cpFarmContractRef.current || !vaultContractRef.current) return
    try {
      const approval = await vaultContractRef.current.approve(
        cpFarmContractRef.current.address,
        ethers.utils.parseEther(amount.toString())
      )
      await approval.wait()
      const approvalEvent = await vaultContractRef.current.on('Approval', (owner, spender, value, tx) => {
        console.log('approval event: ', tx)
      })
      const deposit = await cpFarmContractRef.current.depositCp(ethers.utils.parseEther(amount.toString()))
      await deposit.wait()
      const depositEvent = await cpFarmContractRef.current.on('DepositCp', (sender, amount, tx) => {
        console.log('DepositCp event: ', tx)
        wallet.updateBalance(wallet.balance.sub(amount))
        refresh()
        setLoading(false)
      })
    } catch (err) {
      console.log('error callDepositCp ', err)
    }
  }

  const callWithdrawVault = async () => {
    setLoading(true)
    if (!vaultContractRef.current) return

    try {
      const tx = await vaultContractRef.current.withdraw(ethers.utils.parseEther(amount.toString()), maxLoss)
      await tx.wait()
      const r = await vaultContractRef.current.on('WithdrawalMade', (sender, amount, tx) => {
        console.log('withdrawal event: ', tx)
        wallet.updateBalance(wallet.balance.add(amount))
        refresh()
        setLoading(false)
      })
    } catch (err) {
      console.log('callWithdrawVault ', err)
    }
  }

  const callWithdrawCp = async () => {
    console.log('calling callWithdrawCp')

    setLoading(true)
    if (!cpFarmContractRef.current) return
    try {
      const withdraw = await cpFarmContractRef.current.withdrawEth(ethers.utils.parseEther(amount.toString()), maxLoss)
      await withdraw.wait()
      const withdrawEvent = await cpFarmContractRef.current.on('WithdrawEth', (sender, amount, tx) => {
        console.log('WithdrawEth event: ', tx)
        wallet.updateBalance(wallet.balance.add(amount))
        refresh()
        setLoading(false)
      })
    } catch (err) {
      console.log('error callWithdrawCp ', err)
    }
  }

  const callDepositErc721 = async () => {
    setLoading(true)
    if (!masterContractRef.current) return
    try {
      const ans = await masterContractRef.current.depositErc721(0, 0)
      return ans
    } catch (err) {
      console.log('callDepositErc721 ', err)
    }
    setLoading(false)
  }

  const callWithdrawErc721 = async () => {
    setLoading(true)
    if (!masterContractRef.current) return

    try {
      const tx = await masterContractRef.current.withdrawErc721(0, 0)
      await tx.wait()
      const r = await masterContractRef.current.on('WithdrawErc721', (sender, farmId, token, tx) => {
        console.log('withdrawVault event: ', tx)
        refresh()
        setLoading(false)
      })
    } catch (err) {
      console.log('callWithdrawErc721 ', err)
    }
  }

  useEffect(() => {
    console.log('mount: \n ', master, ' \n ', vault, ' \n ', solace, ' \n ', cpFarm)
    vaultContractRef.current = vault
    masterContractRef.current = master
    solaceContractRef.current = solace
    cpFarmContractRef.current = cpFarm
    lpFarmContractRef.current = cpFarm

    refresh()
  }, [master, vault, solace, cpFarm, lpFarm])

  return (
    <>
      {console.log('RENDER')}
      {status}
      <div>Farms: {farms}</div>
      <div>Farm value staked: {formatEther(BigNumber.from(valueStaked)).toString()}</div>
      <div>Total Assets: {formatEther(BigNumber.from(assets)).toString()}</div>
      <div>Rewards per day: {formatEther(BigNumber.from(rewardsPerDay)).toString()}</div>
      {wallet.isActive ? (
        !loading ? (
          <>
            <div>My rewards per day: {formatEther(BigNumber.from(Math.floor(userRewardsPerDay))).toString()}</div>
            <div>My rewards: {formatEther(userRewards).toString()}</div>
            {/* <div>Account: {wallet.account}</div>
            <div>Chain Id: {wallet.networkId}</div>
            <div>Solace Balance: {solaceBalance}</div> */}
            <div>SOLACE: {formatEther(BigNumber.from(solaceBalance)).toString()}</div>
            <div>SCP Tokens: {formatEther(BigNumber.from(scp)).toString()}</div>
            <div>Your CP stake: {formatEther(BigNumber.from(userCpValueStaked)).toString()}</div>
            <div>Your vault share: {`${userVaultShare.toString()}%`}</div>
            <label htmlFor="amount">Amount</label>
            <input
              type="number"
              value={`${amount}`}
              id="amount"
              onChange={(e) => setAmount(parseInt(e.target.value))}
            />
            <label htmlFor="maxLoss">Max Loss: {maxLoss}</label>
            <input
              type="range"
              name="maxLoss"
              id="maxLoss"
              min="1"
              max="10"
              value={maxLoss}
              step="1"
              onChange={(e) => setMaxLoss(parseInt(e.target.value))}
            />
            <button onClick={callDepositVault}>deposit into vault</button>
            <button onClick={callDepositCp}>deposit CP</button>
            <button onClick={callDepositEth}>deposit CP and stake</button>
            <button onClick={callWithdrawVault}>withdraw from vault</button>
            <button onClick={callWithdrawCp}>withdraw CP</button>
            <button onClick={callDepositErc721}>deposit LP</button>
            <button onClick={callWithdrawErc721}>withdraw LP</button>
          </>
        ) : (
          <div>Loading</div>
        )
      ) : null}
      <Coins />
    </>
  )
}

export default Playground
