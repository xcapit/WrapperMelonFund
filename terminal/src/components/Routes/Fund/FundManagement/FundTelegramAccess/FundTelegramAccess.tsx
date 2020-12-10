import React from 'react';
import { Block } from '~/storybook/Block/Block';
import { SectionTitle } from '~/storybook/Title/Title';
import { useEnvironment } from '~/hooks/useEnvironment';
import { useAccount } from '~/hooks/useAccount';
import { useTelegramStatus } from '~/hooks/useTelegramStatus';
import { Spinner } from '~/storybook/Spinner/Spinner';
import { useConnectionState } from '~/hooks/useConnectionState';
import { TelegramLogin } from '~/components/Common/TelegramLogin/TelegramLogin';
import { useIsMounted } from '~/hooks/useIsMounted';
import { LinkButton } from '~/components/Form/Button/Button.styles';
import { NotificationBar, NotificationContent } from '~/storybook/NotificationBar/NotificationBar';

export const FundTelegramAccess: React.FC = () => {
  const mounted = useIsMounted();
  const environment = useEnvironment()!;
  const connection = useConnectionState();
  const account = useAccount();
  const [status, setStatus] = useTelegramStatus(account.address);

  const handleAuth = React.useCallback(
    async (user) => {
      try {
        setStatus((previous) => ({ ...previous, state: 'loading', error: undefined }));

        const signature =
          connection.method === 'ganache'
            ? await environment?.client.sign(user.username, account.address!)
            : await environment?.client.personal.sign(user.username, account.address!, 'password');

        const result = await (
          await fetch(`${process.env.MELON_TELEGRAM_API}/api/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...user, signature, address: account.address! }),
          })
        ).json();

        if (!mounted.current) {
          return;
        }

        if (result.error) {
          setStatus((previous) => ({ ...previous, state: 'idle', error: result.error }));
        } else {
          setStatus((previous) => ({
            ...previous,
            state: 'idle',
            error: result.error,
            data: { ...previous.data!, authenticated: true },
          }));
        }
      } catch (e) {
        if (!mounted.current) {
          return;
        }

        setStatus((previous) => ({ ...previous, state: 'idle', error: 'An unknown error has occurred.' }));
      }
    },
    [connection.method]
  );

  return (
    <Block>
      <SectionTitle>Melon Exposed Businesses Channel</SectionTitle>
      {status?.state === 'loading' ? <Spinner /> : null}

      {status?.state === 'idle' && !!status?.error ? (
        <NotificationBar kind="error">
          <NotificationContent>{status.error}</NotificationContent>
        </NotificationBar>
      ) : null}

      {status?.state === 'idle' && status.data && !status.data.authenticated ? (
        <>
          <p>Authenticate with Telegram to gain access to our private channel.</p>
          {!!status?.data?.bot && <TelegramLogin botName={status.data.bot} onAuth={handleAuth} />}
        </>
      ) : null}

      {status?.state === 'idle' && status.data?.authenticated ? (
        <>
          <p>
            You have sucessfully completed the account validation process. The Melon Bot should've introduced itself to
            you on Telegram.
          </p>

          {!!status?.data?.bot && (
            <LinkButton href={`https://t.me/${status.data.bot}/start`} target="_blank">
              Contact Telegram Bot
            </LinkButton>
          )}
        </>
      ) : null}
    </Block>
  );
};
