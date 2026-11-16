/* ================= core utils ================= */
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v)), lerp=(a,b,t)=>a+(b-a)*t;
const smooth=(e0,e1,x)=>{const t=clamp((x-e0)/(e1-e0),0,1);return t*t*(3-2*t);};
function rng(seed){let s=(seed*2654435761)>>>0||1;return()=>{s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;return s/4294967296;};}
function noise1(seed){const r=rng(seed);const v=Array.from({length:1024},()=>r());return x=>{const i=Math.floor(x),f=x-i,a=v[i&1023],b=v[(i+1)&1023];const u=f*f*(3-2*f);return a+(b-a)*u;};}
function fbm(n,x,o=5){let s=0,a=.5,f=1;for(let i=0;i<o;i++){s+=a*n(x*f);f*=2.03;a*=.5;}return s;}
function toast(t){const e=$('#toast');e.textContent=t;e.classList.add('on');clearTimeout(e._t);e._t=setTimeout(()=>e.classList.remove('on'),2200);}
function fitCanvas(cv,h){const dpr=Math.min(window.devicePixelRatio||1,2);const w=cv.clientWidth||cv.parentNode.clientWidth;const hh=h||cv.clientHeight;cv.width=Math.round(w*dpr);cv.height=Math.round(hh*dpr);const c=cv.getContext('2d');c.setTransform(dpr,0,0,dpr,0,0);return {c,w,h:hh,dpr};}
const COL={silk:'#efe4cb',silk2:'#e5d5b3',ink:'#2a231d',ink2:'#4b4036',ink3:'#7a6b5c',zhe:'#8d5b3b',qing:'#3d5f70',lv:'#6f8c6b',zhu:'#a63a2b',jin:'#a68a4f',dai:'#5a6a72'};

