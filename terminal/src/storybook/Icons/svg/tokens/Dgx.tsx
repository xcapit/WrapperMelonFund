import React, { SVGProps } from 'react';

const SvgDgx = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" {...props}>
    <g fillRule="nonzero" fill="none">
      <path fill="#CEA85E" d="M12 8.75l-7.625 7.625L0 12 12 0l12 12-4.38 4.375z" />
      <path d="M6.914 17.5L12 22.586l5.086-5.086L12 12.414 6.914 17.5z" stroke="#CEA85E" strokeWidth={2} />
    </g>
  </svg>
);

export default SvgDgx;
