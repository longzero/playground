$(function(){
  if ($(window).width() < 768 + 220) {
    if ($('.wow').length) {
      new WOW().init();
    }
    $('.circle-list').owlCarousel({
      autoHeight: true,
      items: 1,
      loop: true,
      nav: true,
      navText: ['<img src="/coded-infographics/images/arrow-left.svg">','<img src="/coded-infographics/images/arrow-right.svg">']
    });
    $(".healthy-numbers .healthy-number").click(function(){
      var slideNumber = $(this).prop('title');
      $('.circle-list').trigger('to.owl.carousel', [slideNumber,400]);
      // $('.circle-list').addClass('show');
      return false
    });
  }
});
