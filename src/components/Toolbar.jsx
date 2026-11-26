import React from 'react';
import Icon from './Icon.jsx';
import { SHAPES } from '../lib/shapes.js';

export const TOOLS = [
  ['select', 'Select & Move (M)'],
  ['pencil', 'Pencil (P)'],
  ['brush', 'Brush (B)'],
  ['eraser', 'Eraser (E)'],
  ['bucket', 'Fill with color (F)'],
  ['picker', 'Color picker (I)'],
  ['text', 'Text (T)'],
];

export default function Toolbar({ currentTool, onSelectTool, is3d, onToggle3d }) {
  return (
    <aside
      id="tb"
      className="[grid-area:tb] bg-chrome border-r border-line p-3 overflow-y-auto flex flex-col gap-4 select-none"
    >
      {/* 1. Tools Section */}
      <div>
        <div className="flex items-center justify-between mb-2 px-0.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-mut">Tools</span>
        </div>
        <div className="grid grid-cols-3 max-[900px]:grid-cols-2 gap-1.5">
          {TOOLS.map(([id, nm]) => {
            const isOn = currentTool === id;
            return (
              <button
                key={id}
                type="button"
                className={`h-9 w-full rounded-[10px] border grid place-items-center transition-all duration-150 ${
                  isOn
                    ? 'bg-gradient-to-br from-acc to-acc2 text-white border-transparent shadow-[0_4px_12px_rgba(58,70,232,0.38)] scale-[1.02]'
                    : 'bg-transparent text-ink border-transparent hover:bg-accsoft hover:text-acc hover:border-line'
                }`}
                title={nm}
                aria-label={nm}
                onClick={() => onSelectTool(id)}
              >
                <Icon name={id} />
              </button>
            );
          })}
        </div>
      </div>

      <div className="h-[1px] bg-line mx-1" />

      {/* 2. Shapes & 2D / 3D Mode Switcher */}
      <div>
        <div className="flex items-center justify-between mb-2.5 px-0.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-mut">Shapes</span>
          
          {/* Simple, Clean 2D / 3D Switch */}
          <div className="flex bg-chrome2 border border-line rounded-[8px] p-[2px] gap-[2px]">
            <button
              type="button"
              className={`px-2.5 py-0.5 text-[11px] font-bold rounded-[6px] transition-all duration-150 ${
                !is3d
                  ? 'bg-chrome text-acc shadow-[0_1px_3px_rgba(20,26,51,0.12)]'
                  : 'text-mut hover:text-ink'
              }`}
              onClick={() => onToggle3d(false)}
            >
              2D
            </button>
            <button
              type="button"
              className={`px-2.5 py-0.5 text-[11px] font-bold rounded-[6px] transition-all duration-150 ${
                is3d
                  ? 'bg-gradient-to-br from-acc to-acc2 text-white shadow-[0_1px_4px_rgba(58,70,232,0.35)]'
                  : 'text-mut hover:text-ink'
              }`}
              onClick={() => onToggle3d(true)}
            >
              3D
            </button>
          </div>
        </div>

        {/* Unified Shapes Grid */}
        <div className="grid grid-cols-3 max-[900px]:grid-cols-2 gap-1.5">
          {SHAPES.map(([id, nm]) => {
            const isOn = currentTool === id;
            return (
              <button
                key={id}
                type="button"
                className={`h-9 w-full rounded-[10px] border grid place-items-center transition-all duration-150 ${
                  isOn
                    ? 'bg-gradient-to-br from-acc to-acc2 text-white border-transparent shadow-[0_4px_12px_rgba(58,70,232,0.38)] scale-[1.02]'
                    : 'bg-transparent text-ink border-transparent hover:bg-accsoft hover:text-acc hover:border-line'
                }`}
                title={is3d ? `3D ${nm}` : nm}
                aria-label={nm}
                onClick={() => onSelectTool(id)}
              >
                <Icon name={id} />
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
