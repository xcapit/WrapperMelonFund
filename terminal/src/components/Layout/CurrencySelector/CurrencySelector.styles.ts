import styled from 'styled-components';
import { SelectField as BaseSelectField } from '~/components/Form/Select/Select';

export const CurrencySelect = styled.div`
  min-width: 54px;
  float: left;

  .melon__value-container {
    padding: 2px 2px;
  }

  .melon__dropdown-indicator {
    padding: 0px;
  }

  .melon__indicator-separator {
    display: none;
  }

  @media (${(props) => props.theme.mediaQueries.s}) {
    min-width: 90px;

    .melon__value-container {
      padding: 2px 8px;
    }

    .melon__dropdown-indicator {
      padding: 0px 8px;
    }

    .melon__indicator-separator {
      display: flex;
    }
  }
`;
