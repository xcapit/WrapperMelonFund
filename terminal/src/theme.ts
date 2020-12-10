import { createGlobalStyle } from 'styled-components';

const logoColorsLightMode = [
  '#000000',
  '#85ca5d',
  '#5291e1',
  '#ff00b4',
  '#00ffbc',
  '#8ea5ff',
  '#c493ff',
  '#ffb5b5',
  '#8fb8ff',
  '#fd81eb',
];

const logoColorsDarkMode = ['#ededed', '#ffa41b', '#9818d6', '#61d4b3', '#fdd365', '#fb8d62', '#fd2eb3'];

const theme = {
  spaceUnits: {
    xxxs: '2px',
    xxs: '4px',
    xs: '8px',
    s: '12px',
    m: '16px',
    l: '24px',
    xl: '32px',
    xxl: '40px',
    xxxl: '48px',
  },
  fontFamilies: {
    primary: '"Source Serif Pro", serif',
  },
  fontSizes: {
    xxxl: '3rem',
    xxl: '1.25rem',
    xl: '1.125rem',
    l: '1rem',
    m: '0.875rem',
    s: '0.75rem',
    xs: '0.625rem',
    xxs: '0.55rem',
  },
  fontWeights: {
    light: '300',
    regular: '400',
    semiBold: '600',
    bold: '700',
  },
  mediaQueries: {
    xl: 'min-width: 1440px',
    l: 'min-width: 1024px',
    m: 'min-width: 768px',
    s: 'min-width: 480px',
  },
  container: {
    xl: '1320px',
    l: '1180px',
    m: '992px',
    s: '720px',
  },
  skeleton: {
    headerHeight: '88px',
    footerHeight: '48px',
  },
  header: {
    height: '88px',
  },
  transition: {
    defaultAll: 'all 0.3s ease-in-out',
    duration: '0.3s',
  },
  awesomegrid: {
    mediaQuery: 'only screen',
    columns: {
      xs: 12,
      sm: 12,
      md: 12,
      lg: 12,
      xl: 12,
    },
    gutterWidth: {
      xs: 1,
      sm: 1,
      md: 1,
      lg: 1.5,
      xl: 1.5,
    },
    paddingWidth: {
      xs: 0,
      sm: 0,
      md: 0,
      lg: 0,
      xl: 0,
    },
    container: {
      xs: 'full', // 'full' = max-width: 100%
      sm: 'full', // 'full' = max-width: 100%
      md: 'full', // 'full' = max-width: 100%
      lg: 'full', // 'full' = max-width: 100%
      xl: 'full', // 'full' = max-width: 100%
    },
    breakpoints: {
      xs: 1,
      sm: 48, // 768px
      md: 64, // 1024px
      lg: 90, // 1440px
      xl: 120, // 1920px
    },
  },
};

export const light = {
  mode: 'light' as 'light' | 'dark',
  mainColors: {
    primary: 'rgb(255, 255, 255)',
    primaryAlpha: 'rgba(255, 255, 255, 0.6)',
    primaryDark: 'rgb(29,29,29)',
    primaryLight: 'rgb(120, 120, 120, 0.6)',
    secondary: 'rgb(242, 242, 242)',
    secondaryDark: 'rgb(120, 120, 120)',
    secondaryDarkAlpha: 'rgb(120, 120, 120, 0.6)',
    border: 'rgb(29, 29, 29)',
    progressBar: 'rgb(29, 29, 29)',
    textColor: 'rgb(0, 0, 0)',
  },
  border: {
    borderDefault: '1px solid rgb(29,29,29)',
    borderSecondary: '1px solid rgb(196,196,196)',
    borderRadius: '0px',
    borderColor: 'rgb(29,29,29)',
  },
  statusColors: {
    primaryProfit: 'rgb(141, 197, 103)',
    secondaryProfit: 'rgb(243, 249, 241)',
    primaryLoss: 'rgb(255,141,136)',
    secondaryLoss: 'rgb(252, 240, 242)',
    warning: 'rgb(255,141,136)',
    neutral: 'rgb(0,128,128)',
  },
  otherColors: {
    black: 'rgb(0, 0, 0)',
    white: 'rgb(255, 255, 255)',
    grey: 'rgb(155, 155, 155)',
    red: 'rgb(244,67,54)',
    green: 'rgb(76,175,80)',
    logo: '#0B0B09',
    badge: 'rgb(230, 230, 230)',
    progressBar: 'rgba(230, 230, 230, 0.8)',
    turquoise: 'rgb(133,213,202)',
    coral: 'rgb(255,141,136)',
  },
  orderbookColors: {
    askDark: 'darkred',
    ask: 'rgb(255,141,136)',
    orderbook: 'darkgreen',
    orderbookLight: 'rgb(133,213,202)',
    hover: 'rgba(0, 0, 0, 0.2)',
  },
  logoColors: logoColorsLightMode,
  ...theme,
};

