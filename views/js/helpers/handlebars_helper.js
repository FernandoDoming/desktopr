const Handlebars = require('handlebars');

Handlebars.registerHelper('if_eq', function(a, b, opts) {
    if(a == b) {
      return opts.fn(this);
    } else {
      return opts.inverse(this);
    }
});

Handlebars.registerHelper("debug", function(optionalValue) {
  console.log("Current Context");
  console.log("====================");
  console.log(this);

  if (optionalValue) {
    console.log("Value");
    console.log("====================");
    console.log(optionalValue);
  }
});