import React, { SVGProps } from 'react';

const SvgBat = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 28 28" {...props}>
    <defs>
      <linearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="bat_svg__a">
        <stop offset="0%" />
        <stop stopOpacity={0} offset="97.834%" />
      </linearGradient>
    </defs>
    <g fill="none" fillRule="evenodd">
      <path
        d="M27.912 13.975c0 7.693-6.237 13.93-13.93 13.93-7.694 0-13.93-6.237-13.93-13.93C.051 6.28 6.287.045 13.981.045c7.693 0 13.93 6.236 13.93 13.93"
        fill="#672893"
      />
      <path
        d="M26.6 13.975c0 2.817-.923 5.42-2.485 7.52a12.6 12.6 0 01-10.134 5.098c-.805 0-1.592-.075-2.356-.22C5.782 25.27 1.363 20.138 1.363 13.975c0-6.969 5.649-12.62 12.618-12.62 6.97 0 12.62 5.651 12.62 12.62"
        fill="#FFF"
      />
      <path fill="#FF4F00" d="M14.01 11.119l-3.462 5.918h.088L5.418 19.99h-.055L14.01 5.21z" />
      <path fill="#672893" d="M22.656 19.992H5.418l5.218-2.955h6.809l5.208 2.95z" />
      <path fill="#A01A63" d="M17.445 17.037h.026l-3.461-5.918v-5.91l8.643 14.778z" />
      <path fill="#FFF" d="M14.01 11.119l-3.462 5.918h6.923z" />
      <path
        d="M5.418 19.992l6.207 6.381c.764.145 1.55.22 2.356.22a12.6 12.6 0 0010.134-5.098l-1.462-1.503H5.418z"
        fill="url(#bat_svg__a)"
        opacity={0.1}
      />
    </g>
  </svg>
);

export default SvgBat;
