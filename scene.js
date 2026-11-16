/* ================= HOME: animated handscroll ================= */
const SW=4200,SH=1000;
const VIG=[
 {id:'v1',x:760,y:690,name:'松下',qin:'fuxi',title:'伏羲式 · 九霄环佩',scene:'松下抚琴 · 鹤立听泉',
  who:'一位高士独坐松下石台，焚一炉香，抚一张伏羲式古琴。远处飞泉垂落，一只白鹤驻足而听。',
  poem:'蜀僧抱绿绮，西下峨眉峰。为我一挥手，如听万壑松。—— 李白《听蜀僧濬弹琴》'},
 {id:'v2',x:1470,y:705,name:'水阁',qin:'zhongni',title:'仲尼式 · 知音',scene:'水阁听琴 · 高山流水',
  who:'临水的亭阁中，琴人对坐知己。琴人弹的是最常见、也最端正的仲尼式，对面的人闭目而听 —— 这是伯牙与子期的故事。',
  poem:'伯牙鼓琴，志在高山。钟子期曰：“善哉，峨峨兮若泰山！”志在流水，钟子期曰：“善哉，洋洋兮若江河！”——《列子·汤问》'},
 {id:'v3',x:2390,y:752,name:'溪畔',qin:'lianzhu',title:'连珠式 · 溪畔听泉',scene:'溪畔静坐 · 童子捧琴',
  who:'过了石桥，先生在溪边石上静坐听泉，书童侍立一旁，身边斜倚着一张连珠式古琴。一张琴约一百二十厘米，比书童的肩还高。',
  poem:'泠泠七弦上，静听松风寒。古调虽自爱，今人多不弹。—— 刘长卿《听弹琴》'},
 {id:'v4',x:2830,y:812,name:'舟中',qin:'luoxia',title:'落霞式 · 舟中横琴',scene:'江上泛舟 · 月夜援琴',
  who:'一叶扁舟泊在江心，琴人坐在船头，面前小几上横着一张琴。落霞式的波浪轮廓，正应和着江上的水纹。',
  poem:'鸟栖鱼不动，月照夜江深。身外都无事，舟中只有琴。—— 白居易《船夜援琴》'},
 {id:'v5',x:3420,y:712,name:'竹林',qin:'shennong',title:'神农式 · 竹林清音',scene:'竹林弹琴 · 长啸知音',
  who:'幽篁深处，琴人临几抚琴，童子侍立，旁有酒瓮。魏晋名士嵇康、阮籍即常以琴会友，神农式的平直古朴最合此境。',
  poem:'独坐幽篁里，弹琴复长啸。深林人不知，明月来相照。—— 王维《竹里馆》'},
 {id:'v6',x:3960,y:718,name:'蕉荫',qin:'jiaoye',title:'蕉叶式 · 蕉荫煮茶',scene:'蕉荫抚琴 · 童子烹茶',
  who:'庭院一角，太湖石边芭蕉舒展。琴人抚一张蕉叶式琴 —— 琴形与身后的芭蕉叶互为镜像；炉上正煮着茶。',
  poem:'但识琴中趣，何劳弦上声。—— 陶渊明（《晋书》载）'}
];
let SC=null;
pageInit.juan=function(){
  const box=$('#scroll'),cv=$('#scv'),svg=$('#figs');
  const S0=ensureStatic();
  SC={box,cv,svg,st:S0.st,x:0,tx:0,S:S0.S,rings:[],t0:performance.now(),petals:[],leaves:[]};
  svg.innerHTML=buildFigures();
  svg.setAttribute('viewBox',`0 0 ${SW} ${SH}`);
  // minimap
  const mm=$('#minimap');mm.innerHTML='<button class="arr" data-d="-1">‹</button>'+VIG.map((v,i)=>`<button data-i="${i}">${v.name}</button>`).join('')+'<button class="arr" data-d="1">›</button>';
  mm.onclick=e=>{const b=e.target.closest('button');if(!b)return;if(b.dataset.i!=null)goVig(+b.dataset.i);else SC.tx=clamp(SC.tx+b.dataset.d*700,0,maxX());};
  // drag/scroll
  let down=null;
  box.addEventListener('pointerdown',e=>{down={x:e.clientX,sx:SC.tx,moved:false,id:e.pointerId};});
  window.addEventListener('pointermove',e=>{if(!down)return;const dx=e.clientX-down.x;if(Math.abs(dx)>5){down.moved=true;box.classList.add('drag');}SC.tx=clamp(down.sx-dx/SC.scale,0,maxX());});
  window.addEventListener('pointerup',e=>{if(!down)return;const d=down;down=null;box.classList.remove('drag');
    if(!d.moved){const f=e.target.closest&&e.target.closest('.fig');if(f)openVig(+f.dataset.i);}});
  box.addEventListener('wheel',e=>{e.preventDefault();SC.tx=clamp(SC.tx+(e.deltaY+e.deltaX)*1.1/SC.scale,0,maxX());},{passive:false});
  window.addEventListener('keydown',e=>{if(!$('#juan').classList.contains('on'))return;if(e.key==='ArrowRight')SC.tx=clamp(SC.tx+300,0,maxX());if(e.key==='ArrowLeft')SC.tx=clamp(SC.tx-300,0,maxX());});
  window.addEventListener('resize',resizeScene);resizeScene();
  pluckListeners.push(()=>{});
  requestAnimationFrame(sceneLoop);
};
function maxX(){return Math.max(0,SW-SC.visW);}
function goVig(i){SC.tx=clamp(VIG[i].x-SC.visW/2,0,maxX());}
function resizeScene(){const r=SC.box.getBoundingClientRect();SC.vw=r.width;SC.vh=r.height;SC.scale=SC.vh/SH;SC.visW=SC.vw/SC.scale;
  SC.dpr=Math.min(window.devicePixelRatio||1,2);SC.cv.width=Math.round(SC.vw*SC.dpr);SC.cv.height=Math.round(SC.vh*SC.dpr);SC.tx=clamp(SC.tx,0,maxX());}

