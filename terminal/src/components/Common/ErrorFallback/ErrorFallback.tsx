import React, { useEffect } from 'react';
import { FallbackProps } from 'react-error-boundary';
import { NotificationBar, NotificationContent } from '~/storybook/NotificationBar/NotificationBar';
import { Container } from '~/storybook/Container/Container';
import { Spinner } from '~/storybook/Spinner/Spinner';

export const ErrorFallback: React.FC<FallbackProps> = ({ error }) => {
  useEffect(() => {
    if (error?.name === 'ChunkLoadError') {
      window.location.reload(true);
    }
  }, [error?.name]);

  if (error?.name === 'ChunkLoadError') {
    return (
      <Container>
        <Spinner size="large" positioning="overlay" />
      </Container>
    );
  }

  const uri = encodeURI(
    `https://github.com/avantgardefinance/melon-terminal/issues/new?title=General error "${error?.name}";body=${error?.stack}`
  );

  return (
    <Container>
      <NotificationBar kind="error">
        <NotificationContent>
          <p>
            <strong>Oops, something went wrong!</strong>
          </p>

          <p>Please reload the page in your browser (Ctrl/Cmd R) and try again.</p>

          <p>
            If the error does not disappear after reloading, please file an{' '}
            <a href={uri} target="_blank">
              error report
            </a>
            .
          </p>
        </NotificationContent>
      </NotificationBar>
    </Container>
  );
};