/* ================= audio: guqin voice ================= */
const AC={ctx:null,master:null,on:false};
function makeIR(C,sec){const len=Math.floor(C.sampleRate*sec),b=C.createBuffer(2,len,C.sampleRate);for(let ch=0;ch<2;ch++){const d=b.getChannelData(ch);for(let i=0;i<len;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/len,3.4)*(i<200?i/200:1);}return b;}
function ac(){
  if(!AC.ctx){const C=new (window.AudioContext||window.webkitAudioContext)();AC.ctx=C;AC.master=C.createGain();AC.master.gain.value=.9;
    const comp=C.createDynamicsCompressor();comp.threshold.value=-14;comp.ratio.value=3;
    const conv=C.createConvolver();conv.buffer=makeIR(C,3.2);const wet=C.createGain();wet.gain.value=.32;
    AC.master.connect(comp);comp.connect(C.destination);AC.master.connect(conv);conv.connect(wet);wet.connect(comp);}
  if(AC.ctx.state==='suspended')AC.ctx.resume();
  if(!AC.on){AC.on=true;const b=$('#sndbtn');b.classList.add('on');b.textContent='♪ 琴声已开';}
  return AC.ctx;
}
document.addEventListener('pointerdown',()=>{try{ac();}catch(e){}},{once:true});
document.addEventListener('keydown',()=>{try{ac();}catch(e){}},{once:true});
// 正调：一弦至七弦  徵 羽 宫 商 角 徵 羽
const STR=[87.31,98.0,116.54,130.81,146.83,174.61,196.0];
const STRNAME=['一','二','三','四','五','六','七'];
const YIN=['徵','羽','宫','商','角','徵','羽'];
const HUI=[1/8,1/6,1/5,1/4,1/3,2/5,1/2,3/5,2/3,3/4,4/5,5/6,7/8];
const HUIDEN=[8,6,5,4,3,5,2,5,3,4,5,6,8];
const HUINAME=['一','二','三','四','五','六','七','八','九','十','十一','十二','十三'];
const pluckListeners=[];
const voices={};
function pluck(str,mode='san',hui=6,vel=1,frac=null){
  let C;try{C=ac();}catch(e){return null;}
  const now=C.currentTime,f0=STR[str];
  const f= mode==='san'?f0: mode==='an'? f0/(frac??HUI[hui]) : f0*HUIDEN[hui];
  if(voices[str])voices[str].stop(now+.02);
  const out=C.createGain();out.gain.value=1;out.connect(AC.master);
  const lp=C.createBiquadFilter();lp.type='lowpass';lp.Q.value=.5;lp.connect(out);
  const oscs=[];
  if(mode==='fan'){
    [[1,1,3.4],[2,.10,1.5],[3,.035,.8],[4.02,.015,.5]].forEach(([n,a,tau])=>{const o=C.createOscillator();o.type='sine';o.frequency.value=f*n;const g=C.createGain();
      g.gain.setValueAtTime(0,now);g.gain.linearRampToValueAtTime(a*.30*vel,now+.006);g.gain.setTargetAtTime(0,now+.01,tau/3);o.connect(g);g.connect(lp);o.start(now);o.stop(now+tau*2.6);oscs.push({o,n,k:1});});
    lp.frequency.value=9000;
  }else{
    const pos=.12,N=11,dull=mode==='an'?.72:1;
    for(let n=1;n<=N;n++){const a=Math.abs(Math.sin(n*Math.PI*pos))/Math.pow(n,1.0)*(n===1?1.3:1);const tau=(mode==='an'?2.8:4.0)/(1+.33*(n-1));const k=1+.00035*n*n;
      const o=C.createOscillator();o.type='sine';o.frequency.value=f*n*k;const g=C.createGain();
      g.gain.setValueAtTime(0,now);g.gain.linearRampToValueAtTime(a*.26*vel,now+.003);g.gain.setTargetAtTime(0,now+.005,tau/3.2);
      o.connect(g);g.connect(lp);o.start(now);o.stop(now+tau*2.3+.1);oscs.push({o,n,k});}
    lp.frequency.setValueAtTime(6000*dull,now);lp.frequency.setTargetAtTime(1300*dull,now+.02,.55);
    const nb=C.createBuffer(1,Math.floor(C.sampleRate*.07),C.sampleRate),d=nb.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/d.length,2.2);
    const ns=C.createBufferSource();ns.buffer=nb;const bp=C.createBiquadFilter();bp.type='bandpass';bp.frequency.value=Math.min(f*7,5000);bp.Q.value=1.2;const ng=C.createGain();ng.gain.value=.10*vel;
    ns.connect(bp);bp.connect(ng);ng.connect(out);ns.start(now);
  }
  const v={f,str,mode,oscs,t0:now,
    stop(t){out.gain.setTargetAtTime(0,t||C.currentTime,.03);},
    glide(nf,dt=.14){const t=C.currentTime;oscs.forEach(x=>x.o.frequency.setTargetAtTime(nf*x.n*x.k,t,dt/3));v.f=nf;},
    vib(depth=.012,rate=5,dur=1.2){const t=C.currentTime,steps=Math.floor(dur*rate*2);for(let i=0;i<=steps;i++){const ff=v.f*(1+(i%2?depth:-depth*.4)*(1-i/steps));oscs.forEach(x=>x.o.frequency.setTargetAtTime(ff*x.n*x.k,t+i/(rate*2),.035));}}
  };
  voices[str]=v;setTimeout(()=>{if(voices[str]===v)delete voices[str];},6000);
  pluckListeners.forEach(fn=>fn(str,mode,hui,f,frac));
  return v;
}
function playSeq(seq,gap=1){ // [[t,str,mode,hui]]
  const ids=[];seq.forEach(([t,s,m,h])=>ids.push(setTimeout(()=>pluck(s,m||'san',h??6,.9),t*1000*gap)));return ()=>ids.forEach(clearTimeout);
}
const MOTIFS={
  fuxi:[[0,0],[.5,3],[1,4],[1.6,5,'an',8],[2.6,2,'fan',6]],
  zhongni:[[0,2],[.45,4],[.9,5],[1.4,6],[2.1,4,'an',8],[3,2]],
  shennong:[[0,0],[.8,2],[1.6,0,'fan',6],[2.3,3,'fan',6]],
  lianzhu:[[0,6],[.25,5],[.5,4],[.75,3],[1.0,2],[1.25,1],[1.5,0],[2.3,4,'an',9]],
  luoxia:[[0,1,'fan',3],[.5,3,'fan',3],[1,5,'fan',3],[1.6,4,'fan',6],[2.4,2,'fan',6]],
  jiaoye:[[0,3],[.5,5,'an',9],[1.0,4],[1.5,6],[2.2,5]],
  fengsu:[[0,5],[.4,6],[.8,5,'an',9],[1.4,3],[2,2]],
  liezi:[[0,1],[.6,2],[1.2,4],[1.8,4,'an',9]],
  shikuang:[[0,0],[.3,0],[.9,2],[1.5,3,'an',9],[2.2,1]],
  lingji:[[0,6,'fan',6],[.6,4,'fan',6],[1.2,2,'fan',6],[1.9,0]]
};