/* ---------- static painting ---------- */
function paintStatic(){
  const S=Math.min(1.7,Math.max(1,(window.innerHeight*(window.devicePixelRatio||1))/SH));SC.S=S;
  const st=SC.st;st.width=Math.round(SW*S);st.height=Math.round(SH*S);const c=st.getContext('2d');c.scale(S,S);
  // silk
  let g=c.createLinearGradient(0,0,0,SH);g.addColorStop(0,'#eee2c7');g.addColorStop(.6,'#e9dbbb');g.addColorStop(1,'#dcc9a2');c.fillStyle=g;c.fillRect(0,0,SW,SH);
  const r=rng(11);
  for(let i=0;i<70;i++){const x=r()*SW,y=r()*SH,R=80+r()*260;const gg=c.createRadialGradient(x,y,0,x,y,R);gg.addColorStop(0,`rgba(${150+r()*40|0},${115+r()*30|0},${70},${.05+r()*.06})`);gg.addColorStop(1,'rgba(150,115,70,0)');c.fillStyle=gg;c.fillRect(x-R,y-R,2*R,2*R);}
  c.globalAlpha=.05;c.strokeStyle='#6b5030';c.lineWidth=.5;for(let i=0;i<9000;i++){const x=r()*SW,y=r()*SH;c.beginPath();if(i%2){c.moveTo(x,y);c.lineTo(x+4+r()*14,y);}else{c.moveTo(x,y);c.lineTo(x,y+3+r()*10);}c.stroke();}c.globalAlpha=1;
  // sun/moon disc (faint red)
  c.fillStyle='rgba(196,96,70,.16)';c.beginPath();c.arc(2650,190,46,0,6.283);c.fill();
  // far ink mountains
  mountain(c,{x0:0,x1:SW,base:640,seed:3,amp:70,peaks:[[200,260,160],[520,330,190],[1050,240,220],[1700,190,260],[2350,280,200],[3050,200,260],[3600,300,180],[4050,230,200]],
    top:'rgba(90,108,118,.55)',mid:'rgba(120,135,140,.30)',bot:'rgba(160,160,150,0)',cun:.35,moss:false,edge:.25});
  mist(c,0,SW,560,90,.75,5);
  // mid 青绿 peaks
  mountain(c,{x0:300,x1:1350,base:730,seed:7,amp:60,peaks:[[560,430,120],[760,330,110],[990,470,95],[1180,250,120]],top:'#3e6676',mid:'#7c9b78',bot:'rgba(176,132,88,.0)',cun:1,moss:true,edge:.8,ochre:true});
  mountain(c,{x0:1750,x1:2650,base:760,seed:13,amp:50,peaks:[[1900,250,140],[2250,320,150],[2520,210,120]],top:'#4a7080',mid:'#86a380',bot:'rgba(176,132,88,0)',cun:.9,moss:true,edge:.7,ochre:true});
  mountain(c,{x0:3050,x1:SW,base:720,seed:19,amp:55,peaks:[[3200,300,120],[3420,420,140],[3700,330,130],[3980,380,150],[4160,260,90]],top:'#3e6676',mid:'#7c9b78',bot:'rgba(176,132,88,0)',cun:1,moss:true,edge:.8,ochre:true});
  mist(c,250,1400,700,70,.85,9);mist(c,1700,2700,725,60,.8,10);mist(c,3000,SW,690,70,.85,12);
  // waterfall base (V1)
  c.save();g=c.createLinearGradient(0,330,0,700);g.addColorStop(0,'rgba(250,247,238,.0)');g.addColorStop(.15,'rgba(250,247,238,.85)');g.addColorStop(1,'rgba(250,247,238,.6)');
  c.fillStyle=g;c.beginPath();c.moveTo(1062,340);c.bezierCurveTo(1068,450,1060,560,1070,690);c.lineTo(1094,690);c.bezierCurveTo(1086,560,1090,450,1080,340);c.closePath();c.fill();c.restore();
  // water
  c.save();g=c.createLinearGradient(0,720,0,SH);g.addColorStop(0,'rgba(170,185,180,.25)');g.addColorStop(1,'rgba(130,150,150,.35)');c.fillStyle=g;c.fillRect(1100,735,2100,SH-735);
  c.strokeStyle='rgba(70,85,90,.18)';c.lineWidth=.8;const rr=rng(5);for(let i=0;i<900;i++){const x=1100+rr()*2100,y=745+rr()*250;const l=8+rr()*30;c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x+l/2,y-2,x+l,y);c.stroke();}
  c.restore();
  // banks / land
  land(c,[[0,700],[200,690],[420,700],[600,692],[700,686],[860,688],[980,700],[1080,712],[1180,742],[1260,790],[1240,SH],[0,SH]],21);
  land(c,[[1940,770],[2000,752],[2060,752],[2090,772],[2110,SH],[1900,SH]],22);
  land(c,[[2250,770],[2280,754],[2360,748],[2470,760],[2520,800],[2540,SH],[2230,SH]],23);
  land(c,[[3120,SH],[3110,780],[3180,736],[3300,718],[3500,712],[3700,716],[3900,712],[4100,716],[SW,720],[SW,SH]],24);
  // rocks foreground
  rock(c,560,700,70,48,31);rock(c,1010,708,60,40,32);rock(c,3270,725,55,36,33);rock(c,4130,720,70,44,34);
  taihu(c,4060,718,52,150);
  // trees
  pine(c,820,694,330,-.25,41,1.15);pine(c,420,700,230,.12,42,.8);
  willow(c,1290,745,220,43);
  pine(c,2490,752,200,.18,44,.75);
  bamboo(c,3300,716,3560,46);
  banana(c,3880,718,47);
  plum(c,4080,330,48);
  // pavilion & bridge
  pavilion(c,1470,705);
  bridge(c,2060,2290,752);
}
function mountain(c,o){const n=noise1(o.seed);const ys=[];let minY=SH;
  for(let x=o.x0;x<=o.x1;x+=4){let y=o.base;o.peaks.forEach(([cx,h,w])=>{y-=h*Math.exp(-Math.pow((x-cx)/w,2));});y-=fbm(n,x/150)*o.amp;ys.push([x,y]);minY=Math.min(minY,y);}
  const p=new Path2D();p.moveTo(o.x0,o.base+120);ys.forEach(([x,y])=>p.lineTo(x,y));p.lineTo(o.x1,o.base+120);p.closePath();
  const g=c.createLinearGradient(0,minY,0,o.base+60);g.addColorStop(0,o.top);g.addColorStop(.45,o.mid);if(o.ochre)g.addColorStop(.78,'rgba(184,140,96,.55)');g.addColorStop(1,o.bot);
  c.fillStyle=g;c.fill(p);
  c.save();c.clip(p);const r=rng(o.seed*3);
  // 披麻皴
  c.lineCap='round';
  for(let i=0;i<ys.length;i+=1){const [x,y]=ys[i];const k=Math.floor(2+r()*3);for(let j=0;j<k;j++){const yy=y+r()*(o.base-y)*.9,l=10+r()*45;c.strokeStyle=`rgba(40,48,45,${(.03+r()*.07)*o.cun})`;c.lineWidth=.6+r()*.9;c.beginPath();c.moveTo(x+r()*4,yy);c.quadraticCurveTo(x+(r()-.5)*8,yy+l/2,x+(r()-.5)*10,yy+l);c.stroke();}}
  // light on left faces
  for(let i=1;i<ys.length;i++){const [x,y]=ys[i],slope=ys[i][1]-ys[i-1][1];if(slope>1.2){c.strokeStyle='rgba(255,250,235,.06)';c.lineWidth=4;c.beginPath();c.moveTo(x,y+4);c.lineTo(x-6,y+60+r()*60);c.stroke();}}
  c.restore();
  // edge ink
  c.strokeStyle=`rgba(35,32,28,${.55*o.edge})`;for(let pass=0;pass<2;pass++){c.lineWidth=pass?.6:1.6;c.beginPath();ys.forEach(([x,y],i)=>i?c.lineTo(x,y+pass*1.5):c.moveTo(x,y));c.stroke();}
  if(o.moss){for(let i=0;i<ys.length;i+=2){const [x,y]=ys[i];if(r()<.22){c.fillStyle=`rgba(25,30,25,${.4+r()*.4})`;c.beginPath();c.ellipse(x+(r()-.5)*4,y+r()*5,1.2+r()*2.2,.8+r()*1.2,r(),0,6.283);c.fill();}}}
}
function mist(c,x0,x1,y,h,a,seed){const r=rng(seed);for(let i=0;i<14;i++){const x=x0+r()*(x1-x0),w=160+r()*320,hh=h*(.5+r()*.8),yy=y+(r()-.5)*h;const g=c.createRadialGradient(x,yy,0,x,yy,w);g.addColorStop(0,`rgba(246,240,226,${a*(.5+r()*.5)})`);g.addColorStop(1,'rgba(246,240,226,0)');
  c.save();c.translate(x,yy);c.scale(1,hh/w);c.translate(-x,-yy);c.fillStyle=g;c.fillRect(x-w,yy-w,2*w,2*w);c.restore();}}
