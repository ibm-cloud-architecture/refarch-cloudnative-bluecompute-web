(function (window, document) {

  var xhttp_getFinancing = new XMLHttpRequest();

  var item_price = document.getElementById('item-price').innerHTML;
  var financing_section = document.getElementById('financing-section');
  var financing_link = document.getElementById('financing-link');

  /* Temporary Workaround */
  function calculatePayment (apr, amount, term) {
    var P = amount;
    var N = term;
    var J = apr / 100;
    J /= 12;
    var K = 1 / (Math.pow(1 + J, N));
    var quote = P * (J / (1 - K));
    var monthlyPaymentAmount = Math.round(quote * 100) / 100;
    return monthlyPaymentAmount;
  }
  
  financing_link.onclick = function () {
    financing_section.innerHTML = "";
    item_price = item_price.replace("<p>$", "");
    item_price = item_price.replace("</p>", "");
    var paymentAmount;

    xhttp_getFinancing.onreadystatechange = function () {
    if (xhttp_getFinancing.readyState == 4 && xhttp_getFinancing.status == 200) {
      var financing = JSON.parse(xhttp_getFinancing.responseText);
      var soapEnv = financing['soapenv:Envelope'];
      var soapBody = soapEnv['soapenv:Body'];

      // Sometimes APIC is flaky about what it responds, check what we got back from the API call
      var financingRequest = soapBody['ser:financingRequest'];
      var financingResult = soapBody['ser:financingResult'];

      if (typeof financingResult != 'undefined') {
        paymentAmount = financingResult['ser:paymentAmount'].$;
      } else {
        paymentAmount = calculatePayment(financingRequest['ser:rate'].$,financingRequest['ser:amount'].$,financingRequest['ser:duration'].$);
      }

      financing_section.innerHTML = "<div class='pure-g'>" +
        "<div class='pure-u-1'>Monthly Payment: $" +
        paymentAmount + " at 3.9% for 24 months" +
        "</div>" +
        "</div>";
      }
    };

    xhttp_getFinancing.open("GET", "/financing/calculate/" + item_price, true);
    xhttp_getFinancing.send();
  };

}
(this, this.document));