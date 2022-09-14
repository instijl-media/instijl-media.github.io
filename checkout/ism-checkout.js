$('document').ready(function(){
  
    if ($('.pay-only-products').length) {
        $('.pay-only-products').each(function() {
        var cur = $(this);
          var url = cur.data('href');
        url = url.substring(0, url.length - 1);
        $.get(url + '.ajax', function(product) {
            var image = (product.image).replace('50x50x2', '100x100x2');
          cur.find('.image-td').append('<img src="'+ image +'">');
        });
      });
    }
    
    if ($('input[name="newsletter-fake"]').length) {
        if (Cookies.get('newsletter-check') != undefined) {
        if (Cookies.get('newsletter-check') == 'false') {
            $('input[name="newsletter-fake"]').prop('checked', false);
        } else {
            $('input[name="newsletter-fake"]').prop('checked', true);
        }
      } else {
          $('input[name="newsletter-fake"]').prop('checked', true);
        Cookies.set('newsletter-check', true);
      }
      
      $('input[name="newsletter-fake"]').on('change', function() {
          var status = $('input[name="newsletter-fake"]').prop('checked');
        Cookies.set('newsletter-check', status);
      });
    }
    
    if ($('.smc-inputs input[name="newsletter"]').length) {
        if (Cookies.get('newsletter-check') == 'false') {
        $('.smc-inputs input[name="newsletter"]').prop('checked', false);
      } else {
        $('.smc-inputs input[name="newsletter"]').prop('checked', true);
      }
    }
    
    $('input[name="customer[createaccount]"]').on('change', function(){
        var register = $(this).is(':checked');
      var url = smCreateUrl('checkout/default/method/');
      $.ajax({
        url: url,
        type: 'post',
        data: {
          mode: register ? 'register' : 'guest',
        }
      });
    });
    
    $('a[data-popup]').on('click', function() {
        var target = $(this).data('popup');
      var pos = $(this).position().left - 10;
      
      $('.' + target).toggleClass('active');
      
      if (!$('.' + target).hasClass('loaded')) {
          $('.' + target).css('left', pos).addClass('loaded');
      }
    });
    
    $('.smc-info-popup .close-btn').on('click', function() {
        $(this).closest('.smc-info-popup').removeClass('active');
    });
    
      smCheckoutConditions();
    $('.sm-checkout input, .sm-checkout select').on('change', function(){
        smCheckoutConditions();
    });
    
    $('.smc-input input[type="text"], .smc-input input[type="tel"], .smc-input input[type="email"], .smc-input input[type="number"]').each(function() {
        smValidateField($(this), true);
    });
    
    $('.smc-input input[type="text"], .smc-input input[type="tel"], .smc-input input[type="email"], .smc-input input[type="number"]').on('blur', function(){
      smValidateField($(this));
    });
    
    countrySelect($('.smc-country-select select'));
    $('.smc-country-select select').on('change', function(){
        countrySelect($(this));
    });
    
    $('[data-smc-address-search]').keyup(function(){
      smcAddressSearch($(this));
    });
    $('[data-smc-address-search]').bind('webkitspeechchange', function(){
      smcAddressSearch($(this));
    });
    
    $('.sm-checkout [name*=zipcode]').keyup(function(){
      smcLsAddressSearch($(this));
    });
    
    $('.sm-checkout [name*=zipcode]').bind('webkitspeechchange', function(){
      smcLsAddressSearch($(this));
    });
    
    $('.sm-checkout [name*=country]').on('change', function(){
        smcLsAddressSearch($(this));
    });
    
    $('[data-smc-address-search]').on('blur', function(){
      var cur = $(this);
      setTimeout(function(){
            cur.next('[data-smc-address-result]').find('div:first-child a').trigger('click');
      }, 100);
    });
    
    $('[data-smc-place-id]').live('click', function(){
        var place_id = $(this).attr('data-smc-place-id');
      var type = $(this).closest('[data-smc-address-result]').attr('data-smc-address-result');
      smcFillAddress(place_id, type);
      $('[data-smc-address-result]').empty();
    });
    
    if ($('select[name="billing_address[country]"]').length) {
      if ($('input[name="customer[sameaddress]"]:checked').length) {
        var cur = $('select[name="billing_address[country]"]');
      } else {
        var cur = $('select[name="shipping_address[country]"]');
      }
      var value = $('select[name="billing_address[country]"]').val();
      var country = $('select[name="billing_address[country]"]').find('option:checked').attr('data-id');
      var postUrl = 'https://www.soclever.nl/cart/setShipmentLocation/';
      var dataString = 'country=' + country;
  
      $.ajax({
        type: 'POST',
        url: postUrl,
        data: dataString
      }).done(function(data) {
        var cartUrl = basicUrl+'cart?format=json';
        $.get(cartUrl, function(data){
          var cart = data.cart;
          if (cart.shipping.methods) {
            var firstShip = false;
            $.each(cart.shipping.methods, function(index, method){
              if (!firstShip) {
                firstShip = true;
                $('[data-live-shipping-costs]').html(smMoney(method.price_incl));
                if (method.price_incl > 0) {
                  $('[data-live-shipping-costs]').removeClass('free');
                } else {
                  $('[data-live-shipping-costs]').addClass('free');
                }
              }
            });
          }
        });
      });
    }
  
    $('select[name="billing_address[country]"], select[name="shipping_address[country]"], input[name="customer[sameaddress]"]:checked').on('change', function() {
      if ($('input[name="customer[sameaddress]"]:checked').length) {
        var cur = $('select[name="billing_address[country]"]');
      } else {
        var cur = $('select[name="shipping_address[country]"]');
      }
  
      var value = cur.val();
      var country = cur.find('option:checked').attr('data-id');
      var postUrl = 'https://www.soclever.nl/cart/setShipmentLocation/';
      var dataString = 'country=' + country;
  
      $.ajax({
        type: 'POST',
        url: postUrl,
        data: dataString
      }).done(function(data) {
        var cartUrl = basicUrl+'cart?format=json';
        $.get(cartUrl, function(data){
          var cart = data.cart;
          if (cart.shipping.methods) {
            var firstShip = false;
            $.each(cart.shipping.methods, function(index, method){
              if (!firstShip) {
                firstShip = true;
                $('[data-live-shipping-costs]').html(smMoney(method.price_incl));
                if (method.price_incl > 0) {
                  $('[data-live-shipping-costs]').removeClass('free');
                } else {
                  $('[data-live-shipping-costs]').addClass('free');
                }
              }
            });
          }
        });
      });
  
  
    });
    
    $('.sm-checkout input[name="shipment_method"]').on('change', function(){
        var price = parseFloat($(this).attr('data-price'));
      $('.temp-delivery').addClass('hidden');
      $('[data-live-shipping-costs]').html(smMoney(price));
      if (price > 0) {
          $('[data-live-shipping-costs]').removeClass('free');
      } else {
          $('[data-live-shipping-costs]').addClass('free');
      }
    });
    
    var selShipment = $('.sm-checkout input[name="shipment_method"]:checked');
    if (selShipment.length > 0) {
      var shPrice = parseFloat(selShipment.attr('data-price'));
      $('[data-live-shipping-costs]').closest('tr').removeClass('hidden');
      $('.temp-delivery').addClass('hidden');
      $('[data-live-shipping-costs]').html(smMoney(shPrice));
      if (shPrice > 0) {
        $('[data-live-shipping-costs]').removeClass('free');
      } else {
        $('[data-live-shipping-costs]').addClass('free');
      }
    }
    
    $('[data-smc-show-login]').on('click', function(){
        $('[data-smc-login-wrap]').toggleClass('smc-hidden');
    });
    
    $('[data-smc-show-products]').on('click', function(){
        $('[data-smc-products-wrap]').toggleClass('smc-hidden');
    });
    
    $('[data-smc-show-productsslide]').on('click', function(){
        $('[data-header-products]').toggleClass('smc-active');
      $('[data-smc-show-productsslide]').toggleClass('smc-active');
    });
    
    $('[data-close-review-slide]').on('click', function(){
        $('[data-header-products]').removeClass('smc-active');
      $('[data-smc-show-productsslide]').removeClass('smc-active');
    });
    
    $('[data-smc-show-discount]').on('click', function(){
        $('[data-smc-discount-wrap]').toggleClass('smc-hidden');
    });
    
    $('[data-smc-submit-discount]').on('click', function() {
      var form = $(this).closest('.smc-form-div');
      var url = form.attr('data-action');
      $.ajax({
        type: 'post',
        url: url,
        data: form.find(':input').serialize()
      }).done(function(data) {
          var messages = $(data).find('div[class="gui-messages"] ul');
        var message = messages.first('li').text();
        
        console.log(messages.first('li'));
        
        if (messages.first('li').hasClass('gui-error')) {
          $('.smc-main-error').remove();
            var html = '<div class="smc-main-error"><div>'+ message +'</div></div>';
          $(html).insertBefore('.sm-checkout .smc-page-title');
          $(html).insertBefore('.header-review-slide-inner .smc-title-wrap');
          form.find('input').val('').trigger('keyup');
        } else {
            location.reload();
        }
      });
    });
    
    $('.sm-checkout form').on('submit', function(e){
      var form = $(this);
      if (form.attr('data-next')) {
          e.preventDefault();
      }
    
      $('.smc-btn').addClass('smc-loading');
      $('.smc-btn i').remove();
      $('.smc-btn').prepend('<i class="bx bx-loader-alt"></i>');
      
      if (form.attr('data-next')) {
        $.ajax({
          type: 'post',
          url: form.attr('action'),
          data: form.serialize()
        }).done(function(data){
          if (data.errors) {
            var i = 0;
            $.each(data.errors, function(index, error){
              i++;
              var names = index.split('.');
              //names[1] = (names[1] == 'address1' || names[1] == 'number') ? 'address' : names[1];
              var name = names[0] + '['+names[1]+']';
              var input_wrap = $('[name="'+name+'"]').closest('.smc-input-wrap');
              
              // show error
              $('[name="'+name+'"]').closest('.smc-input').addClass('smc-error');
              if ($('[name="'+name+'"]').closest('.smc-input').find('.smc-error-message').length < 1) {
                $('<div class="smc-error-message">'+ error +'</div>').insertAfter(input_wrap);
              }
              // scroll to first error
              if (i == 1) {
                  smScrollTo('[name="'+name+'"]');
              }
              
            });
            $('.smc-btn').removeClass('smc-loading');
            $('.smc-btn').find('.bx-loader-alt').remove();
          } else {
            window.location = form.attr('data-next');
          }
        });
      }
      
    });
    
  });
  
  function smcLsAddressSearch(cur) {
    
    var type = cur.attr('name').split('[')[0];
    var zipcode = $('[name="'+type+'[zipcode]"]').val();
    var country = $('[name="'+type+'[country]"]').val();
    
    var url = smCreateUrl('services/addresslookup/?country='+country+'&zipcode='+zipcode);
    
    $.get(url, function(data){
        if (data.found) {
            $('[name="'+type+'[city]"]').val(data.city).blur();
            $('[name="'+type+'[address1]"]').val(data.streetname).blur();
        
        smValidateField($('[name="'+type+'[city]"]'), true);
        smValidateField($('[name="'+type+'[address1]"]'), true);
        
        } else {
          $('[name="'+type+'[city]"]').val('').blur();
            $('[name="'+type+'[address1]"]').val('').blur();
        
        smValidateField($('[name="'+type+'[city]"]'), true);
        smValidateField($('[name="'+type+'[address1]"]'), true);
      }
    });
    
  }
  
  function smcAddressSearch(input) {
  // 	var query = input.val();
  //   var type = input.attr('data-smc-address-search');
  
  //   if (query.length > 4) {
      
  //   	$.ajax({
  //       url: 'https://apps.shopmonkey.nl/checkout/address.php',
  //       type: 'post',
  //       data: {
  //         type: 'search',
  //         query: query
  //       }
  //     }).done(function(data){
  //       $('[data-smc-address-result='+type+']').empty();
  //       $.each(data.predictions, function(index, prediction){
  //       	$('[data-smc-address-result='+type+']').append('<div><a href="javascript:;" class="smc-text-link" data-smc-place-id="'+ prediction.place_id +'">'+ prediction.description +'</a></div>');
  //       });
  //     });
      
  //   }
  }
  
  function smcFillAddress(place_id, type) {
      
    $.ajax({
        url: 'https://apps.shopmonkey.nl/checkout/address.php',
        type: 'post',
        data: {
          type: 'find',
            id: place_id
        }
      }).done(function(data){
          console.log(data);
          var address = {};
          $.each(data.result.address_components, function(index, item){
          if (item.types.includes('route')) {
            address['address1'] = item.long_name;
          }
          if (item.types.includes('street_number')) {
            address['number'] = item.long_name;
          }
          if (item.types.includes('locality')) {
            address['city'] = item.long_name;
          }
          if (item.types.includes('country')) {
            address['country'] = item.short_name.toLowerCase();
          }
          if (item.types.includes('postal_code')) {
            address['zipcode'] = item.long_name;
          }
          });
          
          if (!address['number']) {
          address['number'] = ''; //
        }
      
          $.each(address, function(index, item){
            $('input[name="'+type+'['+ index +']"]').val(item).trigger('blur');
          $('select[name="'+type+'['+ index +']"] option[value="'+ item +'"]').prop('selected', true);
        });
      console.log('input[name="'+type+'=[address]"]');
          $('input[name="'+type+'[address]"]').val(address['address1'] +' '+ address['number']);
      
      });
    
  }
  
  function countrySelect(cur){
      var countryCode = cur.find('option:selected').attr('data-country-code');
    var country = cur.find('option:selected').attr('data-country');
    cur.closest('.smc-country-select').find('.smc-cur-country').html('<img src="https://flagcdn.com/w20/'+ country +'.png"><span>'+countryCode+'</span>');
  }
  
  function smCheckoutConditions() {
      var customerType = $('.sm-checkout [name="customer[type]"]:checked').val();
    if (customerType == 'company') {
        $('[data-smc-company-wrap]').removeClass('smc-hidden');
    } else {
        $('[data-smc-company-wrap]').addClass('smc-hidden');
    }
    var sameAddress = $('.sm-checkout [name="customer[sameaddress]"]').is(':checked');
    if (!sameAddress) {
        $('[data-smc-shipping-wrap]').removeClass('smc-hidden');
    } else {
        $('[data-smc-shipping-wrap]').addClass('smc-hidden');
    }
    var register = $('.sm-checkout [name="customer[createaccount]"]').is(':checked');
    if (register) {
        $('[data-smc-createaccount-wrap]').removeClass('smc-hidden');
    } else {
        $('[data-smc-createaccount-wrap]').addClass('smc-hidden');
    }
  }
  
  function smValidateField(cur, onload=false) {
      var value_begin = cur.attr('value');
        var value = cur.val();
      var value_changed = value_begin == value ? false : true;
      var error = true;
      var type = cur.attr('type');
        var message = false;
    
        cur.closest('.smc-input').removeClass('success');
      if (value.length > 0) {
        error = false;
        if (type == 'email' && !smValidateEmail(value)) {
            error = true;
          message = smcTranslations['Invalid customer email'];
        }
        if (type == 'tel' && !smValidatePhone(value)) {
            error = true;
        }
      } else {
        error = true
      }
      if (error) {
        cur.closest('.smc-input-wrap').find('i').remove();
        
        if (value.length > 0) {
          cur.closest('.smc-input').addClass('smc-error');
          if (message) {
              cur.closest('.smc-input').find('.smc-error-message').remove();
            cur.closest('.smc-input').append('<div class="smc-error-message">'+message+'</div>');
          }
        }
      } else {
        if (value_changed || onload) {
            cur.closest('.smc-input-wrap').find('i').remove();
          cur.closest('.smc-input-wrap').append('<i class="bx bxs-check-circle"></i>');
          cur.closest('.smc-input').addClass('success');
        }
        cur.closest('.smc-input').removeClass('smc-error').find('.smc-error-message').remove();
      } 
  }
  
  function smValidateEmail(email) {
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(email).toLowerCase());
  }
  
  function smValidatePhone(phone) {
      const re = /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g;
      return re.test(String(phone).toLowerCase());
  }
  
  function smScrollTo(element){
      var headerHeight = $('#header .main-header').outerHeight();
      $('html, body').animate({
          scrollTop: $(element).offset().top - headerHeight - 50
      }, 'fast');
  }
  
  function smCreateUrl(url) {
      url = smBasicUrl+url;
    return url;
  }
  
  function smMoney (price) {
    if (price) {
      price = parseFloat(price).toFixed(2);
      price += '';
      // var shopCurrency = '';
      var x = price.split('.');
      var x1 = x[0];
      var x2 = x.length > 1 ? '.' + x[1] : '';
      var rgx = /(\d+)(\d{3})/;
      while (rgx.test(x1)) {
          x1 = x1.replace(rgx, '$1' + ',' + '$2');
      }
      var x3 =  (x1 + x2).split('.');
      var x4 = x3[0].replace(',', '.') + ',' + x3[1]; 
      // var priceMoney = smShopCurrency+''+ x4;
      var priceMoney = x4;
    } else {
        var priceMoney = smcTranslations['Free'];
    }
    return priceMoney;
  }