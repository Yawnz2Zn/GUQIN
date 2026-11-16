/* ================= PLAY ================= */
const PL={mode:'free',held:[],shift:false,vib:[0,0,0,0,0,0,0],vmode:[],vhui:[],vfrac:[],t:[],last:null,cam:null,camMsg:'',lhand:null,rhand:null,lesson:0,step:0};
const LKEYS={KeyQ:12,KeyW:11,KeyE:10,KeyR:9,KeyT:8,KeyA:7,KeyS:6,KeyD:5,KeyF:4,KeyG:3};
const LKEYLAB={12:'Q',11:'W',10:'E',9:'R',8:'T',7:'A',6:'S',5:'D',4:'F',3:'G'};
const RKEYS={KeyH:0,KeyJ:1,KeyK:2,KeyL:3,Semicolon:4,Quote:5,Enter:6};
const RKEYLAB=['H','J','K','L',';',"'",'↵'];
const LESSONS=[
 {n:'第一组 · 散音',steps:[{s:3,m:'san',j:{lf:'艹',rf:'勹',str:'四'},t:'勾四弦（散音）',h:'左手不按，右手弹四弦：键盘 L 或鼠标点四弦'},{s:6,m:'san',j:{lf:'艹',rf:'乚',str:'七'},t:'挑七弦（散音）',h:'右手弹七弦：Enter'},{s:0,m:'san',j:{lf:'艹',rf:'勹',str:'一'},t:'勾一弦（散音）',h:'一弦最粗、离你最远：H'},{s:2,m:'san',j:{lf:'艹',rf:'木',str:'三'},t:'抹三弦（散音）',h:'K'}]},
 {n:'第二组 · 按音',steps:[{s:3,m:'an',hui:8,j:{lf:'大',hui:'九',rf:'勹',str:'四'},t:'大指按九徽，勾四弦',h:'左手按住 T（九徽）不放，右手按 L'},{s:2,m:'an',hui:9,j:{lf:'夕',hui:'十',rf:'勹',str:'三'},t:'名指按十徽，勾三弦',h:'左手按住 R（十徽），右手按 K'},{s:4,m:'an',hui:6,j:{lf:'大',hui:'七',rf:'乚',str:'五'},t:'大指按七徽，挑五弦',h:'左手按住 S（七徽），右手按 ;'}]},
 {n:'第三组 · 泛音',steps:[{s:0,m:'fan',hui:6,j:{lf:'大',hui:'七',rf:'勹',str:'一'},t:'泛音：七徽，勾一弦',h:'按住 Shift + S，同时按 H'},{s:3,m:'fan',hui:8,j:{lf:'大',hui:'九',rf:'乚',str:'四'},t:'泛音：九徽，挑四弦',h:'Shift + T，同时按 L'},{s:5,m:'fan',hui:4,j:{lf:'大',hui:'五',rf:'勹',str:'六'},t:'泛音：五徽，勾六弦',h:'Shift + F，同时按 \''}]},
 {n:'第四组 · 走手音',steps:[{s:3,m:'an',hui:8,j:{lf:'大',hui:'九',rf:'勹',str:'四'},t:'大九勾四，然后“上”到七徽',h:'按住 T 弹 L，余音未尽时换按 S —— 听音高滑上去'},{s:3,m:'an',hui:6,glide:true,j:{lf:'大',hui:'七',rf:'上',str:''},t:'上七徽',h:'不要再弹，左手直接换到 S'}]}
];
pageInit.play=function(){
  const cv=$('#playCv');PL.cv=cv;
  $$('[data-mode]').forEach(b=>b.onclick=()=>setPlayMode(b.dataset.mode));
  window.addEventListener('keydown',plKey);window.addEventListener('keyup',plKeyUp);
  cv.addEventListener('pointerdown',plPtr);cv.addEventListener('pointermove',e=>{if(e.buttons)plPtr(e,true);});
  $('#lsN').onclick=()=>{PL.lesson=(PL.lesson+1)%LESSONS.length;PL.step=0;showLesson();};
  requestAnimationFrame(plLoop);
};
function setPlayMode(m){PL.mode=m;$$('[data-mode]').forEach(b=>b.classList.toggle('on',b.dataset.mode===m));$('#lesson').style.display=m==='learn'?'flex':'none';if(m==='learn'){PL.step=0;showLesson();}
  if(m==='cam')startCam();else stopCam();}
