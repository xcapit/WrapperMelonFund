import { useState, useEffect } from 'react';

export interface TelegramStatusData {
  address: string;
  authenticated: boolean;
  bot: string;
}

export interface TelegramStatus {
  state: 'idle' | 'loading';
  data?: TelegramStatusData;
  error?: string;
}

// TODO: Use react-query.
export const useTelegramStatus = (address?: string) => {
  const [state, setState] = useState<TelegramStatus>({ state: 'idle', error: undefined, data: undefined });
  useEffect(() => {
    if (!address) {
      return;
    }

    (async () => {
      try {
        setState({ state: 'loading', error: undefined, data: undefined });
        const url = `${process.env.MELON_TELEGRAM_API}/api/status?address=${address}`;
        const result = await fetch(url);
        const json = (await result.json()) as TelegramStatusData;
        setState({ state: 'idle', data: json, error: undefined });
      } catch (e) {
        setState({ state: 'idle', error: 'An unknown error occurred.', data: undefined });
      }
    })();
  }, [address]);

  return [state, setState] as [typeof state, typeof setState];
};
