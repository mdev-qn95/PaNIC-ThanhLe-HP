'use strict';
/* Compositions use real text and editable photo slots at every export resolution. */
const I=(x,y,w,h,o={})=>({t:'img',x,y,w,h,...o});
const initial=s=>(String(s||'').trim().split(/\s+/).pop()||'')[0]||'';
const saintCase=value=>String(value||'').normalize('NFC').toLocaleLowerCase('vi').replace(/(^|[\s-])([^\s-])/gu,(_,a,b)=>a+b.toLocaleUpperCase('vi'));
function clockWords(value){const m=String(value||'').trim().match(/^(\d{1,2})[:h.](\d{2})$/i);return m?`${Number(m[1])} giờ ${m[2]}`:String(value||'')}
const lunarText=f=>{const s=String(f.homeLunar??f.lunar??'').replace(/^\s*\(?Nhằm ngày\s*/i,'').replace(/\)\s*$/,'');return s?'Nhằm ngày '+s:''};
function mosaic5(e,x,y,w,h,g){const a=w*.62;e.push(I(x,y,a-g,h));for(let n=0;n<4;n++)e.push(I(x+a+(n%2)*(w-a+g)/2,y+Math.floor(n/2)*(h+g)/2,(w-a-g)/2,(h-g)/2))}

/* Five invitations: typography, cinematic photo, bold editorial, botanical diptych,
   and an architectural portrait. Each has its own information hierarchy. */
