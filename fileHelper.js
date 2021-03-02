function extractRawText(doc) {
  //var url = 'http://givemetext.okfnlabs.org/tika/tika/form';
  //var url = 'http://54.37.66.60:9998/tika/form';
  //var url = 'http://localhost:9998/tika/form';
  var url = "http://192.168.1.4:9998/tika/form";

  var formData = new FormData();
  formData.append(doc.name, doc.file);
  doc.state = DocState.UPLOADING;
  console.log("Step 1 UPLOADING: " + doc.name);

  $.ajax({
    url: url,
    type: "POST",
    data: formData,
    //dataType: "json",
    crossDomain: true,
    processData: false,
    contentType: false,
    success: function (data, textStatus, jqXHR) {
      doc.rawText = data;
      doc.state = DocState.EXTRACTED;
      console.log("Step 2 EXTRACTED: " + doc.name);

      processingQueue(doc);
    },
    error: function () {
      console.log("ERROR UPLOADING " + doc.name);
      doc.state = DocState.ERROR;
    },
  });
}

//funció principal per intentar controlar el proces en paralel
function processingQueue(doc) {
  parseText(doc);
  checkCollisions(doc);

  //QUAN TOTS ACABEN; CALCULAR COSES GLOBALS
  $(document).ajaxStop(function () {
    // 0 === $.active
    //console.log("AJAX NUMBER: "+$.active);

    if (doc.name == docArray[docArray.length - 1].name) {
      calculateTemplate();
      console.log("Step 6 NETWORKING DOCUMENTS");

      for (var i = 0; i < docArray.length; i++) {
        calculateRelations(docArray[i]);
      }
    }
  });
}

function parseText(doc) {
  doc.state = DocState.PARSING;
  console.log("Step 3 PARSING: " + doc.name);

  //remove accentuation and diacritics
  var noAccentText = doc.rawText
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  //console.log("noAccentText: "+noAccentText);

  //remove special characters (whitespaces are left)
  var noSpecialText = noAccentText.replace(/[^A-Z0-9 ]/gi, " ");
  //console.log("noSpecialText: "+noSpecialText);

  //remove extra white spaces, tabs, carriage returns, etc
  var noExtraSpaceText = noSpecialText.replace(/\s\s+/g, " ");
  //console.log("noExtraSpaceText: "+noExtraSpaceText);

  //store clean text to document
  doc.cleanText = noExtraSpaceText;

  //split string into words array
  var wordsArray = noExtraSpaceText.split(" ");
  //console.log("wordsArray: "+wordsArray);

  //generate ngrams of 5 words
  doc.ngrams = nGrams(wordsArray, 5);
  //console.log("arrayNgrams: "+arrayNgrams);
}

function checkCollisions(doc) {
  doc.state = DocState.COLLIDING;
  console.log("Step 4 COLLIDING: " + doc.name);

  // CHECK EACH CHUCK FOR  COLLISIONS
  for (var i = 0; i < doc.ngrams.length; i++) {
    //generate MD5 Checksums of ngrams
    var hash = MD5(doc.ngrams[i]);
    var ngram = doc.ngrams[i];

    // IF HASH IS ALREADY A COLLISION
    if (collisionGlobalDict[hash] != undefined) {
      // ADD DOCNAME TO EXISTING GLOBAL COLLISION IF NOT EXIST
      if (!collisionGlobalDict[hash].includes(doc.name)) {
        var bufCollData = [];
        bufCollData = collisionGlobalDict[hash];
        bufCollData.push(doc.name);
        collisionGlobalDict[hash] = bufCollData;
      }

      //UPDATE LOCAL COLLISION TABLE
      doc.collisionDict[hash] = ngram;

      //IF HASH DONT EXIST
    } else {
      //IF UNIQUE, ADD IT TO GLOBAL UNIQUE
      if (uniqueGlobalDict[hash] === undefined) {
        uniqueGlobalDict[hash] = ngram;
        doc.uniqueDict[hash] = ngram;
      }
      //IF PREVIOUS UNIQUE EXIST, UPDATE IT TO NEW COLLISION
      else {
        //console.log("Collision! "+ngram);
        //delete unique global as is not unique anymore
        delete uniqueGlobalDict[hash];

        //add new collision with relationship to global and local
        var bufCollData = [];
        bufCollData.push(ngram);
        bufCollData.push(doc.name);
        collisionGlobalDict[hash] = bufCollData;

        doc.collisionDict[hash] = ngram;

        //UPDATE PREVIOUS UNIQUE HASH DOC TO BE CONSISTENT
        recalculateDocCollisions(hash, ngram);
      }
    }
  }

  //console.log("Global Uniq/Coll: " + Object.keys(uniqueGlobalDict).length+"/"+ Object.keys(collisionGlobalDict).length);
  //console.log("Doc Uniq/Coll: " + Object.keys(doc.uniqueDict).length+"/"+ Object.keys(doc.collisionDict).length);
}

