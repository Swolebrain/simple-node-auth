$("#registration-form").find("form").submit(function(e){
  if ($("#username").val() === "" 
     || $("#password").val() === "" 
     || $("#email").val() === ""
     || $("#password").val() != $("#password-conf").val() ){
    e.preventDefault();
    $("#error-message").show("fade");
    $("#error-message").html("Please fill the whole thing out");
    setTimeout( () => $("#error-message").hide("slow"), 2000 );
  }
});

$("#login-form").find("form").submit(function(e){
  if ($("#username").val() === "" 
     || $("#password").val() === ""){
    e.preventDefault();
    $("#error-message").show("fade");
    $("#error-message").html("Please fill the whole thing out");
    setTimeout( () => $("#error-message").hide("slow"), 2000 );
  }
});