function land(c,pts,seed){const p=new Path2D();pts.forEach(([x,y],i)=>i?p.lineTo(x,y):p.moveTo(x,y));p.closePath();
  const g=c.createLinearGradient(0,690,0,SH);g.addColorStop(0,'#b99a6e');g.addColorStop(.25,'#c8ad80');g.addColorStop(1,'#d9c39a');c.fillStyle=g;c.fill(p);
  c.save();c.clip(p);const r=rng(seed);c.lineCap='round';for(let i=0;i<500;i++){const x=pts[0][0]+r()*4300,y=680+r()*320;c.strokeStyle=`rgba(70,55,35,${.04+r()*.07})`;c.lineWidth=.6+r();c.beginPath();c.moveTo(x,y);c.lineTo(x+10+r()*30,y+(r()-.5)*4);c.stroke();}
  for(let i=0;i<260;i++){const x=pts[0][0]+r()*4300,y=690+r()*300;c.fillStyle=`rgba(50,60,40,${.25+r()*.35})`;c.beginPath();c.ellipse(x,y,1+r()*2,.8+r(),0,0,6.283);c.fill();}
  c.restore();
  c.strokeStyle='rgba(40,32,24,.6)';c.lineWidth=1.5;c.beginPath();let first=true;pts.forEach(([x,y])=>{if(y>=SH){first=true;return;}first?c.moveTo(x,y):c.lineTo(x,y);first=false;});c.stroke();
}
function rock(c,x,y,w,h,seed){const r=rng(seed);const p=new Path2D();const n=14;for(let i=0;i<=n;i++){const a=Math.PI+i/n*Math.PI;const rr=1+(r()-.5)*.35;const px=x+Math.cos(a)*w*rr,py=y+Math.sin(a)*h*rr*(i>3&&i<11?1:.7);i?p.lineTo(px,py):p.moveTo(px,py);}p.closePath();
  const g=c.createLinearGradient(x-w,y-h,x+w,y);g.addColorStop(0,'#8f9a92');g.addColorStop(.5,'#6d7a76');g.addColorStop(1,'#4c5552');c.fillStyle=g;c.fill(p);
  c.save();c.clip(p);for(let i=0;i<40;i++){c.strokeStyle=`rgba(20,25,22,${.15+r()*.25})`;c.lineWidth=.6+r()*1.4;const sx=x-w+r()*2*w,sy=y-h+r()*h;c.beginPath();c.moveTo(sx,sy);c.quadraticCurveTo(sx+8,sy+10,sx+4+r()*10,sy+18+r()*14);c.stroke();}c.restore();
  c.strokeStyle='rgba(25,25,22,.8)';c.lineWidth=1.6;c.stroke(p);
  for(let i=0;i<8;i++){c.fillStyle='rgba(30,38,28,.8)';c.beginPath();c.ellipse(x-w*.8+r()*w*1.6,y-h*.6-r()*h*.4,1.5+r()*2,1+r(),0,0,6.283);c.fill();}
}
function taihu(c,x,y,w,h){const r=rng(77);const p=new Path2D();p.moveTo(x-w*.6,y);p.bezierCurveTo(x-w*1.1,y-h*.3,x-w*.2,y-h*.45,x-w*.7,y-h*.75);p.bezierCurveTo(x-w*.9,y-h*1.05,x-w*.1,y-h*1.1,x+w*.1,y-h*.92);
  p.bezierCurveTo(x+w*.6,y-h*.8,x+w*.2,y-h*.5,x+w*.7,y-h*.35);p.bezierCurveTo(x+w,y-h*.2,x+w*.6,y,x+w*.4,y);p.closePath();
  const g=c.createLinearGradient(x-w,0,x+w,0);g.addColorStop(0,'#a8b0aa');g.addColorStop(1,'#5f6965');c.fillStyle=g;c.fill(p);c.save();c.clip(p);
  [[-.3,.3,.12],[.15,.6,.1],[-.2,.82,.08],[.35,.25,.07]].forEach(([dx,dy,s])=>{c.fillStyle='rgba(40,45,42,.75)';c.beginPath();c.ellipse(x+dx*w,y-dy*h,s*w*1.4,s*h*.5,.4,0,6.283);c.fill();});
  for(let i=0;i<30;i++){c.strokeStyle='rgba(30,35,32,.25)';c.lineWidth=1;c.beginPath();const sx=x+(r()-.5)*w*1.6,sy=y-r()*h;c.moveTo(sx,sy);c.lineTo(sx+(r()-.5)*10,sy+10+r()*20);c.stroke();}
  c.restore();c.strokeStyle='rgba(25,28,26,.85)';c.lineWidth=1.8;c.stroke(p);}
function needles(c,x,y,R,r,dark){c.save();c.translate(x,y);c.scale(1,.55);const n=20;for(let i=0;i<n;i++){const a=Math.PI*(1.05+i/n*.9)+(r()-.5)*.08;const l=R*(.75+r()*.3);c.strokeStyle=dark;c.lineWidth=.9;c.beginPath();c.moveTo(0,0);c.lineTo(Math.cos(a)*l,Math.sin(a)*l);c.stroke();}
  c.restore();}
function pine(c,x,y,h,lean,seed,k){const r=rng(seed);const top=[x+lean*h*1.6,y-h];
  // trunk
  c.save();const cp1=[x+lean*h*.2+20*k,y-h*.4],cp2=[x+lean*h*1.4-30*k,y-h*.75];
  for(let s=0;s<2;s++){c.beginPath();c.moveTo(x-9*k,y);c.bezierCurveTo(cp1[0]-9*k,cp1[1],cp2[0]-5*k,cp2[1],top[0]-2,top[1]);c.lineTo(top[0]+3,top[1]+2);c.bezierCurveTo(cp2[0]+6*k,cp2[1],cp1[0]+10*k,cp1[1],x+11*k,y);c.closePath();
    if(!s){const g=c.createLinearGradient(x-12,0,x+12,0);g.addColorStop(0,'#6c4b33');g.addColorStop(1,'#3e2a1c');c.fillStyle=g;c.fill();}else{c.strokeStyle='rgba(30,20,12,.85)';c.lineWidth=1.4;c.stroke();}}
  // bark scales
  for(let i=0;i<46;i++){const t=r()*.95;const bx=Math.pow(1-t,3)*x+3*Math.pow(1-t,2)*t*cp1[0]+3*(1-t)*t*t*cp2[0]+t*t*t*top[0],by=Math.pow(1-t,3)*y+3*Math.pow(1-t,2)*t*cp1[1]+3*(1-t)*t*t*cp2[1]+t*t*t*top[1];
    c.strokeStyle='rgba(25,15,8,.55)';c.lineWidth=.8;c.beginPath();c.ellipse(bx+(r()-.5)*10*k*(1-t),by,4*k*(1-t*.6),2.2*k,(r()-.5)*.6,0,6.283);c.stroke();}
  // branches
  const bs=[[.42,-1],[.55,1],[.68,-1],[.8,1],[.92,-1],[1,1]];
  bs.forEach(([t,dir],bi)=>{const bx=Math.pow(1-t,3)*x+3*Math.pow(1-t,2)*t*cp1[0]+3*(1-t)*t*t*cp2[0]+t*t*t*top[0],by=Math.pow(1-t,3)*y+3*Math.pow(1-t,2)*t*cp1[1]+3*(1-t)*t*t*cp2[1]+t*t*t*top[1];
    const len=(70+r()*80)*k*(1.2-t*.4),ex=bx+dir*len,ey=by-10-r()*25;c.strokeStyle='#3a281b';c.lineWidth=3.2*k*(1.1-t*.5);c.beginPath();c.moveTo(bx,by);c.quadraticCurveTo((bx+ex)/2,by-18,ex,ey);c.stroke();
    // clusters
    const nc=4+Math.floor(r()*3);for(let j=0;j<nc;j++){const u=.25+j/nc*.85;const cx=lerp(bx,ex,u)+(r()-.5)*20,cy=lerp(by,ey,u)-6-r()*14;
      c.fillStyle=`rgba(38,62,48,${.55+r()*.25})`;c.beginPath();c.ellipse(cx,cy+2,24*k,9*k,0,Math.PI,2*Math.PI);c.fill();needles(c,cx,cy+4,30*k,r,'rgba(18,32,24,.85)');}
  });
  c.restore();}