//recalculate values for already processed docs if new collision found
function recalculateDocCollisions(hash, ngram) {
  //console.log("Recalculating ngram "+ngram);

  for (var i = 0; i < docArray.length; i++) {
    //when a new collision is found if a local unique exists...
    if (docArray[i].uniqueDict[hash] != undefined) {
      //delete it
      delete docArray[i].uniqueDict[hash];
      //if not exists, add it to local collisions
      if (docArray[i].collisionDict[hash] === undefined) {
        docArray[i].collisionDict[hash] = ngram;
        //console.log("Partner collision "+docArray[i].name+": -> "+ngram);
      }
      // ADD DOCNAME TO EXISTING GLOBAL COLLISION IF NOT EXIST
      if (!collisionGlobalDict[hash].includes(docArray[i].name)) {
        var bufCollData = [];
        bufCollData = collisionGlobalDict[hash];
        bufCollData.push(docArray[i].name);
        collisionGlobalDict[hash] = bufCollData;
      }
    }
  }
}

function calculateTemplate() {
  // doc.state = DocState.TEMPLATING; //templating
  console.log("Step 5 TEMPLATING DOCUMENTS");

  var templatePercentCut = 75; //75% template cut
  var totalDocs = docArray.length;

  for (hash in collisionGlobalDict) {
    var partners = collisionGlobalDict[hash].slice(1);

    var hashPartnership = (partners.length * 100) / totalDocs;

    //if cut remove hash and add it to template dict
    if (hashPartnership > templatePercentCut) {
      //console.log("Template hash: "+hash+" Partnership: "+hashPartnership+" %");
      templateGlobalDict[hash] = collisionGlobalDict[hash][0];
      delete collisionGlobalDict[hash];
    }
  }

  //console.log("Template chunks: "+Object.keys(templateGlobalDict).length);
}

function calculateRelations(doc) {
  doc.state = DocState.NETWORKING; //networking
  //console.log("Step 5 NETWORKING " + doc.name);

  //console.log("getDocRelations: "+doc.name);

  // // loop through local collisions hashes
  for (hash in doc.collisionDict) {
    //if the hash still exists (not removed by templating)
    if (collisionGlobalDict[hash] != undefined) {
      //get partners using hash in global collision, remove chunk text
      var partners = collisionGlobalDict[hash].slice(1);

      for (var i = 0; i < partners.length; i++) {
        //console.log(partners[i]);

        if (partners[i] != doc.name) {
          if (doc.collRelations[partners[i]] === undefined) {
            doc.collRelations[partners[i]] = 1;
          } else {
            doc.collRelations[partners[i]]++;
          }
        }
      }
    } else {
      //delete local coll if has been templated
      doc.templateDict[hash] = doc.collisionDict[hash];
      delete doc.collisionDict[hash];
    }
  }

  //console.log(doc.collRelations);
  doc.state = DocState.DONE; //done
  //console.log("Step 6 DONE " + doc.name);
}
