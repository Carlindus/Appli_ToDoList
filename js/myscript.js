'use strict';

////////// PROBLEMS //////////////


// SETUP
var $list,
  $newItemButton,
  $newItemForm,
  $thisLiContainer;

function init() { // functions launched on load
  returnData();
  hideForm();
  updateCountTask();
}

function hideForm() {
  $newItemForm.hide();
  $newItemButton.show();
}

function displayForm() {
  $newItemButton.hide();
  $newItemForm.show();
}


// ---------------------------------
// SERVER REQUESTS
// ---------------------------------

// Save list items on server
function saveData() {
  var $items = $('#listItems li'),
    listItems = [];

  for (var i = 0; i < $items.length; i++) {
    listItems[i] = {
      name: $($items[i]).text(),
      status: $($items[i]).attr("class")
    }
  };

  $.post(
    'https://carlindusdesign.fr/data/saveTodo.php', {
      listItems
    }
  );
}

// Return list Items saved on server
function returnData() {
  $.get(
    'https://carlindusdesign.fr/data/getTodo.php',
    function(data) {
      showData(data)
    },
    'json'
  );
}

// Load tasks in memory
function showData(data) {
  var newContent = '';

  for (var i = 0; i < data.listItems.length; i++) {
    newContent = '<div class="list-container"><li class="';
    newContent += data.listItems[i].status;
    newContent += '">';
    newContent += data.listItems[i].name;
    newContent += '</li></div>';
    // Update each item in memory to the list
    $list.append(newContent);
  };
  updateCountTask()
}

function addLineItem(textItem) {
  checkStatus();
  $list.prepend('<div class="list-container"><li class="' + checkStatus() + '">' + textItem + '</li></div>');
  updateCountTask();
}

function checkStatus() {
  var $important = $('#newItemForm input[name="important"]');
  var statusItem = '';

  if ($important.is(':checked')) {
    statusItem = 'important';
  } else {
    statusItem = 'todo';
  };
  return statusItem;
}

function updateCountTask() {
  var tasksNumber = $('li').not('.complete').length;
  $('#tasksNumber').text(tasksNumber);
}

// ---------------------------------
// ACTION of BUTTONS
// --------------------------------

function getCompleteItem($button) {
  var $newLi,
    $thisLiContainer = $button.parent(),
    $li = $button.siblings('li');

  $li.addClass('complete').removeClass('selected');
  $newLi = $thisLiContainer.clone();
  $list.append($newLi);
  $thisLiContainer.remove();

  updateCountTask()

}

function cancelAction($button) {
  var thisAttribute = $button.next('li').text();

  var $newContainer = [],
    $li = $button.next('li'),
    textItem = $li.text(),
    prevClass;

  $li.removeClass('complete selected');
  prevClass = $li.attr('class');

  $newContainer = $list.prepend('<div class="list-container"><li class="' + prevClass + '">' + textItem + '</li><div>');
  $button.parent().remove();

  updateCountTask()
}

function deleteItem($button) {
  var $lineRemove = $button.parent(".list-container");

  $lineRemove.animate({
    opacity: 0,
    paddingLeft: '+=180'
  }, 500, 'swing', function() {
    $lineRemove.remove();
  });

  updateCountTask()

}

// ---------------------------------
// CHECK ACTIONS
// --------------------------------

function checkSelected($li) {

  if ($li.hasClass('selected')) {
    $li.toggleClass("selected");
  } else {
    $('#listItems li').removeClass('selected');
    $li.toggleClass("selected");
  }
}


// ---------------------------------
// CREATE BUTTONS
// --------------------------------

function addToDoButtons(icon, action) {
  var $checkButton = document.createElement("button"),
    $checkButtonIcon = document.createElement("i");

  $checkButton.classList.add("fas", icon, action);
  $checkButton.appendChild($checkButtonIcon);
  return $checkButton
}

function addDeleteButton($thisLiContainer) {
  var $deleteButton = addToDoButtons("fa-trash-alt", "delete");

  $thisLiContainer.prepend($deleteButton);

  $deleteButton.addEventListener('click', function(e) {
    e.preventDefault();
    deleteItem($(this));
  });
}

function addDoneButton($thisLiContainer) {
  var $doneButton = addToDoButtons("fa-check", "done");

  $thisLiContainer.prepend($doneButton);

  $doneButton.addEventListener('click', function(e) {
    e.preventDefault();
    getCompleteItem($(this));
  });
}

function addUndoButton($thisLiContainer) {
  var $undoButton = addToDoButtons("fa-redo-alt", "undo");

  $thisLiContainer.prepend($undoButton);
  $undoButton.addEventListener('click', function(e) {
    e.preventDefault();
    cancelAction($(this));
  });
}



// ---------------------------------
// WHEN DOCUMENT READY
// --------------------------------

$(function() {

  $list = $('#listItems');
  $newItemButton = $('#newItemButton');
  $newItemForm = $('#newItemForm');
  $thisLiContainer = $(this).parent();

  // ---------------------------------
  // ADD EVENTS on LIST and BUTTONS
  // --------------------------------

  // Event - show buttons on the list
  $list.on('click', 'div', function() {
    var $this = $(this).children('li'),
      $thisLiContainer = $(this),
      complete = $this.hasClass('complete'); // boolean

    checkSelected($this);
    $thisLiContainer.find('button').remove();


    // if (!checkButtons($thisLiContainer)) {
    if (!complete) {
      addDoneButton($thisLiContainer);
      addDeleteButton($thisLiContainer);
    } else {
      addUndoButton($thisLiContainer);
      addDeleteButton($thisLiContainer);
    };
  });

  // Event - show form to add task
  $('#showForm').on('click', function() {
    displayForm()
    $('#listItems li').removeClass('selected');
  });

  // Event - Submit task
  $newItemForm.on('submit', function(e) {
    e.preventDefault();
    var textItem = $('input[type="text"]').val();

    if (textItem !== '') {
      addLineItem(textItem);
      $newItemForm[0].reset();
    };
  });

  // Event - save list
  $('#saveButton').on('click', function(e) {
    e.preventDefault();
    saveData();
    hideForm();
  });


  init();

});
