//array of docs
var docArray = [];

var uniqueGlobalDict = {}; 
var collisionGlobalDict = {};

var myFont, icon;

function preload() {
  myFont = loadFont('assets/AvenirNextLTPro-Demi.otf');
  icon = loadImage('assets/copionet.png');
}

function windowResized() {
  //resizeCanvas(windowWidth, windowHeight);
  resizeCanvas(windowWidth, windowHeight);
}

function setup() {
  // create canvas
  //var cnv = createCanvas(windowWidth, windowHeight);
  var cnv = createCanvas(windowWidth, windowHeight);
  cnv.parent('sketchholder');
  cnv.style('display', 'block');
  
  //load custom font  
  textFont(myFont);

  // Add an event for when a file is dropped onto the canvas
  cnv.drop(gotFile);
}

function drawResultRow(i, bgX, bgY){
       
  var rowHeight = 80;
  var colChunks = Object.keys(docArray[i].collisionDict).length;
  var uniqueChunks = Object.keys(docArray[i].uniqueDict).length;
  var totalChunks = uniqueChunks + colChunks;

  fill(200);
  var rowY = bgY+rowHeight*i;
  //rect(bgX, rowY, windowWidth-40, rowHeight);

  fill(0);  
  textSize(24);

  var docName = docArray[i].name;
  if(docName.length > 18){
    docName = docArray[i].name.substring(0, 18)+"...";
  }

  textAlign(LEFT, CENTER);
  text(docName, bgX+20, rowY+rowHeight/2);
  
  //! no se si el calcul aporta algo  
  // var colTotalPercent = int(colChunks*100/Object.keys(collisionGlobalDict).length);
  // textAlign(RIGHT, CENTER);  
  // text(colTotalPercent+"%", windowWidth/2.5-50, rowY+rowHeight/2);

  //local percentage
  var colLocalPercent = int(colChunks*100/totalChunks);
  textAlign(RIGHT, CENTER);  
  text(colLocalPercent+"%", windowWidth/2-50, rowY+rowHeight/2);

  drawBar(windowWidth/2, rowY+rowHeight/4, (windowWidth/2)-40, rowHeight/2, totalChunks, colChunks);
  fill(255);
  textAlign(CENTER, CENTER);  
  text(colChunks+"/"+totalChunks, (windowWidth*3/4)-40, rowY+rowHeight/2);
  console.log(docName+" Local ColDict: ");
  console.log(docArray[i].collisionDict);
}


function draw() {
  background(255);

  textSize(36);
  noStroke();  

  fill('#E6001D');
  textAlign(LEFT, TOP);
  text("COPIONET -   Online Document Fraud Detector", 90, 35);  
  image(icon, 20, 20, 60, 60);
  

  if(docArray.length){
    textAlign(LEFT);    
        
    var bgX = 20;
    var bgY = 90;

     fill(230);
     rect(bgX, bgY, windowWidth-40, windowHeight-110);

    for(var i = 0; i < docArray.length; i++){  
      if(docArray[i].state == 2){ // if doc is processed
        drawResultRow(i, bgX, bgY);
      }      
    }

    drawHTML();
    
  //IF EMPTY, DROP SCREEN
  }else{
    strokeWeight(5);
    stroke(200); 
    fill(255);
    rect(windowWidth/4, windowHeight/4, windowWidth/2, windowHeight/2, 30);    
    
    textAlign(CENTER, CENTER);
    strokeWeight(1);
    stroke(50);
    fill(100); 
    text('Drop a File or Folder.', width/2, height/2);    
    noLoop();    
  }
 
}

function drawHTML(){
    
  document.getElementById("myText").innerHTML = docArray[0].name;
  document.getElementById("myText").append = docArray[0].type;
  document.getElementById("myText").append = docArray[0].size;

}

function drawBar(x, y, w, h, numTotal, numCol){

  var wcol = numCol*100/numTotal;

  //fill(0, 200, 0, 100);
  fill('#222F3E');
  rect(x, y, w, h);

  //fill(200, 0, 0, 200);
  //fill('#E43F05');

  if(wcol <= 50){
    fill('#0D69B8');
  }
  if(wcol > 50){
    fill('#FEB700');
  } 
  if(wcol > 75){
    fill('#E63F00');
  }
  rect(x, y, wcol*w/100, h);


}