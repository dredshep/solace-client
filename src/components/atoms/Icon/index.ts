import styled, { css } from 'styled-components'
import { Menu } from '@styled-icons/boxicons-regular/Menu'
import { Checkmark } from '@styled-icons/evaicons-solid/Checkmark'
import { Warning } from '@styled-icons/fluentui-system-regular/Warning'
import { History } from '@styled-icons/boxicons-regular/History'
import { Wallet } from '@styled-icons/boxicons-solid/Wallet'
import { NetworkChart } from '@styled-icons/boxicons-regular/NetworkChart'
import { Info } from '@styled-icons/fluentui-system-regular/Info'
import { LinkExternal } from '@styled-icons/boxicons-regular/LinkExternal'
import { ArrowDropDown } from '@styled-icons/remix-line/ArrowDropDown'
import { DarkTheme } from '@styled-icons/fluentui-system-regular/DarkTheme'
import { DarkMode } from '@styled-icons/material-outlined/DarkMode'
import { Sun } from '@styled-icons/evaicons-solid/Sun'
import { DotsHorizontalRounded } from '@styled-icons/boxicons-regular/DotsHorizontalRounded'
import { Discord } from '@styled-icons/simple-icons/Discord'
import { Twitter } from '@styled-icons/boxicons-logos/Twitter'
import { Github } from '@styled-icons/boxicons-logos/Github'
import { Medium } from '@styled-icons/boxicons-logos/Medium'
import { Documents } from '@styled-icons/ionicons-sharp/Documents'
import { DocumentText } from '@styled-icons/typicons/DocumentText'
import { Work } from '@styled-icons/material/Work'
import { Copy } from '@styled-icons/boxicons-regular/Copy'
import { Dashboard } from '@styled-icons/material/Dashboard'
import { FileShield } from '@styled-icons/remix-fill/FileShield'
import { CoinStack } from '@styled-icons/boxicons-solid/CoinStack'
import { PeopleCommunity } from '@styled-icons/fluentui-system-filled/PeopleCommunity'
import { FileEarmarkLock2Fill } from '@styled-icons/bootstrap/FileEarmarkLock2Fill'
import { Gear } from '@styled-icons/octicons/Gear'
import { GraphDown } from '@styled-icons/bootstrap/GraphDown'
import { SendPlane } from '@styled-icons/remix-fill/SendPlane'

export const StyledIconCss = css`
  margin: auto;
  display: block;
`

export const StyledHistory = styled(History)`
  display: block;
`

export const StyledWallet = styled(Wallet)`
  display: block;
`

export const StyledNetworkChart = styled(NetworkChart)`
  display: block;
`

export const StyledDots = styled(DotsHorizontalRounded)`
  margin: auto 0;
  display: block;
`

export const StyledInfo = styled(Info)``

export const StyledDashboard = styled(Dashboard)``

export const StyledFileShield = styled(FileShield)``

export const StyledCoinStack = styled(CoinStack)``

export const StyledCommunity = styled(PeopleCommunity)``

export const StyledDiscord = styled(Discord)``

export const StyledTwitter = styled(Twitter)``

export const StyledGithub = styled(Github)``

export const StyledMedium = styled(Medium)``

export const StyledDocuments = styled(Documents)``

export const StyledDocumentText = styled(DocumentText)``

export const StyledWork = styled(Work)``

export const StyledSun = styled(Sun)``

export const StyledMoon = styled(DarkMode)``

export const StyledTheme = styled(DarkTheme)``

export const StyledArrowDropDown = styled(ArrowDropDown)``

export const StyledCopy = styled(Copy)``

export const StyledLinkExternal = styled(LinkExternal)``

export const StyledLockFile = styled(FileEarmarkLock2Fill)``

export const StyledMenu = styled(Menu)`
  ${StyledIconCss}
`

export const StyledCheckmark = styled(Checkmark)`
  ${StyledIconCss}
`

export const StyledWarning = styled(Warning)`
  ${StyledIconCss}
`

export const StyledGear = styled(Gear)``

export const StyledGraphDown = styled(GraphDown)``

export const StyledSendPlane = styled(SendPlane)``
