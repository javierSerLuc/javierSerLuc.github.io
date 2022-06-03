import * as THREE from '../libs/three.module.js'
 
class valla extends THREE.Object3D {
  constructor(hueco) {
    super();
    
    // Se crea la parte de la interfaz que corresponde a la caja
    // Se crea primero porque otros métodos usan las variables que se definen para la interfaz
    //this.createGUI(gui,titleGui);
    
    // Un Mesh se compone de geometría y material
    var pI = new THREE.BoxBufferGeometry (4,8,0.2);
    //SphGeom.translate(0,-41,10);
    

    var loader = new THREE.TextureLoader();


    var terrenoTexture = loader.load("./texturas/valla/base.jpg");
    terrenoTexture.offset.set(0.15,0);
    terrenoTexture.wrapS = THREE.RepeatWrapping;
    terrenoTexture.repeat.set(0.70,1);



    var dureza = loader.load("./texturas/valla/dureza.jpg");


    var normal = loader.load("./texturas/valla/normal.jpg");


    var displcement = loader.load("./texturas/valla/altura.png");

    
    var ao = loader.load("./texturas/valla/ao.jpg");
    
    var metalica = loader.load("./texturas/valla/metalica.jpg");

    var opacidad = loader.load("./texturas/valla/opacidad.jpg");


    var material = new THREE.MeshPhongMaterial();
    material.map = terrenoTexture;
    material.normalMap = normal;
    material.roughnessMap = dureza;
    material.displacementMap = displcement;
    material.aoMap = ao;
    material.alphaMap = opacidad;
    material.metalness = metalica;

    material.alphaTest=0.7;
    var vallaC = new THREE.Mesh (pI, material);

    if(hueco == -1){
      var vallaD = vallaC.clone();
      vallaD.position.set(-4,0,0);

      vallaC.receiveShadow = true;
      vallaD.receiveShadow = true;


      this.add (vallaC);
      this.add (vallaD);
    }
    else{
      if(hueco == 0){
        var vallaI = vallaC.clone();
        vallaI.position.set(4,0,0);
        var vallaD =  vallaC.clone();
        vallaD.position.set(-4,0,0);

        vallaI.receiveShadow = true;
        vallaD.receiveShadow = true;

        this.add (vallaI);
        this.add (vallaD);
      }
      else{
        var vallaI = vallaC.clone();
        vallaI.position.set(4,0,0);

        vallaC.receiveShadow = true;
        vallaI.receiveShadow = true;

        this.add (vallaC);
        this.add (vallaI);
      }
    }

    
   //var vallaI = vallaC.clone();
   //vallaI.position.set(4,0,0);
   //var vallaD =  vallaC.clone();
   //vallaD.position.set(-4,0,0);


    //this.add (vallaC);
    //this.add (vallaI);
    //this.add (vallaD);
  
  }
  
  update () {

  }
  

}

export { valla };