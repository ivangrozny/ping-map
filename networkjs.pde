String[] tmp, tri ;
String[][] mapp ;
float[][] points ;  
int[][] links ;

float  x,y,z, x1, y1, z1, x2, y2, z2 , fadeOut;
float[][] ping = new float[194][15];
float[] pingOld = new float[194];
PVector[] vPos = new PVector[200] ;

// globe responsive size
float globSize = (window.innerWidth*0.9 > window.innerHeight) ? window.innerHeight/4.6 : window.innerWidth/11;  
int t = 1, 
fps = 30, 
fpss = fps*15, // 15 seconds between each pingMap actualisation
startFadeOut = 90, // start fadeout in second from actualisation
fadeOutSpeed = 0.011; // fadeout speed in second 

void setup() {
  size(1,1);
  noSmooth();
  frameRate(fps);
  dataRequest("savedPing.txt");
  dataRequest("doping/ping.txt");
  mapSetup();
}

void draw() {
  if (frameCount%(fpss*10)==0) dataRequest("doPing/ping.txt");
  if (frameCount%(fpss)==0) t++ ;  if(t==11) t = 1 ; 

  // labels fadeout speed
  if (frameCount%fpss > fpss-startFadeOut && frameCount%fpss < fpss) fadeOut -= fadeOutSpeed ;

  if ( typeof group !== 'undefined' ) display();
  displayText();
}

void display() {

  // sonar sound
  if(frameCount%(fpss) == int(fpss-3.9*fps) ) { sonar.stop().play(); }

    for(int i=0; i<links.length; i++){
      float coef1 = pos(links[i][0]);
      float coef2 = pos(links[i][1]);
      x1 = coef1*vPos[ links[i][0] ].x ;
      y1 = coef1*vPos[ links[i][0] ].y ;
      z1 = coef1*vPos[ links[i][0] ].z ;
      x2 = coef2*vPos[ links[i][1] ].x ;
      y2 = coef2*vPos[ links[i][1] ].y ;
      z2 = coef2*vPos[ links[i][1] ].z ;

// TRIANGULATION MAP LINES
      if ( pos(links[i][0]) != 0  && pos(links[i][1]) != 0 ){
            groupLines.children[i].geometry.vertices[0].set(x1,y1,z1);
            groupLines.children[i].geometry.vertices[1].set(x2,y2,z2) ;
            groupLines.children[i].geometry.verticesNeedUpdate = true ;
      }
    }  
    for (int i = 0; i<tmp.length; i++){
      float coef1 = pos(i);
      float coef2 = pos(i);
      x = coef1*vPos[ i ].x ;
      y = coef1*vPos[ i ].y ;
      z = coef1*vPos[ i ].z ;

      if ( frameCount%fpss-1 == int( map(ping[i][t],0,12000,0,fpss*5) ) ){     
        int ran = floor(random(0,11));
        clic[ ran ].stop().play();
        displayLinesCenter(i, x, y, z);

// LABELS NAMES
        group.children[i].position.set( x, y, z );
        group.children[i].material.opacity = 1 ;
        group.children[i].name =  int(ping[i][t]);
        //group.children[i].material.overdraw = true;  // affichage safari ?
      }
//   FADEOUT LABELS
      if ( frameCount%fpss == fpss-startFadeOut ) fadeOut = 1;    
      if ( frameCount%fpss  > fpss-startFadeOut && frameCount%fpss < fpss ){
        group.children[i].material.opacity = fadeOut ;
      }
      

      if ( frameCount%fpss == fpss-1 ) 
        pingOld[i] = ping[i][t];
    }
}

int timer(int index){
  int timer = 0;
  if (frameCount%fpss < map(ping[index][t],0,12000,0,fpss*5) )
    { timer = 1; }else{ timer = 2; }
  return timer;
}

float pos(int index){

  float r = 0;
  if (timer(index)==1) { r = ( log(1+ pingOld[index]/10 )-1.3  ) *globSize  ;  // r = (0.005 * pingOld[index] ) * globSize;
  } else {               r = ( log(1+ ping[index][t]/10 )-1.3  ) *globSize  ; }
  
  r = constrain(r, 10, 430);
  return r;
}
void dataRequest(String dataPath) {
  String[] data = loadStrings(dataPath);
  if( data!=null ){
    for (int i = 0; i<data.length; i++){  
      String[] temp = splitTokens( data[i], " ");

      for (int j = 0; j<temp.length; j++){ 
        
        if( int(temp[0]) <= 193 && int(temp[j])>1 )
          ping[ i ][j] = float(temp[j]) ;
      }
    }
  }
}
// send ping time data to html DOM layer
void displayText(){ 
  for (int i = 0; i<tmp.length; i++){
    if(timer(i)==2)
      document.getElementById( mapp[i][1].toUpperCase() ).innerHTML = int(ping[i][t]) ;
    if(timer(i)==1)
      document.getElementById( mapp[i][1].toUpperCase() ).innerHTML = "_" ;
  }
}

void mapSetup(){
  // load world-map countries location
  tmp = loadStrings("data/mapOrdered.txt");
  mapp =  new String[tmp.length][6];

  for (int i = 0; i<tmp.length; i++){
    String[] tmp2 = split( tmp[i] , ',' ); 
    for (int j = 0; j<tmp2.length; j++){
      mapp[i][j] = tmp2[j];
    }
  }
  // 2D world-map to 3D
  points = new float[tmp.length][2];
  for (int i = 0; i<tmp.length; i++){
     points[i][0] = float(mapp[i][2]); 
     points[i][1] = -float(mapp[i][3]);
  }
  for (int i = 0; i<points.length; i++){
    vPos[i] = new PVector( cos( radians( points[i] [1] ) ) * cos(radians(points[i][0])) ,
                           sin( radians( points[i] [1] ) ) * cos(radians(points[i][0])) ,
                           sin( radians( points[i] [0] ) )  );
  }


  // load triangulation lines : links[id][x/y]
  tri = loadStrings("data/triangulation.txt");
  links = new int[ tri.length/2 ][2] ;

  for (int i = 0; i<links.length; i++){
    links[i][0] = int(tri[2*i]) ;
    links[i][1] = int(tri[2*i+1]) ;
  }
}
