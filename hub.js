/* ================= COVER · INTRO · HUB (千年调式入口) ================= */
const CH=[
 {p:'know',n:'识琴',g:'器',en:'一器三才',crop:[1650,2650],fig:'boy',big:'boy',txt:'七弦十三徽，面圆底方 —— 从一张琴的身体说起'},
 {p:'styles',n:'琴式',g:'形',en:'琴式之辨',crop:[380,1380],fig:'lsplayer',big:'lsplayer',txt:'伏羲、仲尼、连珠、落霞、蕉叶…… 五十余种轮廓'},
 {p:'history',n:'琴史',g:'史',en:'三千年琴事',crop:[2350,3350],fig:'green',big:'green',txt:'从削桐为琴，到飞向太空的《流水》'},
 {p:'schools',n:'琴派',g:'派',en:'琴派流衍',crop:[3050,4050],fig:'red',big:'red',txt:'虞山、广陵、梅庵、九嶷…… 风格因地而殊'},
 {p:'expo',n:'展览',g:'展',en:'弦上有象',crop:[1000,2000],fig:'lslisten',big:'lslisten',txt:'六件数字作品：看懂形、数、声、谱、器'},
 {p:'play',n:'抚琴',g:'弹',en:'左按右弹',crop:[3200,4200],fig:'player',big:'player',txt:'键盘、鼠标或摄像头 —— 两只手各司其职'}
];
function ladyHead(){return `<rect x="-3.4" y="-72" width="6.8" height="7" fill="${SKIN}"/><ellipse cx="0" cy="-80" rx="8" ry="10" fill="#f1e2cc" stroke="${INK}" stroke-width=".6"/>
  <path d="M-8.6,-82 C-10,-94 -2,-97 0,-97 C4,-97 10,-94 8.6,-82 C6,-88 -6,-88 -8.6,-82Z" fill="#1e1a17"/><ellipse cx="0" cy="-101" rx="7" ry="6" fill="#1e1a17"/><ellipse cx="-6" cy="-96" rx="3.4" ry="4" fill="#1e1a17"/><ellipse cx="6" cy="-96" rx="3.4" ry="4" fill="#1e1a17"/>
  <path d="M-10,-100 L10,-104" stroke="#c9a85a" stroke-width="1.1"/><circle cx="9" cy="-104" r="1.6" fill="#a63a2b"/><path d="M-4.4,-81 h2.6 M1.8,-81 h2.6" stroke="${INK}" stroke-width=".8" stroke-linecap="round"/><path d="M-1.4,-74.6 q1.4,.9 2.8,0" stroke="#b5463a" stroke-width="1.2" fill="none"/><circle cx="0" cy="-87" r=".9" fill="#a63a2b"/>`;}
function ladyStanding(){return `<g><ellipse cx="0" cy="1" rx="22" ry="4" fill="#6b5a40" opacity=".35"/>
  <path d="M-14,-66 C-22,-40 -26,-14 -30,0 C-12,4 12,4 30,0 C26,-14 22,-40 14,-66 C6,-70 -6,-70 -14,-66Z" fill="#e8d9c4" stroke="${INK}" stroke-width=".8"/>
  <path d="M-12,-34 C-16,-20 -18,-8 -20,0 M12,-34 C16,-20 18,-8 20,0" stroke="#b5463a" stroke-width="5" opacity=".55"/><path d="M-13,-36 Q0,-32 13,-36" stroke="#3d5f70" stroke-width="3"/>
  <path d="M-6,-36 L-4,4 M6,-36 L4,4" stroke="#a63a2b" stroke-width="1.6"/>
  <path d="M-14,-64 C-26,-56 -28,-38 -22,-26 C-14,-24 -8,-28 -6,-34 C-10,-44 -10,-54 -9,-60Z" fill="#efe4d2" stroke="${INK}" stroke-width=".7"/>
  <path d="M14,-64 C24,-56 22,-40 12,-34 L6,-38 C10,-46 10,-54 9,-60Z" fill="#efe4d2" stroke="${INK}" stroke-width=".7"/>
  <g transform="translate(14,-46)"><ellipse cx="0" cy="-10" rx="9" ry="10" fill="#f4ecd8" stroke="#a68a4f" stroke-width=".8"/><path d="M0,0 v12" stroke="#6b4a32" stroke-width="1.4"/><path d="M-5,-12 q5,-6 10,0" stroke="#7c9b78" fill="none" stroke-width="1"/></g>
  <path d="M-30,-20 C-40,-10 -44,4 -40,14 M30,-20 C40,-12 44,2 40,12" stroke="#c9a85a" stroke-width=".9" fill="none"/>
  <g transform="translate(0,22)">${ladyHead()}</g></g>`;}