function willow(c,x,y,h,seed){const r=rng(seed);c.strokeStyle='#4a3626';c.lineWidth=7;c.beginPath();c.moveTo(x,y);c.bezierCurveTo(x-10,y-h*.4,x+20,y-h*.7,x+5,y-h);c.stroke();c.lineWidth=2.5;
  for(let i=0;i<5;i++){const sx=x+5+(r()-.5)*20,sy=y-h*(.6+r()*.4);c.beginPath();c.moveTo(sx,sy);c.quadraticCurveTo(sx+(r()-.5)*90,sy-40,sx+(r()-.5)*140,sy-20);c.stroke();}
  for(let i=0;i<90;i++){const sx=x+(r()-.5)*240,sy=y-h*(.7+r()*.35),l=60+r()*120;c.strokeStyle=`rgba(90,120,70,${.25+r()*.35})`;c.lineWidth=.9;c.beginPath();c.moveTo(sx,sy);c.quadraticCurveTo(sx+8,sy+l*.5,sx+4+r()*8,sy+l);c.stroke();}}
function bamboo(c,x0,y,x1,seed){const r=rng(seed);for(let i=0;i<26;i++){const x=x0+r()*(x1-x0),h=260+r()*260,lean=(r()-.5)*.08,w=3+r()*3;const dark=r()<.5;
  c.strokeStyle=dark?'rgba(40,62,45,.9)':'rgba(90,120,85,.6)';c.lineWidth=w;c.beginPath();c.moveTo(x,y+r()*10);c.lineTo(x+lean*h,y-h);c.stroke();
  for(let k=1;k<9;k++){const t=k/9;const nx=x+lean*h*t,ny=y-h*t;c.strokeStyle='rgba(25,35,25,.8)';c.lineWidth=1;c.beginPath();c.moveTo(nx-w,ny);c.lineTo(nx+w,ny);c.stroke();}
  for(let k=0;k<7;k++){const t=.45+r()*.55;const lx=x+lean*h*t,ly=y-h*t;for(let m=0;m<4;m++){const a=(r()<.5?-1:1)*(.3+r()*.9)+Math.PI/2*(r()<.5?0:0);const len=28+r()*26;const dir=r()<.5?-1:1;
    c.fillStyle=dark?'rgba(30,52,36,.85)':'rgba(80,110,75,.55)';c.beginPath();const ex=lx+dir*len*Math.cos(a*.5),ey=ly+len*.35*Math.sin(a)+8;c.moveTo(lx,ly);c.quadraticCurveTo((lx+ex)/2,ly-4+(ey-ly)/2-3,ex,ey);c.quadraticCurveTo((lx+ex)/2,ly+4+(ey-ly)/2,lx,ly);c.fill();}}}}
function banana(c,x,y,seed){const r=rng(seed);c.strokeStyle='#6b7a4e';c.lineWidth=9;c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x-6,y-120,x+4,y-210);c.stroke();
  const leaves=[[-2.4,190],[-1.9,170],[-1.2,200],[-.7,180],[-2.9,150],[-.25,150],[-1.6,230]];
  leaves.forEach(([a,l],i)=>{const bx=x+4,by=y-200+i*6;const ex=bx+Math.cos(a)*l,ey=by+Math.sin(a)*l;const nx=-(ey-by)/l,ny=(ex-bx)/l;const w=34;
    const p=new Path2D();p.moveTo(bx,by);p.quadraticCurveTo((bx+ex)/2+nx*w,(by+ey)/2+ny*w,ex,ey);p.quadraticCurveTo((bx+ex)/2-nx*w*.8,(by+ey)/2-ny*w*.8,bx,by);
    const g=c.createLinearGradient(bx,by,ex,ey);g.addColorStop(0,'rgba(95,128,82,.95)');g.addColorStop(1,'rgba(135,160,105,.85)');c.fillStyle=g;c.fill(p);
    c.save();c.clip(p);c.strokeStyle='rgba(50,75,45,.35)';c.lineWidth=.8;for(let k=1;k<18;k++){const t=k/18;const mx=lerp(bx,ex,t),my=lerp(by,ey,t);c.beginPath();c.moveTo(mx,my);c.lineTo(mx+nx*w+(ex-bx)*.04,my+ny*w+(ey-by)*.04);c.moveTo(mx,my);c.lineTo(mx-nx*w+(ex-bx)*.04,my-ny*w+(ey-by)*.04);c.stroke();}c.restore();
    c.strokeStyle='rgba(40,60,35,.8)';c.lineWidth=1.2;c.stroke(p);c.beginPath();c.moveTo(bx,by);c.quadraticCurveTo((bx+ex)/2+nx*4,(by+ey)/2+ny*4,ex,ey);c.lineWidth=1.6;c.strokeStyle='rgba(200,210,160,.6)';c.stroke();});}
function plum(c,x,y,seed){const r=rng(seed);c.strokeStyle='#2c221b';c.lineCap='round';
  const br=(sx,sy,a,l,w,d)=>{if(d>4||l<14)return;const ex=sx+Math.cos(a)*l,ey=sy+Math.sin(a)*l;c.lineWidth=w;c.beginPath();c.moveTo(sx,sy);c.quadraticCurveTo(sx+Math.cos(a+.4)*l*.5,sy+Math.sin(a+.4)*l*.5,ex,ey);c.stroke();
    for(let k=0;k<3;k++){if(r()<.75){const bx=lerp(sx,ex,.3+r()*.7),by=lerp(sy,ey,.3+r()*.7);blossom(c,bx+(r()-.5)*6,by+(r()-.5)*6,3.2+r()*2,r);}}
    br(ex,ey,a+(r()-.3)*.9,l*.68,w*.62,d+1);if(r()<.7)br(lerp(sx,ex,.6),lerp(sy,ey,.6),a-(.5+r()*.6),l*.55,w*.5,d+1);};
  br(x+140,y-60,Math.PI*.85,150,6,0);br(x+140,y-60,Math.PI*.62,110,4,1);
  // birds on branch
  bird(c,x+30,y+12,1);bird(c,x-12,y+30,-1);}
function blossom(c,x,y,s,r){c.fillStyle='rgba(250,238,236,.95)';for(let i=0;i<5;i++){const a=i/5*6.283;c.beginPath();c.arc(x+Math.cos(a)*s*.8,y+Math.sin(a)*s*.8,s*.62,0,6.283);c.fill();}c.strokeStyle='rgba(170,90,90,.6)';c.lineWidth=.5;c.beginPath();c.arc(x,y,s*1.3,0,6.283);c.stroke();c.fillStyle='#b4553f';c.beginPath();c.arc(x,y,s*.3,0,6.283);c.fill();}
function bird(c,x,y,d){c.save();c.translate(x,y);c.scale(d,1);c.fillStyle='#5a4636';c.beginPath();c.ellipse(0,0,10,6,-.2,0,6.283);c.fill();c.fillStyle='#e9dfcc';c.beginPath();c.ellipse(2,3,7,3,-.2,0,6.283);c.fill();
  c.fillStyle='#2a201a';c.beginPath();c.arc(8,-5,4,0,6.283);c.fill();c.beginPath();c.moveTo(11,-5);c.lineTo(15,-4);c.lineTo(11,-3);c.fill();c.beginPath();c.moveTo(-9,0);c.lineTo(-20,4);c.lineTo(-9,3);c.fill();c.strokeStyle='#2a201a';c.lineWidth=.8;c.beginPath();c.moveTo(0,5);c.lineTo(-1,10);c.moveTo(3,5);c.lineTo(3,10);c.stroke();c.restore();}
