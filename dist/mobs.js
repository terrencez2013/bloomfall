// Procedural wildlife: shaded shells, segmented legs, veined wings and animated antennae.
function oval(x,y,rx,ry,color,stroke){ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);ctx.fillStyle=color;ctx.fill();if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=1.2;ctx.stroke();}}
function shell(x,y,rx,ry,light,dark){const g=ctx.createRadialGradient(x-rx*.35,y-ry*.4,1,x,y,Math.max(rx,ry)*1.2);g.addColorStop(0,light);g.addColorStop(1,dark);oval(x,y,rx,ry,g,dark);}
function limb(points,color,width=2){ctx.beginPath();ctx.moveTo(...points[0]);points.slice(1).forEach(p=>ctx.lineTo(...p));ctx.strokeStyle=color;ctx.lineWidth=width;ctx.lineCap='round';ctx.stroke();}
function drawBugDetails(kind,t){
  ctx.save();
  if(kind===0||kind===2){
    ctx.globalAlpha=.28;oval(-8,-5,3,9,'#fffde7');
    ctx.globalAlpha=.85;circle(-8,-11,1.6,'#fffdf1');circle(-6,-8,1,'#fffdf1');
    ctx.globalAlpha=.5;limb([[7,14],[10,9],[11,2]],kind===0?'#ffd5a1':'#c5ffb7',1.2);
  }
  if(kind===1){
    ctx.globalAlpha=.75;
    for(const side of [-1,1]){
      limb([[side*10,3],[side*25,-15]],'#fffdf1',.8);
      limb([[side*17,-5],[side*25,-3]],'#ffffffaa',.7);
    }
    oval(-4,-2,2,13,'#fff6b5');
  }
  if(kind===3){
    ctx.globalAlpha=.8;
    for(const side of [-1,1]){oval(side*7,7,2.5,5,'#ffd494');circle(side*4,-15,1,'#ffffff');}
    limb([[0,-2],[0,16]],'#e8c1ff',1);
  }
  if(kind===5){ctx.globalAlpha=.7;for(let j=0;j<7;j++){const a=j*TAU/7;circle(Math.cos(a)*15,Math.sin(a)*17,1.5,'#ddf6a3');}}
  if(kind===4||kind===6){ctx.globalAlpha=.9;for(let j=0;j<7;j++){const a=j*TAU/7+t*.1;circle(Math.cos(a)*10,Math.sin(a)*10,1.4,'#fff5ad');}}
  ctx.restore();
}
function drawMob(e){ctx.save();ctx.translate(e.x,e.y);oval(3,e.r*.6,e.r*1.05,e.r*.5,'#254c3833');ctx.rotate(Math.atan2(player.y-e.y,player.x-e.x)+Math.PI/2);const size=e.r;ctx.scale(size/20,size/20);const walk=Math.sin(e.t*10)*2;let kind=e.boss?[0,4,1,5,3,6][e.kind]:[0,1,2,3][e.kind];
 if(kind===4||kind===6){for(let ring=2;ring>=0;ring--)for(let i=0;i<7;i++){ctx.save();ctx.rotate(i/7*TAU+ring*.38+Math.sin(e.t)*.05);shell(0,-9-ring*3,6+ring*2,11,kind===4?'#ff9da3':'#edd1ff',kind===4?'#b62d65':'#9c5ab8');limb([[0,-4],[0,-17]],'#ffffff35',.7);ctx.restore();}circle(0,0,6,'#ffce63','#a57031');for(let i=0;i<8;i++)circle(Math.cos(i)*4,Math.sin(i)*4,1,'#8f652f');}
 else if(kind===5){for(let side of [-1,1]){oval(side*17,-11,7,10,'#88ac59','#456f45');oval(side*16,13,7,9,'#6e9b4c','#456f45');}shell(0,0,20,24,'#a6c868','#365e43');for(let i=0;i<6;i++){const a=i/6*TAU;limb([[0,0],[Math.cos(a)*12,Math.sin(a)*14],[Math.cos(a)*19,Math.sin(a)*22]],'#3c714c',1.4);}shell(0,0,11,13,'#8eb853','#426d43');shell(0,-25,8,10,'#b9cd77','#658950');circle(-3,-29,1.4,'#263c2a');circle(3,-29,1.4,'#263c2a');}
 else {for(let side of [-1,1])for(let i=0;i<(kind===3?4:3);i++){const y=-9+i*8,step=walk*(i%2?1:-1);limb([[side*8,y],[side*20,y+step-4],[side*26,y+step+7]],kind===3?'#65417c':'#4d4935',kind===3?2.4:1.8);}
 if(kind===1){ctx.save();ctx.rotate(Math.sin(e.t*38)*.13);for(let side of [-1,1]){oval(side*17,-4,12,18,'#e9fcffd0','#96bfc0');limb([[side*8,4],[side*21,-13],[side*16,-2]],'#8eb1b660',.8);}ctx.restore();shell(0,2,12,20,'#ffe777','#d49422');for(let y of [-7,3,13]){ctx.save();ctx.beginPath();ctx.ellipse(0,2,12,20,0,0,TAU);ctx.clip();ctx.fillStyle='#494031';ctx.fillRect(-13,y,26,5);ctx.restore();}limb([[0,21],[0,26]],'#554236',2);}
 else if(kind===2){shell(0,2,16,21,'#8fffe0','#14789a');shell(-5,0,7,18,'#5fcab7','#205d74');shell(5,0,7,18,'#92e6b8','#28717b');limb([[0,-16],[0,22]],'#245e70',1);for(let i=0;i<5;i++)limb([[-11,-9+i*6],[-3,-7+i*6]],'#b6ffdc77',.8);}
 else if(kind===3){shell(0,8,16,19,'#d4a9ff','#713c99');shell(0,-10,11,12,'#9365ae','#513761');for(let side of [-1,1])for(let i=0;i<2;i++)circle(side*(3+i*4),-14+(i%2)*2,2.3,'#fff0ce','#543947');for(let i=0;i<3;i++)oval(0,2+i*8,4,2,'#edb58c');}
 else{shell(0,2,18,22,'#ff9c6c','#bf2846');limb([[0,-18],[0,24]],'#663b3d',1.4);for(let side of [-1,1])for(let i=0;i<3;i++)oval(side*(i===1?11:7),-9+i*11,3.6,4.3,'#3d343b');oval(-7,-9,4,9,'#fff8d640');}
 if(kind!==3){shell(0,-20,10,8,kind===1?'#7b6546':'#55565a','#313a38');for(let side of [-1,1]){limb([[side*5,-25],[side*9,-32+walk*.4],[side*13,-34]],'#48503e',1.3);circle(side*13,-34,1.8,'#565b42');circle(side*5,-23,2,'#fff1c2');circle(side*5,-24,1,'#344035');}}}
 drawBugDetails(kind,e.t);if(e.hit>0){ctx.globalAlpha=.35;oval(0,0,18,20,'#fff7c0');ctx.globalAlpha=1;}ctx.restore();if(!e.boss&&e.tier){circle(e.x,e.y,e.r+5,'#ffffff00',e.tier===2?'#bf7ce9':'#e7ad48');ctx.font='bold 10px sans-serif';ctx.textAlign='center';ctx.fillStyle=e.tier===2?'#8650a8':'#996f29';ctx.fillText(e.tier===2?'◆ CHAMPION':'★ ELITE',e.x,e.y-e.r-17);}if(e.boss&&e.dashWindup>0){ctx.setLineDash([7,5]);limb([[e.x,e.y],[e.x+e.vx*.75,e.y+e.vy*.75]],'#e8733a',3);ctx.setLineDash([]);circle(e.x,e.y,e.r+11,'#ffb34722','#e8733a');ctx.font='bold 10px sans-serif';ctx.textAlign='center';ctx.fillStyle='#a24f28';ctx.fillText('CHARGING',e.x,e.y-e.r-20);}if(e.boss){circle(e.x,e.y,e.r+7,'#ffffff00','#c89b5a80');if(e.charge>0){limb([[e.x,e.y],[e.x+e.vx*.4,e.y+e.vy*.4]],'#d5606377',3);}}}


