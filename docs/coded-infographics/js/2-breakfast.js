

var countIngredients = 6;
var breakfastIndex = 10;
var breakfastRotation = [29,17,29,29,17,17];
var rotationAngle = [60,72,60,60,72,72];


function rotateBreakfast(thisObject, direction) {
  // Detect which breakfast it is
  if (thisObject.closest('.breakfast-container').hasClass('rainbow-bowl')) {breakfastIndex = 0;}
  else if (thisObject.closest('.breakfast-container').hasClass('mocha-banana')) {breakfastIndex = 1;}
  else if (thisObject.closest('.breakfast-container').hasClass('overnight-oatmeal')) {breakfastIndex = 2;}
  else if (thisObject.closest('.breakfast-container').hasClass('new-classic')) {breakfastIndex = 3;}
  else if (thisObject.closest('.breakfast-container').hasClass('tropical')) {breakfastIndex = 4;}
  else if (thisObject.closest('.breakfast-container').hasClass('choco-coco')) {breakfastIndex = 5;}
  
  // Count number of items/ingredients
  countIngredients = thisObject.closest('.ingredients-container').find('.ingredient-item').length;
  
  // Set the rotation angle
  rotationAngle[breakfastIndex] = 360 / countIngredients;
  if (direction == "left") breakfastRotation[breakfastIndex] = breakfastRotation[breakfastIndex] - rotationAngle[breakfastIndex];
  else breakfastRotation[breakfastIndex] = breakfastRotation[breakfastIndex] + rotationAngle[breakfastIndex];
  console.log(rotationAngle[breakfastIndex]);
  
  // Rotate the big circle that contains all ingredients
  thisObject.closest('.ingredients-container').find('.ingredient-list').css({
    'transform': 'rotate('+ breakfastRotation[breakfastIndex] +'deg)'
  });
  // Rotate individual ingredients so people don't have to twist their heads to read
  thisObject.closest('.ingredients-container').find('.ingredient-item-content').css({
    'transform': 'rotate('+ -1 * breakfastRotation[breakfastIndex] +'deg)'
  });
}

$(function(){
  $('.ingredient-left').click(function(){
    rotateBreakfast($(this), "left");
  });
  
  $('.ingredient-right').click(function(){
    rotateBreakfast($(this), "right");
  });
});