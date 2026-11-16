/* ================= KNOW ================= */
const PARTS={
 top:[['岳山',.045,'up','琴首横置的硬木，弦从此处架起，是有效弦长的起点。“岳”即高山，与琴尾龙龈遥相呼应 —— 一端是山，一端是龙。'],
  ['承露',.028,'dn','岳山外侧的一条窄木，弦由此穿入琴首的弦眼。取“承接天露”之意。'],
  ['琴额',.012,'up','琴首最前端，又称凤额。琴首部分合称“凤首”，有凤舌、凤眼之名。'],
  ['琴项',.16,'dn','琴首与琴身之间收窄处，如人之颈。不同琴式在此处作方折、半月或连珠的变化。'],
  ['琴肩',.22,'up','项下渐宽处，如人之肩，是琴面最宽的地方，约 20 厘米。'],
  ['十三徽',.5,'up','琴面外侧镶嵌的十三个圆点，多用贝母或金玉。七徽居中最大，正是弦长的一半；它们既是泛音的节点，也是按音的坐标。象十二月加一闰月。'],
  ['琴腰',.64,'dn','琴身中段第二处收窄，如人之腰。琴式之辨，多看项与腰。'],
  ['七弦',.36,'dn','七根丝弦（今亦有钢丝尼龙弦），外粗内细。相传原为五弦，象五行；周文王、武王各加一弦，称文弦、武弦。'],
  ['龙龈',.975,'up','琴尾架弦的硬木，弦由此绕过琴尾，系于琴底雁足。有效弦长止于此。'],
  ['焦尾',.995,'dn','琴尾末端，又称冠角。取蔡邕“焦尾琴”故事：他从灶火中救出一段桐木，斫成名琴，尾部犹有焦痕。']],
 bottom:[['琴轸',.045,'up','琴底首部七枚调弦的轸子，转动它来调整弦的松紧。'],
  ['轸池',.07,'dn','安放琴轸的凹槽。'],
  ['龙池',.425,'up','琴底中部较大的出音孔，长约 20 厘米，龙潜于池。'],
  ['雁足',.67,'dn','琴底的两只足，弦绕过龙龈后分系在两只雁足上 —— 一足系四弦，一足系三弦。'],
  ['凤沼',.76,'up','琴底尾部较小的出音孔，凤栖于沼。一池一沼、一大一小，琴腹之声由此流出。']],
 side:[['琴面·天',.35,'up','面板呈拱圆形，象天之穹窿。面板多用桐木或杉木，取其松透易振。'],
  ['琴底·地',.55,'dn','底板平直，象地之方正。底板多用梓木等较硬的木材。面底皆用桐木，则称“纯阳琴”。'],
  ['天柱',.26,'up','琴腹内连接面板与底板的圆柱，位于琴肩之下，象天，圆。'],
  ['地柱',.74,'dn','琴腹内另一根柱，位于凤沼附近，多为方形，象地，方。天圆地方，琴腹之中亦藏天地。'],
  ['岳山',.045,'up','从侧面看，岳山高出琴面，使弦与面板之间留出按弦的空间。']]
};
let anatFace='top',anatSel=null;
function drawAnat(){const cv=$('#anatCv');const {c,w,h}=fitCanvas(cv,anatFace==='side'?260:300);const L=w-60,cx=w-30;
  c.clearRect(0,0,w,h);const sel=anatSel;
  if(anatFace==='side'){const y0=h/2;c.save();c.translate(cx,y0);c.rotate(Math.PI);
    const p=new Path2D();p.moveTo(0,-8);for(let i=0;i<=100;i++){const t=i/100;p.lineTo(t*L,-8-16*Math.sin(Math.PI*Math.min(1,t*1.02))*(t<.95?1:.6));}p.lineTo(L,10);p.lineTo(0,10);p.closePath();
    const g=c.createLinearGradient(0,-30,0,10);g.addColorStop(0,'#3a2619');g.addColorStop(1,'#140d09');c.fillStyle=g;c.fill(p);
    c.fillStyle='rgba(239,228,203,.15)';c.fillRect(L*.05,-4,L*.9,10);
    c.fillStyle='#c9b48e';c.beginPath();c.arc(L*.26,0,4,0,6.283);c.fill();c.fillRect(L*.74-4,-4,8,9);
    c.fillStyle='#0b0806';c.fillRect(L*.04,-31,L*.012,26);c.fillRect(L*.67,10,10,14);c.fillRect(L*.67-30,10,10,14);
    c.strokeStyle='rgba(235,222,195,.7)';c.beginPath();c.moveTo(L*.045,-31);c.lineTo(L*.975,-12);c.stroke();
    c.restore();}
  else{c.save();c.translate(cx,h/2);c.rotate(Math.PI);drawQin(c,'zhongni',{L,old:.35,face:anatFace});c.restore();}
  // labels
  const box=$('#anat');$$('.lbl',box).forEach(e=>e.remove());
  PARTS[anatFace].forEach(([n,t,dir,txt])=>{const el=document.createElement('div');el.className='lbl '+dir+(sel===n?' on':'');el.textContent=n;
    const x=cx-t*L+10,y=(dir==='up'?h/2-L*RATIO-28:h/2+L*RATIO+28)+20;el.style.left=x+'px';el.style.top=y+'px';el.style.setProperty('--l',(L*RATIO*.6+14)+'px');
    el.onclick=()=>{anatSel=n;$('#anatInfo').innerHTML=`<b>${n}</b>${txt}`;drawAnat();if(n==='十三徽'){pluck(3,'fan',6);}else if(n==='七弦'){playSeq([[0,0],[.15,1],[.3,2],[.45,3],[.6,4],[.75,5],[.9,6]]);}};box.appendChild(el);});
  if(sel){const it=PARTS[anatFace].find(p=>p[0]===sel);if(it){const x=cx-it[1]*L;c.strokeStyle='rgba(166,58,43,.9)';c.lineWidth=2;c.setLineDash([4,4]);c.beginPath();c.ellipse(x,h/2,Math.max(16,L*.03),L*RATIO*1.25+10,0,0,6.283);c.stroke();c.setLineDash([]);}}
}
pageInit.know=function(){
  drawAnat();window.addEventListener('resize',()=>{if(inited.know)drawAnat();});
  $$('[data-face]').forEach(b=>b.onclick=()=>{$$('[data-face]').forEach(x=>x.classList.toggle('on',x===b));anatFace=b.dataset.face;anatSel=null;drawAnat();});
  $$('[data-tone]').forEach(b=>b.onclick=()=>{const m=b.dataset.tone;
    if(m==='san')playSeq([[0,0],[.5,2],[1,3],[1.5,4],[2,5],[2.5,6]]);
    if(m==='fan')playSeq([[0,0,'fan',6],[.45,2,'fan',6],[.9,3,'fan',6],[1.35,4,'fan',8],[1.9,5,'fan',3],[2.5,6,'fan',6]]);
    if(m==='an'){const v=pluck(3,'an',9);setTimeout(()=>v&&v.vib(.014,5,1.2),250);setTimeout(()=>{const v2=pluck(4,'an',9);setTimeout(()=>v2&&v2.glide(STR[4]/HUI[7],.35),500);},1800);}});
  // 斫琴
  const Z=[['选材','面板选桐木、杉木等柔软易振的木材，底板选梓木、楸木等较硬的木材；面底皆桐者称“纯阳琴”。古人更重老木：雷击之木、悬钟之木。'],
    ['打木胎','依琴式画样，斫出面板与底板，挖出琴腹，安天柱地柱，合面底为一体。'],['裱布','以生漆调制漆糊，将夏布、麻布通体裱于琴胎，宋代以后多见，可防木胎开裂。'],
    ['上灰胎','用鹿角霜（或八宝灰）以生漆调和，分粗、中、细，反复上灰、打磨，十数遍乃成。'],['髹漆上弦','用精制生漆反复上漆、推光、揩漆，生漆在湿润中氧化“回黑”；最后安岳山、龙龈、雁足、琴轸，上弦定音。']];
  $('#zhuoSteps').innerHTML=Z.map((s,i)=>`<div class="card" style="padding:16px;font-size:13.5px;line-height:1.85;color:var(--ink2)"><div class="kicker" style="font-size:13px">第${'一二三四五'[i]}步</div><b style="font-family:var(--kai);font-weight:400;font-size:20px;color:var(--ink);letter-spacing:3px">${s[0]}</b><p style="margin-top:6px">${s[1]}</p></div>`).join('');
  const {c,w,h}=fitCanvas($('#zhuoCv'),260);const L=h-50;
  for(let i=0;i<5;i++){const x=w*(i+.5)/5;c.save();c.translate(x+L*RATIO*0,24);c.rotate(Math.PI/2);
    if(i===0){c.fillStyle='#c9a676';c.fillRect(0,-L*RATIO*1.15,L,L*RATIO*2.3);c.strokeStyle='rgba(120,80,40,.35)';for(let k=-6;k<=6;k++){c.beginPath();c.moveTo(0,k*L*RATIO/6);c.bezierCurveTo(L*.3,k*L*RATIO/6+3,L*.6,k*L*RATIO/6-3,L,k*L*RATIO/6);c.stroke();}}
    else if(i===1){drawQin(c,'zhongni',{L,ink:'#c9a676',strings:false,hui:false});c.save();c.strokeStyle='rgba(120,80,40,.35)';c.clip(drawQin(c,'zhongni',{L,ink:'#c9a676',strings:false,hui:false}));for(let k=-6;k<=6;k++){c.beginPath();c.moveTo(0,k*4);c.bezierCurveTo(L*.3,k*4+3,L*.6,k*4-3,L,k*4);c.stroke();}c.restore();}
    else if(i===2){const p=drawQin(c,'zhongni',{L,ink:'#d8cbb0',strings:false,hui:false});c.save();c.clip(p);c.strokeStyle='rgba(120,100,70,.25)';for(let k=-L;k<L;k+=4){c.beginPath();c.moveTo(k,-30);c.lineTo(k+30,30);c.stroke();c.beginPath();c.moveTo(k,30);c.lineTo(k+30,-30);c.stroke();}c.restore();}
    else if(i===3){drawQin(c,'zhongni',{L,ink:'#8e8a84',strings:false,hui:false});}
    else drawQin(c,'zhongni',{L,old:.2});
    c.restore();c.fillStyle=COL.ink;c.font='16px "ZCOOL XiaoWei",KaiTi,serif';c.textAlign='center';c.fillText(Z[i][0],x,h-6);
    if(i<4){c.fillStyle=COL.zhu;c.fillText('→',x+w/10,h/2);}}
  // 减字 demo
  drawJianzi($('#jzDemo'),{lf:'大',hui:'七',rf:'勹',str:'五'},true);
};
/* ---- 减字谱：右手指法以笔画绘出，弦序写在其内 ---- */
const RF_STROKES={
 '勹':{s:[[[.40,.02],[.30,.16],[.10,.34]],[[.30,.13],[.62,.13],[.88,.12],[.87,.40],[.86,.70],[.83,.92],[.72,.98],[.60,.88]]],box:[.24,.27,.80,.90]},
 '乚':{s:[[[.20,.02],[.20,.40],[.20,.76],[.30,.88],[.62,.88],[.90,.88],[.95,.70]]],box:[.30,.10,.90,.80]},
 '尸':{s:[[[.22,.06],[.55,.06],[.86,.06],[.86,.30]],[[.22,.30],[.55,.30],[.86,.30]],[[.22,.06],[.22,.55],[.18,.80],[.04,.98]]],box:[.32,.40,.92,.98]},
 '木':{s:[[[.10,.20],[.50,.20],[.90,.20]],[[.50,.00],[.50,.30],[.50,.50]],[[.46,.24],[.30,.40],[.12,.50]],[[.54,.24],[.70,.38],[.88,.48]]],box:[.20,.56,.80,1.0]},
 '乇':{s:[[[.78,.02],[.50,.08],[.24,.12]],[[.10,.26],[.50,.26],[.90,.26]],[[.50,.12],[.50,.30],[.52,.44],[.86,.48]]],box:[.20,.56,.80,1.0]},
 '丁':{s:[[[.10,.10],[.50,.10],[.90,.10]],[[.52,.10],[.52,.32],[.52,.48],[.40,.44]]],box:[.20,.56,.80,1.0]}
};
const JZF=s=>`${s}px "Ma Shan Zheng","KaiTi","STKaiti",serif`;
function jzStroke(c,pts,X,Y,lw){c.beginPath();c.moveTo(X(pts[0][0]),Y(pts[0][1]));
  for(let i=1;i<pts.length-1;i++){const mx=(pts[i][0]+pts[i+1][0])/2,my=(pts[i][1]+pts[i+1][1])/2;c.quadraticCurveTo(X(pts[i][0]),Y(pts[i][1]),X(mx),Y(my));}
  const L=pts[pts.length-1];c.lineTo(X(L[0]),Y(L[1]));c.lineWidth=lw;c.stroke();}
