var scrollInStijl = {
    data : null,
  productsContainer : "#products > .products",
  productsSelector : "#products .productborder",
  
  // Init:
  init : function(productsContainer, productsSelector){
    
    this.productsContainer = productsContainer;
    this.productsSelector = productsSelector;

    // Set jQuery isInViewport function
    $.fn.isInViewport = function() {
      var elementTop = $(this).offset().top;
      var elementBottom = elementTop + $(this).outerHeight();
      var viewportTop = $(window).scrollTop();
      var viewportBottom = viewportTop + $(window).height();
      return elementBottom > viewportTop && elementTop < viewportBottom;
    };
    
    // Scroll back to last visited product:
    if(window.location.hash){
      var productId = window.location.hash.substring(1);
      if($(".productborder .product[data-id='"+productId+"']").length > 0){
        setTimeout(function () {
          $('html, body').animate({
            scrollTop: $(".productborder .product[data-id='"+productId+"']").offset().top - 300,
          }, 0);
        }, 150);
      }
    }
    
    // Set data and set listeners
    scrollInStijl.setData();
    scrollInStijl.scrollListener();
    scrollInStijl.activePageListener();
    scrollInStijl.previousButtonListener();
    scrollInStijl.productClickListener();
  },
  
  // (Re)Set data
  setData : function(){
    this.data = $(this.productsContainer).data('scrollInStijl');
    console.log("Scroll instijl is loaded with data: ", this.data); 
  },
    
  // Go to Next Page.
  next : function(){
    // Do nothing if already loading and set the loading flag:
    if(this.data.isLoading){
      return false;
    }

    // Check if next page is valid:
    if(this.data.page + 1 > this.data.pages){
      return false;
    }

    // Everything is validated, let's load the next page:
    this.data.isLoading = true;
    var url = this.data.baseUrl + "page" + (this.data.page + 1) + ".html" + this.data.extendUrl;
    var thisIsm = this;
    $.ajax({
      url:url,
      type:'GET',
      success: function(data){
        $(thisIsm.productsContainer).append($(data).find(thisIsm.productsContainer).html()); // Append products
        $(thisIsm.productsContainer).data("scrollInStijl", $(data).find(thisIsm.productsContainer).data("scrollInStijl")); // Set the new page data
        startPageBefore = thisIsm.data.startPage;
        thisIsm.setData();
        thisIsm.data.startPage = startPageBefore;
      }
    });
  },
    
  // Go to Previous Page:
  previous : function(){
      // Do nothing if already loading and set the loading flag:
    if(this.data.isLoading){
      return false;
    }

    // Check if previous page is valid:
    if(this.data.startPage - 1 < 1){
      return false;
    }

    // Everything is validated, let's load the previous page:
    $(".scroll-instijl-previous-page").addClass('disabled');
    this.data.isLoading = true;
    var url = this.data.baseUrl + "page" + (this.data.startPage - 1) + ".html" + this.data.extendUrl;
    var thisIsm = this;
    $.ajax({
      url:url,
      type:'GET',
      success: function(data){
        var firstProductBeforePrepend = $(thisIsm.productsSelector).first();
        var topValueBeforePrepend = firstProductBeforePrepend.offset().top - $(window).scrollTop();
        $(thisIsm.productsContainer).prepend($(data).find(thisIsm.productsContainer).html()); // Prepend products
        thisIsm.data.isLoading = false;
        thisIsm.data.startPage = thisIsm.data.startPage - 1;
        if(thisIsm.data.startPage == 1){
          // Hide previous button:
          $(".scroll-instijl-previous-page").hide();
        }
        setTimeout(function () {
          $("html, body").animate({
              scrollTop:  firstProductBeforePrepend.offset().top - topValueBeforePrepend
          }, 0);
        }, 150);
        $(".scroll-instijl-previous-page").removeClass('disabled');
        
      }
    });
  },
  
  // Listen for scroll down:
  scrollListener : function(){
      $(window).scroll(function(){
      if ($(window).scrollTop() + $(window).height() + 200 >= $(scrollInStijl.productsContainer).offset().top + $(scrollInStijl.productsContainer).height()){
        scrollInStijl.next();
      }
    });
  },

    // Listen for active page:
    activePageListener : function(){
    $(window).on('resize scroll', function() {
      var currentPage = scrollInStijl.data.page;
      $('[data-scroll-in-stijl-page]').each(function() {
        if ($(this).isInViewport()) {
          currentPage = $(this).data('scrollInStijlPage');
        }
      });
      if(currentPage != window.location.href){
        history.pushState(null, $(document).attr('title'), currentPage); // Set the current url
      }
      lazyLoadInstance.update();
      feather.replace();
    });
  },
  
  // Listen to the click on the previousButton:
    previousButtonListener : function(){
    $(document).on("click", ".scroll-instijl-previous-page", function(e){
      e.preventDefault();
      scrollInStijl.previous();
    });
  },
  
  // Listen to the click on a product, and store the scroll position:
    productClickListener : function(){
    $(document).on("click", this.productsSelector, function(e){
      var productId = $(this).find('[data-id]').first().data('id');
      window.location = '#' + productId;
    });
  },
};
$(document).ready(function(){
  // Start scrollInStijl:
  scrollInStijl.init(
      "#products > .products", // Product-container selector.
    "#products .productborder", // Product selector.
    "auto" // Type infinity. "auto" = click en scroll , "click" = alleen on click, "scroll" = alleen on scroll
  ); 
});