function showLesson(){const L=LESSONS[PL.lesson],s=L.steps[PL.step];$('#lsT').textContent=s.t;$('#lsH').textContent=s.h;$('#lsP').textContent=`${L.n} · ${PL.step+1}/${L.steps.length}`;
  const j=$('#lsJ');j.innerHTML='<canvas style="width:80px;height:80px;display:block"></canvas>';drawJianzi($('canvas',j),s.j,false);}
function leftState(){if(PL.cam&&PL.lhand){return PL.lhand;}const h=PL.held[PL.held.length-1];if(h==null)return {mode:'san'};return {mode:PL.shift?'fan':'an',hui:h};}
function doPluck(s,vel=1){if(!$('#play').classList.contains('on'))return;const L=leftState();let v;
  if(L.mode==='san')v=pluck(s,'san',6,vel);else if(L.mode==='fan')v=pluck(s,'fan',L.hui,vel);else v=pluck(s,'an',L.hui??6,vel,L.frac??null);
  PL.vib[s]=1;PL.vmode[s]=L.mode;PL.vhui[s]=L.hui;PL.vfrac[s]=L.frac??(L.hui!=null?HUI[L.hui]:1);PL.t[s]=performance.now();PL.last={s,L};
  if(PL.mode==='learn')checkLesson(s,L,false);}
function checkLesson(s,L,glide){const st=LESSONS[PL.lesson].steps[PL.step];if(!st)return;
  const ok=st.glide?glide&&L.hui===st.hui:(!glide&&s===st.s&&L.mode===st.m&&(st.m==='san'||L.hui===st.hui));
  if(ok){toast('得之 ✓');PL.step++;if(PL.step>=LESSONS[PL.lesson].steps.length){toast(LESSONS[PL.lesson].n+' 完成！');PL.step=0;PL.lesson=(PL.lesson+1)%LESSONS.length;}setTimeout(showLesson,400);}}
function glideRinging(){const L=leftState();if(L.mode!=='an')return;for(let s=0;s<7;s++){const v=voices[s];if(v&&v.mode!=='fan'&&performance.now()-PL.t[s]<3500){const nf=STR[s]/(L.frac??HUI[L.hui]);v.glide(nf,.18);PL.vfrac[s]=L.frac??HUI[L.hui];PL.vhui[s]=L.hui;if(PL.mode==='learn'&&!PL.cam)checkLesson(s,L,true);}}}
function plKey(e){if(!$('#play').classList.contains('on')||e.repeat)return;if(e.target.tagName==='INPUT')return;
  if(e.key==='Shift')PL.shift=true;
  if(LKEYS[e.code]!=null){e.preventDefault();PL.held=PL.held.filter(h=>h!==LKEYS[e.code]);PL.held.push(LKEYS[e.code]);glideRinging();}
  if(RKEYS[e.code]!=null){e.preventDefault();doPluck(RKEYS[e.code]);}
  if(e.code==='KeyZ'||e.code==='KeyX'){for(let s=0;s<7;s++){const v=voices[s];if(v&&v.mode==='an')v.vib(e.code==='KeyZ'?.008:.02,e.code==='KeyZ'?6:4,1.3);}}}
