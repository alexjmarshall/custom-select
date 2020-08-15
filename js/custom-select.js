$(document).ready(function() {
  initCustomSelect();
  var activeElem = document.activeElement;
  if(activeElem.tagName !== "INPUT" && !activeElem.classList.contains("custom-select")) {
      $(".custom-select").first().focus();
  }
});
function initCustomSelect() {
  $("select").each(function (index, select) {
      buildSelect(select);
      if(select.value)
          updateSelects(select);
      var customSel = select.parentNode;
      customSel.addEventListener("click", onCustomSelClick);
      customSel.addEventListener("keydown", onCustomSelKeydown);
  });
  document.addEventListener("click", closeAllSelect);
}
function onCustomSelClick(e) {
  e.stopPropagation();
  closeAllSelect(this);
  toggleSelect(this);
}
function onCustomSelKeydown(e) {
  e.stopPropagation();
  var $items = $(this).find(".select-items");
  if(e.keyCode === 13 || e.keyCode === 0 || e.keyCode === 32) { //enter or spacebar
      e.preventDefault();
      onCustomSelClick.call(this, e);
  } else if(e.keyCode === 27) { //escape
      hideItemList($items);
  } else if(e.keyCode === 40 || e.keyCode === 38) { //down or up arrow
      e.preventDefault();
      if(!$items.hasClass("d-none"))
          focusFirstItem(this);
      else if(e.keyCode === 40) //down arrow
          clickNextItem(this, "down");
      else
          clickNextItem(this, "up");
  }
}
function toggleSelect(select) {
  var $items = $(select).find(".select-items");
  if($items.hasClass("d-none")) {
      showItemList($items);
  } else {
      hideItemList($items);
  }
}
function showItemList(items) {
  var $select = $(items).closest(".custom-select");
  $select.attr("aria-expanded", "true");
  var $downCaret = $(items).closest(".custom-select").siblings(".dropdown-caret-down");
  var $upCaret = $(items).closest(".custom-select").siblings(".dropdown-caret-up");
  $(items).removeClass("d-none");
  $downCaret.addClass("d-none");
  $upCaret.removeClass("d-none");
}
function hideItemList(items) {
  var $select = $(items).closest(".custom-select");
  $select.attr("aria-expanded", "false");
  var $downCaret = $(items).closest(".custom-select").siblings(".dropdown-caret-down");
  var $upCaret = $(items).closest(".custom-select").siblings(".dropdown-caret-up");
  $(items).addClass("d-none");
  $downCaret.removeClass("d-none");
  $upCaret.addClass("d-none");
}
function closeAllSelect(select) {
  /* close all select boxes except the current select box */
  var itemLists = document.getElementsByClassName("select-items");
  var selects = document.getElementsByClassName("custom-select");
  var i, arrNo = [];
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
  var $customSel, $selected, $selectItems, i, item;
  /* clear selected and items from custom select */
  $customSel = $(selElmnt).parent();
  $selected = $customSel.children(".select-selected");
  $selected.remove();
  $selectItems = $customSel.children(".select-items");
  $selectItems.remove();
  /* create new div for selected item */
  $selected = $(document.createElement("DIV"));
  $selected.html(selElmnt.options[selElmnt.selectedIndex].innerHTML);
  var customSelIdNo = $customSel.attr("id").replace("securityQues", "");
  $selected.attr("id", "selected" + customSelIdNo);
  $selected.addClass("select-selected");
  if(!selElmnt.options[selElmnt.selectedIndex].value)
    $selected.addClass("grey-text");
  $customSel.append($selected);
  //apply fade overflow effect
  applyFadeOverlay($selected[0]);
  /* create a new div for the item list */
  $selectItems = $(document.createElement("DIV"));
  $selectItems.addClass("select-items");
  $selectItems.attr("role", "listbox");
  hideItemList($selectItems);
  /* create a new div for each item */
  for (i = 0; i < selElmnt.length; i++) {
      if(!selElmnt.options[i].value)
          continue; //skip if option has no value
      item = document.createElement("DIV");
      item.innerHTML = selElmnt.options[i].innerHTML;
      item.setAttribute("id", "item" + customSelIdNo + i);
      item.setAttribute("tabindex", "0");
      item.setAttribute("role", "option");
      item.setAttribute("aria-selected", false);
      if(i === selElmnt.selectedIndex)
          $(item).addClass("same-as-selected");
      item.addEventListener("click", onItemClick);
      item.addEventListener("keydown", onItemKeydown);
      $selectItems.append(item); //add item to the item list
    }
  $customSel.append($selectItems); //add item list to custom select
}
function onItemClick(e) {
  $clickedItem = $(this);
  //add aria-selected to this item and remove it from the others
  $clickedItem.attr("aria-selected", true);
  $clickedItem.siblings().attr("aria-selected", false);
  e.stopPropagation();
  var $customSel, $selected, select, i, $selectedItem;
  $customSel = $clickedItem.closest(".custom-select");
  $customSel.attr("aria-activedescendant", $clickedItem.attr("id"));
  $selected = $customSel.children(".select-selected");
  $selected.removeClass("grey-text");
  select = $customSel.find("select")[0];
  $selectedItem = $clickedItem.siblings(".same-as-selected");
  for (i = 0; i < select.length; i++) {
      if (select.options[i].innerHTML == $clickedItem.html()) {
          select.selectedIndex = i;
          $selected.html($clickedItem.html());
          $selectedItem.removeClass("same-as-selected");
          $clickedItem.addClass("same-as-selected");
          break;
      }
  }
  updateSelects(select);
  $customSel.click();
  $customSel.focus();
  //apply fade overflow effect
  applyFadeOverlay($selected[0]);
}
function applyFadeOverlay(elm) {
  var $elm = $(elm);
  var overflowRight = elm.scrollWidth - ($elm.innerWidth() + elm.scrollLeft) > 2; //2px margin of error
  overflowRight ? $elm.addClass('fade-overlay') : $elm.removeClass('fade-overlay');
}
function onItemKeydown(e) {
  e.stopPropagation();
  var $customSel = $(this).closest(".custom-select");
  if(e.keyCode === 13) { //enter
      e.preventDefault();
      this.click();
  } else if (e.keyCode === 27) { //escape
      $customSel.click();
      $customSel.focus();
  } else if (e.keyCode == 40) { //down arrow
      e.preventDefault();
      $(this).next().focus();
  } else if (e.keyCode === 38) { //up arrow
      e.preventDefault();
      $(this).prev().focus();
  }
}
function focusFirstItem(select) {
  var $items = $(select).children(".select-items");
  var $firstItem = $items.children(":first");
  $firstItem.focus();
}
function clickNextItem(select, direction) {
  var $items = $(select).children(".select-items");
  var $selectedItem = $items.children(".same-as-selected");
  if(!$selectedItem.length > 0) { //if no option selected yet, select first
      $items.children(":first").click();
      $items.parent().click();
  } else {
      if(direction === "down" && $selectedItem.next().length > 0) {
          $selectedItem.next().click();
          $items.parent().click();
      } else if(direction === "up" && $selectedItem.prev().length > 0){
          $selectedItem.prev().click();
          $items.parent().click();
      }
  }
}
function updateSelects(context) {
  var afterVal, afterText, prevVal, prevText, containsPrevVal; 
  $(context).find("option[value='']").remove();
  afterVal = $(context).val();
  afterText = $(context).find(":selected").text();
  if($(context).data('prev')) {
      prevVal = $(context).data('prev').val;
      prevText = $(context).data('prev').text;
  }
  $("select").each(function (index, select) {
      if(select !== context) {
          $(select).find("option[value='" + afterVal + "']").remove();
          containsPrevVal = $(select).find("option[value='" + prevVal + "']").length > 0
          if(prevVal && prevVal !== afterVal && !containsPrevVal) {
              $(select).append(new Option(prevText, prevVal));
              sortSelect(select);
          }
          buildSelect(select);
      }
  });
  $(context).data("prev", {val : afterVal, text : afterText});
}
function sortSelect(select) {
  var selectedVal = $(select).val();
  var arr = (function(nl) {
      var a = [];
      for (var i = 0; i < nl.length; i++)
          a.push(nl.item(i));
      return a;
  })(select.options);
  arr.sort(function(a,b){
    return a.value - b.value;
  });
  $(select).empty();
  for (var i = 0; i < arr.length; i++)
      select.add(arr[i]);
  $(select).val(selectedVal);
}