function pavilion(c,x,y){c.save();c.strokeStyle='#3b2a1d';c.fillStyle='#6b4a32';
  // stilts in water
  for(let i=-3;i<=3;i++){c.fillRect(x+i*24-2,y,4,58);}c.fillStyle='rgba(60,70,70,.25)';c.fillRect(x-90,y+58,180,4);
  // platform
  c.fillStyle='#7a5a3e';c.fillRect(x-96,y-6,192,10);c.strokeRect(x-96,y-6,192,10);
  // railing
  c.strokeStyle='#5a3e2a';c.lineWidth=1.4;c.beginPath();c.moveTo(x-96,y-22);c.lineTo(x+96,y-22);c.stroke();for(let i=-96;i<=96;i+=12){c.beginPath();c.moveTo(x+i,y-22);c.lineTo(x+i,y-6);c.stroke();}
  // columns
  c.fillStyle='#8b3a2a';[-84,84].forEach(dx=>c.fillRect(x+dx-3,y-150,6,146));c.fillStyle='rgba(139,58,42,.6)';[-40,40].forEach(dx=>c.fillRect(x+dx-2,y-145,4,140));
  // roof
  const g=c.createLinearGradient(0,y-215,0,y-150);g.addColorStop(0,'#3d3a36');g.addColorStop(1,'#5b5650');c.fillStyle=g;c.beginPath();c.moveTo(x-140,y-150);c.quadraticCurveTo(x-110,y-160,x-80,y-196);c.lineTo(x+80,y-196);c.quadraticCurveTo(x+110,y-160,x+140,y-150);c.quadraticCurveTo(x+120,y-158,x+100,y-156);c.lineTo(x-100,y-156);c.quadraticCurveTo(x-120,y-158,x-140,y-150);c.fill();
  c.strokeStyle='#221e1a';c.lineWidth=1.5;c.stroke();c.beginPath();c.moveTo(x-80,y-196);c.quadraticCurveTo(x,y-205,x+80,y-196);c.lineTo(x+55,y-222);c.lineTo(x-55,y-222);c.closePath();c.fillStyle='#4a4641';c.fill();c.stroke();
  c.strokeStyle='rgba(30,28,25,.4)';c.lineWidth=.8;for(let i=-130;i<=130;i+=8){c.beginPath();c.moveTo(x+i*.6,y-196);c.lineTo(x+i,y-156);c.stroke();}
  c.fillStyle='#6b4a32';c.fillRect(x-100,y-156,200,5);c.restore();}
function bridge(c,x0,x1,y){c.save();const mx=(x0+x1)/2;c.strokeStyle='#4b3828';c.lineWidth=3;c.beginPath();c.moveTo(x0,y+6);c.quadraticCurveTo(mx,y-46,x1,y+6);c.stroke();
  c.lineWidth=7;c.strokeStyle='#8b7355';c.beginPath();c.moveTo(x0,y);c.quadraticCurveTo(mx,y-52,x1,y);c.stroke();c.lineWidth=1.2;c.strokeStyle='#3b2a1d';
  c.beginPath();c.moveTo(x0,y-18);c.quadraticCurveTo(mx,y-72,x1,y-18);c.stroke();for(let i=0;i<=12;i++){const t=i/12;const px=lerp(x0,x1,t),py=(1-t)*(1-t)*y+2*(1-t)*t*(y-52)+t*t*y;c.beginPath();c.moveTo(px,py);c.lineTo(px,py-18);c.stroke();}
  // arch
  c.strokeStyle='rgba(60,45,30,.6)';c.lineWidth=2;c.beginPath();c.arc(mx,y+30,58,Math.PI*1.08,Math.PI*1.92);c.stroke();c.restore();}

/* ---------- figures (SVG) ---------- */
const SKIN='#ecd8bb',INK='#2a231d';
function headSVG(cap,tilt=0){const capS={
  jin:`<path d="M-9.4,-83 C-11,-95 -4,-99 0,-99 C5,-99 11,-95 9.4,-83 C4,-86 -4,-86 -9.4,-83Z" fill="#2a2420"/><path d="M7,-90 C15,-86 17,-74 14,-63" stroke="#2a2420" stroke-width="1.6" fill="none"/>`,
  guan:`<path d="M-8.8,-84 C-10,-92 -5,-95 0,-95 C5,-95 10,-92 8.8,-84 C4,-87 -4,-87 -8.8,-84Z" fill="#2a2420"/><ellipse cx="0" cy="-96" rx="4.6" ry="3.6" fill="#2a2420"/><path d="M-8,-96 H8" stroke="#c9a85a" stroke-width="1"/>`,
  kid:`<path d="M-8.6,-84 C-9,-91 -4,-93 0,-93 C4,-93 9,-91 8.6,-84 C4,-86 -4,-86 -8.6,-84Z" fill="#2a2420"/><circle cx="-7" cy="-92" r="3.6" fill="#2a2420"/><circle cx="7" cy="-92" r="3.6" fill="#2a2420"/>`
 }[cap]||'';
 const beard=cap==='kid'?'':`<path d="M-3,-73 C-2,-66 -1,-62 0,-58 M0,-73 C0,-66 1,-62 2,-59 M3,-73 C3,-68 4,-64 4,-61" stroke="#3a3029" stroke-width=".6" fill="none"/><path d="M-4,-75.5 Q0,-74 4,-75.5" stroke="#3a3029" stroke-width=".7" fill="none"/>`;
 return `<g transform="rotate(${tilt} 0 -72)"><rect x="-3.6" y="-72" width="7.2" height="7" fill="${SKIN}"/><ellipse cx="0" cy="-80" rx="8.6" ry="10.4" fill="${SKIN}" stroke="${INK}" stroke-width=".6"/>
  <ellipse cx="-8.4" cy="-79" rx="1.4" ry="2.6" fill="${SKIN}" stroke="${INK}" stroke-width=".4"/><ellipse cx="8.4" cy="-79" rx="1.4" ry="2.6" fill="${SKIN}" stroke="${INK}" stroke-width=".4"/>
  <path d="M-5,-81.5 h3 M2,-81.5 h3" stroke="${INK}" stroke-width=".9" stroke-linecap="round"/><path d="M-5.5,-84.5 q2,-1 3.5,0 M2,-84.5 q2,-1 3.5,0" stroke="${INK}" stroke-width=".6" fill="none"/><path d="M0,-80 q-.8,2.5 .6,3" stroke="#9c7d62" stroke-width=".5" fill="none"/>
  ${beard}${capS}</g>`;}