/* g = {lf:'大'|'亻'|'中'|'夕'|'艹', hui:'七'|'十一'..., rf:'勹'|'乚'|'木'|'乇'|'尸'|'丁'|'上'|'下', str:'五'} ; returns layout rects */
function drawJZ(c,cx,cy,S,g,col){col=col||COL.ink;c.save();c.fillStyle=col;c.strokeStyle=col;c.lineCap='round';c.lineJoin='round';c.textAlign='center';c.textBaseline='middle';
  const top=cy-S/2,R={};
  const left=(ch,x,y,sz)=>{if(ch==='亻'){const X=u=>x+(u-.5)*sz,Y=v=>y+(v-.5)*sz;jzStroke(c,[[.62,.06],[.48,.30],[.24,.52]],X,Y,sz*.15);jzStroke(c,[[.46,.36],[.46,.66],[.46,.96]],X,Y,sz*.15);}else{c.font=JZF(sz);c.fillText(ch,x,y);}};
  if(g.lf==='艹'||!g.hui){left(g.lf,cx,top+S*.19,S*.36);R.lf=[cx-S*.2,top,S*.4,S*.38];}
  else{left(g.lf,cx-S*.19,top+S*.19,S*.34);R.lf=[cx-S*.38,top,S*.36,S*.38];
    if(g.hui.length>1){c.font=JZF(S*.2);c.fillText(g.hui[0],cx+S*.19,top+S*.1);c.fillText(g.hui[1],cx+S*.19,top+S*.29);}
    else{c.font=JZF(S*.34);c.fillText(g.hui,cx+S*.19,top+S*.19);}R.hui=[cx+S*.02,top,S*.36,S*.38];}
  const bx=cx-S*.34,by=top+S*.40,bw=S*.68,bh=S*.58,X=u=>bx+u*bw,Y=v=>by+v*bh;R.rf=[bx,by,bw,bh];
  const D=RF_STROKES[g.rf];
  if(D){D.s.forEach(p=>jzStroke(c,p,X,Y,S*.055));const [u0,v0,u1,v1]=D.box;const iw=(u1-u0)*bw,ih=(v1-v0)*bh;
    if(g.str){c.font=JZF(Math.min(iw,ih)*.92);c.fillText(g.str,X((u0+u1)/2),Y((v0+v1)/2)+ih*.04);}R.str=[X(u0),Y(v0),iw,ih];}
  else{c.font=JZF(S*.5);c.fillText(g.rf,cx,by+bh*.5);}
  c.restore();return R;}
