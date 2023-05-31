import Player from "./player.js";
import { inputState, definirEcouteur } from "./ecouteur.js";

var canvas = document.getElementById("myCanvas");
var engine = new BABYLON.Engine(canvas, true)
definirEcouteur();

// Création de la scène
var canvas = document.getElementById("renderCanvas");
var engine = new BABYLON.Engine(canvas, true);
var scene = new BABYLON.Scene(engine);

//Création de l'arrière plan
var background = new BABYLON.Layer("back", "../assets/background/forest_background.png", scene);
background.isBackground = true;

// Créer les plateformes
var defaultMaterial = new BABYLON.StandardMaterial("defaultMaterial", scene);
var texturedefault = new BABYLON.Texture("../assets/background/dirt.png", scene);
defaultMaterial.diffuseTexture = texturedefault;

var platformPositions = [{ x: 0, y: 0 },  { x: 4, y: 0 },  { x: 8, y: 0 },  { x: 12, y: 0 },  { x: 16, y: 0 }, { x: 20, y: 0 }, { x: 28, y: 0 }, { x: 34, y: 3 }, { x: 38, y: 3 }, { x: 48, y: 0 }, { x: 52, y: 1 },{ x:56 , y: 2 },{ x: 60, y: 3 },{ x: 64, y: 3 },{ x: 68, y: 3 }];
for (var i = 0; i < platformPositions.length; i++) {
  var platform = BABYLON.MeshBuilder.CreateBox("platform" + i, {width: 4, height: 1, depth: 2}, scene);
  platform.position.x = platformPositions[i].x;
  platform.position.y = platformPositions[i].y;
  platform.checkCollisions = true;
  platform.material = defaultMaterial;
}
var endLV1 = BABYLON.MeshBuilder.CreateBox("endLV1", {width: 1, height: 7, depth: 2}, scene);
endLV1.position.x = 70;
endLV1.position.y = 6;

// Crée une texture 
var texture = new BABYLON.Texture("../assets/background/damier.png", scene);
var material = new BABYLON.StandardMaterial("material", scene);
material.diffuseTexture = texture;
endLV1.material = material;

// Créer panneau Contrôle

var textureControle = new BABYLON.Texture("../assets/background/controlePNG.png", scene);
var materialControle = new BABYLON.StandardMaterial("materialControle", scene);
materialControle.diffuseTexture = textureControle;
var controle = BABYLON.MeshBuilder.CreatePlane("controle", {width: 7, height: 3}, scene);
controle.position.x = -6;
controle.position.y = 3;
controle.position.z = 1;
controle.material = materialControle;


// Création joueur
var player = new Player();
player.createPlayer(scene);

// Créer un rayon sous le joueur 
var ray = new BABYLON.Ray();
var rayHelper = new BABYLON.RayHelper(ray);
rayHelper.attachToMesh(player.mesh, new BABYLON.Vector3(0, -1, 0), new BABYLON.Vector3(0, 0, 0), 2);
//rayHelper.show(scene);

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
    if(player.mesh.position.x >70){
        console.log("endLV1");
        scene.dispose();
        var scriptLV2 = document.createElement('script');
        scriptLV2.type = 'module';
        scriptLV2.src = "../js/script_lvl2.js";
        document.head.appendChild(scriptLV2);
    }
    player.gravity();

    player.RespawnIsDead();

    

    scene.render();
});

// Redimensionnement de la scène si la fenêtre est redimensionnée
window.addEventListener("resize", function() {
    engine.resize();
});