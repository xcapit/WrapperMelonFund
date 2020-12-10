import React, { SVGProps } from 'react';

const SvgKnc = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 28 28" {...props}>
    <defs>
      <path id="knc_svg__b" d="M0 .41h5.86v18.136H0z" />
      <path
        d="M3.957 9.478L5.852.861C5.926.524 5.53.278 5.249.488L.396 4.108a.975.975 0 00-.396.78v9.18c0 .306.146.595.396.781l4.853 3.62c.281.209.677-.037.603-.374L3.957 9.478z"
        id="knc_svg__c"
      />
      <linearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="knc_svg__a">
        <stop stopColor="#31CB9E" offset="0%" />
        <stop stopColor="#2FC99E" offset="4%" />
        <stop stopColor="#18B2A1" offset="63%" />
        <stop stopColor="#0FAAA2" offset="100%" />
      </linearGradient>
    </defs>
    <g fill="none" fillRule="evenodd">
      <circle fill="url(#knc_svg__a)" cx={14} cy={14} r={14} />
      <g transform="translate(7 4.667)">
        <path
          d="M5.812 9.478l7.242 4.062c.254.142.57-.037.57-.323v-7.48c0-.286-.316-.465-.57-.323L5.812 9.478zM12.639 3.668L7.823.076a.383.383 0 00-.603.218L5.462 8.29l7.135-4.004a.367.367 0 00.042-.618M7.822 18.88l4.82-3.594a.367.367 0 00-.041-.618l-7.139-4.003 1.758 7.997c.059.267.38.383.602.218"
          fill="#FFF"
        />
        <use fill="#FFF" xlinkHref="#knc_svg__c" />
      </g>
    </g>
  </svg>
);

export default SvgKnc;