function scholarScroll(){return `<g>${standing(0,0,1,{robe:'#cdbf9f',cap:'guan'}).replace(/^<g transform="[^"]*">/,'<g>')}<g transform="translate(16,-96)"><rect x="-4" y="-2" width="34" height="22" fill="#f2ead8" stroke="#a68a4f"/><rect x="-7" y="-4" width="4" height="26" rx="2" fill="#6b4a32"/><rect x="29" y="-4" width="4" height="26" rx="2" fill="#6b4a32"/>
  ${[0,1,2,3,4].map(i=>`<path d="M${24-i*6},2 v14" stroke="#7a6b5c" stroke-width=".8"/>`).join('')}</g></g>`;}
function chFig(k){switch(k){
  case 'kid':return kidWithQin(0,0,1,'lianzhu');
  case 'sage':return seated(0,0,1,{qin:'fuxi',robe:'#e9e4d4',cap:'jin'});
  case 'scroll':return scholarScroll();
  case 'walker':return standing(0,0,1,{robe:'#b9c6be',cap:'jin',staff:true});
  case 'lady':return ladyStanding();
  case 'ladyqin':return seated(0,0,1,{qin:'zhongni',robe:'#e8d4bf',cap:'lady',belt:'#a63a2b'});}}
// add lady cap into headSVG
const _headSVG=headSVG;headSVG=function(cap,tilt){if(cap==='lady')return `<g transform="rotate(${tilt||0} 0 -72)">${ladyHead()}</g>`;return _headSVG(cap,tilt);};
const FIGH={kid:120,sage:100,scroll:150,walker:150,lady:132,ladyqin:110};
let HUB={sel:0,timer:null};
pageInit.home=function(){
  // panel crops from the painted handscroll
  ensureStatic();
  $('#hubFigs').innerHTML=CH.map((c,i)=>`<div class="hf" data-i="${i}" title="${c.n}"><img src="${FIG[c.fig].src}" alt="${c.n}"><span>${c.n}</span></div>`).join('');
  $$('#hubFigs .hf').forEach(el=>{const i=+el.dataset.i;el.onmouseenter=()=>{hubSelect(i);hubStop();};el.onclick=()=>{location.hash='#'+CH[i].p;};});
  $('#hubPanel').onclick=()=>{location.hash='#'+CH[HUB.sel].p;};
  hubSelect(0);hubAuto();window.addEventListener('resize',()=>{if($('#home').classList.contains('on'))hubSelect(HUB.sel,true);});
};
function hubAuto(){hubStop();HUB.timer=setInterval(()=>{if($('#home').classList.contains('on')&&!$('#cover').classList.contains('on'))hubSelect((HUB.sel+1)%CH.length);},5200);}
function hubStop(){clearInterval(HUB.timer);clearTimeout(HUB.re);HUB.re=setTimeout(hubAuto,9000);}
function hubSelect(i,quiet){HUB.sel=i;const c=CH[i];$$('#hubFigs .hf').forEach(el=>el.classList.toggle('on',+el.dataset.i===i));
  const cv=$('#hubCv');const {c:ctx,w,h}=fitCanvas(cv,cv.clientHeight);const [x0,x1]=c.crop;const sw=x1-x0,sh=sw*h/w;const sy=Math.max(120,736-sh);
  ctx.drawImage(SCST.st,x0*SCST.S,sy*SCST.S,sw*SCST.S,sh*SCST.S,0,0,w,h);
  ctx.globalCompositeOperation='multiply';ctx.fillStyle='rgba(120,92,58,.55)';ctx.fillRect(0,0,w,h);ctx.globalCompositeOperation='source-over';
  const g=ctx.createLinearGradient(0,0,w*.6,0);g.addColorStop(0,'rgba(40,30,20,.55)');g.addColorStop(1,'rgba(40,30,20,0)');ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
  const t=$('#hubTitle');t.classList.remove('in');void t.offsetWidth;t.innerHTML=`<div class="ht">${c.n}</div><div class="hg">${c.g}</div><div class="he">${c.en} · ${c.txt}</div>`;t.classList.add('in');
  const big=$('#hubBig');big.classList.remove('in');void big.offsetWidth;
  big.innerHTML=`<img src="${FIG[c.big].src}" alt="">`;big.classList.add('in');
  if(!quiet&&AC.on&&MOTIFS){const m=[MOTIFS.fuxi,MOTIFS.zhongni,MOTIFS.lingji,MOTIFS.lianzhu,MOTIFS.luoxia,MOTIFS.jiaoye][i];pluck(m[0][1],m[0][2]||'san',m[0][3]??6,.5);}
}
/* static painting shared */
let SCST=null;
function ensureStatic(){if(SCST)return SCST;const prev=SC;SC={st:document.createElement('canvas')};paintStatic();SCST={st:SC.st,S:SC.S};SC=prev;return SCST;}
/* ---------- cover & intro ---------- */
function buildCover(){const row=['boy','green','player','red','lsplayer'];
  $('#coverFigs').innerHTML=row.map((k,i)=>`<img src="${FIG[k].src}" alt="" style="height:${k==='boy'?150:128}px;animation-delay:${i*.25}s">`).join('');
  $('#coverGo').onclick=()=>{ac();pluck(3,'fan',6,.8);setTimeout(()=>pluck(0,'san'),400);$('#cover').classList.remove('on');startIntro();};
  $('#coverSkip').onclick=()=>{$('#cover').classList.remove('on');document.body.classList.remove('intro');};}