function drawJianzi(cv,o,annot){const {c,w,h}=fitCanvas(cv,cv.clientHeight||330);c.clearRect(0,0,w,h);
  const S=Math.min(w*(annot?.5:.9),h*(annot?.78:.9)),cx=w/2,cy=h*(annot?.47:.5);const R=drawJZ(c,cx,cy,S,o);
  if(annot){c.strokeStyle='rgba(166,58,43,.75)';c.fillStyle=COL.zhu;c.font='15px "ZCOOL XiaoWei",KaiTi,serif';c.lineWidth=1;c.setLineDash([4,4]);
    const lab=(rect,side,t)=>{if(!rect)return;const [x,y,ww,hh]=rect;c.strokeRect(x,y,ww,hh);const yy=y+hh/2;const xe=side<0?cx-S*.62:cx+S*.62;c.beginPath();c.moveTo(side<0?x:x+ww,yy);c.lineTo(xe,yy);c.stroke();
      c.textAlign=side<0?'right':'left';c.fillText(t,xe+(side<0?-6:6),yy+5);};
    lab(R.lf,-1,'左手用指');lab(R.hui,1,'徽位');lab(R.rf,1,'右手指法');lab(R.str,-1,'弦序（写在指法之内）');c.setLineDash([]);
    c.fillStyle=COL.ink3;c.textAlign='center';c.font='14px "Noto Serif SC",serif';c.fillText(o.cap||'“大七勾五”：左手大指按七徽，右手中指勾五弦',cx,h-12);}
}
/* ================= STYLES ================= */
let curStyle='fuxi';
function drawVertQin(cv,id,o={}){const {c,w,h}=fitCanvas(cv,cv.clientHeight);c.clearRect(0,0,w,h);const L=Math.min(h-20,(w-10)/(RATIO*2.3));c.save();c.translate(w/2,(h-L)/2);c.rotate(Math.PI/2);drawQin(c,id,Object.assign({L,old:.4},o));c.restore();return {c,w,h,L};}
function selectStyle(id){curStyle=id;const q=QS[id];$$('.sty').forEach(e=>e.classList.toggle('on',e.dataset.id===id));
  $('#sdK').textContent=q.k;$('#sdT').textContent=q.n;$('#sdD').textContent=q.d;
  $('#sdL').innerHTML=`<dt style="color:var(--zhe)">形制特征</dt><dd>${q.f}</dd><dt style="color:var(--zhe)">代表名琴</dt><dd>${q.ex}</dd><dt style="color:var(--zhe)">琴式图见于</dt><dd>${q.src}</dd><dt style="color:var(--zhe)">通常尺寸</dt><dd>通长 120–125 cm · 肩宽约 20 cm · 尾宽 13–15 cm</dd>`;
  $('#mA').textContent=q.n;const sel=$('#mB2');sel.innerHTML=QORDER.filter(k=>k!==id).map(k=>`<option value="${k}">${QS[k].n}</option>`).join('');$('#morph').value=0;drawStyBig();}
