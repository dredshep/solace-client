import React, { useEffect, useState, useMemo } from 'react'
import Flex from '../stake/atoms/Flex'
import RaisedBox from '../../components/atoms/RaisedBox'
import ShadowDiv from '../stake/atoms/ShadowDiv'
import { Text } from '../../components/atoms/Typography'
import { QuestionCircle } from '@styled-icons/bootstrap/QuestionCircle'
// src/components/atoms/Button/index.ts
import { Button } from '../../components/atoms/Button'
// src/resources/svg/icons/usd.svg
import USD from '../../resources/svg/icons/usd.svg'
import DAI from '../../resources/svg/icons/dai.svg'
import ToggleSwitch from '../../components/atoms/ToggleSwitch'
import GrayBox, { FixedHeightGrayBox, StyledGrayBox } from '../stake/components/GrayBox'
import { GenericInputSection } from '../stake/sections/InputSection'
import { StyledSlider } from '../../components/atoms/Input'
import commaNumber from '../../utils/commaNumber'
import { Table, TableHead, TableHeader, TableBody, TableRow, TableData } from '../../components/atoms/Table'
import { StyledTooltip } from '../../components/molecules/Tooltip'
import { useWindowDimensions } from '../../hooks/useWindowDimensions'
import { BKPT_5, ZERO } from '../../constants'
import GrayBgDiv from '../stake/atoms/BodyBgCss'
import {
  useCheckIsCoverageActive,
  useCooldownDetails,
  useFunctions,
  usePortfolio,
  useTotalAccountBalance,
} from '../../hooks/useSolaceCoverProduct'
import { useWallet } from '../../context/WalletManager'
import { BigNumber, Contract } from 'ethers'
import { VerticalSeparator } from '../stake/components/VerticalSeparator'
import { useGeneral } from '../../context/GeneralManager'
import { StyledCopy, TechyGradientCopy } from '../../components/atoms/Icon'
import { SolaceRiskProtocol, SolaceRiskScore } from '../../constants/types'
import {
  accurateMultiply,
  capitalizeFirstLetter,
  filterAmount,
  floatUnits,
  formatAmount,
  truncateValue,
} from '../../utils/formatting'
import { getTimeFromMillis } from '../../utils/time'
import { useInputAmount, useTransactionExecution } from '../../hooks/useInputAmount'
import { FunctionName } from '../../constants/enums'
import { parseUnits } from 'ethers/lib/utils'
import { useCachedData } from '../../context/CachedDataManager'
import { useProvider } from '../../context/ProviderManager'
import { DAI_ADDRESS } from '../../constants/mappings/tokenAddressMapping'
import { useNetwork } from '../../context/NetworkManager'
import IERC20 from '../../constants/metadata/IERC20Metadata.json'
import { queryBalance, queryDecimals } from '../../utils/contract'
import useDebounce from '@rooks/use-debounce'
import { formatUnits } from 'ethers/lib/utils'

function Card({
  children,
  style,
  thinner,
  innerBigger,
  innerThinner,
  bigger,
  normous,
  horiz,
  firstTime,
  noShadow,
  noPadding,
  gap,
  ...rest
}: {
  children: React.ReactNode
  style?: React.CSSProperties
  /** first card - `flex: 0.8` */ thinner?: boolean
  /** second card - `flex 1` */ bigger?: boolean
  /** second card firstTime - `flex 1.2` */ innerBigger?: boolean
  /** second card - `flex: 0.8` */ innerThinner?: boolean
  /* big box under coverage active toggle - flex: 12*/ normous?: boolean
  /** first time 2-form card - `flex 2` */ firstTime?: boolean
  horiz?: boolean
  noShadow?: boolean
  noPadding?: boolean
  gap?: number
}) {
  const defaultStyle = style ?? {}
  // thinner is 0.8, bigger is 1.2
  const customStyle = {
    display: 'flex',
    flex: (() => {
      if (thinner) return 0.8
      if (bigger) return 1
      if (innerBigger) return 1.2
      if (innerThinner) return 0.9
      if (normous) return 12
      if (firstTime) return 2
    })(),
    // alignItems: 'stretch',
    // justifyContent: between ? 'space-between' : 'flex-start',
  }
  const combinedStyle = { ...defaultStyle, ...customStyle }

  const colStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    // alignItems: 'stretch',
  }

  const rowStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'stretch',
  }

  return !noShadow ? (
    <ShadowDiv style={combinedStyle} {...rest}>
      <RaisedBox style={horiz ? rowStyle : colStyle}>
        <Flex p={!noPadding ? 24 : undefined} column={!horiz} stretch flex1 gap={gap}>
          {children}
        </Flex>
      </RaisedBox>
    </ShadowDiv>
  ) : (
    <Flex
      style={combinedStyle}
      {...rest}
      col
      // style={innerBigger || innerThinner ? { ...combinedStyle, border: '1px solid #e6e6e6' } : { ...combinedStyle }}
    >
      <RaisedBox style={horiz ? rowStyle : colStyle}>
        <Flex p={!noPadding ? 24 : undefined} column={!horiz} stretch flex1 gap={gap}>
          {children}
        </Flex>
      </RaisedBox>
    </Flex>
  )
}

