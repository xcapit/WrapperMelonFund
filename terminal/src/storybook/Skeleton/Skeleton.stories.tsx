import React from 'react';
import { Skeleton, SkeletonHead, SkeletonBody, SkeletonFeet } from './Skeleton';
import { Default as Header } from '../Header/Header.stories';
import { Default as Footer } from '../Footer/Footer.stories';
import { Bar, BarContent } from '../Bar/Bar';
import { NotificationBar, NotificationContent } from '../NotificationBar/NotificationBar';
import { Headline } from '../Headline/Headline';
import { Container } from '../Container/Container';
import {
  FundLayout as ComplexGridSample,
  TwoColumns as SimpleGridSample,
  WithoutBlocks as NoBlockGridSample,
} from '../Grid/Grid.stories';

export default { title: 'Layouts|Skeleton' };

export const Deafult: React.FC = () => {
  return (
    <Skeleton>
      <SkeletonHead>
        <div>Header here</div>
      </SkeletonHead>
      <SkeletonBody>
        <div>App content here</div>
      </SkeletonBody>
      <SkeletonFeet>
        <div>Footer here</div>
      </SkeletonFeet>
    </Skeleton>
  );
};

export const Debug: React.FC = () => {
  return (
    <Skeleton>
      <SkeletonHead debug={true}>
        <div>Header here</div>
      </SkeletonHead>
      <SkeletonBody debug={true}>
        <div>App content here</div>
      </SkeletonBody>
      <SkeletonFeet debug={true}>
        <div>Footer here</div>
      </SkeletonFeet>
    </Skeleton>
  );
};

export const WithBlocksContained: React.FC = () => {
  return (
    <Skeleton>
      <SkeletonHead>
        <Header />
      </SkeletonHead>
      <SkeletonBody>
        <Bar>
          <BarContent justify="between">
            <Headline title="My title" text="My subtitle" icon="WALLET" />
          </BarContent>
        </Bar>
        <Container>
          <SimpleGridSample />
        </Container>
      </SkeletonBody>
      <SkeletonFeet>
        <Footer />
      </SkeletonFeet>
    </Skeleton>
  );
};

export const WithBlocksFull: React.FC = () => {
  return (
    <Skeleton>
      <SkeletonHead>
        <Header />
      </SkeletonHead>
      <SkeletonBody>
        <Bar>
          <BarContent justify="between">
            <Headline title="My title" text="My subtitle" icon="WALLET" />
          </BarContent>
        </Bar>
        <Container full={true}>
          <ComplexGridSample />
        </Container>
      </SkeletonBody>
      <SkeletonFeet>
        <Footer />
      </SkeletonFeet>
    </Skeleton>
  );
};

export const WithotSecondaryBar: React.FC = () => {
  return (
    <Skeleton>
      <SkeletonHead>
        <Header />
      </SkeletonHead>
      <SkeletonBody>
        <NotificationBar kind="error" size="small">
          <NotificationContent>
            <span>This fund is shut down</span>
          </NotificationContent>
        </NotificationBar>
        <Container>
          <NoBlockGridSample />
        </Container>
      </SkeletonBody>
      <SkeletonFeet>
        <Footer />
      </SkeletonFeet>
    </Skeleton>
  );
};
