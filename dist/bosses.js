let bossFields=[];
function bossField(owner,type,x,y,r,delay=.8,life=2.5){bossFields.push({owner,type,x:Math.max(30,Math.min(w-30,x)),y:Math.max(80,Math.min(h-50,y)),r,delay,life,radius:0});}
function aimedFan(e,count,speed,spread=.18){const angle=Math.atan2(player.y-e.y,player.x-e.x);for(let i=0;i<count;i++){const a=angle+(i-(count-1)/2)*spread;shots.push({x:e.x,y:e.y,vx:Math.cos(a)*speed,vy:Math.sin(a)*speed,life:4,r:5,owner:e,damageScale:e.damageScale||1});}}
function bossDashWarning(e,ax,ay,d){if(d>240||e.charge>0||e.dashWindup>0)return false;e.vx=ax/d*280;e.vy=ay/d*280;e.dashWindup=.5;return true;}
function bossSpecial(e,ax,ay,d){
  const furious=e.hp/e.max<.4;e.attackRound=(e.attackRound||0)+1;
  if(e.kind===0){if(!bossDashWarning(e,ax,ay,d)){e.cool=.1;return;}bossField(e,'stomp',e.x,e.y,125,.5,.85);}
  if(e.kind===1){for(let i=0;i<(furious?5:3);i++){const a=i*TAU/(furious?5:3)+e.attackRound*.7;bossField(e,'thorns',player.x+Math.cos(a)*65,player.y+Math.sin(a)*65,36,.85,2.4);}aimedFan(e,3,110,.28);}
  if(e.kind===2){const capacity=waveTrait().cap||24;for(let i=0;i<(furious?4:3)&&enemies.length<capacity;i++)spawn(false,i===0?1:0);bossField(e,'honey',player.x,player.y,65,.8,3);aimedFan(e,furious?5:3,150);}
  if(e.kind===3){bossField(e,'stomp',e.x,e.y,furious?260:210,.7,1.5);e.hp=Math.min(e.max,e.hp+e.max*.015);}
  if(e.kind===4){for(let i=0;i<3;i++){const a=i*TAU/3+e.attackRound*.6;bossField(e,'web',player.x+Math.cos(a)*70,player.y+Math.sin(a)*70,48,.8,3.4);}aimedFan(e,furious?7:5,125,.15);}
  if(e.kind===5){const season=(e.attackRound-1)%3;e.season=season;if(season===0){radial(e,furious?24:18,125,e.attackRound*.4);bossDashWarning(e,ax,ay,d);}if(season===1){bossField(e,'thorns',player.x,player.y,80,.9,2);radial(e,10,100,e.t);}if(season===2){bossField(e,'stomp',e.x,e.y,280,.8,1.5);bossField(e,'honey',player.x,player.y,55,1,2.5);}}
  if(e.kind!==0)bossImpact(e,6);
}
function updateBossFields(dt){for(const f of bossFields){if(f.owner.dead||f.owner.hp<=0){f.life=0;continue;}if(f.delay>0){f.delay=Math.max(0,f.delay-dt);continue;}f.life-=dt;if(f.type==='stomp'){f.radius=Math.min(f.r,f.radius+220*dt);if(Math.abs(Math.hypot(player.x-f.x,player.y-f.y)-f.radius)<17){hurt(20*difficulty().damage*(f.owner.damageScale||1),f.owner);pushFrom(player,f.x,f.y,110*dt,25,70,h-50);}}else if(f.type==='thorns'&&Math.hypot(player.x-f.x,player.y-f.y)<f.r+12)hurt(14*difficulty().damage*(f.owner.damageScale||1),f.owner);}
  bossFields=bossFields.filter(f=>f.life>0&&!f.owner.dead&&f.owner.hp>0);
}
function bossTerrainSpeed(){return bossFields.some(f=>f.delay<=0&&(f.type==='web'||f.type==='honey')&&Math.hypot(player.x-f.x,player.y-f.y)<f.r+10)?.55:1;}
function drawBossFields(){ctx.save();for(const f of bossFields){const warning=f.delay>0,color=f.type==='honey'?'#db9823':f.type==='web'?'#8a60c7':f.type==='stomp'?'#d47739':'#ce4c78';ctx.setLineDash(warning?[6,5]:[]);circle(f.x,f.y,f.type==='stomp'&&!warning?Math.max(1,f.radius):f.r,warning?'#ffffff10':f.type==='thorns'?'#ef799f35':f.type==='honey'?'#ffcb4b55':f.type==='web'?'#bba1e044':'#ffbc4010',color);ctx.setLineDash([]);if(f.type==='web'){for(let i=0;i<6;i++){const a=i*TAU/6;limb([[f.x,f.y],[f.x+Math.cos(a)*f.r,f.y+Math.sin(a)*f.r]],'#9373be99',1);}circle(f.x,f.y,f.r*.5,'#ffffff00','#a386c399');}if(warning){ctx.fillStyle=color;ctx.font='bold 11px sans-serif';ctx.textAlign='center';ctx.fillText(f.type==='stomp'?'STOMP':f.type==='thorns'?'THORNS':f.type==='web'?'WEB':'HONEY',f.x,f.y+4);}else if(f.type==='thorns'){for(let i=0;i<7;i++){const a=i*TAU/7;circle(f.x+Math.cos(a)*f.r*.6,f.y+Math.sin(a)*f.r*.6,3,'#b53967');}}}ctx.restore();}
