(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = evalSolution;

function evalSolution(viewModel) {
  $("#tests-div").find("tbody").html("");
  var solutionStr = $("#textarea-solution").val();
  if (viewModel.hasOwnProperty("testCases")) {
    viewModel.testCases.forEach(function (elem, i) {
      try {
        var result = eval( elem + solutionStr);
      } catch (e) {
        result = e;
      }
      $("#tests-div").find("tbody")
        .append("<tr><td>" + elem + "</td><td>" + result + "</td>" +
          "<td>" + viewModel.testResults[i] + "</td><tr>");
    });
  } else {
    //evaluate code without test cases
    console.log("answer: " + viewModel.testResults[0]);
    var studentRes = evalConsole(solutionStr, viewModel.executionContext);
    console.log(studentRes);
    for (var i in viewModel.testResults){
      var good = studentRes == evalConsole(viewModel.testResults[i], viewModel.executionContext);
      good = good ? "correct" : "Your output:<br>"+studentRes;
      $("#tests-div").find("tbody")
        .append("<tr><td>run</td><td>" + good + "</td>" +
          "<td>" + good + "</td><tr>");

    }
      
  }

  function evalConsole(str, ctx) {
    if (ctx){
      for (var i in ctx)
        eval(""+i+"="+ctx[i]);
    }
    var stdout = "";
    var console = {
      log: function (str) {
        stdout += str + "\n";
      }
    };
    try {
      var result = eval(str);
    } catch (e) {
      return e;
    }
    return stdout.length>0? stdout : result;
  }

}
},{}],2:[function(require,module,exports){
var wedgeAtCursor = require("./wedgeAtCursor.js");
module.exports = handleKeys;

//functions to handle tabs, enters, etc
function handleKeys(evt){
    if (evt.keyCode === 13){
        handleEnters(evt);
    }
    else if (evt.keyCode === 125){ //tab
        handleCloseBraces();
    }
    function handleCloseBraces(){
      var txtArea = $("textarea")[0];
      var cursorPos = txtArea.selectionStart;
      var line = "";
      for (var i = cursorPos-1; i > 0; i--){
        if ( txtArea.value[i] === "\n") break;
        else line = txtArea.value[i]+line;
      }

      if (line.match(new RegExp(/^     *$/gi)) ){
        console.log("matched");
        //take off 4 leading spaces
        var head = txtArea.value.substring(0,cursorPos-line.length);
        var tail = line.substr(4)+txtArea.value.substr(cursorPos);
        txtArea.value = head+tail;
        txtArea.selectionStart = cursorPos - 4;
        txtArea.selectionEnd = cursorPos - 4;
      }
    }
    function handleEnters(evt){
      evt.preventDefault();
      var txt = $("textarea");
      var cursorPos = txt[0].selectionStart;
      var linesStr = txt.val().substr(0, cursorPos);
      var lines = linesStr.split("\n");
      var lastLine = lines[lines.length-1];
      var spcCount = 0;
      for (var i =0; i < lastLine.length; i++){
                if (lastLine[i] != " " ) break;
                else spcCount++;

                }
                //console.log("Spaces in '"+lastLine+"': "+spcCount);
                if (lastLine.charAt(lastLine.length-1) === "{"){
                //console.log("line ended in {");
                spcCount += 4;
                }
                var spaces = "";
                for(var i = 0; i < spcCount; i++){ 
                spaces += " ";                             
                }

                if (spaces.length >= 0){
                  wedgeAtCursor("\n"+spaces, txt[0]);
                }

    }
}




},{"./wedgeAtCursor.js":6}],3:[function(require,module,exports){
var wedgeAtCursor = require("./wedgeAtCursor.js");
module.exports = handleTabs;

function handleTabs(e){
  if (e.keyCode === 9){
    e.preventDefault();
    wedgeAtCursor("    ", $("textarea")[0]);
  }
}
},{"./wedgeAtCursor.js":6}],4:[function(require,module,exports){
module.exports = f1;
function f1(urlRoot, populateMenu){
  $.ajax({
    url: urlRoot + "/exercises/all",
    error: function(){
      alert("Error connecting to the server. Try reload");
    },
    success: function(resp){
      populateMenu(resp);
      //I get an array of objects with shortName and url
    }
  });
  //param is an array of objects with shortName and url
  //used to populate the navbar
  function populateMenu(obj){
    console.log("populateMenu - param is type "+ typeof obj)
  obj.forEach(function(elem){
    $("#nav-mobile").append(
        "<li class='bold' data-url='"+elem.url+"'>"+
        "<a href='#'>"+elem.shortName+"</a>"+
        "</li>"
        );    
  });
}
}
},{}],5:[function(require,module,exports){
module.exports = function (event, dis, urlRoot) {
    event.preventDefault();
    var self = dis;
    $.ajax({
      url: urlRoot + "/exercise/" + self.data("url"),
      error: function () {
        alert("Failed to load exercise, click again");
      },
      success: function (resp) {
        buildLayout(resp);
      }
    });
  
    //function which builds the problem layout
    function buildLayout(obj) {
      window.viewModel = obj;
      var vm = window.viewModel;
      if (vm.hasOwnProperty("executionContext")) {
        for (var k in vm.executionContext) {
          var v = eval(vm.executionContext[k]);
          vm.executionContext[k] = v;
          vm.text = vm.text.replace("{{" + k + "}}", v);
          for (var i = 0; i < testResults.length; i++){
            vm.testResults[i] =
              vm.testResults[i].replace("{{" + k + "}}", v);
            if (vm.hasOwnProperty("testCases")){
              vm.testCases[i] =
                vm.testCases[i].replace("{{" + k + "}}", v);
            }
          }
        }
      }
      $("#problem-title").html(obj.shortName);
      $("#problem-div p").html(obj.text);
      $("#textarea-solution").val(obj.functionHeader);
    }
  };
},{}],6:[function(require,module,exports){
module.exports = wedgeAtCursor;

function wedgeAtCursor(str, txt){
  var cursorPos = txt.selectionStart;
  var tail = txt.value.substr(cursorPos, txt.value.length);
  var finalVal = txt.value.substr(0,cursorPos)+str+ tail;
  txt.value = finalVal;
  txt.selectionStart =cursorPos+str.length;
  txt.selectionEnd =cursorPos+str.length;
}

},{}],7:[function(require,module,exports){
//var viewModel;
var urlRoot = "http://104.131.17.187:4004";

var retrieveMenuItems = require('./includes/menu-loader.js');
var handleKeys = require("./includes/handleKeys.js");
var handleTabs = require("./includes/handleTabs.js");
var evalSolution = require("./includes/evalSolution.js");
var problemLoader = require("./includes/problemLoader.js");

//just attaching event listeners and so on
$(document).ready(function () {
  //$("textarea").unbind();
  retrieveMenuItems(urlRoot);
  $("#nav-mobile").on("click", "li", function(event){
      console.log("hi, $(this) is ")
      console.log($(this));
    if (!$(this).hasClass(".logo")){
      problemLoader(event, $(this), urlRoot);
    }
  });
  $("#evalSolution").on("click", function(){
    evalSolution(window.viewModel);
  });
  $("textarea").keypress(handleKeys);
  $("textarea").keydown(handleTabs);
});





},{"./includes/evalSolution.js":1,"./includes/handleKeys.js":2,"./includes/handleTabs.js":3,"./includes/menu-loader.js":4,"./includes/problemLoader.js":5}]},{},[7]);
