import React, { useState, useEffect, useRef, useCallback } from 'react';
import Header from './components/Header.jsx';
import Toolbar from './components/Toolbar.jsx';
import CanvasArea from './components/CanvasArea.jsx';
import RightPanel from './components/RightPanel.jsx';
import HistoryPage from './components/HistoryPage.jsx';
import Dialog from './components/Dialog.jsx';
import Toast from './components/Toast.jsx';
import StatusBar from './components/StatusBar.jsx';
import { usePaint } from './hooks/usePaint.js';
import { useShortcuts } from './hooks/useShortcuts.js';
import { dbo, dbAll, dbPut, isDbConnected } from './lib/db.js';
import { mkGrad } from './lib/gradient.js';
import { TOOLS } from './components/Toolbar.jsx';
import { SHAPES } from './lib/shapes.js';

const ZS = [0.25, 0.5, 0.75, 1, 1.5, 2, 3];

export default function App() {
  // Theme state
  const [theme, setTheme] = useState(() => {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const toggleTheme = () => {
    setTheme((t) => (t === 'dark' ? 'light' : 'dark'));
  };

  // UI state
  const [tool, setTool] = useState('pencil');
  const [is3d, setIs3d] = useState(false);
  const [c1, setC1] = useState('#000000');
  const [c2, setC2] = useState('#ffffff');
  const [size, setSize] = useState(4);
  const [fm, setFm] = useState('outline');
  const [zoom, setZoom] = useState(1);
  const [grad, setGrad] = useState({
    on: false,
    type: 'linear',
    angle: 45,
    stops: ['#ff5d7a', '#ffb84d', '#3a8bff'],
  });

  const [view, setView] = useState('edit'); // 'edit' or 'hist'
  const [dirty, setDirty] = useState(false);
  const [curId, setCurId] = useState(null);
  const [curName, setCurName] = useState('Untitled');

  // Dialog state
  const [dialogState, setDialogState] = useState(null);
  const dialogResolverRef = useRef(null);

  // Toast state
  const [toastMsg, setToastMsg] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const toastTimerRef = useRef(null);

  const showToast = useCallback((msg) => {
    setToastMsg(msg);
    setToastVisible(true);
    clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => {
      setToastVisible(false);
    }, 2200);
  }, []);

  const openDialog = useCallback((config) => {
    return new Promise((resolve) => {
      dialogResolverRef.current = resolve;
      setDialogState(config);
    });
  }, []);

  const handleDialogClose = (result) => {
    setDialogState(null);
    if (dialogResolverRef.current) {
      dialogResolverRef.current(result);
      dialogResolverRef.current = null;
    }
  };

  // Text input overlay state
  const [textInput, setTextInput] = useState(null);
  const paintRef = useRef(null);

  const handleOpenTextInput = useCallback((x, y, color) => {
    const fs = size * 3 + 10;
    setTextInput({ x, y, fs, color, value: '' });
  }, [size]);

  const commitText = useCallback(() => {
    if (!textInput) return;
    const { x, y, fs, color, value } = textInput;
    setTextInput(null);
    if (value && value.trim()) {
      const tempC = document.createElement('canvas');
      const tempCtx = tempC.getContext('2d');
      tempCtx.font = fs + 'px system-ui,"Segoe UI",sans-serif';
      const textMetrics = tempCtx.measureText(value);
      const textW = Math.max(20, Math.ceil(textMetrics.width));
      const textH = Math.max(20, Math.ceil(fs * 1.3));

      tempC.width = textW + 8;
      tempC.height = textH + 8;

      tempCtx.font = fs + 'px system-ui,"Segoe UI",sans-serif';
      tempCtx.textBaseline = 'top';
      tempCtx.fillStyle = grad.on
        ? mkGrad(tempCtx, 0, 0, textW, textH, grad)
        : color;
      tempCtx.fillText(value, 4, 4);

      if (paintRef.current) {
        paintRef.current.createActiveElement(tempC, Math.round(x), Math.round(y), tempC.width, tempC.height);
      }
      setDirty(true);
    }
  }, [textInput, grad]);

  const handleTextInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      commitText();
    } else if (e.key === 'Escape') {
      setTextInput(null);
    }
  };

  const handleTextInputChange = (e) => {
    const val = e.target.value;
    setTextInput((prev) => (prev ? { ...prev, value: val } : null));
  };

  // Canvas drawing hook
  const paint = usePaint({
    tool,
    c1,
    c2,
    size,
    fm,
    grad,
    zoom,
    is3d,
    setDirty,
    setC1,
    setC2,
    onOpenTextInput: (x, y, color) => {
      commitText();
      handleOpenTextInput(x, y, color);
    },
  });

  paintRef.current = paint;

  // Guard before action
  const guard = useCallback((cb) => {
    if (!dirty) {
      cb();
      return;
    }
    openDialog({
      title: 'Unsaved changes',
      text: 'Save "' + curName + '" to History before you leave it?',
      ok: 'Save',
      alt: 'Discard',
    }).then(async (r) => {
      if (r.ok) {
        if (await saveDrawing(false)) cb();
      } else if (r.alt) {
        cb();
      }
    });
  }, [dirty, curName, openDialog]);

  // Thumbnail helper
  const thumb = useCallback(() => {
    const cv = paint.canvasRef.current;
    if (!cv) return '';
    const k = Math.min(1, 360 / paint.width);
    const c = document.createElement('canvas');
    c.width = Math.max(1, Math.round(paint.width * k));
    c.height = Math.max(1, Math.round(paint.height * k));
    const x = c.getContext('2d');
    x.fillStyle = '#fff';
    x.fillRect(0, 0, c.width, c.height);
    x.drawImage(cv, 0, 0, c.width, c.height);
    return c.toDataURL('image/jpeg', 0.82);
  }, [paint.canvasRef, paint.width, paint.height]);

  // Save drawing
  const saveDrawing = useCallback(async (asNew = false) => {
    commitText();
    paint.commitSelection();
    let id = curId;
    let name = curName;
    try {
      if (!id || asNew) {
        let n = 0;
        try {
          n = (await dbAll()).length;
        } catch {}
        const r = await openDialog({
          title: asNew && curId ? 'Save a copy' : 'Save to History',
          text: 'Give your drawing a name.',
          input: asNew && curId ? curName + ' copy' : 'Drawing ' + (n + 1),
          ok: 'Save',
        });
        if (!r.ok) return false;
        name = r.v || 'Untitled';
        id = 'd' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
      }
      const cv = paint.canvasRef.current;
      const blob = await new Promise((res) => cv.toBlob(res, 'image/png'));
      try {
        await dbPut({
          id,
          name,
          ts: Date.now(),
          w: paint.width,
          h: paint.height,
          blob,
          thumb: thumb(),
        });
      } catch {
        showToast('Could not save. Browser storage is full or blocked.');
        return false;
      }
      setCurId(id);
      setCurName(name);
      setDirty(false);
      showToast('Saved to History');
      return true;
    } catch (e) {
      showToast('Save failed: ' + (e && e.message ? e.message : e));
      return false;
    }
  }, [commitText, curId, curName, openDialog, paint.canvasRef, paint.width, paint.height, thumb, showToast]);

  // Download helpers
  const dlBlob = (b, name) => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(b);
    a.download = (name.replace(/[\\/:*?"<>|]+/g, '_') || 'drawing') + '.png';
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  };

  const dlPNG = useCallback(() => {
    commitText();
    paint.commitSelection();
    const cv = paint.canvasRef.current;
    if (cv) {
      cv.toBlob((b) => dlBlob(b, curName));
    }
  }, [commitText, paint.canvasRef, curName]);

  // New canvas
  const handleNewCanvas = useCallback(() => {
    commitText();
    guard(() => {
      paint.resetCanvas(1152, 648);
      setCurId(null);
      setCurName('Untitled');
      setDirty(false);
    });
  }, [commitText, guard, paint]);

  // Open file
  const handleOpenFile = useCallback((f) => {
    guard(() => {
      const r = new FileReader();
      r.onload = () => {
        const im = new Image();
        im.onload = () => {
          paint.loadImageToCanvas(im);
          setCurId(null);
          setCurName(f.name.replace(/\.[^.]+$/, '') || 'Untitled');
          setDirty(true);
        };
        im.src = r.result;
      };
      r.readAsDataURL(f);
    });
  }, [guard, paint]);

  // Zoom controls
  const handleZoomIn = useCallback(() => {
    const next = ZS.find((z) => z > zoom + 0.001);
    if (next) setZoom(next);
  }, [zoom]);

  const handleZoomOut = useCallback(() => {
    const next = [...ZS].reverse().find((z) => z < zoom - 0.001);
    if (next) setZoom(next);
  }, [zoom]);

  const handleZoomReset = useCallback(() => {
    setZoom(1);
  }, []);

  // Swap colors
  const handleSwapColors = useCallback(() => {
    setC1(c2);
    setC2(c1);
  }, [c1, c2]);

  // Tool change
  const handleSelectTool = (t) => {
    commitText();
    paint.commitSelection();
    setTool(t);
  };

  // Open drawing record from history
  const handleOpenRecord = (r) => {
    guard(() => {
      const url = URL.createObjectURL(r.blob);
      const im = new Image();
      im.onload = () => {
        paint.loadImageToCanvas(im);
        URL.revokeObjectURL(url);
        setCurId(r.id);
        setCurName(r.name);
        setDirty(false);
        setView('edit');
      };
      im.src = url;
    });
  };

  // Keyboard shortcuts
  useShortcuts({
    isDialogOpen: !!dialogState,
    view,
    setView,
    hasTextInput: !!textInput,
    commitText,
    undo: paint.undo,
    redo: paint.redo,
    onSave: (asNew) => saveDrawing(asNew),
    onDownload: dlPNG,
    onOpenFileClick: () => {
      const input = document.getElementById('fi');
      if (input) input.click();
    },
    onZoomIn: handleZoomIn,
    onZoomOut: handleZoomOut,
    onZoomReset: handleZoomReset,
    onNewCanvas: handleNewCanvas,
    setTool: handleSelectTool,
    size,
    setSize,
    onSwapColors: handleSwapColors,
    grad,
    setGrad,
  });

  // DB init
  useEffect(() => {
    dbo().then((ok) => {
      if (!isDbConnected()) {
        showToast('History storage is blocked in this browser. Drawings will be lost when you close the tab.');
      }
      try {
        if (navigator.storage && navigator.storage.persist) {
          navigator.storage.persist();
        }
      } catch {}
    });
  }, [showToast]);

  // beforeunload
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (dirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [dirty]);

  const allTools = [...TOOLS, ...SHAPES];
  const toolName = allTools.find((x) => x[0] === tool)?.[1]?.replace(/ \(.\)/, '') || tool;

  return (
    <div className="h-full flex flex-col font-[13px/1.4] select-none">
      <Header
        canUndo={paint.canUndo}
        canRedo={paint.canRedo}
        onUndo={() => {
          commitText();
          paint.undo();
        }}
        onRedo={() => {
          commitText();
          paint.redo();
        }}
        zoom={zoom}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        theme={theme}
        onToggleTheme={toggleTheme}
        view={view}
        onToggleHistory={() => {
          commitText();
          setView((v) => (v === 'edit' ? 'hist' : 'edit'));
        }}
        onNew={handleNewCanvas}
        onOpenFile={handleOpenFile}
        onDownload={dlPNG}
        onSave={() => saveDrawing(false)}
      />

      {/* Main editor or History */}
      {view === 'edit' ? (
        <main
          id="mn"
          className="flex-1 min-h-0 grid grid-cols-[148px_1fr_288px] [grid-template-areas:'tb_ws_pn'] max-[900px]:grid-cols-[88px_1fr] max-[900px]:grid-rows-[1fr_250px] max-[900px]:[grid-template-areas:'tb_ws'_'pn_pn']"
        >
          <Toolbar
            currentTool={tool}
            onSelectTool={handleSelectTool}
            is3d={is3d}
            onToggle3d={setIs3d}
          />
          <CanvasArea
            canvasRef={paint.canvasRef}
            width={paint.width}
            height={paint.height}
            zoom={zoom}
            textInput={textInput}
            onTextInputKeyDown={handleTextInputKeyDown}
            onTextInputChange={handleTextInputChange}
            selection={paint.selection}
            activeElement={paint.activeElement}
            currentTool={tool}
            onPointerDown={paint.handlePointerDown}
            onPointerMove={paint.handlePointerMove}
            onPointerUp={paint.handlePointerUp}
            onPointerCancel={paint.handlePointerUp}
          />
          <RightPanel
            c1={c1}
            c2={c2}
            onChangeColor1={setC1}
            onChangeColor2={setC2}
            onSwapColors={handleSwapColors}
            grad={grad}
            onChangeGrad={setGrad}
            size={size}
            onChangeSize={setSize}
            fm={fm}
            onChangeFm={setFm}
            width={paint.width}
            height={paint.height}
            onApplyResize={(w, h) => {
              commitText();
              paint.resizeCanvas(w, h);
            }}
          />
        </main>
      ) : (
        <HistoryPage
          curId={curId}
          onOpenRecord={handleOpenRecord}
          onNewDrawing={() => {
            guard(() => {
              paint.resetCanvas(1152, 648);
              setCurId(null);
              setCurName('Untitled');
              setDirty(false);
              setView('edit');
            });
          }}
          onBackToCanvas={() => setView('edit')}
          dialog={openDialog}
          showToast={showToast}
          setCurId={setCurId}
          setCurName={setCurName}
          setDirty={setDirty}
        />
      )}

      <StatusBar
        pos={paint.pointerPos}
        width={paint.width}
        height={paint.height}
        toolName={toolName}
        curName={curName}
        dirty={dirty}
        curId={curId}
      />

      <Dialog
        dialogState={dialogState}
        onClose={handleDialogClose}
      />

      <Toast
        message={toastMsg}
        visible={toastVisible}
      />
    </div>
  );
}
