import * as THREE from '../libs/three.module.js'

class powerup extends THREE.Object3D {
  constructor() {
    super();
    

    var esf = new THREE.SphereGeometry (0.5,57,54);
    

    var loader = new THREE.TextureLoader();


    var base = loader.load("./texturas/powerup/base.jpg");

    var dureza = loader.load("./texturas/powerup/dureza.jpg");


    var normal = loader.load("./texturas/powerup/normal.jpg");


    var displcement = loader.load("./texturas/powerup/altura.png");

    
    var ao = loader.load("./texturas/powerup/ao.jpg");
    
    var metalica = loader.load("./texturas/powerup/metalica.jpg");



    var material = new THREE.MeshPhongMaterial();
    material.map = base;
    material.normalMap = normal;
    material.roughnessMap = dureza;
    //material.displacementMap = displcement;
    material.aoMap = ao;
    material.metalness = metalica;


    var pu = new THREE.Mesh (esf, material);
    pu.name="pu";
    pu.castShadow = true;
    pu.receiveShadow = true;

    var pl = new THREE.PointLight("rgb(164,7,7)",2,40);
    pl.intensity = 0;
    pl.position.set(0,0.5,-0.5);
    pl.name="luz";

    this.add(pl);
    this.add(pu);

    this.crearLimites();


  
  }
  crearLimites(){
    this.limites = new function(){
        this.lim_sup = false;
        this.lim_inf = true;
      }
  }
  
  update () {
      
    this.getObjectByName("pu").rotation.x+=0.02;
    this.getObjectByName("pu").rotation.y+=0.02;
    var luz = this.getObjectByName("luz");

    if(!this.limites.lim_sup){
        luz.intensity+=0.06;
        if(luz.intensity+0.06 >2 ){
            this.limites.lim_sup = true;
            this.limites.lim_inf = false;
        }
    }
    else if(!this.limites.lim_inf){
        luz.intensity-=0.06;
        if(luz.intensity-0.06 <0 ){
            this.limites.lim_sup = false;
            this.lim_inf = true;
        }
    }
   

  }
  

}

export { powerup };