function inviteKit(c,C){
 const {W,H,f,v,sym}=c,k=Math.min(W/1000,H/1414),e=[];
 const T=(text,x,y,size=24,o={})=>{const a={t:'text',text,x:x*W,y:y*H,size:size*k,font:'cg',align:'center',fit:W*.84,noScale:1,color:C.ink,...o};e.push(a);return a};
 const R=(x,y,w,h,fill,o={})=>e.push({t:'rect',x:x*W,y:y*H,w:w*W,h:h*H,fill,...o});
 const L=(x1,y,x2,o={})=>e.push({t:'line',x1:x1*W,y1:y*H,x2:x2*W,y2:y*H,lw:k,color:C.accent,alpha:.45,...o});
 const photo=(x,y,w,h,o={})=>e.push(I(x*W,y*H,w*W,h*H,o));
 const verse=(x,y,w=.76,size=30,color=C.accent)=>{T('“'+v.t+'”',x,y,size,{font:'cg',italic:1,color,maxW:W*w,fit:W*w,maxH:H*.09,lh:1.22,role:'scripture'});T(v.r,x,y+.055,17,{font:'mont',ls:.05,color})};
 const person=(who,x,y,{size=76,font='gv',w=.82,align='center',color=C.ink}={})=>{
   const g=who==='g',saint=g?f.gs:f.bs,name=g?f.gn:f.bn,rank=g?f.grank:f.brank;
   T(saint,x,y,20,{font:'mont',ls:.13,upper:1,color:C.accent,align,fit:W*w,role:'saint'});
   T(name,x,y+.05,size,{font,align,fit:W*w,color,role:'couple-name',italic:font==='pf'});
   T(rank,x,y+.088,18,{italic:1,color:C.mute,align,fit:W*w,role:'family-rank'});
 };
 const families=(y=.861)=>{
   for(const [x,label,sa,na,sb,nb,addr]of [[.265,'Nhà trai',f.gfs,f.gfn,f.gms,f.gmn,f.ga],[.735,'Nhà gái',f.bfs,f.bfn,f.bms,f.bmn,f.ba]]){
     T(label,x,y,16,{font:'mont',upper:1,ls:.14,color:C.accent,fit:W*.4});
     for(const [st,n,dy]of [[sa,na,.027],[sb,nb,.052]])e.push({t:'rich',x:W*x,y:H*(y+dy),size:20*k,fit:W*.41,align:'center',role:'parent',segs:[{text:saintCase(st)+' ',font:'cg',italic:1,color:C.accent},{text:n,font:'times',color:C.ink}]});
     T(addr,x,y+.086,17,{color:C.mute,maxW:W*.39,fit:W*.39,maxH:H*.038,lh:1.15,role:'family-address'});
   }
 };
 const ceremonies=(y=.682)=>{
   L(.09,y-.025,.91);
   T('Thánh lễ hôn phối',.265,y,24,{font:'pf',color:C.accent,fit:W*.4});
   T(f.parish,.265,y+.033,23,{font:'cg',weight:500,fit:W*.4,maxW:W*.4,maxH:H*.041,role:'church'});
   T(f.churchAddress,.265,y+.069,17,{color:C.mute,maxW:W*.39,fit:W*.39,maxH:H*.029,lh:1.15,role:'church-address'});
   T(dotDate(f.date),.265,y+.101,28,{font:'pf',fit:W*.4,role:'mass-date'});
   T(`${weekday(f.date)} · ${clockWords(f.time)}`,.265,y+.129,19,{color:C.mute,fit:W*.4,role:'mass-time'});
   T('Lễ thành hôn',.735,y,24,{font:'pf',color:C.accent,fit:W*.4});
   T('Tư gia nhà trai',.735,y+.033,23,{fit:W*.4});
   T(dotDate(f.homeDate),.735,y+.072,28,{font:'pf',fit:W*.4,role:'home-date'});
   T(`${weekday(f.homeDate)} · ${clockWords(f.homeTime)}`,.735,y+.102,19,{color:C.mute,fit:W*.4,role:'home-time'});
   T(lunarText(f),.735,y+.131,16,{italic:1,color:C.mute,maxW:W*.40,fit:W*.40,maxH:H*.025,role:'lunar-date'});
 };
 const symbol=(x,y,size=50)=>e.push({t:'sym',kind:sym,x:x*W,y:y*H,s:size*k,color:'gold'});
 const branch=(x,y,s,flip=1,alpha=.18)=>e.push({t:'botanical',x:x*W,y:y*H,s:s*k,flip,color:C.accent,alpha});
 R(0,0,1,1,C.bg);e.push({t:'paper',alpha:.1});
 return{...c,C,e,k,T,R,L,photo,verse,person,families,ceremonies,symbol,branch};
}
const INV_PALETTES={
 ivory:{bg:'#faf6ed',ink:'#413a30',accent:'#9d7a49',mute:'#817768'},
 cinema:{bg:'#faf7f0',ink:'#3d3b34',accent:'#8b7455',mute:'#827c70'},
 vermilion:{bg:'#672936',ink:'#fff2df',accent:'#e4c39b',mute:'#d4b4aa'},
 garden:{bg:'#edf0e5',ink:'#364d40',accent:'#728165',mute:'#798578'},
 arch:{bg:'#edf2f6',ink:'#344a60',accent:'#8b9aa8',mute:'#758493'}
};
function inviteIvory(c){
 const K=inviteKit(c,INV_PALETTES.ivory),{e,T,L,verse,person,families,ceremonies,symbol,branch,f,W,H}=K;
 T('HÔN LỄ',.12,.055,15,{font:'mont',ls:.25,align:'left'});T(dotDate(f.date),.88,.055,18,{font:'mont',align:'right'});
 L(.12,.083,.88);symbol(.5,.14,44);
 T('Một lời hẹn',.5,.219,66,{font:'nd',italic:1});T('trọn đời',.59,.277,90,{font:'gv',color:K.C.accent});
 T('Trân trọng báo tin lễ thành hôn',.5,.344,20,{font:'mont',ls:.03});
 T('&',.5,.465,260,{font:'nd',italic:1,color:K.C.accent,alpha:.10});
 person('g',.47,.398,{size:84});person('b',.53,.522,{size:84});
 branch(.06,.44,330,1,.13);branch(.95,.56,240,-1,.13);
 verse(.5,.639,.73,26);ceremonies(.72);families(.892);
 // Footer family block uses the remaining page with compact leading.
 for(const a of e)if(a.role==='family-address')a.y=H*.978;
 return e;
}
function inviteCinema(c){
 const K=inviteKit(c,INV_PALETTES.cinema),{e,T,L,photo,verse,person,families,ceremonies,symbol,W,H}=K;
 photo(0,0,1,.515,{bleed:1});
 e.push({t:'shade',x:0,y:0,w:W,h:H*.19,dir:'down',alpha:.52},{t:'fade',x:0,y:H*.36,w:W,h:H*.16,dir:'down',color:K.C.bg});
 T('LỄ THÀNH HÔN',.5,.055,18,{font:'mont',ls:.24,color:'#fff9ef'});
 verse(.5,.118,.74,27,'#fff9ef');
 T('Chúng mình kết hôn',.5,.444,44,{font:'gv',color:K.C.accent});
 person('g',.5,.475,{size:78});person('b',.5,.604,{size:78});

 ceremonies(.728);families(.89);return e;
}
function inviteVermilion(c){
 const K=inviteKit(c,INV_PALETTES.vermilion),{e,T,R,L,verse,person,families,ceremonies,symbol,branch,f,W,H}=K;
 T('THIỆP HỶ',.11,.068,16,{font:'mont',ls:.22,align:'left',color:K.C.accent});
 symbol(.87,.075,50);L(.11,.114,.89);
 T('Trân trọng báo tin',.11,.169,25,{italic:1,align:'left'});
 T('Lễ thành hôn',.11,.219,53,{font:'pf',italic:1,align:'left',fit:W*.70});
 T('&',.72,.435,380,{font:'nd',italic:1,color:K.C.accent,alpha:.09});
 person('g',.12,.313,{size:85,align:'left',w:.76});person('b',.88,.472,{size:85,align:'right',w:.76});
 branch(.93,.35,280,-1,.16);branch(.07,.59,190,1,.13);
 verse(.5,.625,.73,27);ceremonies(.714);families(.885);return e;
}
function inviteGarden(c){
 const K=inviteKit(c,INV_PALETTES.garden),{e,T,R,L,photo,verse,person,families,ceremonies,symbol,branch,W,H}=K;
 R(.59,0,.41,.575,'#d4ddcb');photo(.61,.055,.33,.46,{shape:'arch'});
 e.push({t:'fade',x:W*.61,y:H*.47,w:W*.33,h:H*.05,dir:'down',color:'#d4ddcb'});
 symbol(.29,.084,45);T('Lễ thành hôn',.29,.147,28,{font:'pf',italic:1,fit:W*.48});
 person('g',.29,.225,{size:64,w:.47});T('&',.29,.36,48,{font:'gv',color:K.C.accent});person('b',.29,.405,{size:64,w:.47});
 branch(.05,.37,300,1,.16);branch(.94,.62,200,-1,.24);
 verse(.5,.62,.76,30);ceremonies(.712);families(.884);return e;
}
function inviteArch(c){
 const K=inviteKit(c,INV_PALETTES.arch),{e,T,R,L,photo,verse,person,families,ceremonies,symbol,W,H}=K;
 e.push({t:'archline',x:W*.105,y:H*.035,w:W*.79,h:H*.52,color:K.C.accent,lw:1.2});
 photo(.20,.066,.60,.355,{shape:'arch'});
 T('ĐƯỢC KẾT HỢP TRONG TÌNH YÊU',.5,.449,14,{font:'mont',ls:.12});
 person('g',.5,.47,{size:72,font:'pf'});person('b',.5,.607,{size:75,font:'gv'});
 symbol(.5,.581,28);
 // A quiet side inscription replaces the repeated header strip.
 T('“'+K.v.t+'”',.91,.256,25,{font:'cg',italic:1,rot:-Math.PI/2,fit:H*.29,color:K.C.ink,role:'scripture'});
 T(K.v.r,.1,.256,15,{font:'mont',rot:-Math.PI/2,color:K.C.accent});
 ceremonies(.731);families(.89);return e;
}
const INVT=[
 {id:'inv_cream',n:'Lời hẹn ban mai',d:'Giấy ngà · chữ thư pháp · khoảng thở',pal:INV_PALETTES.ivory,b:inviteIvory},
 {id:'inv_rose',n:'Thước phim tình yêu',d:'Ảnh lớn · ánh sáng mềm · tên viết tay',pal:INV_PALETTES.cinema,b:inviteCinema},
 {id:'inv_gold',n:'Nét son',d:'Đỏ son · bố cục lệch · thư pháp lớn',pal:INV_PALETTES.vermilion,b:inviteVermilion},
 {id:'inv_arch',n:'Vườn giao ước',d:'Ảnh dọc · xanh lá · hai nửa giao hòa',pal:INV_PALETTES.garden,b:inviteGarden},
 {id:'inv_wine',n:'Ánh sáng thánh đường',d:'Vòm ảnh · xanh sương · chữ bên khung',pal:INV_PALETTES.arch,b:inviteArch}
].map(t=>({...t,pal:{bg:t.pal.bg,text:t.pal.ink,accent:t.pal.accent}}));

