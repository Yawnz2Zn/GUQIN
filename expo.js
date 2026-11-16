/* ================= FILM ENGINE ================= */
const FILMS=[];
const ease=p=>p<.5?2*p*p:1-Math.pow(-2*p+2,2)/2;
function Film(el,{scenes,title='',loop=false,small=false}){
  el.classList.add('film','paused');if(small)el.classList.add('small');
  el.innerHTML=`<canvas></canvas><div class="ttl">${title}</div><div class="sub"></div><div class="bigplay"><span>▶</span></div>
   <div class="bar"><button class="pp">▶</button><div class="prog"><i></i></div><span class="tm">0:00</span><button class="vo" title="讲解声">🔈</button></div>`;
  const cv=$('canvas',el),sub=$('.sub',el),pr=$('.prog i',el),tm=$('.tm',el);
  const total=scenes.reduce((a,s)=>a+s.d,0);
  const F={el,cv,scenes,total,t:0,playing:false,last:0,cur:-1,voice:false,loop,visible:true};
  const fmt=s=>`${Math.floor(s/60)}:${String(Math.floor(s%60)).padStart(2,'0')}`;
  F.play=()=>{F.playing=true;el.classList.remove('paused');$('.pp',el).textContent='❚❚';F.last=performance.now();};
  F.pause=()=>{F.playing=false;el.classList.add('paused');$('.pp',el).textContent='▶';if(F.voice)stopSpeak();};
  F.seek=t=>{F.t=clamp(t,0,total-.01);F.cur=-1;};
  $('.pp',el).onclick=e=>{e.stopPropagation();F.playing?F.pause():F.play();};
  $('.bigplay',el).onclick=()=>{ac();F.play();};
  cv.onclick=()=>{F.playing?F.pause():F.play();};
  $('.prog',el).onclick=e=>{const r=e.currentTarget.getBoundingClientRect();F.seek((e.clientX-r.left)/r.width*total);};
  $('.vo',el).onclick=e=>{e.stopPropagation();F.voice=!F.voice;e.currentTarget.textContent=F.voice?'🔊':'🔈';ac();if(F.voice){F.cur=-1;}else{stopSpeak();}};
  F.frame=now=>{if(F.playing){F.t+=(now-F.last)/1000;F.last=now;if(F.t>=total){if(F.loop){F.t=0;F.cur=-1;}else{F.t=total-.01;F.pause();}}}
    let acc=0,k=0;while(k<scenes.length-1&&F.t>=acc+scenes[k].d){acc+=scenes[k].d;k++;}
    const s=scenes[k],p=clamp((F.t-acc)/s.d,0,1);
    if(k!==F.cur){F.cur=k;sub.textContent=s.sub||'';if(F.playing){if(s.cue&&AC.on)s.cue();if(F.voice&&s.sub)speak(s.sub);}}
    const dpr=Math.min(devicePixelRatio||1,2),w=cv.clientWidth,h=cv.clientHeight;if(!w)return;if(cv.width!==Math.round(w*dpr)){cv.width=Math.round(w*dpr);cv.height=Math.round(h*dpr);}
    const c=cv.getContext('2d');c.setTransform(dpr,0,0,dpr,0,0);c.save();s.draw(c,w,h,p,F.t);c.restore();
    // fade between scenes
    const edge=Math.min(p*s.d,(1-p)*s.d);if(edge<.35){c.fillStyle=`rgba(14,11,9,${1-edge/.35})`;c.fillRect(0,0,w,h);}
    pr.style.width=(F.t/total*100)+'%';tm.textContent=fmt(F.t)+' / '+fmt(total);};
  if('IntersectionObserver' in window){new IntersectionObserver(es=>{F.visible=es[0].isIntersecting;if(!F.visible&&F.playing&&!F.loop)F.pause();}).observe(el);}
  FILMS.push(F);return F;
}
(function filmLoop(now){requestAnimationFrame(filmLoop);FILMS.forEach(F=>{if(F.visible&&F.el.isConnected&&F.el.offsetParent!==null)F.frame(now);});})(0);

/* ================= film drawers ================= */
function fbg(c,w,h,t){const g=c.createLinearGradient(0,0,0,h);g.addColorStop(0,'#1d1712');g.addColorStop(1,'#0d0a08');c.fillStyle=g;c.fillRect(0,0,w,h);
  const n=noise1(9);c.fillStyle='rgba(239,228,203,.035)';c.beginPath();c.moveTo(0,h);for(let x=0;x<=w;x+=6)c.lineTo(x,h*.72-fbm(n,x/w*4+t*.02)*h*.35);c.lineTo(w,h);c.fill();
  c.fillStyle='rgba(239,228,203,.25)';for(let i=0;i<40;i++){const x=((i*97.3+t*8*(1+i%3))%w+w)%w,y=((i*53.1-t*4*(1+i%2))%h+h)%h;c.globalAlpha=.15+.15*Math.sin(t+i);c.fillRect(x,y,1.3,1.3);}c.globalAlpha=1;}
function ftx(c,txt,x,y,sz,a=1,font='brush',col='#efe4cb',al='center'){c.globalAlpha=clamp(a,0,1);c.fillStyle=col;c.textAlign=al;c.textBaseline='middle';
  c.font=`${sz}px ${font==='brush'?'"Ma Shan Zheng",KaiTi,serif':font==='kai'?'"ZCOOL XiaoWei",KaiTi,serif':'"Noto Serif SC",serif'}`;c.fillText(txt,x,y);c.globalAlpha=1;}
