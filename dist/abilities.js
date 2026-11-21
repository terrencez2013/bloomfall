function resolveSummonCollisions(){
  for(let pass=0;pass<6;pass++)for(const b of summons){if(b.life<=0||b.hp<=0)continue;for(const e of enemies){
    if(e.dead||e.hp<=0)continue;
    const dx=b.x-e.x,dy=b.y-e.y,d=Math.hypot(dx,dy),minDistance=b.r+e.r+.25;
    if(d>=minDistance)continue;
    const nx=d>1e-8?dx/d:Math.cos(b.phase||0),ny=d>1e-8?dy/d:Math.sin(b.phase||0);
    const mobMass=Math.pow(e.r/12,2)*(e.boss?3:1),fraction=mobMass/(mobMass+b.mass),overlap=minDistance-d;
    b.x+=nx*overlap*fraction;b.y+=ny*overlap*fraction;e.x-=nx*overlap*(1-fraction);e.y-=ny*overlap*(1-fraction);
    b.x=Math.max(b.r,Math.min(w-b.r,b.x));b.y=Math.max(70,Math.min(h-45,b.y));
    e.x=Math.max(e.r,Math.min(w-e.r,e.x));e.y=Math.max(70,Math.min(h-45,e.y));
    // If a wall blocks one body's movement, give the unused separation to the other body.
    let remaining=minDistance-Math.hypot(b.x-e.x,b.y-e.y);
    if(remaining>0){
      e.x=Math.max(e.r,Math.min(w-e.r,e.x-nx*remaining));e.y=Math.max(70,Math.min(h-45,e.y-ny*remaining));
      remaining=minDistance-Math.hypot(b.x-e.x,b.y-e.y);
      if(remaining>0){b.x=Math.max(b.r,Math.min(w-b.r,b.x+nx*remaining));b.y=Math.max(70,Math.min(h-45,b.y+ny*remaining));}
    }
  }}
}
function consumeRose(i){const p=s.loadout[i],life=petalLife(i);if(p.t!==1||life.cool>0||hp<=0||hp>maxHP()*.7)return false;hp=Math.min(maxHP(),hp+maxHP()*.35);life.hp=0;life.cool=petalReload(p);burst(player.x,player.y,'#f28aa7',18);return true;}
function triggerHitAbility(i,enemy,x,y){const p=s.loadout[i],life=petalLife(i);if(life.cool>0)return;if(p.t===9){let target=enemy,from={x,y},hit=new Set();for(let j=0;j<4&&target;j++){target.hp-=power(p)*.8;target.hit=.15;hit.add(target);arcs.push({x:from.x,y:from.y,tx:target.x,ty:target.y,life:.22});from=target;target=enemies.filter(e=>!e.dead&&e.hp>0&&!hit.has(e)&&Math.hypot(e.x-from.x,e.y-from.y)<140).sort((a,b)=>Math.hypot(a.x-from.x,a.y-from.y)-Math.hypot(b.x-from.x,b.y-from.y))[0];}}else if(p.t===17&&Math.random()<.3){novas.push({x,y,radius:0,life:.65,damage:power(p)*3.5,hit:new Set()});burst(x,y,'#ffe993',22);}}
let summons=[],arcs=[],recipe=null,craftMessage='Your next bloom is waiting.';
function showTab(name){tab=name;keys={};pointer=null;document.querySelectorAll('.page').forEach(p=>p.classList.toggle('hidden',p.id!==name));document.querySelectorAll('.nav').forEach(p=>p.classList.toggle('active',p.dataset.tab===name));render();}
function openCrafting(){if(inventoryOpen)toggleInventory(false);showTab('crafting');}
function available(p){return Math.max(0,p.n-s.loadout.filter(q=>q.t===p.t&&q.r===p.r).length);}
function renderCrafting(){const owned=s.inventory.filter(p=>p.n>0).slice().sort((a,b)=>TYPES[a.t][0].localeCompare(TYPES[b.t][0])||a.r-b.r);$('craft-stacks').innerHTML=owned.map(p=>'<button data-recipe="'+p.t+','+p.r+'" class="craft-stack '+(canMerge(p)?'merge-ready ':'')+(recipe&&recipe[0]===p.t&&recipe[1]===p.r?'chosen':'')+'" style="--rarity:'+RC[p.r]+'" title="'+TYPES[p.t][0]+' · '+RARITIES[p.r]+'"><span>'+TYPES[p.t][1]+'</span><b>'+TYPES[p.t][0]+'</b><small>'+RARITIES[p.r]+' · '+available(p)+' free</small></button>').join('');const p=recipe&&item(...recipe),count=p?available(p):0;$('recipe-title').textContent=p?RARITIES[p.r]+' '+TYPES[p.t][0]:'Select a petal';$('craft-ring').innerHTML=Array.from({length:5},(_,i)=>'<div class="craft-input '+(i<count?'filled':'')+'" style="--angle:'+(i*72-90)+'deg;--unangle:'+(-(i*72-90))+'deg;--rarity:'+(p?RC[p.r]:'#9eac91')+'"><span>'+(p&&i<count?TYPES[p.t][1]:'?')+'</span></div>').join('')+'<div class="craft-output" style="border-color:'+(p?RC[Math.min(MAX_RARITY,p.r+1)]:'#9eac91')+'">'+(p?TYPES[p.t][1]:'✿')+'<small>'+(p?(p.r===MAX_RARITY?'MAX':RARITIES[p.r+1]):'RESULT')+'</small></div>';$('recipe-info').textContent=p?(p.r===MAX_RARITY?'Already at maximum rarity.':count+' / 5 available · '+fmt(power({t:p.t,r:p.r+1}))+' DPS · '+fmtPetalHP(petalHP({t:p.t,r:p.r+1}))+' HP'):'Select any stack from your collection.';$('craft-result').textContent=craftMessage;$('craft-one').disabled=!p||p.r>=MAX_RARITY||count<5;$('craft-all').disabled=$('craft-one').disabled;}
function craftBatch(all){const p=recipe&&item(...recipe);if(!p||p.r>=MAX_RARITY)return;const n=all?Math.floor(available(p)/5):available(p)>=5?1:0;if(!n)return;p.n-=n*5;addPetal(p.t,p.r+1,n);craftMessage='✓ Crafted '+n+' × '+RARITIES[p.r+1]+' '+TYPES[p.t][0]+'!';toast(craftMessage);save();render();$('craft-ring').classList.remove('crafted');void $('craft-ring').offsetWidth;$('craft-ring').classList.add('crafted');}
function updateAbilities(dt,orbit){for(const n of novas){const old=n.radius;n.radius=Math.min(220,n.radius+440*dt);n.life-=dt;for(const e of enemies){const d=Math.hypot(e.x-n.x,e.y-n.y);if(!e.dead&&!n.hit.has(e)&&d<=n.radius+e.r&&d+e.r>=old){n.hit.add(e);e.hp-=n.damage;e.hit=.25;burst(e.x,e.y,'#ffdc76',10);}}}novas=novas.filter(n=>n.life>0);arcs=arcs.filter(a=>(a.life-=dt)>0);for(let i=0;i<s.loadout.length;i++){const p=s.loadout[i],life=petalLife(i);if(life.cool>0)continue;if(p.t===1&&consumeRose(i))continue;life.ability=Math.max(0,(life.ability||0)-dt);const a=petalAngle(i),x=player.x+Math.cos(a)*orbitRadius(i,orbit),y=player.y+Math.sin(a)*orbitRadius(i,orbit);if(p.t===12&&life.ability===0){if(summons.filter(b=>b.owner===i).length<2){summons.push({x,y,owner:i,key:life.key,life:12,r:18,mass:6,hp:72*Math.pow(2,p.r),damage:power(p)*1.2,phase:i});burst(x,y,'#c2a5e4',8);}life.ability=5;}}
 for(const b of summons){b.life-=dt;const p=s.loadout[b.owner];if(!p||p.t!==12||petalLife(b.owner).key!==b.key||petalLife(b.owner).cool>0){b.life=0;continue;}const target=enemies.filter(e=>!e.dead).sort((a,c)=>Math.hypot(a.x-b.x,a.y-b.y)-Math.hypot(c.x-b.x,c.y-b.y))[0];let tx=player.x+Math.cos(elapsed+b.phase)*40,ty=player.y+Math.sin(elapsed+b.phase)*40;const chasing=target&&Math.hypot(target.x-player.x,target.y-player.y)<320;if(chasing){tx=target.x;ty=target.y;}const dx=tx-b.x,dy=ty-b.y,d=Math.hypot(dx,dy)||1;const travel=Math.min(Math.max(0,d-(chasing?target.r+b.r:0)),160*dt);b.x+=dx/d*travel;b.y+=dy/d*travel;if(target&&Math.hypot(target.x-b.x,target.y-b.y)<target.r+b.r+.5){target.hp-=b.damage*dt;target.hit=.08;const massRatio=b.mass/(b.mass+Math.pow(target.r/12,2)*(target.boss?3:1));pushFrom(target,b.x,b.y,110*massRatio*dt,15,75,h-45,b.phase);pushFrom(b,target.x,target.y,55*(1-massRatio)*dt,b.r,75,h-45,b.phase+Math.PI);b.hp-=dt*(target.boss?18:7);}if(b.hp<=0)b.life=0;}summons=summons.filter(b=>b.life>0);}
