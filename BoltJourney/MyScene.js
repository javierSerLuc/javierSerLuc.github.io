
// Clases de la biblioteca

import * as THREE from '../libs/three.module.js'
import { GUI } from '../libs/dat.gui.module.js'
import { TrackballControls } from '../libs/TrackballControls.js'
import { Stats } from '../libs/stats.module.js'

// Clases de mi proyecto

import { robot } from './robot.js'
import { terreno } from './terreno.js'
import { señal } from './señal.js'
import { gear } from './gear.js'
import { valla } from './valla.js'
import { powerup } from './powerup.js'
import { caja } from './caja.js'

let posicion = 0;
//let prc = 0;

var obstaculos = [];
//var obstaculos_dobles = [];

var obstaculos_dobles_izq = [];
var obstaculos_dobles_c = [];
var obstaculos_dobles_dr = [];

var objetos_simples = [];
var monedas = [];
var colocados = [];
var powerups = [];
var objetosExtras = [];
var roboto;
var roboto_centro = new THREE.Vector3();

var geo_explosion;
var vertices_explosion = [];
var particulas = [];
var num_particulas = 15;
var fuerza_explosion;
var comenzar = false;

//var eje_vertical = new THREE.Vector3(0,1,0);
var shake = ScreenShake();
var camara;

var monedas_conseguidas = 0;
var muerto = false;
var seg_pu = 0;
var reloj = new THREE.Clock();
var invencible = false;
var score = document.getElementById("score");
var textoInvencible = document.getElementById("pu");


/// La clase fachada del modelo
/**
 * Usaremos una clase derivada de la clase Scene de Three.js para llevar el control de la escena y de todo lo que ocurre en ella.
 */

