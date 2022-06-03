import * as THREE from '../libs/three.module.js'
import{CSG} from '../libs/CSG-v2.js'
 
class gear extends THREE.Object3D {
  constructor() {
    super();
    
    // Se crea la parte de la interfaz que corresponde a la caja
    // Se crea primero porque otros métodos usan las variables que se definen para la interfaz
    //this.createGUI(gui,titleGui);

   
    //var material = new THREE.MeshNormalMaterial();
    var material = new THREE.MeshStandardMaterial({ 
      color: 0xffffcc,
      metalness: 0.9,
      roughness: 0.85
    });
    /* var material = new THREE.MeshPhongMaterial({ 
      color: 0xffffcc
    }); */



    var dienteG = new THREE.CylinderGeometry ( 2.1, 3 , 6 , 4) ;
    //dienteG.rotateY(40);
    dienteG.rotateY(Math.PI/4);
    dienteG.rotateX(Math.PI*3/2);
    dienteG.translate(0,-2.5,0);

    var ruedaG = new THREE.CylinderGeometry ( 8, 8 , 5 , 40) ;
    var quitarG = new THREE.CylinderGeometry ( 3, 3 , 7 , 40) ;
    var ponerG = new THREE.CylinderGeometry ( 3.5, 3.5 , 6 , 40) ;

    var quitarG2 = new THREE.CylinderGeometry ( 7, 7 , 7 , 40) ;
    var ponerG2 = new THREE.CylinderGeometry ( 8, 8 , 6 , 40) ;

    //dienteG.position.setFromCylindricalCoords(8);
    
    
    // cilboquete.translate(-0.13,0,0.1);
    // cilboquete.rotateX(1.5708);
    
     
    var diente = new THREE.Mesh(dienteG,material);
    var centro = new THREE.Mesh(ruedaG,material);
    var quitar = new THREE.Mesh(quitarG,material);
    var poner = new THREE.Mesh(ponerG,material);
    var quitar2 = new THREE.Mesh(quitarG2,material);
    var poner2 = new THREE.Mesh(ponerG2,material);
    diente.position.setFromCylindricalCoords(12,0,2.5);
    

    var csg = new CSG();
    
    
    for(var i = 0; i < 360;i+=37){
        var aux = diente.clone()
        aux.position.setFromCylindricalCoords(10,i,2.5);
        var x = centro.position.x * -1;
        var y = 2.5;
        var z = centro.position.z * -1;
        aux.lookAt(x,y,z);
        csg.union([aux]);
    }
    csg.union([poner2]);
    csg.subtract([quitar2]);
    csg.union([centro]);
    csg.union([poner]);
    csg.subtract([quitar]);
    //csg.subtract([cajaBoquete1oMesh]);
    //csg.subtract([cajaBoquete2oMesh]);
    //csg.subtract([cajaBoquete3oMesh]);

    var resultadoMesh = csg.toMesh();
    
    resultadoMesh.scale.set(0.05,0.05,0.05);
    resultadoMesh.castShadow=true;
    this.add(resultadoMesh);

  }
  update(){
   this.rotation.z+=0.03;
   this.rotation.x+=0.03;

  }

  
}

export { gear };