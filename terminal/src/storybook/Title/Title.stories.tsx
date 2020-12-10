import React from 'react';
import { Title, SectionTitle } from './Title';

export default { title: 'Atoms|Title' };

export const Default: React.FC = () => <Title>h1 Title</Title>;

export const Section: React.FC = () => <SectionTitle>h2 Section Title</SectionTitle>;