class MyScene extends THREE.Scene {
  constructor (myCanvas) {
    super();
    
    // Lo primero, crear el visualizador, pasándole el lienzo sobre el que realizar los renderizados.
    this.renderer = this.createRenderer(myCanvas);
    
    // Se añade a la gui los controles para manipular los elementos de esta clase
    //this.gui = this.createGUI ();
    
    //this.initStats();
    
    // Construimos los distinos elementos que tendremos en la escena
    
    // Todo elemento que se desee sea tenido en cuenta en el renderizado de la escena debe pertenecer a esta. Bien como hijo de la escena (this en esta clase) o como hijo de un elemento que ya esté en la escena.
    // Tras crear cada elemento se añadirá a la escena con   this.add(variable)
    this.createLights ();
    //this.createFondo();
    
    

    this.model = new robot(this.gui, "Animaciones");


    
    this.add (this.model);
    roboto = this.model;
    roboto_centro.setFromMatrixPosition( roboto.matrixWorld );

    
    //this.add (this.gear);

   this.terreno = new terreno(this.gui,"dsa");
   

    
    this.add(this.terreno);

   var prototipoObstaculo = new THREE.Object3D;
      //var prototipoObstaculo = new señal();
    for(var i = 0; i < 12;i++){
        var aux = prototipoObstaculo.clone();
        
        aux.rotateY(Math.PI);
        aux.position.setFromSphericalCoords(42,i*(2*Math.PI/12),0);
        var x = this.terreno.position.x * 1;
        var y = this.terreno.position.y;
        var z = this.terreno.position.z * 1;

          aux.lookAt(x,y,z);
        
        
        //aux.lookAt(0,y,0);
        aux.rotateY(Math.PI);
        aux.rotateX(Math.PI/2);
        this.terreno.add(aux);
        aux.visible = false;
        aux.userData = {doble : false,inverso : i};
        obstaculos.push(aux);


      //}
    }

    console.log(obstaculos);

    var prototipoMoneda = new gear();
    for(var i = 0; i < 14;i++){
      var aux = prototipoMoneda.clone();
      aux.position.set(0,0.3,0);
      aux.userData.tipo = "moneda";
      aux.userData.alto = false;
      monedas.push(aux);
    }
    var prototiposenal = new señal();
    for(var i = 0; i < 4;i++){
      var aux = prototiposenal.clone();
      aux.position.set(0,-3,0);
      aux.userData.tipo = "alto";
      aux.userData.alto = true;
      objetos_simples.push(aux);
    }

    var prototipocaja = new caja();
    for(var i = 0; i < 6;i++){
      var aux = prototipocaja.clone();
      aux.position.set(0,-0.6,0);
      aux.userData.tipo = "a";
      aux.userData.alto = false;
      objetos_simples.push(aux);
    }

    for(var i = 0; i < 6;i++){
      var aux = prototipocaja.clone();
      aux.position.set(0,-0.6,0);
      aux.userData.tipo = "extra";
      aux.userData.alto = false;
      objetosExtras.push(aux);
    }

    var valla_aux;
    /* for(var i = 0; i < 6;i++){
      valla_aux = new valla(0);
      valla_aux.position.set(0,0,0);
      valla_aux.userData.tipo = "doble";
      valla_aux.userData.alto = true;
      obstaculos_dobles.push(valla_aux);
    } */
    for(var i = 0; i < 5;i++){
      valla_aux = new valla(-1);
      valla_aux.userData.tipo = "doble";
      valla_aux.userData.alto = true;
      valla_aux.userData.hueco = -1;
      obstaculos_dobles_izq.push(valla_aux);
    }

    for(var i = 0; i < 5;i++){
      valla_aux = new valla(0);
      valla_aux.userData.tipo = "doble";
      valla_aux.userData.alto = true;
      valla_aux.userData.hueco = 0;
      obstaculos_dobles_c.push(valla_aux);
    }

    for(var i = 0; i < 5;i++){
      valla_aux = new valla(1);
      valla_aux.userData.tipo = "doble";
      valla_aux.userData.alto = true;
      valla_aux.userData.hueco = 1;
      obstaculos_dobles_dr.push(valla_aux);
    }

    var prototipopu = new powerup();
    for(var i = 0; i < 4;i++){
      var aux = prototipopu.clone();
      aux.position.set(0,0.3,0);
      aux.userData.tipo = "pu";
      aux.userData.alto = false;
      powerups.push(aux);
    }

    for(var i = 0; i < num_particulas;i++){
      var vertice = new THREE.Vector3();
      vertices_explosion.push(vertice);
    }
    geo_explosion = new THREE.BufferGeometry().setFromPoints(vertices_explosion);
    var mat = new THREE.ParticleBasicMaterial({color:0xff0000,size:0.55 });
    particulas = new THREE.Points(geo_explosion,mat);
    this.add(particulas);
    particulas.visible = false;


    this.terreno.position.set(0,-41.5,10);
    //this.terreno.add(signal);
    // Tendremos una cámara con un control de movimiento con el ratón
    this.createCamera ();

    
    
  }
  

  
  createCamera () {
    // Para crear una cámara le indicamos
    //   El ángulo del campo de visión en grados sexagesimales
    //   La razón de aspecto ancho/alto
    //   Los planos de recorte cercano y lejano
    this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    //this.camera.position.z=-7.5;
    //this.camera.position.y=4.5;

    this.camera.position.z=0;
    this.camera.position.x=17.5;
    this.camera.position.y=-1;
  
    //this.camera.position.x+=10;
    
    // También se indica dónde se coloca
    //this.camera.position.set (20, 10, 20);
    // Y hacia dónde mira
    var look = new THREE.Vector3 (0,0,7);
    this.camera.lookAt(look);
    //this.camera.controls
    camara = this.camera;

    //this.pivote.add(this.camera)
    //this.add (this.pivote);
    this.add(this.camera)
    
    //// Para el control de cámara usamos una clase que ya tiene implementado los movimientos de órbita
    //this.cameraControl = new TrackballControls (this.camera, this.renderer.domElement);
   ///// Se configuran las velocidades de los movimientos
    //this.cameraControl.rotateSpeed = 5;
    //this.cameraControl.zoomSpeed = -2;
    //this.cameraControl.panSpeed = 0.5;
//
    ////this.cameraControl.rotateCamera();
    //// Debe orbitar con respecto al punto de mira de la cámara
    //this.cameraControl.target = look;
  }


  

  
  createLights () {
    // Se crea una luz ambiental, evita que se vean complentamente negras las zonas donde no incide de manera directa una fuente de luz
    // La luz ambiental solo tiene un color y una intensidad
    // Se declara como   var   y va a ser una variable local a este método
    //    se hace así puesto que no va a ser accedida desde otros métodos
    //var ambientLight = new THREE.AmbientLight(0xccddee, 0.35);
    // La añadimos a la escena
    //this.add (ambientLight);
    
    // Se crea una luz focal que va a ser la luz principal de la escena
    // La luz focal, además tiene una posición, y un punto de mira
    // Si no se le da punto de mira, apuntará al (0,0,0) en coordenadas del mundo
    // En este caso se declara como   this.atributo   para que sea un atributo accesible desde otros métodos.
    //this.spotLight = new THREE.SpotLight( 0xffffff, this.guiControls.lightIntensity );
    //this.spotLight.position.set( 60, 60, 40 );
    //this.add (this.spotLight);


    /******************/
    var ambientLight = new THREE.AmbientLight(0x111111);
    ambientLight.name = 'ambient';
    this.add(ambientLight);

    var hemisphereLight = new THREE.HemisphereLight(0xfffafa,0x000000, .9)
    this.add(hemisphereLight);
    var sun = new THREE.DirectionalLight( 0xcdc1c5,1.02 /* 0.9 */);
    sun.name="sun";
    sun.position.set( 3,30,-7 );
    sun.castShadow = true;
   
    this.add(sun);
    sun.shadow.mapSize.height = 512;
    sun.shadow.mapSize.width = 512;
	  sun.shadow.camera.near = 0.5;
	  sun.shadow.camera.far = 50 ;
    sun.shadow.camera.left = 15 ;
    sun.shadow.camera.right = -15 ;
    sun.shadow.camera.top = 17 ;
  }
  

  
  createRenderer (myCanvas) {
    // Se recibe el lienzo sobre el que se van a hacer los renderizados. Un div definido en el html.
    
    // Se instancia un Renderer   WebGL
    //renderer = new THREE.WebGLRenderer({alpha:true});
    var renderer = new THREE.WebGLRenderer({alpha:true});
    
    // Se establece un color de fondo en las imágenes que genera el render
    //renderer.setClearColor(new THREE.Color(0xEEEEEE), 1.0);

    //renderer with transparent backdrop
    renderer.setClearColor(0xfffafa, 1);
    renderer.shadowMap.enabled = true;//enable shadow
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    // Se establece el tamaño, se aprovecha la totalidad de la ventana del navegador
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    // La visualización se muestra en el lienzo recibido
    $(myCanvas).append(renderer.domElement);
    
    return renderer;  
  }
  
