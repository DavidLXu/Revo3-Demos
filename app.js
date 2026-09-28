(() => {
 const groups=[
 ['all','全部演示','All demos','从动作映射到全手触觉，浏览 7 个方向的真机、仿真与数据演示。','Browse real-robot, simulation and data demonstrations across seven directions.'],
 ['强化学习','强化学习','Reinforcement learning','掌内旋转、手臂协作与双手运动。保留训练过程和不同阶段的演示。','In-hand rotation, arm–hand coordination and bimanual motion, including work in training.'],
 ['钢琴演奏','钢琴演奏','Piano performance','双臂与灵巧手协同演奏。包含运动学轨迹优化与按键训练演示，有原声的片段保留声音。','Coordinated piano playing with arms and dexterous hands, from kinematic trajectory optimization to key-press training. Original audio is preserved where available.'],
 ['模仿学习','模仿学习','Imitation learning','从桌面抓取到抽屉任务，观察示教驱动的操作与并行仿真回放。','Demonstration-driven manipulation, from tabletop grasps to drawer tasks and parallel simulated rollouts.'],
 ['触觉','触觉','Tactile sensing','观察接触位置、指尖形变与全手压力，以及操作过程中的同步数据。','Explore contact locations, fingertip deformation, whole-hand pressure and synchronized manipulation data.'],
 ['retargeting','动作重定向','Retargeting','将手套捕捉到的人手动作映射到 Revo3，展示手指跟随与拇指对指。','Map glove-captured human motion onto Revo3, including finger following and thumb opposition.'],
 ['优化生成','优化生成','Grasp generation','面向不同物体几何形状，展示生成的抓取姿态与接触配置。','Generated grasp poses and contact configurations for a variety of object geometries.'],
 ['Ego数据处理','Ego 数据处理','Ego data processing','将第一视角的人手操作重建为机器人可回放的手部和双臂动作。','Reconstruct egocentric demonstrations as hand and bimanual robot motion.']
 ];
 let lang='zh';try{lang=localStorage.getItem('revo3-language')||'zh'}catch{}if(!['zh','en'].includes(lang))lang='zh';
 let selected='all';const grid=document.querySelector('#demo-grid'),nav=document.querySelector('#categories');
 const order=[10,25,14,21,4,5,1,24,26,27,28,29,30,12,13,8,7,9,11,31,15,16,19,20,22,17,18,23,3,6,2];
 const demos=order.map(n=>window.DEMOS.find(d=>d.id===`demo-${String(n).padStart(2,'0')}`));
 const categories=d=>d.categories||[d.category];
 const belongs=(d,category)=>categories(d).includes(category);
 const text=(zh,en)=>lang==='zh'?zh:en;
 const duration=d=>`${Math.floor(d/60)}:${String(Math.floor(d%60)).padStart(2,'0')}`;
 function pauseAll(except){document.querySelectorAll('video').forEach(v=>{if(v!==except)v.pause()})}
 function play(d,wrap,button){
  pauseAll();const v=document.createElement('video');v.controls=true;v.playsInline=true;v.preload='metadata';v.poster=d.poster;v.src=d.src;v.setAttribute('aria-label',d.title[lang]);
  v.addEventListener('play',()=>pauseAll(v));v.addEventListener('error',()=>{if(wrap.querySelector('.play-error'))return;const e=document.createElement('div');e.className='play-error';e.textContent=text('视频暂时无法加载，请点击下方“打开视频”查看。','The video could not load. Use “Open video” below.');wrap.append(e)});
  wrap.replaceChildren(v);v.play().catch(()=>{});v.focus();
 }
 function render(){
  pauseAll();document.documentElement.lang=lang==='zh'?'zh-CN':'en';document.body.lang=lang;
  document.title=text('Revo3 灵巧手演示集合','Revo3 — Demo Collection');
  document.querySelectorAll('[data-zh]').forEach(el=>el.textContent=el.dataset[lang]);
  document.querySelector('.index-mark strong').textContent=demos.length;
  document.querySelectorAll('[data-lang]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.lang===lang));
  nav.setAttribute('aria-label',text('演示分类','Demo categories'));nav.replaceChildren();
  groups.forEach(g=>{const b=document.createElement('button');b.type='button';b.setAttribute('aria-pressed',g[0]===selected);b.append(document.createTextNode(g[lang==='zh'?1:2]));const count=document.createElement('small');count.textContent=g[0]==='all'?demos.length:demos.filter(d=>belongs(d,g[0])).length;b.append(count);b.addEventListener('click',()=>{selected=g[0];render();nav.querySelector('[aria-pressed=true]').focus({preventScroll:true})});nav.append(b)});
  const g=groups.find(g=>g[0]===selected);document.querySelector('#section-kicker').textContent=selected==='all'?'THE DEMO COLLECTION':`${String(groups.indexOf(g)).padStart(2,'0')} / REVO3 DEMOS`;
  document.querySelector('#section-title').textContent=g[lang==='zh'?1:2];document.querySelector('#section-description').textContent=g[lang==='zh'?3:4];
  grid.replaceChildren();demos.filter(d=>selected==='all'||belongs(d,selected)).forEach((d,i)=>{
   const card=document.createElement('article');card.className='demo';card.id=d.id;
   const wrap=document.createElement('div');wrap.className='video-wrap';const img=document.createElement('img');img.src=d.poster;img.alt=d.title[lang];img.className='poster';img.loading=i<2?'eager':'lazy';wrap.append(img);
   const b=document.createElement('button');b.type='button';b.className='play-button';b.setAttribute('aria-label',text('播放：','Play: ')+d.title[lang]);b.innerHTML='<span class="play-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3l15 9-15 9z"/></svg></span>';b.addEventListener('click',()=>play(d,wrap,b));wrap.append(b);
   const time=document.createElement('span');time.className='duration';time.textContent=duration(d.duration);wrap.append(time);
   const copy=document.createElement('div');copy.className='demo-copy';const meta=document.createElement('p');meta.className='demo-meta';const labels=categories(d).map(category=>groups.find(g=>g[0]===category)[lang==='zh'?1:2]);meta.textContent=`${labels.join(' · ')} / ${d.tag[lang]}`;
   const title=document.createElement('h3');title.textContent=d.title[lang];const cap=document.createElement('p');cap.className='caption';cap.textContent=d.caption[lang];
   const links=document.createElement('div');links.className='demo-links';const open=document.createElement('a');open.href=d.src;open.target='_blank';open.rel='noopener';open.textContent=text('打开视频 ↗','Open video ↗');const download=document.createElement('a');download.href=d.src;download.download=d.title[lang]+'.mp4';download.textContent=text('下载视频 ↓','Download video ↓');links.append(open,download);copy.append(meta,title,cap,links);card.append(wrap,copy);grid.append(card);
  });
 }
 document.querySelectorAll('[data-lang]').forEach(b=>b.addEventListener('click',()=>{lang=b.dataset.lang;try{localStorage.setItem('revo3-language',lang)}catch{}render()}));
 document.addEventListener('visibilitychange',()=>{if(document.hidden)pauseAll()});render();
})();