function drawStyBig(){const t=$('#morph').value/100,b=$('#mB2').value;const cv=$('#styBig');const {c,w,h}=fitCanvas(cv,560);c.clearRect(0,0,w,h);const L=h-30;
  c.save();c.translate(w/2,15);c.rotate(Math.PI/2);
  if(t>0){drawQin(c,curStyle,{L,lac:false,stroke:'rgba(166,58,43,.5)',strings:false,hui:false,alpha:.6});drawQin(c,b,{L,lac:false,stroke:'rgba(61,95,112,.5)',strings:false,hui:false,alpha:.6});}
  drawQin(c,curStyle,{L,old:.35,mix:t>0?{id:b,t}:null});c.restore();
  c.fillStyle=COL.ink3;c.font='12px "Noto Serif SC",serif';c.textAlign='left';c.fillText('首',w/2+L*RATIO+8,30);c.fillText('尾',w/2+L*RATIO*.75+8,h-20);}
pageInit.styles=function(){const g=$('#styGrid');g.innerHTML=QORDER.map(id=>`<div class="card sty" data-id="${id}"><canvas></canvas><b>${QS[id].n}</b><small>${QS[id].k}</small></div>`).join('');
  $$('.sty',g).forEach(el=>{drawVertQin($('canvas',el),el.dataset.id);el.onclick=()=>{selectStyle(el.dataset.id);playSeq(MOTIFS[el.dataset.id]);$('#styDetail').scrollIntoView({behavior:'smooth',block:'center'});};});
  $('#morph').oninput=drawStyBig;$('#mB2').onchange=drawStyBig;$('#styPlay').onclick=()=>playSeq(MOTIFS[curStyle]);selectStyle(curStyle);
};
/* ================= HISTORY ================= */
const ERAS=[
 ['上古','传说时代','伏',['伏羲“削桐为琴，绳丝为弦”','神农氏“上观法于天，下取法于地”，始削桐为琴','相传琴初为五弦，象五行；文王、武王各加一弦，成七弦']],
 ['先秦','约前11世纪—前221年','周',['《诗经》中琴瑟并称：“窈窕淑女，琴瑟友之”','“士无故不彻琴瑟”，琴入礼乐教化','伯牙鼓琴、子期知音，“高山流水”典故','孔子学琴于师襄，相传作《猗兰操》','曾侯乙墓出土十弦琴（约前433年）；郭店楚墓出土七弦琴']],
 ['两汉','前202年—220年','汉',['马王堆三号汉墓出土七弦琴（前168年）','司马相如以“绿绮”奏《凤求凰》','桓谭《琴道》：“八音之中，惟弦为最，而琴为之首”','蔡邕著《琴操》，并斫“焦尾”','士大夫与琴结成稳固关系，琴成为众乐之首']],
 ['魏晋南北朝','220年—589年','晋',['嵇康《琴赋》：“众器之中，琴德最优”','嵇康临刑弹《广陵散》，“广陵散于今绝矣”','阮籍、戴逵等名士以琴寄情；南朝砖画《竹林七贤与荣启期》','琴的形制基本定型，琴学思想儒道双柱确立','琴与歌分道扬镳，纯器乐琴曲出现']],
 ['隋唐','581年—907年','唐',['赵耶利“削俗归雅”，整理琴曲，著《弹琴右手法》','薛易简《琴诀》论琴“可以观风教，可以摄心魄”','白居易：“丝桐合为琴，中有太古声”','蜀中雷氏斫琴，“九霄环佩”“大圣遗音”传世','唐人写本《碣石调·幽兰》为现存唯一文字谱；减字谱渐兴']],
 ['两宋','960年—1279年','宋',['宋徽宗设“万琴堂”，传《听琴图》','朱长文著《琴史》，为第一部琴人传记专书','郭楚望作《潇湘水云》，开浙派','琴人以地域分“京师、两浙、江西”诸派']],
 ['元明','1271年—1644年','明',['朱权编《神奇秘谱》（1425），现存最早古琴曲谱集','严澂开虞山派，主“清微淡远”','徐上瀛《溪山琴况》立“和静清远”等二十四况','琴谱刊刻大兴，琴式图录日益丰富']],
 ['清','1644年—1911年','清',['徐常遇《澄鉴堂琴谱》，开广陵派','徐祺、徐俊《五知斋琴谱》流传极广','张孔山传七十二滚拂《流水》，载《天闻阁琴谱》','诸城、岭南、闽、蜀诸派并起']],
 ['近现代','1912年至今','今',['1936年今虞琴社于苏州成立','1956年查阜西主持全国古琴采访，录音保存大量琴曲','1977年管平湖演奏的《流水》随“旅行者号”金唱片飞向太空','2003年古琴艺术入选联合国“人类口头和非物质遗产代表作”']]
];
const FAMOUS=[['号钟','zhongni','先秦 · 齐桓公','传其声如钟鸣之洪亮，位列“四大名琴”之首。',0],['绕梁','fuxi','先秦 · 楚庄王','“余音绕梁，三日不绝”，传楚庄王得之，爱不释手。',0],
 ['绿绮','lingji','西汉 · 司马相如','司马相如以此琴奏《凤求凰》，后世以“绿绮”代指名琴。',0],['焦尾','zhongni','东汉 · 蔡邕','蔡邕闻灶下桐木爆裂之声，知是良材，抢出斫琴，琴尾犹焦。',1],
 ['九霄环佩','fuxi','唐 · 伏羲式','故宫博物院藏，被公认为唐琴代表，琴背刻“九霄环佩”篆书。',0],['大圣遗音','shennong','唐 · 神农式','故宫博物院藏，至德元载（756）制，栗壳色漆，通体小蛇腹断。',0],
 ['飞泉','lianzhu','唐 · 连珠式','故宫博物院藏，项、腰各作连珠三弧，唐琴中形制最灵动者。',0],['松石间意','zhongni','宋 · 仲尼式','宋琴，琴背刻满历代名家题跋，2010年以1.37亿元成交。',0]];