  getCamera () {
    // En principio se devuelve la única cámara que tenemos
    // Si hubiera varias cámaras, este método decidiría qué cámara devuelve cada vez que es consultado
    return this.camera;
  }
  
  setCameraAspect (ratio) {
    // Cada vez que el usuario modifica el tamaño de la ventana desde el gestor de ventanas de
    // su sistema operativo hay que actualizar el ratio de aspecto de la cámara
    this.camera.aspect = ratio;
    // Y si se cambia ese dato hay que actualizar la matriz de proyección de la cámara
    this.camera.updateProjectionMatrix();
  }
  
  onWindowResize () {
    // Este método es llamado cada vez que el usuario modifica el tamapo de la ventana de la aplicación
    // Hay que actualizar el ratio de aspecto de la cámara
    this.setCameraAspect (window.innerWidth / window.innerHeight);
    
    // Y también el tamaño del renderizador
    this.renderer.setSize (window.innerWidth, window.innerHeight);
  }
  onKeyDown (event) {
    var x = event.which || event.key;
    if(!comenzar){
      desaparecerTitulo();
      this.camera.position.z=-9.5;
            this.camera.position.y=4.5;
            this.camera.position.x=0;
            this.camera.lookAt(0,0,7);
            comenzar = true;
    }
    switch (x) {
      case 65 : 
        if(posicion != -1)
        if(!muerto)
         posicion-=1;
         break;
      case 68:
        if(posicion != 1)
        if(!muerto)
         posicion+=1;
         break;
      

    }
  }
  onMouseDown(event){
    if(!muerto){
    var mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth)*2 -1;
    mouse.y = 1-2*(event.clientY / window.innerHeight);

    var raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse,this.camera);
    var picked = raycaster.intersectObjects(this.model.children,true);
    if(picked.length > 0){
      this.model.saltar();
    }
  }


  }

  update () {
    
    if (this.stats) this.stats.update();
    
    // Se actualizan los elementos de la escena para cada frame
    
    // Se actualiza la posición de la cámara según su controlador
    //this.cameraControl.update();

    //this.camera.rotation.y+=0.003;
    //this.camera.rotateOnWorldAxis(eje_vertical,0.003);
    //this.pivote.rotation.y+=0.003;

    if(shake.enabled){
      shake.update(this.camera);
    }
    // Se actualiza el resto del modelo
    //this.model.update();
    //this.signal.update();
    if(!muerto)
      this.terreno.update();
    //this.gear.update();
    
    
    // Le decimos al renderizador "visualiza la escena que te indico usando la cámara que te estoy pasando"
    this.renderer.render (this, this.getCamera());

    // Este método debe ser llamado cada vez que queramos visualizar la escena de nuevo.
    // Literalmente le decimos al navegador: "La próxima vez que haya que refrescar la pantalla, llama al método que te indico".
    // Si no existiera esta línea,  update()  se ejecutaría solo la primera vez.
    requestAnimationFrame(() => this.update())

    ////this.background.rotation.x-=0.003;
    /////this.rotation.y+=0.01;
    //this.rotation.x+=0.001;
    ////this.getObjectByName("sun").rotation.x+=2.0;
    this.getObjectByName("sun").position.y =5 * Math.sin(Date.now() / 4400);
    this.getObjectByName("sun").position.x =5 * Math.cos(Date.now() / 4400);
    ////this.getObjectByName("sun").position.z = 10000 * Math.cos(Date.now() / 240);
    //console.log(this.sun);
    //this.powerup.update();
    this.model.update(posicion);
    //this.generarNivel();
    if(comenzar && !muerto){
      this.logicaObstaculos();
      this.controlarColision();
      logica_explosion();
    }
    //console.log(colocados);

    
    
    colocados.forEach(function(element,index){
     element.update();

    });

    if(seg_pu > 0){
      seg_pu -= reloj.getDelta();
      invencible = true;
    }
    else if(invencible){
      desaparecerPU();
      seg_pu = 0;
      invencible = false;
      reloj.stop();
    }
    //console.log(invencible);
    
  }
  
  

  controlarColision(){
   

     colocados.forEach(function(element,index){
      var o = element.parent;

      var pos_robot = new THREE.Vector3();
      var contacto = new THREE.Vector3();
      var contacto_alto = new THREE.Vector3();


      contacto.setFromMatrixPosition( o.matrixWorld );
      contacto_alto.setFromMatrixPosition( o.matrixWorld );
      pos_robot.setFromMatrixPosition( roboto.matrixWorld );
      var tipo = element.userData.tipo;

      /* if(o.userData.inverso < 7 && o.userData.inverso != 0){
        d.x = element.position.x;
        a.x = element.position.x;
      }
        else{
          d.x = -element.position.x;
          a.x = -element.position.x;
        }
      //d.x = element.position.x;
      a.y+=2.7; */


    if(contacto.distanceTo(pos_robot) <=12){
      if(tipo == "doble"){
        //console.log(roboto_centro);
        //console.log()
        if(roboto_centro.distanceTo(contacto) <= 0.7){
          if(element.userData.hueco == -1){
            
            //console.log("Soy -1");
            //console.log(pos_robot.x);
            if(o.userData.inverso < 7 && o.userData.inverso != 0){
              if(pos_robot.x <=2 && !invencible){
                morir();
              }
            }
            else{
              if(pos_robot.x >=-2 && !invencible){
                morir();
              }
            }
            
          }
          else if(element.userData.hueco == 0){
            //console.log("SOYYYYYy 0");
            if(pos_robot.x >=2 ||pos_robot.x <=-2 && !invencible){
              morir();
            }

          }
          else{
            if(o.userData.inverso < 7 && o.userData.inverso != 0){
              
              if(pos_robot.x >=-2 && !invencible){
                morir();
              }
            }
            else{
              if(pos_robot.x <=2 && !invencible){
                morir();
              }
            }
            
          }
        }

      }
      else if(tipo == "moneda"){
        if(o.userData.inverso < 7 && o.userData.inverso != 0){
          contacto.x = element.position.x;
          
        }
        else{
          contacto.x = -element.position.x;
        }
        contacto.y = element.position.y;

        if(contacto.distanceTo(pos_robot) <= 2.2 && o.visible && element.visible){
          monedas_conseguidas++;
          aumentarMonedas();
          element.visible = false;
         // roboto.morir();
        }

      }
      else if(tipo == "pu"){
        if(o.userData.inverso < 7 && o.userData.inverso != 0){
          contacto.x = element.position.x;
          
        }
        else{
          contacto.x = -element.position.x;
        }
        contacto.y = element.position.y;

        if(contacto.distanceTo(pos_robot) <= 1 && o.visible && element.visible){
          //console.log("hit pu");
          explotar();
          aparecerPU();
          seg_pu = 7;
          reloj.start();
          element.visible = false;
        }
          

      }
      else if(tipo == "alto"){

        if(o.userData.inverso < 7 && o.userData.inverso != 0){
          contacto.x = element.position.x;
          contacto_alto.x = element.position.x;
        }
        else{
          contacto.x = -element.position.x;
          contacto_alto.x = -element.position.x;
        }
        contacto.y =1;
        contacto_alto.y = 3;

        //console.log(contacto);

        if((contacto.distanceTo(pos_robot) <= 1.5 || contacto_alto.distanceTo(pos_robot) <= 1.8) && o.visible && element.visible && !invencible){
          //console.log("hit obs alto");
          //element.visible = false;
          morir();
        }

      }
      else{
        if(o.userData.inverso < 7 && o.userData.inverso != 0){
          contacto.x = element.position.x;
          
        }
        else{
          contacto.x = -element.position.x;
        }
        contacto.y = element.position.y;

        if(contacto.distanceTo(pos_robot) <= 1.5 && o.visible && element.visible && !invencible){
          //console.log("hit obs");
          //element.visible = false;
          morir();
          
          
        }

      }
    }
      
      

     /*  if((d.distanceTo(pr) <= 1 || a.distanceTo(pr) <= 1.7) && o.visible == true){
        if(element.userData.tipo == "moneda"){
          console.log("chiclin");
          element.visible = false;
        }
        else
        console.log("hit");

      } */
      
       
 
       
     });

  }
  generarNivel(){
    var o;
    var v = new THREE.Vector3();
    var com = new THREE.Vector3(0,-20.33653437574133,46.27819900120211);
    var des = new THREE.Vector3(0,-5.221800998797903,-11.163465624258684);
    var desap;
    obstaculos.forEach(function(element,index){
      o = obstaculos[index];
      v.setFromMatrixPosition( o.matrixWorld );
      
      if(v.distanceTo(com)<=0.2  && monedas.length > 0 && o.visible == false){
         o.visible = true;
          //Setear el obstaculo
          var moneda = monedas.pop();
          var hueco = generarHueco();
          var pos;

          if(hueco == 0){
            pos = 6;
          }
          else if(hueco == -1){
            pos = 0;
          }
          else{
            pos = -6;
          }
          
          //console.log(moneda);
          //moneda.position.setFromSphericalCoords(42,50,50);
          
         
          o.add(moneda);

          if(o.userData.inverso < 7 && o.userData.inverso != 0)
            moneda.position.x = pos;
          else
          moneda.position.x = -pos;
          //moneda.matrixWorld.copy(moneda.matrix);
          
         // console.log(o);

          colocados.push(moneda);
          
          
          
      }
      else if(v.distanceTo(des)<=0.2 && o.children.length>0  && o.visible == true){
        //desaparecer
        
        desap = colocados.shift();
        //console.log(desap);
        //desap.removeFromParent;
        desap.removeFromParent();

        //desap.scale.set(10,10,10);
        //desap.updateMatrixWorld();
        //desap.position.set(0,4,0);
        monedas.push(desap);
        o.visible = false;
        
      }

      

      
    });
  }


  logicaObstaculos(){
    var zona_aparecer = new THREE.Vector3(0,-20.33653437574133,46.27819900120211);
    var zona_desaparecer = new THREE.Vector3(0,-5.221800998797903,-11.163465624258684);
    var obstaculo;
    var pos_o = new THREE.Vector3();
    var Obj_desaparecer;
    var tipo_objeto;
    var hueco;

    var hay_doble;
    var hay_pu;
    var hay_obj_ex;
    var hay_caja_encima;

    obstaculos.forEach(function(element,index){
      obstaculo = obstaculos[index];
      pos_o.setFromMatrixPosition( obstaculo.matrixWorld );

      if(pos_o.distanceTo(zona_aparecer)<=0.2 && obstaculo.visible == false){
        obstaculo.visible = true;
        hueco = generarHueco();
        //console.log(hueco);

        hay_doble = generarDoble();

        if(hay_doble){
          /* if(obstaculo.userData.inverso < 7 && obstaculo.userData.inverso != 0){
           var valla = elegir_valla(hueco);
           //valla.position.y = 23;
          }
          else{
            var valla = elegir_valla(hueco * (-1));
            valla.position.y = 0;
            
          }
 */
          var valla = elegir_valla(hueco);
          obstaculo.add(valla);
          colocados.push(valla);

          hay_obj_ex = generar_obj_extra();
          if(hay_obj_ex){
            var caja_extra = objetosExtras.shift();
            /* if(obstaculo.userData.inverso < 7 && obstaculo.userData.inverso != 0)
              caja_extra.position.x = hueco*6;
            else */
            caja_extra.position.x = -hueco*6;

            //caja_extra.position.x = -hueco*6;

            obstaculo.add(caja_extra);
            colocados.push(caja_extra);

            hay_pu = generarPU();
            if(hay_pu){
              var pu  = powerups.shift();
              /* if(obstaculo.userData.inverso < 7 && obstaculo.userData.inverso != 0)
                pu.position.x = hueco*6;
              else */
                pu.position.x = -hueco*6;
                //pu.position.x = -hueco*6;

            pu.position.y=3;
            obstaculo.add(pu);
            colocados.push(pu);

            }
            else{
              var moneda  = monedas.shift();
              /* if(obstaculo.userData.inverso < 7 && obstaculo.userData.inverso != 0)
              moneda.position.x = hueco*6;
            else */
              moneda.position.x = -hueco*6;
              //moneda.position.x = -hueco*6;

            moneda.position.y=3;
              obstaculo.add(moneda);
              colocados.push(moneda);

            }
          }
          else{//no hay extra
            hay_pu = generarPU();
            if(hay_pu){
              var pu  = powerups.shift();
              /* if(obstaculo.userData.inverso < 7 && obstaculo.userData.inverso != 0)
              pu.position.x = hueco*6;
              else */
              pu.position.x = -hueco*6;
              obstaculo.add(pu);
              colocados.push(pu);

            }
            else{
              var moneda  = monedas.shift();
              /* if(obstaculo.userData.inverso < 7 && obstaculo.userData.inverso != 0)
                moneda.position.x = hueco*6;
              else */
                moneda.position.x = - hueco*6;
              moneda.position.y = 0.3
              obstaculo.add(moneda);
              colocados.push(moneda);
            }

          }
        }
        else{//no es doble;
          var obj_no_doble = objetos_simples.shift();
          //ssleecionar la posicion
          var posicion_obj_no_doble = generar_sitio(hueco);
          if(obstaculo.userData.inverso < 7 && obstaculo.userData.inverso != 0)
            obj_no_doble.position.x = posicion_obj_no_doble*6;
          else
            obj_no_doble.position.x = - posicion_obj_no_doble*6;

            obstaculo.add(obj_no_doble);
            colocados.push(obj_no_doble);

            if(!obj_no_doble.userData.alto){//si no es alto
              hay_obj_ex = generar_obj_extra();
              if(hay_obj_ex){
                var caja_extra = objetosExtras.shift();
                var pos_doblete = -(hueco + posicion_obj_no_doble);
                if(obstaculo.userData.inverso < 7 && obstaculo.userData.inverso != 0)
                  caja_extra.position.x = pos_doblete*6;
                else
                  caja_extra.position.x =- pos_doblete*6;

                obstaculo.add(caja_extra);
                colocados.push(caja_extra);



                hay_pu = generarPU();
                if(hay_pu){
                  var pu  = powerups.shift();
                  if(obstaculo.userData.inverso < 7 && obstaculo.userData.inverso != 0)
                   pu.position.x = hueco*6;
                  else
                    pu.position.x =- hueco*6;
                  obstaculo.add(pu);
                  colocados.push(pu);
                }
                else{//doble moneda
                  var moneda1  = monedas.shift();
                  var moneda2  = monedas.shift();
                  pos_doblete = (hueco);

                  if(obstaculo.userData.inverso < 7 && obstaculo.userData.inverso != 0){
                    moneda1.position.x = pos_doblete*6;
                    moneda2.position.x = pos_doblete*6;
                  }
                  else{
                    moneda1.position.x = -pos_doblete*6;
                    moneda2.position.x = -pos_doblete*6;
                  }
                  moneda1.position.y = 1;
                  moneda2.position.y=2.5;
                  obstaculo.add(moneda1);
                  obstaculo.add(moneda2);
                  colocados.push(moneda1);
                  colocados.push(moneda2);
                }
              }
              else{//doble monedas
                var moneda1  = monedas.shift();
                var moneda2  = monedas.shift();
                var pos_doblete = -(hueco + posicion_obj_no_doble);

                if(obstaculo.userData.inverso < 7 && obstaculo.userData.inverso != 0){
                  moneda1.position.x = pos_doblete*6;
                  moneda2.position.x = pos_doblete*6;
                }
                else{
                  moneda1.position.x = -pos_doblete*6;
                  moneda2.position.x = -pos_doblete*6;
                }
                moneda1.position.y = 1;
                moneda2.position.y=2.5;
                obstaculo.add(moneda1);
                obstaculo.add(moneda2);
                colocados.push(moneda1);
                colocados.push(moneda2);
                
              }
            }
            else{
              hay_obj_ex = generar_obj_extra();
              if(hay_obj_ex){//caje encima
                var caja_extra = objetosExtras.shift();
                var pos_doblete = -(hueco + posicion_obj_no_doble);
                if(obstaculo.userData.inverso < 7 && obstaculo.userData.inverso != 0)
                  caja_extra.position.x = pos_doblete*6;
                else
                  caja_extra.position.x = -pos_doblete*6;

                obstaculo.add(caja_extra);
                colocados.push(caja_extra);

                hay_caja_encima = generar_caja_encima();
                if(hay_caja_encima){
                  var caja_encima = objetosExtras.shift();
                  if(obstaculo.userData.inverso < 7 && obstaculo.userData.inverso != 0)
                    caja_encima.position.x = pos_doblete*6;
                  else
                    caja_encima.position.x = -pos_doblete*6;
                  caja_encima.position.y=3;
                  obstaculo.add(caja_encima);
                  colocados.push(caja_encima);

                  hay_pu = generarPU();
                  if(hay_pu){
                    var pu  = powerups.shift();
                    if(obstaculo.userData.inverso < 7 && obstaculo.userData.inverso != 0)
                     pu.position.x = hueco*6;
                    else
                      pu.position.x =- hueco*6;
                    obstaculo.add(pu);
                    colocados.push(pu);
                  }
                  else{
                    var moneda  = monedas.shift();
                    if(obstaculo.userData.inverso < 7 && obstaculo.userData.inverso != 0)
                      moneda.position.x = hueco*6;
                    else
                      moneda.position.x = - hueco*6;
                      moneda.position.y = 1;
                    obstaculo.add(moneda);
                    colocados.push(moneda);

                  }

                }
                else{
                  hay_pu = generarPU();
                  if(hay_pu){
                    var pu  = powerups.shift();
                    if(obstaculo.userData.inverso < 7 && obstaculo.userData.inverso != 0)
                     pu.position.x = hueco*6;
                    else
                      pu.position.x =- hueco*6;
                    obstaculo.add(pu);
                    colocados.push(pu);
                  }
                  else{
                    var moneda  = monedas.shift();
                    if(obstaculo.userData.inverso < 7 && obstaculo.userData.inverso != 0)
                      moneda.position.x = hueco*6;
                    else
                      moneda.position.x = - hueco*6;
                    obstaculo.add(moneda);
                    colocados.push(moneda);

                  }
                }



              }
              else{
                hay_pu = generarPU();
                if(hay_pu){
                  var pu  = powerups.shift();
                  if(obstaculo.userData.inverso < 7 && obstaculo.userData.inverso != 0)
                   pu.position.x = hueco*6;
                  else
                    pu.position.x =- hueco*6;
                  obstaculo.add(pu);
                  colocados.push(pu);
                }
                else{
                  var moneda1  = monedas.shift();
                  var moneda2  = monedas.shift();
                  var pos_doblete = -(hueco + posicion_obj_no_doble);

                  if(obstaculo.userData.inverso < 7 && obstaculo.userData.inverso != 0){
                    moneda1.position.x = pos_doblete*6;
                    moneda2.position.x = pos_doblete*6;
                  }
                  else{
                    moneda1.position.x = -pos_doblete*6;
                    moneda2.position.x = -pos_doblete*6;
                  }
                  moneda1.position.y=1;
                  moneda2.position.y=2.5;
                  obstaculo.add(moneda1);
                  obstaculo.add(moneda2);
                  colocados.push(moneda1);
                  colocados.push(moneda2);
                }

              }


            }

          
        }

      }
      else if(pos_o.distanceTo(zona_desaparecer)<=0.2 && obstaculo.children.length>0  && obstaculo.visible == true){//children creo que no hace falta
        obstaculo.visible = false;
        for(var i = 0; i < obstaculo.children.length;i++){
          Obj_desaparecer = colocados.shift();
          Obj_desaparecer.removeFromParent();
          tipo_objeto = Obj_desaparecer.userData.tipo;
          if( tipo_objeto == "moneda"){
            Obj_desaparecer.visible = true;
            monedas.push(Obj_desaparecer);
          }
          else if(tipo_objeto == "doble"){
            //obstaculos_dobles.splice(Obj_desaparecer.userData.hueco,0,Obj_desaparecer);
            if(Obj_desaparecer.userData.hueco == -1){
              obstaculos_dobles_izq.push(Obj_desaparecer);
            }
            else if(Obj_desaparecer.userData.hueco == 0){
              obstaculos_dobles_c.push(Obj_desaparecer);
            }
            else{
              obstaculos_dobles_dr.push(Obj_desaparecer);
            }
            //obstaculos_dobles.push(Obj_desaparecer);
          }
          else if(tipo_objeto == "extra"){
            objetosExtras.push(Obj_desaparecer);
          }
          else if(tipo_objeto == "pu"){
            Obj_desaparecer.visible = true;
            powerups.push(Obj_desaparecer);


          }
          else{
            objetos_simples.push(Obj_desaparecer);
          }
          
        }
      }
    });
  }

}

