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

  // Active floating shape element
  // { x, y, w, h, rotation: 0, offscreenCanvas }
  const [activeElement, setActiveElement] = useState(null);
  const activeElementRef = useRef(null);
  const transformRef = useRef(null);
  // { mode: 'move'|'resize'|'rotate', handle, startX, startY, origX, origY, origW, origH, origRot, centerX, centerY }

  // Manual Selection box state
  const [selection, setSelection] = useState(null);
  const selectionRef = useRef(null);
  const selectionDragRef = useRef(null);

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

  // Commit any active floating element down to canvas
  const commitActiveElement = useCallback(() => {
    const act = activeElementRef.current;
    if (act && act.offscreenCanvas) {
      const cv = canvasRef.current;
      if (cv) {
        const ctx = cv.getContext('2d', { willReadFrequently: true });
        ctx.save();
        const cx = act.x + act.w / 2;
        const cy = act.y + act.h / 2;
        ctx.translate(cx, cy);
        if (act.rotation) {
          ctx.rotate((act.rotation * Math.PI) / 180);
        }
        ctx.drawImage(act.offscreenCanvas, -act.w / 2, -act.h / 2, act.w, act.h);
        ctx.restore();
        pushSnapshot();
      }
    }
    activeElementRef.current = null;
    setActiveElement(null);
  }, [pushSnapshot]);

  const commitSelection = useCallback(() => {
    commitActiveElement();
    const sel = selectionRef.current;
    if (sel && sel.imgData && sel.isFloating) {
      const cv = canvasRef.current;
      if (cv) {
        const ctx = cv.getContext('2d', { willReadFrequently: true });
        const tempC = document.createElement('canvas');
        tempC.width = sel.imgData.width;
        tempC.height = sel.imgData.height;
        tempC.getContext('2d').putImageData(sel.imgData, 0, 0);
        ctx.drawImage(tempC, Math.round(sel.x), Math.round(sel.y));
        pushSnapshot();
      }
    }
    selectionRef.current = null;
    setSelection(null);
  }, [commitActiveElement, pushSnapshot]);

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
    selectionRef.current = null;
    setSelection(null);
    activeElementRef.current = null;
    setActiveElement(null);
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
    selectionRef.current = null;
    setSelection(null);
    activeElementRef.current = null;
    setActiveElement(null);
    updateUndoRedo();
  }, [updateUndoRedo]);

  const undo = useCallback(() => {
    commitSelection();
    if (hiRef.current > 0) {
      hiRef.current--;
      loadSnapshot(histRef.current[hiRef.current]);
      setDirty(true);
    }
  }, [commitSelection, loadSnapshot, setDirty]);

  const redo = useCallback(() => {
    commitSelection();
    if (hiRef.current < histRef.current.length - 1) {
      hiRef.current++;
      loadSnapshot(histRef.current[hiRef.current]);
      setDirty(true);
    }
  }, [commitSelection, loadSnapshot, setDirty]);

  const resizeCanvas = useCallback((w, h) => {
    commitSelection();
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
  }, [commitSelection, blank, pushSnapshot]);

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

    // 1. ACTIVE ELEMENT: CHECK TRANSFORM HANDLES (ROTATE, RESIZE, MOVE)
    const act = activeElementRef.current;
    if (act) {
      const cx = act.x + act.w / 2;
      const cy = act.y + act.h / 2;
      const rad = -((act.rotation || 0) * Math.PI) / 180;
      
      // Transform clicked point to unrotated coordinate space around center
      const dx = x - cx;
      const dy = y - cy;
      const unrotX = cx + dx * Math.cos(rad) - dy * Math.sin(rad);
      const unrotY = cy + dx * Math.sin(rad) + dy * Math.cos(rad);

      const rTop = act.y - 25; // rotation handle
      const hitRadius = 14;

      // A) Check Rotation Handle (Top circular handle)
      if (Math.hypot(unrotX - cx, unrotY - rTop) <= hitRadius) {
        transformRef.current = {
          mode: 'rotate',
          origRot: act.rotation || 0,
          centerX: cx,
          centerY: cy,
          startAngle: Math.atan2(y - cy, x - cx),
        };
        canvasRef.current.setPointerCapture(e.pointerId);
        return;
      }

      // B) Check Resize Handles (nw, ne, se, sw)
      const handles = {
        nw: [act.x, act.y],
        ne: [act.x + act.w, act.y],
        se: [act.x + act.w, act.y + act.h],
        sw: [act.x, act.y + act.h],
      };

      for (const [key, [hx, hy]] of Object.entries(handles)) {
        if (Math.hypot(unrotX - hx, unrotY - hy) <= hitRadius) {
          transformRef.current = {
            mode: 'resize',
            handle: key,
            origX: act.x,
            origY: act.y,
            origW: act.w,
            origH: act.h,
            startX: unrotX,
            startY: unrotY,
            centerX: cx,
            centerY: cy,
            rotation: act.rotation || 0,
          };
          canvasRef.current.setPointerCapture(e.pointerId);
          return;
        }
      }

      // C) Check Body click (Move)
      if (unrotX >= act.x && unrotX <= act.x + act.w && unrotY >= act.y && unrotY <= act.y + act.h) {
        transformRef.current = {
          mode: 'move',
          startX: x,
          startY: y,
          origX: act.x,
          origY: act.y,
        };
        canvasRef.current.setPointerCapture(e.pointerId);
        return;
      }

      // Clicked outside -> Commit active shape!
      commitActiveElement();
    }

    // 2. SELECT / MOVE TOOL LOGIC
    if (currentTool === 'select') {
      const curSel = selectionRef.current;
      if (curSel && x >= curSel.x && x <= curSel.x + curSel.w && y >= curSel.y && y <= curSel.y + curSel.h) {
        const cv = canvasRef.current;
        const ctx = cv.getContext('2d', { willReadFrequently: true });
        
        if (!curSel.isFloating) {
          const rx = Math.round(curSel.x);
          const ry = Math.round(curSel.y);
          const rw = Math.round(curSel.w);
          const rh = Math.round(curSel.h);
          const imgData = ctx.getImageData(rx, ry, rw, rh);
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(rx, ry, rw, rh);
          curSel.imgData = imgData;
          curSel.isFloating = true;
          selectionRef.current = { ...curSel };
          setSelection({ ...curSel });
        }

        selectionDragRef.current = {
          mode: 'moving',
          startX: x,
          startY: y,
          origX: curSel.x,
          origY: curSel.y,
        };
        cv.setPointerCapture(e.pointerId);
        return;
      }

      if (curSel) {
        commitSelection();
      }

      const cv = canvasRef.current;
      cv.setPointerCapture(e.pointerId);
      selectionDragRef.current = {
        mode: 'creating',
        startX: x,
        startY: y,
      };
      setSelection({
        x,
        y,
        w: 0,
        h: 0,
        isFloating: false,
        imgData: null,
      });
      selectionRef.current = null;
      return;
    }

    if (selectionRef.current) {
      commitSelection();
    }

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
  }, [getPos, commitActiveElement, commitSelection, pushSnapshot, pick, onOpenTextInput, fh]);

  const handlePointerMove = useCallback((e) => {
    const [x, y] = getPos(e);
    setPointerPos({ x: x | 0, y: y | 0 });

    // 1. TRANSFORM ACTIVE ELEMENT (MOVE, RESIZE, ROTATE)
    if (transformRef.current && activeElementRef.current) {
      const t = transformRef.current;
      const act = activeElementRef.current;

      if (t.mode === 'move') {
        const dx = x - t.startX;
        const dy = y - t.startY;
        const nextAct = {
          ...act,
          x: t.origX + dx,
          y: t.origY + dy,
        };
        activeElementRef.current = nextAct;
        setActiveElement(nextAct);
      } else if (t.mode === 'rotate') {
        const curAngle = Math.atan2(y - t.centerY, x - t.centerX);
        const deltaDeg = ((curAngle - t.startAngle) * 180) / Math.PI;
        const nextRot = Math.round(t.origRot + deltaDeg) % 360;
        const nextAct = {
          ...act,
          rotation: nextRot,
        };
        activeElementRef.current = nextAct;
        setActiveElement(nextAct);
      } else if (t.mode === 'resize') {
        const rad = -((t.rotation || 0) * Math.PI) / 180;
        const dx = x - t.centerX;
        const dy = y - t.centerY;
        const unrotX = t.centerX + dx * Math.cos(rad) - dy * Math.sin(rad);
        const unrotY = t.centerY + dx * Math.sin(rad) + dy * Math.cos(rad);

        let nwX = t.origX;
        let nwY = t.origY;
        let nwW = t.origW;
        let nwH = t.origH;

        const diffX = unrotX - t.startX;
        const diffY = unrotY - t.startY;

        if (t.handle === 'se') {
          nwW = Math.max(15, t.origW + diffX);
          nwH = Math.max(15, t.origH + diffY);
        } else if (t.handle === 'sw') {
          nwW = Math.max(15, t.origW - diffX);
          nwH = Math.max(15, t.origH + diffY);
          nwX = t.origX + (t.origW - nwW);
        } else if (t.handle === 'ne') {
          nwW = Math.max(15, t.origW + diffX);
          nwH = Math.max(15, t.origH - diffY);
          nwY = t.origY + (t.origH - nwH);
        } else if (t.handle === 'nw') {
          nwW = Math.max(15, t.origW - diffX);
          nwH = Math.max(15, t.origH - diffY);
          nwX = t.origX + (t.origW - nwW);
          nwY = t.origY + (t.origH - nwH);
        }

        const nextAct = {
          ...act,
          x: nwX,
          y: nwY,
          w: nwW,
          h: nwH,
        };
        activeElementRef.current = nextAct;
        setActiveElement(nextAct);
      }
      return;
    }

    const { tool: currentTool, size: currentSize, fm: currentFm, grad: currentGrad } = configRef.current;

    // 2. Select tool move logic
    if (currentTool === 'select') {
      const drag = selectionDragRef.current;
      if (!drag) return;

      if (drag.mode === 'creating') {
        const left = Math.min(drag.startX, x);
        const top = Math.min(drag.startY, y);
        const width = Math.abs(x - drag.startX);
        const height = Math.abs(y - drag.startY);
        const nextSel = {
          x: left,
          y: top,
          w: width,
          h: height,
          isFloating: false,
          imgData: null,
        };
        setSelection(nextSel);
      } else if (drag.mode === 'moving') {
        const curSel = selectionRef.current;
        if (!curSel) return;
        const dx = x - drag.startX;
        const dy = y - drag.startY;
        const nextSel = {
          ...curSel,
          x: drag.origX + dx,
          y: drag.origY + dy,
        };
        selectionRef.current = nextSel;
        setSelection(nextSel);
      }
      return;
    }

    if (!drawingRef.current) return;

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

  const handlePointerUp = useCallback((e) => {
    // 1. Release active transform
    if (transformRef.current) {
      transformRef.current = null;
      return;
    }

    const { tool: currentTool } = configRef.current;

    // 2. Select tool finish
    if (currentTool === 'select') {
      const drag = selectionDragRef.current;
      if (drag) {
        if (drag.mode === 'creating') {
          setSelection((cur) => {
            if (cur && cur.w >= 4 && cur.h >= 4) {
              const finalized = {
                x: cur.x,
                y: cur.y,
                w: cur.w,
                h: cur.h,
                isFloating: false,
                imgData: null,
              };
              selectionRef.current = finalized;
              return finalized;
            } else {
              selectionRef.current = null;
              return null;
            }
          });
        }
        selectionDragRef.current = null;
      }
      return;
    }

    if (!drawingRef.current) return;
    drawingRef.current = false;

    // 3. IF A SHAPE WAS JUST DRAWN, CREATE TRANSFORMABLE ACTIVE ELEMENT
    if (!FREE.includes(currentTool)) {
      const [x, y] = getPos(e);
      const sx = startPosRef.current.x;
      const sy = startPosRef.current.y;
      const left = Math.min(sx, x);
      const right = Math.max(sx, x);
      const top = Math.min(sy, y);
      const bottom = Math.max(sy, y);
      const padding = Math.max(10, (configRef.current.size || 4) * 2);

      const boundX = Math.max(0, Math.floor(left - padding));
      const boundY = Math.max(0, Math.floor(top - padding));
      const boundW = Math.min(canvasRef.current.width - boundX, Math.ceil(right - left + padding * 2));
      const boundH = Math.min(canvasRef.current.height - boundY, Math.ceil(bottom - top + padding * 2));

      if (boundW > 10 && boundH > 10) {
        const cv = canvasRef.current;
        const ctx = cv.getContext('2d', { willReadFrequently: true });
        
        // Grab what was just drawn
        const drawnData = ctx.getImageData(boundX, boundY, boundW, boundH);
        
        // Restore canvas to before the shape was drawn
        ctx.putImageData(snapRef.current, 0, 0);

        // Store into offscreen canvas for crisp rotating & resizing
        const offC = document.createElement('canvas');
        offC.width = boundW;
        offC.height = boundH;
        offC.getContext('2d').putImageData(drawnData, 0, 0);

        const newActive = {
          x: boundX,
          y: boundY,
          w: boundW,
          h: boundH,
          rotation: 0,
          offscreenCanvas: offC,
        };
        activeElementRef.current = newActive;
        setActiveElement(newActive);
        return;
      }
    }

    pushSnapshot();
  }, [getPos, pushSnapshot]);

  // Initial blank canvas
  useEffect(() => {
    blank(1152, 648);
    const cv = canvasRef.current;
    const ctx = cv.getContext('2d', { willReadFrequently: true });
    histRef.current = [ctx.getImageData(0, 0, 1152, 648)];
    hiRef.current = 0;
    updateUndoRedo();
  }, [blank, updateUndoRedo]);

  // Programmatically create an active element (e.g. from committed Text)
  const createActiveElement = useCallback((offC, x, y, w, h) => {
    commitSelection();
    const newActive = {
      x,
      y,
      w,
      h,
      rotation: 0,
      offscreenCanvas: offC,
    };
    activeElementRef.current = newActive;
    setActiveElement(newActive);
  }, [commitSelection]);

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
    selection,
    commitSelection,
    activeElement,
    commitActiveElement,
    createActiveElement,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
  };
}
