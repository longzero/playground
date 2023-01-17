$(function(){
  if ($(window).width() < 768 + 220) {
    $('.lobster-number-container').owlCarousel({
      autoHeight: false,
      items: 1,
      loop: true,
      // nav: true,
      // navText: ['<img src="/coded-infographics/images/arrow-right-white.svg">','<img src="/coded-infographics/images/arrow-right-white.svg">']
    });
    $(".lobster-numbers .lobster-number").click(function(){
      var slideNumber = $(this).prop('title');
      $('.lobster-number-container').trigger('to.owl.carousel', [slideNumber,1]);
      $('.lobster-number-container').addClass('show');
      // setTimeout(function(){
      //   $('.lobster-number-container').addClass('show');
      // },400);
      return false
    });
    $(".lobster-close").click(function(){
      $('.lobster-number-container').removeClass('show');
    });
  }
});
