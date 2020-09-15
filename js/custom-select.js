window.onload = () => {
  initCustomSelect();
};

function initCustomSelect() {
  let selects = document.querySelectorAll('select');
  selects.forEach(select => {
    buildSelect(select);

    if(select.value)
      updateSelects(select);
    
    let customSel = select.parentElement;
    customSel.addEventListener('click', onCustomSelClick);
    customSel.addEventListener('keydown', onCustomSelKeydown);
  })
  document.addEventListener('click', closeAllSelect);
}

function onCustomSelClick(e) {
  e.stopPropagation();

  closeAllSelect(this);
  toggleSelect(this);
}

function onCustomSelKeydown(e) {
  e.stopPropagation();

  let items = document.querySelector('.select-items');
  
  if(e.keyCode === 13 || e.keyCode === 0 || e.keyCode === 32) { //enter or spacebar
    e.preventDefault();

    onCustomSelClick.call(this, e);
  } else if(e.keyCode === 27) { //escape
    hideItemList(items);
  } else if(e.keyCode === 40 || e.keyCode === 38) { //down or up arrow
    e.preventDefault();

    if(!items.classList.contains('d-none'))
      focusFirstItem(this);
    else if(e.keyCode === 40) //down arrow
      clickNextItem(this, 'down');
    else
      clickNextItem(this, 'up');
  }
}

function toggleSelect(select) {
  let items = select.querySelector('.select-items');

  if(items.classList.contains('d-none'))
    showItemList(items);
  else 
    hideItemList(items);
}

function showItemList(items) {
  let select = items.closest('.custom-select');
  select.setAttribute('aria-expanded', 'true');

  items.classList.remove('d-none');
}

function hideItemList(items) {
  let select = items.closest('.custom-select');
  select.setAttribute('aria-expanded', 'false');

  items.classList.add('d-none');
}

function closeAllSelect(select) {
  let selects = document.getElementsByClassName('custom-select');
  let itemLists = document.getElementsByClassName('select-items');
  let arrNo = [];

  for (i = 0; i < selects.length; i++) {
    if (select === selects[i])
      arrNo.push(i)
  }

  for (i = 0; i < itemLists.length; i++) {
    if (arrNo.indexOf(i))
      hideItemList(itemLists[i]);
  }
}

function buildSelect(selElmnt) {
  //clear selected and items from custom select
  let customSel = selElmnt.parentElement;
  let selected = customSel.querySelector('.select-selected');
  if(selected)
    selected.remove();

  let selectItems = customSel.querySelector('.select-items');
  if(selectItems)
    selectItems.remove();

  //create new div for selected item
  selected = document.createElement('DIV');
  selected.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;

  let customSelIdNo = customSel.id.replace('custom-select-', '');
  selected.id = `selected-${customSelIdNo}`;
  selected.classList.add('select-selected');

  customSel.appendChild(selected);
  customSel.setAttribute('aria-labelledby', selected.id);

  //create a new div for the item list
  selectItems = document.createElement('DIV');
  selectItems.classList.add('select-items');
  selectItems.setAttribute('role', 'listbox');

  //create a new div for each item
  for (i = 0; i < selElmnt.length; i++) {
    if(!selElmnt.options[i].value)
      continue; //skip if option has no value

    let item = document.createElement('DIV');
    let option = selElmnt.options[i]
    let value = option.value;

    item.innerHTML = option.text;
    item.dataset.value = value;
    item.id = `item-${customSelIdNo}${value}`;
    item.classList.add('select-item');
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'option');
    
    if(i === selElmnt.selectedIndex)
      item.setAttribute('aria-selected', true);
    else
      item.setAttribute('aria-selected', false);

    item.addEventListener('click', onItemClick);
    item.addEventListener('keydown', onItemKeydown);
    selectItems.appendChild(item); //add item to the item list
  }

  customSel.appendChild(selectItems); //add item list to custom select
  hideItemList(selectItems);
}

