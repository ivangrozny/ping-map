var clic = new Array();
for (var i = 0; i < 11; i++) { clic[i] = new buzz.sound( "sounds/clic"+i, { formats: [ "ogg", "mp3" ], preload: true, }); };
var sonar = new buzz.sound( "sounds/sonar" , { formats: [ "ogg", "mp3" ] });

$(document).ready(function () {

	$(".border").hover(function(){
		$(".border").css({"border-color":"#ddd"});
	},function(){
		$(".border").css({"border-color":"transparent"});
	})
	.click(function(){
		$("#docu").toggle();
		$("#mapButton").toggle();
	});

	// TOGGLE-CLICK implementation
    $.fn.toggleClick = function(){
	    var methods = arguments, // store the passed arguments for future reference
	    count = methods.length; // cache the number of methods 
	    //use return this to maintain jQuery chainability
	    return this.each(function(i, item){
	        var index = 0; // create a local counter for that element
	        $(item).click(function(){ // bind a click handler to that element
	            return methods[index++ % count].apply(this,arguments); // that when called will apply the 'index'th method to that element
	            // the index % count means that we constrain our iterator between 0 and (count-1)
	        });
	    });
	};
	$('#mapButton').toggleClick (function(){
			$(this).html("Country Name").css({ "border-left-style":"hidden", "border-right-style":"solid", "text-align":"right" });

			for (var i = 0; i < group.children.length-1; i++) {
				if ( typeof numberTexture[ group.children[i].name ] !== 'undefined' ){
					group.children[i].material.map = numberTexture[ group.children[i].name ] ;
					group.children[i].material.visible = true ;
					group.children[i].material.needsUpdate = true;
				}
			}
	    },function(){			        
			$(this).html("Ping Timing").css({ "border-right-style":"hidden", "border-left-style":"solid", "text-align":"left" });
			for (var i = 0; i < group.children.length-1; i++) {
				group.children[i].material.map = nameTexture[i] ;
				group.children[i].material.visible = true ;
				group.children[i].material.needsUpdate = true;
			}
	});
	$(window).load( function(){ setup(); });
});


	var names = ["AFGHANISTAN","ALBANIA","ALGERIA","ANDORRA","ANGOLA","ANTIGUA","ARGENTINA","ARMENIA","AUSTRALIA","AUSTRIA","AZERBAIJAN","BAHAMAS","BAHRAIN","BANGLADESH","BARBADOS","BELARUS","BELGIUM","BELIZE","BENIN","BHUTAN","BOLIVIA","BOSNIA","BOTSWANA","BRAZIL","BRUNEI","BULGARIA","BURKINA FASO","BURUNDI","CAMBODIA","CAMEROON","CANADA","CAPE VERDE","CENT. AFRICAN REP.","CHAD","CHILE","CHINA","CHYPRE","COLOMBIA","COMOROS","CONGO","COSTA RICA","CROATIA","CUBA","CZECH REP.","DENMARK","DJIBOUTI","DOMINICAN REP.","DOMINICA","EAST TIMOR","EGYPT","EQUATORIAL GUINEA","EQUATOR","ERITREA","ESTONIA","ETHIOPIA","FIJI","FILIPINOS","FINLAND","FRANCE","GABON","GAMBIA","GEORGIA","GERMANY","GHANA","GRANADA","GREECE","GUATEMALA","GUINEA BISSAU","GUINEA","GUYANA","HAITI","HONDURAS","HUNGARY","ICELAND","INDIA","INDONESIA","IRAN","IRAQ","IRELAND","ISRAEL","ITALY","IVORY COAST","JAMAICA","JAPAN","JORDAN","KAZAKHSTAN","KENYA","KIRIBATI","KUWAIT","KYRGYZSTAN","LAOS","LATVIA","LEBANON","LESOTHO","LIBERIA","LIBYA","LIECHTENSTEIN","LITHUANIA","LUXEMBOURG","MACEDONIA","MADAGASCAR","MALAWI","MALAYSIA","MALDIVES","MALI","MALTA","MARSHALL ISLANDS","MAURITANIA","MAURITIUS","MEXICO","MICRONESIA","MOLDAVIA","MONACO","MONGOLIA","MONTENEGRO","MOROCCO","MOZAMBIQUE","MYANMAR","NAMIBIA","NAURU","NEPAL","NETHERLANDS","NEW ZELAND","NICARAGUA","NIGERIA","NIGER","NORTH KOREA","NORWAY","OMAN","PAKISTAN","PALAOS","PANAMA","PAPUA","PARAGUAY","PERU","POLAND","PORTUGAL","QATAR","ROMANIA","RUSSIA","RWANDA","SALVADOR","SAMOA","SAO TOME & PRINCIPE","SAUDI ARABIA","SENEGAL","SERBIA","SEYCHELLES","SIERRA LEONE","SINGAPORE","SLOVAKIA","SLOVENIA","SOLOMON ISLANDS","SOMALIA","SOUTH AFRICA","SOUTH KOREA","SOUTH SUDAN","SPAIN","SRI LANKA","ST KITTS & NEVIS","ST LUCIE","ST MARTIN","ST VINCENT","SUDAN","SURINAME","SWAZILAND","SWEDEN","SWISS","SYRIA","TAJIKISTAN","TANZANIA","THAILAND","TOGO","TONGA","TRINIDAD & TOBAGO","TUNISIA","TURKEY","TURKMENISTAN","TUVALU","U.S.A.","UGANDA","UKRAINE","UNITED ARAB EM.","UNITED KINGDOM","URUGUAY","UZBEKISTAN","VANUATU","VENEZUELA","VIETNAM","YEMEN","ZAIRE","ZAMBIA","ZIMBABWE","LOCALHOST"];
	var mouseX = 0, mouseY = 0,
	camera, scene, renderer, group, groupLines, groupLinesCenter, controls, control=false, rotation=0, speed=0.001 ;

	var imgs = new Array(194); 
	var nameTexture = new Array(194);
	var imgNumber = new Array(11); 
	var numberTexture = new Array(1000);
	for (var i = 0; i < imgs.length; i++) {
		imgs[i] = new Image();
		imgs[i].src = "countries/"+i+".png";
	}			
	for (var i = 0; i < imgNumber.length; i++) {
		imgNumber[i] = new Image();
		imgNumber[i].src = "numbers_0-9/"+i+".png";
	}


	var lines, line, img;
	var labelSize = 0.5;
	function setup() {
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

		// stats
		stats = new Stats();
		stats.domElement.style.position = 'absolute';
		stats.domElement.style.top = '50px';
		stats.domElement.style.right = '50px';
		container.appendChild( stats.domElement );

		group = new THREE.Group();
		groupLinesCenter = new THREE.Group();
		for (var i = 0; i < numberTexture.length; i++) { setupNumber(i); }  // setup number labels
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
		//$(document).load( function(){ 
		//window.onload = function(){ 
			draw(); console.log("windowLoaded"); 
				
		//});
	}

	function makeTextSprite( message,i ){
		var canvas = document.createElement('canvas');
		var context = canvas.getContext('2d');
		var img = imgs[i];
		//context.canvas.width  = 300 ;  context.canvas.height = 50 ;    // maybe usless ...
		context.drawImage(img, context.canvas.width/2-img.width/2,  context.canvas.height/2-img.height/2 );

		nameTexture[i] = new THREE.Texture( canvas ); nameTexture[i].needsUpdate = true;

		var spriteMaterial = new THREE.SpriteMaterial({ map: nameTexture[i], name: i, opacity: 0 } );
		var sprite = new THREE.Sprite( spriteMaterial );
		sprite.scale.set(context.canvas.width/2.1,context.canvas.height/2.1 ,1.0);  // labels size
		return sprite;	
	}

	function setupNumber(i){
			var canvas = document.createElement('canvas');
			var context = canvas.getContext('2d');
			
			if (i>999)
			context.drawImage(imgNumber[Math.floor(i/1000)%10], context.canvas.width/2-16-16, context.canvas.height/2-20);// 1000
			if (i>99)
			context.drawImage(imgNumber[Math.floor(i/100)%10], context.canvas.width/2-16-16, context.canvas.height/2-20 );// 100
			context.drawImage(imgNumber[Math.floor(i/10)%10], context.canvas.width/2-16   , context.canvas.height/2-20 );// 10
			context.drawImage(imgNumber[i%10],				 context.canvas.width/2,      context.canvas.height/2-20 );     // 0-9
			context.drawImage(imgNumber[10],				context.canvas.width/2+19,  context.canvas.height/2-20 );  // MS

	        numberTexture[i] = new THREE.Texture( canvas ); numberTexture[i].needsUpdate = true ;
	}

	function displayLinesCenter(i, x, y, z){
		if ( typeof groupLinesCenter !== 'undefined' && groupLinesCenter.children.length > i ){
			groupLinesCenter.children[i].geometry.vertices[1].set(x,y,z) ;  
	      	groupLinesCenter.children[i].visible = true ;
	      	setTimeout( function(){ groupLinesCenter.children[i].visible = false; }, 200) ;  
		}
	}

	function draw() {
		requestAnimationFrame( draw );
		stats.update();

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
	}
	function onWindowResize() {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize( window.innerWidth, window.innerHeight );
	}
	function onDocumentMouseMove(event) {
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

