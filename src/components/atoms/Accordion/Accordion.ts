import styled from 'styled-components'

import { CustomScrollbar } from '../Layout'

type AccordionProps = {
  isOpen: boolean
}

export const Accordion = styled.div<AccordionProps>`
  max-height: ${(props) => (props.isOpen ? '70vh' : '0vh')};
  transition: all 200ms ease;
  overflow-y: scroll;
  color: ${({ theme }) => theme.accordion.color}};
  background-color: ${({ theme }) => theme.accordion.bg_color}};
  ${CustomScrollbar};
`