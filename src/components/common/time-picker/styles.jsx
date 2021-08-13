import styled from "styled-components";
import { TimePicker } from "./TimePicker";

export const StyledTimePicker = styled(TimePicker)`
  box-sizing: initial;

  &.rc-time-picker {
    padding: 0;
    height: auto;
    display: flex;
    align-items: center;
    cursor: pointer;

    & .rc-time-picker-input {
      box-sizing: initial;
      background: none;
      border: none;
      padding: 11px 14px;
      position: relative;
      height: 1.1876em;
      color: inherit;
      font: inherit;

      &::placeholder {
        color: inherit;
        opacity: 0.5;
      }
    }

    & .rc-time-picker-clear {
      display: none;
    }
  }

  &.rc-time-picker-panel {
    width: auto;
    max-width: inherit;

    & .rc-time-picker-panel-inner {
      position: absolute;
      left: 50px;
      width: 200px;
      top: -50px;

      background-color: #134378;
      border: none;
      box-shadow: 0px 5px 5px -3px rgb(0 0 0 / 20%),
        0px 8px 10px 1px rgb(0 0 0 / 14%), 0px 3px 14px 2px rgb(0 0 0 / 12%);

      & .rc-time-picker-panel-input-wrap {
        border-bottom: none;
        display: flex;

        & .rc-time-picker-panel-input {
          box-sizing: initial;
          background: none;
          border: none;
          padding: 11px 14px;
          position: relative;
          height: 1.1876em;
          color: inherit;
          font: inherit;
          border: 1px solid rgba(255, 255, 255, 0.23);
          border-radius: 4px;
          font-size: 16px;

          &::placeholder {
            color: inherit;
            opacity: 0.5;
          }
        }
      }

      & .rc-time-picker-panel-combobox {
        display: flex;
        justify-content: center;
        padding: 0.5rem 0;

        & .rc-time-picker-panel-select {
          border: none;
          font-size: 1rem;
          max-height: 192px;
          float: inherit;
          margin: 0 0.5rem;
          scrollbar-width: none;
          &::-webkit-scrollbar {
            display: none;
          }

          & li {
            height: 32px;
            padding: 0 16px;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          & li:hover {
            background-color: rgba(255, 255, 255, 0.08);
          }

          & li.rc-time-picker-panel-select-option-selected {
            background-color: rgba(255, 255, 255, 0.08);
          }
        }
      }
    }
  }
`;
