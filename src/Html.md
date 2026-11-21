<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Paint Studio</title>
<style>
:root{--chrome:#ffffff;--chrome2:#f4f6fb;--ink:#141a33;--mut:#667091;--line:#e2e6f1;--acc:#3a46e8;--acc2:#6a4df0;--accsoft:#e9ebff;--ws:#e6eaf3;--dot:#c9d0e2;--sh:0 1px 2px rgba(20,26,51,.08),0 10px 30px rgba(20,26,51,.14)}
[data-theme=dark]{--chrome:#151a30;--chrome2:#1c2240;--ink:#e9ecfa;--mut:#8f99bd;--line:#2a3254;--acc:#8b94ff;--acc2:#b39bff;--accsoft:#272f5e;--ws:#0d111f;--dot:#1f2744;--sh:0 1px 2px rgba(0,0,0,.5),0 12px 34px rgba(0,0,0,.55)}
*{box-sizing:border-box}
html,body{height:100%}
body{margin:0;display:grid;grid-template-rows:56px 1fr 30px;font:13px/1.4 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;background:var(--chrome2);color:var(--ink);overflow:hidden}
button{font:inherit;color:inherit;cursor:pointer}
svg{width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round;flex:none}
:focus-visible{outline:2px solid var(--acc);outline-offset:2px}
/* header */
header{display:flex;align-items:center;gap:10px;padding:0 14px;background:var(--chrome);border-bottom:1px solid var(--line)}
.brand{display:flex;align-items:center;gap:10px;font-weight:700;font-size:15px;letter-spacing:-.01em;margin-right:6px}
.logo{width:30px;height:30px;border-radius:9px;background:conic-gradient(from 210deg,#ff5d7a,#ffb84d,#3fd6a0,#3a8bff,#8a5bff,#ff5d7a);display:grid;place-items:center}
.logo i{width:12px;height:12px;border-radius:50%;background:var(--chrome)}
.sep{width:1px;height:24px;background:var(--line);margin:0 4px}
.hb{height:34px;padding:0 12px;border-radius:9px;border:1px solid transparent;background:transparent;display:flex;align-items:center;gap:7px;font-weight:550;color:var(--ink)}
.hb:hover{background:var(--chrome2);border-color:var(--line)}
.hb:disabled{opacity:.4;cursor:default}
.hb.pri{background:linear-gradient(135deg,var(--acc),var(--acc2));color:#fff;box-shadow:0 4px 14px rgba(58,70,232,.35)}
.hb.pri:hover{filter:brightness(1.08);border-color:transparent}
.ib{width:34px;padding:0;justify-content:center}
.sp{flex:1}
.zoom{display:flex;align-items:center;background:var(--chrome2);border:1px solid var(--line);border-radius:10px}
.zoom button{width:30px;height:30px;border:0;background:transparent;border-radius:8px;display:grid;place-items:center}
.zoom button:hover{background:var(--accsoft)}
.zoom span{min-width:48px;text-align:center;font-variant-numeric:tabular-nums;font-weight:600}
/* main */
main{display:grid;grid-template-columns:136px 1fr 288px;grid-template-areas:"tb ws pn";min-height:0}
#tb{grid-area:tb;background:var(--chrome);border-right:1px solid var(--line);padding:12px 10px;overflow-y:auto}
#tb h4,#pn h4{margin:0 0 8px;font-size:12px;font-weight:600;color:var(--mut)}
.tg{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-bottom:14px}
.tb{height:36px;border-radius:10px;border:1px solid transparent;background:transparent;display:grid;place-items:center;color:var(--ink);transition:background .12s,color .12s}
.tb:hover{background:var(--accsoft);color:var(--acc)}
.tb.on{background:linear-gradient(135deg,var(--acc),var(--acc2));color:#fff;box-shadow:0 4px 12px rgba(58,70,232,.4)}
.tdiv{height:1px;background:var(--line);margin:2px 0 12px}
#ws{grid-area:ws;overflow:auto;padding:28px;background-color:var(--ws);background-image:radial-gradient(var(--dot) 1px,transparent 1.2px);background-size:20px 20px;min-width:0}
#wrap{position:relative;display:block;width:max-content;margin:0 auto;box-shadow:var(--sh);background:#fff;line-height:0;border-radius:3px}
canvas{display:block;cursor:crosshair;touch-action:none;background:#fff;border-radius:3px}
.ti{position:absolute;border:1px dashed #3a46e8;background:transparent;outline:none;min-width:120px;padding:0;margin:0;line-height:1.2;font-family:system-ui,"Segoe UI",sans-serif}
/* panel */
#pn{grid-area:pn;background:var(--chrome);border-left:1px solid var(--line);overflow-y:auto}
.sec{padding:16px 16px 18px;border-bottom:1px solid var(--line)}
.sec:last-child{border-bottom:0}
.pair{display:flex;align-items:center;gap:10px;margin-bottom:14px}
.sw{position:relative;width:52px;height:52px;border-radius:50%;border:3px solid var(--chrome);box-shadow:0 0 0 1.5px var(--line),0 4px 10px rgba(20,26,51,.18);cursor:pointer;flex:none}
.sw input{position:absolute;inset:0;width:100%;height:100%;opacity:0;cursor:pointer}
.sw.b{width:40px;height:40px;margin-left:-22px;margin-top:22px;z-index:0}
.swl{display:flex;flex-direction:column;gap:2px;margin-left:2px}
.swl b{font-weight:600}.swl span{color:var(--mut);font-size:12px}
#swap{margin-left:auto;width:32px;height:32px;border-radius:9px;border:1px solid var(--line);background:var(--chrome);display:grid;place-items:center;color:var(--mut)}
#swap:hover{color:var(--acc);background:var(--accsoft)}
.pal{display:grid;grid-template-columns:repeat(10,1fr);gap:6px}
.pal i{aspect-ratio:1;border-radius:50%;cursor:pointer;box-shadow:inset 0 0 0 1px rgba(20,26,51,.22);transition:transform .1s}
.pal i:hover{transform:scale(1.22)}
.hint{margin:10px 0 0;color:var(--mut);font-size:12px}
.prev{height:76px;border-radius:12px;background:var(--chrome2);border:1px solid var(--line);display:grid;place-items:center;margin-bottom:12px;overflow:hidden}
.prev i{display:block;border-radius:50%;max-width:70px;max-height:70px}
.rg{display:flex;align-items:center;gap:12px}
input[type=range]{flex:1;accent-color:var(--acc);height:4px}
.rg b{min-width:34px;text-align:right;font-variant-numeric:tabular-nums}
.seg{display:grid;grid-template-columns:repeat(3,1fr);background:var(--chrome2);border:1px solid var(--line);border-radius:11px;padding:3px;gap:3px}
.seg button{height:42px;border:0;background:transparent;border-radius:8px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;font-size:11.5px;color:var(--mut);font-weight:550}
.seg button svg{width:16px;height:16px}
.seg button.on{background:var(--chrome);color:var(--acc);box-shadow:0 1px 4px rgba(20,26,51,.16)}
.dims{display:flex;align-items:center;gap:8px}
.dims input{width:100%;min-width:0;height:36px;border-radius:9px;border:1px solid var(--line);background:var(--chrome2);color:var(--ink);padding:0 10px;font:inherit}
.dims input:focus{outline:2px solid var(--acc);border-color:transparent}
.dims button{height:36px;padding:0 14px;border-radius:9px;border:1px solid var(--line);background:var(--chrome);font-weight:600}
.dims button:hover{background:var(--accsoft);color:var(--acc)}
.keys{display:grid;grid-template-columns:1fr 1fr;gap:8px 12px;color:var(--mut);font-size:12px}
kbd{font:600 11px system-ui;background:var(--chrome2);border:1px solid var(--line);border-bottom-width:2px;border-radius:5px;padding:1px 6px;color:var(--ink)}
footer{display:flex;align-items:center;gap:22px;padding:0 16px;background:var(--chrome);border-top:1px solid var(--line);color:var(--mut);font-size:12px;font-variant-numeric:tabular-nums}
footer b{color:var(--ink);font-weight:600}
.off{display:none!important}
header{grid-row:1}main,#hv{grid-row:2;min-height:0}footer{grid-row:3}
.hb.on{background:var(--accsoft);border-color:var(--line);color:var(--acc)}
body.hv #un,body.hv #re,body.hv .zoom,body.hv #nw,body.hv #op,body.hv #sv,body.hv #dl{display:none}
#ss.dirty{color:#d9822b}
#hv{overflow:auto;padding:30px 32px;background-color:var(--ws);background-image:radial-gradient(var(--dot) 1px,transparent 1.2px);background-size:20px 20px}
.hin{max-width:1240px;margin:0 auto}
.hh{display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin-bottom:24px}
.hh h2{margin:0;font-size:24px;letter-spacing:-.02em}
.hh .cnt{color:var(--mut);font-weight:550}
.hh .sp{flex:1}
.hh input{height:38px;width:230px;border-radius:10px;border:1px solid var(--line);background:var(--chrome);color:var(--ink);padding:0 12px;font:inherit}
.hh .hb{border-color:var(--line);background:var(--chrome)}
.hh .hb.pri{border-color:transparent;background:linear-gradient(135deg,var(--acc),var(--acc2))}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:20px}
.card{background:var(--chrome);border:1px solid var(--line);border-radius:14px;overflow:hidden;box-shadow:0 1px 2px rgba(20,26,51,.08);display:flex;flex-direction:column}
.card:hover{border-color:var(--acc)}
.card.cur{box-shadow:0 0 0 2px var(--acc)}
.th{display:block;width:100%;aspect-ratio:16/10;border:0;padding:0;background:#fff;cursor:pointer;border-bottom:1px solid var(--line)}
.th img{width:100%;height:100%;object-fit:contain;display:block}
.meta{padding:12px 14px 6px;display:flex;flex-direction:column;gap:2px;min-width:0}
.meta b{font-size:14px;font-weight:650;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.meta span{color:var(--mut);font-size:12px}
.acts{display:flex;gap:4px;padding:6px 10px 12px}
.acts button{height:32px;min-width:32px;border-radius:8px;border:1px solid transparent;background:transparent;display:flex;align-items:center;justify-content:center;gap:6px;padding:0 8px;color:var(--mut);font-weight:600}
.acts button:first-child{background:var(--accsoft);color:var(--acc);padding:0 12px;margin-right:auto}
.acts button:hover{background:var(--chrome2);color:var(--ink)}
.acts button:first-child:hover{background:var(--accsoft);color:var(--acc);filter:brightness(.96)}
.acts button.del:hover{color:#e5484d;background:rgba(229,72,77,.12)}
.empty{text-align:center;padding:90px 20px;color:var(--mut)}
.empty .ei{width:72px;height:72px;border-radius:20px;background:var(--chrome);border:1px solid var(--line);display:grid;place-items:center;margin:0 auto 18px;color:var(--acc)}
.empty .ei svg{width:32px;height:32px}
.empty h3{margin:0 0 6px;font-size:18px;color:var(--ink)}
.empty p{margin:0 0 18px}
dialog{border:1px solid var(--line);border-radius:16px;background:var(--chrome);color:var(--ink);padding:22px;width:min(420px,92vw);box-shadow:var(--sh)}
dialog::backdrop{background:rgba(10,14,30,.5)}
dialog h3{margin:0 0 6px;font-size:17px}
dialog p{margin:0 0 14px;color:var(--mut)}
dialog input{width:100%;height:40px;border-radius:10px;border:1px solid var(--line);background:var(--chrome2);color:var(--ink);padding:0 12px;font:inherit;margin-bottom:16px}
.dbtn{display:flex;justify-content:flex-end;gap:8px}
.dbtn button{height:36px;padding:0 16px;border-radius:9px;border:1px solid var(--line);background:var(--chrome);color:var(--ink);font-weight:600}
.dbtn .pri{background:linear-gradient(135deg,var(--acc),var(--acc2));color:#fff;border-color:transparent}
.dbtn .dng{background:#e5484d;color:#fff;border-color:transparent}
#dn{order:1}#da{order:2}#do{order:3}
#toast{position:fixed;left:50%;bottom:46px;transform:translate(-50%,12px);background:var(--ink);color:var(--chrome);padding:9px 16px;border-radius:10px;font-weight:550;box-shadow:var(--sh);opacity:0;pointer-events:none;transition:opacity .18s,transform .18s;z-index:50}
#toast.show{opacity:1;transform:translate(-50%,0)}
.gh{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px}.gh h4{margin:0}
.tgl{position:relative;width:40px;height:22px;display:inline-block;cursor:pointer}
.tgl input{position:absolute;opacity:0;inset:0;width:100%;height:100%;margin:0;cursor:pointer}
.tgl i{position:absolute;inset:0;border-radius:999px;background:var(--line);transition:background .15s}
.tgl i::after{content:"";position:absolute;left:3px;top:3px;width:16px;height:16px;border-radius:50%;background:#fff;box-shadow:0 1px 3px rgba(0,0,0,.3);transition:transform .15s}
.tgl input:checked+i{background:linear-gradient(135deg,var(--acc),var(--acc2))}
.tgl input:checked+i::after{transform:translateX(18px)}
.tgl input:focus-visible+i{outline:2px solid var(--acc);outline-offset:2px}
.gprev{height:34px;border-radius:10px;border:1px solid var(--line);margin-bottom:12px}
.gstops{display:flex;flex-wrap:wrap;gap:10px;align-items:center;margin-bottom:12px}
.gs{position:relative;width:34px;height:34px}
.gs label{display:block;width:100%;height:100%;border-radius:50%;border:2px solid var(--chrome);box-shadow:0 0 0 1.5px var(--line);cursor:pointer;position:relative;overflow:hidden}
.gs input{position:absolute;inset:0;opacity:0;width:100%;height:100%;cursor:pointer}
.gs button{position:absolute;right:-6px;top:-6px;width:17px;height:17px;border-radius:50%;border:1px solid var(--line);background:var(--chrome);color:var(--mut);font-size:12px;line-height:1;padding:0;display:grid;place-items:center}
.gs button:hover{color:#e5484d}
.gadd{width:34px;height:34px;border-radius:50%;border:1.5px dashed var(--mut);background:transparent;color:var(--mut);display:grid;place-items:center}
.gadd:hover{color:var(--acc);border-color:var(--acc)}
.gpre{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-top:14px}
.gpre button{height:28px;border-radius:8px;border:1px solid var(--line);cursor:pointer;padding:0}
.gpre button:hover{outline:2px solid var(--acc);outline-offset:1px}
.seg.two{grid-template-columns:repeat(2,1fr);margin-bottom:12px}
.seg.two button{height:32px;flex-direction:row}
@media(max-width:900px){
 #hv{padding:18px}
 main{grid-template-columns:84px 1fr;grid-template-rows:1fr 250px;grid-template-areas:"tb ws" "pn pn"}
 #pn{border-left:0;border-top:1px solid var(--line)}
 .tg{grid-template-columns:repeat(2,1fr)}
 .brand span,header .hb span{display:none}
}
@media(prefers-reduced-motion:reduce){*{transition:none!important}}
</style></head><body>
<header>
 <div class="brand"><div class="logo"><i></i></div><span>Paint Studio</span></div>
 <div class="sep"></div>
 <button class="hb" id="nw" title="New canvas (Alt+N)"><svg id="i-new"></svg><span>New</span></button>
 <button class="hb" id="op" title="Open image (Ctrl+O)"><svg id="i-open"></svg><span>Open</span></button>
 <input type="file" id="fi" accept="image/*" hidden>
 <div class="sep"></div>
 <button class="hb ib" id="un" title="Undo (Ctrl+Z)"><svg id="i-undo"></svg></button>
 <button class="hb ib" id="re" title="Redo (Ctrl+Y)"><svg id="i-redo"></svg></button>
 <div class="sp"></div>
 <div class="zoom"><button id="zout" title="Zoom out (Ctrl+-)"><svg id="i-zout"></svg></button><span id="zl">100%</span><button id="zin" title="Zoom in (Ctrl++)"><svg id="i-zin"></svg></button></div>
 <button class="hb ib" id="th" title="Light / dark theme"><svg id="i-th"></svg></button>
 <button class="hb" id="hbtn" title="History (Alt+H)"><svg id="i-hist"></svg><span>History</span></button>
 <button class="hb ib" id="dl" title="Download PNG (Ctrl+E)"><svg id="i-dl"></svg></button>
 <button class="hb pri" id="sv" title="Save to History (Ctrl+S)"><svg id="i-save"></svg><span>Save</span></button>
</header>
<main id="mn">
 <aside id="tb">
  <h4>Tools</h4><div class="tg" id="tools"></div>
  <div class="tdiv"></div>
  <h4>Shapes</h4><div class="tg" id="shapes"></div>
 </aside>
 <section id="ws"><div id="wrap"><canvas id="cv"></canvas></div></section>
 <aside id="pn">
  <div class="sec">
   <h4>Colors</h4>
   <div class="pair">
    <div style="display:flex"><label class="sw" id="c1b"><input type="color" id="p1" value="#000000"></label><label class="sw b" id="c2b"><input type="color" id="p2" value="#ffffff"></label></div>
    <div class="swl"><b>Outline color</b><span>Fill color behind it</span></div>
    <button id="swap" title="Swap colors"><svg id="i-swap"></svg></button>
   </div>
   <div class="pal" id="pal"></div>
   <p class="hint">Left click sets the outline color. Right click sets the fill color.</p>
  </div>
  <div class="sec">
   <div class="gh"><h4>Gradient</h4><label class="tgl" title="Gradient on / off (G)"><input type="checkbox" id="gon" aria-label="Use gradient"><i></i></label></div>
   <div class="gprev" id="gprev"></div>
   <div class="gstops" id="gstops"></div>
   <div class="seg two" id="gtype"><button data-g="linear" class="on">Linear</button><button data-g="radial">Radial</button></div>
   <div class="rg" id="gangrow"><span>Angle</span><input type="range" id="gang" min="0" max="360" value="45"><b id="gangv">45°</b></div>
   <div class="gpre" id="gpre"></div>
   <p class="hint">Shapes with Both or Solid style are filled with the gradient. Outline style gets a gradient outline. Brush, pencil, text and Fill also use it.</p>
  </div>
  <div class="sec">
   <h4>Brush size</h4>
   <div class="prev"><i id="prev"></i></div>
   <div class="rg"><input type="range" id="sz" min="1" max="40" value="4"><b id="szv">4 px</b></div>
  </div>
  <div class="sec">
   <h4>Shape style</h4>
   <div class="seg" id="fmseg">
    <button data-fm="outline" class="on"><svg viewBox="0 0 24 24"><rect x="4" y="5" width="16" height="14" rx="2"/></svg>Outline</button>
    <button data-fm="both"><svg viewBox="0 0 24 24"><rect x="4" y="5" width="16" height="14" rx="2" fill="currentColor" fill-opacity=".3"/></svg>Both</button>
    <button data-fm="fill"><svg viewBox="0 0 24 24"><rect x="4" y="5" width="16" height="14" rx="2" fill="currentColor"/></svg>Solid</button>
   </div>
  </div>
  <div class="sec">
   <h4>Canvas size</h4>
   <div class="dims"><input type="number" id="rw" min="50" max="4000" aria-label="Width"><span>×</span><input type="number" id="rh" min="50" max="4000" aria-label="Height"><button id="rs">Apply</button></div>
  </div>
  <div class="sec">
   <h4>Shortcuts</h4>
   <div class="keys"><span><kbd>P</kbd> Pencil</span><span><kbd>B</kbd> Brush</span><span><kbd>E</kbd> Eraser</span><span><kbd>F</kbd> Fill</span><span><kbd>I</kbd> Picker</span><span><kbd>T</kbd> Text</span><span><kbd>[</kbd> <kbd>]</kbd> Size</span><span><kbd>X</kbd> Swap colors</span><span><kbd>G</kbd> Gradient on / off</span><span><kbd>Ctrl Z</kbd> Undo</span><span><kbd>Ctrl Y</kbd> Redo</span><span><kbd>Ctrl S</kbd> Save to History</span><span><kbd>Ctrl Shift S</kbd> Save a copy</span><span><kbd>Ctrl E</kbd> Download PNG</span><span><kbd>Alt H</kbd> History</span><span><kbd>Ctrl O</kbd> Open image</span><span><kbd>Alt N</kbd> New canvas</span><span><kbd>Ctrl +</kbd> <kbd>-</kbd> Zoom</span><span><kbd>Ctrl 0</kbd> Zoom 100%</span><span><kbd>Shift</kbd> Straight / equal</span></div>
  </div>
 </aside>
</main>
<section id="hv" class="off"><div class="hin">
 <div class="hh"><h2>History</h2><span class="cnt" id="hcnt"></span><div class="sp"></div>
  <input type="search" id="hq" placeholder="Search drawings" aria-label="Search drawings">
  <button class="hb" id="hback"><svg id="i-back"></svg><span>Back to canvas</span></button>
  <button class="hb pri" id="hnew"><svg id="i-hnew"></svg><span>New drawing</span></button></div>
 <div class="grid" id="hg"></div>
 <div class="empty" id="hem"><div class="ei"><svg id="i-hem"></svg></div><h3>No saved drawings yet</h3><p>Press Ctrl+S in the canvas to save your first drawing here.</p><button class="hb pri" id="hgo" style="margin:0 auto"><span style="display:inline">Start drawing</span></button></div>
</div></section>
<footer><span>Pointer <b id="pos">0, 0 px</b></span><span>Canvas <b id="dim"></b></span><span>Tool <b id="tn">Pencil</b></span><span>File <b id="fn">Untitled</b></span><span><b id="ss">Not saved yet</b></span></footer>
<dialog id="dg"><form onsubmit="return false"><h3 id="dt"></h3><p id="dp"></p><input id="di" maxlength="60" autocomplete="off" aria-label="Name"><div class="dbtn"><button type="button" value="ok" id="do" class="pri"></button><button type="button" value="alt" id="da" class="off"></button><button type="button" value="no" id="dn">Cancel</button></div></form></dialog>
<div id="toast" role="status"></div>
<script>
const $=id=>document.getElementById(id),cv=$('cv'),ctx=cv.getContext('2d',{willReadFrequently:true}),wrap=$('wrap');
let grad={on:false,type:'linear',angle:45,stops:['#ff5d7a','#ffb84d','#3a8bff']},curId=null,curName='Untitled',dirty=false,ti=null,W=1152,H=648,zoom=1,tool='pencil',c1='#000000',c2='#ffffff',size=4,fm='outline';
const P={
pencil:'<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/>',
brush:'<path d="m9.06 11.9 8.07-8.06a2.85 2.85 0 1 1 4.03 4.03l-8.06 8.08"/><path d="M7.07 14.94c-1.66 0-3 1.35-3 3.02 0 1.33-2.5 1.52-2 2.02 1.08 1.1 2.49 2.02 4 2.02 2.2 0 4-1.8 4-4.04a3.01 3.01 0 0 0-3-3.02z"/>',
eraser:'<path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21"/><path d="M22 21H7"/><path d="m5 11 9 9"/>',
bucket:'<path d="m19 11-8-8-8.6 8.6a2 2 0 0 0 0 2.8l5.2 5.2c.8.8 2 .8 2.8 0L19 11Z"/><path d="m5 2 5 5"/><path d="M2 13h15"/><path d="M22 20a2 2 0 1 1-4 0c0-1.6 1.7-2.4 2-4 .3 1.6 2 2.4 2 4Z"/>',
picker:'<path d="m2 22 1-1h3l9-9"/><path d="M3 21v-3l9-9"/><path d="m15 6 3.4-3.4a2.1 2.1 0 1 1 3 3L18 9l.4.4a2.1 2.1 0 1 1-3 3l-3.8-3.8a2.1 2.1 0 1 1 3-3l.4.4Z"/>',
text:'<polyline points="4 7 4 4 20 4 20 7"/><line x1="9" x2="15" y1="20" y2="20"/><line x1="12" x2="12" y1="4" y2="20"/>',
line:'<path d="M5 19 19 5"/>',
arrow:'<path d="M5 19 19 5"/><path d="M9 5h10v10"/>',
rect:'<rect x="3" y="5" width="18" height="14" rx="1"/>',
round:'<rect x="3" y="5" width="18" height="14" rx="5"/>',
ellipse:'<ellipse cx="12" cy="12" rx="9" ry="7"/>',
tri:'<path d="M12 4 21 20H3Z"/>',
rtri:'<path d="M5 4v16h15Z"/>',
diamond:'<path d="M12 3 21 12 12 21 3 12Z"/>',
pent:'<path d="M12 3 21 9.5 17.5 20h-11L3 9.5Z"/>',
hex:'<path d="M12 3 20 7.5v9L12 21 4 16.5v-9Z"/>',
star:'<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9Z"/>',
undo:'<path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11"/>',
redo:'<path d="m15 14 5-5-5-5"/><path d="M20 9H9.5a5.5 5.5 0 0 0 0 11H13"/>',
new:'<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z"/><path d="M14 3v5h5"/><path d="M12 12v5"/><path d="M9.5 14.5h5"/>',
open:'<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/>',
save:'<path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M5 21h14"/>',
zout:'<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/><path d="M8 11h6"/>',
zin:'<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/><path d="M8 11h6"/><path d="M11 8v6"/>',
swap:'<path d="M7 4 3 8l4 4"/><path d="M3 8h14"/><path d="m17 20 4-4-4-4"/><path d="M21 16H7"/>',
disk:'<path d="M5 3h11l3 3v13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"/><path d="M7 3v5h8V3"/><path d="M7 21v-7h10v7"/>',
history:'<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l3 2"/>',
trash:'<path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="m6 6 1 14h10l1-14"/>',
back:'<path d="m15 18-6-6 6-6"/>',
plus:'<path d="M12 5v14"/><path d="M5 12h14"/>',
images:'<rect x="3" y="4" width="18" height="16" rx="3"/><circle cx="9" cy="10" r="1.6"/><path d="m21 16-5-5-8 8"/>',
darrow:'<path d="M5 19 19 5"/><path d="M9 5h10v10"/><path d="M15 19H5V9"/>',
heart:'<path d="M12 20.5C5 15 3 11.5 3 8.5 3 6 5 4 7.5 4c1.8 0 3.3 1 4.5 2.6C13.2 5 14.7 4 16.5 4 19 4 21 6 21 8.5c0 3-2 6.5-9 12Z"/>',
cloud:'<path d="M7 18a4 4 0 0 1-.5-8 5.5 5.5 0 0 1 10.6-1A4.5 4.5 0 0 1 17.5 18Z"/>',
bolt:'<path d="M13 3 5 13.5h6L10 21l9-11h-6.5Z"/>',
callout:'<path d="M5 4h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-8l-4 4v-4H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z"/>',
cross:'<path d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6Z"/>',
octagon:'<path d="M8 3h8l5 5v8l-5 5H8l-5-5V8Z"/>',
para:'<path d="M7 5h14l-4 14H3Z"/>',
trap:'<path d="M7 5h10l4 14H3Z"/>',
star4:'<path d="M12 2c.8 5.5 4.5 9.2 10 10-5.5.8-9.2 4.5-10 10-.8-5.5-4.5-9.2-10-10 5.5-.8 9.2-4.5 10-10Z"/>',
star6:'<path d="m12 2 2.8 5H21l-3.2 5 3.2 5h-6.2L12 22l-2.8-5H3l3.2-5L3 7h6.2Z"/>',
arR:'<path d="M3 9h10V4l8 8-8 8v-5H3Z"/>',
arL:'<path d="M21 9H11V4l-8 8 8 8v-5h10Z"/>',
arU:'<path d="M9 21V11H4l8-8 8 8h-5v10Z"/>',
arD:'<path d="M9 3v10H4l8 8 8-8h-5V3Z"/>',
cyl:'<path d="M4 6c0-1.7 3.6-3 8-3s8 1.3 8 3-3.6 3-8 3-8-1.3-8-3Z"/><path d="M4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6"/>',
moon:'<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/>',
sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>'};
const sv=(k,el)=>{el.setAttribute('viewBox','0 0 24 24');el.innerHTML=P[k]};
[['i-new','new'],['i-open','open'],['i-undo','undo'],['i-redo','redo'],['i-save','disk'],['i-dl','save'],['i-hist','history'],['i-back','back'],['i-hnew','plus'],['i-hem','images'],['i-zout','zout'],['i-zin','zin'],['i-swap','swap']].forEach(([i,k])=>sv(k,$(i)));
const TOOLS=[['pencil','Pencil (P)'],['brush','Brush (B)'],['eraser','Eraser (E)'],['bucket','Fill with color (F)'],['picker','Color picker (I)'],['text','Text (T)']];
const SHAPES=[['line','Line'],['arrow','Arrow line'],['darrow','Double arrow line'],['rect','Rectangle'],['round','Rounded rectangle'],['ellipse','Ellipse / circle'],['tri','Triangle'],['rtri','Right triangle'],['diamond','Diamond'],['pent','Pentagon'],['hex','Hexagon'],['octagon','Octagon'],['para','Parallelogram'],['trap','Trapezoid'],['cross','Plus / cross'],['star','Star (5 points)'],['star4','Star (4 points)'],['star6','Star (6 points)'],['heart','Heart'],['cloud','Cloud'],['bolt','Lightning'],['callout','Speech bubble'],['cyl','Cylinder / database'],['arR','Arrow right'],['arL','Arrow left'],['arU','Arrow up'],['arD','Arrow down']];
const FREE=['pencil','brush','eraser'];
function mk(list,box){list.forEach(([id,nm])=>{const b=document.createElement('button');b.className='tb';b.title=nm;b.setAttribute('aria-label',nm);b.dataset.t=id;b.innerHTML='<svg viewBox="0 0 24 24">'+P[id]+'</svg>';b.onclick=()=>setTool(id);$(box).appendChild(b)})}
mk(TOOLS,'tools');mk(SHAPES,'shapes');
function setTool(t){commitText();tool=t;document.querySelectorAll('.tb').forEach(b=>b.classList.toggle('on',b.dataset.t==t));$('tn').textContent=TOOLS.concat(SHAPES).find(x=>x[0]==t)[1].replace(/ \(.\)/,'')}
setTool('pencil');
/* theme */
function setTheme(t){document.documentElement.dataset.theme=t;sv(t=='dark'?'sun':'moon',$('i-th'))}
setTheme(window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');
$('th').onclick=()=>setTheme(document.documentElement.dataset.theme=='dark'?'light':'dark');
/* colors */
const COL=['#000000','#7f7f7f','#880015','#ed1c24','#ff7f27','#fff200','#22b14c','#00a2e8','#3f48cc','#a349a4','#ffffff','#c3c3c3','#b97a57','#ffaec9','#ffc90e','#efe4b0','#b5e61d','#99d9ea','#7092be','#c8bfe7'];
COL.forEach(c=>{const i=document.createElement('i');i.style.background=c;i.title=c;i.onclick=()=>setCol(1,c);i.oncontextmenu=e=>{e.preventDefault();setCol(2,c)};$('pal').appendChild(i)});
function setCol(n,c){if(n==1){c1=c;$('c1b').style.background=c;$('p1').value=c}else{c2=c;$('c2b').style.background=c;$('p2').value=c}prev()}
function prev(){const p=$('prev'),d=Math.min(70,Math.max(2,size*1.6));p.style.width=p.style.height=d+'px';p.style.background=grad.on?cssGrad():c1}
$('p1').oninput=e=>setCol(1,e.target.value);$('p2').oninput=e=>setCol(2,e.target.value);
$('swap').onclick=()=>{const a=c1,b=c2;setCol(1,b);setCol(2,a)};
setCol(1,c1);setCol(2,c2);
/* gradient */
function cssGrad(){const st=grad.stops.join(',');return grad.type=='radial'?'radial-gradient(circle,'+st+')':'linear-gradient('+(grad.angle+90)+'deg,'+st+')'}
function mkGrad(c,x0,y0,x1,y1){const w=x1-x0,h=y1-y0,cx=x0+w/2,cy=y0+h/2;let g;
 if(grad.type=='radial')g=c.createRadialGradient(cx,cy,0,cx,cy,Math.max(1,Math.hypot(w,h)/2));
 else{const a=grad.angle*Math.PI/180,dx=Math.cos(a),dy=Math.sin(a),half=(Math.abs(w*dx)+Math.abs(h*dy))/2||1;g=c.createLinearGradient(cx-dx*half,cy-dy*half,cx+dx*half,cy+dy*half)}
 const n=grad.stops.length;grad.stops.forEach((k,i)=>g.addColorStop(n==1?0:i/(n-1),k));return g}
function gOn(v){grad.on=v;$('gon').checked=v;prev()}
function autoOn(){if(!grad.on)gOn(true)}
function gLive(){$('gprev').style.background=cssGrad();prev()}
function renderGrad(){
 const box=$('gstops');box.innerHTML='';
 grad.stops.forEach((c,i)=>{const w=document.createElement('div'),l=document.createElement('label'),inp=document.createElement('input');w.className='gs';l.style.background=c;inp.type='color';inp.value=c;
  inp.oninput=()=>{grad.stops[i]=inp.value;l.style.background=inp.value;autoOn();gLive()};l.appendChild(inp);w.appendChild(l);
  if(grad.stops.length>2){const x=document.createElement('button');x.type='button';x.textContent='×';x.title='Remove color';x.setAttribute('aria-label','Remove color');x.onclick=()=>{grad.stops.splice(i,1);autoOn();renderGrad()};w.appendChild(x)}
  box.appendChild(w)});
 if(grad.stops.length<6){const a=document.createElement('button');a.type='button';a.className='gadd';a.title='Add color';a.setAttribute('aria-label','Add color');a.innerHTML='<svg viewBox="0 0 24 24">'+P.plus+'</svg>';a.onclick=()=>{grad.stops.push(c1);autoOn();renderGrad()};box.appendChild(a)}
 $('gangrow').classList.toggle('off',grad.type=='radial');gLive()}
[['Sunset',['#ff512f','#f09819','#ffe259']],['Ocean',['#2193b0','#6dd5ed']],['Rainbow',['#ff0000','#ffa500','#ffee00','#22b14c','#00a2e8','#8a2be2']],['Berry',['#7f00ff','#e100ff']],['Mint',['#11998e','#38ef7d']],['Fire',['#f12711','#f5af19']],['Candy',['#ff5d7a','#ffb84d','#3fd6a0','#3a8bff']],['Night',['#0f2027','#2c5364','#8e9eab']]].forEach(([n,st])=>{const b=document.createElement('button');b.type='button';b.title=n;b.setAttribute('aria-label',n+' gradient');b.style.background='linear-gradient(90deg,'+st.join(',')+')';b.onclick=()=>{grad.stops=st.slice();autoOn();renderGrad()};$('gpre').appendChild(b)});
document.querySelectorAll('#gtype button').forEach(b=>b.onclick=()=>{grad.type=b.dataset.g;document.querySelectorAll('#gtype button').forEach(x=>x.classList.toggle('on',x==b));autoOn();renderGrad()});
$('gang').oninput=e=>{grad.angle=+e.target.value;$('gangv').textContent=grad.angle+'°';autoOn();gLive()};
$('gon').onchange=e=>gOn(e.target.checked);
renderGrad();
$('sz').oninput=e=>{size=+e.target.value;$('szv').textContent=size+' px';prev()};
document.querySelectorAll('#fmseg button').forEach(b=>b.onclick=()=>{fm=b.dataset.fm;document.querySelectorAll('#fmseg button').forEach(x=>x.classList.toggle('on',x==b))});
/* zoom */
const ZS=[.25,.5,.75,1,1.5,2,3];
function applyZoom(){cv.style.width=W*zoom+'px';cv.style.height=H*zoom+'px';$('zl').textContent=Math.round(zoom*100)+'%';$('dim').textContent=W+' × '+H+' px'}
$('zin').onclick=()=>{const n=ZS.find(z=>z>zoom+.001);if(n){zoom=n;applyZoom()}};
$('zout').onclick=()=>{const n=[...ZS].reverse().find(z=>z<zoom-.001);if(n){zoom=n;applyZoom()}};
/* history */
let hist=[],hi=-1;
function btns(){$('un').disabled=hi<=0;$('re').disabled=hi>=hist.length-1}
function push(){hist=hist.slice(0,hi+1);hist.push(ctx.getImageData(0,0,W,H));if(hist.length>40)hist.shift();hi=hist.length-1;btns();dirty=true;status()}
function load(img){if(img.width!=W||img.height!=H){W=cv.width=img.width;H=cv.height=img.height;$('rw').value=W;$('rh').value=H;applyZoom()}ctx.putImageData(img,0,0);btns()}
function undo(){commitText();if(hi>0){hi--;load(hist[hi]);dirty=true;status()}}
function redo(){if(hi<hist.length-1){hi++;load(hist[hi]);dirty=true;status()}}
$('un').onclick=undo;$('re').onclick=redo;
function blank(w,h){W=cv.width=w;H=cv.height=h;ctx.fillStyle='#fff';ctx.fillRect(0,0,W,H);$('rw').value=W;$('rh').value=H;applyZoom()}
$('rs').onclick=()=>{const w=Math.min(4000,Math.max(50,+$('rw').value||W)),h=Math.min(4000,Math.max(50,+$('rh').value||H));const t=document.createElement('canvas');t.width=W;t.height=H;t.getContext('2d').drawImage(cv,0,0);blank(w,h);ctx.drawImage(t,0,0);push()};
/* drawing */
function pos(e){const r=cv.getBoundingClientRect();return[(e.clientX-r.left)*W/r.width,(e.clientY-r.top)*H/r.height]}
function fh(x0,y0,x1,y1){ctx.lineCap='round';ctx.lineJoin='round';ctx.strokeStyle=tool=='eraser'?'#fff':(grad.on?mkGrad(ctx,0,0,W,H):col);ctx.lineWidth=tool=='pencil'?Math.max(1,size/3):tool=='eraser'?size*3:size*1.6;ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(x1+.01,y1);ctx.stroke()}
function poly(cx,cy,rx,ry,n,inner){const p=inner?n*2:n;for(let i=0;i<p;i++){const a=-Math.PI/2+i*2*Math.PI/p,k=inner&&i%2?inner:1,x=cx+Math.cos(a)*rx*k,y=cy+Math.sin(a)*ry*k;i?ctx.lineTo(x,y):ctx.moveTo(x,y)}ctx.closePath()}
const PG={para:[[.2,0],[1,0],[.8,1],[0,1]],trap:[[.2,0],[.8,0],[1,1],[0,1]],cross:[[.35,0],[.65,0],[.65,.35],[1,.35],[1,.65],[.65,.65],[.65,1],[.35,1],[.35,.65],[0,.65],[0,.35],[.35,.35]],octagon:[[.3,0],[.7,0],[1,.3],[1,.7],[.7,1],[.3,1],[0,.7],[0,.3]],bolt:[[.6,0],[.15,.55],[.45,.55],[.35,1],[.85,.4],[.55,.4]],arR:[[0,.3],[.6,.3],[.6,0],[1,.5],[.6,1],[.6,.7],[0,.7]],arL:[[1,.3],[.4,.3],[.4,0],[0,.5],[.4,1],[.4,.7],[1,.7]],arU:[[.3,1],[.3,.4],[0,.4],[.5,0],[1,.4],[.7,.4],[.7,1]],arD:[[.3,0],[.3,.6],[0,.6],[.5,1],[1,.6],[.7,.6],[.7,0]]};
function shape(t,x0,y0,x1,y1){
 const stroke=col,fillc=fm=='both'?oth:col;
 ctx.lineWidth=size;ctx.lineJoin='round';ctx.lineCap='round';ctx.strokeStyle=stroke;ctx.fillStyle=fillc;ctx.beginPath();
 const l=Math.min(x0,x1),r=Math.max(x0,x1),tp=Math.min(y0,y1),b=Math.max(y0,y1),cx=(l+r)/2,cy=(tp+b)/2,rx=(r-l)/2,ry=(b-tp)/2;
 let line=false;const X=u=>l+u*(r-l),Y=v=>tp+v*(b-tp);
 if(grad.on){const G=mkGrad(ctx,l,tp,r,b),ln=t=='line'||t=='arrow'||t=='darrow';if(ln||fm=='outline')ctx.strokeStyle=G;else ctx.fillStyle=G}
 if(t=='line'){line=true;ctx.moveTo(x0,y0);ctx.lineTo(x1,y1)}
 else if(t=='arrow'||t=='darrow'){line=true;ctx.moveTo(x0,y0);ctx.lineTo(x1,y1);const h=Math.max(12,size*4),hd=(ax,ay,bx,by)=>{const a=Math.atan2(by-ay,bx-ax);[-.45,.45].forEach(d=>{ctx.moveTo(bx,by);ctx.lineTo(bx-h*Math.cos(a+d),by-h*Math.sin(a+d))})};hd(x0,y0,x1,y1);if(t=='darrow')hd(x1,y1,x0,y0)}
 else if(t=='rect')ctx.rect(l,tp,r-l,b-tp);
 else if(t=='round'){const q=Math.min(r-l,b-tp)*.2;ctx.roundRect?ctx.roundRect(l,tp,r-l,b-tp,q):ctx.rect(l,tp,r-l,b-tp)}
 else if(t=='ellipse')ctx.ellipse(cx,cy,rx,ry,0,0,7);
 else if(t=='tri'){ctx.moveTo(cx,tp);ctx.lineTo(r,b);ctx.lineTo(l,b);ctx.closePath()}
 else if(t=='rtri'){ctx.moveTo(l,tp);ctx.lineTo(l,b);ctx.lineTo(r,b);ctx.closePath()}
 else if(t=='diamond'){ctx.moveTo(cx,tp);ctx.lineTo(r,cy);ctx.lineTo(cx,b);ctx.lineTo(l,cy);ctx.closePath()}
 else if(t=='pent')poly(cx,cy,rx,ry,5,0);
 else if(t=='hex')poly(cx,cy,rx,ry,6,0);
 else if(t=='star')poly(cx,cy,rx,ry,5,.45);
 else if(t=='star4')poly(cx,cy,rx,ry,4,.38);
 else if(t=='star6')poly(cx,cy,rx,ry,6,.55);
 else if(PG[t]){PG[t].forEach(([u,v],i)=>i?ctx.lineTo(X(u),Y(v)):ctx.moveTo(X(u),Y(v)));ctx.closePath()}
 else if(t=='heart'){const m=ctx.moveTo.bind(ctx),c=(a,b,c1,d,e,f)=>ctx.bezierCurveTo(X(a),Y(b),X(c1),Y(d),X(e),Y(f));m(X(.5),Y(.95));c(.1,.65,0,.45,0,.28);c(0,.1,.15,0,.3,0);c(.4,0,.47,.06,.5,.15);c(.53,.06,.6,0,.7,0);c(.85,0,1,.1,1,.28);c(1,.45,.9,.65,.5,.95);ctx.closePath()}
 else if(t=='cloud'){const c=(a,b,c1,d,e,f)=>ctx.bezierCurveTo(X(a),Y(b),X(c1),Y(d),X(e),Y(f));ctx.moveTo(X(.25),Y(.85));c(.05,.85,0,.55,.18,.5);c(.12,.25,.38,.15,.48,.3);c(.58,.05,.88,.15,.82,.42);c(1.02,.45,1,.85,.78,.85);ctx.closePath()}
 else if(t=='callout'){const q=(a,b,c1,d)=>ctx.quadraticCurveTo(X(a),Y(b),X(c1),Y(d)),n=(u,v)=>ctx.lineTo(X(u),Y(v));ctx.moveTo(X(.08),Y(0));n(.92,0);q(1,0,1,.1);n(1,.62);q(1,.72,.92,.72);n(.45,.72);n(.22,1);n(.28,.72);n(.08,.72);q(0,.72,0,.62);n(0,.1);q(0,0,.08,0);ctx.closePath()}
 else if(t=='cyl'){const ey=Math.max(2,(b-tp)*.15);ctx.moveTo(l,tp+ey);ctx.lineTo(l,b-ey);ctx.ellipse(cx,b-ey,rx,ey,0,Math.PI,0,true);ctx.lineTo(r,tp+ey);ctx.ellipse(cx,tp+ey,rx,ey,0,0,Math.PI,true);ctx.closePath();ctx.moveTo(l,tp+ey);ctx.ellipse(cx,tp+ey,rx,ey,0,Math.PI,0,true)}
 if(!line&&fm!='outline')ctx.fill();
 if(line||fm!='fill')ctx.stroke();
}
function hex2(c){return[1,3,5].map(i=>parseInt(c.substr(i,2),16))}
function flood(x,y,c){
 x|=0;y|=0;const img=ctx.getImageData(0,0,W,H),d=img.data,[r,g,b]=hex2(c),i0=(y*W+x)*4,tr=d[i0],tg=d[i0+1],tb=d[i0+2];
 const G=grad.on;if(!G&&tr==r&&tg==g&&tb==b)return;
 const seen=new Uint8Array(W*H),m=(px,py)=>{const i=(py*W+px)*4;return !seen[py*W+px]&&Math.abs(d[i]-tr)+Math.abs(d[i+1]-tg)+Math.abs(d[i+2]-tb)<=60};
 const st=[x,y];
 while(st.length){const yy=st.pop(),xx=st.pop();if(!m(xx,yy))continue;let a=xx,z=xx;while(a>0&&m(a-1,yy))a--;while(z<W-1&&m(z+1,yy))z++;
  for(let k=a;k<=z;k++){seen[yy*W+k]=1;if(!G){const i=(yy*W+k)*4;d[i]=r;d[i+1]=g;d[i+2]=b;d[i+3]=255}}
  for(const ny of[yy-1,yy+1]){if(ny<0||ny>=H)continue;let on=false;for(let k=a;k<=z;k++){const ok=m(k,ny);if(ok&&!on)st.push(k,ny);on=ok}}}
 if(G){let x0=W,y0=H,x1=0,y1=0;for(let yy=0;yy<H;yy++)for(let xx=0;xx<W;xx++)if(seen[yy*W+xx]){if(xx<x0)x0=xx;if(xx>x1)x1=xx;if(yy<y0)y0=yy;if(yy>y1)y1=yy}
  const bw=x1-x0+1,bh=y1-y0+1,oc=document.createElement('canvas');oc.width=bw;oc.height=bh;const o=oc.getContext('2d');o.fillStyle=mkGrad(o,0,0,bw,bh);o.fillRect(0,0,bw,bh);const gd=o.getImageData(0,0,bw,bh).data;
  for(let yy=y0;yy<=y1;yy++)for(let xx=x0;xx<=x1;xx++)if(seen[yy*W+xx]){const i=(yy*W+xx)*4,j=((yy-y0)*bw+(xx-x0))*4;d[i]=gd[j];d[i+1]=gd[j+1];d[i+2]=gd[j+2];d[i+3]=255}}
 ctx.putImageData(img,0,0);
}
function pick(x,y,right){const p=ctx.getImageData(x|0,y|0,1,1).data;setCol(right?2:1,'#'+[0,1,2].map(i=>p[i].toString(16).padStart(2,'0')).join(''))}
/* text */
function startText(x,y){commitText();const fs=size*3+10;ti=document.createElement('input');ti.className='ti';Object.assign(ti.style,{left:x*zoom+'px',top:y*zoom+'px',fontSize:fs*zoom+'px',color:col});ti._d={x,y,fs,c:col};
 ti.onkeydown=e=>{if(e.key=='Enter')commitText();else if(e.key=='Escape'){ti.remove();ti=null}};wrap.appendChild(ti);setTimeout(()=>ti&&ti.focus(),0)}
function commitText(){if(!ti)return;const t=ti,d=t._d;ti=null;if(t.value){ctx.font=d.fs+'px system-ui,"Segoe UI",sans-serif';ctx.textBaseline='top';ctx.fillStyle=grad.on?mkGrad(ctx,d.x+2,d.y+2,d.x+2+ctx.measureText(t.value).width,d.y+2+d.fs*1.2):d.c;ctx.fillText(t.value,d.x+2,d.y+2);push()}t.remove()}
/* events */
let drawing=false,sx,sy,lx,ly,snap,col,oth;
cv.oncontextmenu=e=>e.preventDefault();
cv.addEventListener('pointerdown',e=>{
 if(e.button>2)return;commitText();e.preventDefault();
 const[x,y]=pos(e);col=e.button==2?c2:c1;oth=e.button==2?c1:c2;
 if(tool=='bucket'){flood(x,y,col);push();return}
 if(tool=='picker'){pick(x,y,e.button==2);return}
 if(tool=='text'){startText(x,y);return}
 drawing=true;cv.setPointerCapture(e.pointerId);sx=lx=x;sy=ly=y;
 if(FREE.includes(tool))fh(x,y,x,y);else snap=ctx.getImageData(0,0,W,H);
});
cv.addEventListener('pointermove',e=>{
 const[x,y]=pos(e);$('pos').textContent=(x|0)+', '+(y|0)+' px';if(!drawing)return;
 if(FREE.includes(tool)){fh(lx,ly,x,y);lx=x;ly=y;return}
 ctx.putImageData(snap,0,0);let ex=x,ey=y;
 if(e.shiftKey){const dx=x-sx,dy=y-sy;if(tool=='line'||tool=='arrow'||tool=='darrow'){const a=Math.round(Math.atan2(dy,dx)/(Math.PI/4))*Math.PI/4,n=Math.hypot(dx,dy);ex=sx+Math.cos(a)*n;ey=sy+Math.sin(a)*n}else{const m=Math.max(Math.abs(dx),Math.abs(dy));ex=sx+(dx<0?-m:m);ey=sy+(dy<0?-m:m)}}
 shape(tool,sx,sy,ex,ey);
});
const end=()=>{if(!drawing)return;drawing=false;push()};
cv.addEventListener('pointerup',end);cv.addEventListener('pointercancel',end);
const KEYS={p:'pencil',b:'brush',e:'eraser',f:'bucket',i:'picker',t:'text'};
function setSize(v){size=Math.min(40,Math.max(1,v));$('sz').value=size;$('szv').textContent=size+' px';prev()}
function inHist(){return document.body.classList.contains('hv')}
document.addEventListener('keydown',e=>{
 if($('dg').open)return;
 const k=e.key.toLowerCase(),mod=e.ctrlKey||e.metaKey,tg=e.target,typing=tg.tagName=='INPUT'&&(tg.type=='text'||tg.type=='number'||tg.type=='search');
 if(e.altKey&&e.code=='KeyH'){e.preventDefault();view(inHist()?'edit':'hist');return}
 if(ti||typing)return;
 if(inHist()){if(e.key=='Escape')view('edit');return}
 if(mod){
  if(k=='z'&&!e.shiftKey){e.preventDefault();undo()}
  else if(k=='y'||(k=='z'&&e.shiftKey)){e.preventDefault();redo()}
  else if(k=='s'){e.preventDefault();saveDrawing(e.shiftKey)}
  else if(k=='e'){e.preventDefault();dlPNG()}
  else if(k=='o'){e.preventDefault();$('op').click()}
  else if(k=='='||k=='+'){e.preventDefault();$('zin').click()}
  else if(k=='-'){e.preventDefault();$('zout').click()}
  else if(k=='0'){e.preventDefault();zoom=1;applyZoom()}
  return}
 if(e.altKey){if(e.code=='KeyN'){e.preventDefault();$('nw').click()}return}
 if(KEYS[k]){e.preventDefault();setTool(KEYS[k])}
 else if(e.key=='['){setSize(size-2)}
 else if(e.key==']'){setSize(size+2)}
 else if(k=='x'){$('swap').click()}
 else if(k=='g'){gOn(!grad.on)}
});
/* ---------- History (saved drawings) ---------- */
let db=null;const mem=new Map();
function dbo(){return new Promise(res=>{try{const r=indexedDB.open('paint-studio',1);r.onupgradeneeded=()=>r.result.createObjectStore('d',{keyPath:'id'});r.onsuccess=()=>{db=r.result;res()};r.onerror=()=>res()}catch(e){res()}})}
function R(mode,f){return new Promise((res,rej)=>{const t=db.transaction('d',mode),r=f(t.objectStore('d'));t.oncomplete=()=>res(r&&r.result);t.onerror=t.onabort=()=>rej(t.error)})}
const dbAll=()=>db?R('readonly',s=>s.getAll()):Promise.resolve([...mem.values()]);
const dbPut=r=>db?R('readwrite',s=>s.put(r)):(mem.set(r.id,r),Promise.resolve());
const dbDel=id=>db?R('readwrite',s=>s.delete(id)):(mem.delete(id),Promise.resolve());
['do','da','dn'].forEach(id=>$(id).onclick=()=>$('dg').close($(id).value));
$('di').onkeydown=e=>{if(e.key=='Enter'){e.preventDefault();$('dg').close('ok')}};
let tt;function toast(m){const t=$('toast');t.textContent=m;t.classList.add('show');clearTimeout(tt);tt=setTimeout(()=>t.classList.remove('show'),2200)}
function dlg(o){return new Promise(res=>{const d=$('dg'),i=$('di'),has=o.input!==undefined,a=$('da');
 $('dt').textContent=o.title;$('dp').textContent=o.text||'';$('dp').style.display=o.text?'':'none';
 i.classList.toggle('off',!has);i.value=has?o.input:'';
 $('do').textContent=o.ok||'OK';$('do').className=o.danger?'dng':'pri';
 a.classList.toggle('off',!o.alt);a.textContent=o.alt||'';
 d.returnValue='';d.onclose=()=>res({ok:d.returnValue=='ok',alt:d.returnValue=='alt',v:i.value.trim()});
 d.showModal();if(has){i.focus();i.select()}else $('do').focus()})}
function status(){$('fn').textContent=curName;const s=$('ss');s.textContent=dirty?'Unsaved changes':(curId?'Saved':'Not saved yet');s.classList.toggle('dirty',dirty)}
function guard(cb){if(!dirty)return cb();dlg({title:'Unsaved changes',text:'Save "'+curName+'" to History before you leave it?',ok:'Save',alt:'Discard'}).then(async r=>{if(r.ok){if(await saveDrawing())cb()}else if(r.alt)cb()})}
function thumb(){const k=Math.min(1,360/W),c=document.createElement('canvas');c.width=Math.max(1,Math.round(W*k));c.height=Math.max(1,Math.round(H*k));const x=c.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,c.width,c.height);x.drawImage(cv,0,0,c.width,c.height);return c.toDataURL('image/jpeg',.82)}
async function saveDrawing(asNew){try{return await saveDrawing2(asNew)}catch(e){toast('Save failed: '+(e&&e.message||e));return false}}
async function saveDrawing2(asNew){
 commitText();let id=curId,name=curName;
 if(!id||asNew){let n=0;try{n=(await dbAll()).length}catch(e){}
  const r=await dlg({title:asNew&&curId?'Save a copy':'Save to History',text:'Give your drawing a name.',input:asNew&&curId?curName+' copy':'Drawing '+(n+1),ok:'Save'});
  if(!r.ok)return false;name=r.v||'Untitled';id='d'+Date.now().toString(36)+Math.random().toString(36).slice(2,6)}
 const blob=await new Promise(r=>cv.toBlob(r,'image/png'));
 try{await dbPut({id,name,ts:Date.now(),w:W,h:H,blob,thumb:thumb()})}catch(e){toast('Could not save. Browser storage is full or blocked.');return false}
 curId=id;curName=name;dirty=false;status();toast('Saved to History');return true}
function dlBlob(b,name){const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=(name.replace(/[\\/:*?"<>|]+/g,'_')||'drawing')+'.png';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)}
function dlPNG(){commitText();cv.toBlob(b=>dlBlob(b,curName))}
function newCanvas(){blank(W,H);hist=[];hi=-1;push();curId=null;curName='Untitled';dirty=false;status()}
function view(v){commitText();const h=v=='hist';document.body.classList.toggle('hv',h);$('mn').classList.toggle('off',h);$('hv').classList.toggle('off',!h);$('hbtn').classList.toggle('on',h);if(h)renderHist()}
function openRec(r){guard(()=>{const url=URL.createObjectURL(r.blob),im=new Image();im.onload=()=>{blank(im.width,im.height);ctx.drawImage(im,0,0);URL.revokeObjectURL(url);hist=[];hi=-1;push();curId=r.id;curName=r.name;dirty=false;status();view('edit')};im.src=url})}
async function renameRec(r){const x=await dlg({title:'Rename drawing',input:r.name,ok:'Rename'});if(!x.ok||!x.v)return;r.name=x.v;await dbPut(r);if(r.id==curId){curName=x.v;status()}renderHist()}
async function delRec(r){const x=await dlg({title:'Delete drawing?',text:'"'+r.name+'" will be removed from History. This cannot be undone.',ok:'Delete',danger:true});if(!x.ok)return;await dbDel(r.id);if(r.id==curId){curId=null;dirty=true;status()}renderHist();toast('Deleted')}
function card(r){
 const a=document.createElement('article');a.className='card'+(r.id==curId?' cur':'');
 const th=document.createElement('button'),im=document.createElement('img');th.className='th';th.title='Open';im.src=r.thumb;im.alt=r.name;th.appendChild(im);th.onclick=()=>openRec(r);
 const m=document.createElement('div'),n=document.createElement('b'),d=document.createElement('span'),z=document.createElement('span');m.className='meta';n.textContent=r.name;n.title=r.name;
 d.textContent=new Date(r.ts).toLocaleString([],{dateStyle:'medium',timeStyle:'short'});z.textContent=r.w+' × '+r.h+' px';m.append(n,d,z);
 const ac=document.createElement('div');ac.className='acts';
 [['Open','open',()=>openRec(r)],['Download','save',()=>dlBlob(r.blob,r.name)],['Rename','pencil',()=>renameRec(r)],['Delete','trash',()=>delRec(r)]].forEach(([t,ic,f])=>{const b=document.createElement('button');b.title=t;b.setAttribute('aria-label',t);b.innerHTML='<svg viewBox="0 0 24 24">'+P[ic]+'</svg>'+(t=='Open'?'<span>Open</span>':'');if(t=='Delete')b.className='del';b.onclick=f;ac.appendChild(b)});
 a.append(th,m,ac);return a}
async function renderHist(){
 let all=[];try{all=await dbAll()}catch(e){}
 all.sort((a,b)=>b.ts-a.ts);
 const q=$('hq').value.trim().toLowerCase(),g=$('hg');g.innerHTML='';
 $('hcnt').textContent=all.length+(all.length==1?' drawing':' drawings');
 $('hem').classList.toggle('off',all.length>0);$('hq').classList.toggle('off',!all.length);
 all.filter(r=>r.name.toLowerCase().includes(q)).forEach(r=>g.appendChild(card(r)));
 if(all.length&&!g.children.length)g.innerHTML='<p style="color:var(--mut)">No drawings match your search.</p>'}
$('hbtn').onclick=()=>view(inHist()?'edit':'hist');
$('hback').onclick=()=>view('edit');$('hgo').onclick=()=>view('edit');
$('hnew').onclick=()=>guard(()=>{newCanvas();view('edit')});
$('hq').oninput=renderHist;
$('sv').onclick=()=>saveDrawing();$('dl').onclick=dlPNG;
$('nw').onclick=()=>guard(newCanvas);
$('op').onclick=()=>guard(()=>$('fi').click());
$('fi').onchange=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{const im=new Image();im.onload=()=>{blank(im.width,im.height);ctx.drawImage(im,0,0);hist=[];hi=-1;push();curId=null;curName=f.name.replace(/\.[^.]+$/,'')||'Untitled';dirty=true;status()};im.src=r.result};r.readAsDataURL(f);e.target.value=''};
window.addEventListener('beforeunload',e=>{if(dirty){e.preventDefault();e.returnValue=''}});
blank(W,H);push();dirty=false;status();
dbo().then(()=>{if(!db)toast('History storage is blocked in this browser. Drawings will be lost when you close the tab.');try{navigator.storage&&navigator.storage.persist&&navigator.storage.persist()}catch(e){}});
</script></body></html>