const INTRO_CAPS=['千年之前，有人在松下抚琴','有人临水而坐，静候知音','有人过桥临溪，静坐听泉','有人泛舟江上，月下横琴','有人在竹林深处，弹琴复长啸','如今，请你走进画中，与琴人同游'];
let INTRO=null;
function startIntro(){document.body.classList.add('intro');location.hash='#juan';const box=$('#introUI');box.classList.add('on');let k=-1;const t0=performance.now(),D=26000;
  const cap=$('#introCap');
  const step=now=>{if(!INTRO)return;const p=(now-t0)/D;if(p>=1){endIntro();return;}
    if(SC&&SC.visW){SC.tx=clamp(p*1.04,0,1)*maxX();}
    const kk=Math.min(INTRO_CAPS.length-1,Math.floor(p*INTRO_CAPS.length));if(kk!==k){k=kk;cap.classList.remove('in');void cap.offsetWidth;cap.textContent=INTRO_CAPS[k];cap.classList.add('in');if(AC.on){const m=MOTIFS[VIG[Math.min(5,k)].qin];playSeq(m.slice(0,3));}}
    INTRO.raf=requestAnimationFrame(step);};
  INTRO={raf:requestAnimationFrame(step)};$('#introSkip').onclick=endIntro;}
function endIntro(){if(!INTRO)return;cancelAnimationFrame(INTRO.raf);INTRO=null;$('#introUI').classList.remove('on');document.body.classList.remove('intro');location.hash='#home';}
/* ---------- narration bar ---------- */
const NARR={home:'七弦有象。选择画框前的一位画中人，进入古琴的六个篇章：识琴、琴式、琴史、琴派、展览与抚琴。',
 juan:'这是一卷会动的山水。拖动画卷，点选画中抚琴之人，他们会告诉你手中古琴的名字、琴式与故事。',
 know:'古琴七弦十三徽，面圆象天，底平象地，通长三尺六寸六分，象一年三百六十六日。点选琴面、琴底与侧面的各个部位，听它们的名字与来历。',
 styles:'古琴的形制有五十余种，变化集中在项与腰两处：方折、半月、连珠、波浪。点选一式，看它的轮廓与故事，再拖动滑块，看两种琴式之间的渐变。',
 history:'琴在先秦与瑟并称，两汉被推为八音之首，魏晋定型，唐宋臻于高峰，明清琴谱刊刻大兴，琴派林立。',
 schools:'明清以后，琴人以地域与师承结社，形成虞山、广陵、浙、蜀、诸城、梅庵、岭南、九嶷等派。',
 expo:'弦上有象，古琴数字艺术展。六件作品，把古琴的形、数、声、谱、器一一拆开，再请你亲手合上。',
 play:'古琴是两只手的事。右手在岳山与一徽之间弹弦，左手在徽位上按、点、走。试试用键盘、鼠标，或者摄像头里你自己的双手。',
 shop:'二十件古琴文创。点右上角的勾，挑出你心仪的物件。'};
let narrOn=false,narrT=0,narrTimer=null;
function narrPlay(){const pg=(location.hash||'#home').slice(1).split('-')[0];const t=NARR[pg]||NARR.home;speak(t);narrOn=true;narrT=0;$('#nbPlay').textContent='❚❚';clearInterval(narrTimer);
  narrTimer=setInterval(()=>{narrT++;$('#nbTime').textContent=`00:${String(narrT).padStart(2,'0')}`;if(!VO.speaking&&narrT>2){narrStop();}},1000);}
function narrStop(){stopSpeak();narrOn=false;$('#nbPlay').textContent='▶';clearInterval(narrTimer);}
function initNarr(){$('#nbPlay').onclick=()=>{ac();narrOn?narrStop():narrPlay();};$('#nbX').onclick=()=>{narrStop();$('#narr').classList.add('min');};$('#nbMin').onclick=()=>$('#narr').classList.remove('min');
  document.addEventListener('pagechange',e=>{narrStop();$('#nbTime').textContent='00:00';$('#nbLab').textContent='讲解 · '+({home:'序',juan:'画卷',know:'识琴',styles:'琴式',history:'琴史',schools:'琴派',expo:'展览',play:'抚琴',shop:'文创'}[e.detail]||'');});}
