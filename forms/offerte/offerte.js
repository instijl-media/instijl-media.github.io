$(document).ready(function(){
    $('.product-quantity-click').click(function() {
      var way = $(this).data('way');
      var qty = parseInt($(this).closest('.product-quantity').find('input').val());
      if (way == 'up') {
        qty++;
      } else {
        if (qty > 0) {qty--;}
      }
      $(this).closest('.product-quantity').find('input').val(qty);
    });
    $('.thank-you').hide();
    $('.feedback').hide();
    $('.test').click(function(){
      var products = [];
      $('.product-json').each(function(){
        var title = $(this).find('.product-title span').text();
        var image = $(this).find('img').attr('src');
        var url   = $(this).find('a').attr('href');
        var quantity = $(this).find('.product-quantity input').val();
        products.push({"title":title,"image":image,"url":url,"quantity":quantity});
      });
      var productss = JSON.stringify(products);var voornaam = $('#gui-form-voornaam').val();var achternaam = $('#gui-form-achternaam').val();var bedrijfsnaam = $('#gui-form-bedrijfsnaam').val();var email   = $('#gui-form-email').val();var phone    = $('#gui-form-telefoonnummer').val();var opmerking = $('#gui-form-omschrijving').val(); 
        var postdata = {
          "voornaam":voornaam,
          "achternaam":achternaam,
          "bedrijfsnaam": bedrijfsnaam,
          "email":email,
          "phone":phone,
          "opmerking":opmerking,
          "products":productss
        };
        if(email.length == 0 || voornaam.length == 0 || achternaam.length == 0 || bedrijfsnaam.length == 0 || phone.length == 0){
          $('.feedback').show();
        } else {
          $.post("//api.instijlmedia.nl/forms/stellingstunt/product_offerte.php", postdata, function(data){
              console.log('succes')
          });
          $('#product-form').hide(200);
          $('.thank-you').show(200);
        }
      })
      })