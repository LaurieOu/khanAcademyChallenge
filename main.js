function textEditor(){
  this.variableDeclaration = false;
  this.forLoop = false;

  this.whileLoop = false;
  this.ifStatement = false;

  this.forLoopWithIfStatment = false;
}

textEditor.prototype.checkForIfStatementInForLoop = function(node){
  var nodeBody = node["body"]["body"];

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
  if(node === undefined){
    $(".display-errors-box").text("Unexpected Token: set conditions for your statement");
  }

  var nodeBody = node["body"];

  for(var i = 0; i < nodeBody.length; i++){
    var currentNode = nodeBody[i];
    var type = currentNode["type"];

    if (type === "VariableDeclaration"){
      this.variableDeclaration = true;
    } else if (type === "ForStatement"){
      this.forLoop = true;
      this.checkForVariableInForLoop(currentNode);
      this.checkForIfStatementInForLoop(currentNode);
    } else if(type === "WhileStatement"){
          this.whileLoop = true;
    } else if (type === "IfStatement") {
      this.ifStatement = true;
      this.traverse(currentNode["consequent"]);
    }

    if(currentNode["body"] !== undefined){
      this.traverse(currentNode);
    }
  }
};

function displayResults() {
  var code = editor.getValue();
  var newEditor = new textEditor();
  $(".display-errors-box").text("");

  try {
    var node = esprima.parse(code);
  }
  catch(err){
    $(".display-errors-box").text(err.description);
  }
  finally {
    newEditor.traverse(node);
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

}
