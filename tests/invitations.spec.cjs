// Run with Playwright installed: node tests/invitations.spec.cjs
// BASE_URL points to a local static server. OUTPUT_DIR is outside the source tree.
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs/promises');
const path=require('node:path');
const base=process.env.BASE_URL||'http://127.0.0.1:8000';
const output=process.env.OUTPUT_DIR;
(async()=>{
  const browser=await chromium.launch({headless:true});
  const errors=[];
  try{
    const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:true,hasTouch:true,acceptDownloads:true});
    const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
    await page.goto(base,{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);
    await page.locator('[data-m="invite"]').click();
    const ids=await page.locator('.tcard').evaluateAll(es=>es.map(e=>e.dataset.id));
    assert.equal(ids.length,5);
    if(output)await fs.mkdir(output,{recursive:true});
    let exports=0;
    for(const id of ids){
      await page.locator('.tcard[data-id="'+id+'"]').click();
      for(const size of ['share','a5','a6'])for(const fmt of ['image/jpeg','image/png']){
        await page.evaluate(({size,fmt})=>{S.isize=size;S.fmt=fmt;S.dpi=150;fitStage()}, {size,fmt});
        await page.locator('#btnExport').click();
        await page.locator('#modal.show .mprev img').waitFor({state:'visible'});
        assert.equal(await page.locator('#mbox h3').textContent(),'Thiệp mời đã sẵn sàng ✦');
        assert.equal(await page.locator('#busy').evaluate(e=>e.classList.contains('show')),false);
        const downloadPromise=page.waitForEvent('download');await page.locator('#mbox a[download]').click();
        const download=await downloadPromise;const bytes=await fs.readFile(await download.path());
        assert.ok(bytes.length>2000);
        assert.equal(bytes.subarray(0,fmt==='image/png'?8:3).toString('hex'),fmt==='image/png'?'89504e470d0a1a0a':'ffd8ff');
        if(output&&size==='share'&&fmt==='image/png')await fs.writeFile(path.join(output,id+'.png'),bytes);
        const dims=await page.evaluate(()=>exportDims());
        const natural=await page.locator('#mbox .mprev img').evaluate(async e=>{await e.decode();return{w:e.naturalWidth,h:e.naturalHeight}});
        assert.deepEqual(natural,dims);exports++;
        await page.locator('#cls').click();
      }
    }
    // Check the full set of information remains represented, including long input.
    const checks=await page.evaluate(()=>{
      const fields=['gs','gn','grank','bs','bn','brank','gfs','gfn','gms','gmn','ga','bfs','bfn','bms','bmn','ba','date','time','lunar','parish','inv1','inv2','inv3'];
      const longNames={gn:'Nguyễn Phạm Hoàng Minh Khang',bn:'Trần Nguyễn Lê Thảo Ngọc Vy',gfn:'Nguyễn Phạm Văn Minh An',bfn:'Trần Nguyễn Quốc Minh Bình',parish:'Giáo xứ Thánh Gia — Cộng đoàn An Bình'};
      S.texts={...longNames};let symbols=0;const layouts=[];
      for(const t of INVT){
        const used=new Set(),f=new Proxy(texts(),{get(o,k){used.add(k);return o[k]}});
        t.b({W:1000,H:1414,m:60,g:12,f,v:VERSES[0],sym:'crossring',P:pal(t.pal)});
        const missing=fields.filter(k=>!used.has(k));
        const els=layout(1000,1414,{...S.invite,tpl:t.id});
        const text=els.filter(e=>e.t==='text'||e.t==='rich');
        if(!text.every(e=>Number.isFinite(e.x)&&Number.isFinite(e.y)))throw Error('Invalid text position');
        if(['inv_cream','inv_wine'].includes(t.id)&&els.some(e=>e.t==='img'))throw Error('Photo in photo-free card');
        if(t.id==='inv_arch'&&!els.some(e=>e.t==='img'))throw Error('Missing photo in arch card');
        for(const key of Object.keys(SYMBOLS)){
          const c=document.createElement('canvas');c.width=280;c.height=280;drawSymbol(c.getContext('2d'),key,140,140,200,'gold',pal(t.pal));symbols++;
        }
        layouts.push({id:t.id,missing});
        const c=document.createElement('canvas');c.width=1414;c.height=2000;render(c.getContext('2d'),1414,2000,{slide:{...S.invite,tpl:t.id},idx:0});
      }
      S.texts={};return{layouts,symbols};
    });
    assert.ok(checks.layouts.every(x=>x.missing.length===0),JSON.stringify(checks.layouts));
    // Existing slideshow export and persisted custom text still work.
    await page.locator('[data-m="slides"]').click();
    const slideExport=await page.evaluate(async()=>{S.fmt='image/jpeg';const b=await renderBlob(0);S.texts={gn:'Tên khách tự nhập'};save();return b.size});
    assert.ok(slideExport>2000);await page.reload({waitUntil:'networkidle'});
    assert.equal(await page.evaluate(()=>texts().gn),'Tên khách tự nhập');
    for(const width of [390,430,1440]){
      await page.setViewportSize({width,height:width===1440?1000:932});
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
    }
    assert.deepEqual(errors,[]);
    console.log(JSON.stringify({exports,templates:ids.length,symbolChecks:checks.symbols,viewportWidths:[390,430,1440],slideExport:true,customTextPreserved:true,errors}));
    if(output)await fs.writeFile(path.join(output,'test-report.json'),JSON.stringify({exports,checks,errors}));
    await context.close();
  }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
