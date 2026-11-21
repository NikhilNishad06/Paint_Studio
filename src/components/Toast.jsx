import React from 'react';

export default function Toast({ message, visible }) {
  return (
    <div
      role="status"
      className={`fixed left-1/2 bottom-[46px] -translate-x-1/2 bg-ink text-chrome px-4 py-[9px] rounded-[10px] font-[550] shadow-sh pointer-events-none transition-all duration-180 z-50 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
      }`}
    >
      {message}
    </div>
  );
}
