let makeCollapsible;

$(document).ready(function () {
  setSelectors();
  makeCollapsible.on("click", toggleMakeCollapsible);
});

function toggleMakeCollapsible(event) {
  if(!event || !event.target)
  {
    return;
  }
  let isCollapsed = $(event.target).hasClass("ref-down-arrow");
  let makeId = event.target.getAttribute('id');
  let modelContainer = $("#chmodels_" + makeId);
  if(!modelContainer)
  {
    return;
  }
  if(isCollapsed)
  {
    $(event.target).removeClass("ref-down-arrow");
    modelContainer.hide();
    return;
  }
  if(modelContainer.children(".js-model-row") && modelContainer.children(".js-model-row").length > 0)
  {
    $(event.target).addClass("ref-down-arrow");
    modelContainer.show();
    return;
  }
  let make = {
    id: makeId
  };
  getdpModels(make)
}

function setSelectors() {
  makeCollapsible = $(".js-make-collapsible");
}
