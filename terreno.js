import * as THREE from '../libs/three.module.js'
 
class terreno extends THREE.Object3D {
  constructor(gui,titleGui) {
    super();
    
    // Se crea la parte de la interfaz que corresponde a la caja
    // Se crea primero porque otros métodos usan las variables que se definen para la interfaz
    //this.createGUI(gui,titleGui);
    
    // Un Mesh se compone de geometría y material
    var SphGeom = new THREE.SphereGeometry (40,57,54);
    //SphGeom.translate(0,-41,10);
    

    var loader = new THREE.TextureLoader();

    /* var terrenoTexture = loader.load("./texturas/terreno2/base.png");
    terrenoTexture.wrapS = THREE.RepeatWrapping;
    terrenoTexture.wrapT = THREE.RepeatWrapping;
    terrenoTexture.repeat.set( 20, 20 );

    var dureza = loader.load("./texturas/terreno2/dureza.png");
    dureza.wrapS = THREE.RepeatWrapping;
    dureza.wrapT = THREE.RepeatWrapping;
    dureza.repeat.set( 20, 20 );

    var normal = loader.load("./texturas/terreno2/normal.png");
    normal.wrapS = THREE.RepeatWrapping;
    normal.wrapT = THREE.RepeatWrapping;
    normal.repeat.set( 20, 20 );

    var displcement = loader.load("./texturas/terreno2/dis.png");
    displcement.wrapS = THREE.RepeatWrapping;
    displcement.wrapT = THREE.RepeatWrapping;
    displcement.repeat.set( 20, 20 );
    
    var ao = loader.load("./texturas/terreno2/specular.png");
    ao.wrapS = THREE.RepeatWrapping;
    ao.wrapT = THREE.RepeatWrapping;
    ao.repeat.set( 20, 20 ); */

    var terrenoTexture = loader.load("./texturas/terreno3/base.jpg");
    terrenoTexture.wrapS = THREE.RepeatWrapping;
    terrenoTexture.wrapT = THREE.RepeatWrapping;
    terrenoTexture.repeat.set( 25, 25 );

    var dureza = loader.load("./texturas/terreno3/dureza.jpg");
    dureza.wrapS = THREE.RepeatWrapping;
    dureza.wrapT = THREE.RepeatWrapping;
    dureza.repeat.set( 25, 25 );

    var normal = loader.load("./texturas/terreno3/normal.jpg");
    normal.wrapS = THREE.RepeatWrapping;
    normal.wrapT = THREE.RepeatWrapping;
    normal.repeat.set( 25, 25 );

    var displcement = loader.load("./texturas/terreno3/dis.png");
    displcement.wrapS = THREE.RepeatWrapping;
    displcement.wrapT = THREE.RepeatWrapping;
    displcement.repeat.set( 25, 25 );
    
    var ao = loader.load("./texturas/terreno3/ao.jpg");
    ao.wrapS = THREE.RepeatWrapping;
    ao.wrapT = THREE.RepeatWrapping;
    ao.repeat.set( 25, 25 );

    var material = new THREE.MeshPhongMaterial();
    material.map = terrenoTexture;
    material.normalMap = normal;
    material.roughnessMap = dureza;
    material.displacementMap = displcement;
    material.aoMap = ao;
    //material.specularMap=ao;
    //material.specular = new THREE.Color(0x262626);
    //var SphlMat = crearMaterial();
    // Ya podemos construir el Mesh
    var Sph = new THREE.Mesh (SphGeom, material);
    Sph.rotateZ(Math.PI/3);
    //Sph.position.set(0,-41.5,10);
    // Y añadirlo como hijo del Object3D (el this)
    Sph.receiveShadow = true;
	  //Sph.castShadow=false;
    this.add (Sph);
  
  }
  
 /* createGUI (gui,titleGui) {
    // Controles para el tamaño, la orientación y la posición de la caja
    this.guiControls = {
      sizeX : 1.0,
      sizeY : 1.0,
      sizeZ : 1.0,
      
      rotX : 0.0,
      rotY : 0.0,
      rotZ : 0.0,
      
      posX : 0.0,
      posY : 0.0,
      posZ : 0.0,
      
      // Un botón para dejarlo todo en su posición inicial
      // Cuando se pulse se ejecutará esta función.
      reset : () => {
        this.guiControls.sizeX = 3.0;
        this.guiControls.sizeY = 1.0;
        this.guiControls.sizeZ = 1.0;
        
        this.guiControls.rotX = 0.0;
        this.guiControls.rotY = 0.0;
        this.guiControls.rotZ = 0.0;
        
        this.guiControls.posX = 0.0;
        this.guiControls.posY = 0.0;
        this.guiControls.posZ = 0.0;
      }
    } 
    
    // Se crea una sección para los controles de la caja
    var folder = gui.addFolder (titleGui);
    // Estas lineas son las que añaden los componentes de la interfaz
    // Las tres cifras indican un valor mínimo, un máximo y el incremento
    // El método   listen()   permite que si se cambia el valor de la variable en código, el deslizador de la interfaz se actualice
    folder.add (this.guiControls, 'sizeX', 0.1, 5.0, 0.1).name ('Tamaño X : ').listen();
    folder.add (this.guiControls, 'sizeY', 0.1, 5.0, 0.1).name ('Tamaño Y : ').listen();
    folder.add (this.guiControls, 'sizeZ', 0.1, 5.0, 0.1).name ('Tamaño Z : ').listen();
    
    folder.add (this.guiControls, 'rotX', 0.0, Math.PI/2, 0.1).name ('Rotación X : ').listen();
    folder.add (this.guiControls, 'rotY', 0.0, Math.PI/2, 0.1).name ('Rotación Y : ').listen();
    folder.add (this.guiControls, 'rotZ', 0.0, Math.PI/2, 0.1).name ('Rotación Z : ').listen();
    
    folder.add (this.guiControls, 'posX', -20.0, 20.0, 0.1).name ('Posición X : ').listen();
    folder.add (this.guiControls, 'posY', 0.0, 10.0, 0.1).name ('Posición Y : ').listen();
    folder.add (this.guiControls, 'posZ', -20.0, 20.0, 0.1).name ('Posición Z : ').listen();
    
    folder.add (this.guiControls, 'reset').name ('[ Reset ]');
  }
  */
  update () {
    // Con independencia de cómo se escriban las 3 siguientes líneas, el orden en el que se aplican las transformaciones es:
    // Primero, el escalado
    // Segundo, la rotación en Z
    // Después, la rotación en Y
    // Luego, la rotación en X
    // Y por último la traslación
   
    //this.rotation.x-=0.003;
    //this.rotation.x-=0.0045;
    //this.rotation.x-=0.005;
    //this.rotation.x-=0.0055;
    //this.rotation.x-=0.0065;
    this.rotation.x-=0.0070;
    

    //this.rotation.x-=0.001;
  }
  

}

export { terreno };