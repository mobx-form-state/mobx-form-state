import styled, { css } from 'styled-components';
import { ComponentPropsWithRef } from 'react';

export type BoxProps = ComponentPropsWithRef<'div'> & {
  column?: boolean;
  gap?: number;
  columnGap?: number;
  rowGap?: number;
  justifyCenter?: boolean;
  justifyBetween?: boolean;
  justifyEnd?: boolean;
  alignCenter?: boolean;
  alignEnd?: boolean;
  baseline?: boolean;
  flex?: number | string;
  block?: boolean;
  flexWrap?: boolean;
  height?: string;
};

export const Box = styled.div<BoxProps>`
  display: flex;

  ${({ block }) =>
    block &&
    css`
      display: block;
    `}

  ${({ column }) =>
    column &&
    css`
      flex-direction: column;
    `}

  ${({ gap }) =>
    gap &&
    css`
      gap: ${gap}px;
    `}

  ${({ columnGap }) =>
    columnGap &&
    css`
      column-gap: ${columnGap}px;
    `}

  ${({ rowGap }) =>
    rowGap &&
    css`
      row-gap: ${rowGap}px;
    `}

  ${({ justifyCenter }) =>
    justifyCenter &&
    css`
      justify-content: center;
    `}

    ${({ justifyBetween }) =>
    justifyBetween &&
    css`
      justify-content: space-between;
    `}

    ${({ alignCenter }) =>
    alignCenter &&
    css`
      align-items: center;
    `}

    ${({ alignEnd }) =>
    alignEnd &&
    css`
      align-items: flex-end;
    `}

    ${({ baseline }) =>
    baseline &&
    css`
      align-items: baseline;
    `}

    ${({ justifyEnd }) =>
    justifyEnd &&
    css`
      justify-content: flex-end;
    `}

    ${({ flexWrap }) =>
    flexWrap &&
    css`
      flex-wrap: wrap;
    `}


    ${({ flex }) =>
    flex &&
    css`
      flex: ${flex};
    `}

    ${({ height }) =>
    height &&
    css`
      height: ${height};
    `}
`;
