import * as THREE from '../libs/three.module.js'

 
class caja extends THREE.Object3D {
  constructor() {
    super();
    
    // Se crea la parte de la interfaz que corresponde a la caja
    // Se crea primero porque otros métodos usan las variables que se definen para la interfaz
    //this.createGUI(gui,titleGui);

    var boxGeom = new THREE.BoxBufferGeometry (1.5,1.5,1.5);

    var loader = new THREE.TextureLoader();
    var ao =  loader.load("../endlessrunner/texturas/caja/ao.jpg");
    var base =  loader.load("../endlessrunner/texturas/caja/base.jpg");
    //base.offset.set(1,1);
    var dureza =  loader.load("../endlessrunner/texturas/caja/dureza.jpg");
    var metalica =  loader.load("../endlessrunner/texturas/caja/metalica.jpg");
    var normal =  loader.load("../endlessrunner/texturas/caja/normal.jpg");
    var diss =  loader.load("../endlessrunner/texturas/caja/altura.png");

    var material = new THREE.MeshPhongMaterial();
    material.map = base;
    material.normalMap = normal;
    material.roughnessMap = dureza;
    //material.displacementMap = diss;
    material.displacementScale = 0.01;
    material.aoMap = ao;
    material.metalness = metalica;

    
    var mesh = new THREE.Mesh( boxGeom, material ) ;
    mesh.name="caja";


    



    mesh.castShadow = true;
    this.add(mesh);

    

  }
  update(){
      
  }

  
}

export { caja };