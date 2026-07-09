/* ===== ★ Interactive Requirement Graph — self-contained, offline, AUTO-DERIVED =====
   Inline this INSIDE a <script> tag before </body> in requirement.html (do NOT <link> it —
   keep requirement.html single-file). It needs NO data of its own: at load it reads every
   card (`main article[id]` whose id is WF/UC/SCR/API/TC/DOC/DIA-####) for its type/title/status,
   and every `.chain` link (`a[href="#ID"]`) for edges. So the graph is always in sync with the
   hand-written cards + chains — add/edit a card or a chip and the graph reflects it on next open.
   The only thing to keep accurate is the chains: a missing chip = a missing edge.
   Requires the markup in graph-section.html and the styles in graph.css. */
(function(){
  var svg = document.getElementById('graphSvg');
  if(!svg) return;
  var SVGNS='http://www.w3.org/2000/svg';
  var VB_W=1200, VB_H=600, NW=122, NH=22;
  var cssRoot=getComputedStyle(document.documentElement);
  function cvar(v){ var c=cssRoot.getPropertyValue(v).trim(); return c||v; }
  var TYPE_ORDER=['DOC','WF','UC','SCR','API','TC','DIA'];
  var TYPE_META={
    DOC:{color:cvar('--doc'),label:'เอกสาร (Doc)'}, WF:{color:cvar('--wf'),label:'Workflow'},
    UC:{color:cvar('--uc'),label:'Use Case'}, SCR:{color:cvar('--scr'),label:'Screen'},
    API:{color:cvar('--api'),label:'API'}, TC:{color:cvar('--tc'),label:'Test Case'},
    DIA:{color:'#0ea5e9',label:'Diagram'}
  };
  var STATUS_META={done:{label:'Implemented',color:'#059669'},partial:{label:'Partial',color:'#d97706'},planned:{label:'Planned',color:'#64748b'}};
  function elNS(tag,a){ var e=document.createElementNS(SVGNS,tag); if(a){for(var k in a) e.setAttribute(k,a[k]);} return e; }
  function esc(s){ return String(s).replace(/[&<>]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;'}[c];}); }
  function trunc(s,n){ var a=Array.from(s); return a.length>n ? a.slice(0,n-1).join('')+'…' : s; }

  /* 1) nodes derived from cards */
  var nodes=[], nodeById={};
  document.querySelectorAll('main article[id]').forEach(function(art){
    var id=art.id.trim(), m=id.match(/^(WF|UC|SCR|API|TC|DOC|DIA)-/); if(!m) return;
    var type=m[1], title=id, h=art.querySelector('h3');
    if(h){ var c=h.cloneNode(true); c.querySelectorAll('.id-badge,.status').forEach(function(x){x.remove();}); title=c.textContent.replace(/\s+/g,' ').trim(); }
    var st=null, s=art.querySelector('.status');
    if(s){ if(s.classList.contains('done'))st='done'; else if(s.classList.contains('partial'))st='partial'; else if(s.classList.contains('planned'))st='planned'; }
    var n={id:id,type:type,title:title,status:st,x:0,y:0,vx:0,vy:0,visible:true,webInit:false,pin:false};
    nodes.push(n); nodeById[id]=n;
  });

  /* 2) edges derived from chain links */
  var edges=[], seen={}, adj={};
  nodes.forEach(function(n){ adj[n.id]=[]; });
  nodes.forEach(function(n){
    document.getElementById(n.id).querySelectorAll('a[href^="#"]').forEach(function(a){
      var t=a.getAttribute('href').slice(1).trim();
      if(t===n.id || !nodeById[t]) return;
      var key=[n.id,t].sort().join('|'); if(seen[key]) return; seen[key]=1;
      edges.push({a:n,b:nodeById[t]}); adj[n.id].push(t); adj[t].push(n.id);
    });
  });

  /* 3) svg scaffold */
  var defs=elNS('defs');
  var mk=elNS('marker',{id:'gArrow',viewBox:'0 0 10 10',refX:'9',refY:'5',markerWidth:'6',markerHeight:'6',orient:'auto'});
  mk.appendChild(elNS('path',{d:'M0,0 L10,5 L0,10 z',fill:'#cbd5e1'})); defs.appendChild(mk); svg.appendChild(defs);
  var bg=elNS('rect',{x:'0',y:'0',width:VB_W,height:VB_H,fill:'#ffffff'}); svg.appendChild(bg);
  var gcanvas=elNS('g'); svg.appendChild(gcanvas);
  var gEdges=elNS('g'), gNodes=elNS('g'); gcanvas.appendChild(gEdges); gcanvas.appendChild(gNodes);
  edges.forEach(function(e){ e.line=elNS('line',{stroke:'#cbd5e1','stroke-width':'1.4','marker-end':'url(#gArrow)'}); gEdges.appendChild(e.line); });

  var dragging=false, hovered=null, selected=null;
  nodes.forEach(function(n){
    var g=elNS('g',{'class':'gnode'});
    n.rect=elNS('rect',{x:-NW/2,y:-NH/2,width:NW,height:NH,rx:'11',ry:'11'});
    n.text=elNS('text',{x:'0',y:'4','text-anchor':'middle','font-size':'11','font-weight':'700','font-family':'Segoe UI,Tahoma,sans-serif'});
    var tt=elNS('title'); tt.textContent=n.id+' — '+n.title;
    g.appendChild(n.rect); g.appendChild(n.text); g.appendChild(tt); n.g=g; gNodes.appendChild(g);
    g.addEventListener('mouseenter',function(){ if(!dragging){ hovered=n; emphasize(); } });
    g.addEventListener('mouseleave',function(){ if(!dragging){ hovered=null; emphasize(); } });
    g.addEventListener('click',function(ev){ ev.stopPropagation(); selected=(selected===n?null:n); showInfo(selected); emphasize(); });
    g.addEventListener('dblclick',function(ev){ ev.stopPropagation(); location.hash=n.id; });
    g.addEventListener('pointerdown',function(ev){ startNodeDrag(ev,n); });
  });

  /* state */
  var mode='flow', customer=false, search='';
  var typeOn={}; TYPE_ORDER.forEach(function(t){ typeOn[t]=true; });
  var statusOn={done:true,partial:true,planned:true};
  var view={k:1,tx:0,ty:0};
  function applyView(){ gcanvas.setAttribute('transform','translate('+view.tx+','+view.ty+') scale('+view.k+')'); }
  function labelOf(n){ return customer ? trunc(n.title,16) : n.id; }
  function styleNode(n){
    var c=TYPE_META[n.type].color;
    if(n.status==='planned'){ n.rect.setAttribute('fill','#ffffff'); n.rect.setAttribute('fill-opacity','1'); n.rect.setAttribute('stroke',c); n.rect.setAttribute('stroke-width','1.6'); n.rect.setAttribute('stroke-dasharray','4 3'); n.text.setAttribute('fill',c); }
    else if(n.status==='partial'){ n.rect.setAttribute('fill',c); n.rect.setAttribute('fill-opacity','0.5'); n.rect.setAttribute('stroke',c); n.rect.setAttribute('stroke-width','1.6'); n.rect.setAttribute('stroke-dasharray','none'); n.text.setAttribute('fill','#0f172a'); }
    else { n.rect.setAttribute('fill',c); n.rect.setAttribute('fill-opacity','1'); n.rect.setAttribute('stroke','none'); n.rect.setAttribute('stroke-dasharray','none'); n.text.setAttribute('fill','#ffffff'); }
  }
  function computeVisible(){ nodes.forEach(function(n){ n.visible = typeOn[n.type] && (n.status? statusOn[n.status] : true); }); }

  function layoutFlow(){
    var cols=TYPE_ORDER.filter(function(tp){ return nodes.some(function(n){return n.type===tp && n.visible;}); });
    var colGap=170,left=95,rowGap=30,midY=VB_H/2;
    cols.forEach(function(tp,ci){
      var arr=nodes.filter(function(n){return n.type===tp && n.visible;}).sort(function(a,b){return a.id.localeCompare(b.id,undefined,{numeric:true});});
      var x=left+ci*colGap, total=arr.length*rowGap, startY=midY-total/2+rowGap/2;
      arr.forEach(function(n,i){ n.x=x; n.y=startY+i*rowGap; });
    });
  }
  function layoutWeb(){
    var vis=nodes.filter(function(n){return n.visible;});
    vis.forEach(function(n){ if(!n.webInit){ var ci=TYPE_ORDER.indexOf(n.type); n.x=150+ci*140+(Math.random()*70-35); n.y=VB_H/2+(Math.random()*400-200); n.webInit=true; } });
    var ve=edges.filter(function(e){return e.a.visible&&e.b.visible;}), K=95;
    for(var it=0; it<300; it++){
      var al=1-it/300;
      for(var i=0;i<vis.length;i++){ for(var j=i+1;j<vis.length;j++){ var a=vis[i],b=vis[j],dx=a.x-b.x,dy=a.y-b.y,d2=dx*dx+dy*dy+0.01,d=Math.sqrt(d2),f=2800/d2*al,fx=dx/d*f,fy=dy/d*f; a.vx+=fx;a.vy+=fy;b.vx-=fx;b.vy-=fy; } }
      ve.forEach(function(e){ var dx=e.b.x-e.a.x,dy=e.b.y-e.a.y,d=Math.sqrt(dx*dx+dy*dy)+0.01,f=(d-K)*0.02*al,fx=dx/d*f,fy=dy/d*f; e.a.vx+=fx;e.a.vy+=fy;e.b.vx-=fx;e.b.vy-=fy; });
      vis.forEach(function(n){ n.vx+=(VB_W/2-n.x)*0.002*al; n.vy+=(VB_H/2-n.y)*0.002*al; if(n.pin){n.vx=0;n.vy=0;return;} n.x+=Math.max(-28,Math.min(28,n.vx)); n.y+=Math.max(-28,Math.min(28,n.vy)); n.vx*=0.85; n.vy*=0.85; });
    }
  }
  function updateEdge(e){
    var show=e.a.visible&&e.b.visible; e.line.style.display=show?'':'none'; if(!show) return;
    var ca=TYPE_ORDER.indexOf(e.a.type),cb=TYPE_ORDER.indexOf(e.b.type), s=ca<=cb?e.a:e.b, t=ca<=cb?e.b:e.a;
    var dx=t.x-s.x,dy=t.y-s.y,d=Math.sqrt(dx*dx+dy*dy)||1,ux=dx/d,uy=dy/d,p=15;
    e.line.setAttribute('x1',s.x+ux*p); e.line.setAttribute('y1',s.y+uy*p); e.line.setAttribute('x2',t.x-ux*p); e.line.setAttribute('y2',t.y-uy*p);
  }
  function draw(){
    nodes.forEach(function(n){ n.g.style.display=n.visible?'':'none'; if(!n.visible)return; n.g.setAttribute('transform','translate('+n.x+','+n.y+')'); n.text.textContent=labelOf(n); styleNode(n); });
    edges.forEach(updateEdge);
  }
  function emphasize(){
    var focus=selected||hovered, hl=null;
    if(focus){ hl={}; hl[focus.id]=1; adj[focus.id].forEach(function(id){hl[id]=1;}); }
    var q=search.trim().toLowerCase();
    nodes.forEach(function(n){ if(!n.visible)return; var op=1;
      if(hl){ op=hl[n.id]?1:0.1; }
      else if(q){ op=(n.id.toLowerCase().indexOf(q)>=0||n.title.toLowerCase().indexOf(q)>=0)?1:0.12; }
      n.g.style.opacity=op;
    });
    edges.forEach(function(e){ if(e.line.style.display==='none')return;
      if(hl){ var on=(e.a.id===focus.id||e.b.id===focus.id); e.line.style.opacity=on?0.95:0.05; e.line.setAttribute('stroke',on?TYPE_META[focus.type].color:'#cbd5e1'); e.line.setAttribute('stroke-width',on?'2.2':'1.2'); }
      else { e.line.style.opacity='0.65'; e.line.setAttribute('stroke','#cbd5e1'); e.line.setAttribute('stroke-width','1.4'); }
    });
  }
  function fitView(){
    var vis=nodes.filter(function(n){return n.visible;}); if(!vis.length){ view={k:1,tx:0,ty:0}; applyView(); return; }
    var a=1e9,b=1e9,c=-1e9,d=-1e9;
    vis.forEach(function(n){ a=Math.min(a,n.x-NW/2); c=Math.max(c,n.x+NW/2); b=Math.min(b,n.y-NH/2); d=Math.max(d,n.y+NH/2); });
    var pad=28,w=(c-a)+pad*2,h=(d-b)+pad*2,k=Math.min(VB_W/w,VB_H/h); k=Math.min(k,1.5);
    view.k=k; view.tx=(VB_W-k*(a+c))/2; view.ty=(VB_H-k*(b+d))/2; applyView();
  }
  function render(o){ o=o||{}; computeVisible(); if(selected&&!selected.visible){selected=null;showInfo(null);} if(o.layout){ mode==='flow'?layoutFlow():layoutWeb(); } draw(); emphasize(); if(o.fit) fitView(); }

  /* info panel */
  var info=document.getElementById('graphInfo');
  function showInfo(n){
    if(!n){ info.hidden=true; info.innerHTML=''; return; }
    var meta=TYPE_META[n.type], st=n.status?STATUS_META[n.status]:null;
    var nbs=adj[n.id].map(function(id){return nodeById[id];}).filter(function(x){return x&&x.visible;});
    var chips=nbs.map(function(x){return '<span class="g-nb-chip" data-id="'+x.id+'" style="background:'+TYPE_META[x.type].color+'">'+x.id+'</span>';}).join('');
    info.innerHTML='<button class="gi-close">×</button>'+
      '<h4><span class="gi-badge" style="background:'+meta.color+'">'+n.id+'</span>'+(st?'<span class="gi-st" style="color:'+st.color+'">● '+st.label+'</span>':'')+'</h4>'+
      '<div class="gi-title">'+esc(n.title)+'</div>'+
      (nbs.length?('<div class="gi-nb-label">เชื่อมกับ '+nbs.length+' รายการ</div><div class="gi-nb">'+chips+'</div>'):'<div class="gi-nb-label">— ไม่มีลิงก์เชื่อม —</div>')+
      '<a class="gi-jump" href="#'+n.id+'">↗ เปิดการ์ดเต็ม</a>';
    info.hidden=false;
    info.querySelector('.gi-close').onclick=function(){ selected=null; showInfo(null); emphasize(); };
    info.querySelectorAll('.g-nb-chip').forEach(function(c){ c.onclick=function(){ var nn=nodeById[c.getAttribute('data-id')]; if(nn){ selected=nn; showInfo(nn); emphasize(); } }; });
  }

  /* interactions */
  function toWorld(ev){ var m=gcanvas.getScreenCTM(); if(!m) return {x:0,y:0}; var pt=svg.createSVGPoint(); pt.x=ev.clientX; pt.y=ev.clientY; return pt.matrixTransform(m.inverse()); }
  function startNodeDrag(ev,n){
    if(mode!=='web') return;
    ev.stopPropagation(); dragging=true; n.pin=true; try{n.g.setPointerCapture(ev.pointerId);}catch(_){}
    function mv(e){ var p=toWorld(e); n.x=p.x; n.y=p.y; n.g.setAttribute('transform','translate('+n.x+','+n.y+')'); edges.forEach(function(e2){ if(e2.a===n||e2.b===n) updateEdge(e2); }); }
    function up(){ dragging=false; try{n.g.releasePointerCapture(ev.pointerId);}catch(_){} n.g.removeEventListener('pointermove',mv); n.g.removeEventListener('pointerup',up); }
    n.g.addEventListener('pointermove',mv); n.g.addEventListener('pointerup',up);
  }
  svg.addEventListener('pointerdown',function(ev){ if(ev.target.closest('.gnode')||ev.target.closest('.graph-info')) return;
    var sx=ev.clientX,sy=ev.clientY,tx=view.tx,ty=view.ty,fx=VB_W/svg.clientWidth,fy=VB_H/svg.clientHeight;
    try{svg.setPointerCapture(ev.pointerId);}catch(_){}
    function mv(e){ view.tx=tx+(e.clientX-sx)*fx; view.ty=ty+(e.clientY-sy)*fy; applyView(); }
    function up(){ try{svg.releasePointerCapture(ev.pointerId);}catch(_){} svg.removeEventListener('pointermove',mv); svg.removeEventListener('pointerup',up); }
    svg.addEventListener('pointermove',mv); svg.addEventListener('pointerup',up);
  });
  bg.addEventListener('click',function(){ if(selected){ selected=null; showInfo(null); emphasize(); } });
  svg.addEventListener('wheel',function(ev){ ev.preventDefault(); var p=toWorld(ev); var f=ev.deltaY<0?1.12:1/1.12; var nk=Math.max(0.2,Math.min(3.5,view.k*f)); var vx=view.tx+view.k*p.x, vy=view.ty+view.k*p.y; view.k=nk; view.tx=vx-nk*p.x; view.ty=vy-nk*p.y; applyView(); },{passive:false});

  /* controls */
  var tf=document.getElementById('gTypeFilters');
  TYPE_ORDER.forEach(function(tp){ if(!nodes.some(function(n){return n.type===tp;}))return;
    var b=document.createElement('button'); b.className='g-chip-btn'; b.textContent=tp; b.style.background=TYPE_META[tp].color; b.title=TYPE_META[tp].label;
    b.onclick=function(){ typeOn[tp]=!typeOn[tp]; b.classList.toggle('off',!typeOn[tp]); render({layout:true,fit:true}); };
    tf.appendChild(b);
  });
  document.querySelectorAll('.g-mode-btn').forEach(function(b){ b.onclick=function(){ mode=b.getAttribute('data-mode'); document.querySelectorAll('.g-mode-btn').forEach(function(x){x.classList.toggle('active',x===b);}); render({layout:true,fit:true}); }; });
  document.querySelectorAll('.g-status-btn').forEach(function(b){ b.classList.add('active'); b.onclick=function(){ var s=b.getAttribute('data-st'); statusOn[s]=!statusOn[s]; b.classList.toggle('active',statusOn[s]); render({layout:true,fit:true}); }; });
  document.getElementById('gSearch').addEventListener('input',function(){ search=this.value; emphasize(); });
  document.getElementById('gCustomer').onclick=function(){ customer=!customer; this.classList.toggle('active',customer); svg.classList.toggle('customer',customer); document.getElementById('graphWrap').classList.toggle('customer',customer); render({}); };
  document.getElementById('gFit').onclick=function(){ fitView(); };
  document.getElementById('gExport').onclick=function(){ exportPng(); };
  function exportPng(){
    var clone=svg.cloneNode(true); clone.setAttribute('xmlns',SVGNS); clone.setAttribute('width',VB_W); clone.setAttribute('height',VB_H);
    var xml=new XMLSerializer().serializeToString(clone);
    var url='data:image/svg+xml;base64,'+btoa(unescape(encodeURIComponent(xml)));
    var img=new Image();
    img.onload=function(){ var sc=2,cv=document.createElement('canvas'); cv.width=VB_W*sc; cv.height=VB_H*sc; var cx=cv.getContext('2d'); cx.fillStyle=customer?'#fbfaf6':'#ffffff'; cx.fillRect(0,0,cv.width,cv.height); cx.drawImage(img,0,0,cv.width,cv.height); cv.toBlob(function(bl){ var a=document.createElement('a'); a.href=URL.createObjectURL(bl); a.download='requirement-graph-'+mode+'.png'; document.body.appendChild(a); a.click(); a.remove(); setTimeout(function(){URL.revokeObjectURL(a.href);},1500); }); };
    img.onerror=function(){ alert('บันทึกรูปไม่สำเร็จบนเบราว์เซอร์นี้'); };
    img.src=url;
  }

  render({layout:true,fit:true});
})();
