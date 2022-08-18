/* ============================================================
ISM Products Connector v1
License: InStijl Media
License URI: http://www.instijlmedia.nl
Platform: Lightspeed
=============================================================== */
var ism_products_connector = {
    dataTarget: '[data-ism-connector-target]',  // HTML Location
    sizeThumbs: '85x85x2',
    sizeImages: '233x233x2',
    // Init:
      init : function(dataTarget, sizeThumbs, sizeImages){
      var connectorIsUpdating = false;
      this.dataTarget = dataTarget;
      if(!connectorIsUpdating){
        connectorIsUpdating = true;
        $(dataTarget).each(function(index,element){
          var $this = $(this);
          var dataUrl = $this.data('connector')+'?format=json';  // JSON Connection URL
          $.get(dataUrl, function(json) {
            var count = 0;
            var targetSelector = $this;
            var activeVid = targetSelector.data('vid');  // HTML Location
            var limit = targetSelector.data('limit'); // Number of items visible
            var dataCarousel = targetSelector.data('carousel'); // Carousel: true / false
            $.each(json.collection.products, function(key, product) {count++;});
            // Settings
            var ism_connector = {};
            ism_connector.settings = {
              domain: json.shop.domain,
              static: json.shop.domains.static,
              b2b: json.shop.b2b,
              curSymbol: json.shop.currency2.symbol,
              curCode: json.shop.currency2.code
            };
            /* ISM Output Template
            =============================================================== */
            if(count > 1){
              var resultsHTML = [];
              $.each(json.collection.products, function(key, product) {
                var resultTitle = product.fulltitle;
                var resultThumbSrc = ismProductImage(product.image, sizeThumbs);
                var resultImgSrc = ismProductImage(product.image, sizeImages);
                var resultImage = '<div class="image-wrap"><img src="'+ resultThumbSrc +'" alt="'+product.fulltitle+'" data-productimg="'+resultImgSrc+'" class="img-fluid" /></div>';
                var resultTitle = '<strong class="item-name">' + product.fulltitle + '</strong>';
                var symbol = ism_connector.settings.curSymbol;
                //var resultPrice = ismProductPrice(product.price.price_old, product.price.price, product.price.price_old, product.price.price);
                if(dataCarousel == true){if(count >= limit){var extClass = '';} else {var extClass = 'col-lg-2 col-md-4 col-6';}} else {var extClass = '';}
                if(activeVid == product.vid){var activeClass = 'active';} else {var activeClass = '';};
                var resultHTML = '<div class="item item-'+count+' mb-2 '+extClass+' '+ activeClass+'"><a href="'+ism_connector.settings.domain+product.url+'" title="'+product.fulltitle+'" class="text-body" data-price="'+symbol+parseFloat(product.price.price).toFixed(2)+'" data-price_old="'+symbol+parseFloat(product.price.price_old).toFixed(2)+'">'+resultImage+'</a></div>';
                resultsHTML.push(resultHTML);
              });
              resultsHTML = resultsHTML.join('');
              if(dataCarousel == true){
                if(count >= limit){
                  dataTarget.html('<div id="ism_connector_carousel"><div class="owl-ism_products_connector owl-carousel owl-theme">'+resultsHTML+'</div></div>');
                  $('#ism_connector_carousel .owl-ism_products_connector').owlCarousel({
                    smartSpeed:500,margin:15,lazyLoad: true,dots:false,loop:false,rewind:false,items:limit,
                    responsive:{0:{items:1 },341:{items:2},768:{items:3},993:{items:limit}} 
                  });
                  $("#ism_connector_carousel").find(".prev").click(function () {$('.owl-ism_products_connector').trigger('prev.owl.carousel');});
                  $("#ism_connector_carousel").find(".next").click(function () {$('.owl-ism_products_connector').trigger('next.owl.carousel');});
                } else {
                  targetSelector.html('<div class="row align-items-center">'+resultsHTML+'</div>');
                }
              } else {
                targetSelector.html(resultsHTML);
              }
              ism_products_connector.setProductData();
            }
            /* ===============================================================
            END Output Template */
            function ismProductImage(id, size){
              size = size || '150x150x2';
              return ism_connector.settings.static + 'files/'+pad(id,9)+'/'+size+'/image.jpg'
            }
            connectorIsUpdating = false;
          });
        });
      }
    },
    setProductData : function(){
      $(document).on("mouseenter", this.dataTarget+' .item', function(e){
            var $this = $(this);
        var product = $(this).closest('.productborder');
        var jsonTitle = $this.find('a').attr('title');
        var price  = $this.find('a').data('price');
              var price_old  = $this.find('a').data('price_old');
              if (price_old) {
          var priceBox  = '<div class="price price-offer"><span class="price-new">'+price.replace('.',',')+'</span><span class="price-old pl-md-2"><del>'+price_old.replace('.',',')+'</del></span></div>';
        } else {
            var priceBox = '<div class="price price-offer"><span class="price-new">'+price.replace('.',',')+'</span></div>';
        }
        var jsonImg = $this.find('img').data('productimg');
        product.find('.product-image img').attr('src', jsonImg)
        product.find('.product-top .product-title a strong').text(jsonTitle);
        product.find('.product-bottom .product-price').html(priceBox);
        });
    },
  }
  
  /* ISM JS Toolset
  =============================================================== */
  function pad(number, length){
    var str = '' + number;
    while (str.length < length) {str = '0' + str;}
      return str;
  }
  
  /* ISM Activate Function
  =============================================================== */
  $(document).ready(function() {
      ism_products_connector.init('[data-ism-connector-target]','85x85x2','233x233x2');
  });
