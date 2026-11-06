// Run against the static app: BASE_URL=http://127.0.0.1:8000 node tests/preview-gestures.spec.cjs
const {chromium,webkit}=require('playwright');
const assert=require('node:assert/strict');
(async()=>{
 const kind=process.env.BROWSER||'chromium';
 const browser=await ({chromium,webkit}[kind]).launch({headless:true,...(process.env.BROWSER_PATH?{executablePath:process.env.BROWSER_PATH}:{})});
 try{
  const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:3,isMobile:true,hasTouch:true});
  const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(process.env.BASE_URL||'http://127.0.0.1:8000',{waitUntil:'networkidle'});
  await page.locator('[data-m="invite"]').click();await page.locator('.tcard[data-id="inv_rose"]').click();
  await page.waitForTimeout(500);
  // Safari fallback cancels native smart zoom only in the preview, including empty card regions.
  assert.deepEqual(await page.evaluate(()=>{
   const cv=document.querySelector('#cv'),b=document.querySelector('#btnExport');
   const fire=(el,type)=>{const e=new Event(type,{bubbles:true,cancelable:true});el.dispatchEvent(e);return e.defaultPrevented};
   return [fire(cv,'touchend'),fire(cv,'dblclick'),fire(b,'touchend'),getComputedStyle(document.querySelector('#device')).touchAction];
  }),[true,true,false,'none']);
  const measure=()=>page.evaluate(()=>({scale:visualViewport.scale,width:document.documentElement.clientWidth,overflow:document.documentElement.scrollWidth>innerWidth}));
  const before=await measure();
  const point=await page.evaluate(()=>{const e=lastSlots[0],r=cv.getBoundingClientRect();return{x:r.left+(e.x+e.w/2)*r.width/1000,y:r.top+(e.y+e.h/2)*r.width/1000}});
  for(let i=0;i<4;i++){await page.touchscreen.tap(point.x,point.y);await page.touchscreen.tap(point.x,point.y)}
  await page.waitForTimeout(350);assert.deepEqual(await measure(),before);
  let pinch=false;
  if(kind==='chromium'){
   const cdp=await context.newCDPSession(page);
   const fingers=span=>[{x:point.x-span,y:point.y,id:0},{x:point.x+span,y:point.y,id:1}];
   const pinchPhoto=async(from,to)=>{
    await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:fingers(from)});
    for(let i=1;i<=8;i++)await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:fingers(from+(to-from)*i/8)});
    await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await page.waitForTimeout(200);
   };
   await pinchPhoto(20,40);const z=await page.evaluate(()=>ens(0).z);assert.ok(z>1.1,'Photo must zoom, not the page');
   await pinchPhoto(40,22);assert.ok(await page.evaluate(()=>ens(0).z)<z,'Photo must zoom back out');pinch=true;
   await page.locator('#sbCtr').click();assert.equal(await page.evaluate(()=>ens(0).z),1);
   const touch=(type,y)=>cdp.send('Input.dispatchTouchEvent',{type,touchPoints:type==='touchEnd'?[]:[{x:point.x,y,id:0}]});
   await touch('touchStart',point.y);for(let i=1;i<=8;i++)await touch('touchMove',point.y+i*5);await touch('touchEnd',point.y+40);
   assert.ok(await page.evaluate(()=>ens(0).oy)>0,'Photo dragging must still work');
  }
  assert.deepEqual(await measure(),before);
  await page.locator('[data-t="text"]').click();await page.locator('[data-k="gn"]').fill('Tên kiểm tra');
  assert.equal(await page.evaluate(()=>texts().gn),'Tên kiểm tra');
  assert.ok(await page.evaluate(async()=>{S.fmt='image/png';return(await renderBlob(-1)).size>10000}));
  assert.deepEqual(errors,[]);console.log(JSON.stringify({browser:kind,doubleTap:true,nativeZoomCancelledOnlyInPreview:true,pinch,drag:pinch,export:true,viewport:await measure(),errors}));
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
