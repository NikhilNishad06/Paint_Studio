import { useRef, useState, useCallback, useEffect } from 'react';
import { drawShape } from '../lib/shapes.js';
import { flood } from '../lib/flood.js';
import { mkGrad } from '../lib/gradient.js';

const FREE = ['pencil', 'brush', 'eraser'];

export function usePaint({
  tool,
  c1,
  c2,
  size,
  fm,
  grad,
  zoom,
  setDirty,
  setC1,
  setC2,
  onOpenTextInput,
}) {
  const canvasRef = useRef(null);

  // Drawing refs
  const histRef = useRef([]);
  const hiRef = useRef(-1);
  const drawingRef = useRef(false);
  const snapRef = useRef(null);
  const startPosRef = useRef({ x: 0, y: 0 });
  const lastPosRef = useRef({ x: 0, y: 0 });
  const colRef = useRef(c1);
  const othRef = useRef(c2);

  // Dimension and zoom state
  const [width, setWidth] = useState(1152);
  const [height, setHeight] = useState(648);
  const [pointerPos, setPointerPos] = useState({ x: 0, y: 0 });
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  // Keep latest config in ref for event handlers
  const configRef = useRef({
    tool,
    c1,
    c2,
    size,
    fm,
    grad,
    zoom,
    width,
    height,
  });

  useEffect(() => {
    configRef.current = {
      tool,
      c1,
      c2,
      size,
      fm,
      grad,
      zoom,
      width,
      height,
    };
  }, [tool, c1, c2, size, fm, grad, zoom, width, height]);

  const updateUndoRedo = useCallback(() => {
    setCanUndo(hiRef.current > 0);
    setCanRedo(hiRef.current < histRef.current.length - 1);
  }, []);

  const pushSnapshot = useCallback(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext('2d', { willReadFrequently: true });
    histRef.current = histRef.current.slice(0, hiRef.current + 1);
    histRef.current.push(ctx.getImageData(0, 0, cv.width, cv.height));
    if (histRef.current.length > 40) histRef.current.shift();
    hiRef.current = histRef.current.length - 1;
    updateUndoRedo();
    setDirty(true);
  }, [setDirty, updateUndoRedo]);

  const blank = useCallback((w, h) => {
    const cv = canvasRef.current;
    if (!cv) return;
    cv.width = w;
    cv.height = h;
    const ctx = cv.getContext('2d', { willReadFrequently: true });
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, w, h);
    setWidth(w);
    setHeight(h);
  }, []);

  const loadSnapshot = useCallback((img) => {
    const cv = canvasRef.current;
    if (!cv) return;
    if (img.width !== cv.width || img.height !== cv.height) {
      cv.width = img.width;
      cv.height = img.height;
      setWidth(img.width);
      setHeight(img.height);
    }
    const ctx = cv.getContext('2d', { willReadFrequently: true });
    ctx.putImageData(img, 0, 0);
    updateUndoRedo();
  }, [updateUndoRedo]);

  const undo = useCallback(() => {
    if (hiRef.current > 0) {
      hiRef.current--;
      loadSnapshot(histRef.current[hiRef.current]);
      setDirty(true);
    }
  }, [loadSnapshot, setDirty]);

  const redo = useCallback(() => {
    if (hiRef.current < histRef.current.length - 1) {
      hiRef.current++;
      loadSnapshot(histRef.current[hiRef.current]);
      setDirty(true);
    }
  }, [loadSnapshot, setDirty]);

  const resizeCanvas = useCallback((w, h) => {
    const cv = canvasRef.current;
    if (!cv) return;
    const t = document.createElement('canvas');
    t.width = cv.width;
    t.height = cv.height;
    t.getContext('2d').drawImage(cv, 0, 0);
    blank(w, h);
    const ctx = cv.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(t, 0, 0);
    pushSnapshot();
  }, [blank, pushSnapshot]);

  const resetCanvas = useCallback((w = 1152, h = 648) => {
    blank(w, h);
    histRef.current = [];
    hiRef.current = -1;
    pushSnapshot();
  }, [blank, pushSnapshot]);

  const loadImageToCanvas = useCallback((img) => {
    blank(img.width, img.height);
    const cv = canvasRef.current;
    const ctx = cv.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(img, 0, 0);
    histRef.current = [];
    hiRef.current = -1;
    pushSnapshot();
  }, [blank, pushSnapshot]);

  // Pos helper
  const getPos = useCallback((e) => {
    const cv = canvasRef.current;
    const r = cv.getBoundingClientRect();
    const W = cv.width;
    const H = cv.height;
    return [(e.clientX - r.left) * W / r.width, (e.clientY - r.top) * H / r.height];
  }, []);

  // Freehand stroke
  const fh = useCallback((x0, y0, x1, y1) => {
    const cv = canvasRef.current;
    const ctx = cv.getContext('2d', { willReadFrequently: true });
    const { tool: currentTool, grad: currentGrad, size: currentSize, width: W, height: H } = configRef.current;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle =
      currentTool === 'eraser'
        ? '#fff'
        : currentGrad.on
        ? mkGrad(ctx, 0, 0, W, H, currentGrad)
        : colRef.current;
    ctx.lineWidth =
      currentTool === 'pencil'
        ? Math.max(1, currentSize / 3)
        : currentTool === 'eraser'
        ? currentSize * 3
        : currentSize * 1.6;
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1 + 0.01, y1);
    ctx.stroke();
  }, []);

  // Color picker
  const pick = useCallback((x, y, right) => {
    const cv = canvasRef.current;
    const ctx = cv.getContext('2d', { willReadFrequently: true });
    const p = ctx.getImageData(x | 0, y | 0, 1, 1).data;
    const hex =
      '#' +
      [0, 1, 2]
        .map((i) => p[i].toString(16).padStart(2, '0'))
        .join('');
    if (right) {
      setC2(hex);
    } else {
      setC1(hex);
    }
  }, [setC1, setC2]);

  // Pointer event handlers
  const handlePointerDown = useCallback((e) => {
    if (e.button > 2) return;
    e.preventDefault();
    const [x, y] = getPos(e);
    const { tool: currentTool, c1: color1, c2: color2, grad: currentGrad, width: W, height: H } = configRef.current;
    colRef.current = e.button === 2 ? color2 : color1;
    othRef.current = e.button === 2 ? color1 : color2;

    if (currentTool === 'bucket') {
      const cv = canvasRef.current;
      const ctx = cv.getContext('2d', { willReadFrequently: true });
      flood(ctx, x, y, colRef.current, W, H, currentGrad);
      pushSnapshot();
      return;
    }

    if (currentTool === 'picker') {
      pick(x, y, e.button === 2);
      return;
    }

    if (currentTool === 'text') {
      onOpenTextInput(x, y, colRef.current);
      return;
    }

    drawingRef.current = true;
    canvasRef.current.setPointerCapture(e.pointerId);
    startPosRef.current = { x, y };
    lastPosRef.current = { x, y };

    if (FREE.includes(currentTool)) {
      fh(x, y, x, y);
    } else {
      const cv = canvasRef.current;
      const ctx = cv.getContext('2d', { willReadFrequently: true });
      snapRef.current = ctx.getImageData(0, 0, cv.width, cv.height);
    }
  }, [getPos, pushSnapshot, pick, onOpenTextInput, fh]);

  const handlePointerMove = useCallback((e) => {
    const [x, y] = getPos(e);
    setPointerPos({ x: x | 0, y: y | 0 });
    if (!drawingRef.current) return;

    const { tool: currentTool, size: currentSize, fm: currentFm, grad: currentGrad } = configRef.current;

    if (FREE.includes(currentTool)) {
      fh(lastPosRef.current.x, lastPosRef.current.y, x, y);
      lastPosRef.current = { x, y };
      return;
    }

    const cv = canvasRef.current;
    const ctx = cv.getContext('2d', { willReadFrequently: true });
    ctx.putImageData(snapRef.current, 0, 0);

    let ex = x,
      ey = y;
    const sx = startPosRef.current.x,
      sy = startPosRef.current.y;

    if (e.shiftKey) {
      const dx = x - sx,
        dy = y - sy;
      if (currentTool === 'line' || currentTool === 'arrow' || currentTool === 'darrow') {
        const a = Math.round(Math.atan2(dy, dx) / (Math.PI / 4)) * (Math.PI / 4),
          n = Math.hypot(dx, dy);
        ex = sx + Math.cos(a) * n;
        ey = sy + Math.sin(a) * n;
      } else {
        const m = Math.max(Math.abs(dx), Math.abs(dy));
        ex = sx + (dx < 0 ? -m : m);
        ey = sy + (dy < 0 ? -m : m);
      }
    }

    drawShape(ctx, currentTool, sx, sy, ex, ey, {
      col: colRef.current,
      oth: othRef.current,
      fm: currentFm,
      size: currentSize,
      grad: currentGrad,
    });
  }, [getPos, fh]);

  const handlePointerUp = useCallback(() => {
    if (!drawingRef.current) return;
    drawingRef.current = false;
    pushSnapshot();
  }, [pushSnapshot]);

  // Initial blank canvas
  useEffect(() => {
    blank(1152, 648);
    const cv = canvasRef.current;
    const ctx = cv.getContext('2d', { willReadFrequently: true });
    histRef.current = [ctx.getImageData(0, 0, 1152, 648)];
    hiRef.current = 0;
    updateUndoRedo();
  }, [blank, updateUndoRedo]);

  return {
    canvasRef,
    width,
    height,
    pointerPos,
    canUndo,
    canRedo,
    undo,
    redo,
    blank,
    resizeCanvas,
    resetCanvas,
    loadImageToCanvas,
    pushSnapshot,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
  };
}
