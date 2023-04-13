// Get the list items
var listItems = document.querySelectorAll('li');

// Loop through the list items
for (var i = 0; i < listItems.length; i++) {
  // Add a click event listener to each list item
  listItems[i].addEventListener('click', function() {
    // Get the text content of the clicked list item
    var group = this.textContent;
    
    // Set the text content to the group-name input value
    document.getElementById('group-name').value = group;
  });
}