function generarHueco(){
  return Math.floor((Math.random() * (1 - (-1) + 1))  -1);
}

function generarPU(){
  var p = Math.floor((Math.random() * (9 - (0) + 1)));
  var pu = false;
  if(p == 0){
    pu = true;
  }
  return pu;
}
function generarDoble(){
  var p = Math.floor((Math.random() * (9 - (0) + 1)));
  var pu = false;
  if(p < 3){
    pu = true;
  }
  return pu;
}

function generar_obj_extra(){
  var p = Math.floor((Math.random() * (9 - (0) + 1)));
  var pu = false;
  if(p < 4){
    pu = true;
  }
  return pu ;
}

function generar_sitio(hueco){
  var eleccion = hueco;
  while(eleccion == hueco){
    eleccion = Math.floor((Math.random() * (1 - (-1) + 1))  -1);
  }
  return eleccion;
}

function generar_caja_encima(){
  var p = Math.floor((Math.random() * (9 - (0) + 1)));
  var pu = false;
  if(p < 7){
    pu = true;
  }
  return pu && (objetosExtras.length > 0) ;
}

function elegir_valla(hueco){
  var valla;
  //hueco = 1;
  if(hueco == -1){
    valla = obstaculos_dobles_izq.shift();
  }
  else if(hueco == 0){
    valla = obstaculos_dobles_c.shift();
  }
  else{
    valla = obstaculos_dobles_dr.shift();
  }

  return valla;
}

