var mathjs = require('mathjs');
var RC = require('regex-chain');

var bot = null;
var mathParser = mathjs.parser();

function MathScopeEval(str) {
  try {
    return mathParser.eval(str);
  } catch(ex) {
    return null;
  }
}

var REEscape = function(s) {
      return s.replace(/[\-\/\\^\$\*\+\?\.\(\)\|\[\]{}]/g, '\\$&');
};

// custom symbols
mathjs.epsilon = 8.854187817*Math.pow(10,-12);
mathjs.k = 8.987551787368*Math.pow(10,9);

var mathKeysToGet = Object.getOwnPropertyNames(mathjs);
var mathItems = {};
for(var i=0;i<mathKeysToGet.length;i++) {
  mathItems[mathKeysToGet[i]] = mathjs[mathKeysToGet[i]];
}

//
// INPUT FULTERS
// 
var mathKeys = Object.keys(mathItems);
var mathSymbols = ".,*+-/()%=";

var onlySymbols = new RC("^[\\s" + REEscape(mathSymbols) + "]*$");
var onlyNumbers = new RC(/^[\.\s\d]*$/);
var onlyKeys = new RC("^((" + mathKeys.join(")|(") + "))+$");
var onlyTime = new RC(/^(:?[0-9]+:?)+$/);
var onlyQuote = new RC(/^".+"$/);
var funnyFractions = new RC(/^(([0-9][0]?|11)\s*\/\s*(10|5|100))$/);
var plusN = new RC(/^\++\d+$/);

var ignoreRe = onlySymbols.or(onlyNumbers).or(funnyFractions).or(onlyKeys).or(plusN)
               .or(onlyQuote).or(onlyTime);

//
// OUTPUT FILTERS
//
var javascript = new RC("function|{|}|return|arguments|length"); // This is by no means "good"

module.exports.init = function(b) {
  bot = b;
}

module.exports.msg = function(text, from, reply, raw) {
  text = text.trim();

  if(ignoreRe.test(text)) {
    return;
  }

  var res = MathScopeEval(text);

  if(res == null) {
    return;
  }

  res = res.toString();

  var resclean = res.replace(/\s/g, '');
  var textclean = text.replace(/\s/g, '');

  // If res parrots our input, filter it
  if( res == text || resclean == text || res == textclean 
      || resclean == textclean ) {
    return;
  }

  // If the response is javascript
  if(javascript.test(res)) {
    return;
  }

  // Truncate our responses (reckless-irc-exec)
  if(res.length < 400) {
    reply(res);
  }
  else {
    reply(res.substring(0,396) + " ...");
    bot.sayTo(from, 'All of your command output: ' + res);
  }
};

module.exports.command = "reset";

module.exports.run_reset = function(remainder, parts, reply) {
  // Create a new scope
  mathParser = mathjs.parser();
  reply("Parser reinitialized");
};