// second line is an svg circle with a text inside
// third line is a text below the circle
// fourth line is 1 submit and 1 cancel button

enum ChosenLimit {
  Custom,
  MaxPosition,
  Recommended,
}

const ChosenLimitLength = Object.values(ChosenLimit).filter((x) => typeof x === 'number').length

const nextChosenLimit = (chosenLimit: ChosenLimit) => ((chosenLimit + 1) % ChosenLimitLength) as ChosenLimit
const prevChosenLimit = (chosenLimit: ChosenLimit) =>
  ((chosenLimit - 1 + ChosenLimitLength) % ChosenLimitLength) as ChosenLimit

function CoverageLimitBasicForm({
  portfolio,
  currentCoverageLimit,
  isEditing,
  setIsEditing,
  setNewCoverageLimit,
}: {
  portfolio: SolaceRiskScore | undefined
  currentCoverageLimit: BigNumber
  isEditing: boolean
  setIsEditing: (b: boolean) => void
  setNewCoverageLimit: (newCoverageLimit: BigNumber) => void
}) {
  const [chosenLimit, setChosenLimit] = useState<ChosenLimit>(ChosenLimit.Recommended)
  const { latestBlock } = useProvider()
  const { version } = useCachedData()

  const highestPosition = useMemo(
    () =>
      portfolio && portfolio.protocols.length > 0
        ? portfolio.protocols.reduce((pn, cn) => (cn.balanceUSD > pn.balanceUSD ? cn : pn))
        : undefined,
    [portfolio]
  )

  const { getAvailableCoverCapacity } = useFunctions()

  const [highestAmount, setHighestAmount] = useState<BigNumber>(ZERO)
  const [recommendedAmount, setRecommendedAmount] = useState<BigNumber>(ZERO)
  const [customInputAmount, setCustomInputAmount] = useState<string>('')

  const [availableCoverCapacity, setAvailableCoverCapacity] = useState<BigNumber>(ZERO)

  const handleInputChange = (input: string) => {
    // allow only numbers and decimals
    const filtered = filterAmount(input, customInputAmount)

    // if filtered is only "0." or "." or '', filtered becomes '0.0'
    // const formatted = formatAmount(filtered)

    // if number has more than max decimal places, do not update
    if (filtered.includes('.') && filtered.split('.')[1]?.length > 18) return

    // if number is greater than available cover capacity, do not update
    // if (parseUnits(formatted, 18).gt(availableCoverCapacity)) return

    const bnFiltered = BigNumber.from(accurateMultiply(filtered, 18))
    setNewCoverageLimit(bnFiltered)
    setCustomInputAmount(filtered)
    if (!recommendedAmount.eq(bnFiltered) && !highestAmount.eq(bnFiltered)) {
      setChosenLimit(ChosenLimit.Custom)
    }
  }

  const _getCapacity = useDebounce(async () => {
    const capacity = await getAvailableCoverCapacity()
    setAvailableCoverCapacity(capacity)
  }, 300)

  useEffect(() => {
    _getCapacity()
  }, [latestBlock, version])

  useEffect(() => {
    if (!highestPosition) return
    /** Big Number Balance */ const bnBal = BigNumber.from(accurateMultiply(highestPosition.balanceUSD, 18))
    /** balance + 20% */ const bnHigherBal = bnBal.add(bnBal.div(BigNumber.from('5')))
    setHighestAmount(bnBal)
    setRecommendedAmount(bnHigherBal)
  }, [highestPosition])

  useEffect(() => {
    switch (chosenLimit) {
      case ChosenLimit.Recommended:
        setNewCoverageLimit(recommendedAmount)
        setCustomInputAmount(formatUnits(recommendedAmount))
        break
      case ChosenLimit.MaxPosition:
        setNewCoverageLimit(highestAmount)
        setCustomInputAmount(formatUnits(highestAmount))
        break
    }
  }, [chosenLimit, highestAmount, setNewCoverageLimit, recommendedAmount, customInputAmount])

  return (
    <>
      <Flex col gap={30} stretch>
        {!isEditing ? (
          <FixedHeightGrayBox
            h={66}
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: '40px',
            }}
          >
            <Flex baseline center>
              <Text techygradient t2 bold>
                {commaNumber(floatUnits(currentCoverageLimit, 18))}{' '}
                <Text techygradient t4 bold inline>
                  USD
                </Text>
              </Text>
            </Flex>
          </FixedHeightGrayBox>
        ) : (
          <Flex col stretch>
            <Flex justifyCenter>
              <Text t4s>Set Limit to</Text>
            </Flex>
            <Flex between itemsCenter mt={10}>
              <Flex
                itemsCenter
                justifyCenter
                p={10}
                style={{
                  borderRadius: '10px',
                  backgroundColor: '#fafafa',
                  color: 'purple',
                  height: '15px',
                  width: '15px',
                  userSelect: 'none',
                  cursor: 'pointer',
                }}
                onClick={() => setChosenLimit(prevChosenLimit(chosenLimit))}
              >
                &lt;
              </Flex>
              <Flex col itemsCenter>
                <Text info t4s bold>
                  {
                    {
                      [ChosenLimit.Recommended]: 'Recommended',
                      [ChosenLimit.MaxPosition]: 'Highest position',
                      [ChosenLimit.Custom]: 'Manual',
                    }[chosenLimit]
                  }
                </Text>
                <Text info t5s>
                  {
                    {
                      [ChosenLimit.Recommended]: `Highest position + 20%`,
                      [ChosenLimit.MaxPosition]: `in Portfolio`,
                      [ChosenLimit.Custom]: `Enter amount below`,
                    }[chosenLimit]
                  }
                </Text>
              </Flex>
              <Flex
                itemsCenter
                justifyCenter
                p={10}
                style={{
                  borderRadius: '10px',
                  backgroundColor: '#fafafa',
                  color: 'purple',
                  height: '15px',
                  width: '15px',
                  userSelect: 'none',
                  cursor: 'pointer',
                }}
                onClick={() => setChosenLimit(nextChosenLimit(chosenLimit))}
              >
                &gt;
              </Flex>
            </Flex>
            <GenericInputSection
              icon={<img src={DAI} alt="DAI" height={20} />}
              // onChange={(e) => setUsd(Number(e.target.value))}
              onChange={(e) => handleInputChange(e.target.value)}
              text="DAI"
              // value={usd > 0 ? String(usd) : ''}
              value={customInputAmount}
              disabled={false}
              // w={300}
              style={{
                marginTop: '20px',
              }}
              iconAndTextWidth={80}
              displayIconOnMobile
            />
          </Flex>
        )}
        <Flex col stretch>
          <Flex center mt={4}>
            <Flex baseline gap={4} center>
              <Text t4>Highest position:</Text>
              <Flex gap={4} baseline mt={2}>
                <Text
                  t3
                  bold
                  style={{
                    fontSize: '18px',
                  }}
                >
                  {truncateValue(formatUnits(highestAmount, 18), 2, false)}
                </Text>
                <Text t4 bold>
                  USD
                </Text>
              </Flex>
            </Flex>
          </Flex>
          <Flex center mt={5}>
            <Text t4>
              Risk level:{' '}
              <Text
                t3
                warning
                bold
                style={{
                  display: 'inline',
                }}
              >
                Medium
              </Text>
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </>
  )
}

