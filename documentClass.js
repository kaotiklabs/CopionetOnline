// Document class
function DocumentClass(file) {

  console.log("Creating doc object: "+file.name);
  
  this.file=file;
  
  this.name=this.file.name;
  this.state = 0; // 0:initial, 1:uploaded, 2:procesed

  this.rawText;
  this.cleanText;
  
  this.uniqueDict = {}; 
  this.collisionDict = {};

//   this.update = function() {    
//   };

//   this.display = function() {    
//   };

}
