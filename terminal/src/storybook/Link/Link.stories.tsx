import React from 'react';
import { Link, NavLink } from './Link';

export default { title: 'Atoms|Link' };

export const Default = () => <Link to="/">default link</Link>;

export const NavigationLink = () => <NavLink to="/">navigation link</NavLink>;