/* Slide primitives: positions are fractions; font sizes follow the short edge. */
function slideKit(c){
 const {W,H,m,f,v,sym,land,P}=c,z=Math.min(W,H),e=[],ink=P.text,bg=P.bg,accent=P.accent;
 const T=(text,x,y,size=.045,o={})=>{const a={t:'text',text,x:x*W,y:y*H,size:size*z,font:'serif',align:'center',fit:W*.84,noScale:1,color:ink,...o};e.push(a);return a};
 const R=(x,y,w,h,fill,o={})=>e.push({t:'rect',x:x*W,y:y*H,w:w*W,h:h*H,fill,...o});
 const img=(x,y,w,h,o={})=>e.push(I(x*W,y*H,w*W,h*H,o));
 const fade=(x,y,w,h,dir='right',color=bg)=>e.push({t:'fade',x:x*W,y:y*H,w:w*W,h:h*H,dir,color});
 const head=(x,y,align='center',color=accent)=>T(f.title,x,y,.035,{font:'display',ls:.11,upper:1,align,color,fit:W*(land?.78:.86),role:'title'});
 const quote=(x,y,w=.73,size=.039,color=ink)=>{const maxH=Math.min(H*.17,z*.14),qh=Math.min(maxH,est(v.t,size*z,W*w)*size*z*1.25);T('“'+v.t+'”',x,y,size,{font:'serif',italic:1,color,maxW:W*w,fit:W*w,maxH,lh:1.25,role:'scripture'});T(v.r,x,y+(qh/2+z*.027)/H,.022,{font:'serif',color,role:'reference'})};
 const couple=(x,y0,y1,w=.8,size=.12,color=ink)=>stack(e,W*x,H*y0,H*y1,names(f,{size:z*size,color,saintColor:color===ink?accent:color,ampColor:color===ink?accent:color}),W*w,'center',1.12);
 const person=(who,x,y,w=.4,size=.1,color=ink)=>{T(who==='g'?f.gs:f.bs,x,y,.027,{font:'display',ls:.13,upper:1,color:color===ink?accent:color,fit:W*w});T(who==='g'?f.gn:f.bn,x,y+(land?.085:.046),size,{font:'script',color,fit:W*w,role:'couple-name'})};
 const info=(x,y,w=.8,color=accent)=>{T(f.parish,x,y,.031,{font:'serif',color,fit:W*w,role:'parish'});T(`${clockWords(f.time)} · ${weekday(f.date)} · ${dotDate(f.date)}`,x,y+(land?.053:.032),.025,{font:'display',color,fit:W*w,role:'event'})};
 const symbol=(x,y,s=.09,color='gold')=>e.push({t:'sym',kind:sym,x:W*x,y:H*y,s:z*s,color});
 const branch=(x,y,size=.6,flip=1)=>e.push({t:'botanical',x:W*x,y:H*y,s:z*size,flip,color:accent,alpha:.14});
 return{...c,e,z,T,R,img,fade,head,quote,couple,person,info,symbol,branch,ink,bg,accent};
}
function slideWaiting(c){const K=slideKit(c),{e,W,H,land,img,fade,head,quote,couple,info,T,ink,bg,accent}=K;
 img(0,0,1,1,{bleed:1});if(land){fade(0,0,.69,1,'left');head(.27,.09);quote(.27,.235,.43,.037);couple(.27,.39,.75,.46,.12);T(c.f.wait,.27,.82,.026,{italic:1});T(c.f.time,.27,.895,.075,{font:'display',color:accent});info(.77,.88,.4,'#ffffff')}
 else{fade(0,0,1,.42,'up');head(.5,.055);quote(.5,.14,.82,.038);fade(0,.55,1,.45,'down');couple(.5,.63,.87,.84,.12);info(.5,.925)}return e}
