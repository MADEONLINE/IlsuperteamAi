import pw from '/opt/node22/lib/node_modules/playwright/index.js';
const { chromium } = pw;
const OUT='/home/user/IlsuperteamAi/brand/segreteria-brave/assets/';
const PAW='<svg viewBox="0 0 120 120"><rect x="23" y="72" width="64" height="40" rx="20" fill="currentColor"/><rect x="13" y="40" width="15" height="22" rx="7.5" fill="currentColor"/><rect x="36" y="22" width="15" height="40" rx="7.5" fill="currentColor"/><rect x="59" y="18" width="15" height="44" rx="7.5" fill="currentColor"/><rect x="82" y="36" width="15" height="26" rx="7.5" fill="currentColor"/></svg>';
const CSS=`@font-face{font-family:Fraunces;src:url('file:///root/.claude/skills/synced/b11ec5fe-2edd-4335-b475-3eb07172fee4_4908bd2f-fbc2-41a1-914f-34e3722be839/bvb-carousel-architect/assets/fonts/Fraunces-var.woff2')format('woff2');font-weight:100 900}
@font-face{font-family:Archivo;src:url('file:///root/.claude/skills/synced/b11ec5fe-2edd-4335-b475-3eb07172fee4_4908bd2f-fbc2-41a1-914f-34e3722be839/bvb-carousel-architect/assets/fonts/Archivo-var.woff2')format('woff2');font-weight:100 900}
*{margin:0;padding:0;box-sizing:border-box}`;

function lockup(ink, mark, sig){ return `<!doctype html><meta charset="utf-8"><style>${CSS}
body{display:inline-flex;align-items:center;gap:22px;padding:28px 34px}
svg{width:74px;height:74px;color:${mark};flex:none}
.t{display:grid;gap:5px}
.n{font-family:Fraunces,serif;font-weight:700;font-size:52px;letter-spacing:-.025em;color:${ink};line-height:1}
.s{font-family:Archivo,sans-serif;font-size:15px;letter-spacing:.17em;text-transform:uppercase;color:${sig}}
</style>${PAW}<div class="t"><div class="n">Segreteria Brave</div><div class="s">powered by Icarus</div></div>`; }

const favicon = `<!doctype html><meta charset="utf-8"><style>${CSS}
body{width:512px;height:512px;background:#07120F;display:grid;place-items:center}
svg{width:300px;height:300px;color:#76B6B5}</style>${PAW}`;

const b=await chromium.launch();
const jobs=[
 ['lockup-chiaro.png',  lockup('#0B1715','#26706E','#5E716F'), true],   // per fondi chiari
 ['lockup-scuro.png',   lockup('#E7EFED','#76B6B5','#8FA5A1'), true],   // per fondi scuri
 ['favicon-512.png',    favicon, false],
];
for (const [name,html,transparent] of jobs){
  const p=await b.newPage({deviceScaleFactor:2});
  await p.setContent(html,{waitUntil:'networkidle'});
  await p.evaluate(()=>document.fonts.ready);
  await p.waitForTimeout(300);
  const el = transparent ? await p.$('body') : null;
  if (el) await el.screenshot({path:OUT+name, omitBackground:true});
  else { await p.setViewportSize({width:512,height:512}); await p.screenshot({path:OUT+name}); }
  await p.close();
  console.log('->',name);
}
await b.close();