/* ================= qin shapes (形制) ================= */
function sq(t,a,b,d,k=.008){return d*(smooth(a,a+k,t)-smooth(b-k,b,t));}
function rd(t,a,b,d){return (t>a&&t<b)?d*Math.sin(Math.PI*(t-a)/(b-a)):0;}
function mr(t,a,b,d,n){if(t<=a||t>=b)return 0;const s=(b-a)/n,k=(t-a)/s,f=k-Math.floor(k);return d*Math.pow(Math.sin(Math.PI*f),.8);}
function wv(t,a,b,d,n){if(t<=a||t>=b)return 0;const env=Math.sin(Math.PI*(t-a)/(b-a));return d*env*(.5-.5*Math.cos(2*Math.PI*n*(t-a)/(b-a)));}
function baseHW(t,head=.86,tail=.68){let w;
  if(t<.12)w=head;else if(t<.2)w=lerp(head,1,smooth(.12,.2,t));else w=lerp(1,tail,(t-.2)/.8);
  const hc=.028;if(t<hc)w*=.72+.28*Math.sqrt(Math.max(0,1-Math.pow(1-t/hc,2)));
  const tc=.012;if(t>1-tc)w*=.86+.14*Math.sqrt(Math.max(0,1-Math.pow((t-(1-tc))/tc,2)));
  return w;}
