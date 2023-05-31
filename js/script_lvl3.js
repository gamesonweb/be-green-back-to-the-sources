import Player from "./player.js";
import MovingPlat from "./movingPlat.js";
import movingPlatHori from "./movingPlatHori.js";
import { inputState, definirEcouteur } from "./ecouteur.js";

var canvas = document.getElementById("myCanvas");
var engine = new BABYLON.Engine(canvas, true)
definirEcouteur();

// Création de la scène
var canvas = document.getElementById("renderCanvas");
var engine = new BABYLON.Engine(canvas, true);
var scene = new BABYLON.Scene(engine);

var popUp = false;

//Création de l'arrière plan
var background = new BABYLON.Layer("back", "../assets/background/desert_background.png", scene);
background.isBackground = true;

// Créer les plateformes
var defaultMaterial = new BABYLON.StandardMaterial("defaultMaterial", scene);
var texturedefault = new BABYLON.Texture("../assets/background/dirt.png", scene);
defaultMaterial.diffuseTexture = texturedefault;

var platformPositions = [{ x: 0, y: 0 },  { x: 4, y: 0 }  , {x:32,y:15},{x: 36, y:15},  {x:40,y:15} , {x:48, y:15},{x:56, y:15},{x:63, y:15},{x:69, y:15},{x:78, y:15},{x:87, y:10},{x:97, y:5},{x:109, y:0},{x:114, y:0},{x:120, y:0},{x:127, y:0},{x:135, y:0},{x:144, y:0},{x:148, y:0},{x:152, y:0}];
for (var i = 0; i < platformPositions.length; i++) {
  var platform = BABYLON.MeshBuilder.CreateBox("platform" + i, {width: 4, height: 1, depth: 2}, scene);
  platform.position.x = platformPositions[i].x;
  platform.position.y = platformPositions[i].y;
  platform.checkCollisions = true;
  platform.material = defaultMaterial;
}

// Créer les plateformes mobiles
var texture = new BABYLON.Texture("../assets/background/monvingPlatVert.png", scene);
var material = new BABYLON.StandardMaterial("material", scene);
material.diffuseTexture = texture;

var texture2 = new BABYLON.Texture("../assets/background/monvingPlatHori.png", scene);
var material2 = new BABYLON.StandardMaterial("material", scene);
material2.diffuseTexture = texture2;

var movingPlat = new MovingPlat(12,0);
movingPlat.createMovingPlat(scene);
movingPlat.mesh.material = material;

var movingPlat2 = new movingPlatHori(12,10);
movingPlat2.createMovingPlat(scene);
movingPlat2.mesh.material = material2;

var movingPlat3 = new MovingPlat(26,4);
movingPlat3.createMovingPlat(scene);
movingPlat3.mesh.material = material;

var endLV1 = BABYLON.MeshBuilder.CreateBox("endLV1", {width: 1, height: 7, depth: 2}, scene);
endLV1.position.x = 153.5;
endLV1.position.y = 3;

var texture = new BABYLON.Texture("../assets/background/damier.png", scene);
var material = new BABYLON.StandardMaterial("material", scene);
material.diffuseTexture = texture;
endLV1.material = material;

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
        if(hit.pickedMesh.name == "movingPlat"){
            
            player.moveUpPlat();
        }
        if (hit.pickedMesh.material.name == "defaultMaterial" && hit.pickedMesh.name != "greenPlatform"){
            //Prend un chiffre entre 1 et 3 aléatoirement
            var random = Math.floor(Math.random() * 3);
            console.log(hit.pickedMesh.material.name);
            hit.pickedMesh.name = "greenPlatform";
            if(random == 1){
                BABYLON.SceneLoader.ImportMesh("", "../assets/models/green_platform.glb", "", scene, function (newMeshes) {
                    newMeshes[0].position = hit.pickedMesh.position;
                    newMeshes[0].scaling = new BABYLON.Vector3(1.01, 1.25, 1.01);
                    newMeshes[0].rotation = new BABYLON.Vector3(0, Math.PI/2, 0);
                });
            }
            else if (random == 2){
                BABYLON.SceneLoader.ImportMesh("", "../assets/models/green_platform2.glb", "", scene, function (newMeshes2) {
                    newMeshes2[0].position = hit.pickedMesh.position;
                    newMeshes2[0].scaling = new BABYLON.Vector3(1.01, 1.25, 1.01);
                    newMeshes2[0].rotation = new BABYLON.Vector3(0, Math.PI/2, 0);
                });
            }
            else {
                BABYLON.SceneLoader.ImportMesh("", "../assets/models/green_platform3.glb", "", scene, function (newMeshes2) {
                    newMeshes2[0].position = hit.pickedMesh.position;
                    newMeshes2[0].scaling = new BABYLON.Vector3(1.01, 1.25, 1.01);
                    newMeshes2[0].rotation = new BABYLON.Vector3(0, Math.PI/2, 0);
                });
            }
        }
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


    if(player.mesh.position.x > 154 && popUp == false){
        popUp = true;
        window.alert("Felicitation vous avez fini le jeu !");
    }

    player.gravity();

    player.RespawnIsDead();

    movingPlat.move();
    movingPlat2.move();
    movingPlat3.move();

    scene.render();
});

// Redimensionnement de la scène si la fenêtre est redimensionnée
window.addEventListener("resize", function() {
    engine.resize();
});