function slideWelcome(c){const K=slideKit(c),{e,land,img,fade,head,quote,couple,info,T,symbol}=K;
 if(land){img(.48,0,.52,1,{bleed:1});fade(.45,0,.15,1,'left');head(.24,.11);T('Hôn phối',.24,.285,.16,{font:'nd',italic:1});symbol(.24,.45,.075);couple(.24,.50,.77,.4,.105);quote(.24,.87,.40,.028);info(.77,.9,.43,'#ffffff')}
 else{img(.08,.10,.84,.48,{shape:'arch'});head(.5,.05);couple(.5,.59,.82,.84,.12);quote(.5,.88,.8,.032);info(.5,.95)}return e}
function slideCouple(c){const K=slideKit(c),{e,land,img,head,quote,person,info,symbol,W,H}=K;
 head(.5,.065);quote(.5,land?.17:.16,.78,.036);
 if(land){const d=H*.43; e.push(I(W*.27-d/2,H*.30,d,d,{shape:'circle'}),I(W*.73-d/2,H*.30,d,d,{shape:'circle'}));person('g',.27,.79,.40,.10);person('b',.73,.79,.40,.10);symbol(.5,.55,.12);info(.5,.93)}
 else{const d=W*.42;e.push(I(W*.29-d/2,H*.28,d,d,{shape:'circle'}),I(W*.71-d/2,H*.52,d,d,{shape:'circle'}));person('g',.29,.28+d/H+.03,.49,.085);person('b',.71,.52+d/H+.03,.49,.085);symbol(.67,.39,.10);info(.5,.92)}return e}
