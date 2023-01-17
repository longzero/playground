// DEBUG
if(!window.console) {console={}; console.log = function(){};}


// BREAKPOINTS
var breakpointMobile = 480;
var breakpointTablet = 700 + 220;
var breakpointIpad = 768 + 220;
var breakpointDesktop = 960 + 220;
var breakpointIpadLandscape = 1024;
var breakpointLarge = 1200;
var breakpointAir = 1400;


// WINDOW WIDTH AND HEIGHT
var windowWidth = $(window).width();
var windowHeight = $(window).height();
$(window).resize(function(){
  windowWidth = $(window).width();
  windowHeight = $(window).height();
});


// GENERAL VARIABLES
var marginMobile = 15;
var siteWidth = 1010; // PSD files have 1020 and 1024




function noneSelected() {
  if (!$('.selected').length) {
    $('.main-actions').removeClass('show');
  }
}



// GET READY
$(function(){


  //-----------------------------------------------------------------------------
  // ACTIONS
  //-----------------------------------------------------------------------------
  $('.action-bar .action-more').click(function(){
    $(this).find('.action-more-list').toggle();
  });
  // $('.list-row').hover(function(){
  //   $(this).addClass('show-actions'); //css('transform', 'translateX(0)');
  //   // $(this).find('.cell.name').
  // }, function(){
  //   $(this).removeClass('show-actions');
  // });
  $('.action-inline').click(function(e){
    console.log('clicked');
    e.stopPropagation();
    if ($(this).hasClass('completed')) {$(this).parents('.list-row').slideUp();}
    $(this).toggleClass('active');
  });

  $('.project-action').click(function(){
    $(this).find('.project-actions-list').toggle();
  });
  $('.action-more-item.details').click(function(){
    $('.card').toggleClass('show');
  });





  //-----------------------------------------------------------------------------
  // MODALS
  //-----------------------------------------------------------------------------
  $('.modal-dropdown').click(function(){
    $(this).fadeOut();
  });
  $('.create-button').click(function(){
    $('.create-dropdown').fadeIn();
    e.stopPropagation();
  });
  $('.sidebar-item-more').click(function(){
    $('.project-right-dropdown').fadeIn();
    e.stopPropagation();
  });


  //-----------------------------------------------------------------------------
  // SELECT LIST ITEM
  // SHOW ACTION BAR
  //-----------------------------------------------------------------------------
  $('.list-row').not('.list-headings').click(function(){
    $(this).toggleClass('selected');
    $(this).each(function(){
      if ($(this).hasClass('selected')) {
        $('.main-actions').addClass('show');
        return false;
      }
    });
    noneSelected();
  });

  $('.list-row').not('.list-headings').dblclick(function(){
    $('body').toggleClass('card-opened');
    $('.card-container').toggle();
    $(this).addClass('selected');
    $(this).each(function(){
      if ($(this).hasClass('selected')) {
        $('.main-actions').addClass('show');
        return false;
      }
    });
    noneSelected();
  });

  //-----------------------------------------------------------------------------
  // SHOW/HIDE COMPLETED TASKS
  //-----------------------------------------------------------------------------
  $('.completed-toggle').click(function(e){
    e.preventDefault();
    $('.list-grid.completed').slideToggle('300');
  });


  //-----------------------------------------------------------------------------
  // MOVE
  //-----------------------------------------------------------------------------
  $('.move-thing').click(function(){
    alert('This would open a modal with a list of navigable folders to move');
  });

});






//-----------------------------------------------------------------------------
// KEYBOARD SHORTCUTS
//-----------------------------------------------------------------------------
$(document).keyup(function(e) {
  // Escape key
  if (e.keyCode == 27) {
    console.log("Escape");
    $('.selected').removeClass('selected');
    $('.action-more-list').hide();
    noneSelected();
    $('body').removeClass('card-opened');
    $('.card-container').hide();
  }
});

var start = 0;
$(document).keyup(function(e) {
  // Double press letter C
  if (e.keyCode == 67) {
    elapsed = new Date().getTime();
    if (elapsed-start <= 500){
      $('body').toggleClass('collapsed');
    }
    start = elapsed;
  }
});