function fvtx(c,txt,x,y,sz,a,col){[...txt].forEach((ch,i)=>ftx(c,ch,x,y+i*sz*1.08,sz,a,'brush',col));}
function qinH(c,id,cx,cy,L,o={}){c.save();c.translate(cx+L/2,cy);c.rotate(Math.PI);const p=drawQin(c,id,Object.assign({L},o));c.restore();return p;}
function qinV(c,id,cx,top,L,o={}){c.save();c.translate(cx,top);c.rotate(Math.PI/2);drawQin(c,id,Object.assign({L},o));c.restore();}
const MONTH=['正月','二月','三月','四月','五月','六月','七月','八月','九月','十月','冬月','腊月','闰月'];
function huiX(cx,L,i){return cx+L/2-(.045+HUI[i]*.93)*L;}
const DR={
 title:(text,sub)=>(c,w,h,p,t)=>{fbg(c,w,h,t);const a=ease(clamp(p*2,0,1));fvtx(c,text,w/2,h*.5-text.length*h*.06,h*.12,a,'#efe4cb');
   c.fillStyle=`rgba(166,58,43,${a})`;c.fillRect(w/2+h*.09,h*.5+text.length*h*.04,h*.06,h*.06);if(sub)ftx(c,sub,w/2,h*.88,h*.035,a,'kai','#c9b896');},
 s_reveal:(c,w,h,p,t)=>{fbg(c,w,h,t);const L=w*.8;c.save();c.beginPath();c.rect(w*.1+(1-ease(p))*L,0,w,h);c.clip();qinH(c,'zhongni',w/2,h*.55,L,{old:.3});c.restore();
   ftx(c,'三尺六寸六分',w/2,h*.2,h*.08,p*2-.4);ftx(c,'象 一 年 三 百 六 十 六 日',w/2,h*.3,h*.032,p*2-.8,'kai','#c9b896');},
 s_side:(c,w,h,p,t)=>{fbg(c,w,h,t);const L=w*.8,x0=w*.1,y=h*.58;c.beginPath();c.moveTo(x0,y);for(let i=0;i<=100;i++){const u=i/100;c.lineTo(x0+u*L,y-h*.12*Math.sin(Math.PI*u)*ease(clamp(p*1.6,0,1)));}c.lineTo(x0+L,y+h*.05);c.lineTo(x0,y+h*.05);c.closePath();
   const g=c.createLinearGradient(0,y-h*.12,0,y+h*.05);g.addColorStop(0,'#3a2619');g.addColorStop(1,'#120c09');c.fillStyle=g;c.fill();
   c.strokeStyle=`rgba(201,168,90,${clamp(p*2-.4,0,1)})`;c.setLineDash([5,6]);c.beginPath();c.arc(w/2,y+L*.9,L*1.0,Math.PI*1.32,Math.PI*1.68);c.stroke();c.setLineDash([]);
   ftx(c,'天',w/2,h*.24,h*.12,p*2.2-.5);ftx(c,'地',w/2,h*.82,h*.12,p*2.2-1.1);c.strokeStyle=`rgba(201,168,90,${clamp(p*2-1,0,1)})`;c.beginPath();c.moveTo(x0,y+h*.08);c.lineTo(x0+L,y+h*.08);c.stroke();},
 s_hui:(c,w,h,p,t)=>{fbg(c,w,h,t);const L=w*.82;qinH(c,'zhongni',w/2,h*.6,L,{old:.2});const n=Math.floor(p*15);
   for(let i=0;i<13;i++){if(i>=n)continue;const x=huiX(w/2,L,i),y=h*.6-L*RATIO*.82*QS.zhongni.hw(.045+HUI[i]*.93)*1;const gl=c.createRadialGradient(x,y,0,x,y,22);gl.addColorStop(0,'rgba(255,230,170,.9)');gl.addColorStop(1,'rgba(255,230,170,0)');c.fillStyle=gl;c.fillRect(x-22,y-22,44,44);
     ftx(c,MONTH[12-i],x,h*.3-(i%2)*h*.06,h*.03,1,'kai','#e8d9b8');c.strokeStyle='rgba(232,217,184,.3)';c.beginPath();c.moveTo(x,h*.33-(i%2)*h*.06);c.lineTo(x,y-8);c.stroke();}
   ftx(c,'十三徽',w/2,h*.12,h*.07,p*3);},
 s_three:(c,w,h,p,t)=>{fbg(c,w,h,t);['天','地','人'].forEach((ch,i)=>{const x=w*(.22+i*.28),y=h*.48,a=clamp(p*3-i*.6,0,1);
   for(let k=0;k<4;k++){const r=((t*30+k*30)%120);c.strokeStyle=`rgba(${i===0?'201,190,150':i===1?'166,120,80':'166,58,43'},${a*(1-r/120)*.8})`;c.lineWidth=1.4;c.beginPath();c.arc(x,y,20+r,0,6.283);c.stroke();}
   ftx(c,ch,x,y,h*.13,a);ftx(c,['泛音','散音','按音'][i],x,y+h*.2,h*.035,a,'kai','#c9b896');});},
 f_morph:(c,w,h,p,t)=>{fbg(c,w,h,t);const k=t*.55,i=Math.floor(k)%10,f=ease(k-Math.floor(k));const a=QORDER[i],b=QORDER[(i+1)%10];const L=w*.78;
   for(let j=1;j<5;j++){c.save();c.globalAlpha=.12/j;qinH(c,QORDER[(i+10-j)%10],w/2,h*.55,L,{lac:false,stroke:'#c9a85a',strings:false,hui:false});c.restore();}
   qinH(c,a,w/2,h*.55,L,{lac:false,stroke:'#e8cf8e',strings:false,hui:false,mix:{id:b,t:f}});ftx(c,f<.5?QS[a].n:QS[b].n,w/2,h*.2,h*.07,1-Math.abs(f-.5)*0+.9);},
 f_notch:(c,w,h,p,t)=>{fbg(c,w,h,t);const ids=['zhongni','fuxi','lianzhu','luoxia'],lab=['方折','半月','连珠','波浪'];ids.forEach((id,i)=>{const cx=w*(.14+i*.24),a=clamp(p*3-i*.4,0,1);c.save();c.globalAlpha=a;c.beginPath();c.rect(cx-w*.1,h*.15,w*.2,h*.62);c.clip();
   c.translate(cx,h*.15-h*.9*(id==='luoxia'?.35:.08));c.rotate(Math.PI/2);drawQin(c,id,{L:h*2.6,old:.2,strings:false});c.restore();ftx(c,lab[i],cx,h*.85,h*.05,a,'kai');});},
 f_leaf:(c,w,h,p,t)=>{fbg(c,w,h,t);const L=w*.78,e=ease(p);qinH(c,'jiaoye',w/2,h*.55,L,{old:.2,alpha:1-e*.6});c.save();c.globalAlpha=e;qinH(c,'jiaoye',w/2,h*.55,L,{ink:'rgba(110,145,95,.85)',strings:false,hui:false});
   c.strokeStyle='rgba(230,240,200,.6)';c.lineWidth=1.2;c.beginPath();c.moveTo(w/2-L/2,h*.55);c.lineTo(w/2+L/2,h*.55);c.stroke();for(let k=1;k<26;k++){const x=w/2+L/2-k/26*L*.94;const hw=QS.jiaoye.hw(k/26*.94)*L*RATIO*.95;c.beginPath();c.moveTo(x,h*.55);c.lineTo(x-14,h*.55-hw);c.moveTo(x,h*.55);c.lineTo(x-14,h*.55+hw);c.stroke();}c.restore();
   ftx(c,'蕉叶式',w/2,h*.2,h*.07,p*3);},
 f_grid:(c,w,h,p,t)=>{fbg(c,w,h,t);QORDER.forEach((id,i)=>{const cx=w*(.07+i*.095),a=clamp(p*4-i*.25,0,1);c.save();c.globalAlpha=a;qinV(c,id,cx,h*.1,h*.68,{old:.3,strings:false});c.restore();fvtx(c,QS[id].n.slice(0,2),cx,h*.84,h*.032,a,'#d9c9a6');});},
 h_wave:(n)=>(c,w,h,p,t)=>{fbg(c,w,h,t);const x0=w*.08,x1=w*.92,y=h*.5,A=h*.12*Math.exp(-p*1.2);c.strokeStyle='#e8cf8e';c.lineWidth=2;c.beginPath();
   for(let i=0;i<=300;i++){const u=i/300;const yy=y+A*Math.sin(n*Math.PI*u)*Math.sin(t*14)+A*.25*Math.sin(Math.PI*u)*Math.sin(t*7)*(1-p);i?c.lineTo(lerp(x0,x1,u),yy):c.moveTo(x0,yy);}c.stroke();
   for(let k=1;k<n;k++){const x=lerp(x0,x1,k/n);c.fillStyle='#a63a2b';c.beginPath();c.arc(x,y,6,0,6.283);c.fill();ftx(c,`${k}/${n}`,x,y+h*.12,h*.045,1,'kai','#efe4cb');}
   c.fillStyle='#efe4cb';c.fillRect(x0-4,y-14,4,28);c.fillRect(x1,y-14,4,28);ftx(c,n===2?'七徽 · 二分之一':'九徽 · 五徽 · 三分之一',w/2,h*.2,h*.05,p*3,'kai');},
 h_frac:(c,w,h,p,t)=>{fbg(c,w,h,t);const x0=w*.08,x1=w*.92,y=h*.5;c.strokeStyle='#e8cf8e';c.lineWidth=1.6;c.beginPath();c.moveTo(x0,y);c.lineTo(x1,y);c.stroke();
   const fr=['1/8','1/6','1/5','1/4','1/3','2/5','1/2','3/5','2/3','3/4','4/5','5/6','7/8'];for(let i=0;i<13;i++){const a=clamp(p*4-i*.22,0,1);const x=lerp(x1,x0,HUI[i]);c.globalAlpha=a;c.fillStyle='#efe7d6';c.beginPath();c.arc(x,y,i===6?7:5,0,6.283);c.fill();c.globalAlpha=1;
     ftx(c,HUINAME[i],x,y-h*.1-(i%2)*h*.06,h*.032,a,'kai','#e8d9b8');ftx(c,fr[i],x,y+h*.1+(i%2)*h*.06,h*.03,a,'serif','#c9b896');}},
 j_text:(c,w,h,p,t)=>{fbg(c,w,h,t);const lines=['大指当九徽按商','食指中指双牵宫商','中指急下与构俱下','大指不动又下十徽','食指挑商又半扶宫商','起无名打商作两段','大指起无名不动','又作两段大指当八徽','掐羽起无名当十徽'];
   lines.forEach((l,i)=>{const x=w*.82-i*w*.075,a=.25+.5*clamp(p*3-i*.2,0,1);[...l].forEach((ch,j)=>ftx(c,ch,x,h*.1+j*h*.085-p*h*.15,h*.055,a,'kai','#d9c9a6'));});},
 j_compose:(c,w,h,p,t)=>{fbg(c,w,h,t);const e=ease(clamp(p*1.4,0,1));const S=h*.62,cx=w/2,cy=h*.52;
   const W=['大','七','勾','五'],k=clamp(e/.55,0,1);if(e<.55){W.forEach((ch,i)=>{const x=lerp(w*(.2+i*.2),cx+[-.19,.19,0,.02][i]*S,k),y=lerp(h*.5,cy+[-.31,-.31,.12,.2][i]*S,k);ftx(c,ch,x,y,lerp(h*.16,S*.3,k),1-k,'brush');});}
   if(e>.5){c.globalAlpha=clamp((e-.5)/.35,0,1);drawJZ(c,cx,cy,S,{lf:'大',hui:'七',rf:'勹',str:'五'},'#efe4cb');c.globalAlpha=1;}},
 j_column:(c,w,h,p,t)=>{fbg(c,w,h,t);const G=[{lf:'大',hui:'七',rf:'勹',str:'五'},{lf:'艹',hui:'',rf:'乚',str:'七'},{lf:'亻',hui:'九',rf:'木',str:'四'},{lf:'中',hui:'十',rf:'勹',str:'三'},{lf:'夕',hui:'九',rf:'乚',str:'六'}];
   G.forEach((g,i)=>{c.globalAlpha=clamp(p*4-i*.4,0,1);drawJZ(c,w*(.8-i*.15),h*.45,h*.3,g,'#efe4cb');});c.globalAlpha=1;},
 l_ripple:(c,w,h,p,t)=>{fbg(c,w,h,t);for(let i=0;i<9;i++){const x=w*(.15+((i*.37)%1)*.7),y=h*(.3+((i*.61)%1)*.45),ph=(t*.6+i*.37)%1;for(let k=0;k<3;k++){const r=(ph+k*.18)%1;c.strokeStyle=`rgba(232,207,142,${(1-r)*.55})`;c.lineWidth=1.2;c.beginPath();c.ellipse(x,y,r*w*.12,r*w*.035,0,0,6.283);c.stroke();}}},
 l_flow:(c,w,h,p,t)=>{fbg(c,w,h,t);for(let s=0;s<7;s++){const y=h*(.25+s*.085);c.strokeStyle=`rgba(232,217,184,${.35+s*.05})`;c.lineWidth=1.1+s*.12;c.beginPath();for(let i=0;i<=200;i++){const u=i/200,x=u*w;const bump=Math.exp(-Math.pow((u-((t*.35+s*.11)%1.3-.15))*9,2));c.lineTo(x,y+Math.sin(u*30+t*6)*bump*h*.03);}c.stroke();}},
 l_record:(c,w,h,p,t)=>{c.fillStyle='#07060a';c.fillRect(0,0,w,h);for(let i=0;i<160;i++){const x=(i*137.5%1)*w,y=(i*.618*997%1)*h;c.fillStyle=`rgba(255,255,255,${.2+.5*Math.abs(Math.sin(t+i))})`;c.fillRect((x+t*3)%w,y,1.4,1.4);}
   const R=h*.3;c.save();c.translate(w/2,h/2);c.rotate(t*.15);const g=c.createRadialGradient(0,0,R*.1,0,0,R);g.addColorStop(0,'#c9a85a');g.addColorStop(1,'#7a6230');c.fillStyle=g;c.beginPath();c.arc(0,0,R,0,6.283);c.fill();
   c.strokeStyle='rgba(60,40,10,.35)';for(let r=R*.3;r<R;r+=3){c.beginPath();c.arc(0,0,r,0,6.283);c.stroke();}c.restore();qinH(c,'zhongni',w/2,h/2,R*1.4,{old:.2});ftx(c,'1977 · 流水',w/2,h*.88,h*.045,p*3,'kai');},
 z_wood:(c,w,h,p,t)=>{fbg(c,w,h,t);const L=w*.78,x=w*.11,y=h*.45,H=L*RATIO*2.4;c.fillStyle='#b48a5a';c.fillRect(x,y-H/2,L,H);c.strokeStyle='rgba(90,55,25,.4)';for(let k=0;k<14;k++){const yy=y-H/2+k*H/14;c.beginPath();c.moveTo(x,yy);c.bezierCurveTo(x+L*.3,yy+5*Math.sin(k),x+L*.6,yy-5,x+L,yy+3);c.stroke();}
   if(p>.35&&p<.5){c.fillStyle=`rgba(255,255,240,${1-(p-.35)/.15})`;c.fillRect(0,0,w,h);c.strokeStyle='#fff';c.lineWidth=3;c.beginPath();c.moveTo(w*.6,0);c.lineTo(w*.55,h*.2);c.lineTo(w*.62,h*.25);c.lineTo(w*.52,y);c.stroke();}
   ftx(c,'雷击之木',w/2,h*.78,h*.06,p*2-.8);},
 z_carve:(c,w,h,p,t)=>{fbg(c,w,h,t);const L=w*.78,e=ease(p);const x=w*.11,y=h*.5,H=L*RATIO*2.4;c.globalAlpha=1-e;c.fillStyle='#b48a5a';c.fillRect(x,y-H/2,L,H);c.globalAlpha=1;qinH(c,'zhongni',w/2,y,L,{ink:'#c39a68',strings:false,hui:false,alpha:e});
   for(let i=0;i<30;i++){const px=w*(.2+((i*.31)%1)*.6),py=y-H+((t*60+i*20)%(H*2));c.fillStyle=`rgba(200,160,110,${.6*(1-e)})`;c.fillRect(px,py,4,2);}},
 z_layers:(c,w,h,p,t)=>{fbg(c,w,h,t);const L=w*.78,st=Math.min(3,Math.floor(p*4)),cols=['#c39a68','#cbbd9e','#8e8a84',null],labs=['木胎','裱布','灰胎','髹漆'];
   if(cols[st])qinH(c,'zhongni',w/2,h*.5,L,{ink:cols[st],strings:false,hui:false});else qinH(c,'zhongni',w/2,h*.5,L,{old:0});labs.forEach((l,i)=>ftx(c,l,w*(.2+i*.2),h*.82,h*.045,i<=st?1:.25,'kai'));},
 z_crack:(c,w,h,p,t)=>{fbg(c,w,h,t);const L=w*.8;qinH(c,'zhongni',w/2,h*.48,L,{old:clamp(p*1.1,0,1)});const nm=['流水断','牛毛断','蛇腹断','冰纹断','梅花断'];ftx(c,nm[Math.min(4,Math.floor(p*5))],w/2,h*.2,h*.07,1);ftx(c,`${Math.round(100+p*900)} 年`,w/2,h*.8,h*.04,1,'kai','#c9b896');}
};
/* ================= exhibits ================= */
const WORKS=[
 {id:'sancai',no:'作品一',t:'一器三才',med:'交互影像 · 三维结构拆解 · 声音',
  txt:'一张琴即一个微缩的宇宙：面圆象天，底平象地，十三徽象十二月加闰月。作品把琴拆成“天、地、人”三层 —— 琴面、琴底、琴腹 —— 观众点选每一个部位，听它的名字和来历；再分别触发泛音、散音、按音，看三种声音在画面中如何各自振荡、彼此和合。',
  film:[{d:6,sub:'一张琴，长三尺六寸六分，象一年三百六十六日。',draw:DR.s_reveal,cue:()=>pluck(0,'san')},{d:6,sub:'琴面拱圆，是天；琴底平直，是地。',draw:DR.s_side,cue:()=>pluck(3,'fan',6)},
        {d:7,sub:'琴面上十三个徽，是十二个月，再加一个闰月。',draw:DR.s_hui,cue:()=>playSeq([[0,6,'fan',6],[.6,5,'fan',6]])},{d:7,sub:'泛音如天，散音如地，按音如人 —— 天地人三才，俱在一张琴中。',draw:DR.s_three,cue:()=>playSeq([[0,4,'fan',6],[1.2,1],[2.4,3,'an',9]])}]},
 {id:'forms',no:'作品二',t:'千形一琴',med:'生成艺术 · 形态插值 · 观众共创',
  txt:'历代琴谱记录的琴式多达五十余种，差别却只在项、腰几处弯折之间。作品把十种琴式写成可计算的轮廓，在画面中连续变形、彼此过渡；观众可以调节项与腰的曲线、选择断纹与琴名，“斫”出一张世间没有的琴，并听到它的声音。',
  film:[{d:6,sub:'同是七弦十三徽，琴的轮廓却有五十余种。',draw:DR.f_morph},{d:6,sub:'变化集中在项与腰：方折、半月、连珠、波浪。',draw:DR.f_notch},
        {d:6,sub:'有的琴取象于自然 —— 蕉叶式，便是一片芭蕉。',draw:DR.f_leaf},{d:6,sub:'每一种琴式，都是古人对“君子之器”的一种想象。',draw:DR.f_grid,cue:()=>playSeq(MOTIFS.lianzhu)}]},
 {id:'hui',no:'作品三',t:'十三徽',med:'声学可视化 · 驻波 · 实时合成',
  txt:'徽位不是装饰，而是一组整数比：1/8、1/6、1/5、1/4、1/3、2/5、1/2……轻触这些点，弦被分成整数段同时振动，发出泛音；按在这些点上，弦长随之改变，得到五声音阶。作品以驻波动画呈现每一个徽的振动方式，让“有数存焉”的琴理被看见。',
  film:[{d:6,sub:'轻点弦长的二分之一，弦便分成两段同时振动 —— 这是七徽的泛音。',draw:DR.h_wave(2),cue:()=>pluck(3,'fan',6)},{d:6,sub:'三分之一处，是九徽与五徽。',draw:DR.h_wave(3),cue:()=>pluck(3,'fan',8)},
        {d:7,sub:'十三个徽，是一组整数比，从八分之一到八分之七。',draw:DR.h_frac,cue:()=>playSeq(HUI.map((_,i)=>[i*.35,3,'fan',12-i]))},{d:5,sub:'古人不必懂得物理，却用耳朵找到了这些比例。',draw:DR.s_hui}]},
 {id:'jianzi',no:'作品四',t:'可见之声',med:'文字交互 · 字形生成 · 声音',
  txt:'琴谱不记音高，只记手指。唐人以“文字谱”逐句描述动作，后人取字之一角拼成“减字”：上半记左手按哪一徽，下半记右手弹哪一弦。作品让观众亲手“拼字”—— 选左手、选徽位、选指法、选弦序，一个减字随即生成并发声，连字成谱，便是你自己的一段琴曲。',
  film:[{d:6,sub:'唐以前，琴谱用文字一句句写下每个动作，称为“文字谱”。',draw:DR.j_text},{d:6,sub:'后来，琴人只取每个字的一角，拼成一个新字 —— 减字谱。',draw:DR.j_compose},
        {d:6,sub:'上半是左手：大指按七徽；下半是右手：中指勾五弦，“五”写在“勹”之内。',draw:(c,w,h,p,t)=>{DR.j_compose(c,w,h,1,t);},cue:()=>pluck(4,'an',6)},{d:6,sub:'它不记音高，只记手指 —— 同一首曲子，不同的人弹出不同的样子。',draw:DR.j_column}]},
 {id:'liushui',no:'作品五',t:'流水',med:'生成影像 · 手势 / 鼠标交互 · 声音',
  txt:'1977年，管平湖演奏的《流水》被录入旅行者号金唱片，飞向太阳系之外。曲中“七十二滚拂”以右手在七弦上连续滚、拂，模拟江河奔涌。作品把七根弦化作七道水纹，观众的手（鼠标或摄像头中的手）划过水面，便激起涟漪与琴声 —— 手越快，水越急。',
  film:[{d:6,sub:'1977年，管平湖弹奏的《流水》，被录入旅行者号金唱片。',draw:DR.l_record},{d:6,sub:'“七十二滚拂”：右手在七根弦上连续滚、拂，如水奔流。',draw:DR.l_flow,cue:()=>playSeq([0,1,2,3,4,5,6,5,4,3,2,1,0].map((s,i)=>[i*.09,s]))},
        {d:6,sub:'琴声成了人类寄给宇宙的声音之一。',draw:DR.l_ripple},{d:5,sub:'现在，轮到你的手来拨动流水。',draw:DR.l_flow}]},
 {id:'zhuo',no:'作品六',t:'斫琴',med:'交互叙事 · 材质模拟 · 时间',
  txt:'一张琴的诞生要经过选材、斫胎、裱布、上灰、髹漆、上弦，往往历时数月甚至数年；而它的“成熟”还要更久 —— 琴历百年，漆面渐生断纹，流水断、蛇腹断、牛毛断、梅花断，断纹愈古，声愈松透。作品让观众亲手完成每一道工序，再拨动时间的指针，看一张琴老去。',
  film:[{d:6,sub:'选一段老桐木 —— 古人说，雷击之木、悬钟之木为上。',draw:DR.z_wood},{d:6,sub:'斫出面板与底板，挖空琴腹，合为琴胎。',draw:DR.z_carve},
        {d:7,sub:'裱布、上灰、髹漆，一层又一层，往往要数月乃至数年。',draw:DR.z_layers},{d:7,sub:'琴历百年，漆面渐生断纹。断纹愈古，琴愈可贵。',draw:DR.z_crack,cue:()=>pluck(2,'san')}]}
];
let HERO=null;
pageInit.expo=function(){
  const reel=[{d:5,sub:'弦上有象 —— 古琴数字艺术展',draw:DR.title('弦上有象','IMAGES ON SEVEN STRINGS')},
    {d:5,sub:'一张琴，象天法地。',draw:DR.s_reveal,cue:()=>pluck(0)},{d:5,sub:'十三徽，十二月与一闰。',draw:DR.s_hui},{d:5,sub:'千形一琴：五十余种琴式，变在项腰之间。',draw:DR.f_morph},
    {d:5,sub:'有数存焉：徽位是弦长的整数比。',draw:DR.h_wave(3),cue:()=>pluck(3,'fan',8)},{d:5,sub:'可见之声：减字成谱，一字一声。',draw:DR.j_compose},
    {d:5,sub:'流水：七十二滚拂，寄往星河。',draw:DR.l_record},{d:5,sub:'斫琴：百年断纹，琴随人老。',draw:DR.z_crack},
    {d:5,sub:'看懂之后，去抚一张属于你的琴。',draw:DR.title('抚琴','六件作品 · 依次展开')}];
  HERO=Film($('#heroFilm'),{scenes:reel,title:'序厅 · 全展导览影片',loop:true});
  $('#halls').innerHTML=WORKS.map(w=>`<a href="#expo-${w.id}">${w.no.slice(2)} · ${w.t}</a>`).join('');
  $('#works').innerHTML=WORKS.map(w=>`<div class="work" id="w-${w.id}"><div class="wv"><div class="poster card" data-w="${w.id}"><canvas></canvas><button class="btn solid enter">进入交互 →</button></div></div>
    <div><div class="no">${w.no}</div><h3>${w.t}</h3><div class="med">${w.med}</div><div class="txt">${w.txt}</div>
    <div class="expl"><div class="lab">▸ 讲解影片</div><div class="ef" data-w="${w.id}"></div></div>
    <div class="actions"><button class="btn zhu" data-open="${w.id}">进入交互</button></div></div></div>`).join('');
  WORKS.forEach(w=>{const F=Film($(`.ef[data-w="${w.id}"]`),{scenes:w.film,title:w.no+' · '+w.t+' · 讲解',small:true});w.F=F;
    if('IntersectionObserver' in window)new IntersectionObserver(es=>{if(es[0].isIntersecting&&es[0].intersectionRatio>.6&&!F._auto){F._auto=1;F.play();}},{threshold:[.6]}).observe(F.el);
    const pc=$(`.poster[data-w="${w.id}"] canvas`);const last=w.film[w.film.length-1].draw;const P={el:pc,visible:true,frame:(now)=>{const dpr=Math.min(devicePixelRatio||1,2),W=pc.clientWidth,H=pc.clientHeight;if(!W)return;if(pc.width!==Math.round(W*dpr)){pc.width=Math.round(W*dpr);pc.height=Math.round(H*dpr);}
      const c=pc.getContext('2d');c.setTransform(dpr,0,0,dpr,0,0);c.save();last(c,W,H,.999,now/1000);c.restore();}};P.el.offsetParent;FILMS.push(Object.assign(P,{el:pc}));
    $(`.poster[data-w="${w.id}"]`).onclick=()=>openWork(w.id);});
  $$('[data-open]').forEach(b=>b.onclick=()=>openWork(b.dataset.open));
};
document.addEventListener('pagechange',e=>{if(e.detail==='expo'&&HERO){HERO.seek(0);HERO.play();}else if(HERO)HERO.pause();});
function openWork(id){const w=WORKS.find(x=>x.id===id);WORKS.forEach(x=>x.F&&x.F.pause());openModal(w.t,w.no+' · '+w.med,b=>INTER[id](b));}