function seated(x,y,s,o){const robe=o.robe||'#e7e2d2',inner=o.inner||'#f7f3ea',L=122;
  const qin=o.qin?`<g><path d="${qinSVGPath(o.qin,12,-33,L,0,.24)}" fill="#24170f" stroke="#0e0906" stroke-width=".6"/>
    <path d="M${12-L/2+5},-33.6 H${12+L/2-3}" stroke="rgba(240,226,200,.55)" stroke-width=".35"/><path d="M${12-L/2+5},-32.6 H${12+L/2-3}" stroke="rgba(240,226,200,.45)" stroke-width=".3"/>
    ${HUI.map((h,i)=>`<circle cx="${(12-L/2+L*.045+h*L*.93).toFixed(1)}" cy="-35.1" r="${i===6?.75:.55}" fill="#f2ead8"/>`).join('')}
    <rect x="${12-L/2+L*.04}" y="-35.4" width="1.4" height="4.4" fill="#0a0706"/></g>`:'';
  const table=o.qin?`<g><rect x="-58" y="-30.5" width="148" height="4.2" fill="#5b3b27" stroke="#2b1b10" stroke-width=".5"/><path d="M-54,-26.5 V0 M86,-26.5 V0" stroke="#45301f" stroke-width="3"/><path d="M-54,-24 H86" stroke="#45301f" stroke-width="1.2"/></g>`:'';
  const hands=o.qin?`<ellipse class="pluckhand" cx="-37" cy="-34.5" rx="3.6" ry="2.2" fill="${SKIN}" stroke="${INK}" stroke-width=".4"/><ellipse class="pluckhand b" cx="16" cy="-35" rx="3.6" ry="2.2" fill="${SKIN}" stroke="${INK}" stroke-width=".4"/>`
    :`<path d="M-14,-40 C-8,-34 8,-34 14,-40 C10,-30 -10,-30 -14,-40Z" fill="${robe}" stroke="${INK}" stroke-width=".6"/>`;
  const sl=o.qin?`<path d="M-16,-65 C-30,-60 -40,-46 -42,-37 C-43,-31 -38,-30 -33,-32 L-24,-33 C-25,-42 -22,-51 -15,-56Z" fill="${robe}" stroke="${INK}" stroke-width=".7"/>
     <path d="M16,-65 C27,-60 32,-50 30,-40 C29,-34 23,-32 18,-33 L12,-34 C15,-42 17,-50 14,-56Z" fill="${robe}" stroke="${INK}" stroke-width=".7"/>`
    :`<path d="M-16,-65 C-28,-58 -30,-46 -26,-36 L-12,-38 C-15,-46 -14,-52 -12,-56Z" fill="${robe}" stroke="${INK}" stroke-width=".7"/><path d="M16,-65 C28,-58 30,-46 26,-36 L12,-38 C15,-46 14,-52 12,-56Z" fill="${robe}" stroke="${INK}" stroke-width=".7"/>`;
  return `<g transform="translate(${x},${y}) scale(${s}) ${o.flip?'scale(-1,1)':''}">
   <ellipse cx="${o.qin?10:0}" cy="1" rx="${o.qin?60:42}" ry="6" fill="#a8916a" opacity=".55"/>
   <path d="M-44,0 C-48,-14 -36,-28 -24,-31 L26,-31 C38,-28 50,-14 46,0 Z" fill="${robe}" stroke="${INK}" stroke-width=".8"/>
   <path d="M-30,-6 C-20,-12 -6,-14 4,-10 M8,-4 C18,-12 30,-14 38,-8" stroke="rgba(42,35,29,.45)" stroke-width=".6" fill="none"/>
   <path d="M-17,-67 C-26,-56 -28,-42 -27,-30 L27,-30 C28,-42 26,-56 17,-67 C8,-71 -8,-71 -17,-67Z" fill="${robe}" stroke="${INK}" stroke-width=".8"/>
   <path d="M-8,-68 L3,-50 L9,-67" fill="none" stroke="${inner}" stroke-width="2.6"/><path d="M-8,-68 L3,-50 L9,-67" fill="none" stroke="${INK}" stroke-width=".5"/>
   <path d="M-26,-38 Q0,-35 26,-38" stroke="${o.belt||'#6b4a35'}" stroke-width="1.8" fill="none"/>
   ${headSVG(o.cap||'jin',o.tilt||0)}${sl}${table}${qin}${hands}</g>`;}
function standing(x,y,s,o){const robe=o.robe||'#dcd6c4';return `<g transform="translate(${x},${y}) scale(${s}) ${o.flip?'scale(-1,1)':''}">
  <ellipse cx="0" cy="1" rx="20" ry="3.5" fill="#7a6a50" opacity=".35"/>
  <path d="M-15,-130 C-24,-100 -26,-50 -24,-4 C-14,0 14,0 26,-4 C24,-50 22,-100 15,-130 C6,-135 -6,-135 -15,-130Z" fill="${robe}" stroke="${INK}" stroke-width=".8"/>
  <path d="M-8,-131 L3,-112 L9,-130" fill="none" stroke="#f6f1e6" stroke-width="2.6"/><path d="M-22,-88 Q0,-84 22,-88" stroke="#6b4a35" stroke-width="1.8" fill="none"/>
  <path d="M-15,-128 C-30,-116 -32,-96 -24,-80 C-14,-74 -2,-76 2,-80 C-6,-92 -8,-108 -10,-118Z" fill="${robe}" stroke="${INK}" stroke-width=".7"/>
  <path d="M-6,-20 C-2,-14 4,-12 10,-14 M-14,-50 C-6,-46 6,-46 14,-52" stroke="rgba(42,35,29,.4)" stroke-width=".6" fill="none"/>
  <path d="M-12,-2 h9 M4,-2 h9" stroke="#2a2420" stroke-width="3" stroke-linecap="round"/>
  <g transform="translate(0,-63)">${headSVG(o.cap||'jin')}</g>
  ${o.staff?'<path d="M18,-120 L26,0" stroke="#5a3e2a" stroke-width="2"/>':''}</g>`;}
function kidWithQin(x,y,s,id){return `<g transform="translate(${x},${y}) scale(${s})">
  <ellipse cx="0" cy="1" rx="16" ry="3" fill="#7a6a50" opacity=".35"/>
  <g transform="rotate(-62 0 -60)"><path d="${qinSVGPath(id,0,-60,122,0,.55)}" fill="#7b3a2c" stroke="#3a1a12" stroke-width=".8"/>
   <path d="M-56,-60 H56" stroke="#c9a05a" stroke-width="1" stroke-dasharray="3 3"/><circle cx="-61" cy="-60" r="2.5" fill="#c9a05a"/></g>
  <path d="M-11,-80 C-17,-60 -18,-30 -16,-4 C-8,-1 8,-1 16,-4 C17,-30 16,-60 11,-80 C5,-83 -5,-83 -11,-80Z" fill="#9db29a" stroke="${INK}" stroke-width=".8"/>
  <path d="M-6,-81 L2,-70 L7,-80" fill="none" stroke="#f6f1e6" stroke-width="2"/><path d="M-15,-50 Q0,-47 15,-50" stroke="#5a3e2a" stroke-width="1.5" fill="none"/>
  <path d="M11,-78 C19,-70 20,-58 15,-52 L9,-56 C12,-62 11,-70 8,-74Z" fill="#9db29a" stroke="${INK}" stroke-width=".7"/>
  <path d="M-9,-2 h7 M3,-2 h7" stroke="#2a2420" stroke-width="2.6" stroke-linecap="round"/>
  <g transform="translate(0,-8) scale(.82)">${headSVG('kid')}</g></g>`;}
function crane(x,y,s,flip){return `<g transform="translate(${x},${y}) scale(${s*(flip?-1:1)},${s})"><path d="M0,-40 C-14,-42 -22,-34 -20,-26 C-14,-20 -2,-22 6,-28 Z" fill="#f6f3ea" stroke="${INK}" stroke-width=".7"/>
  <path d="M-20,-28 C-26,-30 -30,-26 -28,-22 C-24,-22 -22,-24 -20,-26" fill="#1e1a17"/><path d="M4,-30 C10,-44 8,-60 14,-66" stroke="#f6f3ea" stroke-width="3.4" fill="none"/><path d="M4,-30 C10,-44 8,-60 14,-66" stroke="${INK}" stroke-width=".5" fill="none" transform="translate(1.6,0)"/>
  <path d="M10,-56 C11,-60 13,-63 14,-66" stroke="#1e1a17" stroke-width="3.4" fill="none"/><circle cx="15" cy="-67" r="2.6" fill="#f6f3ea" stroke="${INK}" stroke-width=".5"/><circle cx="15" cy="-69" r="1.3" fill="#c0392b"/><path d="M17,-67 L25,-64" stroke="#6a6150" stroke-width="1.2"/>
  <path d="M-6,-24 L-8,0 M-2,-24 L0,0" stroke="#3a3a35" stroke-width="1"/></g>`;}