// second line is an svg circle with a text inside
// third line is a text below the circle
// fourth line is 1 submit and 1 cancel button

function CoverageLimit({
  currentCoverageLimit,
  newCoverageLimit,
  isEditing,
  portfolio,
  referralCode,
  setNewCoverageLimit,
  setIsEditing,
  firstTime,
}: {
  currentCoverageLimit: BigNumber
  newCoverageLimit: BigNumber
  isEditing: boolean
  portfolio: SolaceRiskScore | undefined
  referralCode: string | undefined
  setNewCoverageLimit: (newCoverageLimit: BigNumber) => void
  setIsEditing: (isEditing: boolean) => void
  firstTime?: boolean
}) {
  const startEditing = () => setIsEditing(true)
  const stopEditing = () => setIsEditing(false)

  const { updateCoverLimit } = useFunctions()
  const { handleToast, handleContractCallError } = useTransactionExecution()

  const callUpdateCoverLimit = async () => {
    await updateCoverLimit(newCoverageLimit, referralCode ?? '')
      .then((res) => handleToast(res.tx, res.localTx))
      .catch((err) => handleContractCallError('callUpdateCoverLimit', err, FunctionName.SOTERIA_UPDATE))
  }

  return (
    // <Card thinner>
    <Flex
      between
      col
      stretch
      style={{
        flex: '1',
      }}
    >
      <Flex
        itemsCenter
        // style={{
        //   // just between
        //   justifyContent: 'space-between',
        // }}
        between
      >
        <Text t2 bold>
          Coverage Limit
        </Text>
        <StyledTooltip id={'coverage-limit'} tip={'Coverage Limit tip'}>
          <QuestionCircle height={20} width={20} color={'#aaa'} />
        </StyledTooltip>
      </Flex>
      <CoverageLimitBasicForm
        currentCoverageLimit={currentCoverageLimit}
        isEditing={isEditing}
        portfolio={portfolio}
        setIsEditing={setIsEditing}
        setNewCoverageLimit={setNewCoverageLimit}
      />
      <Flex justifyCenter={!isEditing} between={isEditing} gap={isEditing ? 20 : undefined}>
        {firstTime ? (
          <div style={{ height: '36px' }} />
        ) : !isEditing ? (
          <Button
            info
            secondary
            pl={46.75}
            pr={46.75}
            pt={8}
            pb={8}
            style={{
              fontWeight: 600,
            }}
            onClick={startEditing}
          >
            Edit Limit
          </Button>
        ) : (
          <>
            <Button info pt={8} pb={8} style={{ fontWeight: 600, flex: 1, transition: '0s' }} onClick={stopEditing}>
              Discard
            </Button>
            <Button info secondary pt={8} pb={8} style={{ fontWeight: 600, flex: 1, transition: '0s' }}>
              Save
            </Button>
          </>
        )}
      </Flex>
    </Flex>
  )
}
/*

#plan :

remove Card wrappers for CoverageLimit and PolicyBalance
make two components, one will be a div containing the two, the other will <><CustomContainers 1 & 2>Stuff</></>
Wrap everything in something that gives stuff props & setters, as well as submitters

CoverageLimit: <Card thinner>
PolicyBalance: <Card bigger horiz>

*/

