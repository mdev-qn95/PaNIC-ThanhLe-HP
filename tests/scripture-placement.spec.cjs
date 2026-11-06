const{chromium}=require('playwright');const assert=require('node:assert/strict');const fs=require('node:fs/promises');const path=require('node:path');
(async()=>{const b=await chromium.launch({headless:true,...(process.env.BROWSER_PATH?{executablePath:process.env.BROWSER_PATH}:{})});try{
 const p=await b.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});const errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto(process.env.BASE_URL||'http://127.0.0.1:8000',{waitUntil:'networkidle'});await p.evaluate(()=>document.fonts.ready);
 const checks=await p.evaluate(()=>{let count=0;const templates=new Set();
  for(const size of Object.values(SIZES))for(const v of [...VERSES,{t:'Tình yêu không bao giờ mất được. Anh em hãy yêu thương nhau như Thầy đã yêu thương anh em. Tình yêu thì nhẫn nhục, hiền hậu, không ghen tương.',r:'Câu kiểm tra dài'}]){
   const W=1000,H=1000*size.h/size.w;
   for(const t of TPL){
    const e=t.b({W,H,m:Math.min(W,H)*.06,g:12,f:texts(),v,land:W>H*1.05,sym:'crossring',P:pal(t.pal)}),photos=e.filter(x=>x.t==='img'),q=e.find(x=>x.t==='text'&&x.text==='“'+v.t+'”');
    if(!q||!photos.length)continue;templates.add(t.id);const width=q.fit||q.maxW,height=Math.min(q.maxH||Infinity,q.size*(q.lh||1.3)*est(q.text,q.size,q.maxW||width));
    for(const photo of photos){const beside=q.x+width/2<=photo.x||q.x-width/2>=photo.x+photo.w,above=q.y+height/2<=photo.y;
     if(!beside&&!above)throw Error(t.id+' puts Scripture below/on the photo for '+size.n);count++}
   }
  }
  return{count,templates:[...templates]};
 });assert.deepEqual(checks.templates,['verse','covenant']);
 if(process.env.OUTPUT_DIR){await fs.mkdir(process.env.OUTPUT_DIR,{recursive:true});for(const tpl of checks.templates)for(const [size,prefix]of [['tv169','land'],['tv916','port']]){
  const bytes=await p.evaluate(async({tpl,size})=>{S.mode='slides';S.cur=0;S.slides[0].tpl=tpl;S.size=size;S.fmt='image/png';const z=await renderBlob(0);return Array.from(new Uint8Array(await z.arrayBuffer()))},{tpl,size});assert.ok(bytes.length>10000);await fs.writeFile(path.join(process.env.OUTPUT_DIR,prefix+'-'+tpl+'.png'),Buffer.from(bytes));
 }}
 assert.deepEqual(errors,[]);console.log(JSON.stringify({...checks,errors}));
}finally{await b.close()}})().catch(e=>{console.error(e);process.exitCode=1});
