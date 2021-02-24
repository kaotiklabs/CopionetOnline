var DocState = {
    INITIAL: 0,
    UPLOADING: 1,
    EXTRACTED: 2,
    PARSING: 3,
    COLLIDING: 4,
    TEMPLATING: 5,
    NETWORKING: 6,
    DONE:7,
    ERROR:8
};

// Document class
function DocumentClass(file) {

    //console.log("Creating doc object: " + file.name);

    this.file = file;

    this.name = this.file.name;
    this.state = DocState.INITIAL;

    this.rawText ="";
    this.cleanText ="";
    this.ngrams = {};

    this.uniqueDict = {};
    this.collisionDict = {};

    this.templateDict = {};
    this.collRelations = {};

    //   this.update = function() {
    //   };

    //   this.display = function() {
    //   };

}