// 18px 14px value pair
function ValuePair({
  bigText, // 18px
  smallText, // 14px
  info,
  bigger,
  mediumSized,
}: {
  bigText: string
  smallText: string
  info?: boolean
  bigger?: boolean
  mediumSized?: boolean
}) {
  return (
    <Flex
      gap={4}
      baseline
      style={
        {
          // justifyContent: 'space-between',
        }
      }
    >
      <Text t2s={!mediumSized} t2_5s={mediumSized} bold info={info}>
        {bigText}
      </Text>
      <Text t4s={bigger} bold info={info}>
        {smallText}
      </Text>
    </Flex>
  )
}

const ifStringZeroUndefined = (str: string) => (Number(str) === 0 ? undefined : str)

function PolicyBalance({
  portfolio,
  currentCoverageLimit,
  newCoverageLimit,
  referralCode,
  firstTime,
}: {
  portfolio: SolaceRiskScore | undefined
  currentCoverageLimit: BigNumber
  newCoverageLimit: BigNumber
  referralCode: string | undefined
  firstTime?: boolean
}) {
  // setters for usd and days
  const [doesReachMinReqAccountBal, setDoesReachMinReqAccountBal] = useState(false)

  const { ifDesktop } = useWindowDimensions()
  const { account, library } = useWallet()
  const { activeNetwork } = useNetwork()
  const { amount, isAppropriateAmount, handleInputChange, resetAmount } = useInputAmount()

  const [walletAssetBalance, setWalletAssetBalance] = useState<BigNumber>(ZERO)
  const [walletAssetDecimals, setWalletAssetDecimals] = useState<number>(0)

  const { deposit, withdraw, getMinRequiredAccountBalance, activatePolicy } = useFunctions()
  const { totalAccountBalance, personalBalance, earnedBalance } = useTotalAccountBalance(account)
  const { handleToast, handleContractCallError } = useTransactionExecution()

  const usdBalanceSum = useMemo(
    () =>
      portfolio && portfolio.protocols.length > 0
        ? portfolio.protocols.reduce((total, protocol) => (total += protocol.balanceUSD), 0)
        : 0,
    [portfolio]
  )

  const dailyRate = useMemo(() => (portfolio ? portfolio.current_rate / 365.25 : 0), [portfolio])

  const dailyCost = useMemo(() => {
    const numberifiedCurrentCoverageLimit = floatUnits(currentCoverageLimit, 18)
    if (usdBalanceSum < numberifiedCurrentCoverageLimit) return usdBalanceSum * dailyRate
    return numberifiedCurrentCoverageLimit * dailyRate
  }, [currentCoverageLimit, dailyRate, usdBalanceSum])

  const policyDuration = useMemo(() => (dailyCost > 0 ? floatUnits(totalAccountBalance, 18) / dailyCost : 0), [
    dailyCost,
    totalAccountBalance,
  ])

  const isAcceptableAmount = useMemo(() => isAppropriateAmount(amount, walletAssetDecimals, walletAssetBalance), [
    amount,
    walletAssetBalance,
    walletAssetDecimals,
  ])

  const callDeposit = async () => {
    if (!account) return
    await deposit(account, parseUnits(amount, 18))
      .then((res) => handleToast(res.tx, res.localTx))
      .catch((err) => handleContractCallError('callDeposit', err, FunctionName.SOTERIA_DEPOSIT))
  }

  const callWithdraw = async () => {
    if (!account) return
    await withdraw()
      .then((res) => handleToast(res.tx, res.localTx))
      .catch((err) => handleContractCallError('callWithdraw', err, FunctionName.SOTERIA_WITHDRAW))
  }

  const callActivatePolicy = async () => {
    if (!account) return
    await activatePolicy(account, newCoverageLimit, parseUnits(amount, 18), referralCode ?? '')
      .then((res) => handleToast(res.tx, res.localTx))
      .catch((err) => handleContractCallError('callActivatePolicy', err, FunctionName.SOTERIA_ACTIVATE))
  }

  const _handleInputChange = (_amount: string) => {
    handleInputChange(_amount, walletAssetDecimals, formatUnits(walletAssetBalance, walletAssetDecimals))
  }

  const _checkMinReqAccountBal = useDebounce(async () => {
    const minReqAccountBal = await getMinRequiredAccountBalance(newCoverageLimit)
    const bnAmount = BigNumber.from(accurateMultiply(amount, 18))
    setDoesReachMinReqAccountBal(personalBalance.add(bnAmount).gt(minReqAccountBal))
  }, 300)

  const _getAvailableFunds = useDebounce(async () => {
    if (!library || !account) return
    const tokenContract = new Contract(DAI_ADDRESS[activeNetwork.chainId], IERC20.abi, library)
    const balance = await queryBalance(tokenContract, account)
    const decimals = await queryDecimals(tokenContract)
    setWalletAssetBalance(balance)
    setWalletAssetDecimals(decimals)
  }, 300)

  useEffect(() => {
    _checkMinReqAccountBal()
  }, [newCoverageLimit, personalBalance, amount])

  useEffect(() => {
    _getAvailableFunds()
  }, [account, activeNetwork.chainId, library])

  return (
    <Flex
      col
      stretch
      gap={40}
      style={{
        width: '100%',
      }}
    >
      <Flex between itemsCenter>
        <Text t2 bold>
          Policy Balance
        </Text>
        <StyledTooltip id={'policy-balance'} tip={'Policy Balance'}>
          <QuestionCircle height={20} width={20} color={'#aaa'} />
        </StyledTooltip>
      </Flex>
      <Flex
        col
        between
        stretch
        gap={30}
        pl={ifDesktop(24)}
        pr={ifDesktop(24)}
        style={{
          height: '100%',
        }}
      >
        <Flex col gap={10} stretch>
          <StyledGrayBox>
            <Flex
              stretch
              gap={13}
              style={{
                width: '100%',
              }}
            >
              <Flex col gap={8}>
                <Text t4s bold>
                  Effective Balance
                </Text>
                <Flex gap={6}>
                  $
                  <Text t2s bold autoAlignVertical>
                    {truncateValue(formatUnits(totalAccountBalance, walletAssetDecimals), 2)}
                  </Text>
                </Flex>
              </Flex>
              <VerticalSeparator />
              <Flex
                col
                stretch
                gap={5.5}
                style={{
                  flex: 1,
                }}
              >
                <Flex between>
                  <Text t4s bold info>
                    Personal
                  </Text>
                  <Text t4s bold info>
                    {truncateValue(formatUnits(personalBalance, walletAssetDecimals), 2)} DAI
                  </Text>
                </Flex>
                <Flex between>
                  <Text t4s bold techygradient>
                    Bonus
                  </Text>
                  <Text t4s bold techygradient>
                    {truncateValue(formatUnits(earnedBalance, walletAssetDecimals), 2)} DAI
                  </Text>
                </Flex>
              </Flex>
            </Flex>
          </StyledGrayBox>
          {/* coverage price (dynamic): 0.00189 DAI/day; Approximate policy duration: 0 days */}
          <Flex pl={24} pr={24} mt={10} col gap={10}>
            <Flex between>
              <Text t4s>Coverage Price</Text>
              <Text t4s bold>
                {truncateValue(dailyCost, 5)}{' '}
                <Text t6s inline>
                  DAI/Day
                </Text>
              </Text>
            </Flex>
            <Flex between>
              <Text t4s>Approximate Policy Duration</Text>
              <Text t4s bold>
                {policyDuration}{' '}
                <Text t6s inline>
                  Days
                </Text>
              </Text>
            </Flex>
          </Flex>
          {/* <Flex gap={4} baseline justifyCenter>
              <Text t5s>Approximate policy duration:</Text>
              <Text t4s bold>
                185 Days
              </Text>
            </Flex> */}
        </Flex>
        <Flex col gap={20}>
          <GenericInputSection
            icon={<img src={DAI} height={20} />}
            onChange={(e) => _handleInputChange(e.target.value)}
            text="DAI"
            value={amount}
            disabled={false}
            displayIconOnMobile
          />
          <StyledSlider />
        </Flex>
        {firstTime ? (
          <Flex flex1 col stretch>
            <Button info secondary>
              Activate my policy
            </Button>
          </Flex>
        ) : (
          <Flex gap={20}>
            <Button
              info
              pl={ifDesktop(46.75)}
              pr={ifDesktop(46.75)}
              pt={8}
              pb={8}
              style={{
                fontWeight: 600,
                flex: 1,
              }}
            >
              Withdraw
            </Button>
            <Button
              info
              secondary
              pl={ifDesktop(46.75)}
              pr={ifDesktop(46.75)}
              pt={8}
              pb={8}
              style={{
                fontWeight: 600,
                flex: 1,
              }}
            >
              Deposit
            </Button>
          </Flex>
        )}
      </Flex>
    </Flex>
    // </Card>
  )
}

