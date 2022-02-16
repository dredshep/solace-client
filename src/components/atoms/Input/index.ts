import styled, { css } from 'styled-components'
import { GeneralTextProps, GeneralTextCss, Text4Css } from '../Typography'
import { GeneralElementProps, GeneralElementCss } from '../../generalInterfaces'
import { Slider } from '@rebass/forms'

const InputCss = css`
  ::placeholder {
    color: ${({ theme }) => theme.input.color};
    opacity: 0.5;
  }
  background-color: ${({ theme }) => theme.input.bg_color};
  border: 1px solid ${({ theme }) => theme.input.border_color};
  outline: none;
  color: ${({ theme }) => theme.input.color};
`

export const Input = styled.input<GeneralElementProps & GeneralTextProps>`
  ${InputCss}
  ::-webkit-calendar-picker-indicator {
    display: none;
  }
  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  ::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  padding: 4px 8px;
  border-radius: 10px;
  line-height: 19px;
  &:read-only {
    border-color: rgba(0, 0, 0, 0);
  }
  ${Text4Css}
  ${GeneralTextCss}
  ${GeneralElementCss}
`

export const Search = styled.input`
  ${InputCss}
  ::-webkit-search-cancel-button {
    -webkit-appearance: none;
    height: 1em;
    width: 1em;
    border-radius: 50em;
    background: url(https://pro.fontawesome.com/releases/v5.10.0/svgs/solid/times-circle.svg) no-repeat 50% 50%;
    background-size: contain;
    opacity: 0;
    pointer-events: none;
    filter: invert(1);
  }
  :focus::-webkit-search-cancel-button {
    opacity: 1;
    pointer-events: all;
    cursor: pointer;
  }
  border-radius: 30px;
  padding: 10px 20px;
  font-family: 'Open Sans', sans-serif;
`

export const StyledSlider = styled(Slider)<{ disabled?: boolean; theme?: any; custom1?: boolean }>`
  background-color: ${({ theme }) => theme.input.slider_color} !important;
  color: ${({ theme }) => theme.input.slider_node_color} !important;
  ${({ disabled }) =>
    disabled &&
    css`
      opacity: 0.5;
      cursor: default;
      &:hover {
        cursor: default;
      }
    `}
  ${({ custom1 }) => {
    // 8px with cross-browser support for firefox and chromium
    return (
      custom1 &&
      css`
        margin-top: 20px;
        -webkit-appeareance: none;
        height: 20px;
        background-color: red;
        &::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: ${({ theme }) => theme.input.slider_node_color} !important;
          cursor: pointer;
          border: 1px solid ${({ theme }) => theme.input.slider_node_color} !important;
        }
        &::-moz-range-thumb {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: ${({ theme }) => theme.input.slider_node_color} !important;
          cursor: pointer;
          border: 1px solid ${({ theme }) => theme.input.slider_node_color} !important;
        }
        &::-ms-thumb {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: ${({ theme }) => theme.input.slider_node_color} !important;
          cursor: pointer;
          border: 1px solid ${({ theme }) => theme.input.slider_node_color} !important;
        }
        &::-moz-focus-outer {
          border: 0;
        }
      `
    )
  }}
`