const QS={
  fuxi:{n:'伏羲式',k:'传为伏羲所制',hw:t=>baseHW(t,.88)-rd(t,.115,.205,.20)-rd(t,.56,.70,.12),
    d:'项与腰各作一处半月形弯入，弧线圆润饱满，琴体宽博厚重，气象浑朴。唐代名琴“九霄环佩”即为伏羲式，是现存唐琴中的代表。',
    f:'项、腰各一处圆弧（半月）内收',ex:'唐 · 九霄环佩（故宫博物院藏）',src:'《太音大全》《五知斋琴谱》'},
  shennong:{n:'神农式',k:'传为神农氏削桐为琴',hw:t=>baseHW(t,.92,.66)-rd(t,.12,.205,.075)-rd(t,.55,.72,.04),
    d:'项部只作极浅的弧度，腰几乎不内收，通体舒展平直，如一段自然的桐木，取“上古质朴”之意。故宫藏唐琴“大圣遗音”即为神农式。',
    f:'项微收，腰几不内收，轮廓平直古朴',ex:'唐 · 大圣遗音（故宫博物院藏）',src:'《风宣玄品》《太音大全》'},
  zhongni:{n:'仲尼式',k:'传为孔子所制',hw:t=>baseHW(t)-sq(t,.12,.2,.17)-sq(t,.6,.71,.10),
    d:'项、腰各作一处方折凹入，线条简洁端正，不事雕饰，有君子之风。是传世最多、今日最常见的琴式，初学者的第一张琴大多是仲尼式。',
    f:'项、腰各一处方折内收',ex:'明 · 潞王“中和”琴等',src:'《文会堂琴谱》《五知斋琴谱》'},
  lianzhu:{n:'连珠式',k:'弧如贯珠',hw:t=>baseHW(t)-mr(t,.11,.215,.14,3)-mr(t,.545,.725,.10,3),
    d:'项与腰各以三个连续的小圆弧内收，宛如一串珠子，节奏感极强。故宫藏唐琴“飞泉”即为连珠式，弧线连绵，灵动而不失庄重。',
    f:'项、腰各作三连弧',ex:'唐 · 飞泉（故宫博物院藏）',src:'《太音大全》'},
  luoxia:{n:'落霞式',k:'如落霞绵延',hw:t=>{let w=baseHW(t)-rd(t,.115,.2,.07);if(t>.21&&t<.93){const f=(t-.21)/.72,env=Math.pow(Math.sin(Math.PI*f),.35);w-=.13*env*(.5-.5*Math.cos(2*Math.PI*4*f));}return w;},
    d:'琴身两侧自肩至尾作四道对称的波浪曲线，起伏舒缓圆转，如晚霞层叠，取王勃“落霞与孤鹜齐飞”之意。波峰与波谷相连而无棱角，曲线最为柔美，也最考验斫琴者对左右对称的把握。',
    f:'两侧自肩至尾作对称的舒缓波浪',ex:'宋元以来多有斫制',src:'《古音正宗》《五知斋琴谱》'},
  jiaoye:{n:'蕉叶式',k:'形似芭蕉叶',tl:.94,hw:t=>{let w;
      if(t<.22)w=.42+.58*Math.pow(Math.sin(Math.PI/2*t/.22),.8);else if(t<.34)w=1;else if(t<.9)w=lerp(1,.7,(t-.34)/.56);
      else if(t<.955)w=lerp(.7,.6,(t-.9)/.055);else if(t<.975)w=lerp(.6,.17,smooth(.955,.975,t));else w=.16;
      if(t>.08&&t<.92){const f=(t-.08)/.84;w-=.06*(.5-.5*Math.cos(2*Math.PI*6*f))*Math.pow(Math.sin(Math.PI*f),.5);}
      if(t<.015)w*=.55+.45*Math.sqrt(t/.015);return w;},
    d:'整张琴仿一片芭蕉叶：琴首圆润如叶端，不设项、腰，两侧边缘作轻微的起伏，如叶缘；琴尾收窄，龙龈之外伸出一段叶柄，琴背常刻叶脉。传为明代祝公望（祝海鹤）所创，是“以物象入琴”最直接的一式。',
    f:'通体叶形，无项腰，边缘微起伏，尾出叶柄',ex:'明以后流行',src:'清代诸谱'},
  fengsu:{n:'凤嗉式',k:'项如凤颈之嗉',hw:t=>baseHW(t)-rd(t,.11,.18,.19)+rd(t,.18,.25,.04)-sq(t,.6,.7,.08),
    d:'项部先深深内收，随即微微鼓出，如凤鸟颈下的嗉囊，再接方折的腰。“凤”在琴上无处不在 —— 凤舌、凤额、凤足，凤嗉式更把凤形写进了轮廓。',
    f:'项部深收后微鼓，腰作方折',ex:'传世实物较少',src:'《太音大全》'},
  liezi:{n:'列子式',k:'以列御寇为名',hw:t=>baseHW(t)-sq(t,.12,.2,.15)-rd(t,.57,.75,.09),
    d:'项部方折，腰部则改作舒缓的长弧，方圆相济。以道家人物列子为名，暗合“御风而行”之意，线条比仲尼式更显洒脱。',
    f:'项方折，腰作长弧',ex:'传世实物较少',src:'《太音大全》'},
  shikuang:{n:'师旷式',k:'以春秋乐师师旷为名',hw:t=>baseHW(t)-sq(t,.12,.2,.15)-sq(t,.56,.645,.06)-sq(t,.645,.73,.12),
    d:'腰部作两级台阶式的方折，层次分明。师旷是春秋晋国乐师，以辨音之精闻名，此式以他为名，取“审音知政”之意。',
    f:'项方折，腰作两级方折',ex:'传世实物较少',src:'《太音大全》'},
  lingji:{n:'灵机式',k:'取灵动之机',hw:t=>baseHW(t,.86,.7)-rd(t,.12,.2,.15)-rd(t,.48,.8,.06),
    d:'项作圆弧，腰部内收极长而浅，若有若无，整张琴显得修长清秀。明代宁王朱权曾斫“飞瀑连珠”等琴，灵机式也见于明清琴谱之中。',
    f:'项圆弧，腰作极长的浅弧',ex:'明清琴谱中多见',src:'《风宣玄品》'}
};
const QORDER=['fuxi','shennong','zhongni','lianzhu','luoxia','jiaoye','fengsu','liezi','shikuang','lingji'];
const RATIO=.083; // half shoulder width / length  (约 20cm / 120cm)
function qinOutline(id,L,n=240,mix=null){const hw=QS[id].hw;const hw2=mix?QS[mix.id].hw:null;const pts=[];
  for(let i=0;i<=n;i++){const t=i/n;let w=hw(t);if(hw2)w=lerp(w,hw2(t),mix.t);pts.push([t*L,Math.max(.05,w)*L*RATIO]);}return pts;}
