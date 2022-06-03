import * as THREE from '../libs/three.module.js'
//import{CSG} from '../libs/CSG-v2.js'
 
class señal extends THREE.Object3D {
  constructor() {
    super();
    
    // Se crea la parte de la interfaz que corresponde a la caja
    // Se crea primero porque otros métodos usan las variables que se definen para la interfaz
    //this.createGUI(gui,titleGui);

   const triangulo = new THREE.Shape();
   triangulo.moveTo(0,0);
   triangulo.lineTo(3/6,5/6);
   triangulo.lineTo(1,0);
   triangulo.lineTo(0,0);

   const extrudeSettings = {
	steps: 2,
	depth:0.1,
	bevelEnabled: true,
	bevelThickness: 0.5/6,
	bevelSize: 0.5/6,
	bevelOffset: 0,
	bevelSegments: 1
    };

    var loader = new THREE.TextureLoader();
    var ao =  loader.load("../endlessrunner/texturas/senal/ao.jpg");
    var base =  loader.load("../endlessrunner/texturas/senal/base.jpg");
    //base.offset.set(1,1);
    var dureza =  loader.load("../endlessrunner/texturas/senal/dureza.jpg");
    var metalica =  loader.load("../endlessrunner/texturas/senal/metalica.jpg");
    var normal =  loader.load("../endlessrunner/texturas/senal/normal.jpg");
    var opacidad =  loader.load("../endlessrunner/texturas/senal/opacidad.jpg");

    var material = new THREE.MeshPhongMaterial();
    material.map = base;
    material.normalMap = normal;
    material.roughnessMap = dureza;
    material.alpha = opacidad;
    material.aoMap = ao;
    material.metalness = metalica;

    const geometry = new THREE.ExtrudeGeometry( triangulo, extrudeSettings );
    geometry.scale(4.5,5,2);
    geometry.translate(-2.25,6,0.5);
    
    var mesh = new THREE.Mesh( geometry, material ) ;
    mesh.name="senal";


    var cilExt = new THREE.CylinderGeometry ( 0.35 , 0.35 , 10 , 24 , 1 ) ;
    cilExt.translate(0,5,0);


    var ao2 =  loader.load("../endlessrunner/texturas/senal/palo/ao.jpg");
    var base2 =  loader.load("../endlessrunner/texturas/senal/palo/base.jpg");
    var dureza2 =  loader.load("../endlessrunner/texturas/senal/palo/dureza.jpg");
    var metalica2 =  loader.load("../endlessrunner/texturas/senal/palo/metalica.jpg");
    var normal2 =  loader.load("../endlessrunner/texturas/senal/palo/normal.jpg");

    var material2 = new THREE.MeshPhongMaterial();
    material2.map = base2;
    material2.normalMap = normal2;
    material2.roughnessMap = dureza2;
    material2.aoMap = ao2;
    material2.metalness = metalica2;

    var cilExtMesh = new THREE.Mesh(cilExt,material2);

    mesh.castShadow = true;
    cilExtMesh.castShadow = true;
    this.add(mesh);
    this.add(cilExtMesh);

    this.scale.set(0.4,0.7,0.4);

    //this.rotateY(Math.PI);
    //this.rotateX(Math.PI/2);

  }
  update(){
      //this.getObjectByName("senal").rotation.x+=0.1;
  }

  
}

export { señal };