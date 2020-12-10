import React from 'react';

export interface TelegramLoginProps {
  onAuth: (user: any) => void | Promise<void>;
  botName: string;
}

export const TelegramLogin: React.FC<TelegramLoginProps> = (props) => {
  const [ref, setRef] = React.useState<HTMLElement | null>();
  const method = React.useMemo(() => {
    const id = (Math.random() + 1).toString(36).substr(2, 5);
    return `onTelegramAuth${id}`;
  }, []);

  const script = React.useMemo(() => {
    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js?7';
    script.setAttribute('data-telegram-login', props.botName);
    script.setAttribute('data-size', 'large');
    script.setAttribute('data-radius', '0');
    script.setAttribute('data-request-access', 'write');
    script.setAttribute('data-onauth', `${method}(user)`);
    script.async = true;

    return script;
  }, [method, props.botName]);

  React.useEffect(() => {
    if (ref) {
      ref.appendChild(script);

      return () => {
        ref.removeChild(script);
      };
    }
  }, [script, ref]);

  React.useEffect(() => {
    (global as any)[method] = props.onAuth;

    return () => {
      delete (global as any)[method];
    };
  }, [method, props.onAuth]);

  return <div ref={setRef} />;
};
