//
//  MANAGE DRAG AND DROP
//

// call initialization file
if (window.File && window.FileReader && window.FileList && window.Blob) {
    InitDragDrop();
} else {
    alert('The File APIs are not fully supported in this browser.');
}

// initialize
function InitDragDrop() {

    var filedrag = $id("filedrag");

    //if drag element exists
    if (filedrag != null) {
        // file drop
        filedrag.addEventListener("dragover", FileDragHover, false);
        filedrag.addEventListener("dragleave", FileDragHover, false);
        filedrag.addEventListener("drop", FileSelectHandler, false);
    }

}

// file drag hover
function FileDragHover(e) {
    e.stopPropagation();
    e.preventDefault();
    e.target.className = e.type == "dragover" ? "hover" : "";
}

// file selection
function FileSelectHandler(e) {
    // cancel event and hover styling
    FileDragHover(e);

    // fetch FileList object
    var files = e.target.files || e.dataTransfer.files;

    // process all File objects
    for (var i = 0, f;
        (f = files[i]); i++) {

        console.log("Step 0 INITIAL: "+ f.name);
        //console.log("Type: " + f.type);
        //console.log("Size: " + f.size + " bytes");

        ParseFile(f);
    }

    console.log("FINISH PROCESING DROP QUEUE");
}


//
//HELPER FUNCTIONS
//

// getElementById
function $id(id) {
    return document.getElementById(id);
}

//
// output information
function Output(msg) {
    var m = $id("messages");
    m.innerHTML = msg + m.innerHTML;
}
