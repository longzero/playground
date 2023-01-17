

var countIngredients = 6;
var pastaIndex = 10;
var pastaRotation = [29,29,17,17,29];
var rotationAngle = [60,60,72,72,60];


function rotatePasta(thisObject, direction) {
  // Detect which pasta it is
  if (thisObject.closest('.pasta-container').hasClass('greek-with-a-twist')) {pastaIndex = 0;}
  else if (thisObject.closest('.pasta-container').hasClass('sweet-and-salty')) {pastaIndex = 1;}
  else if (thisObject.closest('.pasta-container').hasClass('passionately-red')) {pastaIndex = 2;}
  else if (thisObject.closest('.pasta-container').hasClass('fresh-from-the-sea')) {pastaIndex = 3;}
  else if (thisObject.closest('.pasta-container').hasClass('the-primavera')) {pastaIndex = 4;}
  
  // Count number of items/ingredients
  countIngredients = thisObject.closest('.ingredients-container').find('.ingredient-item').length;
  
  // Set the rotation angle
  rotationAngle[pastaIndex] = 360 / countIngredients;
  if (direction == "left") pastaRotation[pastaIndex] = pastaRotation[pastaIndex] - rotationAngle[pastaIndex];
  else pastaRotation[pastaIndex] = pastaRotation[pastaIndex] + rotationAngle[pastaIndex];
  console.log(rotationAngle[pastaIndex]);
  
  // Rotate the big circle that contains all ingredients
  thisObject.closest('.ingredients-container').find('.ingredient-list').css({
    'transform': 'rotate('+ pastaRotation[pastaIndex] +'deg)'
  });
  // Rotate individual ingredients so people don't have to twist their heads to read
  thisObject.closest('.ingredients-container').find('.ingredient-item-content').css({
    'transform': 'rotate('+ -1 * pastaRotation[pastaIndex] +'deg)'
  });
}

$(function(){
  $('.ingredient-left').click(function(){
    rotatePasta($(this), "left");
  });
  
  $('.ingredient-right').click(function(){
    rotatePasta($(this), "right");
  });
});