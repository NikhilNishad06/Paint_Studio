import React from 'react';

export default function StatusBar({ pos, width, height, toolName, curName, dirty, curId }) {
  let statusText = 'Not saved yet';
  if (dirty) {
    statusText = 'Unsaved changes';
  } else if (curId) {
    statusText = 'Saved';
  }

  return (
    <footer className="h-[30px] flex items-center gap-[22px] px-4 bg-chrome border-t border-line text-mut text-[12px] tabular-nums shrink-0">
      <span>
        Pointer <b className="text-ink font-semibold">{pos.x}, {pos.y} px</b>
      </span>
      <span>
        Canvas <b className="text-ink font-semibold">{width} × {height} px</b>
      </span>
      <span>
        Tool <b className="text-ink font-semibold">{toolName}</b>
      </span>
      <span>
        File <b className="text-ink font-semibold">{curName}</b>
      </span>
      <span>
        <b className={`font-semibold ${dirty ? 'text-[#d9822b]' : 'text-ink'}`}>
          {statusText}
        </b>
      </span>
    </footer>
  );
}
