import React from 'react';
import styled, { ThemeProvider as ThemeProviderBase } from 'styled-components';
import { Reset } from 'styled-reset';
import { BaseModalBackground, ModalProvider } from 'styled-react-modal';
import { light as lightTheme, dark as darkTheme, Global } from '~/theme';

export const ModalBackground = styled(BaseModalBackground)`
  z-index: 2000;
`;

type DarkModeValue = [boolean, (mode: boolean) => void];
const DarkMode = React.createContext<DarkModeValue>(undefined as any);

export const useDarkMode = () => {
  return React.useContext(DarkMode);
};

interface DarkModeProviderProps {
  override?: boolean;
}

const DarkModeProvider: React.FC<DarkModeProviderProps> = (props) => {
  const [dark, $$setDark] = React.useState(!!JSON.parse(localStorage.getItem('theme.mode') || 'false'));
  const setDark = React.useCallback(
    (mode: boolean) => {
      localStorage.setItem('theme.mode', JSON.stringify(mode));
      $$setDark(mode);
    },
    [$$setDark]
  );

  const value = React.useMemo<DarkModeValue>(() => {
    if (props.override != null) {
      return [props.override, setDark];
    }

    return [dark, setDark];
  }, [props.override, dark, setDark]);
  return <DarkMode.Provider value={value}>{props.children}</DarkMode.Provider>;
};

const SwitchableTheme: React.FC = ({ children }) => {
  const [dark] = useDarkMode();
  const current = dark ? darkTheme : lightTheme;

  return (
    <ThemeProviderBase theme={current}>
      <Reset />
      <Global />
      <ModalProvider backgroundComponent={ModalBackground}>{children}</ModalProvider>
    </ThemeProviderBase>
  );
};

export interface ThemeProviderProps {
  dark?: boolean;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = (props) => {
  return (
    <DarkModeProvider override={props.dark}>
      <SwitchableTheme>{props.children}</SwitchableTheme>
    </DarkModeProvider>
  );
};
