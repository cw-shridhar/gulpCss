function _bindSeoDescription(seoDescription, platform) {
  $(".seo-description").addClass("hide");
  $(".seo-description .seo-description__read-more").removeClass("hide");
  $(".seo-description").addClass("hide");
  $(".seo-description .seo-description__p").empty();
  $(".seo-description .seo-description__table").empty();
  if (!seoDescription || typeof seoDescription.searchPageDescriptionHtml === "undefined" || seoDescription.searchPageDescriptionHtml === null || seoDescription.searchPageDescriptionHtml == "") {
    $(".seo-description .seo-description__read-more").addClass("hide");
    return;
  }
  $(".seo-description .seo-description__p").append(seoDescription.searchPageDescriptionHtml);
  if(seoDescription.descriptionTableRowData.length === 0)
  {
    if(platform === "mobile") {
      $(".seo-description .seo-description__header").empty();
    }
    $(".seo-description .seo-description__header").addClass("hide");
    $(".seo-description").removeClass("hide");
    return;
  }
  $(".seo-description .seo-description__header").text(seoDescription.descriptionTableTitle);
  var seoDescriptionTableData = [];
  seoDescriptionTableData.push("<tr class=\"seo-description__tr-msite\"><th class=\"seo-description__th\">" +
  seoDescription.descriptionTableColumnHeader[0] + "</th><th class=\"seo-description__th text-align-right-msite\">" +
  seoDescription.descriptionTableColumnHeader[1] + "</th></tr>");
  for (var i = 0; i < seoDescription.descriptionTableRowData.length; i++) {
    seoDescriptionTableData.push("<tr class=\"seo-description__tr-msite\"" +
    "title=\"" + seoDescription.descriptionTableRowData[i].title + "\">" + "><td class=\"seo-description__td\"><a href=\"" +
    seoDescription.descriptionTableRowData[i].url + "\" class=\"seo-description__td--link\"" +
    "title=\"" + seoDescription.descriptionTableRowData[i].title + "\">" +
    seoDescription.descriptionTableRowData[i].name + "</a></td><td class=\"seo-description__td text-align-right-msite\">" +
    seoDescription.descriptionTableRowData[i].price + "</td></tr>");
  }
  $(".seo-description .seo-description__table").append(seoDescriptionTableData.join(""));
  $(".seo-description .seo-description__table").prop('title', seoDescription.descriptionTableSeoTitle);
  $(".seo-description").removeClass("hide");
}

function ExpandSearchPageDescription() {
  $(".seo-description__read-more").addClass("hide");
  $(".seo-description__p").addClass("seo-description__p--expanded");
  $(".seo-description--expanded-block").removeClass("hide");
}

function CollapseSearchPageDescription() {
  $(".seo-description__read-more").removeClass("hide");
  $(".seo-description__p").removeClass("seo-description__p--expanded");
  $(".seo-description--expanded-block").addClass("hide");
}

function hideSeoDescription() {
  $(".seo-description").addClass("hide");
}