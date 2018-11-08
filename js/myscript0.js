////////// PROBLEMS //////////////
// double-click on li to access buttons (44-93)
// comment ne pas selectionner le texte de la div quand on click?
// comment enregistrer la liste sur serveur?


$(function(){

// SETUP
var $list, $newItemButton, $newItemForm;
$list = $('#listItem');
$newItemButton = $('#newItemButton');
$newItemForm = $('#newItemForm');

// ADD A NEW ITEM
$newItemButton.show();
$newItemForm.hide();

    // Add event on Display form button
    $('#showForm').on('click',function(){
      $newItemButton.hide();
      $newItemForm.show();
    });

    // Add item to the list and update counter
    function addListItem(event){
      event.preventDefault();
      var $important = $('#newItemForm input[name="important"]');
      var textItem = $('input[type="text"]').val();

      if ($important.is(':checked')){
          $list.append('<li class="important">' + textItem + '</li>');
          $important.attr('checked', false); // ?? NE DECOCHE PAS LA CHECKBOX
      } else {
          $list.append('<li class="todo">' + textItem + '</li>');
      }
      $('input[type="text"]').val('');
      countTask();
    };

    // Add event on submit button
    $newItemForm.on('submit', function(e){
      addListItem(e);
      $list.focus();
    })
// Count task number
function countTask(){
  var tasksNumber = $('li').not('.complete').length;
  $('#tasksNumber').text(tasksNumber);
};
countTask();

// ADD event on Items
  $list.on('click', 'li', function(){
    var $this = $(this);
    var prevClass = $this.attr('class');
    var complete = $this.hasClass('complete');
    var textItem = $this.text();
    var $bin = $('li.bin'); // list class=complete is selected

    // remove class bin if others have this class
    if ($bin.val() === 0){ // PAS CONVAINCU DE L'ECRITURE
    var textBin = $bin.text();
    $bin.html(textBin);
    console.log('li.Bin');
    $bin.removeClass('bin');
    }

    if (!complete) { // if no-complete, change the class to complete
      $this.remove();
      $list.append('<li class="' + prevClass + ' complete">' + textItem + '</li>');
    } else {  // if complete, remove the task
      $this.addClass('bin');
      var content = ''; // content of li.complete item (class=bin)
      content += '<a href="#" class="cancel"><img src="img/icon_cancel.svg" alt="flêche de retour arrière" title="ajouter à la liste des tâches" /></a>';
      content += textItem;
      content += '<a href="#" class="suppr"><img src="img/icon_suppr.svg" alt="supprimer la tâche" title="supprimer la tâche" /></a>'
      $this.html(content);
    };

    var $cancelButton = $bin.find('a.cancel');
    var $supprButton = $bin.find('a.suppr');
    // event on cancel Button
    $cancelButton.on('click', function(event){
      event.preventDefault();
      $bin.remove();
      $list.prepend('<li class="' + prevClass + '">' + textBin + '</li>');
      $list.children('.bin').removeClass('complete bin');
      countTask();
      });
    // event on delete button
    $supprButton.on('click', function(event){
      event.preventDefault();
      $bin.animate({
          opacity : 0,
          paddingLeft : '+=180'}
        , 500, 'swing', function(){
          $bin.remove();
      });
    });

    countTask();
  });


// Last brackets
});