function hwAt(id,t){return QS[id].hw(t);}
/* draw qin top view: origin at head-center, axis along +x (head->tail), +y = 一弦/徽 side */
function drawQin(c,id,{L=400,strings=true,hui=true,lac=true,old=0,alpha=1,ink=false,mix=null,face='top',stroke=null,glowStr=null,pressX=null}={}){
  const pts=qinOutline(id,L,240,mix);
  c.save();c.globalAlpha*=alpha;
  const path=new Path2D();pts.forEach(([x,y],i)=>i?path.lineTo(x,y):path.moveTo(x,y));for(let i=pts.length-1;i>=0;i--)path.lineTo(pts[i][0],-pts[i][1]);path.closePath();
  if(ink){c.fillStyle=typeof ink==='string'?ink:'rgba(30,24,20,.9)';c.fill(path);}
  else if(lac){const g=c.createLinearGradient(0,-L*RATIO,0,L*RATIO);g.addColorStop(0,'#3b2619');g.addColorStop(.25,'#21160f');g.addColorStop(.55,'#2a1a12');g.addColorStop(1,'#120c09');
    c.fillStyle=g;c.fill(path);
    const g2=c.createLinearGradient(0,0,L,0);g2.addColorStop(0,'rgba(120,60,30,.35)');g2.addColorStop(.5,'rgba(0,0,0,0)');g2.addColorStop(1,'rgba(110,50,25,.3)');c.fillStyle=g2;c.fill(path);
    c.save();c.clip(path);c.globalCompositeOperation='screen';const hl=c.createLinearGradient(0,-L*RATIO,0,L*RATIO*.2);hl.addColorStop(0,'rgba(255,220,180,0)');hl.addColorStop(.35,'rgba(255,220,180,.10)');hl.addColorStop(.5,'rgba(255,220,180,0)');c.fillStyle=hl;c.fillRect(0,-L,L,2*L);c.restore();
    if(old>0){c.save();c.clip(path);const r=rng(id.length*7+3);c.strokeStyle=`rgba(190,140,100,${.16*old})`;c.lineWidth=Math.max(.5,L/900);
      const kind=old;for(let i=0;i<Math.floor(60*old+20);i++){const x=r()*L,y=(r()-.5)*L*RATIO*2;c.beginPath();
        if(kind>.66){/*梅花断*/const rr=L*.006*(1+r());for(let a=0;a<5;a++){const an=a/5*6.28;c.moveTo(x,y);c.lineTo(x+Math.cos(an)*rr,y+Math.sin(an)*rr);}}
        else{c.moveTo(x,y-L*RATIO*.5);c.quadraticCurveTo(x+(r()-.5)*L*.01,y,x+(r()-.5)*L*.006,y+L*RATIO*.5);} c.stroke();}
      c.restore();}
    c.strokeStyle='rgba(0,0,0,.5)';c.lineWidth=Math.max(.6,L/500);c.stroke(path);
  }
  if(stroke){c.strokeStyle=stroke;c.lineWidth=Math.max(1,L/360);c.stroke(path);}
  if(face==='top'&&(strings||hui)){
    const hw=t=>(mix?lerp(QS[id].hw(t),QS[mix.id].hw(t),mix.t):QS[id].hw(t))*L*RATIO;
    const ty=.045,tl=QS[id].tl||.975;
    // 岳山 & 龙龈
    c.fillStyle=lac?'#0d0907':'rgba(30,24,20,.85)';
    c.fillRect(ty*L-L*.006,-hw(ty)*.9,L*.012,hw(ty)*1.8);
    c.beginPath();c.ellipse(tl*L,0,L*.005,hw(tl)*.78,0,0,6.283);c.fill();
    if(hui){for(let i=0;i<13;i++){const t=ty+HUI[i]*(tl-ty);const r=L*(i===6?.0062:.0045)*(i===6?1:(1-Math.abs(i-6)/22));c.beginPath();c.arc(t*L,hw(t)*.80,Math.max(1,r),0,6.283);
      c.fillStyle=lac?'#efe7d6':'rgba(166,58,43,.9)';c.fill();}}
    if(strings){for(let s=0;s<7;s++){const y1=lerp(.60,-.60,s/6)*hw(ty),y2=lerp(.42,-.42,s/6)*hw(tl);c.beginPath();c.moveTo(ty*L,y1);c.lineTo(tl*L,y2);
      const glow=glowStr&&glowStr[s];c.strokeStyle=glow?`rgba(255,226,170,${.5+.5*glow})`:(lac?'rgba(235,222,195,.75)':'rgba(40,30,25,.7)');c.lineWidth=(glow?1.6:1)*Math.max(.6,L/1100*(1.5-s*.12));c.stroke();}}
  }
  if(face==='bottom'){const hw=t=>QS[id].hw(t)*L*RATIO;c.fillStyle='rgba(8,5,4,.92)';
    c.beginPath();c.roundRect?c.roundRect(L*.34,-hw(.4)*.16,L*.17,hw(.4)*.32,L*.01):c.rect(L*.34,-hw(.4)*.16,L*.17,hw(.4)*.32);c.fill();
    c.beginPath();c.roundRect?c.roundRect(L*.72,-hw(.75)*.15,L*.075,hw(.75)*.3,L*.01):c.rect(L*.72,-hw(.75)*.15,L*.075,hw(.75)*.3);c.fill();
    c.fillStyle='#0b0806';c.fillRect(L*.03,-hw(.05)*.62,L*.03,hw(.05)*1.24);
    for(let s=0;s<7;s++){const y=lerp(-.55,.55,s/6)*hw(.05);c.beginPath();c.arc(L*.045,y,L*.0075,0,6.283);c.fillStyle='#c9b48e';c.fill();c.beginPath();c.moveTo(L*.045,y);c.lineTo(L*.09,y);c.strokeStyle='rgba(201,180,142,.6)';c.lineWidth=1;c.stroke();}
    [[.67,.32],[.67,-.32]].forEach(([t,yy])=>{c.beginPath();c.arc(L*t,yy*hw(t),L*.012,0,6.283);c.fillStyle='#1a120d';c.fill();c.strokeStyle='#8a6a48';c.stroke();});
  }
  c.restore();
  return path;
}
function qinSVGPath(id,cx,cy,L,ang=0,sy=1,n=120){const pts=qinOutline(id,L,n);const ca=Math.cos(ang),sa=Math.sin(ang);
  const P=(x,y)=>{x-=L/2;y*=sy;return [(cx+x*ca-y*sa).toFixed(1),(cy+x*sa+y*ca).toFixed(1)];};
  let d='';pts.forEach(([x,y],i)=>{const p=P(x,y);d+=(i?'L':'M')+p[0]+' '+p[1];});for(let i=pts.length-1;i>=0;i--){const p=P(pts[i][0],-pts[i][1]);d+='L'+p[0]+' '+p[1];}return d+'Z';}

