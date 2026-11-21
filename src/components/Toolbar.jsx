import React from 'react';
import Icon from './Icon.jsx';
import { SHAPES } from '../lib/shapes.js';

export const TOOLS = [
  ['pencil', 'Pencil (P)'],
  ['brush', 'Brush (B)'],
  ['eraser', 'Eraser (E)'],
  ['bucket', 'Fill with color (F)'],
  ['picker', 'Color picker (I)'],
  ['text', 'Text (T)'],
];

export default function Toolbar({ currentTool, onSelectTool }) {
  return (
    <aside
      id="tb"
      className="[grid-area:tb] bg-chrome border-r border-line p-[12px_10px] overflow-y-auto"
    >
      <h4 className="m-0 mb-2 text-[12px] font-semibold text-mut">Tools</h4>
      <div className="grid grid-cols-3 max-[900px]:grid-cols-2 gap-1.5 mb-3.5">
        {TOOLS.map(([id, nm]) => {
          const isOn = currentTool === id;
          return (
            <button
              key={id}
              type="button"
              className={`h-9 rounded-[10px] border border-transparent grid place-items-center transition-colors duration-120 ${
                isOn
                  ? 'bg-gradient-to-br from-acc to-acc2 text-white shadow-[0_4px_12px_rgba(58,70,232,0.4)]'
                  : 'bg-transparent text-ink hover:bg-accsoft hover:text-acc'
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

      <div className="h-[1px] bg-line my-0.5 mb-3" />

      <h4 className="m-0 mb-2 text-[12px] font-semibold text-mut">Shapes</h4>
      <div className="grid grid-cols-3 max-[900px]:grid-cols-2 gap-1.5 mb-3.5">
        {SHAPES.map(([id, nm]) => {
          const isOn = currentTool === id;
          return (
            <button
              key={id}
              type="button"
              className={`h-9 rounded-[10px] border border-transparent grid place-items-center transition-colors duration-120 ${
                isOn
                  ? 'bg-gradient-to-br from-acc to-acc2 text-white shadow-[0_4px_12px_rgba(58,70,232,0.4)]'
                  : 'bg-transparent text-ink hover:bg-accsoft hover:text-acc'
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
    </aside>
  );
}
