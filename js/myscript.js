'use strict';

////////// PROBLEMS //////////////


// SETUP
var $list,
  $newItemButton,
  $newItemForm;

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


function saveData() { // Save list items on server
  var $items = $('#listItems li');

  var listItems = [];
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

function returnData() { // Return list Items saved on server
  $.get(
    'https://carlindusdesign.fr/data/getTodo.php',
    function(data) {
      showData(data)
    },
    'json'
  );
}

function showData(data) { // Load tasks in memory
  var newContent = '';

  for (var i = 0; i < data.listItems.length; i++) {
    console.log(i);
    newContent = '<div class="list-container"><li class="';
    newContent += data.listItems[i].status;
    newContent += '">';
    newContent += data.listItems[i].name;
    newContent += '</li></div>';
    // Update each item in memory to the list
    $list.append(newContent);
  };
}

function addLineItem(textItem) {
  checkStatus();
  $list.prepend('<div class="list-container"><li class="' + checkStatus() + '">' + textItem + '</li></div>');
  updateCountTask();
};

function checkStatus() {
  var $important = $('#newItemForm input[name="important"]');
  var statusItem = '';

  if ($important.is(':checked')) {
    statusItem = 'important';
  } else {
    statusItem = 'todo';
  };
  return statusItem;
};

function updateCountTask() {
  var tasksNumber = $('li').not('.complete').length;
  $('#tasksNumber').text(tasksNumber);
  console.log('nombre task : ' + tasksNumber);
};


$(function() {

  $list = $('#listItems');
  $newItemButton = $('#newItemButton');
  $newItemForm = $('#newItemForm');

  // ---------------------------------
  // ADD EVENT ON BUTTONS
  // ---------------------------------

  $('#showForm').on('click', function() { // Add task button
    displayForm()
    $('#listItems li').removeClass('selected');
  });

  $newItemForm.on('submit', function(e) { // Submit task button
    e.preventDefault();
    var textItem = $('input[type="text"]').val();

    if (textItem !== '') {
      addLineItem(textItem);
      $newItemForm[0].reset();
    };
  });

  $('#saveButton').on('click', function(e) { // save list button
    e.preventDefault();
    saveData();
  });



  // ---------------------------------
  // ACTION BUTTONS
  // --------------------------------

  function getCompleteItem($li) {
    var $newLi;
    $li.addClass('complete');
    $li.removeClass('selected');
    $newLi = $li.parent().clone();
    $list.append($newLi);
    $li.parent().remove();
  };


  function cancelAction($li) {
    var textItem = $li.text();
    var prevClass = $li.attr('class');
    $li.parent().remove();
    var $newContainer = $list.prepend('<div class="list-container"><li class="' + prevClass + '">' + textItem + '</li><div>');
    $newContainer.find('li').removeClass('complete selected');
    // $list.children('.bin').removeClass('complete bin');
    updateCountTask()
  };

  function deleteItem($button) {
    var $lineRemove = $button.parent(".list-container");
    $lineRemove.animate({
      opacity: 0,
      paddingLeft: '+=180'
    }, 500, 'swing', function() {
      $lineRemove.remove();
    });
  };

  function checkSelected($li) {
    console.log($li);
    if ($li.hasClass('selected')) {
      $li.toggleClass("selected");
    } else {
      $('#listItems li').removeClass('selected');
      $li.toggleClass("selected");
    }
  };

  // ADD event on Items
  $list.on('click', 'li', function() {
    var $this = $(this);

    checkSelected($this);
    var complete = $this.hasClass('complete');

    if (!checkButtons($this)) {
      if (!complete) {
        addDoneButton($this);
        addDeleteButton($this);
        console.log('class non complete');
      } else {
        addUndoButton($this);
        addDeleteButton($this);
        console.log('class complete');
      };
    }
    hideForm();
  });


  function addToDoButtons(icon, action) {
    var $checkButton = document.createElement("button");
    var $checkButtonIcon = document.createElement("i");
    $checkButton.classList.add("fas", icon, action);

    $checkButton.appendChild($checkButtonIcon);
    return $checkButton
  };

  function checkButtons($li) {
    var $buttons = $li.parent().find('button');
    if ($buttons.length) {
      return true;
    } else {
      return false;
    };
  };

  function addDeleteButton($li) {
    var $deleteButton = addToDoButtons("fa-trash-alt", "delete");
    $li.parent().prepend($deleteButton);

    $list.on('click', '.delete', function(e) {
      e.preventDefault();
      deleteItem($(this));
    });
  };

  function addDoneButton($li) {
    var $doneButton = addToDoButtons("fa-check", "done");
    $li.parent().prepend($doneButton);

    $list.on('click', '.done', function(e) {
      e.preventDefault();
      console.log('done');
      getCompleteItem($li);
    });
  };

  function addUndoButton($li) {
    var $undoButton = addToDoButtons("fa-redo-alt", "undo");
    $li.parent().prepend($undoButton);

    $list.on('click', '.undo', function(e) {
      e.preventDefault();
      console.log('undo');
      cancelAction($li);
    });
  };


  init();

});
