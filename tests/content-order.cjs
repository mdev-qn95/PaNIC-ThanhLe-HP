// Verify the content contract and all text/image boundaries in every export aspect ratio.
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
function context2d(){return{font:'20px serif',measureText(t){const z=+(this.font.match(/([\d.]+)px/)||[])[1]||20;return{width:[...String(t)].length*z*.49}},createImageData:()=>({data:new Uint8ClampedArray(128*128*4)}),putImageData(){}}}
const context=vm.createContext({console,navigator:{userAgent:'',platform:'',maxTouchPoints:0},localStorage:{getItem:()=>null},document:{createElement:()=>({getContext:()=>context2d()})}});
for(const file of ['data','engine','templates'])vm.runInContext(fs.readFileSync(`assets/js/${file}.js`,'utf8'),context);
const result=vm.runInContext(`(()=>{
 S.texts={homeDate:'02/02/2027',homeTime:'11:00',ga:'Địa chỉ đã lưu'};
 if(texts().receptionDate!=='02/02/2027'||texts().receptionTime!=='11:00'||texts().receptionAddress!=='Địa chỉ đã lưu')throw Error('legacy reception defaults');
 S.texts={};
 let invitations=0,slides=0,overlapChecks=0;const fingerprints=new Set();
 const rectOverlap=(a,b)=>a.x<b.x+b.w-.01&&a.x+a.w>b.x+.01&&a.y<b.y+b.h-.01&&a.y+a.h>b.y+.01;
 const checkText=(e,W,H,id,photos=false)=>{
  for(const a of e){
   if(a.t==='img'&&(a.x<0||a.y<0||a.x+a.w>W+.1||a.y+a.h>H+.1))throw Error(id+' photo outside output');
   if(a.t==='text'&&a.text){const b=textBox(a);if(![b.x,b.y,b.w,b.h].every(Number.isFinite))throw Error('invalid bounds');
    if(b.x<W*.04-.1||b.x+b.w>W*.96+.1||b.y<H*.035-.1||b.y+b.h>H*.98+.1)throw Error(id+' insufficient text margin: '+a.text);
    if(photos)for(const photo of e.filter(q=>q.t==='img')){if(rectOverlap(b,photo))throw Error(id+' text overlaps photo: '+a.text);overlapChecks++;}
   }
  }
 };
 const verses=[VERSES[0],VERSES[5],{t:'Anh em hãy yêu thương nhau như Thầy đã yêu thương anh em. Trên hết mọi đức tính, anh em phải có lòng bác ái: đó là mối dây liên kết tuyệt hảo.',r:'Câu trích dài'}];
 for(const size of Object.values(ISIZES))for(const t of INVT)for(const v of verses){
  const W=1000,H=W*size.h/size.w,f={...texts(),homeDate:'24/01/2027',homeTime:'10:30',homeLunar:'17 tháng Chạp năm Bính Ngọ',receptionDate:'25/01/2027',receptionTime:'18:30',receptionVenue:'Trung tâm tiệc cưới thử nghiệm',receptionAddress:'123 Đường Tiệc Cưới, Thành phố'};
  const e=t.b({W,H,f,v,sym:'crossring'});checkText(e,W,H,t.id);
  const tx=e.filter(a=>a.t==='text'),parent=e.filter(a=>a.role==='parent'),one=role=>{const a=tx.find(a=>a.role===role);if(!a)throw Error('missing '+role);return a};
  if(parent.length!==4||!parent.every(a=>a.segs[1].upper===1))throw Error('parent uppercase');
  if(tx.some(a=>a.text==='Nhà trai'||a.text==='Nhà gái')||tx.filter(a=>a.text==='Ông Bà').length!==2)throw Error('family labels');
  for(const key of ['gn','bn','gs','bs','grank','brank','ga','ba','churchAddress'])if(!tx.some(a=>a.text===f[key]))throw Error('missing '+key);
  const order=[one('scripture').y,one('reference').y,...parent.slice(0,2).map(a=>a.y),one('family-address').y,one('announcement-start').y,one('announcement').y,one('announcement-end').y,one('groom-name').y,one('mass-label').y,one('church').y,one('church-address').y,one('mass-time').y,one('mass-date').y,one('home-label').y,one('home-event').y,one('reception-venue').y,one('reception-address').y,one('reception-event').y];
  if(order.some((y,i)=>i&&y<=order[i-1]))throw Error(t.id+' incorrect content order');
  if(one('announcement').weight!==700)throw Error('announcement not bold');
  if(one('reference').y-(textBox(one('scripture')).y+textBox(one('scripture')).h)>8)throw Error('distant reference');
  if(!one('reception-event').text.includes('25.01.2027')||!one('home-event').text.includes('24.01.2027'))throw Error('reception coupled to home');
  if(!one('reception-venue').text.includes(f.receptionVenue))throw Error('missing reception venue');
  if(size===ISIZES.share&&v===verses[0])fingerprints.add(JSON.stringify(e.map(a=>[a.t,a.x,a.y,a.w,a.h,a.font,a.fill])));
  invitations++;
 }
 const photos={waiting:1,welcome:1,couple:2,verse:1,panel:1,collage:5,frame:1,duo:2,grid:6,monogram:1,covenant:1,sacrament:1,poster:1,emblem:0,thanks:1};
 for(const size of Object.values(SIZES))for(const t of TPL)for(const v of verses){
  const W=1000,H=W*size.h/size.w,f=texts(),e=t.b({W,H,m:Math.min(W,H)*.06,g:12,f,v,land:W>H*1.05,sym:'crossring',P:pal()});checkText(e,W,H,t.id,true);
  const tx=e.filter(a=>a.t==='text'),q=tx.find(a=>a.role==='scripture'),r=tx.find(a=>a.role==='reference'),title=tx.find(a=>a.role==='title');
  if(!q||!r||!title||title.text!=='THÁNH LỄ HÔN PHỐI')throw Error('missing sacred heading');
  if(q.y>=r.y||textBox(r).y+textBox(r).h>=title.y)throw Error('heading order');
  const gap=r.y-(textBox(q).y+textBox(q).h);if(gap<0||gap>Math.min(W,H)*.01)throw Error('citation gap');
  if(tx.some(a=>a.y<q.y))throw Error('quotation not first');
  for(const key of ['gn','bn','gs','bs','parish'])if(!tx.some(a=>a.text===f[key]))throw Error('missing '+key);
  if(e.filter(a=>a.t==='img').length!==photos[t.id])throw Error('changed photo count');
  slides++;
 }
 if(fingerprints.size!==5)throw Error('duplicate invitation designs');
 return{invitations,slides,overlapChecks,uniqueInvitationCompositions:fingerprints.size};
})()`,context);
assert.equal(result.invitations,45);assert.equal(result.slides,360);console.log(result);
