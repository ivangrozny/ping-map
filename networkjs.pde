int[] txtLength = { 147, 88, 87, 100, 82, 92, 120, 97, 116, 91, 131, 103, 94, 139, 111, 97, 96, 72, 66, 88, 81, 78, 117, 74, 81, 104, 153, 98, 109, 119, 83, 128, 212, 57, 62, 66, 85, 108, 105, 72, 122, 89, 57, 124, 105, 99, 175, 105, 127, 67, 215, 99, 89, 90, 97, 40, 103, 90, 83, 71, 81, 90, 104, 72, 98, 82, 127, 162, 79, 85, 56, 118, 103, 89, 57, 114, 51, 50, 90, 74, 58, 136, 94, 70, 86, 139, 69, 90, 83, 138, 53, 72, 98, 96, 81, 59, 167, 113, 148, 124, 143, 85, 105, 107, 52, 71, 210, 133, 121, 82, 133, 107, 91, 110, 148, 105, 145, 110, 90, 76, 68, 155, 135, 121, 85, 65, 148, 91, 63, 104, 80, 89, 70, 111, 58, 83, 111, 69, 98, 79, 91, 109, 74, 234, 144, 95, 76, 134, 150, 120, 101, 103, 199, 93, 152, 147, 151, 64, 109, 185, 94, 116, 125, 73, 114, 122, 90, 69, 62, 124, 104, 104, 55, 70, 209, 86, 84, 170, 84, 64, 86, 94, 184, 183, 103, 133, 101, 123, 96, 75, 61, 80, 114, 122}; 
int[] slider = {58 ,60 ,20 ,30 ,24 ,0 ,127 ,10};
int t = 1, fps = 30, fpss = fps*15; // 15 secondes entre chaque reactualisation
float rota = 0 ;
PImage[] imgs = new PImage[194];
PShape[] svgs = new PShape[195];
String[] tmp, tri ;
String[][] mapp ;
float[][] points ;  
int[][] links ;
float[][] ping = new float[194][15];
float[] pingOld = new float[194];
float control=2*PI, control2=-PI, 
  controlTaille = (window.innerWidth*0.9 > window.innerHeight) ? window.innerHeight/6 : window.innerWidth/11;  // taille de la sphere
float  x,y,z, x1, y1, z1, x2, y2, z2 , fadeOut;
PVector[] vPos = new PVector[200] ;


void setup() {

  size(1,1);
  noSmooth();
  frameRate(fps);
  dataRequest("savedPing.txt");
  dataRequest("ping.txt");
  mapSetup();
}

void draw() {
  if (frameCount%(fpss*10)==0) dataRequest("ping.txt");
  if (frameCount%(fpss)==0) t++ ;  if(t==11) t = 1 ; rota += 0.002;
  if (frameCount%fpss  > fpss-90 && frameCount%fpss < fpss) fadeOut -= 0.011 ;

  if ( typeof group !== 'undefined' && typeof numberTexture[50] !== 'undefined')
    display(0);
}

void display() {

  float s = map(slider[1],0,127,0,1);


  // SONAR
 // if(frameCount%(fpss) == int(fpss-3.9*fps) ) { sonar.stop().play(); }

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
            //groupLines.children[i].geometry.verticesNeedUpdate = true ;
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
        //clic[ ran ].stop().play();
        displayLinesCenter(i, x, y, z);

// LABELS NAMES
        group.children[i].position.set( x, y, z );
        group.children[i].material.opacity = 1 ;
        group.children[i].name =  int(ping[i][t]);
        group.children[i].material.overdraw = true;  // affichage safari ?
      }
      
      if ( frameCount%fpss == fpss-90 ) fadeOut = 1;     //   FADEOUT LABELS
      if ( frameCount%fpss  > fpss-90 && frameCount%fpss < fpss ){
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
  if (timer(index)==1) { r = log(1+ pingOld[index]/slider[7] ) * controlTaille;  // r = (0.005 * pingOld[index] ) * controlTaille;
  } else {               r = log(1+ ping[index][t]/slider[7] ) * controlTaille; }
  r = constrain(r, slider[5]*10, slider[6]*10);
  return r;
}
void dataRequest(String dataPath) {
  String[] data = loadStrings(dataPath);
  if( data!=null ){
    for (int i = 0; i<data.length; i++){  
      String[] temp = splitTokens( data[i], " ");

        console.log(temp[0]);
      for (int j = 0; j<temp.length; j++){ 
        
        if( int(temp[0]) <= 193 && int(temp[j])>1 )
          ping[ i ][j] = float(temp[j]) ;
      }
    }
  }
}
void displayText(){ 
  for (int i = 0; i<tmp.length; i++){
    if(timer(i)==2)
      document.getElementById( mapp[i][1].toUpperCase() ).innerHTML= int(ping[i][t]) ;
    if(timer(i)==1)
      document.getElementById( mapp[i][1].toUpperCase() ).innerHTML= "_" ;
  }
}

void mapSetup(){
  tmp = loadStrings("data/mapOrdered.txt");
  mapp =  new String[tmp.length][6];

  for (int i = 0; i<tmp.length; i++){
    String[] tmp2 = split( tmp[i] , ',' ); 
    for (int j = 0; j<tmp2.length; j++){
      mapp[i][j] = tmp2[j];
    }
  }


  points = new float[tmp.length][2];
  for (int i = 0; i<tmp.length; i++){
     points[i][0] = float(mapp[i][2]); points[i][1] = -float(mapp[i][3]);
  }
  for (int i = 0; i<points.length; i++){
    vPos[i] = new PVector( cos( radians( points[i] [1] ) ) * cos(radians(points[i][0])) ,
                           sin( radians( points[i] [1] ) ) * cos(radians(points[i][0])) ,
                           sin( radians( points[i] [0] ) )  );
  }

  tri = loadStrings("data/triangulation.txt");
  links = new int[ tri.length/2 ][2] ;

  for (int i = 0; i<links.length; i++){
    links[i][0] = int(tri[2*i]) ;
    links[i][1] = int(tri[2*i+1]) ;
  }
}
void keyPressed() {  
}