pageInit.history=function(){
  $('#tlIn').innerHTML=ERAS.map(([n,y,ch,items])=>`<div class="era"><div class="yr">${y}</div><h4>${n}</h4><div class="dot"></div><div class="card"><canvas data-ch="${ch}"></canvas><ul>${items.map(i=>`<li>${i}</li>`).join('')}</ul></div></div>`).join('');
  $$('#tlIn canvas').forEach((cv,i)=>{const {c,w,h}=fitCanvas(cv,110);const r=rng(i+5);
    const g=c.createLinearGradient(0,0,w,0);g.addColorStop(0,'rgba(61,95,112,.0)');g.addColorStop(.5,'rgba(61,95,112,.18)');g.addColorStop(1,'rgba(61,95,112,0)');
    c.fillStyle=g;c.beginPath();c.moveTo(0,h);for(let x=0;x<=w;x+=4)c.lineTo(x,h-30-30*Math.exp(-Math.pow((x-w*(.3+r()*.01))/60,2))-fbm(noise1(i+1),x/40)*30);c.lineTo(w,h);c.fill();
    c.font='76px "Ma Shan Zheng",KaiTi,serif';c.fillStyle='rgba(42,35,29,.82)';c.textAlign='center';c.textBaseline='middle';c.fillText(cv.dataset.ch,w*.32,h/2+4);
    c.save();c.translate(w*.62,h*.5);c.rotate(-.12);drawQin(c,QORDER[i%QORDER.length],{L:w*.36,old:.4});c.restore();
    c.fillStyle=COL.zhu;c.fillRect(w-26,8,16,16);});
  const tl=$('#tl');let d=null;tl.onpointerdown=e=>{d={x:e.clientX,s:tl.scrollLeft};tl.setPointerCapture(e.pointerId);};tl.onpointermove=e=>{if(d)tl.scrollLeft=d.s-(e.clientX-d.x);};tl.onpointerup=()=>d=null;
  tl.addEventListener('wheel',e=>{if(Math.abs(e.deltaY)>Math.abs(e.deltaX)){tl.scrollLeft+=e.deltaY;e.preventDefault();}},{passive:false});
  $('#mq').innerHTML=FAMOUS.map(f=>`<div class="card"><canvas></canvas><b>${f[0]}</b><div class="kicker" style="font-size:12px;letter-spacing:2px">${f[2]}</div><p>${f[3]}</p></div>`).join('');
  $$('#mq .card').forEach((el,i)=>{const f=FAMOUS[i];const {c,w,h,L}=drawVertQin($('canvas',el),f[1],{old:.6});
    if(f[4]){c.fillStyle='rgba(120,60,20,.75)';c.beginPath();c.ellipse(w/2,(h-L)/2+L*.97,L*RATIO*.8,L*.03,0,0,6.283);c.fill();}
    c.fillStyle='rgba(166,58,43,.85)';c.fillRect(w/2+L*RATIO+6,(h-L)/2+L*.4,14,14);el.onclick=()=>playSeq(MOTIFS[f[1]]);});
};
/* ================= SCHOOLS ================= */
const SCHOOLS=[['浙派','南宋 · 杭州','郭楚望（郭沔）作《潇湘水云》，弟子刘志方、再传徐天民，“徐门正传”盛行宋元明三代，影响极为深远。','浙'],
 ['虞山派','明 · 常熟','严澂（天池）开派，著《松弦馆琴谱》，力矫时弊，主张“清微淡远”，琴风中正平和，被誉为“琴川派”。','虞'],
 ['广陵派','清 · 扬州','徐常遇《澄鉴堂琴谱》开其先，徐祺、徐俊《五知斋琴谱》集其成。由虞山派演化而来，以细致委婉取胜，节奏自由，跌宕多变。','广'],
 ['蜀派','清 · 四川（泛川派）','张孔山传七十二滚拂《流水》，载于《天闻阁琴谱》（1876）。琴风“峻急”，气势磅礴，近现代以查阜西、喻绍泽等为代表。','蜀'],
 ['诸城派','清末 · 山东诸城','王溥长、王冷泉两支并立，琴风清和恬淡，曲谱多带歌词。王燕卿后南下传艺，开出梅庵一脉。','诸'],
 ['梅庵派','民国 · 南京','王燕卿在东南大学梅庵授琴，弟子徐立孙辑《梅庵琴谱》。琴风流畅如歌，《平沙落雁》《关山月》传唱极广。','梅'],
 ['岭南派','清 · 广东','黄景星辑《悟雪山房琴谱》，琴风刚健爽朗，近现代杨新伦等传其衣钵。','岭'],
 ['闽派','清 · 福建','祝凤喈（桐君）著《与古斋琴谱》（1855），于琴学、制琴、律学皆有详论。','闽'],
 ['九嶷派','清末民国 · 北京','杨宗稷（时百）著《琴学丛书》，打谱严谨，重视古谱与指法考订；管平湖、李浴星等皆出其门。','嶷']];
