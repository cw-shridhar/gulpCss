function getVersions(id) {
  console.log(id);
  var url = "/api/v3/versions/";
  var qs = "?modelId=" + id + "&type=new&itemIds=29,26&application=1";
  $.ajax({
    url: url + qs,
    type: "get",
    contentType: "application/json",
    headers: { 'ServerDomain': 'CarWale' },
    success: function (data) {
      console.log("success");
      console.log(data);
    },
    error: function (response, status) {
      console.log(response);
    },
  });
}
