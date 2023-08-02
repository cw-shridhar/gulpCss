var carImages = (function () {
  var container, dropzoneTemplate, otherImages, uploadedImages;
  var otherImageType;
  var inquiryId;
  var previousUploadedImages = 0;
  if (typeof events !== "undefined") {
    events.subscribe("domready", setSelectors);
    events.subscribe("domready", registerDomEvents);
  }

  function setSelectors() {
    container = $("#formCarImage");
    dropzoneTemplate = $("#dropzoneTemplate");
    otherImages = $("#add-photos-dropzone");
  }

  function registerDomEvents(data) {
    Dropzone.autoDiscover = false;

    $(container).on("click", ".list-item__upload-icon", function () {
      $(this).closest("li").find(".dz-default").trigger("click");
    });

    $(container).on("click", "#add-more-photos", function () {
      otherImages.trigger("click");
    });

    $("#prevBtn").on("click", function () {
      var trackinglabel = formatTrackingLabel([
        editCarTracking.actionType.imageBack,
      ]);
      editCarTracking.trackForMobile(
        editCarTracking.actionType.imageBack,
        editCarTracking.actionType.imageBack
      );
      window.history.back();
    });

    $(document).on("click", ".modal-box .modal__close", function () {
      history.back();
    });
    $(document).on("click", "#modalBg, .close-icon", function () {
      popUp.hidePopUp();
    });
    $(window).scroll(function () {
      fixButton();
    });
    $(window).on("popstate", function () {
      if (editCarCommon.isVisible()) {
        editCarCommon.hideModal();
      }
    });
    inquiryId = $(container).attr("data-profileid");
    $(container).on("click", "#nextBtn", submitImages);
    if (data) {
      uploadedImages = data;
      otherImageType = otherImages.attr("data-id");
      if (typeof self !== "undefined" && self !== null) {
        self.serverImg(uploadedImages[otherImageType ? otherImageType : 7]);
      }
    }
    var trackinglabel = formatTrackingLabel(["s" + inquiryId, getUtmSource()]);
    editCarTracking.trackForMobile(
      editCarTracking.actionType.imagePageLoad,
      trackinglabel
    );
    initPhotoUpload();
    initSinglePhotoUpload();
  }
  var self = this;

  function formatTrackingLabel(labelArray) {
    return labelArray
      .filter(function (lbl) {
        if (lbl) {
          return true;
        }
      })
      .join("|");
  }

  function getUtmSource() {
    var src = getQueryStringParam("utm_source");
    return src || null;
  }

  var categoryPhotos = {
    attach: function (dropzoneObj) {
      $(dropzoneObj.element).find(".dropzone-placeholder").show();
    },

    detach: function (dropzoneObj) {
      $(dropzoneObj.element).find(".dropzone-placeholder").hide();
      setImageCategory(dropzoneObj);
    },
  };

  var morePhotos = {
    dropzoneDiv: otherImages,

    addPhotosTemplate:
      '<div id="add-more-photos" class="dz-preview"><span class="list-item__upload-icon other-images-icon"></span></div>',

    attach: function () {
      var addPhotosDiv;
      if (!otherImages.hasClass("dz-under-limit")) {
        otherImages.find("#add-more-photos").remove();
        otherImages
          .addClass("dz-under-limit")
          .append(morePhotos.addPhotosTemplate);
      }
    },

    detach: function () {
      if (otherImages.hasClass("dz-under-limit")) {
        otherImages.find("#add-more-photos").remove();
        otherImages.removeClass("dz-under-limit");
      }
    },
  };
  if (typeof self !== "undefined" && self !== null) {
    self.serverImg = ko.observableArray([]);
  }

  function setRemoveLinkUrlList(file, imageResult) {
    try {
      var container = $("#imageUploadList .dz-preview.dz-success");
      var existingPhotoCount = $(
        "#imageUploadList .dz-preview.dz-success[photoid]"
      ).length;
      $(file._removeLink).attr("photoid", imageResult.photoId);
    } catch (e) {
      console.warn(e);
    }
  }

  function setImageCategory(dropzoneObj) {
    var categoryName = $(dropzoneObj.element).attr("data-title");

    $(dropzoneObj.element).find(".dz-filename").text(categoryName);
  }

  function setRemoveLinkUrl(file, imageResult) {
    try {
      var container = $("#add-photos-dropzone .dz-preview.dz-success");
      var existingPhotoCount = $(
        "#add-photos-dropzone .dz-preview.dz-success[photoid]"
      ).length;
      $(file._removeLink).attr("photoid", imageResult.photoId);
    } catch (e) {
      console.warn(e);
    }
  }
  if (typeof self !== "undefined" && self !== null) {
    self.removePhoto = function removeUploadedPhoto(photoId) {
      var isSuccess = false;
      if (photoId) {
        try {
          $.ajax({
            type: "DELETE",
            url: "/sell-used-car/api/stocks/images/" + photoId + "/",
            contentType: "application/json",
            dataType: "json",
            complete: function (xhr, ajaxOptions, thrownError) {
              if (xhr && xhr.status === 4) {
                isSuccess = true;
              } else {
                isSuccess = false;
              }
            },
          });
        } catch (e) {
          isSuccess = false;
        }
      }
      return isSuccess;
    };
  }

  function trackChangeInImages() {
    var newUploadedImages = $("[photoid]").length ? $("[photoid]").length : 0;
    var trackinglabel = formatTrackingLabel([
      newUploadedImages - previousUploadedImages,
      getUtmSource(),
    ]);
    editCarTracking.trackForMobile(
      editCarTracking.actionType.imageSave,
      trackinglabel
    );
  }

  function initPhotoUpload() {
    var maxFilesAllowed =
      $.cookie("_abtest") && $.cookie("_abtest") % 4 !== 0 ? 9 : 1000;
    otherImages.dropzone({
      maxFilesize: 8,
      maxFiles: maxFilesAllowed,
      previewTemplate: dropzoneTemplate.html(),
      addRemoveLinks: true,
      acceptedFiles: ".png, .jpg, .jpeg, .gif",
      dictFileTooBig: "Max image size 8MB",
      dictMaxFilesExceeded: "Upload limit reached",
      url: "/sell-used-car/api/stocks/images/validate/",
      init: function () {
        var myDropzone = this;
        if (typeof self !== "undefined" && self !== null) {
          $(self.serverImg()).each(function (index, value) {
            var uF = { name: "name", size: 12345 };
            myDropzone.files.push(uF);
            myDropzone.emit("addedfile", uF);
            myDropzone.emit("thumbnail", uF, value.imageUrl);
            myDropzone.createThumbnailFromUrl(uF, value.imageUrl);
            myDropzone.emit("complete", uF);
            $(myDropzone.files[index].previewElement)
              .addClass("dz-success")
              .find("#spinner-content")
              .hide();
            $(myDropzone.files[index].previewElement)
              .addClass("dz-success")
              .find(".dz-success-mark")
              .hide();
            $(myDropzone.files[index].previewElement)
              .find(".dz-remove")
              .attr("photoid", value.photoId);
            previousUploadedImages++;
          });
          myDropzone.options.maxFiles -= self.serverImg()
            ? self.serverImg().length
            : 0;

          if (
            myDropzone.files.length > 0 &&
            myDropzone.files.length < maxFilesAllowed
          ) {
            morePhotos.attach();
          } else {
            morePhotos.detach();
          }
        }

        this.on("sending", function (file) {
          $(file.previewElement).find("#spinner-content").hide();
        });

        this.on("removedfile", function (file) {
          morePhotos.detach();
          if (myDropzone.options.maxFiles < maxFilesAllowed)
            ++myDropzone.options.maxFiles;
          self.removePhoto($(file._removeLink).attr("photoid"));
          if (
            myDropzone.files.length >= 0 &&
            myDropzone.files.length < maxFilesAllowed
          ) {
            morePhotos.attach();
          } else {
            morePhotos.detach();
          }
        });

        this.on("success", function (file, response) {
          if (response) {
            setRemoveLinkUrl(file, response);
          }
        });

        this.on("error", function (file, response) {
          $(file.previewElement).find("#spinner-content").hide();
          if (file.xhr && file.xhr.status === 0)
            $(file.previewElement)
              .find(".dz-error-message")
              .text("You're offline.");
          else $(file.previewElement).find(".dz-error-message").text(response);
          $(file.previewElement)
            .find(".dz-error-mark")
            .on("click", function () {
              myDropzone.removeFile(file);
              morePhotos.detach();
              myDropzone.addFile(file);
              if (
                myDropzone.files.length > 0 &&
                myDropzone.files.length < maxFilesAllowed + 1
              ) {
                morePhotos.attach();
              }
            });
        });

        this.on("maxfilesexceeded", function (file) {
          $(file.previewElement)
            .find(".dz-error-message")
            .text("Upload limit reached");
        });

        this.on("addedfiles", function (file) {
          morePhotos.detach();
          if (
            myDropzone.files.length > maxFilesAllowed &&
            typeof self !== "undefined" &&
            self !== null
          ) {
            $(file).each(function (i) {
              if (i >= maxFilesAllowed + 1 - self.serverImg().length) {
                myDropzone.cancelUpload(this);
                myDropzone.removeFile(this);
              }
            });
          }
          if (
            myDropzone.files.length > 0 &&
            myDropzone.files.length < maxFilesAllowed + 1
          ) {
            morePhotos.attach();
          } else {
            morePhotos.detach();
          }
        });

        this.on("drop", function (file) {
          morePhotos.detach();
          if (
            myDropzone.files.length > myDropzone.options.maxFiles &&
            typeof self !== "undefined" &&
            self !== null
          ) {
            $(file).each(function (i) {
              if (maxFilesAllowed + 1 > i >= self.serverImg().length) {
                myDropzone.cancelUpload(this);
                myDropzone.removeFile(this);
              }
            });
          }
          if (myDropzone.options.maxFiles > 0)
            myDropzone.options.maxFiles -= file.length;
          if (
            myDropzone.files.length > 0 &&
            myDropzone.files.length < maxFilesAllowed + 1
          ) {
            morePhotos.attach();
          } else {
            morePhotos.detach();
          }
        });

        this.on("queuecomplete", function (file) {});
      },
    });
  }
  function initSinglePhotoUpload() {
    var maxFilesAllowed = 1;
    $(".option-list__item").dropzone({
      maxFilesize: 8,
      maxFiles: maxFilesAllowed,
      previewTemplate: dropzoneTemplate.html(),
      addRemoveLinks: true,
      acceptedFiles: ".png, .jpg, .jpeg, .gif",
      url: "/sell-used-car/api/stocks/images/validate/",
      dictFileTooBig: "Max image size 8MB",
      dictMaxFilesExceeded: "Upload limit reached",
      init: function () {
        var myDropzone = this;

        var imageType = $(myDropzone.element).attr("data-id");
        if (typeof uploadedImages != "undefined" && uploadedImages[imageType]) {
          var uF = { name: "name", size: 12345 }; // mock file used to show previef of already uploaded images
          myDropzone.files.push(uF);
          myDropzone.emit("addedfile", uF);
          myDropzone.emit("thumbnail", uF, uploadedImages[imageType].imageUrl);
          myDropzone.createThumbnailFromUrl(
            uF,
            uploadedImages[imageType].imageUrl
          );
          myDropzone.emit("complete", uF);
          $(myDropzone.files[0].previewElement)
            .addClass("dz-success")
            .find("#spinner-content")
            .hide();
          $(myDropzone.files[0].previewElement)
            .addClass("dz-success")
            .find(".dz-success-mark")
            .hide();
          $(myDropzone.files[0].previewElement)
            .find(".dz-remove")
            .attr("photoid", uploadedImages[imageType].photoId);
          myDropzone.options.maxFiles -= 1;
          previousUploadedImages++;
        }
        if (myDropzone.files.length < maxFilesAllowed) {
          categoryPhotos.attach(myDropzone);
        } else {
          categoryPhotos.detach(myDropzone);
        }

        this.on("sending", function (file) {
          $(file.previewElement).find("#spinner-content").hide();
        });

        this.on("removedfile", function (file) {
          if (myDropzone.options.maxFiles < maxFilesAllowed) {
            ++myDropzone.options.maxFiles;
          }
          if (!$(myDropzone.element).attr("data-id").localeCompare("6")) {
            self.removeRCPhoto($(file._removeLink).attr("photoid"));
          } else {
            self.removePhoto($(file._removeLink).attr("photoid"));
          }
          categoryPhotos.attach(myDropzone);
        });

        this.on("success", function (file, response) {
          if (this.files.length > 1) {
            this.removeFile(this.files[0]);
          }
          if (response) {
            setRemoveLinkUrlList(file, response);
          }
        });

        this.on("error", function (file, response) {
          if (myDropzone.files.length < maxFilesAllowed) {
            categoryPhotos.attach(myDropzone);
          } else {
            categoryPhotos.detach(myDropzone);
          }

          $(file.previewElement).find("#spinner-content").hide();
          if (file.xhr && file.xhr.status === 0)
            $(file.previewElement)
              .find(".dz-error-message")
              .text("You're offline.");
          else $(file.previewElement).find(".dz-error-message").text(response);
          $(file.previewElement)
            .find(".dz-error-mark")
            .on("click", function () {
              myDropzone.removeFile(file);
              categoryPhotos.attach(myDropzone);
              myDropzone.addFile(file);
            });
        });

        this.on("maxfilesexceeded", function (file) {
          $(file.previewElement)
            .find(".dz-error-message")
            .text("Upload limit reached");
        });

        this.on("addedfiles", function (file) {
          categoryPhotos.detach(myDropzone);
          if (myDropzone.files.length > maxFilesAllowed + 1) {
          }
          if (myDropzone.options.maxFiles > 0)
            myDropzone.options.maxFiles -= file.length;
          if (myDropzone.files.length < maxFilesAllowed) {
            categoryPhotos.attach(myDropzone);
          } else {
            categoryPhotos.detach(myDropzone);
          }
        });

        this.on("drop", function (file) {
          categoryPhotos.detach(myDropzone);
          if (myDropzone.files.length > myDropzone.options.maxFiles) {
          }
          if (myDropzone.options.maxFiles > 0)
            myDropzone.options.maxFiles -= file.length;
          if (myDropzone.files.length < maxFilesAllowed) {
            categoryPhotos.attach(myDropzone);
          } else {
            categoryPhotos.detach(myDropzone);
          }
        });
      },
    });
  }

  function submitImages() {
    const encryptedId = encodeURIComponent($.cookie("SellInquiry"));
    if(encryptedId)
    {
      var settings = {
        url:
          "/api/used/sell/carimages/?encryptedid=" +
          encryptedId,
        type: "POST",
        headers: { ServerDomain: "CarWale" },
      };
      $.ajax(settings)
        .done(function (response, msg, xhr) {
          if (typeof clientCache !== "undefined") {
            var localObj = { key: "congratsSlug", value: { id: 1 } };
            clientCache.set(localObj, true);
          }
          window.location.href =
            "/sell-used-car/myaccount/manage/" +
            "?type=2&value=" +
            inquiryId +
            "&isredirect=true&authtoken=" +
            ($.cookie("encryptedAuthToken")
              ? $.cookie("encryptedAuthToken")
              : "");
        })
        .fail(function (xhr) {
          editCarCommon.showModalJson(xhr.responseText);
        });
      trackChangeInImages();
    }
  }
  //Function for fixing buttons
  function fixButton() {
    $(document)
      .find(".extraDivHt")
      .height($(".floating-container").outerHeight());
    setButtonsScroll();
  }
  //Function for scrolling buttons
  function setButtonsScroll() {
    var scrollPosition =
      window.pageYOffset !== undefined
        ? window.pageYOffset
        : (
            document.documentElement ||
            document.body.parentNode ||
            document.body
          ).scrollTop;
    if (
      scrollPosition + $(window).height() >
      $("body").height() - $("footer").height()
    ) {
      $(".extraDivHt").hide();
      $(".floating-container").removeClass("float-fixed").addClass("float");
    } else {
      $(".extraDivHt").show();
      $(".floating-container").removeClass("float").addClass("float-fixed");
    }
  }

  return {};
})();

$(document).ready(function () {
  var authCookie = document.cookie.match(/encryptedAuthToken/g);
  if (authCookie && authCookie.length > 1) {
    document.cookie =
      "encryptedAuthToken" +
      "=; expires=Thu, 01-Jan-70 00:00:01 GMT;path=/used/mylistings;domain=" +
      document.domain;
    document.cookie =
      "encryptedAuthToken" +
      "=; expires=Thu, 01-Jan-70 00:00:01 GMT;path=/used/mylistings;domain=" +
      document.domain.substring(document.domain.indexOf("."));
  }
  events.publish(
    "domready",
    typeof uploadedImages != "undefined" ? uploadedImages : ""
  );
});
