$(window).load(function(){
  setTimeout(function(){
    $('.tacos-header').each(function(){
      console.log("123131");
      var titleWidth = $(this).find('h2').outerWidth();
      var lineWidth = ($('.tacos-header').width() - titleWidth)/2;
      $(this).find('.title-line').width(lineWidth + 'px');
    });
  },1000);
});