function plKeyUp(e){if(e.key==='Shift')PL.shift=false;if(LKEYS[e.code]!=null){PL.held=PL.held.filter(h=>h!==LKEYS[e.code]);}}
function geom(){const cv=PL.cv,w=cv.clientWidth,h=Math.round(w*.36);const L=w*.86,cx=w*.5,cy=h*.54,head=cx+L/2;return {w,h,L,cx,cy,head};}
function strY(G,s,X){const t=(G.head-X)/G.L,hw=t2=>QS.zhongni.hw(t2)*G.L*RATIO;const u=clamp((t-.045)/.93,0,1);const y1=lerp(.6,-.6,s/6)*hw(.045),y2=lerp(.42,-.42,s/6)*hw(.975);return G.cy-lerp(y1,y2,u);}
function huiXs(G,i){return G.head-(.045+HUI[i]*.93)*G.L;}
let ptrLast=null;
function plPtr(e,move){const r=PL.cv.getBoundingClientRect(),G=geom();const X=e.clientX-r.left,Y=e.clientY-r.top;
  if(!move){ptrLast=null;}
  let best=-1,bd=1e9;for(let s=0;s<7;s++){const d=Math.abs(strY(G,s,X)-Y);if(d<bd){bd=d;best=s;}}
  if(!move){if(bd<14)doPluck(best);}
  else if(ptrLast){for(let s=0;s<7;s++){const y=strY(G,s,X);if((ptrLast.y-y)*(Y-y)<0)doPluck(s,.8);}}
  ptrLast={x:X,y:Y};}