function CoverageActive() {
  const { deactivatePolicy } = useFunctions()
  const { account } = useWallet()
  const { isCooldownActive, cooldownLeft } = useCooldownDetails(account)
  const showCooldown = useMemo(() => isCooldownActive && cooldownLeft.gt(ZERO), [isCooldownActive, cooldownLeft])
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
            <Text t2s bold info={!isCooldownActive} warning={isCooldownActive}>
              {!isCooldownActive ? 'Active' : 'Inactive'}
            </Text>
          </Flex>
          {showCooldown && (
            <Flex gap={4}>
              <Text t5s bold>
                Cooldown:
              </Text>
              <Text info t5s bold>
                {getTimeFromMillis(cooldownLeft.toNumber())}
              </Text>
            </Flex>
          )}
        </Flex>
        <Flex between itemsCenter>
          {/* <ToggleSwitch
            id="bird"
            toggled={!isCooldownActive}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCoverageActive(e.target.checked)}
          /> */}
        </Flex>
      </Flex>
    </Card>
  )
}

function ReferralSection({
  referralCode,
  setReferralCode,
  userCanRefer,
}: {
  referralCode: string | undefined
  setReferralCode: (referralCode: string | undefined) => void
  userCanRefer: boolean
}) {
  const [formReferralCode, setFormReferralCode] = useState('')
  return (
    <Card normous horiz>
      {/* top part / title */}
      {/* <Flex col stretch between> */}
      <Flex
        stretch
        col
        style={{
          width: '100%',
        }}
        gap={userCanRefer ? 40 : 0}
      >
        <Flex between itemsCenter>
          <Text t2 bold techygradient>
            Bonuses
          </Text>
          <StyledTooltip id={'coverage-price'} tip={'ReferralSection - Bonuses tooltip'}>
            <QuestionCircle height={20} width={20} color={'#aaa'} />
          </StyledTooltip>
        </Flex>
        <Flex col flex1 gap={40} stretch justifyCenter>
          {userCanRefer && (
            <Flex col gap={10} stretch>
              <Text t4s>Get more bonuses for everyone who gets coverage via your referral link:</Text>
              <Text t4s bold techygradient>
                solace.fi/referral/s37asodfkj1o3ig...{' '}
                <TechyGradientCopy
                  style={{
                    height: '14px',
                    width: '14px',
                  }}
                />
              </Text>
            </Flex>
          )}
          <Flex col gap={10} stretch>
            {!referralCode ? (
              <Text t4s>
                <Text t4s inline bold techygradient>
                  Got a promo code?
                </Text>{' '}
                Enter here to claim:
              </Text>
            ) : (
              <Text t4s techygradient bold>
                Your referral link is applied.
                <br />
                You&apos;ll be able to use Bonus DAI after you activate your policy.
              </Text>
            )}
            <GenericInputSection
              onChange={(e) => setFormReferralCode(e.target.value)}
              value={formReferralCode}
              disabled={false}
              displayIconOnMobile
              placeholder={referralCode ?? 'Enter your referral code'}
              buttonOnClick={() => setReferralCode(formReferralCode)}
              buttonText="Apply"
            />
          </Flex>
        </Flex>
      </Flex>
      {/* </Flex> */}
    </Card>
  )
}

