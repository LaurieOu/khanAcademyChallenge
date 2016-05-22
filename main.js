function textEditor(){
  this.variableDeclaration = false;
  this.forLoop = false;

  this.whileLoop = false;
  this.ifStatement = false;

  this.forLoopWithIfStatment = false;
}

textEditor.prototype.checkForIfStatementInForLoop = function(node){
  nodeBody = node["body"]["body"];

  for(var j = 0; j < nodeBody.length; j++){
    if(nodeBody[j]["type"] === "IfStatement"){
      this.forLoopWithIfStatment = true;
      break;
    }
  }
};

textEditor.prototype.checkForVariableInForLoop = function(node){
  if(node["init"] !== null && node["init"]["type"] === "VariableDeclaration"){
    this.variableDeclaration = true;
  }
};

textEditor.prototype.traverse = function(node) {
  nodeBody = node["body"];
  console.log(nodeBody);

  for(var i = 0; i < nodeBody.length; i++){
    currentNode = nodeBody[i];
    console.log(i);
    console.log(currentNode);

    if (currentNode["type"] === "VariableDeclaration"){
      this.variableDeclaration = true;
    } else if (currentNode["type"] === "ForStatement"){
      this.forLoop = true;
      this.checkForVariableInForLoop(currentNode);
      this.checkForIfStatementInForLoop(currentNode);
    } else if(currentNode["type"] === "WhileStatement"){
          this.whileLoop = true;
    } else if (currentNode["type"] === "IfStatement") {
      this.ifStatement = true;
        // if(currentNode["consequent"]["body"].length !== 0){
          this.traverse(currentNode["consequent"]);
        // }
    }

    // if(currentNode["body"] !== undefined && currentNode["body"]["body"].length !== 0){
    if(currentNode["body"] !== undefined){
      this.traverse(currentNode);
    }
  }
};

function displayResults() {
  var code = editor.getValue();
  var node = esprima.parse(code);

  var newEditor = new textEditor();
  newEditor.traverse(node);
  console.log(newEditor);

    if(newEditor.variableDeclaration === true && newEditor.forLoop === true){
      $(".for-loop-and-variable").css("background-color", "green");
    } else {
      $(".for-loop-and-variable").css("background-color", "red");
    }

    if(newEditor.whileLoop === false && newEditor.ifStatement === false){
      $(".while-and-if").css("background-color", "green");
    }else {
      $(".while-and-if").css("background-color", "red");
    }

    if(newEditor.forLoopWithIfStatment === true){
      $(".if-inside-for").css("background-color", "green");
    }else {
      $(".if-inside-for").css("background-color", "red");
    }
}
