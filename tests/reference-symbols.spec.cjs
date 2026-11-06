// Run against a static preview with Playwright installed. BASE_URL may override localhost.
const {chromium}=require('playwright');const assert=require('node:assert/strict');
(async()=>{const browser=await chromium.launch({headless:true});try{
 const page=await browser.newPage({viewport:{width:1440,height:1000}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(process.env.BASE_URL||'http://127.0.0.1:8000',{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);
 await page.locator('[data-m="invite"]').click();await page.getByRole('button',{name:'Lời Chúa',exact:true}).click();
 const ids=['ref_covenant','ref_scripture','ref_bells','ref_lilies'];
 for(const id of ids){await page.locator('.symb[data-s="'+id+'"]').click();assert.equal(await page.evaluate(()=>curSlide().sym),id);}
 const report=await page.evaluate(async ids=>{
  let colors=0,exports=0;
  for(const id of ids){
   for(const color of ['gold','white']){
    const c=document.createElement('canvas');c.width=c.height=320;const x=c.getContext('2d');const before=x.getTransform();drawSymbol(x,id,160,160,270,color,pal());
    const after=x.getTransform();if(['a','b','c','d','e','f'].some(k=>after[k]!==before[k]))throw Error('Leaked canvas transform');
    const data=x.getImageData(0,0,320,320).data;let ink=0,border=0;
    for(let i=0;i<data.length;i+=4)if(data[i+3]){ink++;const n=i/4,xx=n%320,yy=Math.floor(n/320);if(xx<2||yy<2||xx>317||yy>317)border++;if(color==='white'&&(data[i]!==255||data[i+1]!==255||data[i+2]!==255))throw Error('White symbol is not white');}
    if(ink<500||border)throw Error(id+' empty or clipped');colors++;
   }
   for(const t of INVT)for(const format of ['image/png','image/jpeg']){S.invite.sym=id;S.invite.tpl=t.id;S.fmt=format;const b=await renderBlob(-1);if(b.size<3000)throw Error('Empty invitation export');exports++;}
  }
  return{colors,exports};
 },ids);
 assert.deepEqual(report,{colors:8,exports:16});assert.deepEqual(errors,[]);console.log(report);
}finally{await browser.close()}})().catch(e=>{console.error(e);process.exitCode=1});
