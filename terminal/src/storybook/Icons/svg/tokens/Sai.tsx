import React, { SVGProps } from 'react';

const SvgSai = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 28 28" {...props}>
    <defs>
      <circle id="sai_svg__a" cx={13.967} cy={13.967} r={13.5} />
    </defs>
    <g fill="none" fillRule="evenodd">
      <circle stroke="#FEAE16" cx={13.967} cy={13.967} r={13} />
      <use fill="#FFF" xlinkHref="#sai_svg__a" />
      <circle stroke="#FEAE16" cx={13.967} cy={13.967} r={13} />
      <g fillRule="nonzero">
        <path fill="#FDC526" d="M5.16 14.016l8.855-8.854 8.855 8.854-8.855 8.854z" />
        <path fill="#FEAE16" d="M14.018 5.163l-8.855 8.855 8.912 3.13 8.796-3.13z" />
        <path fill="#231F20" opacity={0.2} d="M22.928 14.018l-8.853 8.853V5.163z" />
        <path fill="#FEFEFE" d="M14.077 7.272l-5.872 6.16h4.025l1.845-1.762 1.949 1.761h4.116z" />
      </g>
    </g>
  </svg>
);

export default SvgSai;
