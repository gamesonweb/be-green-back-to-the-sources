export default class movingPlatHori{

    constructor(x,y){
        this.x = x;
        this.y = y;
        this.z = 0;
        this.size = 1;
        this.mesh = null;
        this.rightX= x + 10;
        this.leftX = x;
        this.moveRight = true;
        this.moveLeft = false;
    }

    createMovingPlat(scene){
        this.mesh = BABYLON.MeshBuilder.CreateBox("movingPlatHori", {width: 4, height: 1, depth: 2}, scene);
        this.mesh.position = new BABYLON.Vector3(this.x, this.y, this.z);
        this.mesh.checkCollisions = true;
        this.mesh.size = this.size;
        this.mesh.material = new BABYLON.StandardMaterial("movingPlatHoriMat", scene);
    }

    move(){
        
       if(this.moveRight){
              this.mesh.position.x += 0.03;
              if(this.mesh.position.x >= this.rightX){
                this.moveRight = false;
                this.moveLeft = true;
              }
       }
         if(this.moveLeft){
                this.mesh.position.x -= 0.03;
                if(this.mesh.position.x <= this.leftX){
                    this.moveRight = true;
                    this.moveLeft = false;
                }
    }
}

}