function slideVerse(c){const K=slideKit(c),{e,land,img,fade,head,quote,couple,info,T,accent}=K;
 if(land){img(.57,0,.43,1,{bleed:1});fade(.53,0,.12,1,'left');head(.285,.10);T('“',.12,.29,.4,{font:'pf',color:accent,alpha:.13});quote(.285,.40,.45,.062);couple(.285,.64,.84,.44,.077);info(.285,.91,.48)}
 else{head(.5,.06);quote(.5,.21,.78,.055);img(.12,.37,.76,.39,{shape:'arch'});couple(.5,.78,.91,.85,.10);info(.5,.95)}return e}
function slidePanel(c){const K=slideKit(c),{e,land,img,R,head,quote,couple,info,bg}=K;
 img(0,0,1,1,{bleed:1});const x=land?.07:.10,y=land?.08:.48,w=land?.40:.80,h=land?.84:.46;R(x,y,w,h,bg,{alpha:.93,r:6});head(x+w/2,y+h*.09);couple(x+w/2,y+h*.18,y+h*.62,w*.87,.115);quote(x+w/2,y+h*.73,w*.85,.033);info(x+w/2,y+h*.88,w*.9);return e}
function slideCollage(c){const K=slideKit(c),{e,W,H,land,head,quote,couple,info,T}=K;
 if(land){mosaic5(e,0,0,W*.66,H,10);head(.83,.10);quote(.83,.28,.28,.034);couple(.83,.45,.77,.29,.09);info(.83,.88,.29)}
 else{head(.5,.055);mosaic5(e,W*.045,H*.12,W*.91,H*.49,8);couple(.5,.64,.84,.86,.11);quote(.5,.895,.82,.029);info(.5,.96)}return e}
function slideFrame(c){const K=slideKit(c),{e,W,H,land,img,head,quote,couple,info,branch,accent}=K;
 const x=land?.10:.14,y=.10,w=land?.45:.72,h=land?.80:.49;img(x,y,w,h,{shape:'arch'});e.push({t:'archline',x:W*(x-.018),y:H*(y-.027),w:W*(w+.036),h:H*(h+.054),color:accent,lw:1.2});
 if(land){head(.765,.17);couple(.765,.28,.65,.38,.11);quote(.765,.77,.36,.036);info(.765,.89,.38)}else{head(.5,.055);couple(.5,.63,.84,.82,.11);quote(.5,.90,.81,.029);info(.5,.96)}branch(.96,.83,.4,-1);return e}