/* ================= interactions ================= */
const INTER={};
INTER.sancai=function(b){b.innerHTML=`<div style="padding:20px 26px"><div class="chips" style="margin-bottom:10px"><button class="chip on" data-f="top">琴面 · 天</button><button class="chip" data-f="bottom">琴底 · 地</button><button class="chip" data-f="side">琴腹 · 人</button></div>
  <div class="anat card mAnat" style="padding:16px 8px"><canvas class="anatCv"></canvas></div><div class="card infobox mInfo" style="margin-top:10px;min-height:90px"><b>点选部位</b>每个名字背后，都是一段取象天地的想象。</div>
  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-top:14px">${['天 · 泛音','地 · 散音','人 · 按音'].map((t,i)=>`<button class="card" data-t="${i}" style="padding:10px;border:1px solid rgba(90,70,50,.2);cursor:pointer"><canvas style="width:100%;height:90px;display:block"></canvas><span style="font-family:var(--kai);font-size:18px;letter-spacing:3px">${t}</span></button>`).join('')}</div></div>`;
  const root=b;let face='top',sel=null;
  const redraw=()=>drawAnatGeneric(root,face,sel,(n)=>{sel=n;redraw();});
  $$('[data-f]',b).forEach(x=>x.onclick=()=>{$$('[data-f]',b).forEach(y=>y.classList.toggle('on',y===x));face=x.dataset.f;sel=null;redraw();});redraw();
  const pads=$$('[data-t]',b);const act=[0,0,0];let raf;
  pads.forEach((p,i)=>p.onclick=()=>{act[i]=1;if(i===0)playSeq([[0,0,'fan',6],[.3,3,'fan',6],[.6,5,'fan',3]]);if(i===1)playSeq([[0,0],[.3,2],[.6,4]]);if(i===2){const v=pluck(3,'an',9);setTimeout(()=>v&&v.vib(.015,5,1.4),200);}});
  const loop=t=>{raf=requestAnimationFrame(loop);pads.forEach((p,i)=>{const cv=$('canvas',p);const {c,w,h}=fitCanvas(cv,90);act[i]*=.985;c.clearRect(0,0,w,h);c.strokeStyle=['#7a8fa0','#8d5b3b','#a63a2b'][i];c.lineWidth=1.6;c.beginPath();
    for(let x=0;x<=w;x+=2){const u=x/w,tt=t/1000;let y=h/2;if(i===0)y+=act[i]*h*.35*Math.sin(u*60+tt*30)*Math.sin(Math.PI*u);else if(i===1)y+=act[i]*h*.4*Math.sin(Math.PI*u)*Math.sin(tt*25);else y+=act[i]*h*.38*Math.sin(Math.PI*u)*Math.sin(tt*22+Math.sin(tt*5)*2);x?c.lineTo(x,y):c.moveTo(x,y);}c.stroke();});};raf=requestAnimationFrame(loop);
  b._cleanup=()=>cancelAnimationFrame(raf);
};
function drawAnatGeneric(root,face,sel,onSel){const cv=$('.anatCv',root),box=$('.mAnat',root);const {c,w,h}=fitCanvas(cv,face==='side'?240:280);const L=w-60,cx=w-30;c.clearRect(0,0,w,h);
  if(face==='side'){const y0=h/2;c.save();c.translate(cx,y0);c.rotate(Math.PI);const p=new Path2D();p.moveTo(0,-8);for(let i=0;i<=100;i++){const t=i/100;p.lineTo(t*L,-8-16*Math.sin(Math.PI*t));}p.lineTo(L,10);p.lineTo(0,10);p.closePath();
    c.fillStyle='#24170f';c.fill(p);c.fillStyle='rgba(239,228,203,.12)';c.fillRect(L*.05,-4,L*.9,10);c.fillStyle='#c9b48e';c.beginPath();c.arc(L*.26,0,4,0,6.283);c.fill();c.fillRect(L*.74-4,-4,8,9);c.fillStyle='#0b0806';c.fillRect(L*.04,-31,L*.012,26);c.restore();}
  else{c.save();c.translate(cx,h/2);c.rotate(Math.PI);drawQin(c,'zhongni',{L,old:.35,face});c.restore();}
  $$('.lbl',box).forEach(e=>e.remove());
  PARTS[face].forEach(([n,t,dir,txt])=>{const el=document.createElement('div');el.className='lbl '+dir+(sel===n?' on':'');el.textContent=n;const x=cx-t*L+8,y=(dir==='up'?h/2-L*RATIO-26:h/2+L*RATIO+26)+16;el.style.left=x+'px';el.style.top=y+'px';el.style.setProperty('--l',(L*RATIO*.6+12)+'px');
    el.onclick=()=>{$('.mInfo',root).innerHTML=`<b>${n}</b>${txt}`;pluck(Math.floor(t*7)%7,face==='top'?'fan':'san',6);onSel(n);};box.appendChild(el);});
  if(sel){const it=PARTS[face].find(p=>p[0]===sel);if(it){const x=cx-it[1]*L;c.strokeStyle='rgba(166,58,43,.9)';c.lineWidth=2;c.setLineDash([4,4]);c.beginPath();c.ellipse(x,h/2,Math.max(16,L*.03),L*RATIO*1.25+10,0,0,6.283);c.stroke();c.setLineDash([]);}}}

