// Content and geometry checks for the redesigned, independently composed templates.
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const context=vm.createContext({console,navigator:{userAgent:'',platform:'',maxTouchPoints:0},localStorage:{getItem:()=>null},document:{createElement:()=>({getContext:()=>({createImageData:()=>({data:new Uint8ClampedArray(128*128*4)}),putImageData(){}})})}});
for(const file of ['data','engine','templates'])vm.runInContext(fs.readFileSync(`assets/js/${file}.js`,'utf8'),context);
const result=vm.runInContext(`(()=>{
 let invitations=0,slides=0;const fingerprints=new Set();
 const validate=(e,W,H,id)=>{
  for(const a of e){
   for(const key of ['x','y','w','h','size','s'])if(a[key]!==undefined&&!Number.isFinite(a[key]))throw Error(id+' invalid '+key);
   if(a.t==='img'&&(a.x<-.01||a.y<-.01||a.x+a.w>W+.1||a.y+a.h>H+.1))throw Error(id+' photo outside output');
   if((a.t==='img'||a.t==='archline')&&a.shape==='arch'&&a.h<a.w/2)throw Error(id+' malformed arch');
   if(['text','rich'].includes(a.t)&&(a.y<0||a.y>H))throw Error(id+' text outside output');
  }
 };
 for(const size of Object.values(ISIZES))for(const t of INVT){
  const W=1000,H=W*size.h/size.w,f={...texts(),churchAddress:'Địa chỉ thánh đường',homeDate:'24/01/2027',homeTime:'10:30',homeLunar:'17 tháng Chạp năm Bính Ngọ'},v={t:'Một câu Lời Chúa do người dùng tự nhập.',r:'Trích dẫn riêng'};
  const e=t.b({W,H,f,v,sym:'crossring'});validate(e,W,H,t.id);
  const text=e.filter(a=>a.t==='text'),parent=e.filter(a=>a.role==='parent');
  for(const key of ['gn','bn','gs','bs','grank','brank','ga','ba','parish','churchAddress'])if(!text.some(a=>a.text===f[key]))throw Error(t.id+' missing '+key);
  if(parent.length!==4)throw Error(t.id+' missing parent');
  for(const key of ['gfn','gmn','bfn','bmn'])if(!parent.some(a=>a.segs.some(b=>b.text===f[key])))throw Error(t.id+' missing '+key);
  for(const role of ['mass-date','mass-time','home-date','home-time','lunar-date'])if(!text.some(a=>a.role===role))throw Error(t.id+' missing event '+role);
  if(text.find(a=>a.role==='mass-date').text===text.find(a=>a.role==='home-date').text)throw Error('events are coupled');
  if(!text.some(a=>a.text==='“'+v.t+'”')||!text.some(a=>a.text===v.r))throw Error('custom Scripture ignored');
  if(text.filter(a=>a.role==='couple-name').some(a=>a.upper))throw Error('forced uppercase calligraphy');
  if(size===ISIZES.share)fingerprints.add(JSON.stringify(e.filter(a=>['img','text'].includes(a.t)).map(a=>[a.t,a.x,a.y,a.font])));
  invitations++;
 }
 if(fingerprints.size!==5)throw Error('reused invitation composition');
 const photos={waiting:1,welcome:1,couple:2,verse:1,panel:1,collage:5,frame:1,duo:2,grid:6,monogram:1,covenant:1,sacrament:1,poster:1,emblem:0,thanks:1};
 for(const size of Object.values(SIZES))for(const t of TPL)for(const v of [VERSES[0],VERSES[5],{t:'Anh em hãy yêu thương nhau như Thầy đã yêu thương anh em. Trên hết mọi đức tính, anh em phải có lòng bác ái: đó là mối dây liên kết tuyệt hảo.',r:'Câu dài'}]){
  const W=1000,H=W*size.h/size.w,f=texts(),e=t.b({W,H,m:Math.min(W,H)*.06,g:12,f,v,land:W>H*1.05,sym:'crossring',P:pal()});validate(e,W,H,t.id);
  const text=e.filter(a=>a.t==='text');
  for(const key of ['gn','bn','gs','bs','parish'])if(!text.some(a=>a.text===f[key]))throw Error(t.id+' missing '+key);
  if(!text.some(a=>a.role==='event'))throw Error(t.id+' missing event');
  if(e.filter(a=>a.t==='img').length!==photos[t.id])throw Error(t.id+' changed photo slot count');
  if(t.id!=='thanks'&&!text.some(a=>a.text==='“'+v.t+'”'))throw Error(t.id+' missing Scripture');
  slides++;
 }
 return{invitations,slides,uniqueInvitationCompositions:fingerprints.size};
})()`,context);
assert.equal(result.invitations,15);assert.equal(result.slides,360);console.log(result);
