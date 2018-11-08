// Add item to the list in the server
var test =[];

function addDataItem(item){
    console.log('addDataItem');
    test.push(item);
};

// ITEMS DATABASE
var toDoItems = [
  {
    "name" : "item 1 normal local" ,
    "status" : "todo"
  },
  {
    "name" : "item 2 normal",
    "status" : "todo"
  },
  {
    "name" : "item 3 important",
    "status" : "important"
  }]

showData({toDoItems});
