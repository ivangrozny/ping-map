// load sounds
var clic = new Array();
for (var i = 0; i < 11; i++) { clic[i] = new buzz.sound( "sounds/clic"+i, { formats: [ "ogg", "mp3" ], preload: true, }); };
var sonar = new buzz.sound( "sounds/sonar" , { formats: [ "ogg", "mp3" ] });

	var names = ["AFGHANISTAN","ALBANIA","ALGERIA","ANDORRA","ANGOLA","ANTIGUA","ARGENTINA","ARMENIA","AUSTRALIA","AUSTRIA","AZERBAIJAN","BAHAMAS","BAHRAIN","BANGLADESH","BARBADOS","BELARUS","BELGIUM","BELIZE","BENIN","BHUTAN","BOLIVIA","BOSNIA","BOTSWANA","BRAZIL","BRUNEI","BULGARIA","BURKINA FASO","BURUNDI","CAMBODIA","CAMEROON","CANADA","CAPE VERDE","CENT. AFRICAN REP.","CHAD","CHILE","CHINA","CHYPRE","COLOMBIA","COMOROS","CONGO","COSTA RICA","CROATIA","CUBA","CZECH REP.","DENMARK","DJIBOUTI","DOMINICAN REP.","DOMINICA","EAST TIMOR","EGYPT","EQUATORIAL GUINEA","EQUATOR","ERITREA","ESTONIA","ETHIOPIA","FIJI","FILIPINOS","FINLAND","FRANCE","GABON","GAMBIA","GEORGIA","GERMANY","GHANA","GRANADA","GREECE","GUATEMALA","GUINEA BISSAU","GUINEA","GUYANA","HAITI","HONDURAS","HUNGARY","ICELAND","INDIA","INDONESIA","IRAN","IRAQ","IRELAND","ISRAEL","ITALY","IVORY COAST","JAMAICA","JAPAN","JORDAN","KAZAKHSTAN","KENYA","KIRIBATI","KUWAIT","KYRGYZSTAN","LAOS","LATVIA","LEBANON","LESOTHO","LIBERIA","LIBYA","LIECHTENSTEIN","LITHUANIA","LUXEMBOURG","MACEDONIA","MADAGASCAR","MALAWI","MALAYSIA","MALDIVES","MALI","MALTA","MARSHALL ISLANDS","MAURITANIA","MAURITIUS","MEXICO","MICRONESIA","MOLDAVIA","MONACO","MONGOLIA","MONTENEGRO","MOROCCO","MOZAMBIQUE","MYANMAR","NAMIBIA","NAURU","NEPAL","NETHERLANDS","NEW ZELAND","NICARAGUA","NIGERIA","NIGER","NORTH KOREA","NORWAY","OMAN","PAKISTAN","PALAOS","PANAMA","PAPUA","PARAGUAY","PERU","POLAND","PORTUGAL","QATAR","ROMANIA","RUSSIA","RWANDA","SALVADOR","SAMOA","SAO TOME & PRINCIPE","SAUDI ARABIA","SENEGAL","SERBIA","SEYCHELLES","SIERRA LEONE","SINGAPORE","SLOVAKIA","SLOVENIA","SOLOMON ISLANDS","SOMALIA","SOUTH AFRICA","SOUTH KOREA","SOUTH SUDAN","SPAIN","SRI LANKA","ST KITTS & NEVIS","ST LUCIE","ST MARTIN","ST VINCENT","SUDAN","SURINAME","SWAZILAND","SWEDEN","SWISS","SYRIA","TAJIKISTAN","TANZANIA","THAILAND","TOGO","TONGA","TRINIDAD & TOBAGO","TUNISIA","TURKEY","TURKMENISTAN","TUVALU","U.S.A.","UGANDA","UKRAINE","UNITED ARAB EM.","UNITED KINGDOM","URUGUAY","UZBEKISTAN","VANUATU","VENEZUELA","VIETNAM","YEMEN","ZAIRE","ZAMBIA","ZIMBABWE","LOCALHOST"];
	var mouseX = 0, mouseY = 0,
	camera, scene, renderer, group, groupLines, groupLinesCenter, controls, control=false, rotation=0, speed=0.001 ;
	var imgs = new Array(194); 
	var nameTexture = new Array(194);
	for (var i = 0; i < imgs.length; i++) {
		imgs[i] = new Image();
		imgs[i].src = "countries/"+i+".png";
	}			
	var lines, line, img;


	function setup() {  // setup 3D objects

		var container, particles, particle;
		container = document.createElement('div');
		document.body.appendChild(container);
		camera = new THREE.OrthographicCamera( -window.innerWidth/2, window.innerWidth/2, -window.innerHeight/2, window.innerHeight/2, -10000, 10000 );

		renderer = new THREE.CanvasRenderer();
		renderer.autoClear = true;
		renderer.setSize( window.innerWidth, window.innerHeight );
		container.appendChild( renderer.domElement );
		renderer.setClearColor (0x000000, 1);

		scene = new THREE.Scene();
		scene.rotation.order = 'YXZ';
		scene.rotation.x = Math.PI/2;
		scene.rotation.y = 0;

		blackPlane();

		group = new THREE.Group();
		groupLinesCenter = new THREE.Group();
		for (var i = 0; i < 194; i++) {
			var sprite = makeTextSprite( names[i], i ); // setup country name labels
			group.add( sprite );

			geometry = new THREE.Geometry() ;  //  setup center lines
			geometry.vertices.push( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 0, 0 ) );
			line = new THREE.Line( geometry, new THREE.LineBasicMaterial( { color: 0xffffff, opacity: 1 } ) );
			line.verticesNeedUpdate = true ;
			groupLinesCenter.add( line );
		}
	    scene.add( groupLinesCenter );
	    scene.add( group );
		group.children[193].material.opacity = 1 ;

		groupLines = new THREE.Group();   // setup triangulation map lines
		for ( var i = 0; i < 567; i ++ ) { 
			geometry = new THREE.Geometry() ;
			geometry.vertices.push( new THREE.Vector3( -1, -1, -1 ), new THREE.Vector3( -1, -1, -1 ) );
			line = new THREE.Line( geometry, new THREE.LineBasicMaterial( { color: 0xffffff, opacity: 0.7 } ) );
			line.verticesNeedUpdate = true ;
			groupLines.add( line );
		}
	    scene.add( groupLines );

		window.addEventListener( 'resize', onWindowResize, false );
		document.addEventListener( 'mousemove', onDocumentMouseMove, false );
		document.addEventListener( 'touchstart', onDocumentTouchStart, false );
		document.addEventListener( 'touchmove', onDocumentTouchMove, false );
		document.addEventListener( "mousedown", function(){ control = true; });
		document.addEventListener( "mouseup"  , function(){ control = false; });

		draw();
	}

	function makeTextSprite( message,i ){
		var canvas = document.createElement('canvas');
		var context = canvas.getContext('2d');
		var img = imgs[i];
		context.drawImage(img, context.canvas.width/2-img.width/2,  context.canvas.height/2-img.height/2 );

		nameTexture[i] = new THREE.Texture( canvas ); nameTexture[i].needsUpdate = true;

		var spriteMaterial = new THREE.SpriteMaterial({ map: nameTexture[i], name: i, opacity: 0 } );
		var sprite = new THREE.Sprite( spriteMaterial );

		var x = 3000/window.innerWidth; // labels size
		if ( window.innerWidth < 800 ) x = 3 ;
		sprite.scale.set(context.canvas.width/x,context.canvas.height/x ,1.0);
		return sprite;	
	}

	function displayLinesCenter(i, x, y, z){
		if ( typeof groupLinesCenter !== 'undefined' && groupLinesCenter.children.length > i ){
			groupLinesCenter.children[i].geometry.vertices[1].set(x,y,z) ;  
	      	groupLinesCenter.children[i].visible = true ;
	      	setTimeout( function(){ groupLinesCenter.children[i].visible = false; }, 200) ;  // isVisible duration in millisecond
		}
	}

	function draw() {

		if (!control) rotation -= speed;
		group.rotation.z = rotation; 
		groupLines.rotation.z = rotation +0.001;
		groupLinesCenter.rotation.z = rotation +0.001;

		for (var i = 0; i < groupLines.children.length; i++) {  // triangulationLines opacity
			var off = groupLines.children[i] ;
	    	var vector = off.geometry.vertices[0].clone();
	    	var opacity = vector.applyMatrix4( off.matrixWorld ).z.map(-250,250,0.60,1) ;
	    	if (opacity>1) opacity=1;
	    	off.material.opacity = opacity
	    	off.material.needsUpdate = true;
		};

		renderer.render( scene, camera );
		requestAnimationFrame( draw );
	}
	function onWindowResize() {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize( window.innerWidth, window.innerHeight );
	}
	function onDocumentMouseMove( event ) {
		if (control) rotation += (mouseX - event.clientX)/200;
		mouseX = event.clientX;
		mouseY = event.clientY;
	}
	function onDocumentTouchStart( event ) {
		if ( event.touches.length > 1 ) {
			event.preventDefault();
			mouseX = event.touches[ 0 ].pageX;
			mouseY = event.touches[ 0 ].pageY;
		}
	}
	function onDocumentTouchMove( event ) {
		if ( event.touches.length == 1 ) {
			event.preventDefault();
			mouseX = event.touches[ 0 ].pageX;
			mouseY = event.touches[ 0 ].pageY;
		}
	}

	Number.prototype.map = function(a,b,c,d){return c+(d-c)*((this-a)/(b-a))};


	// transparent vertical black plane to shadow background labels
	function blackPlane(){
		var objects = new THREE.Object3D();
		Allobjects = new THREE.Object3D();
		Allobjects.add(objects);
		scene.add(Allobjects);
		var materialP = new THREE.MeshLambertMaterial({
		    color: 0xFF0000,
		    opacity:0.2,
		    overdraw: true,
		    side: THREE.DoubleSide
		});
		var imgplane = new THREE.Mesh(new THREE.PlaneGeometry(1000, 1000),materialP);
		imgplane.renderDepth = 1;
		// plane position
		objects.add(imgplane);
		var angleRadian = Math.PI * Math.round(90) / 180;
		imgplane.rotation.x = angleRadian;
		imgplane.position.x = 0;
		imgplane.position.z = 0;
		imgplane.position.y = -50;
	}