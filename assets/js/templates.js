'use strict';
const I=(x,y,w,h,o={})=>({t:'img',x,y,w,h,...o});
const initial=s=>(String(s||'').trim().split(/\s+/).pop()||'')[0]||'';
const saintCase=value=>String(value||'').normalize('NFC').toLocaleLowerCase('vi').replace(/(^|[\s-])([^\s-])/gu,(_,a,b)=>a+b.toLocaleUpperCase('vi'));
function clockWords(value){const m=String(value||'').trim().match(/^(\d{1,2})[:h.](\d{2})$/i);return m?`${Number(m[1])} giờ ${m[2]}`:String(value||'')}
const lunarText=f=>{const s=String(f.homeLunar??f.lunar??'').replace(/^\s*\(?Nhằm ngày\s*/i,'').replace(/\)\s*$/,'');return s?'Nhằm ngày '+s:''};

// A measured quotation and its reference form one tightly spaced block.
function scriptureBlock(e,{W,H,v,x=W/2,top,w,size,color,font='serif',maxH,gap,referenceSize}){
 const q={t:'text',text:'“'+(v.t||VERSES[0].t)+'”',x,y:top,size,font,italic:1,align:'center',valign:'top',maxW:w,fit:w,maxH,lh:1.22,noScale:1,color,role:'scripture'};
 e.push(q);const box=textBox(q);
 const ref={t:'text',text:v.t?v.r:VERSES[0].r,x,y:box.y+box.h+gap,size:referenceSize,font,align:'center',valign:'top',fit:w,noScale:1,color,role:'reference'};
 e.push(ref);return textBox(ref).y+textBox(ref).h;
}
const INV_PALETTES={
 ivory:{bg:'#faf6ed',ink:'#413a30',accent:'#987444',mute:'#817768'},
 cinema:{bg:'#faf7f0',ink:'#3d3b34',accent:'#8b7455',mute:'#827c70'},
 vermilion:{bg:'#672936',ink:'#fff2df',accent:'#e4c39b',mute:'#d4b4aa'},
 garden:{bg:'#edf0e5',ink:'#364d40',accent:'#728165',mute:'#798578'},
 arch:{bg:'#edf2f6',ink:'#344a60',accent:'#738a9f',mute:'#758493'}
};
function orderedInvitation(c,style){
 const{W,H,f,v,sym}=c,C=INV_PALETTES[style],k=Math.min(W/1000,H/1414),e=[];
 const T=(text,x,y,size=24,o={})=>{const a={t:'text',text,x:W*x,y:H*y,size:size*k,font:'cg',align:'center',fit:W*.84,noScale:1,color:C.ink,...o};e.push(a);return a};
 const branch=(x,y,s,flip=1)=>e.push({t:'botanical',x:x*W,y:y*H,s:s*k,flip,color:C.accent,alpha:.12});
 e.push({t:'rect',x:0,y:0,w:W,h:H,fill:C.bg},{t:'paper',alpha:.10});
 if(style==='ivory')e.push({t:'rframe',x:W*.035,y:H*.026,w:W*.93,h:H*.948,r:2,lw:.8*k,color:C.accent,alpha:.35});
 if(style==='vermilion'){branch(.04,.45,280);branch(.96,.60,280,-1)}
 if(style==='garden'){branch(.045,.45,270);branch(.95,.65,200,-1)}
 if(style==='arch')e.push({t:'archline',x:W*.035,y:H*.026,w:W*.93,h:H*.948,color:C.accent,lw:.7*k,alpha:.22});
 const qEnd=scriptureBlock(e,{W,H,v,top:H*.043,w:W*.82,size:30*k,color:C.accent,font:'cg',maxH:H*.063,gap:5*k,referenceSize:18*k});
 const familyY=Math.max(H*.143,qEnd+H*.023);
 for(const [x,sa,na,sb,nb,addr]of [[.265,f.gfs,f.gfn,f.gms,f.gmn,f.ga],[.735,f.bfs,f.bfn,f.bms,f.bmn,f.ba]]){
   T('Ông Bà',x,familyY/H,21,{italic:1,color:C.accent,role:'family-label',fit:W*.4});
   for(const [st,n,dy]of [[sa,na,.032],[sb,nb,.064]])e.push({t:'rich',x:W*x,y:familyY+H*dy,size:21*k,fit:W*.40,align:'center',role:'parent',segs:[{text:saintCase(st)+' ',font:'cg',italic:1,color:C.accent},{text:n,font:'times',upper:1,color:C.ink}]});
   T(addr,x,familyY/H+.103,18,{fit:W*.39,maxW:W*.39,maxH:H*.033,lh:1.14,color:C.mute,role:'family-address'});
 }
 T('TRÂN TRỌNG BÁO TIN',.5,.310,17,{font:'mont',ls:.09,role:'announcement-start'});
 T('LỄ THÀNH HÔN',.5,.343,33,{font:'pf',weight:700,ls:.045,color:C.accent,role:'announcement'});
 T('CỦA CON CHÚNG TÔI',.5,.373,17,{font:'mont',ls:.09,role:'announcement-end'});
 const person=(who,x,y,w,size=65,font='gv')=>{
   const g=who==='g';
   T(g?f.gs:f.bs,x,y,20,{font:'mont',upper:1,ls:.12,fit:W*w,color:C.accent,role:g?'groom-saint':'bride-saint'});
   T(g?f.gn:f.bn,x,y+.037,size,{font,italic:font==='pf',fit:W*w,role:g?'groom-name':'bride-name'});
   T(g?f.grank:f.brank,x,y+.067,18,{italic:1,fit:W*w,color:C.mute,role:g?'groom-rank':'bride-rank'});
 };
 if(style==='ivory'){
   person('g',.275,.455,.36,68);person('b',.725,.455,.36,68);
   e.push({t:'sym',kind:sym,x:W*.5,y:H*.50,s:45*k,color:'gold'});
 }else if(style==='vermilion'){
   person('g',.41,.412,.68,73);person('b',.59,.536,.68,73);
   T('&',.5,.514,37,{font:'gv',color:C.accent});
 }else{
   const photoLeft=style==='garden',cx=photoLeft?.68:.32,pw=style==='arch'?.265:.31,px=photoLeft?.07:1-.07-pw;
   const ph=H*.205,py=H*.414;
   if(style==='arch'){
     const d=Math.min(W*pw,ph);e.push(I(W*(px+pw/2)-d/2,py+(ph-d)/2,d,d,{shape:'circle'}));
     e.push({t:'gframe',x:W*(px+pw/2)-d/2-5*k,y:py+(ph-d)/2-5*k,w:d+10*k,h:d+10*k,shape:'circle',lw:.8*k});
   }else e.push(I(W*px,py,W*pw,ph,{shape:photoLeft?'arch':undefined,r:photoLeft?0:8*k}));
   person('g',cx,.415,.48,57,style==='arch'?'pf':'gv');person('b',cx,.537,.48,59);
   e.push({t:'sym',kind:sym,x:W*cx,y:H*.515,s:30*k,color:'gold'});
 }
 T('THÁNH LỄ HÔN PHỐI ĐƯỢC CỬ HÀNH TẠI:',.5,.650,18,{font:'times',role:'mass-label'});
 const church=/^thánh\s+(đường|nhà)/iu.test(f.parish)?f.parish:'Thánh đường '+(/^giáo\s+xứ/iu.test(f.parish)?f.parish:'Giáo xứ '+f.parish);
 T(church,.5,.686,26,{font:'pf',weight:700,upper:1,maxW:W*.84,maxH:H*.035,color:C.accent,role:'church'});
 T(f.churchAddress,.5,.721,19,{maxW:W*.82,maxH:H*.027,lh:1.15,color:C.mute,role:'church-address'});
 T(`${clockWords(f.time)} · ${weekday(f.date)}`,.5,.752,21,{role:'mass-time'});
 T(dotDate(f.date),.5,.781,30,{font:'pf',weight:700,color:C.accent,role:'mass-date'});
 T('HÔN LỄ ĐƯỢC CỬ HÀNH TẠI TƯ GIA NAM',.5,.824,18,{font:'times',role:'home-label'});
 T(`${clockWords(f.homeTime)} · ${weekday(f.homeDate)} · ${dotDate(f.homeDate)}`,.5,.851,21,{role:'home-event'});
 T(lunarText(f),.5,.875,16,{italic:1,color:C.mute,role:'lunar-date'});
 T('Tiệc cưới · '+f.receptionVenue,.5,.906,22,{font:'pf',color:C.accent,fit:W*.82,role:'reception-venue'});
 T(f.receptionAddress,.5,.933,18,{color:C.mute,maxW:W*.82,maxH:H*.030,lh:1.13,role:'reception-address'});
 T(`${clockWords(f.receptionTime)} · ${weekday(f.receptionDate)} · ${dotDate(f.receptionDate)}`,.5,.963,22,{role:'reception-event'});
 return e;
}
const INVT=[
 {id:'inv_cream',n:'Lời hẹn ban mai',d:'Giấy ngà · tên thư pháp song đôi',style:'ivory'},
 {id:'inv_rose',n:'Thước phim tình yêu',d:'Ảnh chân dung · chữ viết tay',style:'cinema'},
 {id:'inv_gold',n:'Nét son',d:'Đỏ son · tên lệch nhịp',style:'vermilion'},
 {id:'inv_arch',n:'Vườn giao ước',d:'Ảnh vòm · xanh lá · hai nửa giao hòa',style:'garden'},
 {id:'inv_wine',n:'Ánh sáng thánh đường',d:'Ảnh huy hiệu · xanh sương',style:'arch'}
].map(t=>{const C=INV_PALETTES[t.style];return{...t,pal:{bg:C.bg,text:C.ink,accent:C.accent},b:c=>orderedInvitation(c,t.style)}});

