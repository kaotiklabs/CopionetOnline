
function gotFile(file) {
  console.log("Drop File");
  console.log("Filename: " + file.name);
  console.log("Type: " + file.type);
  console.log("Size: " + file.size + " bytes");

  addFile(file);


  // // If it's an image file
  // if (file.type === 'text') {
  //   addFile(file);
  // } else {
  //   console.log('Not a text file!');
  // }
}


function addFile(file){
  
  console.log("Add Input File to Docs");

  bufDoc = new DocumentClass(file);
  docArray.push(bufDoc);

  console.log("Extract Raw Text");
  extractRawText(bufDoc);


  //console.log("Array Length: "+fileArray.length);
  //processFile(fileArray[fileArray.length-1]);
}

function extractRawText(doc){

  //var url = 'http://givemetext.okfnlabs.org/tika/tika/form';
  //var url = 'http://54.37.66.60:9998/tika/form';
  var url = 'http://localhost:9998/tika/form';

  var formData = new FormData();
  formData.append(doc.name, doc.file.file);
  console.log("Uploading "+doc.name+" to parser");
  doc.state = DocState.UPLOADING;
  redraw();

    $.ajax({
      url: url,
      type: 'POST',
      data: formData,
      //dataType: "json",
      crossDomain: true,
      processData: false,
      contentType: false,
      success: function(data, textStatus, jqXHR) {
        console.log("rawText: "+data); 
        doc.rawText = data;    
        analyzeText(doc); 
      }
    });


  // $.ajax({
  //   url: url,
  //   type: 'PUT',
  //   data: formData,
  //   processData: false,
  //   contentType: false,
  //   //contentType: "multipart/form-data",    
  //   success: function(resp) {
  //     console.log("success: "+resp);
  //     //alert(JSON.stringify(resp));
  //   }
  // });


}

function analyzeText(doc){
 
  doc.state = DocState.PARSING;
  redraw();

  //remove accentuation and diacritics
  var noAccentText = doc.rawText.normalize('NFD').replace(/[\u0300-\u036f]/g, "")
  console.log("noAccentText: "+noAccentText);

  //remove special characters (whitespaces are left)
  var noSpecialText = noAccentText.replace(/[^A-Z0-9 ]/ig, " ");
  console.log("noSpecialText: "+noSpecialText);

  //remove extra white spaces, tabs, carriage returns, etc
  var noExtraSpaceText = noSpecialText.replace(/\s\s+/g, ' ');
  console.log("noExtraSpaceText: "+noExtraSpaceText);

  //store clean text to document
  doc.cleanText = noExtraSpaceText;

  //split string into words array
  var wordsArray = split(noExtraSpaceText, " ");
  console.log("wordsArray: "+wordsArray);

  //generate ngrams of 5 words
  var arrayNgrams = nGrams(wordsArray, 5);
  console.log("arrayNgrams: "+arrayNgrams);

  

  // Create buffer Document Object for storing only the collision data
  //var bufDoc = new DocumentClass(name);

  doc.state = DocState.PROCESSING;
  redraw();

  //generate MD5 Checksums of ngrams
  for(var i = 0; i < arrayNgrams.length; i++){
    
    var hash = MD5(arrayNgrams[i]);
    var ngram = arrayNgrams[i];

    //console.log(hash+" --> "+ngram); 
    
    //add hash to the dictionary if unique (if not to collision)
    //if exists as a collision, dont update globals, only local coll
    if(collisionGlobalDict[hash] != undefined){
      //if already exists, dont update local
      if(doc.collisionDict[hash] === undefined){
        doc.collisionDict[hash] = ngram;
      }
    }else{

      if(uniqueGlobalDict[hash] === undefined){
        uniqueGlobalDict[hash] = ngram;
        doc.uniqueDict[hash] = ngram;
      }else{
        //console.log("Collision! "+ngram);    
        //delete unique global as is not unique anymore
        delete uniqueGlobalDict[hash];
        
        //add new collision to global and local
        collisionGlobalDict[hash] = ngram;
        doc.collisionDict[hash] = ngram;
                
        //recalculate the rest of Locals
        recalculateDocCollisions(hash, ngram);
      }      

    }
  }
  var colChunks = Object.keys(doc.collisionDict).length;
  var uniqueChunks = Object.keys(doc.uniqueDict).length;
  var totalChunks = uniqueChunks + colChunks;

  console.log("Doc Unique: "+uniqueChunks);
  console.log("Doc Collision: "+colChunks);
  console.log("Doc Total: "+totalChunks);
  console.log("Dict Unique: "+Object.keys(uniqueGlobalDict).length);
  console.log("Dict Collision: "+Object.keys(collisionGlobalDict).length);

  //store buffer object into Document Array
  //docArray.push(bufDoc);
  console.log("File processed "+doc.name);
  doc.state = DocState.PROCESSED; //processed
  redraw();
}


//recalculate values for processed docs if new collision found
function recalculateDocCollisions(hash, ngram){

  for(var i = 0; i < docArray.length; i++){  
    //if a local unique exists...
    if(docArray[i].uniqueDict[hash] != undefined){
      //delete it and...
      delete docArray[i].uniqueDict[hash];
      //inf not exists, add it to local collisions
      if(docArray[i].collisionDict[hash] === undefined){
        docArray[i].collisionDict[hash] = ngram;
      }    
    }
  }

}