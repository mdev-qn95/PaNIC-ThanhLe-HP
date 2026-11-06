// Geometry and content contract, independent of the browser UI.
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const context=vm.createContext({console,navigator:{userAgent:'',platform:'',maxTouchPoints:0},localStorage:{getItem:()=>null},document:{createElement:()=>({getContext:()=>({createImageData:()=>({data:new Uint8ClampedArray(128*128*4)}),putImageData(){}})})}});
for(const f of ['data','engine','templates'])vm.runInContext(fs.readFileSync(`assets/js/${f}.js`,'utf8'),context);
const result=vm.runInContext(`(()=>{
let invites=0,slides=0;
for(const dims of Object.values(ISIZES))for(const t of INVT){
 const W=1000,H=W*dims.h/dims.w, f={...texts(),churchAddress:'Địa chỉ thánh đường dài để kiểm tra',homeDate:'24/01/2027',homeTime:'10:30',homeLunar:'17 tháng Chạp năm Bính Ngọ'};
 const e=t.b({W,H,f,v:VERSES[4],sym:'none'}),tx=e.filter(a=>a.t==='text');
 const find=s=>{const x=tx.find(a=>a.text===s);if(!x)throw Error(t.id+' missing '+s);return x};
 const mass=tx.filter(a=>a.event==='mass'),home=tx.filter(a=>a.event==='home');
 const order=[find('“'+INV_VERSE.t+'”').y,find('Ông Bà').y,find([f.gfs,f.gfn].join(' ')).y,find([f.gms,f.gmn].join(' ')).y,find(f.ga).y,find('Trân trọng báo tin').y,find('Lễ thành hôn').y,find('của con chúng tôi').y,find(f.gs).y,find(f.gn).y,find(f.grank).y,e.find(a=>a.t==='sym').y,find(f.bs).y,find(f.bn).y,find(f.brank).y,find('Thánh lễ hôn phối được cử hành tại').y,find('Thánh Đường '+f.parish).y,find(f.churchAddress).y,mass[0].y,find('Hôn lễ được cử hành tại tư gia nam').y,home[0].y,find('(Nhằm ngày 17 tháng Chạp năm Bính Ngọ)').y];
 if(order.some((y,i)=>i&&y<=order[i-1]))throw Error(t.id+' order');
 if(mass.length!==3||home.length!==3||!mass.every(a=>a.y===mass[0].y)||!home.every(a=>a.y===home[0].y))throw Error('event grouping');
 if(!home.every(a=>a.weight===700)||mass.find(a=>a.text===dotDate(f.date)).weight!==700)throw Error('event bold');
 if(!home.some(a=>a.text==='VÀO LÚC 10 GIỜ 30'))throw Error('home time format');
 const exceptions=new Set(['scripture','family-label','family-address','family-rank','church-address','lunar-date']);
 for(const a of tx){if(exceptions.has(a.role)){if(a.upper!==0)throw Error('case exception '+a.role)}else if(a.upper!==1)throw Error('missing uppercase '+a.text);}
 if(!find('“'+INV_VERSE.t+'”').italic||find('Lễ thành hôn').weight!==700||find('Thánh Đường '+f.parish).weight!==700)throw Error('type emphasis');
 if(!tx.filter(a=>a.role==='couple-name').every(a=>['pf','ds'].includes(a.font)))throw Error('decorative names');
 if(tx.some(a=>!Number.isFinite(a.y)||a.y<0||a.y>H))throw Error('out of bounds');
 const ph=e.filter(a=>a.t==='img');if(ph.length!==(['inv_cream','inv_wine'].includes(t.id)?0:1))throw Error('photo count');
 if(ph.some(a=>a.shape==='arch'&&a.h<a.w/2))throw Error('arch exceeds photo bounds');
 if(ph.some(a=>a.y+a.h>=order[0]-35*H/1414))throw Error('photo/Scripture overlap');
 invites++;
}
for(const dims of Object.values(SIZES))for(const t of TPL)for(const v of [VERSES[0],VERSES[5],{t:'Anh em hãy yêu thương nhau như Thầy đã yêu thương anh em. Trên hết mọi đức tính, anh em phải có lòng bác ái: đó là mối dây liên kết tuyệt hảo.',r:'Câu dài'}]){
 const W=1000,H=W*dims.h/dims.w,f=texts(),e=t.b({W,H,m:Math.min(W,H)*.06,g:12,f,v,land:W>H*1.05,sym:'crossring',P:pal()});
 const text=e.filter(a=>a.t==='text'),title=text.find(a=>a.text==='THÁNH LỄ HÔN PHỐI'),q=text.find(a=>a.text==='“'+v.t+'”'),parish=text.find(a=>a.text===f.parish),date=text.find(a=>a.event==='mass'&&a.text===dotDate(f.date));
 if(!title||!q||!parish||!date)throw Error(t.id+' missing liturgy information');
 if(text.some(a=>a.y<title.y))throw Error(t.id+' title not first');
 if(e.filter(a=>a.t==='img').some(a=>a.y<q.y+q.maxH/2||a.y+a.h>parish.y))throw Error(t.id+' unsafe photo boundary');
 slides++;
}
return{invitationLayouts:invites,slideLayouts:slides,templates:INVT.length};})()`,context);
assert.equal(result.invitationLayouts,15);assert.equal(result.slideLayouts,360);console.log(result);
