import React, { useEffect, useRef } from 'react';

export default function CanvasArea({
  canvasRef,
  width,
  height,
  zoom,
  textInput,
  onTextInputKeyDown,
  onTextInputChange,
  selection,
  activeElement,
  currentTool,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onPointerCancel,
}) {
  const textInputRef = useRef(null);
  const floatingCanvasRef = useRef(null);
  const activeElementCanvasRef = useRef(null);

  useEffect(() => {
    if (textInput) {
      setTimeout(() => {
        textInputRef.current?.focus();
      }, 0);
    }
  }, [textInput]);

  // Render floating selection pixels preview into overlay canvas
  useEffect(() => {
    if (selection?.isFloating && selection?.imgData && floatingCanvasRef.current) {
      const cv = floatingCanvasRef.current;
      cv.width = selection.imgData.width;
      cv.height = selection.imgData.height;
      const ctx = cv.getContext('2d');
      ctx.putImageData(selection.imgData, 0, 0);
    }
  }, [selection]);

  // Render freshly created shape active element on resized/rotated canvas preview
  useEffect(() => {
    if (activeElement?.offscreenCanvas && activeElementCanvasRef.current) {
      const cv = activeElementCanvasRef.current;
      cv.width = activeElement.w;
      cv.height = activeElement.h;
      const ctx = cv.getContext('2d');
      ctx.clearRect(0, 0, cv.width, cv.height);
      ctx.drawImage(activeElement.offscreenCanvas, 0, 0, cv.width, cv.height);
    }
  }, [activeElement]);

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
          className="block touch-none bg-white rounded-[3px] cursor-crosshair"
          onContextMenu={(e) => e.preventDefault()}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerCancel}
        />

        {/* 1. Fully Transformable (Move, Resize, Rotate) Element */}
        {activeElement && (
          <div
            className="absolute border border-dashed border-[#3a46e8] shadow-[0_0_0_1px_rgba(255,255,255,0.85)] z-20 pointer-events-none"
            style={{
              left: activeElement.x * zoom + 'px',
              top: activeElement.y * zoom + 'px',
              width: activeElement.w * zoom + 'px',
              height: activeElement.h * zoom + 'px',
              transform: `rotate(${activeElement.rotation || 0}deg)`,
              transformOrigin: 'center center',
            }}
          >
            <canvas
              ref={activeElementCanvasRef}
              style={{
                width: '100%',
                height: '100%',
                display: 'block',
              }}
            />

            {/* Rotation Handle (Top Center Circle) */}
            <div className="absolute -top-7 left-1/2 -translate-x-1/2 flex flex-col items-center">
              <span className="w-3.5 h-3.5 rounded-full bg-white border-2 border-[#3a46e8] shadow-sm flex items-center justify-center">
                <span className="w-1.5 h-1.5 bg-[#3a46e8] rounded-full" />
              </span>
              <span className="w-[1.5px] h-3.5 bg-[#3a46e8]" />
            </div>

            {/* Corner Resize Handles */}
            <span className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-white border-2 border-[#3a46e8] rounded-[2px]" />
            <span className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-white border-2 border-[#3a46e8] rounded-[2px]" />
            <span className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-white border-2 border-[#3a46e8] rounded-[2px]" />
            <span className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-white border-2 border-[#3a46e8] rounded-[2px]" />
          </div>
        )}

        {/* 2. Floating Manual Selection Box & Pixels */}
        {selection && (
          <div
            className={`absolute pointer-events-none border-2 border-dashed border-[#3a46e8] shadow-[0_0_0_1px_rgba(255,255,255,0.8)] z-10 ${
              selection.w >= 4 && selection.h >= 4 ? 'block' : 'hidden'
            }`}
            style={{
              left: selection.x * zoom + 'px',
              top: selection.y * zoom + 'px',
              width: selection.w * zoom + 'px',
              height: selection.h * zoom + 'px',
            }}
          >
            {selection.isFloating && (
              <canvas
                ref={floatingCanvasRef}
                style={{
                  width: '100%',
                  height: '100%',
                  display: 'block',
                }}
              />
            )}
            <span className="absolute -top-1 -left-1 w-2 h-2 bg-white border border-[#3a46e8]" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-white border border-[#3a46e8]" />
            <span className="absolute -bottom-1 -left-1 w-2 h-2 bg-white border border-[#3a46e8]" />
            <span className="absolute -bottom-1 -right-1 w-2 h-2 bg-white border border-[#3a46e8]" />
          </div>
        )}

        {/* 3. Text tool overlay */}
        {textInput && (
          <input
            ref={textInputRef}
            type="text"
            className="absolute border border-dashed border-[#3a46e8] bg-transparent outline-none min-w-[120px] p-0 m-0 leading-[1.2] font-[system-ui,'Segoe_UI',sans-serif] z-30"
            style={{
              left: textInput.x * zoom + 'px',
              top: textInput.y * zoom + 'px',
              fontSize: textInput.fs * zoom + 'px',
              color: textInput.color,
            }}
            value={textInput.value}
            onChange={onTextInputChange}
            onKeyDown={onTextInputKeyDown}
          />
        )}
      </div>
    </section>
  );
}