function boat(x,y){return `<g transform="translate(${x},${y})"><path d="M-130,-8 C-100,14 100,14 135,-14 C110,-4 -100,-2 -130,-8Z" fill="#6b4a32" stroke="${INK}" stroke-width="1"/>
  <path d="M-128,-8 C-90,-2 90,-2 134,-14" stroke="#3b2a1d" stroke-width="1.2" fill="none"/>
  <path d="M10,-10 L12,-58 C40,-70 80,-68 104,-54 L102,-12" fill="#a68a5a" stroke="${INK}" stroke-width=".8"/>
  <path d="M14,-50 C40,-60 78,-60 103,-48 M14,-38 C40,-48 78,-48 103,-38 M14,-26 C40,-34 78,-34 103,-26" stroke="#6b5434" stroke-width=".7" fill="none"/></g>`;}
function stove(x,y){return `<g transform="translate(${x},${y})"><path d="M-9,0 L-7,-14 H7 L9,0Z" fill="#6b4a32" stroke="${INK}" stroke-width=".6"/><ellipse cx="0" cy="-18" rx="7" ry="5" fill="#4a4641" stroke="${INK}" stroke-width=".5"/><path d="M6,-20 l6,-3" stroke="#4a4641" stroke-width="2"/>
  <path class="smoke" d="M0,-24 C-4,-30 4,-34 0,-40 C-3,-44 2,-48 0,-52" stroke="#bbb4a6" stroke-width="2" fill="none"/></g>`;}
function censer(x,y){return `<g transform="translate(${x},${y})"><path d="M-6,0 L-5,-6 H5 L6,0Z" fill="#7a6a3a"/><ellipse cx="0" cy="-7" rx="6" ry="2.4" fill="#8a7a4a"/><path class="smoke" d="M0,-9 C-3,-16 3,-20 0,-27 C-2,-31 2,-35 0,-40" stroke="#c9c2b4" stroke-width="1.4" fill="none"/></g>`;}
function wineJar(x,y){return `<g transform="translate(${x},${y})"><path d="M-8,0 C-12,-8 -11,-16 -6,-20 H6 C11,-16 12,-8 8,0Z" fill="#7a5a3a" stroke="${INK}" stroke-width=".6"/><rect x="-5" y="-24" width="10" height="4" fill="#a63a2b"/></g>`;}
function figImg(k,x,y,h,flip){const f=FIG[k],w=h*f.w/f.h;return `<image href="${f.src}" x="${(x-w/2).toFixed(1)}" y="${(y-h).toFixed(1)}" width="${w.toFixed(1)}" height="${h}" ${flip?`transform="translate(${2*x} 0) scale(-1 1)"`:''} style="filter:drop-shadow(0 3px 2px rgba(60,45,30,.25))"/>`;}
function figW(k,h){return h*FIG[k].w/FIG[k].h;}
function qinProp(x,y,L,id,ang){return `<g transform="translate(${x},${y}) rotate(${ang})"><path d="${qinSVGPath(id,0,0,L,0,.26)}" fill="#24170f" stroke="#0e0906" stroke-width=".6"/>${HUI.map((h,i)=>`<circle cx="${(-L/2+L*.045+h*L*.93).toFixed(1)}" cy="${-L*RATIO*.21}" r=".6" fill="#f2ead8"/>`).join('')}</g>`;}
function buildFigures(){let h='';
  const fig=(i,inner,hit)=>`<g class="fig" data-i="${i}"><ellipse class="glow" cx="${hit[0]+hit[2]/2}" cy="${hit[1]+hit[3]-6}" rx="${hit[2]/1.6}" ry="16" fill="rgba(255,236,190,.45)"/>${inner}<rect class="hit" x="${hit[0]}" y="${hit[1]}" width="${hit[2]}" height="${hit[3]}"/></g>`;
  // V1 松下 —— 刘松年笔意琴人
  h+=fig(0,figImg('lsplayer',760,692,104)+censer(705,690)+crane(905,694,.95,true),[700,580,130,116]);
  // V2 水阁 —— 宋徽宗《听琴图》琴人 + 听者
  h+=fig(1,figImg('player',1438,700,100)+figImg('lslisten',1528,700,92,true),[1390,595,190,108]);
  // V3 溪畔 —— 绿衣高士 + 书童 + 倚石之琴
  h+=fig(2,qinProp(2452,700,122,'lianzhu',-72)+figImg('green',2380,752,98)+figImg('boy',2445,752,104,true),[2330,640,150,115]);
  // V4 舟中
  h+=fig(3,boat(2830,812)+`<g><rect x="2722" y="788" width="64" height="4" fill="#5b3b27"/><path d="M2726,792 V806 M2782,792 V806" stroke="#45301f" stroke-width="2"/></g>`+qinProp(2754,786,62,'luoxia',0)+figImg('red',2815,806,92),[2715,700,150,110]);
  // V5 竹林
  h+=fig(4,figImg('player',3420,712,100,true)+figImg('boy',3500,712,104)+wineJar(3540,712),[3360,600,200,115]);
  // V6 蕉荫
  h+=fig(5,figImg('lsplayer',3965,718,104,true)+stove(4050,716),[3900,605,170,115]);
  const poem=(x,y,lines)=>`<g opacity=".72">${lines.map((l,i)=>`<text x="${x-i*30}" y="${y}" font-size="24" fill="#3a2f26" font-family="Ma Shan Zheng,STXingkai,KaiTi,serif" style="writing-mode:vertical-rl;letter-spacing:4px">${l}</text>`).join('')}<rect x="${x-lines.length*30+4}" y="${y+lines[0].length*28+10}" width="22" height="22" fill="#a63a2b" opacity=".85"/></g>`;
  return poem(1260,90,['丝桐合为琴','中有太古声'])+poem(2050,110,['目送归鸿','手挥五弦'])+poem(3190,80,['泠泠七弦上','静听松风寒'])+h;}

