export default class MovingPlat{

    constructor(x,y){
        this.x = x;
        this.y = y;
        this.z = 0;
        this.size = 1;
        this.mesh = null;
        this.upY = y + 10;
        this.downY = y;
        this.moveUp = true;
        this.moveDown = false;
    }

    createMovingPlat(scene){
        this.mesh = BABYLON.MeshBuilder.CreateBox("movingPlat", {width: 4, height: 1, depth: 2}, scene);
        this.mesh.position = new BABYLON.Vector3(this.x, this.y, this.z);
        this.mesh.checkCollisions = true;
        this.mesh.size = this.size;
        this.mesh.material = new BABYLON.StandardMaterial("movingPlatMat", scene);
    }

    move(){
        
       if(this.moveUp){
              this.mesh.position.y += 0.03;
              if(this.mesh.position.y >= this.upY){
                this.moveUp = false;
                this.moveDown = true;
              }
       }
         if(this.moveDown){
                this.mesh.position.y -= 0.03;
                if(this.mesh.position.y <= this.downY){
                    this.moveUp = true;
                    this.moveDown = false;
                }
    }
}

}