export const dark = {
  mode: 'dark' as 'light' | 'dark',
  mainColors: {
    primary: '#313131',
    primaryAlpha: '#3B4252',
    primaryDark: '#e5dfdf',
    primaryLight: '#000',
    secondary: '#414141',
    secondaryDark: '#aaaaaa',
    secondaryDarkAlpha: 'rgb(196, 196, 196, 0.6)',
    border: 'rgb(29, 29, 29)',
    progressBar: '#e5dfdf',
    textColor: '#e5dfdf',
    opposite: '#000',
  },
  border: {
    borderDefault: '1px solid rgb(196, 196, 196)',
    borderSecondary: '1px solid rgb(196,196,196)',
    borderRadius: '0px',
    borderColor: 'rgb(196, 196, 196)',
  },
  statusColors: {
    primaryProfit: 'rgb(141, 197, 103)',
    secondaryProfit: 'rgb(243, 249, 241)',
    primaryLoss: 'rgb(206, 88, 102)',
    secondaryLoss: 'rgb(252, 240, 242)',
    warning: 'rgb(249,209,118)',
    neutral: 'rgb(74,194,238)',
  },
  otherColors: {
    black: 'rgb(0, 0, 0)',
    white: 'rgb(255, 255, 255)',
    grey: 'rgb(155, 155, 155)',
    red: 'rgb(244,67,54)',
    green: 'rgb(76,175,80)',
    logo: 'rgb(133,213,202)',
    badge: 'black',
    progressBar: 'black',
    turquoise: 'rgb(133,213,202)',
    coral: 'rgb(255,141,136)',
  },
  orderbookColors: {
    askDark: 'darkred',
    ask: 'rgb(255,141,136)',
    orderbook: 'darkgreen',
    orderbookLight: 'rgb(133,213,202)',
    hover: 'rgba(0, 0, 0, 0.2)',
  },

  logoColors: logoColorsDarkMode,
  ...theme,
};

export const Global = createGlobalStyle`
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  html {
    min-height: 100%;
  }

  html, body, form, fieldset, table, tr, td, img {
    font: 14px/1.4 monospace, sans-serif;
  }

  input, button, select, textarea, optgroup, option {
      font-family: inherit;
      font-size: inherit;
      font-style: inherit;
      font-weight: inherit;
  }
  
  body {
    margin: 0;
    min-height: 100%;
    background-color: ${(props) => props.theme.mainColors.secondary};
    color: ${(props) => props.theme.mainColors.textColor}
  }

  h1, h2, h3 {
    margin-bottom: ${(props) => props.theme.spaceUnits.m};
    font-size: ${(props) => props.theme.fontSizes.xxl};
    font-weight: bold;
    position: relative;
  }


  h2, h3 {
    padding-bottom: ${(props) => props.theme.spaceUnits.xs};
    border-bottom : ${(props) => props.theme.border.borderSecondary};
    margin-bottom: ${(props) => props.theme.spaceUnits.xs};
  }

  h4 {
    font-size: ${(props) => props.theme.fontSizes.xl};
    margin-bottom: ${(props) => props.theme.spaceUnits.xs};
  }

  a {
    display: inline-flex;
    align-items: center;
    text-decoration: underline;
    cursor: pointer;
    color: ${(props) => props.theme.mainColors.textColor};
    transition: ${(props) => props.theme.transition.defaultAll};
    :hover{
      opacity: 0.6;
    }
  }

  hr {
    border: 0;
    height: 0;
    border-top: 1px solid ${(props) => props.theme.mainColors.border};
    margin: ${(props) => props.theme.spaceUnits.s} 0;
  }

  p {
    margin-bottom: ${(props) => props.theme.spaceUnits.m};
  }
`;

export type Theme = typeof light;