function explotar(){
  particulas.position.y = roboto.position.y;
  particulas.position.z = roboto.position.z;
  particulas.position.x = roboto.position.x;
  var posiciones = geo_explosion.attributes.position.array;

  for(var i = 0; i < posiciones.length;i+=3){

    posiciones[i] = -0.2+Math.random() * 0.4;
    posiciones[i+1] = -0.2+Math.random() * 0.4;
    posiciones[i+2] = -0.2+Math.random() * 0.4;

    
  }
  geo_explosion.attributes.position.needsUpdate = true;
  //fuerza_explosion = 1.07;
  fuerza_explosion = 1.37;
  //fuerza_explosion = 1.05;
  particulas.visible = true;
}

function logica_explosion(){
  if(!particulas.visible)return;
  var posiciones = geo_explosion.attributes.position.array;
  for(var i = 0; i < posiciones.length;i+=3){
    var auxv = new THREE.Vector3( posiciones[i], posiciones[i+1], posiciones[i+2]).multiplyScalar(fuerza_explosion);

    posiciones[i] = auxv.x
    posiciones[i+1] =auxv.y
    posiciones[i+2] =auxv.z

    
  }
  geo_explosion.attributes.position.needsUpdate = true;
  if(fuerza_explosion > 1.005){
    fuerza_explosion-=0.001;
  }
  else{
    particulas.visible = false;
  }
}

