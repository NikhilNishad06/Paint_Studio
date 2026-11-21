import React, { useState, useEffect } from 'react';
import Icon from './Icon.jsx';
import { dbAll, dbPut, dbDel } from '../lib/db.js';

export default function HistoryPage({
  curId,
  onOpenRecord,
  onNewDrawing,
  onBackToCanvas,
  dialog,
  showToast,
  setCurId,
  setCurName,
  setDirty,
}) {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');

  const loadHistory = async () => {
    try {
      const all = await dbAll();
      all.sort((a, b) => b.ts - a.ts);
      setItems(all);
    } catch {
      setItems([]);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const dlBlob = (b, name) => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(b);
    a.download = (name.replace(/[\\/:*?"<>|]+/g, '_') || 'drawing') + '.png';
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  };

  const handleRename = async (r) => {
    const x = await dialog({
      title: 'Rename drawing',
      input: r.name,
      ok: 'Rename',
    });
    if (!x.ok || !x.v) return;
    r.name = x.v;
    await dbPut(r);
    if (r.id === curId) {
      setCurName(x.v);
    }
    loadHistory();
  };

  const handleDelete = async (r) => {
    const x = await dialog({
      title: 'Delete drawing?',
      text: '"' + r.name + '" will be removed from History. This cannot be undone.',
      ok: 'Delete',
      danger: true,
    });
    if (!x.ok) return;
    await dbDel(r.id);
    if (r.id === curId) {
      setCurId(null);
      setDirty(true);
    }
    loadHistory();
    showToast('Deleted');
  };

  const q = search.trim().toLowerCase();
  const filtered = items.filter((r) => r.name.toLowerCase().includes(q));

  return (
    <section
      id="hv"
      className="overflow-auto p-[30px_32px] max-[900px]:p-[18px] bg-ws bg-[radial-gradient(var(--dot)_1px,transparent_1.2px)] [background-size:20px_20px] flex-1 min-h-0"
    >
      <div className="max-w-[1240px] mx-auto">
        <div className="flex items-center gap-3 flex-wrap mb-6">
          <h2 className="m-0 text-[24px] tracking-[-0.02em] font-bold text-ink">History</h2>
          <span className="text-mut font-[550]">
            {items.length} {items.length === 1 ? 'drawing' : 'drawings'}
          </span>
          <div className="flex-1" />

          {items.length > 0 && (
            <input
              type="search"
              placeholder="Search drawings"
              aria-label="Search drawings"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-[38px] w-[230px] rounded-[10px] border border-line bg-chrome text-ink px-3 font-inherit focus-visible:outline-2 focus-visible:outline-acc"
            />
          )}

          <button
            type="button"
            className="h-[34px] px-3 rounded-[9px] border border-line bg-chrome flex items-center gap-[7px] font-[550] text-ink hover:bg-chrome2"
            onClick={onBackToCanvas}
          >
            <Icon name="back" />
            <span>Back to canvas</span>
          </button>

          <button
            type="button"
            className="h-[34px] px-3 rounded-[9px] border border-transparent bg-gradient-to-br from-acc to-acc2 text-white flex items-center gap-[7px] font-[550] hover:brightness-108"
            onClick={onNewDrawing}
          >
            <Icon name="plus" />
            <span>New drawing</span>
          </button>
        </div>

        {/* Empty state */}
        {items.length === 0 && (
          <div className="text-center py-[90px] px-5 text-mut">
            <div className="w-[72px] h-[72px] rounded-[20px] bg-chrome border border-line grid place-items-center mx-auto mb-[18px] text-acc">
              <Icon name="images" className="w-8 h-8" />
            </div>
            <h3 className="m-0 mb-1.5 text-[18px] text-ink font-semibold">No saved drawings yet</h3>
            <p className="m-0 mb-[18px]">Press Ctrl+S in the canvas to save your first drawing here.</p>
            <button
              type="button"
              className="h-[34px] px-3 rounded-[9px] border border-transparent bg-gradient-to-br from-acc to-acc2 text-white flex items-center gap-[7px] font-[550] mx-auto hover:brightness-108"
              onClick={onBackToCanvas}
            >
              <span>Start drawing</span>
            </button>
          </div>
        )}

        {/* Grid */}
        {items.length > 0 && (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-5">
            {filtered.map((r) => {
              const isCur = r.id === curId;
              return (
                <article
                  key={r.id}
                  className={`bg-chrome border rounded-[14px] overflow-hidden shadow-[0_1px_2px_rgba(20,26,51,0.08)] flex flex-col hover:border-acc ${
                    isCur ? 'border-line shadow-[0_0_0_2px_var(--acc)]' : 'border-line'
                  }`}
                >
                  <button
                    type="button"
                    className="block w-full aspect-[16/10] border-0 p-0 bg-white cursor-pointer border-b border-line"
                    title="Open"
                    onClick={() => onOpenRecord(r)}
                  >
                    <img src={r.thumb} alt={r.name} className="w-full h-full object-contain block" />
                  </button>

                  <div className="p-[12px_14px_6px] flex flex-col gap-0.5 min-w-0">
                    <b className="text-[14px] font-[650] overflow-hidden text-ellipsis whitespace-nowrap text-ink" title={r.name}>
                      {r.name}
                    </b>
                    <span className="text-mut text-[12px]">
                      {new Date(r.ts).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                    </span>
                    <span className="text-mut text-[12px]">{r.w} × {r.h} px</span>
                  </div>

                  <div className="flex gap-1 p-[6px_10px_12px] items-center">
                    <button
                      type="button"
                      title="Open"
                      aria-label="Open"
                      className="h-8 min-w-[32px] rounded-[8px] border border-transparent bg-accsoft text-acc font-semibold px-3 mr-auto flex items-center justify-center gap-1.5 hover:brightness-95"
                      onClick={() => onOpenRecord(r)}
                    >
                      <Icon name="open" />
                      <span>Open</span>
                    </button>

                    <button
                      type="button"
                      title="Download"
                      aria-label="Download"
                      className="h-8 min-w-[32px] rounded-[8px] border border-transparent bg-transparent text-mut font-semibold px-2 flex items-center justify-center gap-1.5 hover:bg-chrome2 hover:text-ink"
                      onClick={() => dlBlob(r.blob, r.name)}
                    >
                      <Icon name="save" />
                    </button>

                    <button
                      type="button"
                      title="Rename"
                      aria-label="Rename"
                      className="h-8 min-w-[32px] rounded-[8px] border border-transparent bg-transparent text-mut font-semibold px-2 flex items-center justify-center gap-1.5 hover:bg-chrome2 hover:text-ink"
                      onClick={() => handleRename(r)}
                    >
                      <Icon name="pencil" />
                    </button>

                    <button
                      type="button"
                      title="Delete"
                      aria-label="Delete"
                      className="h-8 min-w-[32px] rounded-[8px] border border-transparent bg-transparent text-mut font-semibold px-2 flex items-center justify-center gap-1.5 hover:text-[#e5484d] hover:bg-[rgba(229,72,77,0.12)]"
                      onClick={() => handleDelete(r)}
                    >
                      <Icon name="trash" />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {items.length > 0 && filtered.length === 0 && (
          <p className="text-mut text-[13px]">No drawings match your search.</p>
        )}
      </div>
    </section>
  );
}
