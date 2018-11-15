'use strict';

////////// PROBLEMS //////////////
// comment enregistrer la liste sur serveur?

// SETUP
var $list, $newItemButton, $newItemForm;
$list = $('#listItems');
$newItemButton = $('#newItemButton');
$newItemForm = $('#newItemForm');


// Save list items on server
function saveData() {
var $items = $('#listItems li');

var listItems = [];
for (var i = 0; i < $items.length; i++) {
  listItems[i] = {
    name: $($items[i]).text(),
    status: $($items[i]).attr("class")
  }
};

  $.post(
    'https://carlindusdesign.fr/data/saveTodo.php',
    {listItems}
  );
}

// Return list Items saved on server
$.get(
  'https://carlindusdesign.fr/data/getTodo.php',
  function(data) {
    showData(data)
  },
  "json"
);

// LOAD TASKS IN MEMORY
function showData(data) {
  var newContent = '';
  for (var i = 0; i < data.listItems.length; i++) {
    console.log(i);
    newContent = '<li class="';
    newContent += data.listItems[i].status;
    newContent += '">';
    newContent += data.listItems[i].name;
    newContent += '</li>';
    // Update each item in memory to the list
    $list.append(newContent);
  };
};

// when document is ready
$(function() {

  // ADD A NEW ITEM
  $newItemButton.show();
  $newItemForm.hide();

  // Add event on Display form button
  $('#showForm').on('click', function() {
    $newItemButton.hide();
    $newItemForm.show();
  });

  // Add item to the list in the browser and update counter
  function addListItem(event) {
    event.preventDefault();
    var $important = $('#newItemForm input[name="important"]');
    var textItem = $('input[type="text"]').val();
    var statusItem = '';

    if ($important.is(':checked')) {
      statusItem = 'important';
      $important.attr('checked', false); // ?? NE DECOCHE PAS LA CHECKBOX
    } else {
      statusItem = 'todo';
    }
    // add new item to the list
    $list.append('<li class="' + statusItem + '">' + textItem + '</li>');
    // Clear input
    //$('input[type="text"]').val('');
    // Update counter
    countTask();
    // post to the server new item
    var item = 'test new item add';
    // $.post('https://carlindusdesign.fr/data/todolist-jsonp.js?callback=showData', item, function(data) {
    //   addDataItem(data);
    // });
  };

  // Add event on submit button
  $newItemForm.on('submit', function(e) {
    e.preventDefault();
    if ($('input[type="text"]').val() !== '') {
      addListItem(e);
      $newItemForm[0].reset();
    }
  })

  // Count task number
  function countTask() {
    var tasksNumber = $('li').not('.complete').length;
    $('#tasksNumber').text(tasksNumber);
  };

  countTask();

$('#saveButton').on('click', function(){
  saveData();
});
  // ADD event on Items
  $list.on('click', 'li', function() {
    var $this = $(this);
    var prevClass = $this.attr('class');
    var complete = $this.hasClass('complete');
    var textItem = $this.text();
    var $bin = $('li.bin'); // list class=complete is selected

    // remove class bin if others have this class
    if ($bin.length > 0 && !$this.hasClass('bin')) {
      var textBin = $bin.text();
      $bin.html(textBin);
      console.log('li.Bin');
      $bin.removeClass('bin');
    }

    if (!complete) { // if no-complete, change the class to complete
      $this.remove();
      $list.append('<li class="' + prevClass + ' complete">' + textItem + '</li>');
    } else {


      $this.addClass('bin');
      var content = ''; // content of li.complete item (class=bin)
      content += '<a href="#" class="cancel"><img src="img/icon_cancel.svg" alt="flêche de retour arrière" title="ajouter à la liste des tâches" /></a>';
      content += '<span>' + textItem + '</span>';
      content += '<a href="#" class="suppr"><img src="img/icon_suppr.svg" alt="supprimer la tâche" title="supprimer la tâche" /></a>'
      $this.html(content);

      console.log($this.children('span'));

      $this.children('span').on('click', function(e) {
        e.stopPropagation();
        $this.html(textItem);
        $this.removeClass('bin');
      });

    };

    countTask();
  });

  // event on cancel Button
  $list.on('click', '.cancel', function(event) {
    event.preventDefault();
    var $this = $(this).parent("li");
    var textItem = $this.text();
    var prevClass = $this.attr('class');
    $this.remove();
    $list.prepend('<li class="' + prevClass + '">' + textItem + '</li>');
    $list.children('.bin').removeClass('complete bin');
    countTask();
  });

  // event on delete button
  $list.on('click', '.suppr', function(event) {
    event.preventDefault();
    var $this = $(this).parent("li");
    $this.animate({
      opacity: 0,
      paddingLeft: '+=180'
    }, 500, 'swing', function() {
      $this.remove();
    });
  });


  // Last brackets
});
