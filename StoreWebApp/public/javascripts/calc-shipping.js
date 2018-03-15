(function (window, document) {

  var xhttp_getShippingRates = new XMLHttpRequest();
  var xhttp_getStoreLocation = new XMLHttpRequest();

  var zip_code = document.getElementById('cs_zip_code');
  var submit_bttn = document.getElementById('cs_submit');
  var shipping_info_section = document.getElementById('shipping-info-section');

  submit_bttn.onclick = function () {
    shipping_info_section.innerHTML = "<div class='pure-g'>" +
      "<div class='pure-u-1' id='ship-rates'></div>" +
      "<div class='pure-u-1' id='local-store'></div>" +
      "</div>";

    xhttp_getShippingRates.onreadystatechange = function () {
      if (xhttp_getShippingRates.readyState == 4 && xhttp_getShippingRates.status == 200) {
        var ship_rates_section = document.getElementById('ship-rates');
        var ship_rates = JSON.parse(xhttp_getShippingRates.responseText);
        console.log("Shipping result" + ship_rates);
        
        ship_rates_section.innerHTML = "<div class='pure-g'>" +
          "<div class='pure-u-1'>" +
          "<div class='pure-u-1-3'>XYZ</div>" +
          "<div class='pure-u-2-3'>" +
          "<div class='pure-u-1-2'>Next Day</div><div class='pure-u-1-2'>$" + ship_rates.xyz.next_day + "</div>" +
          "<div class='pure-u-1-2'>Two Day</div><div class='pure-u-1-2'>$" + ship_rates.xyz.two_day + "</div>" +
          "<div class='pure-u-1-2'>Ground</div><div class='pure-u-1-2'>$" + ship_rates.xyz.ground + "</div>" +
          "</div>" +
          "</div>" +
          "<div class='pure-u-1'><hr></div>" +
          "<div class='pure-u-1'>" +
          "<div class='pure-u-1-3'>CEK</div>" +
          "<div class='pure-u-2-3'>" +
          "<div class='pure-u-1-2'>Next Day</div><div class='pure-u-1-2'>$" + ship_rates.cek.next_day + "</div>" +
          "<div class='pure-u-1-2'>Two Day</div><div class='pure-u-1-2'>$" + ship_rates.cek.two_day + "</div>" +
          "<div class='pure-u-1-2'>Ground</div><div class='pure-u-1-2'>$" + ship_rates.cek.ground + "</div>" +
          "</div>" +
          "</div>" +
          "</div>";
      }
    };

  /*  xhttp_getStoreLocation.onreadystatechange = function () {
      if (xhttp_getStoreLocation.readyState == 4 && xhttp_getStoreLocation.status == 200) {
        var local_store_section = document.getElementById('local-store');
        var stores = JSON.parse(xhttp_getStoreLocation.responseText);

        local_store_section.innerHTML = "<div class='pure-g'>" +
          "<div class='pure-u-1'><hr></div>" +
          "<div class='pure-u-1'>" +
          "<a target='_blank' href='" + stores.google_maps_link + "' class='get-financing-link'>Pickup from nearest store</a>" +
          "</div>" +
          "</div>";
      }
    }; */

    xhttp_getShippingRates.open("GET", "/logistics/shipping/" + zip_code.value, true);
    xhttp_getShippingRates.send();

    //xhttp_getStoreLocation.open("GET", "/logistics/stores/" + zip_code.value, true);
    //xhttp_getStoreLocation.send();
  };

}
(this, this.document));
