import styled from 'styled-components'

type AccordionProps = {
  isOpen: boolean
  noScroll?: boolean
  noBackgroundColor?: boolean
  customHeight?: string
}

export const Accordion = styled.div<AccordionProps>`
  max-height: ${(props) => (props.isOpen ? props.customHeight ?? '70vh' : '0vh')};
  transition: max-height 200ms ease;
  color: ${({ theme }) => theme.accordion.color}};
  ${(props) => !props.noBackgroundColor && `background-color: ${props.theme.accordion.bg_color};`}
  overflow-y: hidden;
  ${(props) => (props.noScroll ? null : `overflow-y: auto;`)}
  border-radius: 10px;
`
