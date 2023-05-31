let inputState = {};

function definirEcouteur(){
    ecouteurClavier();
    //ecouteurSouris();
} 

function ecouteurClavier(){
    window.onkeydown = (event) => {
        switch(event.key){
            case "ArrowUp" || "z" || "Z":
                inputState.up = true;
                break;
            case "ArrowLeft"|| "q" || "Q":
                inputState.left = true;
                break;
            case "ArrowRight"|| "d" || "D":
                inputState.right = true;
                break;
        }
    }
    window.onkeyup = (event) => {
        switch(event.key){
            case "ArrowUp" || "z" || "Z":
                inputState.up = false;
                break;
            case "ArrowLeft"|| "q" || "Q":
                inputState.left = false;
                break;
            case "ArrowRight"|| "d" || "D":
                inputState.right = false;
                break;
        }
    }

}


export { definirEcouteur, inputState }