function slideDuo(c){const K=slideKit(c),{e,land,img,head,quote,couple,info,symbol}=K;
 if(land){img(0,0,.28,1,{bleed:1});img(.72,0,.28,1,{bleed:1});head(.5,.10);symbol(.5,.25,.09);couple(.5,.37,.72,.37,.11);quote(.5,.82,.34,.029);info(.5,.93,.36)}
 else{img(.05,.11,.43,.48,{r:2});img(.52,.20,.43,.48,{r:2});head(.5,.052);couple(.5,.70,.88,.86,.10);quote(.5,.89,.8,.025);info(.5,.96)}return e}
function slideGrid(c){const K=slideKit(c),{e,W,H,land,img,head,quote,couple,info,R,bg}=K;const cols=3,rows=2,g=10,band=land?.46:.34,photoH=(1-band)/2;
 for(let r=0;r<rows;r++)for(let j=0;j<cols;j++)img(j/3+(j?g/W:0),r?(1-photoH):0,1/3-g/W,photoH);
 head(.5,photoH+.045);if(land){K.person('g',.26,.39,.42,.105);K.symbol(.5,.47,.09);K.person('b',.74,.39,.42,.105);quote(.5,.57,.78,.027);info(.5,.665,.84)}else{couple(.5,photoH+.08,photoH+band-.09,.86,.10);quote(.5,photoH+band-.05,.83,.025);info(.5,.96,.84,'#ffffff')}
 return e}
function slideMonogram(c){const K=slideKit(c),{e,land,img,fade,head,couple,quote,info,T,symbol,accent}=K;
 if(land){img(.46,0,.54,1,{bleed:1});fade(.4,0,.19,1,'left');head(.24,.10);T(initial(c.f.gn)+initial(c.f.bn),.24,.31,.24,{font:'nd',ls:.06,color:accent,alpha:.6});symbol(.24,.31,.065);couple(.24,.51,.76,.4,.10);quote(.24,.85,.40,.029);info(.75,.91,.45,'#ffffff')}
 else{img(0,0,1,.53,{bleed:1});fade(0,.40,1,.14,'down');head(.5,.055,'center','#ffffff');T(initial(c.f.gn)+initial(c.f.bn),.5,.56,.19,{font:'nd',ls:.06,color:accent,alpha:.5});couple(.5,.65,.85,.83,.12);quote(.5,.91,.8,.028);info(.5,.96)}return e}
function slideCovenant(c){const K=slideKit(c),{e,land,img,head,quote,couple,info,R,ink,bg,accent}=K;R(0,0,1,1,ink);
 if(land){img(.61,.06,.35,.88,{shape:'arch'});head(.30,.11,'center',bg);quote(.30,.35,.46,.061,bg);couple(.30,.59,.83,.48,.09,bg);info(.30,.92,.5,accent)}
 else{head(.5,.055,'center',bg);quote(.5,.20,.78,.053,bg);img(.18,.36,.64,.36,{shape:'arch'});couple(.5,.75,.92,.84,.10,bg);info(.5,.96,.86,accent)}return e}
function slideSacrament(c){const K=slideKit(c),{e,land,img,head,quote,couple,info,symbol,branch}=K;
 if(land){img(.07,.08,.40,.84,{shape:'arch'});head(.73,.15);symbol(.73,.30,.12);couple(.73,.42,.75,.42,.12);quote(.73,.84,.41,.032);info(.73,.94,.43)}
 else{head(.5,.055);symbol(.5,.14,.10);img(.20,.23,.60,.35,{shape:'arch'});couple(.5,.63,.83,.84,.11);quote(.5,.89,.8,.029);info(.5,.955)}branch(.04,.73,.4);return e}