function plLoop(now){requestAnimationFrame(plLoop);if(!$('#play').classList.contains('on'))return;const cv=PL.cv;const G=geom();const {c,w,h}=fitCanvas(cv,G.h);
  // table
  const g=c.createLinearGradient(0,0,0,h);g.addColorStop(0,'#2b2018');g.addColorStop(1,'#18110c');c.fillStyle=g;c.fillRect(0,0,w,h);
  c.strokeStyle='rgba(255,220,170,.035)';for(let i=0;i<30;i++){c.beginPath();c.moveTo(0,i*h/30);c.bezierCurveTo(w*.3,i*h/30+6,w*.6,i*h/30-6,w,i*h/30+2);c.stroke();}
  if(PL.cam)camStep(now,G);
  c.save();c.translate(G.head,G.cy);c.rotate(Math.PI);drawQin(c,'zhongni',{L:G.L,old:.3,strings:false});c.restore();
  // lesson target
  const st=PL.mode==='learn'?LESSONS[PL.lesson].steps[PL.step]:null;
  if(st&&st.hui!=null){const x=huiXs(G,st.hui);const a=.4+.3*Math.sin(now/200);c.fillStyle=`rgba(232,207,142,${a*.35})`;c.fillRect(x-10,G.cy-G.L*RATIO,20,G.L*RATIO*2);}
  // strings with vibration
  const L=leftState();
  for(let s=0;s<7;s++){PL.vib[s]*=.965;const amp=PL.vib[s]*5;const xs=huiXs(G,0)+(G.head-huiXs(G,0))*.55,xa=G.head-.045*G.L,xb=G.head-.975*G.L;
    const fr=PL.vfrac[s]||1,md=PL.vmode[s];const xp=G.head-(.045+fr*.93)*G.L;
    c.beginPath();for(let i=0;i<=160;i++){const X=lerp(xa,xb,i/160);let y=strY(G,s,X);if(amp>.05){const u=(xa-X)/(xa-xb);if(md==='fan'){const n=HUIDEN[PL.vhui[s]]||2;y+=amp*.6*Math.sin(n*Math.PI*u)*Math.sin(now/22);}
      else if(md==='an'){if(X>xp){const uu=(xa-X)/(xa-xp);y+=amp*Math.sin(Math.PI*uu)*Math.sin(now/25);}}else y+=amp*Math.sin(Math.PI*u)*Math.sin(now/28);}i?c.lineTo(X,y):c.moveTo(X,y);}
    const tgt=st&&st.s===s&&!st.glide;c.strokeStyle=tgt?`rgba(232,207,142,${.6+.4*Math.sin(now/180)})`:`rgba(${235},${222+PL.vib[s]*20},${195+PL.vib[s]*40},${.7+PL.vib[s]*.3})`;c.lineWidth=(tgt?2.2:1)*(1.7-s*.12)+PL.vib[s];c.stroke();
    // right-hand keycap
    const ky=strY(G,s,G.head-.02*G.L);c.fillStyle='rgba(239,228,203,.9)';c.font='12px "Noto Serif SC",serif';c.textAlign='left';c.textBaseline='middle';c.fillText(RKEYLAB[s],G.head+12,ky);
    c.fillStyle='rgba(239,228,203,.45)';c.fillText(STRNAME[s]+'弦',G.head+28,ky);}
  // hui key labels
  for(let i=0;i<13;i++){const x=huiXs(G,i);c.fillStyle='rgba(239,228,203,.55)';c.textAlign='center';c.font='12px "ZCOOL XiaoWei",serif';c.fillText(HUINAME[i],x,G.cy-G.L*RATIO-30);
    if(LKEYLAB[i]){const on=PL.held.includes(i);c.fillStyle=on?'#a63a2b':'rgba(239,228,203,.12)';c.fillRect(x-10,G.cy-G.L*RATIO-22,20,16);c.fillStyle=on?'#f6e9d6':'rgba(239,228,203,.8)';c.font='11px "Noto Serif SC",serif';c.fillText(LKEYLAB[i],x,G.cy-G.L*RATIO-14);}}
  // left-hand marker
  if(L.mode!=='san'){const fr=L.frac??HUI[L.hui];const x=G.head-(.045+fr*.93)*G.L;c.fillStyle=L.mode==='fan'?'rgba(170,200,220,.25)':'rgba(236,216,187,.28)';c.beginPath();c.ellipse(x,G.cy,12,G.L*RATIO*.9,0,0,6.283);c.fill();
    c.fillStyle='#efe4cb';c.font='14px "ZCOOL XiaoWei",serif';c.textAlign='center';c.fillText((L.mode==='fan'?'泛 · ':'按 · ')+(L.hui!=null?HUINAME[L.hui]+'徽':'走手'),x,G.cy+G.L*RATIO+22);}
  // status
  c.textAlign='left';c.fillStyle='rgba(239,228,203,.85)';c.font='15px "ZCOOL XiaoWei",serif';
  const lt=L.mode==='san'?'左手：不按 → 散音':L.mode==='fan'?`左手：轻点${L.hui!=null?HUINAME[L.hui]+'徽':''} → 泛音`:`左手：按${L.hui!=null?HUINAME[L.hui]+'徽':'于弦上'} → 按音`;c.fillText(lt,18,h-18);
  if(PL.last){const {s,L:l}=PL.last;c.textAlign='right';c.fillText(`${l.mode==='san'?'散':l.mode==='fan'?'泛':'按'}${l.hui!=null&&l.mode!=='san'?' · '+HUINAME[l.hui]+'徽':''} · ${STRNAME[s]}弦（正调“${YIN[s]}”）`,w-18,h-18);}
  if(PL.cam){c.textAlign='center';c.fillStyle='rgba(239,228,203,.9)';c.font='14px "Noto Serif SC",serif';if(PL.camMsg)c.fillText(PL.camMsg,w/2,24);drawHands(c,G);}
}
/* ---- camera gestures ---- */
async function startCam(){PL.cam={lm:null,prevY:null};PL.camMsg='正在请求摄像头…';const v=$('#camv');
  try{const stream=await navigator.mediaDevices.getUserMedia({video:{width:640,height:480,facingMode:'user'}});v.srcObject=stream;await v.play();v.style.display='block';PL.cam.stream=stream;}
  catch(e){PL.camMsg='摄像头未能开启（未授权或当前浏览器窗口不允许）。可在 Chrome 中直接打开本网页文件并允许摄像头；或改用键盘＋鼠标双手弹奏。';return;}
  PL.camMsg='正在加载手势识别…';
  try{const vision=await import('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14');const fs=await vision.FilesetResolver.forVisionTasks('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm');
    PL.cam.lm=await vision.HandLandmarker.createFromOptions(fs,{baseOptions:{modelAssetPath:'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',delegate:'GPU'},runningMode:'VIDEO',numHands:2});
    PL.camMsg='举起双手：左手在画面左侧按徽，右手在右侧划弦';setTimeout(()=>{if(PL.cam)PL.camMsg='';},5000);}
  catch(e){PL.camMsg='手势识别模块未能加载（需要联网）。可改用键盘＋鼠标双手弹奏。';}}
