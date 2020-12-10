import React from 'react';
import { Link as BaseLink, NavLink as BaseNavLink } from 'react-router-dom';

function createComponent<T = {}>(Component: React.ComponentType<T>): React.FC<T> {
  return ({ ...props }) => {
    const forwards = props as T;

    return <Component {...forwards} />;
  };
}

export const Link = createComponent(BaseLink);
export const NavLink = createComponent(BaseNavLink);
