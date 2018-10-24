
var DocState = {
  INITIAL: 0,
  UPLOADING: 1,
  PARSING: 2,
  PROCESSING: 3,
  PROCESSED: 4,
};

// Document class
function DocumentClass(file) {

  console.log("Creating doc object: "+file.name);
  
  this.file=file;
  
  this.name=this.file.name;
  this.state = DocState.INITIAL;

  this.rawText;
  this.cleanText;
  
  this.uniqueDict = {}; 
  this.collisionDict = {};

//   this.update = function() {    
//   };

//   this.display = function() {    
//   };

}
