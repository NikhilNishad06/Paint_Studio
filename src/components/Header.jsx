import React, { useRef } from 'react';
import Icon from './Icon.jsx';

export default function Header({
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  zoom,
  onZoomIn,
  onZoomOut,
  theme,
  onToggleTheme,
  view,
  onToggleHistory,
  onNew,
  onOpenFile,
  onDownload,
  onSave,
}) {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    if (f) {
      onOpenFile(f);
    }
    e.target.value = '';
  };

  const isHist = view === 'hist';

  return (
    <header className="h-[56px] flex items-center gap-2.5 px-3.5 bg-chrome border-b border-line shrink-0">
      {/* Brand */}
      <div className="flex items-center gap-2.5 font-bold text-[15px] tracking-[-0.01em] mr-1.5">
        <div className="w-[30px] h-[30px] rounded-[9px] bg-[conic-gradient(from_210deg,#ff5d7a,#ffb84d,#3fd6a0,#3a8bff,#8a5bff,#ff5d7a)] grid place-items-center">
          <i className="w-3 h-3 rounded-full bg-chrome block" />
        </div>
        <span className="max-[900px]:hidden">Paint Studio</span>
      </div>

      <div className="w-[1px] h-6 bg-line my-0 mx-1" />

      {/* Hidden when in history view */}
      {!isHist && (
        <>
          <button
            type="button"
            className="h-[34px] px-3 rounded-[9px] border border-transparent bg-transparent flex items-center gap-[7px] font-[550] text-ink hover:bg-chrome2 hover:border-line disabled:opacity-40 disabled:cursor-default"
            title="New canvas (Alt+N)"
            onClick={onNew}
          >
            <Icon name="new" />
            <span className="max-[900px]:hidden">New</span>
          </button>

          <button
            type="button"
            className="h-[34px] px-3 rounded-[9px] border border-transparent bg-transparent flex items-center gap-[7px] font-[550] text-ink hover:bg-chrome2 hover:border-line disabled:opacity-40 disabled:cursor-default"
            title="Open image (Ctrl+O)"
            onClick={() => fileInputRef.current?.click()}
          >
            <Icon name="open" />
            <span className="max-[900px]:hidden">Open</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={handleFileChange}
          />

          <div className="w-[1px] h-6 bg-line my-0 mx-1" />

          <button
            type="button"
            disabled={!canUndo}
            className="h-[34px] w-[34px] p-0 justify-center rounded-[9px] border border-transparent bg-transparent flex items-center gap-[7px] font-[550] text-ink hover:bg-chrome2 hover:border-line disabled:opacity-40 disabled:cursor-default"
            title="Undo (Ctrl+Z)"
            onClick={onUndo}
          >
            <Icon name="undo" />
          </button>

          <button
            type="button"
            disabled={!canRedo}
            className="h-[34px] w-[34px] p-0 justify-center rounded-[9px] border border-transparent bg-transparent flex items-center gap-[7px] font-[550] text-ink hover:bg-chrome2 hover:border-line disabled:opacity-40 disabled:cursor-default"
            title="Redo (Ctrl+Y)"
            onClick={onRedo}
          >
            <Icon name="redo" />
          </button>

          <div className="flex-1" />

          <div className="flex items-center bg-chrome2 border border-line rounded-[10px]">
            <button
              type="button"
              className="w-[30px] h-[30px] border-0 bg-transparent rounded-[8px] grid place-items-center hover:bg-accsoft text-ink"
              title="Zoom out (Ctrl+-)"
              onClick={onZoomOut}
            >
              <Icon name="zout" />
            </button>
            <span className="min-w-[48px] text-center tabular-nums font-semibold text-[13px]">
              {Math.round(zoom * 100)}%
            </span>
            <button
              type="button"
              className="w-[30px] h-[30px] border-0 bg-transparent rounded-[8px] grid place-items-center hover:bg-accsoft text-ink"
              title="Zoom in (Ctrl++)"
              onClick={onZoomIn}
            >
              <Icon name="zin" />
            </button>
          </div>
        </>
      )}

      {isHist && <div className="flex-1" />}

      {/* Theme toggle */}
      <button
        type="button"
        className="h-[34px] w-[34px] p-0 justify-center rounded-[9px] border border-transparent bg-transparent flex items-center gap-[7px] font-[550] text-ink hover:bg-chrome2 hover:border-line"
        title="Light / dark theme"
        onClick={onToggleTheme}
      >
        <Icon name={theme === 'dark' ? 'sun' : 'moon'} />
      </button>

      {/* History button */}
      <button
        type="button"
        className={`h-[34px] px-3 rounded-[9px] border border-transparent flex items-center gap-[7px] font-[550] text-ink hover:bg-chrome2 hover:border-line ${
          isHist ? 'bg-accsoft border-line text-acc' : 'bg-transparent'
        }`}
        title="History (Alt+H)"
        onClick={onToggleHistory}
      >
        <Icon name="history" />
        <span className="max-[900px]:hidden">History</span>
      </button>

      {/* Download and Save (hidden in history) */}
      {!isHist && (
        <>
          <button
            type="button"
            className="h-[34px] w-[34px] p-0 justify-center rounded-[9px] border border-transparent bg-transparent flex items-center gap-[7px] font-[550] text-ink hover:bg-chrome2 hover:border-line"
            title="Download PNG (Ctrl+E)"
            onClick={onDownload}
          >
            <Icon name="save" />
          </button>

          <button
            type="button"
            className="h-[34px] px-3 rounded-[9px] border border-transparent bg-gradient-to-br from-acc to-acc2 text-white shadow-[0_4px_14px_rgba(58,70,232,0.35)] flex items-center gap-[7px] font-[550] hover:brightness-108"
            title="Save to History (Ctrl+S)"
            onClick={onSave}
          >
            <Icon name="disk" />
            <span className="max-[900px]:hidden">Save</span>
          </button>
        </>
      )}
    </header>
  );
}
