(function (window, document) {

  var filter = document.getElementById('filter');
  var query = window.location.search.slice(15);

  filter.onchange = function () {
    window.location.assign("/inventory?" + filter.value);
  };

  switch (query) {
    case "price%20ASC":
      filter.options[1].selected = true;
      break;
    case "price%20DESC":
      filter.options[2].selected = true;
      break;
    case "rating%20ASC":
      filter.options[3].selected = true;
      break;
    case "rating%20DESC":
      filter.options[4].selected = true;
      break;
    default:
      filter.options[0].selected = true;
  }
}
(this, this.document));