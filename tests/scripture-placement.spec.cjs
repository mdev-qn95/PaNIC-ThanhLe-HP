const{chromium}=require('playwright');const assert=require('node:assert/strict');const fs=require('node:fs/promises');const path=require('node:path');
(async()=>{const b=await chromium.launch({headless:true,...(process.env.BROWSER_PATH?{executablePath:process.env.BROWSER_PATH}:{})});try{
 const p=await b.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});const errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto(process.env.BASE_URL||'http://127.0.0.1:8000',{waitUntil:'networkidle'});await p.evaluate(()=>document.fonts.ready);
 const checks=await p.evaluate(()=>{let count=0,overlapChecks=0;const templates=new Set(),intersects=(a,b)=>a.x<b.x+b.w-.2&&a.x+a.w>b.x+.2&&a.y<b.y+b.h-.2&&a.y+a.h>b.y+.2;
  for(const fp of Object.keys(FP)){S.fp=fp;for(const size of Object.values(SIZES))for(const v of [VERSES[0],VERSES[5],{t:'Tình yêu không bao giờ mất được. Anh em hãy yêu thương nhau như Thầy đã yêu thương anh em. Trên hết mọi đức tính, anh em phải có lòng bác ái: đó là mối dây liên kết tuyệt hảo.',r:'Câu kiểm tra dài'}]){
   const W=1000,H=1000*size.h/size.w;
   for(const t of TPL){
    const e=t.b({W,H,m:Math.min(W,H)*.06,g:12,f:texts(),v,land:W>H*1.05,sym:'crossring',P:pal(t.pal)}),photos=e.filter(x=>x.t==='img'),tx=e.filter(x=>x.t==='text'&&x.text),q=tx.find(a=>a.role==='scripture'),r=tx.find(a=>a.role==='reference'),title=tx.find(a=>a.role==='title');
    if(!q||!r||!title||!(textBox(q).y+textBox(q).h<=r.y&&textBox(r).y+textBox(r).h<title.y))throw Error(t.id+' invalid heading order');
    if(r.y-textBox(q).y-textBox(q).h>Math.min(W,H)*.01)throw Error('Distant citation');
    for(const a of tx){const b=textBox(a);if(b.x<W*.04-.5||b.x+b.w>W*.96+.5||b.y<H*.035-.5||b.y+b.h>H*.98+.5)throw Error(t.id+' text margin');
      for(const ph of photos){if(intersects(b,ph))throw Error(t.id+' text/image overlap');overlapChecks++;}}
    templates.add(t.id);count++;
   }
  }}S.fp='classic';return{count,overlapChecks,templates:[...templates]};
 });assert.equal(checks.templates.length,15);assert.equal(checks.count,1440);
 if(process.env.OUTPUT_DIR){await fs.mkdir(process.env.OUTPUT_DIR,{recursive:true});for(const tpl of checks.templates)for(const [size,prefix]of [['tv169','land'],['tv916','port']]){
  const bytes=await p.evaluate(async({tpl,size})=>{S.mode='slides';S.cur=0;S.slides[0].tpl=tpl;S.size=size;S.fmt='image/png';const z=await renderBlob(0);return Array.from(new Uint8Array(await z.arrayBuffer()))},{tpl,size});assert.ok(bytes.length>10000);await fs.writeFile(path.join(process.env.OUTPUT_DIR,prefix+'-'+tpl+'.png'),Buffer.from(bytes));
 }}
 assert.deepEqual(errors,[]);console.log(JSON.stringify({...checks,errors}));
}finally{await b.close()}})().catch(e=>{console.error(e);process.exitCode=1});