const PEOPLE=[['杨宗稷','1863–1931','九嶷派','九嶷派开创者，编《琴学丛书》四十三卷，于琴史、琴律、琴谱考订用力至深。'],
 ['王燕卿','1867–1921','诸城→梅庵','携诸城琴学南下，在南京东南大学梅庵授琴，梅庵派由此而兴。'],
 ['管平湖','1897–1967','九嶷派 · 兼通诸家','打谱《广陵散》《幽兰》等数十曲；所弹《流水》1977年随旅行者号金唱片飞向太空。'],
 ['查阜西','1895–1976','泛川派','1956年主持全国古琴采访，编《存见古琴曲谱辑览》《琴曲集成》，奠定当代琴学基础。'],
 ['张子谦','1899–1991','广陵派','今虞琴社创始人之一，以《龙翔操》著称，人称“张龙翔”。'],
 ['溥雪斋','1893–1966','北京古琴研究会','清宗室，书画琴三绝，曾任北京古琴研究会会长。'],
 ['徐立孙','1897–1969','梅庵派','王燕卿弟子，辑《梅庵琴谱》，使梅庵琴学广传海内外。'],
 ['吴景略','1907–1987','虞山吴派','琴风细腻深沉，《潇湘水云》《渔樵问答》等为其代表，长期执教于中央音乐学院。'],
 ['刘少椿','1901–1971','广陵派','广陵派重要传人，琴风古朴苍劲，留有《樵歌》《山居吟》等录音。'],
 ['吴兆基','1908–1997','吴门琴派','苏州吴门琴社的核心人物，琴风清微淡远，兼通太极拳理。'],
 ['李祥霆','1940–','吴景略弟子','以即兴演奏闻名，曾任教于中央音乐学院，推动古琴走向世界。'],
 ['成公亮','1940–2015','广陵派','打谱《文王操》《袍修罗兰》等，以深沉内省的琴风与创作著称。']];
