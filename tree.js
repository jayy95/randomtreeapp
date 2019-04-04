$(document).ready(function(){
  var loaded = false;

  //populate table upon initial loading of the page or refresh
  function drawTable(response){
    for(var i=0; i<response.length; i++){
      //if factory has already been created, add child under it
      if(document.getElementById(response[i].name)){
        var fact = document.getElementById(response[i].name + "Children");
        var child = document.createElement("li");
        child.innerHTML = response[i].child;
        fact.appendChild(child);
      }
      //create factory and add child
      else {
        var li = document.createElement("li");
        var span = document.createElement("span");
        span.className = "factory";
        span.id = response[i].name;
        span.innerHTML = response[i].name;
        li.appendChild(span);
        var div = document.createElement("div");
        div.innerHTML = response[i].numRange;
        div.className = "range";
        span.appendChild(div);
        var table = document.getElementById("factories");
        table.appendChild(li);
        var ul = document.createElement("ul");
        ul.className = "active";
        ul.id = response[i].name + "Children";
        span.appendChild(ul);
        var child = document.createElement("li");
        child.innerHTML = response[i].child;
        ul.appendChild(child);
        ul.style.width = "150px";
        ul.contentEditable = "false";
        div.contentEditable = "false";
        ul.blur();
        div.blur();
      }
    }
  }

  function initialLoad(){
    if(loaded) return;

    $.ajax({
      type : "GET",
      url : "load.php",
      dataType : "json",
      success : function(response){
        drawTable(response);
      },
      error : function(){
        alert("Failed to load page.");
      }
    });

    loaded = true;
  }

  function getUpdates(){
    $.ajax({
      type : "GET",
      url : "update.php",
      dataType : "json",
      success : function(response){
        //alert("Called update.php");
        setTimeout(getUpdates, 1000);
        var table = document.getElementById("factories");
        while(table.firstChild){
          table.removeChild(table.firstChild);
        }
        drawTable(response);
      },
      error : function(){
        //alert("Something went wrong with update.php");
        setTimeout(getUpdates, 1000);
      }
    });
  }

  initialLoad();

  //Open or Close branches
  var rootToggle = document.getElementById("root").addEventListener("click", function(){
    document.querySelector(".nested").classList.toggle("active");
    this.classList.toggle("caret-down");
  });

  //submit new Factory
  $("#newFactory").on("submit", function(e){
    e.stopPropagation();
    e.preventDefault();

    var fac = document.getElementById("factoryName").value;
    var numC = document.getElementById("numOfChildren").value;
    var numLR = document.getElementById("lNumRange").value;
    var numUR = document.getElementById("uNumRange").value;

    if(fac == ""){
      alert("Fill out factory name.");
    }
    else if(isNaN(numC) || numC == "" || numC > 15) {
      alert("Fill out number of children. Make sure it's a number < 15.");
    }
    else if(isNaN(numLR) || numLR == ""){
      alert("Fill out number lower range. Make sure it's a number.");
    }
    else if(isNaN(numUR) || numUR == ""){
      alert("Fill out number upper range. Make sure it's a number.");
    }
    else {
        $.ajax("submit.php",
          {type : "POST",
           data : $("#newFactory").serialize(),
           cache : false,
           success : function(response){
             //alert(response);
           },
           error : function(){
             alert("Failed to connect to server.");
           }
         });
    }
  });

  $("#rename").on("submit", function(e){
    e.stopPropagation();
    e.preventDefault();

    var currentName = document.getElementById("currentName").value;
    var newName = document.getElementById("newName").value;

    if(currentName == "" || newName == ""){
      alert("Fill out both fields");
    }
    else if(!document.getElementById(currentName)){
      alert("There is no Factory with the name '" + currentName + "'");
    }
    else if(document.getElementById(newName)){
      alert("There is already a Factory with the name '" + newName + "'");
    }
    else {
      $.ajax({
        type : "POST",
        url : "rename.php",
        data : {'currentName' : currentName, 'newName' : newName},
        success : function(response){
          alert(response);
        },
        error : function(){
          alert("Failed to replace name");
        }
      });
    }
  });

  //add listener to dynamically created factories
  var clickedObj = undefined;
  $(document).on("contextmenu", ".factory", function(e){
    if($(e.target).hasClass("factory")){
      clickedObj = this.id;
      e.preventDefault();
      $(".custom-menu").finish().toggle(100).css({top: e.pageY + "px", left: e.pageX + "px"});
    }
  });


  //close menu if clicked outside of menu
  $(document).bind("mousedown", function (e) {

    // If the clicked element is not the menu
    if (!$(e.target).parents(".custom-menu").length > 0) {

        // Hide it
        $(".custom-menu").hide(100);
    }
  });

  //define actions for menu options
  $(".custom-menu li").click(function(){

    switch($(this).attr("id")) {
        case "delete":
        $.ajax({
          type : "POST",
          url : "delete.php",
          data : {'name' : clickedObj},
          success : function(response){
            //alert(response);
          },
          error : function(){
            alert("Failed to delete.");
          }
        });

        break;
    }

    // Hide it AFTER the action was triggered
    $(".custom-menu").hide(100);
  });


  //Listen for updates
  getUpdates();

});
