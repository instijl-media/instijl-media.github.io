// Variables


// LiveSearch
function liveSearch(value, searchform){
    searchForm = searchform;
    var query = $('#formSearch input').val();
    query = urlencode(query.replace('/', '-slash-'));
    if(query.length > 2){
      var url = ism.url.searchUrl + query + '/page1.ajax';
      var autocompleteNames = $('.autocomplete').find('.ism-results-list');
      url2 = url.split("/");
      if((url2[0]==="http:")&&(window.location.href.split("/")[0]==="https:")){
        url2[0] = "https:";
        url = url2.join("/");
      }
      $.getJSON(url, function(json){
        if(json.count > 0){
          var productsHtml = [];
          $.each(json.products, function(index, product){
            var productImage = '<div class="image-wrap mr-2"><img src="'+product.image.replace('50x50x2', '40x40x2')+'" width="40" height="40" alt="'+product.fulltitle+'" /></div>';
            var productTitle = '<strong class="item-name">' + product.fulltitle + '</strong>';
            var productPrice = ismProductPrice(product.price.price_old_excl_money_without_currency, product.price.price_excl_money_without_currency, product.price.price_old_incl_money_without_currency, product.price.price_incl_money_without_currency);
            var productHtml = '<div class="product col-12 py-2 px-3"><a href="'+product.url+'" title="'+product.fulltitle+'" class="text-body"><div class="grid d-flex align-items-center">'+productImage+'<div class="info">'+productTitle+productPrice+'</div></div></a></div>';
            productsHtml.push(productHtml);
          });
          productsHtml = productsHtml.join('');
          $('#overlaySearch .autocomplete .products, #formSearch .autocomplete .products').html(productsHtml);
          $('#overlaySearch .autocomplete .more a, #formSearch .autocomplete .more a').attr('href', ism.url.searchUrl + query);
          $("#overlaySearch .autocomplete .search-title-box span i, #formSearch .autocomplete .search-title-box span i").text('(' + json.count + ')');
          $('#overlaySearch .autocomplete, #formSearch .autocomplete').removeClass('noresults');
          $('#overlaySearch .autocomplete, #formSearch .autocomplete').removeClass('hide');
          $('#overlaySearch .autocomplete .notfound, #formSearch .autocomplete .notfound').addClass('hide');
        } else {
          $('#overlaySearch .autocomplete .products, #formSearch .autocomplete .products').html('');
          $('#overlaySearch .autocomplete .more a, #formSearch .autocomplete .more a').attr('href', ism.url.searchUrl);
          $("#overlaySearch .autocomplete .search-title-box span i, #formSearch .autocomplete .title-box span i").text('(0)');
          $('#overlaySearch .autocomplete, #formSearch .autocomplete').addClass('noresults');
          $('#overlaySearch .autocomplete .notfound, #formSearch .autocomplete .notfound').removeClass('hide');
        }
        $('#overlaySearch .autocomplete, #formSearch .autocomplete').addClass('search');
      });
    } else {
      $('#overlaySearch .autocomplete, #formSearch .autocomplete').removeClass('search');
    }
  }

$('#formSearch input').keyup(function(){
    liveSearch($(this),searchForm);
    $(this).closest('form').addClass('active');
}).click(function(){
    if($(this).value != ''){
        liveSearch($(this),searchForm);
        $(this).closest('form').addClass('active');
    }
}).bind('webkitspeechchange', function(){
    liveSearch($(this),searchForm);
    $(this).closest('form').addClass('active');
});