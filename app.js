// ****** SELECT ITEMS **********

const alert = document.querySelector('.alert');
const form = document.querySelector('.grocery-form');
const grocery = document.getElementById('grocery');
const submitBtn = document.querySelector('.submit-btn');
const container = document.querySelector('.grocery-container');
const list = document.querySelector('.grocery-list');
const clearBtn = document.querySelector('.clear-btn');


// edit option

let editElement;
let editFlag = false;
let editID = '';

// ****** EVENT LISTENERS **********
//submit form

form.addEventListener('submit', addItem);
// clear items
clearBtn.addEventListener('click', clearItems);

//load items from local STORAGE
window.addEventListener('DOMContentLoaded', setupItems);

// ****** FUNCTIONS **********



function addItem(event){
  console.log("test")
  event.preventDefault();
  const value = grocery.value;
  const id = new Date().getTime().toString();
  if(value !== '' && editFlag === false){
    createListItem(id, value);
    // display alert
    displayAlert("item added to the list", 'success');
    // show container
    container.classList.add("show-container");

    // ADD TO LOCAL STORAGE
    addToLocalStorage(id, value);

    //set back to default
    setBackToDefault();

    }
   else if (value !== '' && editFlag === true){
    editElement.innerHTML = value;
    displayAlert('value changed', 'success');
    // edit local STORAGE
    editLocalStorage(editID, value);
    setBackToDefault();

  } else {
    displayAlert('please enter value', 'danger')
  }

}

// clear Items
function clearItems(){
  const items = document.querySelectorAll('.grocery-item');
  if (items.length > 0){
    items.forEach(function(item){
      list.removeChild(item);
    })
  }
  container.classList.remove("show-container")
  displayAlert("List Cleared", "success")
  setBackToDefault();
  localStorage.removeItem('list')
}


//display alert
function displayAlert(text, action){
  alert.textContent = text;
  alert.classList.add(`alert-${action}`);

  // remove displayAlert
  setTimeout(function(){
    alert.textContent = '';
    alert.classList.remove(`alert-${action}`);
  },1000)
}

//edit function
function editItem(event){
const element = event.currentTarget.parentElement.parentElement;

//set edit item
editElement = event.currentTarget.parentElement.previousElementSibling;
//set form value
grocery.value = editElement.innerHTML;
editFlag = true;
editID = element.dataset.id;
submitBtn.textContent = "edit"

}


//delete function
function deleteItem(){
  const element = event.currentTarget.parentElement.parentElement;
  const id = element.dataset.id;
  list.removeChild(element);

  if(list.children.length === 0){
    container.classList.remove('show-container')
  }
  displayAlert('item removed', 'success')
  setBackToDefault();
  // remove from Local STORAGE
  // removeFromLocalStorage(id);
}



//set back to default
function setBackToDefault(){
  grocery.value = '';
  editFlag = false;
  editID = '';
  submitBtn.textContent = "submit";
}


// ****** LOCAL STORAGE **********
function addToLocalStorage(id, value){

  const grocery = {
    id:id,
    value: value,
  }
  let items = localStorage.getItem('list')
  ? JSON.parse(localStorage.getItem('list'))
  : [];

  console.log(items)

  items.push(grocery);
  localStorage.setItem('list', JSON.stringify(items));
  console.log("added to local storage");
}

function removeFromLocalStorage(id){
  let items = getLocalStorage();
  items = items.filter(function(item){
    if (item.id !== id){
      return item;
    }
  });
localStorage.setItem('list', JSON.stringify(items));
}

function editLocalStorage(id, value){
  let items = getLocalStorage();
  items = items.map(function(item){
    if (item.id === id){
      item.value = value;
    }
    return item;
  });
  localStorage.setItem('list', JSON.stringify(items));
}

function getLocalStorage(){
  return localStorage.getItem('list')
  ? JSON.parse(localStorage.getItem('list'))
  : [];
}


// localStorage.setItem('orange', JSON.stringify(['item', 'item2']))
//
// let oranges = JSON.parse(localStorage.getItem('orange'));
// console.log(oranges)
//
// localStorage.removeItem('orange')
// ****** SETUP ITEMS **********

function setupItems(){
  let items = getLocalStorage();

  if (items.length > 0 ){
    items.forEach(function(item){
      createListItem(item.id, item.value)
    });
    container.classList.add('show-container')
  }
}

function createListItem(id, value){
  const element = document.createElement("article");
  //add class
  element.classList.add("grocery-item");
  // add id
  let attr = document.createAttribute('data-id');
  attr.value = id;
  element.setAttributeNode(attr);
  element.innerHTML = `<p class = "title">${value}</p>
  <div class="btn-container">
    <button type="button" class = "edit-btn" >
      <i class = "fas fa-edit"></i></button>
      <button type="button" class = "delete-btn">
      <i class = "fas fa-trash"></i></button>
  </div>`;

  //set up event listeners after HTML is added

  //delete function
  const deleteBtn = element.querySelector('.delete-btn');
  const editBtn = element.querySelector('.edit-btn');
  // add listeners
  deleteBtn.addEventListener("click", deleteItem);
  editBtn.addEventListener("click", editItem);

  //apend list
  list.appendChild(element);
}