//!shake camera
function ScreenShake() {

	return {

		// When a function outside ScreenShake handle the camera, it should
		// always check that ScreenShake.enabled is false before.
		enabled: false,

		_timestampStart: undefined,

		_timestampEnd: undefined,

		_startPoint: undefined,

		_endPoint: undefined,



		// update(camera) must be called in the loop function of the renderer,
		// it will re-position the camera according to the requested shaking.
		update: function update(camera) {
			if ( this.enabled == true ) {
				const now = Date.now();
				if ( this._timestampEnd > now ) {
					let interval = (Date.now() - this._timestampStart) / 
						(this._timestampEnd - this._timestampStart) ;
					this.computePosition( camera, interval );
				} else {
					camera.position.copy(this._startPoint);
					this.enabled = false;
				};
			};
		},



		// This initialize the values of the shaking.
		// vecToAdd param is the offset of the camera position at the climax of its wave.
		shake: function shake(camera, vecToAdd, milliseconds) {
			this.enabled = true ;
			this._timestampStart = Date.now();
			this._timestampEnd = this._timestampStart + milliseconds;
			this._startPoint = new THREE.Vector3().copy(camera.position);
			this._endPoint = new THREE.Vector3().addVectors( camera.position, vecToAdd );
		},




		computePosition: function computePosition(camera, interval) {

			// This creates the wavy movement of the camera along the interval.
			// The first bloc call this.getQuadra() with a positive indice between
			// 0 and 1, then the second call it again with a negative indice between
			// 0 and -1, etc. Variable position will get the sign of the indice, and
			// get wavy.
			if (interval < 0.4) {
				var position = this.getQuadra( interval / 0.4 );
			} else if (interval < 0.7) {
				var position = this.getQuadra( (interval-0.4) / 0.3 ) * -0.6;
			} else if (interval < 0.9) {
				var position = this.getQuadra( (interval-0.7) / 0.2 ) * 0.3;
			} else {
				var position = this.getQuadra( (interval-0.9) / 0.1 ) * -0.1;
			}
			
			// Here the camera is positioned according to the wavy 'position' variable.
			camera.position.lerpVectors( this._startPoint, this._endPoint, position );
		},

		// This is a quadratic function that return 0 at first, then return 0.5 when t=0.5,
		// then return 0 when t=1 ;
		getQuadra: function getQuadra(t) {
			return 9.436896e-16 + (4*t) - (4*(t*t)) ;
		}

	};

};

