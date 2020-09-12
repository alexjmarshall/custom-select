window.onload = () => {
  initCustomSelect();
  // var activeElem = document.activeElement;
  // if(activeElem.tagName !== "INPUT" && !activeElem.classList.contains("custom-select")) {
  //     $(".custom-select").first().focus();
  // }
};

function initCustomSelect() {
  let selects = document.querySelectorAll('select');

  selects.forEach(select => {
    buildSelect(select);

    if(select.value)
      updateSelects(select);
    
    let customSel = select.parentElement;
    customSel.addEventListener("click", onCustomSelClick);
    customSel.addEventListener("keydown", onCustomSelKeydown);
  })
  // $("select").each(function (index, select) {
      
  // });
  document.addEventListener("click", closeAllSelect);
}

function onCustomSelClick(e) {
  e.stopPropagation();

  closeAllSelect(this);
  toggleSelect(this);
}

function onCustomSelKeydown(e) {
  e.stopPropagation();

  let items = document.querySelector(".select-items"); //$(this).find(".select-items"); 
  
  if(e.keyCode === 13 || e.keyCode === 0 || e.keyCode === 32) { //enter or spacebar
    e.preventDefault();
    onCustomSelClick.call(this, e);
  } else if(e.keyCode === 27) { //escape
    hideItemList(items);
  } else if(e.keyCode === 40 || e.keyCode === 38) { //down or up arrow
    e.preventDefault();

    if(!items.classList.contains("d-none"))//TODO d-none?
      focusFirstItem(this);
    else if(e.keyCode === 40) //down arrow
      clickNextItem(this, "down");
    else
      clickNextItem(this, "up");
  }
}

function toggleSelect(select) {
  let items = select.querySelector(".select-items");
  if(items.classList.contains("d-none"))//TODO change d-none
    showItemList(items);
  else 
    hideItemList(items);
}

function showItemList(items) {
  let select = items.closest(".custom-select");
  select.setAttribute("aria-expanded", "true");

  items.classList.remove("d-none"); //TODO d-none

  // let $downCaret = items.closest(".custom-select").siblings(".dropdown-caret-down");
  // let $upCaret = $(items).closest(".custom-select").siblings(".dropdown-caret-up");
  // $downCaret.addClass("d-none");
  // $upCaret.removeClass("d-none");
}

function hideItemList(items) {
  let select = items.closest(".custom-select");
  select.setAttribute("aria-expanded", "false");

  items.classList.add("d-none");

  // var $downCaret = $(items).closest(".custom-select").siblings(".dropdown-caret-down");
  // var $upCaret = $(items).closest(".custom-select").siblings(".dropdown-caret-up");
  
  // $downCaret.removeClass("d-none");
  // $upCaret.addClass("d-none");
}

function closeAllSelect(select) {
  /* close all select boxes except the current select box */
  let itemLists = document.getElementsByClassName("select-items");
  let selects = document.getElementsByClassName("custom-select");
  let i, arrNo = [];

  for (i = 0; i < selects.length; i++) {
    if (select == selects[i])
      arrNo.push(i)
  }

  for (i = 0; i < itemLists.length; i++) {
    if (arrNo.indexOf(i))
      hideItemList(itemLists[i]);
  }
}

function buildSelect(selElmnt) {
  let customSel, selected, selectItems, i, item;
  /* clear selected and items from custom select */
  customSel = selElmnt.parentElement;
  selected = customSel.querySelector(".select-selected"); //TODO getbyclassname
  if(selected)
    selected.remove();
  selectItems = customSel.getElementsByClassName(".select-items");
  for(item of selectItems)
    item.remove();

  /* create new div for selected item */
  selected = document.createElement("DIV");
  selected.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;

  let customSelIdNo = customSel.getAttribute("id").replace("custom-select-", "");
  selected.setAttribute("id", "selected-" + customSelIdNo);
  selected.classList.add("select-selected");
  // if(!selElmnt.options[selElmnt.selectedIndex].value)
  //   $selected.addClass("grey-text");
  customSel.appendChild(selected);

  //apply fade overflow effect
  // applyFadeOverlay($selected[0]);

  /* create a new div for the item list */
  selectItems = document.createElement("DIV");
  selectItems.classList.add("select-items");
  selectItems.setAttribute("role", "listbox");


  /* create a new div for each item */
  for (i = 0; i < selElmnt.length; i++) {
    if(!selElmnt.options[i].value)
      continue; //skip if option has no value

    item = document.createElement("DIV");
    let option = selElmnt.options[i]
    let text = option.text;
    item.innerHTML = text;
    item.setAttribute("id", "item-" + i);//+ customSelIdNo
    item.setAttribute("tabindex", "0");
    item.setAttribute("role", "option");
    item.setAttribute("aria-selected", false);
    
    if(i === selElmnt.selectedIndex)
      item.classList.add("same-as-selected");
    item.addEventListener("click", onItemClick);
    item.addEventListener("keydown", onItemKeydown);
    selectItems.appendChild(item); //add item to the item list
    }

  customSel.appendChild(selectItems); //add item list to custom select
  hideItemList(selectItems);
}

