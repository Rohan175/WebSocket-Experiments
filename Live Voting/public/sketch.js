var rows ;
var visited = [];
var currentPlayerId ;
var cols ;  
var scale ;
var grid ;
var colors ;   

function setup() {
    createCanvas(800, 800, WEBGL);
    colors = [color(204, 102, 0),color(0, 102, 0),color(204, 0, 0),color(204, 102, 200)];
    grid = [];
    rows = cols = 5;
    currentPlayerId = 0;
    scale = width/(rows+1) ;

    for(let r = 0; r< rows;r++){        
        grid[r] =[];
        for(let c = 0; c< cols;c++){
            grid[r][c] = {count:0,player_id:0};
        }
    }
}

function draw() {
    background(50);



    noFill();
    stroke(colors[currentPlayerId]);
    


    //fill(colors[currentPlayerId]);
        for(let r = 0; r< rows;r++){        
            for(let c = 0; c< cols;c++){

                push();            
                    ortho(-width/2, width/2, -height/2, height/2);
                    translate(-width/2 + scale  + r*scale ,-height/2 + scale + c*scale);
                    //rotateX(-1.3);
                    //rotateY(PI/3);
                    box(scale);
                pop();
            }
        }
    
    //  grid[0][0].count  = 3;
    //  grid[0][1].count  = 2;
    //  grid[0][2].count  = 1;
    //  grid[0][4].count  = 1;

    //  grid[0][0].player_id  = 3;
    //  grid[0][1].player_id  = 2;
    //  grid[0][2].player_id  = 1;
    //  grid[0][4].player_id  = 0;

    let count =0;
    for(let r = 0; r< rows;r++){
        for(let c = 0; c< cols;c++){
            
            count = grid[r][c].count;

            noFill();
            stroke(colors[ grid[r][c].player_id ]);
            //console.log(grid[r][c].player_id);
            if(count == 0){}
            else if(count == 1){
                push();
                    ortho(-width/2, width/2, -height/2, height/2);
                    translate(-width/2 + scale  + r*scale ,-height/2 + scale + c*scale);
                    sphere(scale/5);
                pop();
            }else if (count == 2){

                let distance = scale/12;

                push();
                    ortho(-width/2, width/2, -height/2, height/2);
                    translate(-width/2 + scale - distance + r*scale ,-height/2 -distance + scale + c*scale);
                    sphere(scale/6);
                pop();

                push();
                    ortho(-width/2, width/2, -height/2, height/2);
                    translate(-width/2 + scale + distance + r*scale ,-height/2 + distance +scale + c*scale);
                    sphere(scale/6);
                pop();

            }else if(count == 3){

                let distance = scale/8;

                push();
                    ortho(-width/2, width/2, -height/2, height/2)
                    translate(-width/2 + scale - distance/10 + r*scale ,-height/2 - distance + scale + c*scale);
                    sphere(scale/7);
                pop();

                push();
                    ortho(-width/2, width/2, -height/2, height/2)
                    translate(-width/2 + scale +distance + r*scale ,-height/2 + distance +scale + c*scale);
                    sphere(scale/7);
                pop();
                push();
                    ortho(-width/2, width/2, -height/2, height/2)
                    translate(-width/2 + scale -distance + r*scale ,-height/2 + distance +scale + c*scale);
                    sphere(scale/7);
                pop();
            }else{console.log(count+ "Greatere than 3");}

            }
        }
        
}

function mousePressed(){
    
    
    let egX = mouseX - (scale/2);
    let egY = mouseY - (scale/2);
    let gridX = Math.floor(egX/(scale));
    let gridY = Math.floor(egY/(scale));

    

    //if(currentPlayerId == document.cookie){
        grid[gridX][gridY].count++;
        visited = [];
        bfs(gridX,gridY);

        currentPlayerId = (currentPlayerId+1)%4;

    //}else{console.log("not ur turn");}
}
function bfs(x,y){
    console.log(grid[x][y].count);
    let check = visited.filter(i => i.x == x && i.y == y)
    console.log(check);
    if(check.length > 1) {
        console.log("returning bsf");
        return;
    }

    visited.push({"x":x, "y":y});


    if(grid[x][y].count > 3){
        
        console.log("done");
        grid[x][y].count = 0;

        try{
            grid[x+1][y].count++;
            bfs(x+1,y);
            grid[x-1][y].count++;
            bfs(x-1,y);
            grid[x][y+1].count++;
            bfs(x,y+1);
            grid[x][y-1].count++;
            bfs(x,y-1);

        }catch(err){console.log(err + "During neightbour check");}
    }
}


