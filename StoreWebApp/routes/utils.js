exports.isValid = function(thing) {
  return (typeof thing !== 'undefined' || thing != null);
};

exports.isValidString = function(thing) {
  return (exports.isValid(thing) && typeof thing === 'string' && thing !== "");
};

exports.getProtocol = function (protocol) {
  return exports.isValidString(protocol) ? protocol : "http";
}