function slidePoster(c){const K=slideKit(c),{e,W,H,land,img,head,quote,couple,info}=K;
 img(0,0,1,1,{bleed:1});e.push({t:'shade',x:0,y:0,w:W,h:H*.35,dir:'down',alpha:.56},{t:'shade',x:0,y:H*.45,w:W,h:H*.55,dir:'up',alpha:.86});
 head(.5,.065,'center','#ffffff');quote(.5,land?.18:.15,land?.72:.82,.037,'#ffffff');couple(.5,land?.48:.62,land?.83:.86,land?.78:.86,.14,'#ffffff');info(.5,.925,.86,'#ffffff');return e}
function slideEmblem(c){const K=slideKit(c),{e,land,T,head,quote,couple,info,symbol,branch,accent}=K;
 T('&',.5,.52,land?.70:.45,{font:'nd',italic:1,color:accent,alpha:.07});head(.5,.08);quote(.5,land?.23:.21,land?.68:.8,.043);symbol(.5,land?.40:.34,.11);couple(.5,land?.48:.45,land?.82:.82,land?.72:.84,.14);info(.5,.92);branch(.08,.66,.65);branch(.92,.44,.65,-1);return e}
function slideThanks(c){const K=slideKit(c),{e,land,img,fade,T,couple,info,accent}=K;
 if(land){img(.54,0,.46,1,{bleed:1});fade(.47,0,.18,1,'left');T(c.f.thanks,.28,.22,.19,{font:'script',fit:c.W*.44,color:accent});T(c.f.thanks2,.28,.47,.04,{italic:1,maxW:c.W*.42,maxH:c.H*.23,lh:1.3});couple(.28,.66,.84,.43,.08);info(.28,.93,.44)}
 else{T(c.f.thanks,.5,.13,.16,{font:'script',color:accent});T(c.f.thanks2,.5,.28,.034,{italic:1,maxW:c.W*.80,maxH:c.H*.14,lh:1.3});couple(.5,.39,.54,.84,.085);img(0,.59,1,.41,{bleed:1});fade(0,.56,1,.10,'up');info(.5,.965,.86,'#ffffff')}return e}
const TPL=[
 {id:'waiting',n:'Lời hẹn mở đầu',d:'Ảnh rộng · tên thư pháp · giờ Thánh lễ',b:slideWaiting},
 {id:'welcome',n:'Ngày chung đôi',d:'Chữ lớn · ảnh lệch · ánh sáng mềm',b:slideWelcome},
 {id:'couple',n:'Hai mảnh ghép',d:'Hai chân dung · nhịp đôi',b:slideCouple},
 {id:'verse',n:'Lời yêu vĩnh cửu',d:'Lời Chúa làm chủ đạo · ảnh bên cạnh',b:slideVerse},
 {id:'panel',n:'Khung ký ức',d:'Một khoảng giấy trên nền ảnh',b:slidePanel},
 {id:'collage',n:'Chuyện chúng mình',d:'Năm ảnh · câu chuyện bằng hình',b:slideCollage},
 {id:'frame',n:'Cửa vòm ánh sáng',d:'Nét vòm mảnh · ảnh chân dung',b:slideFrame},
 {id:'duo',n:'Song hành',d:'Hai ảnh ở hai cánh · tên ở giữa',b:slideDuo},
 {id:'grid',n:'Những ngày bên nhau',d:'Sáu ảnh · một dải tên',b:slideGrid},
 {id:'monogram',n:'Dấu ấn hai người',d:'Chữ lồng · chân dung · nét ký tên',b:slideMonogram},
 {id:'covenant',n:'Giao ước',d:'Nền trầm · Lời Chúa lớn · ảnh vòm',b:slideCovenant},
 {id:'sacrament',n:'Bí tích tình yêu',d:'Biểu tượng đức tin · bố cục thánh đường',b:slideSacrament},
 {id:'poster',n:'Thước phim hạnh phúc',d:'Ảnh tràn khung · tên viết tay',b:slidePoster},
 {id:'emblem',n:'Lời hẹn không ảnh',d:'Chữ thư pháp · nhành lá · khoảng thở',b:slideEmblem},
 {id:'thanks',n:'Lời tạ ơn',d:'Lời cảm tạ bên ảnh · kết thúc dịu dàng',b:slideThanks},
];
