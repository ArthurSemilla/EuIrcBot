exports.command = "drink";

base = [
"Root Beer",
"Coke",
"Dr. Pepper",
"Sprite",
"Powerade",
"Lemonade",
"Fruit Punch",
"Limeade"
]

mods = [
"Cherry",
"Strawberry",
"Cranberry"
]

module.exports.init = function(b)
{
  bot = b;
  bot.readDataFile("options.json", function(err, data)
  {
    if(err) 
    {
      console.log("Error opening options file.");
      options = {};
    }
    else
    {
      try
      {
        options = JSON.parse(data);
      }
      catch(ex)
      {
        console.log("Corrupted options.json file. Defaulting to blank...");
        options = {};
      }
    }
  });
};

rand = function(arr)
{
  return arr[Math.floor(Math.random() * arr.length)];
}

drinkgen = function()
{
  var pre = (rand % 2 ? "Diet" : "");
  return pre + ' ' + rand(base) + ' ' + rand(noun);
}

exports.run = function(r, p, reply)
{
  var drink = '';
  if(p.length > 0)
  {
    drink = drink + p.join(', ') + ': ';
  }
}