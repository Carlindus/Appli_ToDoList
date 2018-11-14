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
  getEventCheckboxes();
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
// UPDATE FUNCTIONS
// ---------------------------------

// Save list items
function saveData() {
  var $items = $('#listItems li'),
    listItems = [];

  for (var i = 0; i < $items.length; i++) {
    listItems[i] = {
      name: $($items[i]).text(),
      status: $($items[i]).attr("class")
    }
  };
}

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

// Show the number of tasks to do
function updateCountTask() {
  var tasksNumber = $('li').not('.done').length;
  $('#tasksNumber').text(tasksNumber);
}

// ---------------------------------
// CHECK BOXES FUNCTIONS
// ---------------------------------

// Define the status important of items
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

function checkStatusBoxes() {
  var $statusboxes = [],
    $statusbox;

  $('#selectors input[type="checkbox"]').not('#selectAll').each(function() {
    $statusbox = {
      class: $(this).attr('data-class'),
      checked: $(this).prop('checked')
    };
    $statusboxes.push($statusbox);
  });
  console.log($statusboxes); // Comment utiliser ce tableau pour faire les actions si dessous?
  //return $statusboxes;


  if ($('#selectAll').is(':checked')) { // réduire cela avec le tableau
    $('#listItems li.todo').parent().show();
    $('#listItems li.important').parent().show();
    $('#listItems li.done').parent().show();
  } else {
    if ($('#selectTodo').is(':checked')) {
      $('#listItems li.todo').parent().show();
    } else {
      $('#listItems li.todo').parent().hide();
    };
    if ($('#selectImportant').is(':checked')) {
      $('#listItems li.important').parent().show();
    } else {
      $('#listItems li.important').parent().hide();
    };
    if ($('#selectDone').is(':checked')) {
      $('#listItems li.done').parent().show();
    } else {
      $('#listItems li.done').parent().hide();
    };
};

  }


  function getEventCheckboxes() {
    $("#selectAll").change(function() {
      var status = this.checked;
      $('.checkbox').each(function() {
        this.checked = status;
      });
      checkStatusBoxes();
    });

    $('.checkbox').change(function() {

      if (this.checked == false) {
        $("#selectAll")[0].checked = false;
      }

      if ($('.checkbox:checked').length == $('.checkbox').length) {
        $("#selectAll")[0].checked = true;
      }
      checkStatusBoxes();
    });
  }


  // ---------------------------------
  // SERVER REQUESTS
  // ---------------------------------

  // Send list items saved to the server
  function sendData() {
    saveData();
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
        showData(data);
        checkStatusBoxes();
      },
      'json'
    );
  }


  function addLineItem(textItem) {
    checkStatus();
    $list.prepend('<div class="list-container"><li class="' + checkStatus() + '">' + textItem + '</li></div>');
    updateCountTask();
  }

  // ---------------------------------
  // ACTION of BUTTONS
  // --------------------------------

  function getCompleteItem($button) {
    var $newLi,
      $thisLiContainer = $button.parent(),
      $li = $button.siblings('li');

    $li.addClass('done').removeClass('selected');
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

    $li.removeClass('done selected');
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
        done = $this.hasClass('done'); // boolean

      checkSelected($this);
      $thisLiContainer.find('button').remove();


      // if (!checkButtons($thisLiContainer)) {
      if (!done) {
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
