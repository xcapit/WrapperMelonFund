import React, { SVGProps } from 'react';

const SvgLink = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 25 28" {...props}>
    <path
      d="M11.85 0l12.288 6.934v14.044L11.88 28 0 20.978V6.934L11.85 0zm.087 5.705l-7.11 4.13V18.2l7.128 4.182L19.31 18.2V9.835l-7.373-4.13z"
      fill="#1D5CE5"
      fillRule="evenodd"
    />
  </svg>
);

export default SvgLink;
