import React, { useState, useEffect } from 'react';
import GradientEditor from './GradientEditor.jsx';
import Icon from './Icon.jsx';
import { cssGrad } from '../lib/gradient.js';

const COL = [
  '#000000', '#7f7f7f', '#880015', '#ed1c24', '#ff7f27',
  '#fff200', '#22b14c', '#00a2e8', '#3f48cc', '#a349a4',
  '#ffffff', '#c3c3c3', '#b97a57', '#ffaec9', '#ffc90e',
  '#efe4b0', '#b5e61d', '#99d9ea', '#7092be', '#c8bfe7',
];

export default function RightPanel({
  c1,
  c2,
  onChangeColor1,
  onChangeColor2,
  onSwapColors,
  grad,
  onChangeGrad,
  size,
  onChangeSize,
  fm,
  onChangeFm,
  width,
  height,
  onApplyResize,
}) {
  const [wInput, setWInput] = useState(width);
  const [hInput, setHInput] = useState(height);

  useEffect(() => {
    setWInput(width);
    setHInput(height);
  }, [width, height]);

  const previewDotSize = Math.min(70, Math.max(2, size * 1.6));
  const previewBackground = grad.on ? cssGrad(grad) : c1;

  const handleApplyResize = () => {
    const w = Math.min(4000, Math.max(50, Number(wInput) || width));
    const h = Math.min(4000, Math.max(50, Number(hInput) || height));
    onApplyResize(w, h);
  };

  return (
    <aside
      id="pn"
      className="[grid-area:pn] bg-chrome border-l border-line max-[900px]:border-l-0 max-[900px]:border-t overflow-y-auto"
    >
      {/* Colors */}
      <div className="p-[16px_16px_18px] border-b border-line">
        <h4 className="m-0 mb-2 text-[12px] font-semibold text-mut">Colors</h4>
        <div className="flex items-center gap-2.5 mb-3.5">
          <div className="flex">
            <label
              className="relative w-[52px] h-[52px] rounded-full border-[3px] border-chrome shadow-[0_0_0_1.5px_var(--line),0_4px_10px_rgba(20,26,51,0.18)] cursor-pointer shrink-0 z-[1]"
              style={{ background: c1 }}
            >
              <input
                type="color"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                value={c1}
                onChange={(e) => onChangeColor1(e.target.value)}
              />
            </label>
            <label
              className="relative w-10 h-10 rounded-full border-[3px] border-chrome shadow-[0_0_0_1.5px_var(--line),0_4px_10px_rgba(20,26,51,0.18)] cursor-pointer shrink-0 -ml-[22px] mt-[22px] z-0"
              style={{ background: c2 }}
            >
              <input
                type="color"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                value={c2}
                onChange={(e) => onChangeColor2(e.target.value)}
              />
            </label>
          </div>
          <div className="flex flex-col gap-0.5 ml-0.5">
            <b className="font-semibold text-ink text-[13px]">Outline color</b>
            <span className="text-mut text-[12px]">Fill color behind it</span>
          </div>
          <button
            type="button"
            className="ml-auto w-8 h-8 rounded-[9px] border border-line bg-chrome grid place-items-center text-mut hover:text-acc hover:bg-accsoft"
            title="Swap colors"
            onClick={onSwapColors}
          >
            <Icon name="swap" />
          </button>
        </div>

        <div className="grid grid-cols-10 gap-1.5">
          {COL.map((c) => (
            <i
              key={c}
              title={c}
              className="aspect-square rounded-full cursor-pointer shadow-[inset_0_0_0_1px_rgba(20,26,51,0.22)] transition-transform duration-100 hover:scale-[1.22]"
              style={{ background: c }}
              onClick={() => onChangeColor1(c)}
              onContextMenu={(e) => {
                e.preventDefault();
                onChangeColor2(c);
              }}
            />
          ))}
        </div>
        <p className="m-0 mt-2.5 text-mut text-[12px]">
          Left click sets the outline color. Right click sets the fill color.
        </p>
      </div>

      {/* Gradient */}
      <GradientEditor
        grad={grad}
        c1={c1}
        onChangeGrad={onChangeGrad}
      />

      {/* Brush size */}
      <div className="p-[16px_16px_18px] border-b border-line">
        <h4 className="m-0 mb-2 text-[12px] font-semibold text-mut">Brush size</h4>
        <div className="h-[76px] rounded-[12px] bg-chrome2 border border-line grid place-items-center mb-3 overflow-hidden">
          <i
            className="block rounded-full max-w-[70px] max-h-[70px]"
            style={{
              width: previewDotSize + 'px',
              height: previewDotSize + 'px',
              background: previewBackground,
            }}
          />
        </div>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min="1"
            max="40"
            value={size}
            className="flex-1 accent-acc h-1"
            onChange={(e) => onChangeSize(Number(e.target.value))}
          />
          <b className="min-w-[34px] text-right tabular-nums text-ink text-[13px]">{size} px</b>
        </div>
      </div>

      {/* Shape style */}
      <div className="p-[16px_16px_18px] border-b border-line">
        <h4 className="m-0 mb-2 text-[12px] font-semibold text-mut">Shape style</h4>
        <div className="grid grid-cols-3 bg-chrome2 border border-line rounded-[11px] p-[3px] gap-[3px]">
          <button
            type="button"
            className={`h-[42px] border-0 bg-transparent rounded-[8px] flex flex-col items-center justify-center gap-0.5 text-[11.5px] font-[550] ${
              fm === 'outline'
                ? 'bg-chrome text-acc shadow-[0_1px_4px_rgba(20,26,51,0.16)]'
                : 'text-mut'
            }`}
            onClick={() => onChangeFm('outline')}
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0 fill-none stroke-currentColor stroke-[1.8] stroke-linecap-round stroke-linejoin-round">
              <rect x="4" y="5" width="16" height="14" rx="2" />
            </svg>
            Outline
          </button>
          <button
            type="button"
            className={`h-[42px] border-0 bg-transparent rounded-[8px] flex flex-col items-center justify-center gap-0.5 text-[11.5px] font-[550] ${
              fm === 'both'
                ? 'bg-chrome text-acc shadow-[0_1px_4px_rgba(20,26,51,0.16)]'
                : 'text-mut'
            }`}
            onClick={() => onChangeFm('both')}
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0 fill-none stroke-currentColor stroke-[1.8] stroke-linecap-round stroke-linejoin-round">
              <rect x="4" y="5" width="16" height="14" rx="2" fill="currentColor" fillOpacity=".3" />
            </svg>
            Both
          </button>
          <button
            type="button"
            className={`h-[42px] border-0 bg-transparent rounded-[8px] flex flex-col items-center justify-center gap-0.5 text-[11.5px] font-[550] ${
              fm === 'fill'
                ? 'bg-chrome text-acc shadow-[0_1px_4px_rgba(20,26,51,0.16)]'
                : 'text-mut'
            }`}
            onClick={() => onChangeFm('fill')}
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0 fill-none stroke-currentColor stroke-[1.8] stroke-linecap-round stroke-linejoin-round">
              <rect x="4" y="5" width="16" height="14" rx="2" fill="currentColor" />
            </svg>
            Solid
          </button>
        </div>
      </div>

      {/* Canvas size */}
      <div className="p-[16px_16px_18px] border-b border-line">
        <h4 className="m-0 mb-2 text-[12px] font-semibold text-mut">Canvas size</h4>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min="50"
            max="4000"
            aria-label="Width"
            value={wInput}
            onChange={(e) => setWInput(e.target.value)}
            className="w-full min-w-0 h-9 rounded-[9px] border border-line bg-chrome2 text-ink px-2.5 font-inherit focus-visible:outline-2 focus-visible:outline-acc"
          />
          <span className="text-ink">×</span>
          <input
            type="number"
            min="50"
            max="4000"
            aria-label="Height"
            value={hInput}
            onChange={(e) => setHInput(e.target.value)}
            className="w-full min-w-0 h-9 rounded-[9px] border border-line bg-chrome2 text-ink px-2.5 font-inherit focus-visible:outline-2 focus-visible:outline-acc"
          />
          <button
            type="button"
            onClick={handleApplyResize}
            className="h-9 px-3.5 rounded-[9px] border border-line bg-chrome text-ink font-semibold hover:bg-accsoft hover:text-acc"
          >
            Apply
          </button>
        </div>
      </div>

      {/* Shortcuts */}
      <div className="p-[16px_16px_18px] border-b-0">
        <h4 className="m-0 mb-2 text-[12px] font-semibold text-mut">Shortcuts</h4>
        <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-mut text-[12px]">
          <span><kbd className="font-[600] text-[11px] bg-chrome2 border border-line border-b-2 rounded-[5px] px-1.5 py-[1px] text-ink">M</kbd> Select / Move</span>
          <span><kbd className="font-[600] text-[11px] bg-chrome2 border border-line border-b-2 rounded-[5px] px-1.5 py-[1px] text-ink">P</kbd> Pencil</span>
          <span><kbd className="font-[600] text-[11px] bg-chrome2 border border-line border-b-2 rounded-[5px] px-1.5 py-[1px] text-ink">B</kbd> Brush</span>
          <span><kbd className="font-[600] text-[11px] bg-chrome2 border border-line border-b-2 rounded-[5px] px-1.5 py-[1px] text-ink">E</kbd> Eraser</span>
          <span><kbd className="font-[600] text-[11px] bg-chrome2 border border-line border-b-2 rounded-[5px] px-1.5 py-[1px] text-ink">F</kbd> Fill</span>
          <span><kbd className="font-[600] text-[11px] bg-chrome2 border border-line border-b-2 rounded-[5px] px-1.5 py-[1px] text-ink">I</kbd> Picker</span>
          <span><kbd className="font-[600] text-[11px] bg-chrome2 border border-line border-b-2 rounded-[5px] px-1.5 py-[1px] text-ink">T</kbd> Text</span>
          <span><kbd className="font-[600] text-[11px] bg-chrome2 border border-line border-b-2 rounded-[5px] px-1.5 py-[1px] text-ink">[</kbd> <kbd className="font-[600] text-[11px] bg-chrome2 border border-line border-b-2 rounded-[5px] px-1.5 py-[1px] text-ink">]</kbd> Size</span>
          <span><kbd className="font-[600] text-[11px] bg-chrome2 border border-line border-b-2 rounded-[5px] px-1.5 py-[1px] text-ink">X</kbd> Swap colors</span>
          <span><kbd className="font-[600] text-[11px] bg-chrome2 border border-line border-b-2 rounded-[5px] px-1.5 py-[1px] text-ink">G</kbd> Gradient on / off</span>
          <span><kbd className="font-[600] text-[11px] bg-chrome2 border border-line border-b-2 rounded-[5px] px-1.5 py-[1px] text-ink">Ctrl Z</kbd> Undo</span>
          <span><kbd className="font-[600] text-[11px] bg-chrome2 border border-line border-b-2 rounded-[5px] px-1.5 py-[1px] text-ink">Ctrl Y</kbd> Redo</span>
          <span><kbd className="font-[600] text-[11px] bg-chrome2 border border-line border-b-2 rounded-[5px] px-1.5 py-[1px] text-ink">Ctrl S</kbd> Save to History</span>
          <span><kbd className="font-[600] text-[11px] bg-chrome2 border border-line border-b-2 rounded-[5px] px-1.5 py-[1px] text-ink">Ctrl Shift S</kbd> Save a copy</span>
          <span><kbd className="font-[600] text-[11px] bg-chrome2 border border-line border-b-2 rounded-[5px] px-1.5 py-[1px] text-ink">Ctrl E</kbd> Download PNG</span>
          <span><kbd className="font-[600] text-[11px] bg-chrome2 border border-line border-b-2 rounded-[5px] px-1.5 py-[1px] text-ink">Alt H</kbd> History</span>
          <span><kbd className="font-[600] text-[11px] bg-chrome2 border border-line border-b-2 rounded-[5px] px-1.5 py-[1px] text-ink">Ctrl O</kbd> Open image</span>
          <span><kbd className="font-[600] text-[11px] bg-chrome2 border border-line border-b-2 rounded-[5px] px-1.5 py-[1px] text-ink">Alt N</kbd> New canvas</span>
          <span><kbd className="font-[600] text-[11px] bg-chrome2 border border-line border-b-2 rounded-[5px] px-1.5 py-[1px] text-ink">Ctrl +</kbd> <kbd className="font-[600] text-[11px] bg-chrome2 border border-line border-b-2 rounded-[5px] px-1.5 py-[1px] text-ink">-</kbd> Zoom</span>
          <span><kbd className="font-[600] text-[11px] bg-chrome2 border border-line border-b-2 rounded-[5px] px-1.5 py-[1px] text-ink">Ctrl 0</kbd> Zoom 100%</span>
          <span><kbd className="font-[600] text-[11px] bg-chrome2 border border-line border-b-2 rounded-[5px] px-1.5 py-[1px] text-ink">Shift</kbd> Straight / equal</span>
        </div>
      </div>
    </aside>
  );
}