pageInit.schools=function(){
  $('#schoolCards').innerHTML=SCHOOLS.map(s=>`<div class="card sch"><div class="wm">${s[3]}</div><h4>${s[0]}</h4><div class="meta">${s[1]}</div><p>${s[2]}</p></div>`).join('');
  $('#people').innerHTML=PEOPLE.map(p=>`<div class="card ppl"><b>${p[0]}</b><i>${p[1]}</i><br><span class="sc">${p[2]}</span><p>${p[3]}</p></div>`).join('');
  drawTree();window.addEventListener('resize',()=>{if(inited.schools)drawTree();});
};
function drawTree(){const cv=$('#tree');const {c,w,h}=fitCanvas(cv,440);c.clearRect(0,0,w,h);
  const cols=['宋','元明','清','民国','当代'];const cx=i=>w*(.1+i*.2);
  cols.forEach((t,i)=>{c.fillStyle='rgba(141,91,59,.07)';c.fillRect(cx(i)-w*.09,10,w*.18,h-20);c.fillStyle=COL.zhe;c.font='16px "ZCOOL XiaoWei",KaiTi,serif';c.textAlign='center';c.fillText(t,cx(i),34);});
  const N={zhe:[0,.22,'浙派'],xu:[1,.18,'徐门正传'],yu:[1,.42,'虞山派'],guang:[2,.28,'广陵派'],shu:[2,.52,'蜀派'],zhu:[2,.70,'诸城派'],ling:[2,.86,'岭南派'],min:[2,.12,'闽派'],
    mei:[3,.70,'梅庵派'],jy:[3,.86,'九嶷派'],jinyu:[3,.36,'今虞琴社'],fc:[4,.52,'泛川·查阜西'],gph:[4,.86,'管平湖'],gl2:[4,.24,'广陵·张子谦'],wu:[4,.40,'虞山吴派·吴景略'],cons:[4,.68,'梅庵·徐立孙']};
  const P=k=>[cx(N[k][0]),60+N[k][1]*(h-90)];
  const E=[['zhe','xu'],['xu','yu'],['yu','guang'],['yu','jinyu'],['guang','jinyu'],['shu','fc'],['zhu','mei'],['mei','cons'],['jy','gph'],['jinyu','gl2'],['jinyu','wu'],['shu','jinyu']];
  c.lineCap='round';E.forEach(([a,b])=>{const [x1,y1]=P(a),[x2,y2]=P(b);c.strokeStyle='rgba(42,35,29,.45)';c.lineWidth=1.6;c.beginPath();c.moveTo(x1+30,y1);c.bezierCurveTo((x1+x2)/2,y1,(x1+x2)/2,y2,x2-30,y2);c.stroke();});
  Object.keys(N).forEach(k=>{const [x,y]=P(k);const t=N[k][2];c.font='15px "ZCOOL XiaoWei",KaiTi,serif';const tw=c.measureText(t).width+20;c.fillStyle='#f5ecd9';c.strokeStyle=k.length<4&&!['gph','wu','fc','gl2','cons'].includes(k)?COL.zhu:COL.ink3;c.lineWidth=1.2;
    c.beginPath();c.rect(x-tw/2,y-14,tw,28);c.fill();c.stroke();c.fillStyle=COL.ink;c.textAlign='center';c.textBaseline='middle';c.fillText(t,x,y+1);c.textBaseline='alphabetic';});
}
