/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentPropsWithoutRef, ComponentType, createElement } from 'react';
import { To, useLinkClickHandler, useMatch, useResolvedPath } from 'react-router-dom';

export type NavLinkProps<AsC extends React.ComponentType> = ComponentPropsWithoutRef<AsC> & {
  as: AsC;
  to: To;
  end?: boolean;
};

export const NavLink = <AsC extends ComponentType<any>>({
  as,
  to,
  end,
  ...rest
}: ComponentPropsWithoutRef<AsC> & NavLinkProps<AsC>) => {
  const resolved = useResolvedPath(to);
  const match = useMatch({ path: resolved.pathname, end });
  const handleClick = useLinkClickHandler(to);

  const isActive = Boolean(match);

  return createElement(as, { selected: isActive, onClick: handleClick, ...rest });
};