/* ---------- loop ---------- */
const CRANES=[{x:-200,y:230,v:.35,s:1},{x:-420,y:270,v:.33,s:.8}];
function sceneLoop(now){requestAnimationFrame(sceneLoop);if(!$('#juan').classList.contains('on'))return;
  const t=(now-SC.t0)/1000;SC.tx=clamp(SC.tx,0,maxX());SC.x+= (SC.tx-SC.x)*.09;SC.x=clamp(SC.x,0,maxX());
  const c=SC.cv.getContext('2d'),k=SC.scale*SC.dpr;c.setTransform(1,0,0,1,0,0);
  c.drawImage(SC.st,SC.x*SC.S,0,SC.visW*SC.S,SH*SC.S,0,0,SC.cv.width,SC.cv.height);
  c.setTransform(k,0,0,k,-SC.x*k,0);
  const x0=SC.x-100,x1=SC.x+SC.visW+100;
  // waterfall streaks
  if(x0<1200&&x1>900){c.strokeStyle='rgba(255,255,255,.55)';c.lineWidth=1.2;for(let i=0;i<14;i++){const xx=1064+i*2.1,ph=(t*160+i*53)%360;c.beginPath();c.moveTo(xx,340+ph);c.lineTo(xx+.5,340+ph+40);c.stroke();}
    const g=c.createRadialGradient(1080,690,0,1080,690,70);g.addColorStop(0,'rgba(255,255,255,.6)');g.addColorStop(1,'rgba(255,255,255,0)');c.fillStyle=g;c.fillRect(1000,640,160,90);}
  // water shimmer
  c.strokeStyle='rgba(255,255,255,.35)';c.lineWidth=1;for(let i=0;i<60;i++){const xx=1150+((i*137)%2000),yy=760+((i*71)%220);if(xx<x0||xx>x1)continue;const ph=Math.sin(t*1.3+i);c.globalAlpha=.25+.25*ph;c.beginPath();c.moveTo(xx+ph*6,yy);c.quadraticCurveTo(xx+10+ph*6,yy-2,xx+24+ph*6,yy);c.stroke();}c.globalAlpha=1;
  // boat bob handled by svg? small ripple ring under boat
  // drifting mist
  for(let i=0;i<6;i++){const mx=((i*820+t*14*(i%2?1:-1))%SW+SW)%SW,my=[520,610,660,470,700,580][i];if(mx<x0-500||mx>x1+500)continue;
    const g=c.createRadialGradient(mx,my,0,mx,my,380);g.addColorStop(0,'rgba(248,243,230,.26)');g.addColorStop(.6,'rgba(248,243,230,.1)');g.addColorStop(1,'rgba(248,243,230,0)');c.save();c.translate(mx,my);c.scale(1,.22);c.translate(-mx,-my);c.fillStyle=g;c.fillRect(mx-380,my-380,760,760);c.restore();}
  // cranes
  CRANES.forEach(cr=>{cr.x+=cr.v;if(cr.x>SW+200)cr.x=-200;const fl=Math.sin(t*3+cr.s*5);const yy=cr.y+Math.sin(t*.5+cr.s)*12;if(cr.x<x0||cr.x>x1)return;drawFlyingCrane(c,cr.x,yy,cr.s,fl);});
  // petals near plum & leaves near bamboo
  if(SC.petals.length<26&&x1>3700){SC.petals.push({x:3980+Math.random()*220,y:260+Math.random()*60,vx:-.3-Math.random()*.4,vy:.35+Math.random()*.4,a:Math.random()*6,l:1})}
  SC.petals.forEach(p=>{p.x+=p.vx+Math.sin(t+p.a)*.3;p.y+=p.vy;p.a+=.03;if(p.y>760)p.l=0;c.fillStyle='rgba(248,232,230,.9)';c.beginPath();c.ellipse(p.x,p.y,3,1.8,p.a,0,6.283);c.fill();});SC.petals=SC.petals.filter(p=>p.l);
  if(SC.leaves.length<14&&x1>3200&&x0<3700){SC.leaves.push({x:3300+Math.random()*260,y:300+Math.random()*120,vx:.2+Math.random()*.4,vy:.3+Math.random()*.3,a:Math.random()*6,l:1})}
  SC.leaves.forEach(p=>{p.x+=p.vx+Math.sin(t*1.2+p.a)*.4;p.y+=p.vy;p.a+=.02;if(p.y>720)p.l=0;c.fillStyle='rgba(50,80,55,.7)';c.beginPath();c.ellipse(p.x,p.y,7,1.6,p.a,0,6.283);c.fill();});SC.leaves=SC.leaves.filter(p=>p.l);
  // sound rings
  SC.rings.forEach(r=>{r.r+=1.6;r.a-=.008;if(r.r<=0)return;c.strokeStyle=`rgba(166,58,43,${Math.max(0,r.a)})`;c.lineWidth=1.4;c.beginPath();c.ellipse(r.x,r.y,r.r,r.r*.3,0,0,6.283);c.stroke();});SC.rings=SC.rings.filter(r=>r.a>0);
  SC.svg.setAttribute('viewBox',`${SC.x.toFixed(1)} 0 ${SC.visW.toFixed(1)} ${SH}`);
  const mi=VIG.reduce((b,v,i)=>Math.abs(v.x-(SC.x+SC.visW/2))<Math.abs(VIG[b].x-(SC.x+SC.visW/2))?i:b,0);$$('#minimap button[data-i]').forEach(b=>b.classList.toggle('on',+b.dataset.i===mi));
  $('#homeTitle').style.opacity=clamp(1-SC.x/500,0,1);
}
function drawFlyingCrane(c,x,y,s,fl){c.save();c.translate(x,y);c.scale(s,s);c.fillStyle='#f7f4ec';c.strokeStyle='#2a231d';c.lineWidth=.7;
  c.beginPath();c.ellipse(0,0,22,6,0,0,6.283);c.fill();c.stroke();c.beginPath();c.moveTo(20,-1);c.quadraticCurveTo(36,-4,44,-2);c.lineWidth=2.6;c.strokeStyle='#f7f4ec';c.stroke();c.lineWidth=2.6;c.strokeStyle='#1e1a17';c.beginPath();c.moveTo(34,-3.5);c.quadraticCurveTo(40,-3,44,-2);c.stroke();
  c.fillStyle='#c0392b';c.beginPath();c.arc(45,-3,1.6,0,6.283);c.fill();c.strokeStyle='#6a6150';c.lineWidth=1;c.beginPath();c.moveTo(46,-2);c.lineTo(54,0);c.stroke();
  c.strokeStyle='#3a3a35';c.beginPath();c.moveTo(-20,1);c.lineTo(-44,4);c.moveTo(-20,2);c.lineTo(-43,6);c.stroke();
  const wy=fl*22;[-1,1].forEach(side=>{c.fillStyle=side<0?'#ece8dc':'#f7f4ec';c.beginPath();c.moveTo(-6,0);c.quadraticCurveTo(-2,wy*side-8,8,wy*side*1.4-4);c.lineTo(14,wy*side*1.2);c.quadraticCurveTo(6,2,8,0);c.closePath();c.fill();c.strokeStyle='#2a231d';c.lineWidth=.6;c.stroke();
    c.fillStyle='#1e1a17';c.beginPath();c.moveTo(4,wy*side*1.25-3);c.lineTo(8,wy*side*1.4-4);c.lineTo(14,wy*side*1.2);c.lineTo(9,wy*side*1.0);c.fill();});
  c.restore();}
function openVig(i){const v=VIG[i],q=QS[v.qin];
  SC.rings.push({x:v.x,y:v.y-40,r:10,a:.8},{x:v.x,y:v.y-40,r:-30,a:.9});
  if(MOTIFS[v.qin])playSeq(MOTIFS[v.qin]);
  $('#qcardIn').innerHTML=`<h3>${v.title}</h3><div class="scene">${v.scene}</div><canvas id="qcCv" style="height:150px"></canvas>
   <p style="font-size:14.5px;line-height:1.95;color:var(--ink2)">${v.who}</p>
   <dl><dt>琴式</dt><dd>${q.n}（${q.k}）—— ${q.f}</dd><dt>形制</dt><dd>${q.d}</dd><dt>尺寸</dt><dd>通长约 120–125 厘米，肩宽约 20 厘米，尾宽约 13–15 厘米；七弦十三徽</dd><dt>代表</dt><dd>${q.ex}</dd><dt>见于</dt><dd>${q.src}</dd></dl>
   <div class="poem">${v.poem}</div>
   <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:14px"><button class="btn sm" id="qcPlay">♪ 再听一段</button><a class="btn sm" href="#styles" onclick="setTimeout(()=>selectStyle('${v.qin}'),200)">看琴式</a><a class="btn sm zhu" href="#play">我也来弹</a></div>`;
  $('#qcard').classList.add('on');
  requestAnimationFrame(()=>{const cv=$('#qcCv');const {c,w,h}=fitCanvas(cv,150);c.save();c.translate(w-10,h/2);c.rotate(Math.PI);drawQin(c,v.qin,{L:w-20,old:.5});c.restore();});
  $('#qcPlay').onclick=()=>playSeq(MOTIFS[v.qin]);
}
