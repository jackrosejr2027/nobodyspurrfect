// 50 named card animations for the Solitaire games. Each card event plays the next style in turn.
(() => {
  const NAMES=['Swoosh','Hop','Skid','Cartwheel','Pinwheel','Boomerang','Zigzag Dash','Lazy Glide','Rocket Arc','Tumble','Feather','Bounce Home','Double Hop','Slingshot','Corkscrew','Moonwalk','Paper Plane','Hover','Snap','Whirl','Ski Jump','Pendulum','Ribbon','Spiral In','Teleport Pop','Wind Drift','Stomp','Tiptoe','Roller','Ping Pong','Meteor','Drift Flip','Trampoline','Yo-Yo','Wave Glide','Moped','Sashay','Kickflip','Tossed Coin','Rubber Band','Parachute','Zoom Loop','Bobsled','Wobble Walk','Carousel','Confetti Hop','Soft Landing','Quickstep','Gyro','Hop Skip'];
  const PATHS=['arc','zigzag','loop','bounce','straight','swoop','hop','pendulum','spiral','swing'];
  const SPINS=[0,90,180,360,-180,-360,540,-90];
  const EXITS=['shrink','spin','sink','pop','drop','lift','fade','slide'];
  const SCALES=[1,1.08,1.15,.92,1.2];
  const styles=NAMES.map((name,id)=>({id,name,path:PATHS[id%10],spin:SPINS[(id*3)%8],scale:SCALES[id%5],arc:14+(id*7)%34,exit:EXITS[id%8],flip:id%6===0}));
  const round=n=>Math.round(n*10)/10;
  // Midpoint of the travel, relative to the destination, for each path shape.
  function mid(s,dx,dy){const a=s.arc,side=s.id%2?1:-1;
    switch(s.path){
      case 'arc':return[dx*.5,dy*.5-a];
      case 'zigzag':return[dx*.5+side*a,dy*.5];
      case 'loop':return[dx*.5+a*.6,dy*.5-a*.6];
      case 'bounce':return[-dx*.06,-dy*.06-a*.3];
      case 'swoop':return[dx*.7,dy*.25+a];
      case 'hop':return[dx*.5,dy*.5-a*1.4];
      case 'pendulum':return[dx*.25,dy*.25+a*.5];
      case 'spiral':return[dx*.3,dy*.3];
      case 'swing':return[dx*.5-side*a*.5,dy*.5];
      default:return[dx*.5,dy*.5];
    }}
  const move=(x,y,rot,sc,flip)=>'translate('+round(x)+'px,'+round(y)+'px) rotate('+rot+'deg) rotateY('+flip+'deg) scale('+sc+')';
  function exitTransform(s){const sign=s.id%2?1:-1;
    switch(s.exit){
      case 'shrink':return'scale(.15) rotate('+s.spin/2+'deg)';
      case 'spin':return'rotate('+s.spin*2+'deg) scale(.1)';
      case 'sink':return'translateY(40px) scale(.9)';
      case 'pop':return'scale(0)';
      case 'drop':return'translateY(120px) rotate('+s.spin+'deg)';
      case 'lift':return'translateY(-80px)';
      case 'slide':return'translateX('+sign*120+'px) rotate('+sign*12+'deg)';
      default:return'none';
    }}
  // Keyframes for one card event. kind: move | swap | fall | clear | remove | deal | reveal | invalid | (anything else pulses).
  function frames(id,kind='move',dx=0,dy=0){
    const s=styles[((id%50)+50)%50];
    if(kind==='move'||kind==='swap'||kind==='fall'){const[mx,my]=mid(s,dx,dy);
      return[{transform:move(dx,dy,0,1,0),opacity:1},{transform:move(mx,my,s.spin/2,s.scale,s.flip?180:0),opacity:1,offset:.5},{transform:move(0,0,s.spin,1,0),opacity:1}];}
    if(kind==='clear'||kind==='remove')return[{transform:'none',opacity:1},{transform:'scale(1.05)',opacity:1,offset:.4},{transform:exitTransform(s),opacity:0}];
    if(kind==='reveal')return[{transform:'rotateY(90deg)',opacity:1},{transform:'rotateY(-8deg)',opacity:1,offset:.6},{transform:'none',opacity:1}];
    if(kind==='deal')return[{transform:'translateY(-'+(40+s.arc)+'px) rotate('+s.spin+'deg) scale(.85)',opacity:0},{transform:'translate(0,2px) scale(1.02)',opacity:1,offset:.6},{transform:'none',opacity:1}];
    if(kind==='invalid'){const a=6+s.arc/3;return[{transform:'translateX(0)'},{transform:'translateX(-'+a+'px)',offset:.2},{transform:'translateX('+a+'px)',offset:.45},{transform:'translateX(-'+a/2+'px)',offset:.7},{transform:'translateX(0)'}];}
    return[{transform:'scale(1)'},{transform:'scale(1.06) rotate('+s.spin/8+'deg)',offset:.5},{transform:'scale(1)'}];
  }
  window.SolitaireMotion={styles,names:NAMES,count:NAMES.length,frames};
})();