function stopCam(){if(PL.cam&&PL.cam.stream)PL.cam.stream.getTracks().forEach(t=>t.stop());PL.cam=null;PL.lhand=null;PL.rhand=null;$('#camv').style.display='none';}
function camStep(now,G){const C=PL.cam,v=$('#camv');if(!C||!C.lm||v.readyState<2)return;let res;try{res=C.lm.detectForVideo(v,now);}catch(e){return;}
  let lh=null,rh=null;(res.landmarks||[]).forEach(lms=>{const sx=1-lms[0].x;if(sx<.5)lh=lms;else rh=lms;});
  C.lms={lh,rh};
  if(lh){const tip=lh[8],th=lh[4];const X=(1-tip.x)*G.w,Y=tip.y*G.h;const t=(G.head-X)/G.L;const fr=clamp((t-.045)/.93,.1,.95);const pinch=Math.hypot(tip.x-th.x,tip.y-th.y)<.055;
    const onQin=Math.abs(Y-G.cy)<G.L*RATIO*1.6;
    if(!onQin)PL.lhand={mode:'san'};
    else if(pinch){let best=0,bd=9;HUI.forEach((f,i)=>{if(Math.abs(f-fr)<bd){bd=Math.abs(f-fr);best=i;}});PL.lhand={mode:'fan',hui:best};}
    else{let best=null;HUI.forEach((f,i)=>{if(Math.abs(f-fr)<.012)best=i;});const prev=PL.lhand;PL.lhand={mode:'an',frac:fr,hui:best};if(prev&&prev.mode==='an'&&Math.abs((prev.frac||0)-fr)>.004)glideRinging();}}
  else PL.lhand={mode:'san'};
  if(rh){const tip=rh[8];const X=(1-tip.x)*G.w,Y=tip.y*G.h;if(C.prevY!=null){for(let s=0;s<7;s++){const y=strY(G,s,X);if((C.prevY-y)*(Y-y)<0)doPluck(s,clamp(Math.abs(Y-C.prevY)/20,.4,1));}}C.prevY=Y;}else C.prevY=null;}
function drawHands(c,G){const C=PL.cam;if(!C||!C.lms)return;const B=[[0,1],[1,2],[2,3],[3,4],[0,5],[5,6],[6,7],[7,8],[5,9],[9,10],[10,11],[11,12],[9,13],[13,14],[14,15],[15,16],[13,17],[17,18],[18,19],[19,20],[0,17]];
  [['lh','rgba(236,216,187,.8)'],['rh','rgba(232,207,142,.8)']].forEach(([k,col])=>{const l=C.lms[k];if(!l)return;c.strokeStyle=col;c.lineWidth=1.4;B.forEach(([a,b])=>{c.beginPath();c.moveTo((1-l[a].x)*G.w,l[a].y*G.h);c.lineTo((1-l[b].x)*G.w,l[b].y*G.h);c.stroke();});
    c.fillStyle='#a63a2b';c.beginPath();c.arc((1-l[8].x)*G.w,l[8].y*G.h,6,0,6.283);c.fill();c.fillStyle='#efe4cb';c.font='13px "ZCOOL XiaoWei",serif';c.textAlign='center';c.fillText(k==='lh'?'左手':'右手',(1-l[0].x)*G.w,l[0].y*G.h+18);});}