function PortfolioTable({ portfolio }: { portfolio: SolaceRiskScore | undefined }) {
  const { width } = useWindowDimensions()

  return (
    <>
      {width > BKPT_5 ? (
        <Table>
          <TableHead>
            <TableHeader>Protocol</TableHeader>
            <TableHeader>Type</TableHeader>
            <TableHeader>Amount</TableHeader>
            <TableHeader>Risk Level</TableHeader>
          </TableHead>
          <TableBody>
            {portfolio &&
              portfolio.protocols.map((d: SolaceRiskProtocol) => (
                <TableRow key={d.network}>
                  <TableData>{capitalizeFirstLetter(d.network)}</TableData>
                  <TableData>{d.category}</TableData>
                  <TableData>{d.balanceUSD}</TableData>
                  <TableData>{d.tier}</TableData>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      ) : (
        <Flex column gap={30}>
          {portfolio &&
            portfolio.protocols.map((row) => (
              <GrayBgDiv
                key={row.network}
                style={{
                  borderRadius: '10px',
                  padding: '14px 24px',
                }}
              >
                <Flex gap={30} between itemsCenter>
                  <Flex col gap={8.5}>
                    <div>{row.network}</div>
                  </Flex>
                  <Flex
                    col
                    gap={8.5}
                    style={{
                      textAlign: 'right',
                    }}
                  >
                    <div>{row.category}</div>
                    <div>{row.balanceUSD}</div>
                    <div>{row.tier}</div>
                  </Flex>
                </Flex>
              </GrayBgDiv>
            ))}
        </Flex>
      )}
    </>
  )
}

enum ReferralSource {
  'Custom',
  'Standard',
  'StakeDAO',
}

enum FormStages {
  'Welcome',
  'InitialSetup',
  'RegularUser',
}

function WelcomeMessage({ type, goToSecondStage }: { type: ReferralSource; goToSecondStage: () => void }): JSX.Element {
  const handleClick = () => goToSecondStage()
  switch (type) {
    case ReferralSource.Custom:
      return (
        <Card>
          <Flex col gap={30} itemsCenter>
            <Text t2s>When the flies fly they do unfly</Text>
            <Flex col gap={10} itemsCenter>
              <Text t5s>The table below is a list of your funds in protocols available for coverage.</Text>
              <Text t5s>By subscribing to Solace Wallet Coverage, all funds in the list are covered.</Text>
              <Text t5s italics>
                <Text bold inline t5s>
                  Tip:
                </Text>{' '}
                all future changes to your portfolio are also covered automatically.
              </Text>
            </Flex>
            <Button info secondary pl={23} pr={23} onClick={goToSecondStage}>
              Sounds good, what&apos;s next?
            </Button>
          </Flex>
        </Card>
      )
    case ReferralSource.Standard:
      return (
        <Card>
          <Flex col gap={30} itemsCenter>
            <Text t2s>When the flies fly they do unfly</Text>
            <Flex col gap={10} itemsCenter>
              <Text t5s>The table below is a list of your funds in protocols available for coverage.</Text>
              <Text t5s>By subscribing to Solace Wallet Coverage, all funds in the list are covered.</Text>
              <Text t5s italics>
                <Text bold inline t5s>
                  Tip:
                </Text>{' '}
                all future changes to your portfolio are also covered automatically.
              </Text>
            </Flex>
            <Button info secondary pl={23} pr={23} onClick={goToSecondStage}>
              Sounds good, what&apos;s next?
            </Button>
          </Flex>
        </Card>
      )
    case ReferralSource.StakeDAO:
      return (
        <Card>
          <Flex col gap={30} itemsCenter>
            <Text t2s>When the flies fly they do unfly</Text>
            <Flex col gap={10} itemsCenter>
              <Text t5s>The table below is a list of your funds in protocols available for coverage.</Text>
              <Text t5s>By subscribing to Solace Wallet Coverage, all funds in the list are covered.</Text>
              <Text t5s italics>
                <Text bold inline t5s>
                  Tip:
                </Text>{' '}
                all future changes to your portfolio are also covered automatically.
              </Text>
            </Flex>
            <Button info secondary pl={23} pr={23} onClick={goToSecondStage}>
              Sounds good, what&apos;s next?
            </Button>
          </Flex>
        </Card>
      )
  }
}

export default function Soteria(): JSX.Element {
  const { referralCode: referralCodeFromStorage } = useGeneral()
  const { account } = useWallet()

  const portfolio = usePortfolio('0x09748f07b839edd1d79a429d3ad918f670d602cd', 1)
  const { isMobile } = useWindowDimensions()
  const { policyId, status, coverageLimit } = useCheckIsCoverageActive(account)

  const currentCoverageLimit = useMemo(() => coverageLimit, [coverageLimit])
  const firstTime = useMemo(() => policyId.isZero(), [policyId])

  const [referralType, setReferralType] = useState<ReferralSource>(ReferralSource.Standard)
  const [formStage, setFormStage] = useState<FormStages>(FormStages.Welcome)
  const goToSecondStage = () => setFormStage(FormStages.InitialSetup)
  const [referralCode, setReferralCode] = useState<string | undefined>(undefined)
  const [newCoverageLimit, setNewCoverageLimit] = useState<BigNumber>(ZERO)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    if (firstTime) {
      setIsEditing(true)
    }
  }, [firstTime])

  useEffect(() => {
    if (referralCodeFromStorage) setReferralCode(referralCodeFromStorage)
  }, [referralCodeFromStorage])

  return (
    <Flex col gap={24} m={isMobile ? 20 : undefined}>
      {firstTime && formStage === FormStages.Welcome ? (
        <WelcomeMessage type={referralType} goToSecondStage={goToSecondStage} />
      ) : (
        <Flex gap={24} col={isMobile}>
          {/* <RaisedBox>
            <Flex gap={24}> */}
          {!firstTime ? (
            <>
              <Card thinner>
                <CoverageLimit
                  currentCoverageLimit={currentCoverageLimit}
                  newCoverageLimit={newCoverageLimit}
                  setNewCoverageLimit={setNewCoverageLimit}
                  referralCode={referralCode}
                  isEditing={isEditing}
                  portfolio={portfolio}
                  setIsEditing={setIsEditing}
                />{' '}
              </Card>
              <Card bigger horiz>
                <PolicyBalance
                  portfolio={portfolio}
                  currentCoverageLimit={currentCoverageLimit}
                  newCoverageLimit={newCoverageLimit}
                  referralCode={referralCode}
                />
              </Card>
            </>
          ) : (
            // <>
            <Card firstTime horiz noPadding gap={24}>
              <Card innerThinner noShadow>
                <CoverageLimit
                  currentCoverageLimit={currentCoverageLimit}
                  newCoverageLimit={newCoverageLimit}
                  setNewCoverageLimit={setNewCoverageLimit}
                  referralCode={referralCode}
                  isEditing={isEditing}
                  portfolio={portfolio}
                  setIsEditing={setIsEditing}
                  firstTime
                />
              </Card>{' '}
              <Card innerBigger noShadow>
                <PolicyBalance
                  portfolio={portfolio}
                  currentCoverageLimit={currentCoverageLimit}
                  newCoverageLimit={newCoverageLimit}
                  referralCode={referralCode}
                  firstTime
                />
              </Card>
            </Card>
            // </>
          )}

          {/* </Flex>
          </RaisedBox> */}
          <Flex
            col
            stretch
            gap={24}
            style={{
              flex: '0.8',
            }}
          >
            <CoverageActive />
            <ReferralSection userCanRefer={status} referralCode={referralCode} setReferralCode={setReferralCode} />
          </Flex>
        </Flex>
      )}
      <Card>
        <Text t2 bold>
          Portfolio Details
        </Text>
        {isMobile && (
          <Flex pl={24} pr={24} pt={10} pb={10} between mt={20} mb={10}>
            <Text bold t4s>
              Sort by
            </Text>
            <Text bold t4s>
              Amount
            </Text>
          </Flex>
        )}
        <PortfolioTable portfolio={portfolio} />
      </Card>
    </Flex>
  )
}