function morir(){
  roboto.morir();
  shake.shake( camara, new THREE.Vector3(0.6, 0, 0), 400 /* ms */ );
  muerto = true;
}

function desaparecerTitulo(){
  var titulo = document.getElementById("titulo");
  var score = document.getElementById("puntuacion");
  var puntuacion = document.getElementById("controles")
  score.style.display = "block";
  puntuacion.style.display = "block";
  /* while(titulo.style.opacity > 0){
    titulo.style.opacity = titulo.style.opacity - 0.001;
  } */
  /* while(titulo.style.opacity > 0){
    titulo.style.opacity = 0.5;
  } */
  titulo.style.opacity = 0.2;
  titulo.style.fontSize = "50px";
  titulo.style.left = "35%";
  titulo.style.top = "5%";
}

function aparecerPU(){
  textoInvencible.style.display = "block";
}

function desaparecerPU(){
  textoInvencible.style.display = "none";
}

function aumentarMonedas(){
  score.innerHTML = monedas_conseguidas;
}

/// La función   main
$(function () {
  
  // Se instancia la escena pasándole el  div  que se ha creado en el html para visualizar
  var scene = new MyScene("#WebGL-output");
  var niebla = new THREE.FogExp2( 0xf0fff0, 0.017 );
  scene.fog = niebla;

  var path = "./texturas/cielo/";
  var formato = ".png";
  var urls = [
    path + "px" + formato,path + "nx" + formato,
    path + "py" + formato,path + "ny" + formato,
    path + "pz" + formato,path + "nz" + formato,
  ];
  var cielo = new THREE.CubeTextureLoader().load(urls);
  scene.background = cielo;


  // Se añaden los listener de la aplicación. En este caso, el que va a comprobar cuándo se modifica el tamaño de la ventana de la aplicación.
  window.addEventListener ("resize", () => scene.onWindowResize());
  window.addEventListener ("keydown", (event) => scene.onKeyDown (event), true);
  window.addEventListener ("mousedown", (event) => scene.onMouseDown(event), true);
  
  // Que no se nos olvide, la primera visualización.
  scene.update();
});
