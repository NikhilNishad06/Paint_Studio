import React, { useEffect, useRef } from 'react';

export default function Dialog({ dialogState, onClose }) {
  const dialogRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    if (dialogState) {
      if (!el.open) {
        el.showModal();
        if (dialogState.input !== undefined) {
          inputRef.current?.focus();
          inputRef.current?.select();
        }
      }
    } else {
      if (el.open) {
        el.close();
      }
    }
  }, [dialogState]);

  if (!dialogState) return null;

  const { title, text, input, ok = 'OK', alt, danger } = dialogState;
  const hasInput = input !== undefined;

  const handleClose = (returnValue) => {
    const v = inputRef.current ? inputRef.current.value.trim() : '';
    onClose({
      ok: returnValue === 'ok',
      alt: returnValue === 'alt',
      v,
    });
  };

  return (
    <dialog
      ref={dialogRef}
      onCancel={(e) => {
        e.preventDefault();
        handleClose('no');
      }}
      className="border border-line rounded-[16px] bg-chrome text-ink p-[22px] w-[min(420px,92vw)] shadow-sh backdrop:bg-[rgba(10,14,30,0.5)] m-auto"
    >
      <div>
        <h3 className="m-0 mb-1.5 text-[17px] font-semibold">{title}</h3>
        {text && <p className="m-0 mb-3.5 text-mut text-[13px]">{text}</p>}
        {hasInput && (
          <input
            ref={inputRef}
            defaultValue={input}
            maxLength={60}
            autoComplete="off"
            aria-label="Name"
            className="w-full h-10 rounded-[10px] border border-line bg-chrome2 text-ink px-3 font-inherit mb-4 focus-visible:outline-2 focus-visible:outline-acc"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleClose('ok');
              }
            }}
          />
        )}
        <div className="flex justify-end gap-2">
          {/* Cancel button: dn order 1 */}
          <button
            type="button"
            className="order-1 h-9 px-4 rounded-[9px] border border-line bg-chrome text-ink font-semibold hover:bg-chrome2"
            onClick={() => handleClose('no')}
          >
            Cancel
          </button>
          {/* alt button: da order 2 */}
          {alt && (
            <button
              type="button"
              className="order-2 h-9 px-4 rounded-[9px] border border-line bg-chrome text-ink font-semibold hover:bg-chrome2"
              onClick={() => handleClose('alt')}
            >
              {alt}
            </button>
          )}
          {/* ok button: do order 3 */}
          <button
            type="button"
            className={`order-3 h-9 px-4 rounded-[9px] border font-semibold ${
              danger
                ? 'bg-[#e5484d] text-white border-transparent hover:brightness-105'
                : 'bg-gradient-to-br from-acc to-acc2 text-white border-transparent hover:brightness-108'
            }`}
            onClick={() => handleClose('ok')}
          >
            {ok}
          </button>
        </div>
      </div>
    </dialog>
  );
}