function drawAbilities(){for(const n of novas){ctx.globalAlpha=Math.min(1,n.life*2);circle(n.x,n.y,Math.max(1,n.radius),'#f6d27418','#ffcf55');circle(n.x,n.y,Math.max(1,n.radius-5),'#ffffff00','#fff4bd');for(let j=0;j<12;j++){const a=j/12*TAU;circle(n.x+Math.cos(a)*n.radius,n.y+Math.sin(a)*n.radius,3,'#fff5c7');}ctx.globalAlpha=1;}for(const b of summons){ctx.save();ctx.translate(b.x,b.y);ctx.scale(b.r/9,b.r/9);circle(2,4,9,'#35452f33');for(const side of [-1,1])for(let j=0;j<3;j++)limb([[side*4,-4+j*4],[side*10,-5+j*5]],'#7b5c8f',1);shell(0,0,7,9,'#d6bbff','#725091');limb([[0,-7],[0,7]],'#73518f',1);oval(-3,-2,1.5,4,'#f8edff99');circle(-2,-4,1.5,'#fff7da');circle(2,-4,1.5,'#fff7da');ctx.strokeStyle='#a88cc0';ctx.lineWidth=1;ctx.beginPath();ctx.arc(0,0,12,-Math.PI/2,-Math.PI/2+TAU*b.life/12);ctx.stroke();ctx.restore();}for(const a of arcs){const mx=(a.x+a.tx)/2,my=(a.y+a.ty)/2;limb([[a.x,a.y],[mx+8,my-8],[mx-5,my+6],[a.tx,a.ty]],'#86dbef',4);limb([[a.x,a.y],[mx+8,my-8],[mx-5,my+6],[a.tx,a.ty]],'#f1ffff',1.5);}}
document.addEventListener('DOMContentLoaded',()=>{$('craft-one').onclick=()=>craftBatch(false);$('craft-all').onclick=()=>craftBatch(true);});