// Every slide has a measured sacred heading, generous margins, and disjoint image/text zones.
function slideComposition(c,kind){
 const{W,H,f,v,sym,P,land}=c,z=Math.min(W,H),px=W*.055,py=H*.05,g=z*.045,dark=kind==='covenant',bg=dark?P.text:P.bg,ink=dark?P.bg:P.text,accent=P.accent,e=[];
 const T=(text,x,y,size,w,color=ink,o={})=>{const a={t:'text',text,x,y,size,font:'serif',align:'center',fit:w,noScale:1,color,...o};e.push(a);return a};
 e.push({t:'rect',x:0,y:0,w:W,h:H,fill:bg},{t:'paper',alpha:.07});
 const qEnd=scriptureBlock(e,{W,H,v,top:py,w:W*.84,size:z*(land?.043:.037),maxH:Math.min(H*.155,z*.15),color:ink,gap:z*.007,referenceSize:z*.022});
 const title=T('THÁNH LỄ HÔN PHỐI',W/2,qEnd+z*.026,z*.034,W*.84,accent,{font:'display',ls:.105,upper:1,valign:'top',role:'title'});
 const bodyTop=textBox(title).y+textBox(title).h+g;
 const parishProto={t:'text',text:f.parish,size:z*.032,font:'serif',fit:W*.84,noScale:1},dateProto={t:'text',text:`${clockWords(f.time)} · ${weekday(f.date)} · ${dotDate(f.date)}`,size:z*.025,font:'display',fit:W*.84,noScale:1};
 const ph=measureTextBlock(parishProto).tot,dh=measureTextBlock(dateProto).tot,footerTop=H-py-ph-dh-z*.012;
 const B={x:px,y:bodyTop,w:W-2*px,h:footerTop-g-bodyTop};
 T(f.parish,W/2,footerTop,z*.032,W*.84,accent,{valign:'top',role:'parish'});
 T(dateProto.text,W/2,footerTop+ph+z*.012,z*.025,W*.84,ink,{font:'display',valign:'top',role:'event'});
 const sub=(box,x,y,w,h)=>({x:box.x+box.w*x,y:box.y+box.h*y,w:box.w*w,h:box.h*h});
 const picture=(box,shape)=>{
   let{x,y,w,h}=box;if(shape==='circle'){const d=Math.min(w,h);x+=(w-d)/2;y+=(h-d)/2;w=h=d}
   if(shape==='arch'&&w>h*1.8){const nw=h*1.8;x+=(w-nw)/2;w=nw}
   e.push(I(x,y,w,h,{shape,r:shape?0:3}));
   if(kind==='frame')e.push({t:'archline',x:x-3,y:y-3,w:w+6,h:h+6,color:accent,lw:.8});
 };
 const textZone=(box,items)=>{
   const start=e.length;stack(e,box.x+box.w/2,box.y,box.y+box.h,items,box.w,'center',1.08);
   for(const a of e.slice(start))if(a.t==='text'){
     a.noScale=1;a.fit=Math.min(a.fit||box.w,box.w);
     let b=textBox(a);if(b.h>box.h){a.size*=box.h/b.h*.96;b=textBox(a)}
     a.x+=Math.max(0,box.x-b.x)-Math.max(0,b.x+b.w-box.x-box.w);
     a.y+=Math.max(0,box.y-b.y)-Math.max(0,b.y+b.h-box.y-box.h);
   }
 };
 const couple=(box,size=.13,extra=[])=>textZone(box,[...extra,...names(f,{size:z*size,color:ink,saintColor:accent,ampColor:accent})]);
 const person=(box,groom)=>textZone(box,[{text:groom?f.gs:f.bs,font:'display',size:z*.026,upper:1,ls:.15,color:accent},{text:groom?f.gn:f.bn,font:'script',size:z*.11,color:ink,lh:1.4}]);
 const symbolItem={sym,s:z*.075};
 if(kind==='emblem'){
   e.push({t:'botanical',x:W*.07,y:B.y+B.h*.48,s:Math.min(B.h,z)*.8,color:accent,alpha:.12},{t:'botanical',x:W*.93,y:B.y+B.h*.53,s:Math.min(B.h,z)*.8,flip:-1,color:accent,alpha:.12});
   couple(sub(B,.10,0,.80,1),.17,[symbolItem]);
 }else if(kind==='couple'){
   if(land){
     const upper=sub(B,0,0,1,.65);picture(sub(upper,.04,0,.39,1),'circle');picture(sub(upper,.57,0,.39,1),'circle');
     person(sub(B,0,.72,.44,.28),true);person(sub(B,.56,.72,.44,.28),false);
     e.push({t:'sym',kind:sym,x:W/2,y:upper.y+upper.h*.55,s:z*.075,color:'gold'});
   }else{
     for(let r=0;r<2;r++){const row=sub(B,0,r*.54,1,.46),media=sub(row,0,0,.42,1),words=sub(row,.49,0,.51,1);picture(media,'circle');person(words,r===0)}
   }
 }else if(kind==='duo'){
   if(land){picture(sub(B,0,0,.225,1));picture(sub(B,.775,0,.225,1));couple(sub(B,.275,0,.45,1),.13,[symbolItem])}
   else{picture(sub(B,0,0,.475,.54));picture(sub(B,.525,0,.475,.54));couple(sub(B,0,.60,1,.40),.14)}
 }else if(kind==='grid'){
   if(land){
     for(let r=0;r<2;r++)for(let j=0;j<3;j++)picture(sub(B,j*.343,r*.74,.314,.26));
     person(sub(B,.02,.32,.43,.36),true);person(sub(B,.55,.32,.43,.36),false);
     e.push({t:'sym',kind:sym,x:W/2,y:B.y+B.h*.50,s:z*.07,color:'gold'});
   }else{
     for(let r=0;r<3;r++)for(let j=0;j<2;j++)picture(sub(B,j*.525,r*.205,.475,.182));
     couple(sub(B,0,.65,1,.35),.13);
   }
 }else if(kind==='collage'){
   const media=land?sub(B,0,0,.63,1):sub(B,0,0,1,.61),words=land?sub(B,.69,0,.31,1):sub(B,0,.67,1,.33),gap=z*.012;
   if(land){const aw=media.w*.56;picture({x:media.x,y:media.y,w:aw-gap,h:media.h});for(let n=0;n<4;n++)picture({x:media.x+aw+(n%2)*(media.w-aw+gap)/2,y:media.y+Math.floor(n/2)*(media.h+gap)/2,w:(media.w-aw-gap)/2,h:(media.h-gap)/2})}
   else{const ah=media.h*.56;picture({x:media.x,y:media.y,w:media.w,h:ah-gap});for(let n=0;n<4;n++)picture({x:media.x+(n%2)*(media.w+gap)/2,y:media.y+ah+Math.floor(n/2)*(media.h-ah+gap)/2,w:(media.w-gap)/2,h:(media.h-ah-gap)/2})}
   couple(words,.13,[symbolItem]);
 }else if(kind==='poster'){
   picture(sub(B,0,0,1,.66));
   if(land){person(sub(B,0,.74,.44,.26),true);person(sub(B,.56,.74,.44,.26),false);e.push({t:'sym',kind:sym,x:W/2,y:B.y+B.h*.87,s:z*.065,color:'gold'})}
   else couple(sub(B,0,.72,1,.28),.14);
 }else{
   const swapped=['panel','monogram'].includes(kind),media=land?sub(B,swapped?0:.52,0,.48,1):sub(B,0,kind==='thanks'?.48:0,1,kind==='thanks'?.52:.59);
   const words=land?sub(B,swapped?.54:0,0,.46,1):sub(B,0,kind==='thanks'?0:.65,1,kind==='thanks'?.42:.35);
   picture(media,['welcome','frame','covenant','sacrament'].includes(kind)?'arch':undefined);
   if(kind==='panel')e.push({t:'rect',x:words.x,y:words.y,w:words.w,h:words.h,fill:P.soft,r:4});
   if(kind==='thanks')couple(words,.08,[{text:f.thanks,font:'script',size:z*.15,color:accent,pad:8},{text:f.thanks2,font:'serif',italic:1,size:z*.031,wrap:1,lh:1.3,pad:12}]);
   else if(kind==='waiting')couple(words,.12,[symbolItem,{text:f.wait,font:'serif',italic:1,size:z*.026},{text:f.time,font:'display',size:z*.065,color:accent}]);
   else if(kind==='monogram')couple(words,.11,[{text:initial(f.gn)+' '+initial(f.bn),font:'nd',size:z*.17,color:accent,ls:.08,pad:12}]);
   else couple(words,kind==='verse'?.15:.13,[symbolItem]);
 }
 return e;
}
const TPL=[
 {id:'waiting',n:'Lời hẹn mở đầu',d:'Ảnh và chữ riêng · giờ Thánh lễ'},
 {id:'welcome',n:'Ngày chung đôi',d:'Ảnh vòm · tên thư pháp'},
 {id:'couple',n:'Hai mảnh ghép',d:'Hai chân dung · nhịp đôi'},
 {id:'verse',n:'Lời yêu vĩnh cửu',d:'Lời Chúa phía trên · chân dung bên cạnh'},
 {id:'panel',n:'Khung ký ức',d:'Ảnh bên trái · khoảng giấy bên phải'},
 {id:'collage',n:'Chuyện chúng mình',d:'Năm ảnh · tên ở vùng riêng'},
 {id:'frame',n:'Cửa vòm ánh sáng',d:'Nét vòm mảnh · ảnh chân dung'},
 {id:'duo',n:'Song hành',d:'Hai ảnh hai bên · tên ở giữa'},
 {id:'grid',n:'Những ngày bên nhau',d:'Sáu ảnh · khoảng chữ riêng'},
 {id:'monogram',n:'Dấu ấn hai người',d:'Chữ lồng · chân dung'},
 {id:'covenant',n:'Giao ước',d:'Nền trầm · chân dung vòm'},
 {id:'sacrament',n:'Bí tích tình yêu',d:'Biểu tượng đức tin · ảnh vòm'},
 {id:'poster',n:'Thước phim hạnh phúc',d:'Ảnh rộng · tên phía dưới'},
 {id:'emblem',n:'Lời hẹn không ảnh',d:'Chữ thư pháp · nhành lá'},
 {id:'thanks',n:'Lời tạ ơn',d:'Lời cảm tạ bên ảnh'}
].map(t=>({...t,b:c=>slideComposition(c,t.id)}));