function onItemClick(e) {
  clickedItem = this;

  //add aria-selected to this item and remove it from the others
  // clickedItem.attr("aria-selected", true); 
  // clickedItem.siblings().attr("aria-selected", false); TODO - vanilla JS
  
  e.stopPropagation();

  let customSel, selected, select, i, selectedItem;
  customSel = clickedItem.closest(".custom-select");
  // customSel.attr("aria-activedescendant", $clickedItem.attr("id"));
  selected = customSel.querySelector(".select-selected");
  // selected.classList.remove("grey-text");
  select = customSel.querySelector("select");
  selectedItem = clickedItem.parentElement.querySelector(".same-as-selected");

  for (i = 0; i < select.length; i++) {
    if (select.options[i].innerHTML === clickedItem.innerHTML) {
      select.selectedIndex = i;
      selected.innerHTML = clickedItem.innerHTML;
      if(selectedItem) selectedItem.classList.remove("same-as-selected");
      clickedItem.classList.add("same-as-selected");
      break;
    }
  }

  updateSelects(select);
  customSel.click();
  customSel.focus();
  //apply fade overflow effect
  // applyFadeOverlay($selected[0]);
}

// function applyFadeOverlay(elm) {
//   var $elm = $(elm);
//   var overflowRight = elm.scrollWidth - ($elm.innerWidth() + elm.scrollLeft) > 2; //2px margin of error
//   overflowRight ? $elm.addClass('fade-overlay') : $elm.removeClass('fade-overlay');
// }

function onItemKeydown(e) {
  e.stopPropagation();

  let customSel = this.closest(".custom-select");

  if(e.keyCode === 13) { //enter
    e.preventDefault();
    this.click();
  } else if (e.keyCode === 27) { //escape
    customSel.click();
    customSel.focus();
  } else if (e.keyCode == 40) { //down arrow
    e.preventDefault();
    this.nextElementSibling.focus();
  } else if (e.keyCode === 38) { //up arrow
    e.preventDefault();
    this.previousElementSibling.focus();
  }
}

function focusFirstItem(select) {
  let items = select.querySelectorAll(".select-items");
  let firstItem = items[0]; //TODO fix?
  firstItem.focus();
}

function clickNextItem(select, direction) {
  let items = select.querySelector(".select-items");
  let selectedItem = items.querySelector(".same-as-selected");

  if(!selectedItem) { //if no option selected yet, select first -- TODO fix?
    items.querySelector(":first-child").click();
    items.parentElement.click();
  } else {
    if(direction === "down" && selectedItem.nextElementSibling) {
      selectedItem.nextElementSibling.click();
      items.parentElement.click();
    } else if(direction === "up" && selectedItem.previousElementSibling){
      selectedItem.previousElementSibling.click();
      items.parentElement.click();
    }
  }
}

function updateSelects(context) {
  let afterVal, afterText, prevVal, prevText, containsPrevVal; 
  if(context.querySelector("option[value='']")) context.querySelector("option[value='']").remove();
  afterVal = context.value;
  afterText = context.querySelector("option:checked").innerText; //TODO fix?

  if(context.dataset.prev) {
    let json = context.dataset.prev;
    let data = JSON.parse(json);
    prevVal = data.val;
    prevText = data.text;
  }

  for(select of document.querySelectorAll("select")) {
      if(select !== context) {
          if(select.querySelector("option[value='" + afterVal + "']")) select.querySelector("option[value='" + afterVal + "']").remove();//TODO template literal and cahe!
          containsPrevVal = select.querySelector("option[value='" + prevVal + "']")//TODO boolean?
          if(prevVal && prevVal !== afterVal && !containsPrevVal) {
              $select.appendChild(new Option(prevText, prevVal));
              sortSelect(select);
          }
          buildSelect(select);
      }
  }

  context.dataset.prev = `{"val":"${afterVal}", "text":"${afterText}"}`; //TODO conditional?
}

function sortSelect(select) {
  var selectedVal = select.value;
  var arr = (function(nl) {
    var a = [];
    for (var i = 0; i < nl.length; i++) //TODO for of or for in
      a.push(nl.item(i));
    return a;
  })(select.options);

  arr.sort(function(a,b){
    return a.value - b.value;
  });

  $(select).empty();
  for(child of select.children)
    child.remove();
  for (var i = 0; i < arr.length; i++)
    select.add(arr[i]);

  select.value = selectedVal;
}