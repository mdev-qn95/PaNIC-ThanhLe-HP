const {chromium,webkit}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs/promises');
(async()=>{
 for(const name of ['chromium','webkit']){
  const browser=await ({chromium,webkit}[name]).launch();
  try{
   const page=await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:3,isMobile:true,hasTouch:true});
   const errors=[];page.on('pageerror',e=>errors.push(e.message));
   await page.goto(process.env.BASE_URL||'http://127.0.0.1:3001',{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);
   await page.evaluate(()=>{S.cur=4;S.mode='invite';openTab('tpl');fitStage()});
   const photo=await page.evaluate(()=>{const c=document.createElement('canvas');c.width=800;c.height=1000;const x=c.getContext('2d');x.fillStyle='#00e2bc';x.fillRect(0,0,800,1000);x.fillStyle='#ef007a';x.fillRect(0,0,400,1000);return c.toDataURL().split(',')[1]});
   let checks=0;
   for(const count of [1,2,4]){
    await page.evaluate(()=>{photos=[];SLOTS={}});
    await page.locator('#file').setInputFiles(Array.from({length:count},(_,i)=>({name:'photo-'+i+'.png',mimeType:'image/png',buffer:Buffer.from(photo,'base64')})));
    await page.waitForFunction(n=>photos.length===n,count);
    for(const id of ['inv_rose','inv_gold','inv_arch']){
     await page.locator('.tcard[data-id="'+id+'"]').click();
     const ok=await page.evaluate(()=>{draw(true);const x=cv.getContext('2d'),a=x.getImageData(0,0,cv.width,cv.height).data;let n=0;for(let i=0;i<a.length;i+=4)if((a[i]<15&&a[i+1]>190&&a[i+2]>130)||(a[i]>200&&a[i+1]<15&&a[i+2]>80))n++;return n>1000});
     assert.ok(ok,`${name} ${id} ${count} uploaded photos missing`);
     assert.ok(await page.evaluate(async()=>{S.fmt='image/png';return(await renderBlob(-1)).size>10000}));
     await page.evaluate(()=>{sel=0;slotsOf(curSlide())[0]={pid:photos[photos.length-1].id,z:1.3,ox:.2,oy:-.1};draw(true);openTab('photo')});
     await page.evaluate(()=>openTab('tpl'));checks++;
    }
   }
   await page.evaluate(()=>{photos=[];SLOTS={};S.demo=true;S.invite.tpl='inv_cream';fitStage()});
   if(process.env.OUTPUT_DIR){await fs.mkdir(process.env.OUTPUT_DIR,{recursive:true});await page.screenshot({path:process.env.OUTPUT_DIR+'/'+name+'-mobile.png'});
    for(const id of ['inv_cream','inv_rose','inv_gold','inv_arch','inv_wine']){
     const b=await page.evaluate(async id=>{S.invite.tpl=id;S.isize='share';S.fmt='image/png';const b=await renderBlob(-1);return Array.from(new Uint8Array(await b.arrayBuffer()))},id);await fs.writeFile(process.env.OUTPUT_DIR+'/'+id+'.png',Buffer.from(b));
    }
   }
   assert.deepEqual(errors,[]);console.log(JSON.stringify({browser:name,photoPreviewAndExportChecks:checks,errors}));
  }finally{await browser.close()}
 }
})().catch(e=>{console.error(e);process.exitCode=1});
