import React from 'react';
import { Container } from './Container';

export default { title: 'Layouts|Container' };

export const Default: React.FC = () => <Container />;

export const Full: React.FC = () => <Container full={true} />;
