import React from 'react';

export const ICONS = {
  select: '<path d="M5 3a2 2 0 0 0-2 2"/><path d="M19 3a2 2 0 0 1 2 2"/><path d="M21 19a2 2 0 0 1-2 2"/><path d="M5 21a2 2 0 0 1-2-2"/><path d="M9 3h2"/><path d="M9 21h2"/><path d="M13 3h2"/><path d="M13 21h2"/><path d="M3 9v2"/><path d="M21 9v2"/><path d="M3 13v2"/><path d="M21 13v2"/>',
  pencil: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/>',
  brush: '<path d="m9.06 11.9 8.07-8.06a2.85 2.85 0 1 1 4.03 4.03l-8.06 8.08"/><path d="M7.07 14.94c-1.66 0-3 1.35-3 3.02 0 1.33-2.5 1.52-2 2.02 1.08 1.1 2.49 2.02 4 2.02 2.2 0 4-1.8 4-4.04a3.01 3.01 0 0 0-3-3.02z"/>',
  eraser: '<path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21"/><path d="M22 21H7"/><path d="m5 11 9 9"/>',
  bucket: '<path d="m19 11-8-8-8.6 8.6a2 2 0 0 0 0 2.8l5.2 5.2c.8.8 2 .8 2.8 0L19 11Z"/><path d="m5 2 5 5"/><path d="M2 13h15"/><path d="M22 20a2 2 0 1 1-4 0c0-1.6 1.7-2.4 2-4 .3 1.6 2 2.4 2 4Z"/>',
  picker: '<path d="m2 22 1-1h3l9-9"/><path d="M3 21v-3l9-9"/><path d="m15 6 3.4-3.4a2.1 2.1 0 1 1 3 3L18 9l.4.4a2.1 2.1 0 1 1-3 3l-3.8-3.8a2.1 2.1 0 1 1 3-3l.4.4Z"/>',
  text: '<polyline points="4 7 4 4 20 4 20 7"/><line x1="9" x2="15" y1="20" y2="20"/><line x1="12" x2="12" y1="4" y2="20"/>',
  line: '<path d="M5 19 19 5"/>',
  arrow: '<path d="M5 19 19 5"/><path d="M9 5h10v10"/>',
  rect: '<rect x="3" y="5" width="18" height="14" rx="1"/>',
  round: '<rect x="3" y="5" width="18" height="14" rx="5"/>',
  ellipse: '<ellipse cx="12" cy="12" rx="9" ry="7"/>',
  tri: '<path d="M12 4 21 20H3Z"/>',
  rtri: '<path d="M5 4v16h15Z"/>',
  diamond: '<path d="M12 3 21 12 12 21 3 12Z"/>',
  pent: '<path d="M12 3 21 9.5 17.5 20h-11L3 9.5Z"/>',
  hex: '<path d="M12 3 20 7.5v9L12 21 4 16.5v-9Z"/>',
  star: '<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9Z"/>',
  undo: '<path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11"/>',
  redo: '<path d="m15 14 5-5-5-5"/><path d="M20 9H9.5a5.5 5.5 0 0 0 0 11H13"/>',
  new: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z"/><path d="M14 3v5h5"/><path d="M12 12v5"/><path d="M9.5 14.5h5"/>',
  open: '<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/>',
  save: '<path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M5 21h14"/>',
  zout: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/><path d="M8 11h6"/>',
  zin: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/><path d="M8 11h6"/><path d="M11 8v6"/>',
  swap: '<path d="M7 4 3 8l4 4"/><path d="M3 8h14"/><path d="m17 20 4-4-4-4"/><path d="M21 16H7"/>',
  disk: '<path d="M5 3h11l3 3v13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"/><path d="M7 3v5h8V3"/><path d="M7 21v-7h10v7"/>',
  history: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l3 2"/>',
  trash: '<path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="m6 6 1 14h10l1-14"/>',
  back: '<path d="m15 18-6-6 6-6"/>',
  plus: '<path d="M12 5v14"/><path d="M5 12h14"/>',
  images: '<rect x="3" y="4" width="18" height="16" rx="3"/><circle cx="9" cy="10" r="1.6"/><path d="m21 16-5-5-8 8"/>',
  darrow: '<path d="M5 19 19 5"/><path d="M9 5h10v10"/><path d="M15 19H5V9"/>',
  heart: '<path d="M12 20.5C5 15 3 11.5 3 8.5 3 6 5 4 7.5 4c1.8 0 3.3 1 4.5 2.6C13.2 5 14.7 4 16.5 4 19 4 21 6 21 8.5c0 3-2 6.5-9 12Z"/>',
  cloud: '<path d="M7 18a4 4 0 0 1-.5-8 5.5 5.5 0 0 1 10.6-1A4.5 4.5 0 0 1 17.5 18Z"/>',
  bolt: '<path d="M13 3 5 13.5h6L10 21l9-11h-6.5Z"/>',
  callout: '<path d="M5 4h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-8l-4 4v-4H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z"/>',
  cross: '<path d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6Z"/>',
  octagon: '<path d="M8 3h8l5 5v8l-5 5H8l-5-5V8Z"/>',
  para: '<path d="M7 5h14l-4 14H3Z"/>',
  trap: '<path d="M7 5h10l4 14H3Z"/>',
  star4: '<path d="M12 2c.8 5.5 4.5 9.2 10 10-5.5.8-9.2 4.5-10 10-.8-5.5-4.5-9.2-10-10 5.5-.8 9.2-4.5 10-10Z"/>',
  star6: '<path d="m12 2 2.8 5H21l-3.2 5 3.2 5h-6.2L12 22l-2.8-5H3l3.2-5L3 7h6.2Z"/>',
  arR: '<path d="M3 9h10V4l8 8-8 8v-5H3Z"/>',
  arL: '<path d="M21 9H11V4l-8 8 8 8v-5h10Z"/>',
  arU: '<path d="M9 21V11H4l8-8 8 8h-5v10Z"/>',
  arD: '<path d="M9 3v10H4l8 8 8-8h-5V3Z"/>',
  cyl: '<path d="M4 6c0-1.7 3.6-3 8-3s8 1.3 8 3-3.6 3-8 3-8-1.3-8-3Z"/><path d="M4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6"/>',
  cube3d: '<path d="m21 16-9 5-9-5V8l9-5 9 5v8z"/><path d="M12 3v10"/><path d="m21 8-9 5-9-5"/><path d="M12 13 3 8"/>',
  cyl3d: '<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.66 3.58 3 8 3s8-1.34 8-3V5"/>',
  cone3d: '<path d="m12 2-8 16a8 3 0 0 0 16 0L12 2z"/>',
  sphere3d: '<circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="9" ry="3"/>',
  pyramid3d: '<path d="m12 2-9 16 9 4 9-4-9-16z"/><path d="M12 2v20"/>',
  prism3d: '<path d="M4 18V9l8-5v9"/><path d="M4 18l8-4 8 4-8-4V5l8 4v9l-8-4z"/>',
  torus3d: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/>',
  capsule3d: '<rect x="6" y="3" width="12" height="18" rx="6"/><line x1="6" y1="12" x2="18" y2="12"/>',
  moon: '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>'
};

export default function Icon({ name, className = 'w-[18px] h-[18px]' }) {
  const innerHtml = ICONS[name] || '';
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`shrink-0 ${className}`}
      dangerouslySetInnerHTML={{ __html: innerHtml }}
    />
  );
}
