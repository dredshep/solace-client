import { TransactionCondition, SystemNotice, Error } from '../enums'

export type WindowDimensions = {
  width: number
  height: number
  isDesktop: boolean
  isMobile: boolean
  ifDesktop: <T, V>(desktopArg: T, mobileArg?: V | undefined) => T | V | undefined
  ifMobile: <T, V>(mobileArg: T, desktopArg?: V | undefined) => T | V | undefined
}

export type LocalTx = {
  hash: any
  type: string
  status: TransactionCondition
}

export type TxResult = {
  tx: any | null
  localTx: LocalTx | null
}

export type ErrorData = {
  type: Error
  metadata: string
  uniqueId: string
}

export type SystemNoticeData = {
  type: SystemNotice
  metadata: string
  uniqueId: string
}

export type PageInfo = {
  name: string
  to: string
  icon: JSX.Element
  component: () => any
}