function onItemClick(e) {
  e.stopPropagation();

  let clickedItem = this;
  //add aria-selected to this item and remove it from the others
  clickedItem.setAttribute('aria-selected', true);
  otherItems = getElementSiblings(clickedItem);
  for(item of otherItems)
    item.setAttribute('aria-selected', false);

  let customSel = clickedItem.closest('.custom-select');
  customSel.setAttribute('aria-activedescendant', clickedItem.id);

  //update selectedIndex of backing select and text of selected div
  let select = customSel.querySelector('select');
  let selected = customSel.querySelector('.select-selected');
  for (i = 0; i < select.length; i++) {
    if (select.options[i].value === clickedItem.dataset.value) {
      select.selectedIndex = i;
      selected.innerHTML = clickedItem.innerHTML;
      break;
    }
  }

  updateSelects(select);
  customSel.click();
  customSel.focus();
}

function getElementSiblings(elm) {
  let sibs = [];
  let sib = elm.parentElement.firstChild;

  while(sib) {
    if(sib !== elm)
      sibs.push(sib);
    sib = sib.nextElementSibling;
  }

  return sibs;
}

function onItemKeydown(e) {
  e.stopPropagation();

  let customSel = this.closest('.custom-select');

  if(e.keyCode === 13) { //enter
    e.preventDefault();
    this.click();
  } else if (e.keyCode === 27) { //escape
    customSel.click();
    customSel.focus();
  } else if (e.keyCode === 40) { //down arrow
    e.preventDefault();
    nextItem = this.nextElementSibling;
    if(nextItem) 
      nextItem.focus();
  } else if (e.keyCode === 38) { //up arrow
    e.preventDefault();
    prevItem = this.previousElementSibling;
    if(prevItem)
      prevItem.focus();
  }
}

function focusFirstItem(select) {
  let items = select.querySelectorAll('.select-item');
  let firstItem = items[0];
  firstItem.focus();
}

function clickNextItem(select, direction) {
  let items = select.querySelector('.select-items');
  let selectedItem = items.querySelector('[aria-selected=true]');

  //if no option selected yet, select first
  if(!selectedItem) { 
    items.querySelector(':first-child').click();
    select.click();
  } else {
    if(direction === 'down' && selectedItem.nextElementSibling) {
      if(selectedItem)
        selectedItem.nextElementSibling.click();
      else
      items.querySelector(':first-child').click();
      select.click();
    } else if(direction === 'up' && selectedItem.previousElementSibling){
      selectedItem.previousElementSibling.click();
      select.click();
    }
  }
}

function updateSelects(context) {
  let emptyOption = context.querySelector('option[value=""]');
  if(emptyOption)
    emptyOption.remove();

  let afterVal = context.value;
  let afterText = context.querySelector('option:checked').innerText;

  let prevVal, prevText;
  if(context.dataset.prev) {
    let json = context.dataset.prev;
    let data = JSON.parse(json);
    prevVal = data.val;
    prevText = data.text;
  }

  //update other selects
  for(select of document.querySelectorAll('select')) {
    if(select === context)
      continue;

    //remove selected option from other selects
    let afterValOption = select.querySelector(`option[value='${afterVal}']`);
    let isSelectModified = false;
    if(afterValOption) {
      afterValOption.remove();
      isSelectModified = true;
    }

    //add previously selected option back to other selects
    let prevValOption = select.querySelector(`option[value='${prevVal}']`);
    if(prevVal && prevVal !== afterVal && !prevValOption) {
      select.appendChild(new Option(prevText, prevVal));
      sortSelect(select);
      isSelectModified = true;
    }

    if(isSelectModified)
      buildSelect(select);
  }
  //update data storing previously selected option
  context.dataset.prev = `{"val":"${afterVal}", "text":"${afterText}"}`;
}

function sortSelect(select) {
  let selectedVal = select.value;
  let arr = Array.from(select.options);

  arr.sort((a,b) => a.value - b.value);

  for(child of select.children)
    child.remove();

  for (option of arr)
    select.add(option);

  select.value = selectedVal;
}