import React from 'react';
import Icon from './Icon.jsx';
import { PRESETS } from '../lib/gradient.js';

export default function GradientEditor({
  grad,
  c1,
  onChangeGrad,
}) {
  const cssGradPreview = () => {
    const st = grad.stops.join(',');
    return grad.type === 'radial'
      ? 'radial-gradient(circle,' + st + ')'
      : 'linear-gradient(' + (grad.angle + 90) + 'deg,' + st + ')';
  };

  const setOn = (checked) => {
    onChangeGrad({ ...grad, on: checked });
  };

  const autoOn = () => {
    if (!grad.on) {
      return { on: true };
    }
    return {};
  };

  const handleStopChange = (index, color) => {
    const newStops = [...grad.stops];
    newStops[index] = color;
    onChangeGrad({ ...grad, stops: newStops, ...autoOn() });
  };

  const handleRemoveStop = (index) => {
    if (grad.stops.length <= 2) return;
    const newStops = grad.stops.filter((_, i) => i !== index);
    onChangeGrad({ ...grad, stops: newStops, ...autoOn() });
  };

  const handleAddStop = () => {
    if (grad.stops.length >= 6) return;
    onChangeGrad({ ...grad, stops: [...grad.stops, c1], ...autoOn() });
  };

  const handleTypeChange = (type) => {
    onChangeGrad({ ...grad, type, ...autoOn() });
  };

  const handleAngleChange = (angle) => {
    onChangeGrad({ ...grad, angle: Number(angle), ...autoOn() });
  };

  const handlePreset = (stops) => {
    onChangeGrad({ ...grad, stops: [...stops], ...autoOn() });
  };

  return (
    <div className="p-[16px_16px_18px] border-b border-line">
      <div className="flex items-center justify-between mb-2.5">
        <h4 className="m-0 text-[12px] font-semibold text-mut">Gradient</h4>
        <label className="relative w-10 h-[22px] inline-block cursor-pointer" title="Gradient on / off (G)">
          <input
            type="checkbox"
            className="sr-only"
            checked={grad.on}
            onChange={(e) => setOn(e.target.checked)}
            aria-label="Use gradient"
          />
          <i
            className={`absolute inset-0 rounded-full transition-colors duration-150 ${
              grad.on ? 'bg-gradient-to-br from-acc to-acc2' : 'bg-line'
            } after:content-[''] after:absolute after:left-[3px] after:top-[3px] after:w-4 after:h-4 after:rounded-full after:bg-white after:shadow-[0_1px_3px_rgba(0,0,0,0.3)] after:transition-transform after:duration-150 ${
              grad.on ? 'after:translate-x-[18px]' : ''
            }`}
          />
        </label>
      </div>

      <div
        className="h-[34px] rounded-[10px] border border-line mb-3"
        style={{ background: cssGradPreview() }}
      />

      {/* Stops */}
      <div className="flex flex-wrap gap-2.5 items-center mb-3">
        {grad.stops.map((color, i) => (
          <div key={i} className="relative w-[34px] h-[34px]">
            <label
              className="block w-full h-full rounded-full border-2 border-chrome shadow-[0_0_0_1.5px_var(--line)] cursor-pointer relative overflow-hidden"
              style={{ background: color }}
            >
              <input
                type="color"
                className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                value={color}
                onChange={(e) => handleStopChange(i, e.target.value)}
              />
            </label>
            {grad.stops.length > 2 && (
              <button
                type="button"
                className="absolute -right-1.5 -top-1.5 w-[17px] h-[17px] rounded-full border border-line bg-chrome text-mut text-[12px] leading-none p-0 grid place-items-center hover:text-[#e5484d]"
                title="Remove color"
                aria-label="Remove color"
                onClick={() => handleRemoveStop(i)}
              >
                ×
              </button>
            )}
          </div>
        ))}
        {grad.stops.length < 6 && (
          <button
            type="button"
            className="w-[34px] h-[34px] rounded-full border-[1.5px] border-dashed border-mut bg-transparent text-mut grid place-items-center hover:text-acc hover:border-acc"
            title="Add color"
            aria-label="Add color"
            onClick={handleAddStop}
          >
            <Icon name="plus" />
          </button>
        )}
      </div>

      {/* Linear / Radial toggle */}
      <div className="grid grid-cols-2 bg-chrome2 border border-line rounded-[11px] p-[3px] gap-[3px] mb-3">
        <button
          type="button"
          className={`h-8 border-0 bg-transparent rounded-[8px] flex flex-row items-center justify-center gap-1 text-[11.5px] font-[550] ${
            grad.type === 'linear'
              ? 'bg-chrome text-acc shadow-[0_1px_4px_rgba(20,26,51,0.16)]'
              : 'text-mut'
          }`}
          onClick={() => handleTypeChange('linear')}
        >
          Linear
        </button>
        <button
          type="button"
          className={`h-8 border-0 bg-transparent rounded-[8px] flex flex-row items-center justify-center gap-1 text-[11.5px] font-[550] ${
            grad.type === 'radial'
              ? 'bg-chrome text-acc shadow-[0_1px_4px_rgba(20,26,51,0.16)]'
              : 'text-mut'
          }`}
          onClick={() => handleTypeChange('radial')}
        >
          Radial
        </button>
      </div>

      {/* Angle slider */}
      {grad.type !== 'radial' && (
        <div className="flex items-center gap-3">
          <span className="text-[13px] text-ink">Angle</span>
          <input
            type="range"
            min="0"
            max="360"
            value={grad.angle}
            className="flex-1 accent-acc h-1"
            onChange={(e) => handleAngleChange(e.target.value)}
          />
          <b className="min-w-[34px] text-right tabular-nums text-ink text-[13px]">{grad.angle}°</b>
        </div>
      )}

      {/* Presets */}
      <div className="grid grid-cols-4 gap-2 mt-3.5">
        {PRESETS.map(([name, st]) => (
          <button
            key={name}
            type="button"
            title={name}
            aria-label={`${name} gradient`}
            className="h-7 rounded-[8px] border border-line cursor-pointer p-0 hover:outline-2 hover:outline-acc hover:outline-offset-1"
            style={{ background: `linear-gradient(90deg, ${st.join(',')})` }}
            onClick={() => handlePreset(st)}
          />
        ))}
      </div>

      <p className="m-0 mt-2.5 text-mut text-[12px] leading-[1.4]">
        Shapes with Both or Solid style are filled with the gradient. Outline style gets a gradient outline. Brush, pencil, text and Fill also use it.
      </p>
    </div>
  );
}