/* ================= router ================= */
const PAGES=['home','juan','know','styles','history','schools','expo','play','shop'];
const inited={};const pageInit={};
function route(){let h=(location.hash||'#home').slice(1);let sub=null;
  if(h.startsWith('expo-')){sub=h.slice(5);h='expo';}
  if(!PAGES.includes(h))h='home';
  $$('.page').forEach(p=>p.classList.toggle('on',p.id===h));
  $$('#nav li a').forEach(a=>a.classList.toggle('on',a.dataset.p===h));
  closeCard();
  if(!inited[h]&&pageInit[h]){inited[h]=true;try{pageInit[h]();}catch(e){console.error(e);}}
  document.dispatchEvent(new CustomEvent('pagechange',{detail:h}));
  if(sub){setTimeout(()=>{const el=document.getElementById('w-'+sub);if(el)el.scrollIntoView({behavior:'smooth',block:'start'});},120);}else window.scrollTo(0,0);
}
window.addEventListener('hashchange',route);
$('#sndbtn').onclick=()=>{ac();pluck(3,'fan',6,.8);};
function closeCard(){$('#qcard').classList.remove('on');}
function openModal(t,s,build){$('#mT').textContent=t;$('#mS').textContent=s||'';const b=$('#mB');b.innerHTML='';$('#modal').classList.add('on');setTimeout(()=>build(b),30);}
function closeModal(){$('#modal').classList.remove('on');const b=$('#mB');if(b._cleanup)b._cleanup();b._cleanup=null;b.innerHTML='';}
document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeModal();closeCard();}});
