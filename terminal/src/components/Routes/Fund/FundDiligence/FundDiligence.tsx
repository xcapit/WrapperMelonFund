import * as React from 'react';
import { SectionTitle } from '~/storybook/Title/Title';
import { Block } from '~/storybook/Block/Block';
import { FundContracts } from './FundContracts/FundContracts';
import { FundFinancials } from './FundFinancials/FundFinancials';
import { FundFactSheet } from './FundFactSheet/FundFactSheet';
import FundPolicies from './FundPolicies/FundPolicies';
import { FundTradeHistory } from './FundTradeHistory/FundTradeHistory';
import { FundInvestmentHistory } from './FundInvestmentHistory/FundInvestmentHistory';
import { AccordionSection } from '~/storybook/Accordion/Accordion';

export interface FundDiligenceProps {
  address: string;
}

type DiligenceSection = 'facts' | 'financials' | 'contracts' | 'ruleset' | 'tradeHistory' | 'investmentHistory';

export const FundDiligence: React.FC<FundDiligenceProps> = ({ address }) => {
  const [activeSections, setActiveSections] = React.useState<DiligenceSection[]>([]);

  const sectionHandler = (section: DiligenceSection) => {
    if (activeSections.includes(section)) {
      const newActiveSections = activeSections.filter((item) => item !== section);
      setActiveSections(newActiveSections);
    } else {
      const newActiveSections: DiligenceSection[] = activeSections.concat([section]);
      setActiveSections(newActiveSections);
    }
  };

  return (
    <Block>
      <SectionTitle>Fund Diligence</SectionTitle>
      <AccordionSection
        label="Fact Sheet"
        value="facts"
        activeSections={activeSections}
        sectionSelector={sectionHandler}
      />
      {activeSections.includes('facts') && <FundFactSheet address={address} />}
      <AccordionSection
        label="Financials"
        value="financials"
        activeSections={activeSections}
        sectionSelector={sectionHandler}
      />
      {activeSections.includes('financials') && <FundFinancials address={address} />}
      <AccordionSection
        label="Contracts"
        value="contracts"
        activeSections={activeSections}
        sectionSelector={sectionHandler}
      />
      {activeSections.includes('contracts') && <FundContracts address={address} />}
      <AccordionSection
        label="Ruleset"
        value="ruleset"
        activeSections={activeSections}
        sectionSelector={sectionHandler}
      />
      {activeSections.includes('ruleset') && <FundPolicies address={address} />}
      <AccordionSection
        label="Trade History"
        value="tradeHistory"
        activeSections={activeSections}
        sectionSelector={sectionHandler}
      />
      {activeSections.includes('tradeHistory') && <FundTradeHistory address={address} />}
      <AccordionSection
        label="Investment History"
        value="investmentHistory"
        activeSections={activeSections}
        sectionSelector={sectionHandler}
      />
      {activeSections.includes('investmentHistory') && <FundInvestmentHistory address={address} />}
    </Block>
  );
};
