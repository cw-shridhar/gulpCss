var carImages = (function () {
  var container,
    dropzoneTemplate,
    otherImages,
    carImagesData = {};

  if (typeof events !== "undefined") {
    events.subscribe("carImageLoaded", setSelectors);
    events.subscribe("carImageLoaded", registerDomEvents);
    events.subscribe("carImageLoaded", carImagesLoadHandler);
    events.subscribe("setImageScreen", setImageScreen);
    events.subscribe("navigateAwayImages", navigateAwayImages);
  }

  function navigateAwayImages() {
    parentContainer.setLoadingScreen();
    events.publish("navigateAway", { container: container });
  }

  function setSelectors() {
    container = $("#formCarImage");
    dropzoneTemplate = $("#dropzoneTemplate");
    otherImages = $("#add-photos-dropzone");
  }

  function registerDomEvents() {
    Dropzone.autoDiscover = false;

    $(container).on("click", ".list-item__upload-icon", function () {
      sellCarTracking.forMobile(
        "images",
        "Sell Car|" + cityForm.getCityData().cityName
      );
      $(this).closest("li").find(".dz-default").trigger("click");
    });

    $(container).on("click", "#add-more-photos", function () {
      sellCarTracking.forMobile(
        "images",
        "Sell Car|" + cityForm.getCityData().cityName
      );
      $("#add-photos-dropzone").trigger("click");
    });

    initPhotoUpload();
    initSinglePhotoUpload();
  }

  function setImageScreen() {
    if (!modalPopup.closeActiveModalPopup()) {
      $("#formContainer").show();
      container.show();
      $("#formCarCondition").hide();
      parentContainer.setNavigationTab("formCarImage");
      parentContainer.setButtonTarget(
        "history.back()",
        "carImages.submitImages()"
      );
    }
  }

  function carImagesLoadHandler(eventObj) {
    $("body").removeClass("insurance-form-active");

    parentContainer.removeLoadingScreen();
    parentContainer.setNavigationTab("formCarImage");
    parentContainer.setButtonTarget(
      "history.back()",
      "carImages.submitImages()"
    );

    if (eventObj && eventObj.data)
      carImagesData = appState.setSelectedData(carImagesData, eventObj.data);
  }

  function getCarImagesDataObj() {
    return carImagesData;
  }

  function getSelectedData(obj, prop) {
    if (obj.hasOwnProperty(prop)) {
      return obj[prop];
    }
    return null;
  }

  function getCarImagesDataProp(prop) {
    return getSelectedData(carImagesData, prop);
  }

  var self = this;

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
    dropzoneDiv: $("#add-photos-dropzone"),

    addPhotosTemplate:
      '<div id="add-more-photos" class="dz-preview"><span class="more-icon">+</span></div>',

    attach: function () {
      var addPhotosDiv;
      if (!$("#add-photos-dropzone").hasClass("dz-under-limit")) {
        $("#add-photos-dropzone").find("#add-more-photos").remove();

        $("#add-photos-dropzone")
          .addClass("dz-under-limit")
          .append(morePhotos.addPhotosTemplate);
      }
    },

    detach: function () {
      if ($("#add-photos-dropzone").hasClass("dz-under-limit")) {
        $("#add-photos-dropzone").removeClass("dz-under-limit");
        $("#add-photos-dropzone").find("#add-more-photos").remove();
      }
    },
  };

  self.serverImg = ko.observableArray([]);

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
            if (xhr && xhr.status == 4) {
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

  self.removeRCPhoto = function removeUploadedRCPhoto(photoId) {
    var isSuccess = false;
    if (photoId) {
      try {
        $.ajax({
          type: "DELETE",
          url: "/api/stockregistrationcertificates/",
          contentType: "application/json",
          dataType: "json",
          data: JSON.stringify(photoId),
          complete: function (xhr, ajaxOptions, thrownError) {
            if (xhr && xhr.status == 4) {
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

  function initPhotoUpload() {
    var maxFilesAllowed =
      $.cookie("_abtest") && $.cookie("_abtest") % 4 != 0 ? 9 : 1000;
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

        $(self.serverImg()).each(function (i) {
          var uF = { name: "name", size: 12345 }; //this.id
          myDropzone.files.push(uF);
          myDropzone.emit("addedfile", uF);
          myDropzone.emit("thumbnail", uF, this.imageUrl);
          myDropzone.createThumbnailFromUrl(uF, this.imageUrl);
          myDropzone.emit("complete", uF);
          setProfilePhoto();
          $(myDropzone.files[i].previewElement)
            .addClass("dz-success")
            .find("#spinner-content")
            .hide();
          $(myDropzone.files[i].previewElement)
            .addClass("dz-success")
            .find(".dz-success-mark")
            .hide();
          $(myDropzone.files[i].previewElement)
            .find(".dz-remove")
            .attr("photoid", this.id);
        });
        myDropzone.options.maxFiles -= self.serverImg().length;
        if (
          myDropzone.files.length > 0 &&
          myDropzone.files.length < maxFilesAllowed
        ) {
          morePhotos.attach();
        } else {
          morePhotos.detach();
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
          if (file.xhr && file.xhr.status == 0)
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
          if (myDropzone.files.length > maxFilesAllowed) {
            $(file).each(function (i) {
              if (i >= maxFilesAllowed + 1 - self.serverImg().length) {
                myDropzone.cancelUpload(this);
                myDropzone.removeFile(this);
              }
            });
          }
          if (myDropzone.options.maxFiles > 0) {
            //myDropzone.options.maxFiles -= file.length;
          }
          if (
            myDropzone.files.length > 0 &&
            myDropzone.files.length < maxFilesAllowed + 1
          ) {
            morePhotos.attach();
          } else {
            morePhotos.detach();
          }
          $.each(myDropzone.getQueuedFiles(), function (index) {
            //trigger GA
          });
        });

        this.on("drop", function (file) {
          morePhotos.detach();
          if (myDropzone.files.length > myDropzone.options.maxFiles) {
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
          if (file.xhr && file.xhr.status == 0)
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
          $.each(myDropzone.getQueuedFiles(), function (index) {
            //trigger GA
          });
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

        this.on("queuecomplete", function (file) {
          // setProfilePhoto();
        });
      },
    });
  }

  function submitImages() {
    const encryptedId = encodeURIComponent($.cookie("SellInquiry"));
    if(encryptedId)
    {
      parentContainer.setLoadingScreen();
      var settings = {
        url:
          "/api/used/sell/carimages/?encryptedid=" +
          encryptedId,
        type: "POST",
        headers: { ServerDomain: "CarWale" },
      };
      $.ajax(settings)
        .done(function (response, msg, xhr) {
          events.publish("navigateAway", { container: container });
        })
        .fail(function (xhr) {
          parentContainer.removeLoadingScreen();
          modalPopup.showModal(xhr.responseText);
        });
    }
  }

  return {
    getCarImagesDataObj: getCarImagesDataObj,
    getCarImagesDataProp: getCarImagesDataProp,
    setImageScreen: setImageScreen,
    submitImages: submitImages,
  };
})();
