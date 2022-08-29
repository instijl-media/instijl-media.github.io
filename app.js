// Copy this script into the shop
$(document).ready(function() {
  // Variables
  var shopId = getUrlParam('id');
  var secret = getUrlParam('secret');
  var dataJsonUrl = 'https://instijl-media.github.io/data.json';
  var ismAccess = false;

  // Functions
  function getUrlParam(value){
    var url_string = document.getElementById('ism_app').src; 
    var url = new URL(url_string);
    var c = url.searchParams.get(value);
    return c
  }
  function include(filePath) {
    const scriptTag = document.createElement("script");
    scriptTag.src = filePath;
    scriptTag.setAttribute('type', 'text/javascript');
    scriptTag.setAttribute('defer', true);
    document.body.appendChild(scriptTag);
  }
  
  // Validation data.json
  $.getJSON(dataJsonUrl, function(data) {
    console.log(shopId+'=='+data['id']);
    if(shopId == data['shopid']){
    	console.log('ID confirmed');
      if(secret == data['key']){
      	var ismAccess = true;
	// Load plugins
        $.each(data['plugins'], function(key, plugin) {
          include(plugin['src']);
        });
      } else {
        console.log('Your secret doesnt match with the key in our system. Please contact support@instijlmedia.nl');
      }
    } else {
      console.log('Your ID doesnt match with the ID in our systeem. Please contact support@instijlmedia.nl');
    }
  });
});
