import React, { useEffect, useRef } from 'react';

export default function CanvasArea({
  canvasRef,
  width,
  height,
  zoom,
  textInput,
  onTextInputKeyDown,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onPointerCancel,
}) {
  const textInputRef = useRef(null);

  useEffect(() => {
    if (textInput) {
      setTimeout(() => {
        textInputRef.current?.focus();
      }, 0);
    }
  }, [textInput]);

  return (
    <section
      id="ws"
      className="[grid-area:ws] overflow-auto p-7 bg-ws bg-[radial-gradient(var(--dot)_1px,transparent_1.2px)] [background-size:20px_20px] min-w-0"
    >
      <div
        id="wrap"
        className="relative block w-max mx-auto shadow-sh bg-white leading-none rounded-[3px]"
      >
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          style={{
            width: width * zoom + 'px',
            height: height * zoom + 'px',
          }}
          className="block cursor-crosshair touch-none bg-white rounded-[3px]"
          onContextMenu={(e) => e.preventDefault()}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerCancel}
        />

        {textInput && (
          <input
            ref={textInputRef}
            type="text"
            className="absolute border border-dashed border-[#3a46e8] bg-transparent outline-none min-w-[120px] p-0 m-0 leading-[1.2] font-[system-ui,'Segoe_UI',sans-serif]"
            style={{
              left: textInput.x * zoom + 'px',
              top: textInput.y * zoom + 'px',
              fontSize: textInput.fs * zoom + 'px',
              color: textInput.color,
            }}
            defaultValue=""
            onKeyDown={onTextInputKeyDown}
          />
        )}
      </div>
    </section>
  );
}
