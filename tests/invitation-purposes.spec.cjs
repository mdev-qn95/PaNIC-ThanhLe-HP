const {chromium}=require('playwright'),assert=require('node:assert/strict'),fs=require('node:fs/promises'),path=require('node:path');
(async()=>{const b=await chromium.launch({headless:true,...(process.env.BROWSER_PATH?{executablePath:process.env.BROWSER_PATH}:{})});try{
 const p=await b.newPage({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:true,hasTouch:true,acceptDownloads:true}),errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto(process.env.BASE_URL||'http://127.0.0.1:8000',{waitUntil:'networkidle'});await p.evaluate(()=>document.fonts.ready);
 await p.locator('[data-m="invite"]').click();await p.locator('[data-t="text"]').click();
 await p.locator('[data-purpose="wedding"]').click();assert.equal(await p.locator('[data-k="date"]').count(),0);
 await p.locator('[data-k="weddingDate"]').fill('12 · 04 · 2028');await p.locator('[data-k="weddingTime"]').fill('18:45');await p.locator('[data-k="weddingVenue"]').fill('Sảnh Minh Hoạ');await p.locator('[data-k="weddingLunar"]').fill('Ngày âm lịch Thành Hôn mẫu');
 await p.locator('[data-purpose="mass"]').click();assert.equal(await p.locator('[data-k="date"]').inputValue(),'20 · 12 · 2026');assert.equal(await p.locator('[data-k="weddingDate"]').count(),0);
 await p.locator('[data-k="date"]').fill('11 · 04 · 2028');await p.locator('[data-k="time"]').fill('08:15');await p.locator('[data-k="parish"]').fill('Giáo xứ Minh Hoạ');await p.locator('[data-k="lunar"]').fill('Ngày âm lịch Thánh Lễ mẫu');
 await p.locator('[data-purpose="both"]').click();assert.equal(await p.locator('[data-k="weddingTime"]').inputValue(),'18:45');assert.equal(await p.locator('[data-k="time"]').inputValue(),'08:15');
 await p.reload({waitUntil:'networkidle'});assert.deepEqual(await p.evaluate(()=>[S.invitePurpose,texts().date,texts().weddingDate]),['both','11 · 04 · 2028','12 · 04 · 2028']);
 const report=await p.evaluate(async()=>{let layouts=0,exports=0;const snapshots=[];
  for(const purpose of ['mass','wedding','both']){S.invitePurpose=purpose;
   for(const t of INVT)for(const size of ['share','a5','a6']){
    S.invite.tpl=t.id;S.isize=size;const d=exportDims(),e=layout(1000,1000*d.h/d.w,S.invite),events=e.filter(x=>x.scope==='event'),ids=[...new Set(events.map(x=>x.eventId))];
    const want=purpose==='both'?['mass','wedding']:[purpose];if(JSON.stringify(ids)!==JSON.stringify(want))throw Error('Wrong event types');
    for(const id of want){const text=events.filter(x=>x.eventId===id).map(x=>x.text).join(' '),time=id==='mass'?'08:15':'18:45',date=id==='mass'?'11.04.2028':'12.04.2028';if(!text.includes(time)||!text.includes(date))throw Error('Crossed schedules '+t.id)}
    if(purpose!=='both'){const all=e.map(x=>String(x.text||'')).join(' '),forbidden=purpose==='mass'?['18:45','12.04.2028','Sảnh Minh Hoạ','Ngày âm lịch Thành Hôn mẫu']:['08:15','11.04.2028','Giáo xứ Minh Hoạ','Ngày âm lịch Thánh Lễ mẫu'];if(forbidden.some(x=>all.includes(x)))throw Error('Mixed event content '+t.id)}
    if(purpose!=='both'&&events.some(x=>String(x.text).includes(purpose==='mass'?'18:45':'08:15')))throw Error('Leaked other event');
    if(!e.some(x=>String(x.text).includes(invitationTexts().inv2)))throw Error('Wrong invitation heading');
    for(const fmt of ['image/jpeg','image/png']){S.fmt=fmt;const z=await renderBlob(-1),im=await createImageBitmap(z);if(z.size<5000||im.width!==d.w||im.height!==d.h)throw Error('Bad export');im.close();exports++}layouts++;
   }
  }
  return{layouts,exports};
 });
 const output=process.env.OUTPUT_DIR;if(output){await fs.mkdir(output,{recursive:true});await p.evaluate(()=>{S.texts={};S.demo=true});
  for(const purpose of ['mass','wedding','both'])for(const id of ['inv_cream','inv_rose','inv_gold','inv_arch','inv_wine']){
   const encoded=await p.evaluate(({purpose,id})=>{S.invitePurpose=purpose;S.invite.tpl=id;const c=document.createElement('canvas');c.width=1000;c.height=1414;render(c.getContext('2d'),1000,1414,{slide:S.invite,idx:0});return c.toDataURL('image/jpeg',.92).split(',')[1]},{purpose,id});await fs.writeFile(path.join(output,purpose+'-'+id+'.jpg'),Buffer.from(encoded,'base64'));
  }
  await p.evaluate(()=>{S.mode='invite';S.invitePurpose='both';openTab('tpl');fitStage()});await p.screenshot({path:path.join(output,'mobile-purpose.png')});
 }
 for(const width of [360,390,430,1440]){await p.setViewportSize({width,height:width===1440?1000:844});assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false)}
 assert.deepEqual(errors,[]);console.log(JSON.stringify({...report,independentDates:true,persisted:true,errors}));
}finally{await b.close()}})().catch(e=>{console.error(e);process.exitCode=1});