INTER.forms=function(b){
  b.innerHTML=`<div style="display:grid;grid-template-columns:1fr 360px;gap:24px;padding:20px 26px;height:100%"><div class="card" style="position:relative"><canvas id="fmCv" style="width:100%;height:100%;display:block;min-height:520px"></canvas></div>
  <div style="font-size:14px;color:var(--ink2);line-height:1.9;overflow:auto">
   <div class="kicker">一 · 起式</div><div class="chips" id="fmBase" style="margin:6px 0 12px"></div>
   <div class="kicker">二 · 项（颈）</div><label>内收深浅 <input type="range" class="range" id="fmN" min="0" max="26" value="16"></label>
   <div class="chips" id="fmNt" style="margin:4px 0 10px"><button class="chip on" data-v="sq">方折</button><button class="chip" data-v="rd">半月</button><button class="chip" data-v="mr">连珠</button></div>
   <div class="kicker">三 · 腰</div><label>内收深浅 <input type="range" class="range" id="fmW" min="0" max="18" value="10"></label>
   <div class="chips" id="fmWt" style="margin:4px 0 10px"><button class="chip on" data-v="sq">方折</button><button class="chip" data-v="rd">长弧</button><button class="chip" data-v="mr">连珠</button><button class="chip" data-v="wv">落霞波</button></div>
   <div class="kicker">四 · 岁月（断纹）</div><input type="range" class="range" id="fmO" min="0" max="100" value="30">
   <div class="kicker" style="margin-top:8px">五 · 琴名</div><div class="chips" id="fmName"></div>
   <div style="margin-top:14px;display:flex;gap:8px"><button class="btn sm" id="fmPlay">♪ 试音</button><button class="btn sm zhu" id="fmRand">随机斫一张</button></div>
   <p style="margin-top:12px;font-size:12.5px;color:var(--ink3)">你斫出的琴形会出现在右上角的琴式谱中，与十种古式并列。</p></div></div>`;
  const NAMES=['松风','鹤鸣','秋籁','听泉','清角','玉壶','霜钟','石上','云和','月下'];
  const S={base:'zhongni',n:16,nt:'sq',w:10,wt:'sq',o:30,name:'松风'};
  $('#fmBase',b).innerHTML=QORDER.slice(0,6).map(k=>`<button class="chip ${k===S.base?'on':''}" data-k="${k}">${QS[k].n}</button>`).join('');
  $('#fmName',b).innerHTML=NAMES.map(n=>`<button class="chip ${n===S.name?'on':''}" data-n="${n}">${n}</button>`).join('');
  const PRESET={fuxi:[20,'rd',12,'rd'],shennong:[7,'rd',4,'rd'],zhongni:[17,'sq',10,'sq'],lianzhu:[14,'mr',10,'mr'],luoxia:[11,'rd',8,'wv'],jiaoye:[0,'rd',0,'rd']};
  const F=(type,t,a,b2,d,n)=>type==='sq'?sq(t,a,b2,d):type==='rd'?rd(t,a,b2,d):type==='mr'?mr(t,a,b2,d,n||3):wv(t,.36,.86,d*.75,4);
  QS.custom={n:'自创',hw:t=>S.base==='jiaoye'?QS.jiaoye.hw(t):baseHW(t)-F(S.nt,t,.115,.205,S.n/100)-F(S.wt,t,S.wt==='rd'?.55:.58,S.wt==='rd'?.76:.715,S.w/100)};
  const sync=()=>{$('#fmN',b).value=S.n;$('#fmW',b).value=S.w;$$('#fmNt .chip',b).forEach(x=>x.classList.toggle('on',x.dataset.v===S.nt));$$('#fmWt .chip',b).forEach(x=>x.classList.toggle('on',x.dataset.v===S.wt));$$('#fmBase .chip',b).forEach(x=>x.classList.toggle('on',x.dataset.k===S.base));$$('#fmName .chip',b).forEach(x=>x.classList.toggle('on',x.dataset.n===S.name));draw();};
  const draw=()=>{const cv=$('#fmCv',b);const {c,w,h}=fitCanvas(cv,cv.clientHeight);c.clearRect(0,0,w,h);const L=h-60;
    // ghost grid of classic forms
    QORDER.forEach((id,i)=>{c.save();c.globalAlpha=.5;c.translate(w-26-i*22,16);c.rotate(Math.PI/2);drawQin(c,id,{L:120,lac:false,ink:'rgba(42,35,29,.35)',strings:false,hui:false});c.restore();});
    c.save();c.translate(w-26-10*22,16);c.rotate(Math.PI/2);drawQin(c,'custom',{L:120,lac:false,ink:'rgba(166,58,43,.8)',strings:false,hui:false});c.restore();
    // front & back
    c.save();c.translate(w*.32,30);c.rotate(Math.PI/2);drawQin(c,'custom',{L,old:S.o/100});c.restore();
    c.save();c.translate(w*.66,30);c.rotate(Math.PI/2);drawQin(c,'custom',{L,old:S.o/100,face:'bottom'});c.restore();
    c.fillStyle='rgba(201,168,90,.9)';c.font=`${L*.05}px "Ma Shan Zheng",KaiTi,serif`;c.textAlign='center';[...S.name].forEach((ch,i)=>c.fillText(ch,w*.66,30+L*.17+i*L*.055));
    c.fillStyle='rgba(166,58,43,.9)';c.fillRect(w*.66-L*.018,30+L*.56,L*.036,L*.036);c.fillStyle='#f6e9d6';c.font=`${L*.016}px "ZCOOL XiaoWei",serif`;c.fillText('琴象',w*.66,30+L*.583);
    c.fillStyle=COL.ink3;c.font='13px "Noto Serif SC",serif';c.fillText('琴面',w*.32,h-12);c.fillText('琴背 · 龙池上刻琴名',w*.66,h-12);};
  $$('#fmBase .chip',b).forEach(x=>x.onclick=()=>{S.base=x.dataset.k;const p=PRESET[S.base];[S.n,S.nt,S.w,S.wt]=p;sync();playSeq(MOTIFS[S.base]);});
  $$('#fmNt .chip',b).forEach(x=>x.onclick=()=>{S.nt=x.dataset.v;sync();});$$('#fmWt .chip',b).forEach(x=>x.onclick=()=>{S.wt=x.dataset.v;sync();});
  $$('#fmName .chip',b).forEach(x=>x.onclick=()=>{S.name=x.dataset.n;sync();});
  $('#fmN',b).oninput=e=>{S.n=+e.target.value;draw();};$('#fmW',b).oninput=e=>{S.w=+e.target.value;draw();};$('#fmO',b).oninput=e=>{S.o=+e.target.value;draw();};
  $('#fmPlay',b).onclick=()=>{const seq=[0,2,3,4,5].map((s,i)=>[i*.35,(s+S.n)%7,i===4?'an':'san',8]);playSeq(seq);};
  $('#fmRand',b).onclick=()=>{const r=Math.random;S.base=QORDER[Math.floor(r()*5)];S.n=Math.floor(r()*24);S.nt=['sq','rd','mr'][Math.floor(r()*3)];S.w=Math.floor(r()*16);S.wt=['sq','rd','mr','wv'][Math.floor(r()*4)];S.name=NAMES[Math.floor(r()*NAMES.length)];S.o=Math.floor(r()*100);$('#fmO',b).value=S.o;sync();$('#fmPlay',b).click();};
  sync();const ro=()=>draw();window.addEventListener('resize',ro);b._cleanup=()=>window.removeEventListener('resize',ro);
};
INTER.hui=function(b){
  b.innerHTML=`<div style="padding:20px 26px"><div style="display:flex;gap:14px;align-items:center;flex-wrap:wrap"><div class="chips" id="huM"><button class="chip on" data-m="fan">泛音 · 轻点</button><button class="chip" data-m="an">按音 · 实按</button></div>
   <span style="color:var(--ink3);font-size:13px">弦：</span><div class="chips" id="huS">${STRNAME.map((n,i)=>`<button class="chip ${i===3?'on':''}" data-s="${i}">${n}弦</button>`).join('')}</div></div>
   <canvas id="huCv" class="card" style="width:100%;height:380px;display:block;margin-top:14px;background:#1a1410"></canvas>
   <div class="card infobox" id="huInfo" style="margin-top:12px">点画面上方的任意一个徽位。</div></div>`;
  let mode='fan',str=3,sel=6,t0=performance.now(),raf;
  const NAMEI={2:'高八度',3:'高八度又五度（十二度）',4:'高两个八度',5:'高两个八度又大三度',6:'高两个八度又五度',8:'高三个八度'};
  const ANI=['约大二度','小三度','大三度','纯四度','纯五度','大六度','八度','八度又大三度','八度又五度','两个八度','两个八度又大三度','两个八度又五度','三个八度'];
  const FR=['1/8','1/6','1/5','1/4','1/3','2/5','1/2','3/5','2/3','3/4','4/5','5/6','7/8'];
  const info=()=>{const f=HUI[sel];const txt=mode==='fan'?`<b>${HUINAME[sel]}徽 · 泛音</b>位于弦长 ${FR[sel]} 处。轻触此点，弦被分成 ${HUIDEN[sel]} 段同时振动，发出第 ${HUIDEN[sel]} 泛音，比散音${NAMEI[HUIDEN[sel]]}。`
    :`<b>${HUINAME[sel]}徽 · 按音</b>按在此处，从岳山到按指的有效弦长只剩原来的 ${FR[sel]}，音高比散音高出${ANI[12-sel]}。`;$('#huInfo',b).innerHTML=txt+`<br><span style="color:var(--ink3);font-size:13px">${STRNAME[str]}弦 · 正调为“${YIN[str]}”</span>`;};
  const hit=()=>{t0=performance.now();pluck(str,mode,sel);info();};
  const cv=$('#huCv',b);
  cv.onclick=e=>{const r=cv.getBoundingClientRect(),x=e.clientX-r.left,w=r.width;const x0=w*.06,x1=w*.94;let best=0,bd=1e9;for(let i=0;i<13;i++){const hx=x1-(x1-x0)*HUI[i];if(Math.abs(hx-x)<bd){bd=Math.abs(hx-x);best=i;}}sel=best;hit();};
  $$('#huM .chip',b).forEach(x=>x.onclick=()=>{mode=x.dataset.m;$$('#huM .chip',b).forEach(y=>y.classList.toggle('on',y===x));hit();});
  $$('#huS .chip',b).forEach(x=>x.onclick=()=>{str=+x.dataset.s;$$('#huS .chip',b).forEach(y=>y.classList.toggle('on',y===x));hit();});
  const loop=now=>{raf=requestAnimationFrame(loop);const {c,w,h}=fitCanvas(cv,380);c.fillStyle='#1a1410';c.fillRect(0,0,w,h);const x0=w*.06,x1=w*.94,y=h*.58,el=(now-t0)/1000,A=h*.16*Math.exp(-el*.7);
    // hui markers
    for(let i=0;i<13;i++){const hx=x1-(x1-x0)*HUI[i];c.fillStyle=i===sel?'#e8cf8e':'rgba(239,231,214,.8)';c.beginPath();c.arc(hx,h*.2,i===6?8:6,0,6.283);c.fill();ftx(c,HUINAME[i],hx,h*.12,13,.85,'kai','#d9c9a6');ftx(c,FR[i],hx,h*.28,11,.6,'serif','#a89878');}
    c.fillStyle='#efe4cb';c.fillRect(x1,y-16,5,32);c.fillRect(x0-5,y-16,5,32);ftx(c,'岳山',x1+2,y+30,12,.7,'kai');ftx(c,'龙龈',x0-2,y+30,12,.7,'kai');
    const hx=x1-(x1-x0)*HUI[sel];c.strokeStyle='rgba(232,207,142,.25)';c.setLineDash([3,5]);c.beginPath();c.moveTo(hx,h*.2);c.lineTo(hx,h*.9);c.stroke();c.setLineDash([]);
    c.lineWidth=2;c.strokeStyle='#e8cf8e';c.beginPath();
    if(mode==='fan'){const n=HUIDEN[sel];for(let i=0;i<=400;i++){const u=i/400;const yy=y+A*Math.sin(n*Math.PI*u)*Math.sin(el*30);i?c.lineTo(lerp(x1,x0,u),yy):c.moveTo(x1,yy);}c.stroke();for(let k=1;k<n;k++){c.fillStyle='rgba(166,58,43,.9)';c.beginPath();c.arc(lerp(x1,x0,k/n),y,4,0,6.283);c.fill();}}
    else{const f=HUI[sel];for(let i=0;i<=300;i++){const u=i/300*f;const yy=y+A*Math.sin(Math.PI*u/f)*Math.sin(el*26);i?c.lineTo(lerp(x1,x0,u),yy):c.moveTo(x1,yy);}c.stroke();c.strokeStyle='rgba(232,207,142,.35)';c.lineWidth=1;c.beginPath();c.moveTo(hx,y);c.lineTo(x0,y);c.stroke();
      c.fillStyle='#ecd8bb';c.beginPath();c.ellipse(hx,y-6,9,6,0,0,6.283);c.fill();}
  };raf=requestAnimationFrame(loop);info();b._cleanup=()=>cancelAnimationFrame(raf);
};
INTER.jianzi=function(b){
  const LF=[['艹','散音（不按）'],['大','大指'],['亻','食指'],['中','中指'],['夕','名指']],HU=['七','八','九','十','十一','十三'],HUi=[6,7,8,9,10,12],RF=[['勹','勾'],['乚','挑'],['木','抹'],['乇','托'],['尸','擘'],['丁','打']],SN=['一','二','三','四','五','六','七'];
  const S={lf:1,hu:0,rf:0,s:4},seq=[];
  b.innerHTML=`<div style="display:grid;grid-template-columns:380px 1fr 230px;gap:22px;padding:20px 26px;height:100%">
   <div style="font-size:14px;line-height:1.9;color:var(--ink2)"><div class="kicker">左手 · 用指</div><div class="chips" id="jL"></div><div class="kicker" style="margin-top:10px">左手 · 徽位</div><div class="chips" id="jH"></div>
    <div class="kicker" style="margin-top:10px">右手 · 指法</div><div class="chips" id="jR"></div><div class="kicker" style="margin-top:10px">右手 · 弦序</div><div class="chips" id="jS"></div>
    <div style="margin-top:16px;display:flex;gap:8px;flex-wrap:wrap"><button class="btn sm" id="jPlay">♪ 弹此字</button><button class="btn sm zhu" id="jAdd">＋ 记入琴谱</button></div>
    <p id="jDesc" style="margin-top:12px;font-family:var(--kai);font-size:17px;color:var(--ink)"></p><p style="font-size:12.5px;color:var(--ink3);line-height:1.8;margin-top:6px">上半：左为左手用指，右为徽位；下半：右手指法，弦序写在其内。右手八法：大指擘（尸）托（乇），食指抹（木）挑（乚），中指勾（勹）剔，名指打（丁）摘；小指为禁指。</p></div>
   <div class="card" style="display:grid;place-items:center"><canvas id="jCv" style="width:100%;height:440px;display:block"></canvas></div>
   <div class="card" style="padding:14px;display:flex;flex-direction:column"><div class="kicker">我的琴谱（竖排，右起）</div><canvas id="jSeq" style="width:100%;flex:1;min-height:320px;display:block"></canvas>
    <div style="display:flex;gap:6px;margin-top:8px"><button class="btn sm" id="jPS">♪ 演奏</button><button class="btn sm" id="jClr">清空</button></div></div></div>`;
  const chips=(id,arr,key,lab)=>{$(id,b).innerHTML=arr.map((x,i)=>`<button class="chip" data-i="${i}">${lab(x)}</button>`).join('');$$(id+' .chip',b).forEach(x=>x.onclick=()=>{S[key]=+x.dataset.i;upd();if(key!=='hu'||S.lf)playIt();});};
  chips('#jL',LF,'lf',x=>x[0]+' '+x[1]);chips('#jH',HU,'hu',x=>x+'徽');chips('#jR',RF,'rf',x=>x[0]+' '+x[1]);chips('#jS',SN,'s',x=>x+'弦');
  const glyph=()=>({lf:LF[S.lf][0],hui:S.lf?HU[S.hu]:'',rf:RF[S.rf][0],str:SN[S.s]});
  const desc=()=>`${S.lf?`左手${LF[S.lf][1]}按${HU[S.hu]}徽，`:'左手不按（散音），'}右手${RF[S.rf][1]}${SN[S.s]}弦`;
  const upd=()=>{[['#jL','lf'],['#jH','hu'],['#jR','rf'],['#jS','s']].forEach(([id,k])=>$$(id+' .chip',b).forEach(x=>x.classList.toggle('on',+x.dataset.i===S[k])));$$('#jH .chip',b).forEach(x=>x.style.opacity=S.lf?1:.35);
    drawJianzi($('#jCv',b),glyph(),false);$('#jDesc',b).textContent=desc();};
  const playIt=(g=S)=>pluck(g.s,g.lf?'an':'san',HUi[g.hu]);
  const drawSeq=()=>{const cv=$('#jSeq',b);const {c,w,h}=fitCanvas(cv,cv.clientHeight);c.clearRect(0,0,w,h);const sz=52,perCol=Math.max(1,Math.floor((h-10)/(sz*1.12)));
    seq.forEach((g,i)=>{const col=Math.floor(i/perCol),row=i%perCol;drawJZ(c,w-sz*.62-col*sz*1.1,8+row*sz*1.12+sz*.5,sz,{lf:LF[g.lf][0],hui:g.lf?HU[g.hu]:'',rf:RF[g.rf][0],str:SN[g.s]});});};
  $('#jPlay',b).onclick=()=>playIt();$('#jAdd',b).onclick=()=>{seq.push({...S});drawSeq();playIt();};$('#jClr',b).onclick=()=>{seq.length=0;drawSeq();};
  $('#jPS',b).onclick=()=>seq.forEach((g,i)=>setTimeout(()=>playIt(g),i*520));
  [[1,8,0,3],[0,0,1,6],[2,6,2,4],[1,9,0,2]].forEach(([lf,hu,rf,s])=>seq.push({lf,hu:HUi.indexOf(hu)>=0?HUi.indexOf(hu):2,rf,s}));
  upd();setTimeout(drawSeq,60);
};
INTER.liushui=function(b){
  b.innerHTML=`<div style="position:absolute;inset:0;background:#0d0b0a"><canvas id="lsCv" style="width:100%;height:100%;display:block;cursor:crosshair"></canvas>
   <div style="position:absolute;left:20px;top:16px;color:#d9c9a6;font-family:var(--kai);letter-spacing:3px;font-size:15px">在水面上划动 —— 上下划过七道水纹即“滚拂”，手越快，水越急</div></div>`;
  const cv=$('#lsCv',b);let raf,last=null;const drops=[],trail=[];const lastHit=[0,0,0,0,0,0,0];
  const lineY=(s,h)=>h*(.22+s*.095);
  cv.onpointermove=e=>{const r=cv.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top,h=r.height;trail.push({x,y,a:1});
    if(last){for(let s=0;s<7;s++){const ly=lineY(s,h);if((last.y-ly)*(y-ly)<0&&performance.now()-lastHit[s]>60){lastHit[s]=performance.now();const sp=Math.min(1,Math.hypot(x-last.x,y-last.y)/40);
      const fan=x>r.width*.75;pluck(s,fan?'fan':'san',fan?6:6,.5+sp*.6);drops.push({x,y:ly,r:2,a:1,s});}}}last={x,y};};
  cv.onpointerleave=()=>last=null;cv.onpointerdown=e=>{const r=cv.getBoundingClientRect();drops.push({x:e.clientX-r.left,y:e.clientY-r.top,r:2,a:1,s:3});pluck(Math.floor(Math.random()*7),'fan',6);};
  const loop=now=>{raf=requestAnimationFrame(loop);const {c,w,h}=fitCanvas(cv,cv.clientHeight);const t=now/1000;c.fillStyle='rgba(13,11,10,1)';c.fillRect(0,0,w,h);
    for(let i=0;i<120;i++){c.fillStyle=`rgba(255,255,255,${.15+.25*Math.abs(Math.sin(t*.5+i))})`;c.fillRect((i*137.5%1)*w,(i*.618*997%1)*h*.18,1.2,1.2);}
    for(let s=0;s<7;s++){const ly=lineY(s,h);c.strokeStyle=`rgba(232,217,184,${.35+s*.06})`;c.lineWidth=1+s*.15;c.beginPath();for(let x=0;x<=w;x+=4){let dy=Math.sin(x*.012+t*1.2+s)*2;drops.forEach(d=>{if(d.s===s){const dist=Math.abs(x-d.x);dy+=Math.sin(dist*.08-d.r*.2)*12*d.a*Math.exp(-dist/(d.r+40));}});x?c.lineTo(x,ly+dy):c.moveTo(x,ly+dy);}c.stroke();
      ftx(c,STRNAME[s]+'弦',22,ly-12,12,.5,'kai','#d9c9a6','left');}
    drops.forEach(d=>{d.r+=3;d.a*=.975;c.strokeStyle=`rgba(232,207,142,${d.a*.6})`;c.lineWidth=1.2;c.beginPath();c.ellipse(d.x,d.y,d.r,d.r*.3,0,0,6.283);c.stroke();});for(let i=drops.length-1;i>=0;i--)if(drops[i].a<.03)drops.splice(i,1);
    trail.forEach(p=>{p.a*=.92;c.fillStyle=`rgba(166,58,43,${p.a*.5})`;c.beginPath();c.arc(p.x,p.y,3*p.a+1,0,6.283);c.fill();});while(trail.length>40)trail.shift();
    c.fillStyle='rgba(232,217,184,.08)';c.fillRect(w*.75,h*.17,w*.25,h*.66);ftx(c,'右侧水域 · 泛音',w*.875,h*.88,13,.6,'kai','#d9c9a6');};
  raf=requestAnimationFrame(loop);b._cleanup=()=>cancelAnimationFrame(raf);
};
INTER.zhuo=function(b){
  const STEPS=[['选材','点选一块面板木料。桐木松透，梓木坚实。'],['斫胎','在木料上来回拖动，斫出琴形。'],['裱布','点击琴胎，裱上夏布。'],['上灰','点击三次：粗灰、中灰、细灰。'],['髹漆','在琴面上来回摩擦，推光生漆。'],['上弦','依次点击七次，上七根弦。'],['岁月','拖动时间，看断纹如何生长。']];
  let st=0,carve=0,lay=0,gloss=0,strs=0,age=0,wood=null;
  b.innerHTML=`<div style="display:grid;grid-template-columns:260px 1fr;gap:22px;padding:20px 26px;height:100%"><div id="zS" style="display:flex;flex-direction:column;gap:6px"></div>
   <div style="display:flex;flex-direction:column;gap:10px"><div class="card infobox" id="zI" style="min-height:70px"></div><canvas id="zCv" class="card" style="width:100%;flex:1;min-height:420px;display:block;cursor:pointer"></canvas>
   <div id="zAge" style="display:none"><input type="range" class="range" id="zR" min="0" max="100" value="0"><div style="display:flex;justify-content:space-between;font-size:12px;color:var(--ink3)"><span>新斫</span><span>百年 · 流水断</span><span>三百年 · 蛇腹断</span><span>千年 · 梅花断</span></div></div></div></div>`;
  const cv=$('#zCv',b);
  const ui=()=>{$('#zS',b).innerHTML=STEPS.map((s,i)=>`<div class="card" style="padding:10px 14px;${i===st?'outline:2px solid var(--zhu)':''};opacity:${i<=st?1:.45}"><span class="kicker" style="font-size:12px">第${'一二三四五六七'[i]}步 ${i<st?'✓':''}</span><div style="font-family:var(--kai);font-size:19px;letter-spacing:3px">${s[0]}</div></div>`).join('');$('#zI',b).innerHTML=`<b>${STEPS[st][0]}</b>${STEPS[st][1]}`;$('#zAge',b).style.display=st===6?'block':'none';draw();};
  const next=()=>{st=Math.min(6,st+1);ui();pluck(st%7,'fan',6,.6);};
  const draw=()=>{const {c,w,h}=fitCanvas(cv,cv.clientHeight);c.clearRect(0,0,w,h);const L=w*.82,cx=w/2,cy=h/2;
    if(st===0){[['桐木','#c9a676'],['杉木','#d8b884'],['梓木','#9a6b45']].forEach(([n,col],i)=>{const y=h*(.22+i*.26);c.fillStyle=col;c.fillRect(w*.15,y-22,w*.7,44);c.strokeStyle='rgba(80,50,25,.35)';for(let k=0;k<6;k++){c.beginPath();c.moveTo(w*.15,y-18+k*7);c.bezierCurveTo(w*.4,y-14+k*7,w*.6,y-22+k*7,w*.85,y-18+k*7);c.stroke();}ftx(c,n,w*.5,y,20,1,'kai','#2a231d');});return;}
    const woodCol=wood==='梓木'?'#9a6b45':wood==='杉木'?'#d8b884':'#c9a676';
    if(st===1){c.fillStyle=woodCol;c.globalAlpha=1-carve;c.fillRect(cx-L/2,cy-L*RATIO*1.2,L,L*RATIO*2.4);c.globalAlpha=1;qinH(c,'zhongni',cx,cy,L,{ink:woodCol,strings:false,hui:false,alpha:carve});ftx(c,`${Math.round(carve*100)}%`,cx,h*.85,16,1,'serif',COL.ink3);return;}
    const cols=[woodCol,'#cbbd9e','#a8a39a','#99938b','#8e8a84'];
    if(st===2)qinH(c,'zhongni',cx,cy,L,{ink:lay?cols[1]:woodCol,strings:false,hui:false});
    if(st===3)qinH(c,'zhongni',cx,cy,L,{ink:cols[1+lay]||cols[4],strings:false,hui:false});
    if(st===4){qinH(c,'zhongni',cx,cy,L,{ink:cols[4],strings:false,hui:false});c.save();c.globalAlpha=gloss;qinH(c,'zhongni',cx,cy,L,{strings:false,hui:gloss>.6,old:0});c.restore();}
    if(st===5)qinH(c,'zhongni',cx,cy,L,{strings:false,hui:true,old:0,glowStr:null}),(()=>{c.save();c.translate(cx+L/2,cy);c.rotate(Math.PI);for(let s=0;s<strs;s++){const hw=t=>QS.zhongni.hw(t)*L*RATIO;const y1=lerp(.6,-.6,s/6)*hw(.045),y2=lerp(.42,-.42,s/6)*hw(.975);c.strokeStyle='rgba(235,222,195,.85)';c.beginPath();c.moveTo(.045*L,y1);c.lineTo(.975*L,y2);c.stroke();}c.restore();})();
    if(st===6)qinH(c,'zhongni',cx,cy,L,{old:age});
  };
  cv.onclick=e=>{const r=cv.getBoundingClientRect(),y=(e.clientY-r.top)/r.height;
    if(st===0){wood=y<.35?'桐木':y<.61?'杉木':'梓木';toast(wood==='梓木'?'梓木坚实，多作底板；面板仍用桐木':'选定'+wood+'作面板');if(wood==='梓木')wood='桐木';next();}
    else if(st===2){lay=1;draw();setTimeout(next,500);}else if(st===3){lay++;draw();if(lay>=3)setTimeout(next,400);}
    else if(st===5){strs++;pluck(7-strs<0?0:strs-1,'san');draw();if(strs>=7)setTimeout(next,600);}};
  let lastX=null;cv.onpointermove=e=>{if(e.buttons!==1&&e.pointerType==='mouse'&&st===1){}const x=e.clientX;if(lastX!==null){const d=Math.abs(x-lastX)/cv.clientWidth;
    if(st===1&&(e.buttons===1||e.pointerType!=='mouse')){carve=Math.min(1,carve+d*.5);draw();if(carve>=1)next();}
    if(st===4){gloss=Math.min(1,gloss+d*.35);draw();if(gloss>=1)next();}}lastX=x;};
  $('#zR',b).oninput=e=>{age=e.target.value/100;draw();};
  ui();const ro=()=>draw();window.addEventListener('resize',ro);b._cleanup=()=>window.removeEventListener('resize',ro);
};
