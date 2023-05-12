import Player from "./player.js";
import { inputState, definirEcouteur } from "./ecouteur.js";

var canvas = document.getElementById("myCanvas");
var engine = new BABYLON.Engine(canvas, true)
definirEcouteur();

// Création de la scène
var canvas = document.getElementById("renderCanvas");
var engine = new BABYLON.Engine(canvas, true);
var scene = new BABYLON.Scene(engine);


// Créer les plateformes
var platformPositions = [  { x: 0, y: 0 },  { x: 4, y: 0 },  { x: 8, y: 0 },  { x: 12, y: 0 },  { x: 16, y: 0 }, { x: 20, y: 0 }, { x: 28, y: 0 }, { x: 34, y: 4 }, { x: 38, y: 4 }, { x: 48, y: 8 }, { x: 58, y: 10 }];

for (var i = 0; i < platformPositions.length; i++) {
  var platform = BABYLON.MeshBuilder.CreateBox("platform" + i, {width: 4, height: 1, depth: 2}, scene);
  platform.position.x = platformPositions[i].x;
  platform.position.y = platformPositions[i].y;
  platform.checkCollisions = true;
}

/*
var platform = BABYLON.MeshBuilder.CreateBox("platform", {width: 4, height: 1, depth: 2}, scene);
platform.position.x = 0;
platform.position.y = 0;
platform.checkCollisions = true;

var platform2 = BABYLON.MeshBuilder.CreateBox("platform2", {width: 4, height: 1, depth: 2}, scene);
platform2.position.x = 4;
platform2.position.y = 0;
platform2.checkCollisions = true;

var platform3 = BABYLON.MeshBuilder.CreateBox("platform3", {width: 4, height: 1, depth: 2}, scene);
platform3.position.x = 14;
platform3.position.y = 8;
platform3.checkCollisions = true;

var platform4 = BABYLON.MeshBuilder.CreateBox("platform3", {width: 4, height: 1, depth: 2}, scene);
platform4.position.x = 20;
platform4.position.y = 5;
platform4.checkCollisions = true;
*/


// Création joueur
var player = new Player();
player.createPlayer(scene);

// Créer un rayon sous le joueur 
var ray = new BABYLON.Ray();
var rayHelper = new BABYLON.RayHelper(ray);
rayHelper.attachToMesh(player.mesh, new BABYLON.Vector3(0, -1, 0), new BABYLON.Vector3(0, 0, 0), 2);
//rayHelper.show(scene); //Affiche le rayon



// Création de la caméra qui suis le joueur de côté 
var camera = new BABYLON.FollowCamera("camera", new BABYLON.Vector3(0, 0, -10), scene);
camera.lockedTarget = player.mesh;
camera.radius = 10;
camera.heightOffset = 4;
camera.rotationOffset = 180;



// Ajout de la lumière
var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);



// Lancement de la boucle de rendu
engine.runRenderLoop(function() {

    //Si le rayon touche un mesh le mesh change de couleur en vert
    var hit = scene.pickWithRay(ray, function(mesh) {
        return mesh.name != "player";
    });
    if(hit.pickedMesh){
        hit.pickedMesh.material = new BABYLON.StandardMaterial("material", scene);
        hit.pickedMesh.material.diffuseColor = new BABYLON.Color3(0, 1, 0);
    }
    if(inputState.left){
        player.moveLeft();
    }
    if(inputState.right){
        player.moveRight();
    }
    if(inputState.up){

        if (Date.now()-player.lastjumpTime > player.jumpColwdown && hit.pickedMesh!=null){
            player.jump = true;
            player.lastjumpTime = Date.now();

        }
    }
    if(player.jump){
       player.mesh.moveWithCollisions(new BABYLON.Vector3(0,0.4,0));
       if(Date.now()-player.lastjumpTime > player.jumptime){
        player.jump = false;
       }
    }
    
    player.gravity();

    player.RespawnIsDead();

    scene.render();
});

// Redimensionnement de la scène si la fenêtre est redimensionnée
window.addEventListener("resize", function() {
    engine.resize();
});



var tex_background;
var tex_middleground;
var tex_foreground;

tex_background = "resources/lands_background.png";
tex_middleground = "resources/lands_middleground.png";
tex_foreground = "resources/lands_foreground.png";