import React from 'react';
import * as S from './ZoomControl.styles';
import { useWindowSize } from 'react-use';
import { subDays, subWeeks, subMonths, startOfYear } from 'date-fns';
import { findCorrectFromTime } from '~/utils/priceServiceDates';
import { Depth } from '~/components/Charts/types';

interface ZoomOption {
  value: Depth | number;
  label: string;
  display: boolean;
  disabled?: boolean | undefined;
  timestamp?: number;
}

export interface ZoomControlProps {
  depth: Depth | number;
  setDepth: (depth: number | Depth) => void;
  inception: Date;
}

export const ZoomControl: React.FC<ZoomControlProps> = (props) => {
  const today = new Date();
  const size = useWindowSize();

  const options = React.useMemo<ZoomOption[]>(() => {
    const options: ZoomOption[] = [
      {
        label: '1d',
        value: '1d',
        timestamp: subDays(today, 1).getTime(),
        display: true,
      },
      {
        label: '1w',
        value: '1w',
        timestamp: subWeeks(today, 1).getTime(),
        display: true,
      },
      {
        label: '1m',
        value: '1m',
        timestamp: subMonths(today, 1).getTime(),
        display: true,
      },
      {
        label: '3m',
        value: '3m',
        timestamp: subMonths(today, 3).getTime(),
        display: size.width > 400,
      },
      {
        label: '1y',
        value: '1y',
        timestamp: subMonths(today, 12).getTime(),
        display: size.width > 400,
      },
      {
        label: 'YTD',
        value: findCorrectFromTime(startOfYear(today)),
        display: true,
      },
      {
        label: 'All Time',
        value: findCorrectFromTime(props.inception),
        display: true,
      },
    ];

    return options
      .filter((item) => item.display)
      .map((item) => ({
        ...item,
        disabled: props.inception && item.timestamp ? item.timestamp < props.inception.getTime() : undefined,
      }));
  }, [props.depth, size.width]);

  return (
    <S.ControlBox>
      {size.width > 500 ? 'Zoom: ' : null}

      {options.map((item, index) => (
        <S.ChartButton
          kind={item.value === props.depth ? 'success' : 'secondary'}
          disabled={item.disabled}
          size="small"
          key={index}
          onClick={() => props.setDepth(item.value)}
        >
          {item.label}
        </S.ChartButton>
      ))}
    </S.ControlBox>
  );
};
