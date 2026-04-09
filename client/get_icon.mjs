import { renderToStaticMarkup } from 'react-dom/server';
import React from 'react';
import { Kanban } from 'lucide-react';

const svgString = renderToStaticMarkup(
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="256" height="256">
    <rect width="256" height="256" rx="64" fill="#4f46e5" />
    <g transform="translate(64, 64) scale(5.333)">
      <Kanban color="white" size="24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  </svg>
);

import fs from 'fs';
fs.writeFileSync('./public/favicon.svg', svgString);
console.log("Wrote favicon.svg");
