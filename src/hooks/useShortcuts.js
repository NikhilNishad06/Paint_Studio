import { useEffect } from 'react';

const KEYS = {
  m: 'select',
  s: 'select',
  p: 'pencil',
  b: 'brush',
  e: 'eraser',
  f: 'bucket',
  i: 'picker',
  t: 'text',
};

export function useShortcuts({
  isDialogOpen,
  view,
  setView,
  hasTextInput,
  commitText,
  undo,
  redo,
  onSave,
  onDownload,
  onOpenFileClick,
  onZoomIn,
  onZoomOut,
  onZoomReset,
  onNewCanvas,
  setTool,
  size,
  setSize,
  onSwapColors,
  grad,
  setGrad,
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isDialogOpen) return;

      const k = e.key.toLowerCase();
      const mod = e.ctrlKey || e.metaKey;
      const tg = e.target;
      const typing =
        tg.tagName === 'INPUT' &&
        (tg.type === 'text' || tg.type === 'number' || tg.type === 'search');

      if (e.altKey && e.code === 'KeyH') {
        e.preventDefault();
        commitText();
        setView(view === 'hist' ? 'edit' : 'hist');
        return;
      }

      if (hasTextInput || typing) return;

      if (view === 'hist') {
        if (e.key === 'Escape') {
          setView('edit');
        }
        return;
      }

      if (mod) {
        if (k === 'z' && !e.shiftKey) {
          e.preventDefault();
          commitText();
          undo();
        } else if (k === 'y' || (k === 'z' && e.shiftKey)) {
          e.preventDefault();
          commitText();
          redo();
        } else if (k === 's') {
          e.preventDefault();
          commitText();
          onSave(e.shiftKey);
        } else if (k === 'e') {
          e.preventDefault();
          commitText();
          onDownload();
        } else if (k === 'o') {
          e.preventDefault();
          commitText();
          onOpenFileClick();
        } else if (k === '=' || k === '+') {
          e.preventDefault();
          onZoomIn();
        } else if (k === '-') {
          e.preventDefault();
          onZoomOut();
        } else if (k === '0') {
          e.preventDefault();
          onZoomReset();
        }
        return;
      }

      if (e.altKey) {
        if (e.code === 'KeyN') {
          e.preventDefault();
          commitText();
          onNewCanvas();
        }
        return;
      }

      if (KEYS[k]) {
        e.preventDefault();
        commitText();
        setTool(KEYS[k]);
      } else if (e.key === '[') {
        setSize(Math.min(40, Math.max(1, size - 2)));
      } else if (e.key === ']') {
        setSize(Math.min(40, Math.max(1, size + 2)));
      } else if (k === 'x') {
        onSwapColors();
      } else if (k === 'g') {
        setGrad((prev) => ({ ...prev, on: !prev.on }));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    isDialogOpen,
    view,
    setView,
    hasTextInput,
    commitText,
    undo,
    redo,
    onSave,
    onDownload,
    onOpenFileClick,
    onZoomIn,
    onZoomOut,
    onZoomReset,
    onNewCanvas,
    setTool,
    size,
    setSize,
    onSwapColors,
    grad,
    setGrad,
  ]);
}
