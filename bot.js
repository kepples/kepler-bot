//This keeps your app running.
//You should also use an external service to ping your project. Glitch suggests uptimerobot.com
//To start the bot, go to watch.json and set the throttle to 0        
const http = require('http');
const express = require('express');
const app = express();
var server = require('http').createServer(app);
app.get("/", (request, response) => {
  console.log(Date.now() + " Ping Received");
  response.sendStatus(200);
});
const listener = server.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 280000);

//Your bot code goes down here 👇
const Commando = require('discord.js'); //there is no commando
const fs = require('fs');
const bot = new Commando.Client({commandPrefix: 'kb!'});
const TOKEN = process.env.TOKEN;
const DBL = require('dblapi.js');
const dbl = new DBL(process.env.DBLTOKEN, { webhookServer: server, webhookAuth: 'authorkeplerbot' }, bot);
const profanities = require("profanities");

/** BIG VARIABLES */
var maintenance = false;
var version = "1.7.3";
var waittime = 3000;
var regentime = 180000;
var lastmultiregen = 0;

/** SIMPLE COMMANDS */
//Universal Variables:
var dice = [
    "<:dice1:550358709251866642>",
    "<:dice2:550358709348466709>",
    "<:dice3:550358709633810436>",
    "<:dice4:550358709415706635>",
    "<:dice5:550358709466038273>",
    "<:dice6:550358709545730069>",
];
var coins = ["<:Heads:553050199350706176>", "<:Tails:553050202085523468>"];
var Message = function(t, m, message, c){
  c = c || "22ff88";
  let embed = new Commando.RichEmbed()
        .setAuthor(bot.user.username, bot.user.avatarURL)
        .setTitle(t)
        .setDescription(m)
        .setColor(c)
        .setFooter(`Requested by ${message.author.username}`, message.author.displayAvatarURL);
        //.setTimestamp();

    message.channel.send(embed);
};
//Functions
/*var CoinFlipCommand = function(message){
    var chance = Math.floor(Math.random()*2);
    if(chance == 0){
      Message("Coin", "It landed on Heads! " + coins[0], message, "888888");
    }
    else if(chance == 1){
      Message("Coin", "It landed on Tails! " + coins[1], message, "888888");
    }
};
var DiceRollCommand = function(message){
    var chance = 1 + Math.floor(Math.random()*6);
    Message("Dice", "The dice rolled a " + chance + "!" + "  " + dice[chance-1], message, "bbbbbb");
    //message.channel.send("The dice rolled a " + chance + "!" + "  " + dice[chance-1]);
};
var PickFromCommand = function(message, args){
    var num = Math.floor(args[0]);
    var chance = Math.floor(Math.random()*num);
    //message.reply("The number I have chosen is " + chance);
    Message("Pickfrom", "The number I have chosen is " + chance, message, "bbbbbb");
};
*/
/** OTHER COMMANDS */
//Variables
var Helps = [
    {
        name: "kb!mine [dir] or kb!m [dir]",
        values: "dir: right, left, up or down, can use single letters as well",
        d: "Mines a block in the direction said with your pickaxe",
    },
    {
        name: "kb!inv or kb!inventory",
        values: "none",
        d: "Checks your inventory",
    },
    {
        name: "kb!regenland or kb!rl",
        values: "none",
        d: "Regenrates your land!",
    },
    {
        name: "kb!backup",
        values: "none",
        d: "Backups the user data",
    },
    {
        name: "kb!arena",
        values: "many",
        d: "Create an arena, view a list, delete existing ones or join an arena! do kb!arena to see more!",
    },
    {
        name: "kb!craft <pickaxe name or id>",
        values: "none",
        d: "Crafts a pickaxe, requires 60 of a material.",
    },
    {
        name: "kb!multimine [dir/recreate] or kb!mm [dir/recreate]",
        values: "dir: right, left, up or down, can use single letters as well\nrecreate: recreate, creates a new multiplayer land",
        d: "Mines a block in the direction said with your pickaxe in a multiplayer arena",
    },
    {
        name: "kb!top or kb!toplist",
        values: "none",
        d: "Top 10 users sorted by xp",
    },
    {
        name: "kb!pickaxe <pickaxe id>",
        values: "none",
        d: "Switches your pickaxe to the one selected!",
    },
    {
        name: "kb!crate [common:uncommon:rare:legendary]",
        values: "none",
        d: "Look at your crates or open a crate!",
    },
    {
        name: "kb!shop <cooldown:enchant> [id]",
        values: "cooldown:enchant is the store, and id which is optional, is the item you want to buy",
        d: "Go to the shop and buy stuffs",
    },
    {
        name: "kb!enchant",
        values: "none",
        d: "Look at your enchantments",
    },
    {
        name: "kb!trade",
        values: "plenty, do the command to see how to use it ;)",
        d: "Trade with a person.",
    },
    {
        name: "kb!give",
        values: "plenty, do the command to see how to use it ;)",
        d: "Give a person some material",
    },
    {
        name: "kb!dim <overworld/nether>",
        values: "none",
        d: "Go to a different dimension!",
    },
    {
        name: "kb!villager",
        values: "none",
        d: "The prices of each item",
    },
    {
        name: "kb!invest <item> <amt>",
        values: "item: the item which could be stone, iron etc. amt: the amount you want to put in.",
        d: "The item you want to invest in exchange for emeralds",
    },
    {
        name: "kb!buy <ems> <item>",
        values: "item: the item you want back. ems: the amount of ems you want to use for this task.",
        d: "Exchange your ems for items!",
    },
    {
        name: "kb!value",
        values: "none",
        d: "The Value of One Emerald.",
    },
    {
        name: "kb!about",
        values: "none",
        d: "Info on the kepler bot!",
    },
    {
        name: "kb!invite",
        values: "none",
        d: "Invite the Kepler Miner to your server!",
    },
    {
        name: "kb!server",
        values: "none",
        d: "Invite link for The Kepler Miner Official Server!",
    },
    {
        name: "kb!stats",
        values: "none",
        d: "Stats on The Kepler Miner!",
    },
    {
        name: "kb!vote",
        values: "none",
        d: "Vote for the Kepler Miner and get crates!",
    },
    {
        name: "kb!help [page]",
        values: "none",
        d: "This exact command, known as the help command!",
    },
];

//Functions
var AboutCommand = function(message){
    Message("About The Kepler Miner: ", "Created and Developed by: KeplerTeddy#1138\nDevelopers: ! FireBobb !#9999 and CodeCypher#1337\nHelpers: spongejr#5845\nVersion: " + version + "\nProgramming Language: Node.js + Discord.js\nHosting: glitch.comm", message);
};

var HelpCommand = function(message, args){
    
    var fn = "";
    var page = 0 || (Math.floor(args[0])-1);
    if(page < 0 || page > Math.floor(Helps.length/5)){
        page = 0;
    }
    var maxx = (page*5)+5;
    //fn +="Page " + (page+1) + "/" + Math.floor((Helps.length/5)+1);
    if(maxx >= Helps.length){maxx=Helps.length;}
    for(var i = page*5;i < maxx;i ++){
        //console.log(i);
        fn +="\n**" + Helps[i].name + "**\nValues: " + Helps[i].values + "\nDescription: " + Helps[i].d;
    }
    fn +="\n\nIf you want to switch to another page use **\"kb!help [page number]\"**";
    Message("Help - " + "Page " + ((page+1) + "/" + Math.floor((Helps.length/5)+1)) + "\n**You may use kb!start to get started if you haven't!**", fn, message);
};
var InviteCommand = function(message){
    message.reply("\n**Invite link:**\nhttps://bit.ly/2VD18ef");
};
var VoteCommand = function(message){
  let embed = new Commando.RichEmbed()
        .setAuthor(bot.user.username, bot.user.avatarURL)
        .setTitle('Vote for The Kepler Miner!')
        .setColor("22ff88")
        .setURL('https://bit.ly/2JbLSUf')
        .setTimestamp();

    message.channel.send(embed);
};
var ServerCommand = function(message){
  let exampleEmbed = new Commando.RichEmbed()
        .setAuthor(bot.user.username, bot.user.avatarURL)
        .setTitle('KeplerBot\'s official server!')
        .setColor("22ff88")
        .setURL('https://discord.gg/SyySZ4E')
        .setTimestamp();

    message.channel.send(exampleEmbed);
};

/** KEPLER MINER COMMANDS */

///Variables
const Datas = require('./datas.json');
const rawdata = fs.readFileSync('datas.json');  
const inv = JSON.parse(rawdata);  
var Arenas = inv.Arenas;
var Invs = inv.Invs;
var cml = "";
var TopInvs = [];
for(var i = 0;i < Invs.length;i ++){
    TopInvs.push(Invs[i]);
}

var replaceInString = function(string, item, newitem){
    var finalstring = "";
    for(var i = 0;i < string.length;i ++){
        if(i !== item){
            finalstring +=string[i];
        }
        else{
            finalstring +=newitem;
        }
    }
    return finalstring;
};
var findYourId = function(yourid){
    for(var i = 0;i < Invs.length;i ++){
        if(yourid.toString() == Invs[i].id){
            //console.log(i);
            return i;
        }
    }
    return -1;
};
var createLand = function(I, dim){
    dim = dim || 0;
    if(dim === undefined){
      dim = 0;
    }
    //pickaxe: 0 = wooden, 1 = stone, 2 = iron, 3 = diamond
    //ores: 0 = air, 1 = stone, 2 = coal, 3 = iron, 4 = gold, 5 = diamond, 6 = random ore, 7 = redstone, 8 = lapis, 9 = keplerium, a = obsidian
    //nether ores: 0 = air, 1 = netherrack, 2 = soul sand, 3 = quartz ore
    I.d = "";
    var pick = I.pick;
    for(var i = 0;i < 7;i ++){
        for(var j = 0;j < 7;j ++){
            var mathrandom = Math.random()*10;
            if(dim === 0){
              if(pick == 0){
                  if(mathrandom >= 9-(I.en.luck*0.25)){
                      I.d += "2";
                  }
                  else if(mathrandom >= -1){
                      I.d += "1";
                  }
              }
              else if(pick == 1){
                  if(mathrandom >= 9-(I.en.luck*0.15)){
                      I.d += "3";
                  }
                  else if(mathrandom >= 7-(I.en.luck*0.2)){
                      I.d += "2";
                  }
                  else if(mathrandom >= -1){
                      I.d += "1";
                  }
              }
              else if(pick == 2){
                  if(mathrandom >= 9.6-(I.en.luck*0.07)){
                      I.d += "5";
                  }
                  else if(mathrandom >= 9-(I.en.luck*0.1)){
                      I.d += "4";
                  }
                  else if(mathrandom >= 8-(I.en.luck*0.1)){
                      I.d += "3";
                  }
                  else if(mathrandom >= 6.5-(I.en.luck*0.12)){
                      I.d += "2";
                  }
                  else if(mathrandom >= -1){
                      I.d += "1";
                  }
              }
              else if(pick == 3){
                  if(mathrandom >= 9.992-(I.en.luck*0.002)){
                      I.d += "9";
                  }
                  else if(mathrandom >= 9.9-(I.en.luck*0.002)){
                      I.d += "a";
                  }
                  else if(mathrandom >= 9.8-(I.en.luck*0.05)){
                      I.d += "6";
                  }
                  else if(mathrandom >= 9.6-(I.en.luck*0.1)){
                      I.d += "5";
                  }
                  else if(mathrandom >= 8.9-(I.en.luck*0.11)){
                      I.d += "4";
                  }
                  else if(mathrandom >= 7.8-(I.en.luck*0.12)){
                      I.d += "3";
                  }
                  else if(mathrandom >= 6.4-(I.en.luck*0.13)){
                      I.d += "2";
                  }
                  else if(mathrandom >= -1){
                      I.d += "1";
                  }
              }
              else if(pick == 4){ //voter pick
                  if(mathrandom >= 9.989-(I.en.luck*0.003)){
                      I.d += "9";
                  }
                  if(mathrandom >= 9.85-(I.en.luck*0.05)){
                      I.d += "6";
                  }
                  else if(mathrandom >= 9.3-(I.en.luck*0.1)){
                      I.d += "5";
                  }
                  else if(mathrandom >= 8.7-(I.en.luck*0.11)){
                      I.d += "4";
                  }
                  else if(mathrandom >= 7.7-(I.en.luck*0.12)){
                      I.d += "3";
                  }
                  else if(mathrandom >= 6.3-(I.en.luck*0.13)){
                      I.d += "2";
                  }
                  else if(mathrandom >= -1){
                      I.d += "1";
                  }
              }
              else if(pick == 5){ //donator pick
                  if(mathrandom >= 9.98-(I.en.luck*0.0035)){
                      I.d += "9";
                  }
                  else if(mathrandom >= 9.8-(I.en.luck*0.08)){
                      I.d += "6";
                  }
                  else if(mathrandom >= 9.2-(I.en.luck*0.1)){
                      I.d += "5";
                  }
                  else if(mathrandom >= 8.6-(I.en.luck*0.11)){
                      I.d += "4";
                  }
                  else if(mathrandom >= 7.8-(I.en.luck*0.13)){
                      I.d += "3";
                  }
                  else if(mathrandom >= 6.5-(I.en.luck*0.13)){
                      I.d += "2";
                  }
                  else if(mathrandom >= -1){
                      I.d += "1";
                  }
              }
              else if(pick == 6){ //gold pick
                  if(mathrandom >= 9.5-(I.en.luck*0.2)){
                      I.d += "8";
                  }
                  else if(mathrandom >= 9.0-(I.en.luck*0.2)){
                      I.d += "7";
                  }
                  else if(mathrandom >= 8.5-(I.en.luck*0.12)){
                      I.d += "4";
                  }
                  else if(mathrandom >= 7.9-(I.en.luck*0.13)){
                      I.d += "3";
                  }
                  else if(mathrandom >= 6.8-(I.en.luck*0.13)){
                      I.d += "2";
                  }
                  else if(mathrandom >= -1){
                      I.d += "1";
                  }
              }
              else if(pick == 7){ //redstone pick
                  if(mathrandom >= 9.6-(I.en.luck*0.2)){
                      I.d += "8";
                  }
                  else if(mathrandom >= 9.0-(I.en.luck*0.25)){
                      I.d += "7";
                  }
                  else if(mathrandom >= 8.7-(I.en.luck*0.2)){
                      I.d += "4";
                  }
                  else if(mathrandom >= 7.9-(I.en.luck*0.11)){
                      I.d += "3";
                  }
                  else if(mathrandom >= 6.8-(I.en.luck*0.11)){
                      I.d += "2";
                  }
                  else if(mathrandom >= -1){
                      I.d += "1";
                  }
              }
              else if(pick == 8){ //lapis pick
                  if(mathrandom >= 9.4-(I.en.luck*0.25)){
                      I.d += "8";
                  }
                  else if(mathrandom >= 9.0-(I.en.luck*0.2)){
                      I.d += "7";
                  }
                  else if(mathrandom >= 8.7-(I.en.luck*0.2)){
                      I.d += "4";
                  }
                  else if(mathrandom >= 7.9-(I.en.luck*0.11)){
                      I.d += "3";
                  }
                  else if(mathrandom >= 6.8-(I.en.luck*0.11)){
                      I.d += "2";
                  }
                  else if(mathrandom >= -1){
                      I.d += "1";
                  }
              }
              else if(pick == 9){ //keplerium pick
                  if(mathrandom >= 9.9-(I.en.luck*0.01)){
                      I.d += "9";
                  }
                  else if(mathrandom >= 9.2-(I.en.luck*0.08)){
                      I.d += "8";
                  }
                  else if(mathrandom >= 8.8-(I.en.luck*0.1)){
                      I.d += "7";
                  }
                  else if(mathrandom >= 8.6-(I.en.luck*0.1)){
                      I.d += "6";
                  }
                  else if(mathrandom >= 8.4-(I.en.luck*0.1)){
                      I.d += "5";
                  }
                  else if(mathrandom >= 8-(I.en.luck*0.1)){
                      I.d += "4";
                  }
                  else if(mathrandom >= 7.5-(I.en.luck*0.1)){
                      I.d += "3";
                  }
                  else if(mathrandom >= 6.5-(I.en.luck*0.1)){
                      I.d += "2";
                  }
                  else if(mathrandom >= -1){
                      I.d += "1";
                  }
              }
            }
            if(dim === 1){
              if(pick == 3){
                    if(mathrandom >= 9-(I.en.luck*0.25)){
                        I.d += "3";
                    }
                    else if(mathrandom >= 7-(I.en.luck*0.25)){
                        I.d += "2";
                    }
                    else if(mathrandom >= -1){
                        I.d += "1";
                    }
              }
              if(pick == 4){
                    if(mathrandom >= 8.7-(I.en.luck*0.25)){
                        I.d += "3";
                    }
                    else if(mathrandom >= 6.9-(I.en.luck*0.25)){
                        I.d += "2";
                    }
                    else if(mathrandom >= -1){
                        I.d += "1";
                    }
              }
              if(pick == 5){
                    if(mathrandom >= 8.6-(I.en.luck*0.25)){
                        I.d += "3";
                    }
                    else if(mathrandom >= 6.9-(I.en.luck*0.25)){
                        I.d += "2";
                    }
                    else if(mathrandom >= -1){
                        I.d += "1";
                    }
              }
              if(pick == 9){
                    if(mathrandom >= 8.5-(I.en.luck*0.25)){
                        I.d += "3";
                    }
                    else if(mathrandom >= 6.8-(I.en.luck*0.25)){
                        I.d += "2";
                    }
                    else if(mathrandom >= -1){
                        I.d += "1";
                    }
              }
            }
        }
    }
    console.log("Created world for " + I.id);
};
var createMultiLand = function(minpick){
    //pickaxe: 0 = wooden, 1 = stone, 2 = iron, 3 = diamond
    var ml = "";
    for(var i = 0;i < 8;i ++){
        for(var j = 0;j < 8;j ++){
            var mathrandom = Math.random()*10;
            if(minpick === 0){
              if(mathrandom >= 9){
                  ml += "2";
              }
              else if(mathrandom >= -1){
                  ml += "1";
              }
            }
            if(minpick === 1){
              if(mathrandom >= 9){
                  ml += "3";
              }
              else if(mathrandom >= 7){
                  ml += "2";
              }
              else if(mathrandom >= -1){
                  ml += "1";
              }
            }
            if(minpick === 2){
              if(mathrandom >= 9.6){
                  ml += "5";
              }
              else if(mathrandom >= 9){
                  ml += "4";
              }
              else if(mathrandom >= 8){
                  ml += "3";
              }
              else if(mathrandom >= 6.5){
                  ml += "2";
              }
              else if(mathrandom >= -1){
                  ml += "1";
              }
            }
            if(minpick === 3){
              if(mathrandom >= 9.99){
                  ml += "9";
              }
              else if(mathrandom >= 9.9){
                  ml += "a";
              }
              else if(mathrandom >= 9.8){
                  ml += "6";
              }
              else if(mathrandom >= 9.6){
                  ml += "5";
              }
              else if(mathrandom >= 9){
                  ml += "4";
              }
              else if(mathrandom >= 8){
                  ml += "3";
              }
              else if(mathrandom >= 6.5){
                  ml += "2";
              }
              else if(mathrandom >= -1){
                  ml += "1";
              }
            }
        }
    }
    return ml;
    console.log("Created new multiplayer land!");
};
var findYourPlace = function(yourid){
    for(var i = 0;i < TopInvs.length;i ++){
        if(yourid.toString() == TopInvs[i].id){
            //console.log(i);
            return i;
        }
    }
    return -1;
};
var levelUp = function(I, message){
  while(I.xp >= I.level*10){
          I.xp -=I.level*10;
          I.level ++;
  }
  Message("LEVEL UP", xp + "You got to level " + I.level + "! " + xp, message, "eeee33");
};
var tokenToUser = async function(id){
    await bot.fetchUser(id.toString())
    .then(user => {
       return user;
   }).catch(error => {
       return error;
    // here you can also try log it to console
  });
};
var makeNewInventory = function(message, name, id){
  var Name = name || message.author.username.toString();
  var Id = id || message.author.id;
  Invs.push({
        pickx: 3,
        picky: 3,
        id: Id,
        d: "",
        inv:{
            stone:0,
            coal:0,
            iron:0,
            gold:0,
            diamond:0,
            redstone:0,
            lapis:0,
            keplerium:0,
            emerald: 0,
            obsidian: 0,
            netherrack: 0,
            soulsand: 0,
            quartz: 0,
        },
        pick: 0,
        level: 1,
        mp: {x:4,y:4},
        xp: 0,
        name: Name,
        lastmine: 0,
        lastregen: 0,
        picks: [true, false, false, false, false, false, false, false, false, false],
        crates: [0, 0, 0, 0],
        en: {
            cooldown: 0,
            fortune: 0,
            luck: 0,
            xp: 0,
        },
        donator: false,
        lb: 0,
        li: 0,
        dim: 0,
        ds: 0,
        mat: 0,
        dims: [true, false],
        tut: 0,
        ar: -1,
    });
};
var addPickaxeRoles = function(message, I){
    if(message.channel.type !== 'dm' && (bot.guilds.get(message.guild.id).id).toString() === "550036987772403714"){
      /*if(message.member.roles.find(r => r.name === "Donator") && I.donator === false){
        Message("Donation! :D", "Thank you so much for your donation! I'll give you your stuff now!", message, "3366ee");
        I.pick = 5;
        I.picks[5] = true;
        I.donator = true;
        I.crates[3] ++;
      }*/
      if(I.pick == 0){
          var role = message.guild.roles.find(role => role.name === "Wooden Pickaxe");
          message.member.addRole(role);
      }
      if(I.pick == 1){
          var role = message.guild.roles.find(role => role.name === "Stone Pickaxe");
          message.member.addRole(role);
      }
      if(I.pick == 2){
          var role = message.guild.roles.find(role => role.name === "Iron Pickaxe");
          message.member.addRole(role);
      }
      if(I.pick == 3){
          var role = message.guild.roles.find(role => role.name === "Diamond Pickaxe");
          message.member.addRole(role);
      }
      if(I.level >= 5){
          var role = message.guild.roles.find(role => role.name === "Level 5");
          message.member.addRole(role);
      }
      if(I.level >= 10){
          var role = message.guild.roles.find(role => role.name === "Level 10");
          message.member.addRole(role);
      }
      if(I.level >= 25){
          var role = message.guild.roles.find(role => role.name === "Level 25");
          message.member.addRole(role);
      }
      if(I.level >= 50){
          var role = message.guild.roles.find(role => role.name === "Level 50");
          message.member.addRole(role);
      }
      if(I.level >= 100){
          var role = message.guild.roles.find(role => role.name === "Level 100");
          message.member.addRole(role);
      }
    }
};
var updateInventory = function(I){
  if(I.tut === undefined){
    I.tut = -1;
  }
  if(I.lastregen === undefined){
    I.lastregen = 0;
  }
  if(I.picks === undefined){
    var pickss = [];
    for(var i = 0;i < pickaxes.length;i ++){
      if(i > I.pick){
        pickss.push(false);
      }
      else{
        pickss.push(true);
      }
    }
    I.picks = pickss;
    console.log(I.id + " updated to 1.2!: " + pickss);
  }
  if(I.picks.length < pickaxes.length){
    var IP = pickaxes.length-I.picks.length;
    for(var i = 0;i < IP;i ++){
      I.picks.push(false);
    }
    console.log(IP + " More Pickaxes Added for " + I.id);
  }
  if(I.inv.redstone === undefined){
    I.inv.redstone = 0;
    I.inv.lapis = 0;
    I.inv.keplerium = 0;
    console.log("More Ores Added for " + I.id);
  }
  if(I.en === undefined){
    I.en = {
        cooldown: 0,
        fortune: 0,
        luck: 0,
        xp: 0,
    };
    console.log(I.id + " Just got enchantments!");
  }
  if(I.crates === undefined){
    I.crates = [1, 0, 0, 0]; //common, uncommon, rare, legendary
  }
  
  if(I.donator === undefined){
    I.donator = false;
  }
  if(I.inv.emerald === undefined){
    I.inv.emerald = 0;
  }
  if(I.li === undefined){
    I.lb = 0;
    I.li = 0;
  }
  if(I.dim === undefined){
    I.dim = 0;
    I.ds = 0;
    I.mat = 0;
  }
  if(I.inv.obsidian === undefined){
    I.inv.obsidian = 0;
    I.inv.netherrack = 0;
    I.inv.soulsand = 0;
    I.inv.quartz = 0;
  }
  if(I.dims === undefined){
    I.dims = [true, false];
  }
  if(I.ar === undefined){
    I.ar = -1;
  }
};
var calcFortune = function(f, I){
  var donat = 1;
  if(I.donator){donat = 2;}
  if(f === 0){return 1*donat;}
  if(f === 1){return (1+Math.floor(Math.random()*2))*donat;}
  if(f === 2){return (1+Math.floor(Math.random()*3))*donat;}
  if(f === 3){return (2+Math.floor(Math.random()*3))*donat;}
}
var timesXpBoost = function(f, I){
  var donat = 1;
  if(I.donator){donat = 2;}
  if(f === 0){return 1*donat;}
  if(f === 1){return 1.25*donat;}
  if(f === 2){return 1.5*donat;}
  if(f === 3){return 2*donat;}
}
var ActiveTrades = [];
var checkIfTraded = function(trader1, trader2){
  for(var i = 0;i < ActiveTrades.length;i ++){
    if(ActiveTrades[i].trader1 === trader1 && ActiveTrades[i].trader2 === trader2){
      return i;
    }
    if(ActiveTrades[i].trader1 === trader2 && ActiveTrades[i].trader2 === trader1){
      return i;
    }
  }
  return -1;
};
var checkIfEnough = function(I, item, amt){
  if(item === "stone" && I.inv.stone < amt){
    return false;
  }
  if(item === "iron" && I.inv.iron < amt){
    return false;
  }
  if(item === "diamond" && I.inv.diamond < amt){
    return false;
  }
  if(item === "gold" && I.inv.gold < amt){
    return false;
  }
  if(item === "redstone" && I.inv.redstone < amt){
    return false;
  }
  if(item === "lapis" && I.inv.lapis < amt){
    return false;
  }
  if(item === "keplerium" && I.inv.keplerium < amt){
    return false;
  }
  return true;
};
var stone = "<:stone:550125781842395136>";
var iron = "<:iron:550125781859172382>";
var coal = "<:coal:550125781720891399>";
var gold = "<:gold:550738153405677578>";
var redstone = "<:redstone:550738154911432704>";
var lapis = "<:lapis:550738153896542212>";
var diamond = "<:diamond:550738152797765652>";
var keplerium = "<:keplerium:559465763875061780>";
var random = "<:random:550738153414328405>";
var emerald = "<:emerald:560531131796291594>";
var Stone = "<:Stone:516691401413623873>";
var Coal = "<:Coal:516691265149206538>";
var Iron = "<:Iron:516691326771658778>";
var Gold = "<:Gold:516691308488818708>";
var Redstone = "<:Redstone:516691397286297603>";
var Lapis = "<:Lapis:516691349832204291>";
var Diamond = "<:Diamond:516691229195501581>";
var Keplerium = "<:Keplerium:561235683746775040>";
var obsidian = "<:Obsidian:562455832046862337>";
var netherrack = "<:Netherracker:562457334303948833>";
var soulsand = "<:SoulSand:562455975940980745>";
var quartz = "<:Quartz:562455976184381440>";
var Obsidian = "<:Obby:562457507704864769>";
var Quartz = "<:QuartzDust:562457791332352002>";
var pickaxes = ["<:wp:550733904051437570>", "<:sp:550733903896379445>", "<:ip:550049621477425176>", "<:dp:550733904009625612>", "<:vp:557200040633040947>", "<:dop:557200041517776896>", "<:gp:559471812602363925>","<:rp:559446015556714536>","<:lp:559446015422496799>","<:kp:559446015665504275>"];
var air = "<:air:550335949909786625>";
var air2 = "<:Air2:562457334266331137>";
var xps = ["<:xp_0:550744679550025728>", "<:xp_1:550744679327596545>", "<:xp_2:550744679495237643>", "<:xp_3:550744679680049167>", 
        "<:xp_4:550744679776256050>", "<:xp_5:550744679830781967>", 
        "<:xp_6:550744679910473753>", "<:xp_7:550744679562608642>", "<:xp_8:550744679835107340>"];
var xp = "<:xp:550773197398736928>";
var crates = ["<:crate1:557290667135467520>", "<:crate2:557290668003688449>", "<:crate3:557290667986911250>", "<:crate4:557290669647855618>", "<:crate0:557290666883809311>"];
var emvalue = inv.emvalue || 1;
var investamt = 0;
//Functions
var count = 0;
var TutorialCommand = function(message){
    var yourarray = findYourId(message.author.id);
    if(yourarray == -1){
        makeNewInventory(message);
        yourarray = Invs.length-1;
        console.log("User " + Invs[Invs.length-1].id + " Created!");
    }
    //console.log(message.author.username.toString());
    var I = Invs[yourarray];
    updateInventory(I);
    I.tut = 0;
    Message(`Welcome there ${I.name}!`, `I will walk you thru how to use The Kepler Miner!\nGet started by typing in \`kb!mine r\``, message, "33ee33");
};
var MineCommand = function(message, args){
    count ++;
    var yourarray = findYourId(message.author.id);
    if(yourarray == -1){
        makeNewInventory(message);
        yourarray = Invs.length-1;
        console.log("User " + Invs[Invs.length-1].id + " Created!");
    }
    //console.log(message.author.username.toString());
    var I = Invs[yourarray];
  updateInventory(I);
  if(I.en.cooldown === 0)waittime = 5*1000;
  if(I.en.cooldown === 1)waittime = 4*1000;
  if(I.en.cooldown === 2)waittime = 3*1000;
  if(I.en.cooldown === 3)waittime = 2*1000;
    if(I.d == ""){createLand(I);}
    if(Date.now() > I.lastmine+waittime){
      I.lastmine = Date.now();
      if((args[0] == "right" || args[0] == "r") && I.pickx < 6){
          I.pickx ++;
      }
      if((args[0] == "left" || args[0] == "l") && I.pickx > 0){
          I.pickx --;
      }
      if((args[0] == "down" || args[0] == "d") && I.picky < 6){
          I.picky ++;
      }
      if((args[0] == "up" || args[0] == "u") && I.picky > 0){
          I.picky --;
      }
      I.name = message.author.username.toString();
      console.log(I.dim);
      var m = "";
      for(var i = 0;i < 7;i ++){
          m = m + "\n";
          for(var j = 0;j < 7;j ++){
              if(I.dim === 0){
                if(i === I.picky && j === I.pickx){
                  m +=pickaxes[I.pick];
                    if(I.d[i*7+j] == "6"){ 
                      var randit = Math.floor(Math.random()*5);
                      if(randit == 0){
                          I.inv.stone +=20;
                          message.reply("You got 20 stone!");
                      }
                      if(randit == 1){
                          I.inv.coal +=20;
                          message.reply("You got 20 coal!");
                      }
                      if(randit == 2){
                          I.inv.iron +=10;
                          message.reply("You got 10 iron!");
                      }
                      if(randit == 3){
                          I.inv.gold +=5;
                          message.reply("You got 5 gold!");
                      }
                      if(randit == 4){
                          I.inv.diamond +=5;
                          message.reply("You got 5 diamonds!");
                      }
                    }
                    if(I.d[i*7+j] == "a"){ I.inv.obsidian +=1; I.xp+=5*timesXpBoost(I.en.xp, I);}
                    if(I.d[i*7+j] == "9"){ I.inv.keplerium +=1; I.xp+=50*timesXpBoost(I.en.xp, I);}
                    if(I.d[i*7+j] == "8"){ I.inv.lapis +=1*calcFortune(I.en.fortune, I); I.xp+=3*timesXpBoost(I.en.xp, I);}
                    if(I.d[i*7+j] == "7"){ I.inv.redstone +=1*calcFortune(I.en.fortune, I); I.xp+=3*timesXpBoost(I.en.xp, I);}
                    if(I.d[i*7+j] == "5"){ I.inv.diamond +=1*calcFortune(I.en.fortune, I); I.xp+=10*timesXpBoost(I.en.xp, I);}
                    if(I.d[i*7+j] == "4"){ I.inv.gold +=1*calcFortune(I.en.fortune, I); I.xp+=5*timesXpBoost(I.en.xp, I);}
                    if(I.d[i*7+j] == "3"){ I.inv.iron +=1*calcFortune(I.en.fortune, I);I.xp+=3*timesXpBoost(I.en.xp, I);}
                    if(I.d[i*7+j] == "2"){ I.inv.coal +=1*calcFortune(I.en.fortune, I);I.xp+=1*timesXpBoost(I.en.xp, I);}
                    if(I.d[i*7+j] == "1"){ I.inv.stone +=1*calcFortune(I.en.fortune, I);}  
                    I.d = replaceInString(I.d, i*7+j, "0");
                  }
                else if(I.d[i*7+j] === "a"){
                    m += obsidian;
                }
                else if(I.d[i*7+j] === "9"){
                    m += keplerium;
                }
                else if(I.d[i*7+j] === "8"){
                    m += lapis;
                }
                else if(I.d[i*7+j] === "7"){
                    m += redstone;
                }
                else if(I.d[i*7+j] === "6"){
                    m += random;
                }
                else if(I.d[i*7+j] === "5"){
                    m += diamond;
                }
                else if(I.d[i*7+j] === "4"){
                    m += gold;
                }
                else if(I.d[i*7+j] === "3"){
                    m += iron;
                }
                else if(I.d[i*7+j] === "2"){
                    m += coal;
                }
                else if(I.d[i*7+j] === "1"){
                    m += stone;
                }
                else if(I.d[i*7+j] === "0"){
                    m += air;
                }
              }
              else if(I.dim === 1){//Nether dimension
                if(i === I.picky && j === I.pickx){
                  m +=pickaxes[I.pick];
                  
                    if(I.d[i*7+j] == "3"){ I.inv.quartz +=1*calcFortune(I.en.fortune, I);I.xp+=16*timesXpBoost(I.en.xp, I);}
                    if(I.d[i*7+j] == "2"){ I.inv.soulsand +=1*calcFortune(I.en.fortune, I);I.xp+=2*timesXpBoost(I.en.xp, I);}
                    if(I.d[i*7+j] == "1"){ I.inv.netherrack +=1*calcFortune(I.en.fortune, I);}  
                    I.d = replaceInString(I.d, i*7+j, "0"); //got it.
                }//We have to test the nether first. I'm saving the end for perhaps 1.7
                else if(I.d[i*7+j] === "3"){
                    m += quartz;
                }
                else if(I.d[i*7+j] === "2"){
                    m += soulsand;
                }
                else if(I.d[i*7+j] === "1"){
                    m += netherrack;
                }
                else if(I.d[i*7+j] === "0"){
                    m += air2;
                }
            }
          }
      }
      //console.log(m.length);
      /*let embed = new Commando.RichEmbed()
        .setAuthor(bot.user.username, bot.user.avatarURL)
        .setTitle("**Your Arena**")
        .setDescription(m)
        .setColor("33ee33");*/
      message.channel.send("**Your Arena:**" + m);
      if(I.tut === 4 && I.inv.stone >= 60){
        I.tut = 5;
        Message("It's time!", "You finally have enough stone! It takes 60 to craft a new shiny pickaxe!\nUse the `kb!craft stone` to craft your new shiny stone pickaxe!", message, "33ee33");
      }
      if(I.tut === 2 && I.inv.coal >= 1){
        I.tut = 3;
        Message("Coalrific!", "Now that you have some coal, you've also gained some experience. Let's go check your inventory!\nUsage is `kb!inv`.", message, "33ee33");
      }
      if(I.tut === 1){
        I.tut = 2;
        Message("Intresting!", "Alright, go grab some coal over there!\nIf you don't have any coal in your arena, just use `kb!regenland` or `kb!rl`\nto regenerate your arena, you may do this every so often.", message, "33ee33");
      }
      if(I.tut === 0){
        I.tut = 1;
        Message("Great work!", "Nice! You might notice that the r on the end stands for right,\nyou can use other directions as well!\n'r', 'l', 'u' and 'd' are all 'right', 'left', 'up' and 'down' respectively", message, "33ee33");
      }
      if(args[0] === ""){
        message.channel.send("**Don't forget to add a direction at the end in the direction you want to mine!**");
      }
      if(I.xp >= I.level*10){levelUp(I, message);}
      var tips = [
          "If you get 60 stone, you can craft a stone pickaxe using \'kb!craft\'! Same goes for other materials like iron and diamond!",
          "Are you out of land? Use the \'kb!regenland\' command when you require new land!",
          "There might be a special ore you can find if you manage to get diamond!",
          "Gold is currently useless but you can soon use it to boost your pickaxe!",
          "Is there something that should be added to the bot? DM me or tell me on the official bot server!",
          "You can get roles in The Official Kepler Miner Server based on your pickaxe!",
          "Check to see if you are on top using `kb!top`",
          "Vote for The Kepler Miner and earn crates! Use the `kb!vote` command to get a link for voting! :D",
          "Don't forget to check how many more materials you need to craft the next pickaxe!",
          "New features are being added every week! Be sure to try them out!",
          "Donating will give you many features! Donate from my website or in The Kepler Miner Official Server, type `donate`!",
          "Join The Kepler Miner Official Server by doing `kb!server`!",
      ];
      if(Math.random()*10 > 7.8){
          message.channel.send("**TIP: **\n" + tips[Math.floor(Math.random()*tips.length)]);
      }
      addPickaxeRoles(message, I);
    }
  else{
    message.channel.send("Please wait " + (((I.lastmine+waittime)-Date.now())/1000).toFixed(2) + " Seconds!");
  }
    
};
var InvCommand = function(message, args){
  var ID = "";
  var targetUser = "";
  if(message.channel.type === "dm"){
    targetUser = message.author.id;
  }
  else{
    targetUser = message.guild.member(message.mentions.users.first()) || args[0];
  }
  //console.log(targetUser.id + " vs. " + targetUser);
  ID = targetUser.id || targetUser || message.author.id;
    var yourarray = findYourId(ID);
        if(yourarray == -1 && message.author.id === ID){
            makeNewInventory(message);
            yourarray = Invs.length-1;
        }
        else if(yourarray == -1){
          Message("Uh oh!", "This user doesn't exist yet!", message, "ee3333");
          return;
        }
        var I = Invs[yourarray];
        updateInventory(I);
        if(ID === message.author.id){ I.name = message.author.username.toString();}
        var XPP = "";
        for(var i = 0;i < 10;i ++){
            if(I.xp/((I.level*10)/10) >= i+1){
                if(i === 0){
                    XPP +=xps[2];
                }
                else if(i === 9){
                    XPP +=xps[8];
                }
                else{
                    XPP +=xps[5];
                }
            }
            else if(I.xp/((I.level*10)/10) >= i+0.5){
                if(i === 0){
                    XPP +=xps[1];
                }
                else if(i === 9){
                    XPP +=xps[7];
                }
                else{
                    XPP +=xps[4];
                }
            }
            else{
                if(i === 0){
                    XPP +=xps[0];
                }
                else if(i === 9){
                    XPP +=xps[6];
                }
                else{
                    XPP +=xps[3];
                }
            }
        }
        let testVar = "breep";
        var overworldStuff = `they have mined:\n ${Stone} ${I.inv.stone}\n ${Coal} ${I.inv.coal}\n ${Iron} ${I.inv.iron}\n ${Gold} ${I.inv.gold}\n ${Diamond} ${I.inv.diamond}\n ${Redstone} ${I.inv.redstone}\n ${Lapis} ${I.inv.lapis}\n ${Keplerium} ${I.inv.keplerium}\n ${emerald} ${I.inv.emerald}`;
        var netherworldStuff = `they have mined:\n ${netherrack} ${I.inv.netherrack}\n ${soulsand} ${I.inv.soulsand}\n ${Quartz} ${I.inv.quartz}\n ${Obsidian} ${I.inv.obsidian}`;
        //message.reply();
        var pickss = "";
        for(var i = 0;i < I.picks.length;i ++){
          if(I.picks[i]){
            pickss +=pickaxes[i];
          }
          else{
            pickss +=air;
          }
        }
        
        let invEmbed = new Commando.RichEmbed() 
            .setTitle(`**${I.name}'s inventory**`)
            .setColor("22ff88")
            .setTimestamp()
            .setFooter(`Requested by ${message.author.username}`, message.author.displayAvatarURL)
            .addField(`Overworld Items`, overworldStuff, true)
            .addField(`Netherworld Items`, netherworldStuff, true)
            .addBlankField(false)
            .addField(`Level: ${I.level}`, XPP, false)
            .addField(`**THEIR PICKAXES: **`, `${pickss}\n**Do kb!pickaxe [pickaxe] to switch your pickaxe!**`, false)
        
        message.channel.send(invEmbed);
      if(I.tut === 3){
        I.tut = 4;
          Message("Alrighty", "That's a lot of stuff you can get!\nThough currently it seems you can only get coal and stone.\nYou'll want to craft a stone pickaxe!\nI will let you know when you have enough! ;)", message, "33ee33");
      }
        addPickaxeRoles(message, I);
};
var RegenLandCommand = function(message, args){
    var yourarray = findYourId(message.author.id);
    if(yourarray == -1){
        makeNewInventory(message);
        yourarray = Invs.length-1;
    }
    var I = Invs[yourarray];
    updateInventory(I);
    if(I.en.cooldown === 0){regentime = 180*1000;}
    if(I.en.cooldown === 1){regentime = 150*1000;}
    if(I.en.cooldown === 2){regentime = 120*1000;}
    if(I.en.cooldown === 3){regentime = 90*1000;}
    if(I.lastregen+regentime< Date.now()){
      I.lastregen = Date.now();
      I.name = message.author.username.toString();
      createLand(I, I.dim);
      Message("Created land!", "Do the `kb!mine` command to mine in it!", message);
      addPickaxeRoles(message, I);
    }
    else{
      Message("A little too quick!", "Please wait " + (((I.lastregen+regentime)-Date.now())/1000).toFixed(1) + " Seconds!", message, "ee3333");
    }
};
var filename = "./datas.json";
var BackupQuick = function(){
    var inv = {Arenas:Arenas,Invs:Invs,emvalue:emvalue};
    var data = JSON.stringify(inv);
    fs.writeFile('datas.json', data, (err) => {  
      if (err) throw err;
      console.log('Data written to file! ' + data.length + " Characters long!");
      //console.log(data);
      const rawdata = fs.readFileSync('datas.json');  
      const inv = JSON.parse(rawdata);  
      Invs = inv.Invs;
      emvalue = inv.emvalue;
      Arenas = inv.Arenas;
    });
};
var BackupCommand = function(message, args){
    var inv = {Arenas:Arenas,Invs:Invs,emvalue:emvalue};
    var data = JSON.stringify(inv);
    var Namee = "data" + Date.now() + ".json";
    Namee = Namee.toString();
    fs.writeFile('datas.json', data, (err) => {  
      if (err) throw err;
      console.log('Data written to file!');
      console.log(data);
      const rawdata = fs.readFileSync('datas.json');  
      const inv = JSON.parse(rawdata);  
      //console.log(inv.Invs);  
      //Message("Backup Success!", "Data has been backed up successfully! There are " + inv.Invs.length + " user datas stored!", message, "ee7733");
      Invs = inv.Invs;
      emvalue = inv.emvalue;
      Arenas = inv.Arenas;
      var myAttachment = new Commando.Attachment("./datas.json", Namee);
      let embed = new Commando.RichEmbed()
            .setAuthor(bot.user.username, bot.user.avatarURL)
            .addField('Backup Success: ' + inv.Invs.length + " User Datas stored!", "Here is your .json file! :D")
            .setColor("22ff88")
            .attachFile(myAttachment)

        message.channel.send(embed);
      //message.channel.send("Here is the .json file!", myAttachment);
      /*for(var i = 0;i < Math.floor(data.length/1000)+1;i ++){
        message.channel.send("```" + data.slice(i*1000, i*1000+1000) + "```");
      }*/
    });
};
var CraftCommand = function(message, args){

    var yourarray = findYourId(message.author.id);
    if(yourarray == -1){
        makeNewInventory(message);
        yourarray = Invs.length-1;
    }
    var I = Invs[yourarray];
  
    updateInventory(I);
    I.name = message.author.username.toString();
    //stone
    if(I.dim === 0){
      if(I.inv.stone >= 60 && (args[0] === 1 || args[0] === "stone") && I.picks[1] === false){
          I.pick = 1;
          I.inv.stone -=60;
          I.picks[1] = true;
          Message("Crafting Table", "You just got the stone pickaxe! Nice work! " + pickaxes[I.pick], message);
        
          if(I.tut === 5){
            I.tut = -1;
            Message("Tada!", "Look at that new shiny pickaxe! (Well now I realized that the pickaxe isn't that shiny)\nTry regenerating your land!" +
                    "You might see a new ore!\nI now think you've got the hang of it! Keep on mining! Hit the leaderboards by using `kb!top`! \nYou can go back to the `kb!help` command and look at the other cool commands we have for example like `kb!villager`! (That command shows you prices of materials to ems!)", message, "33ee33");
          }
      }
      else if((args[0] === 1 || args[0] === "stone") && I.picks[1] === false){
          Message("Crafting Table", "You need " + (60-I.inv.stone) + " more " + Stone, message);
      }
      else if(args[0] === 1 || args[0] === "stone"){
        Message("Crafting Table", "You own this pickaxe!", message);
      }
      //iron
      if(I.inv.iron >= 60 && (args[0] === 2 || args[0] === "iron") && I.picks[2] === false){
          I.pick = 2;
          I.inv.iron -=60;
          I.picks[2] = true;
          Message("Crafting Table", "You just got the iron pickaxe! Good going! " + pickaxes[I.pick], message);
      }
      else if((args[0] === 2 || args[0] === "iron") && I.picks[2] === false){
          Message("Crafting Table", "You need " + (60-I.inv.iron) + " more " + Iron, message);
      }
      else if(args[0] === 2 || args[0] === "iron"){
        Message("Crafting Table", "You own this pickaxe!", message);
      }
      //diamond
      if(I.inv.diamond >= 60 && (args[0] === 3 || args[0] === "diamond") && I.picks[3] === false){
          I.pick = 3;
          I.picks[3] = true;
          I.inv.diamond -=60;
          Message("Crafting Table", "You just got the DIAMOND pickaxe! What a god! " + pickaxes[I.pick], message);
      }
      else if((args[0] === 3 || args[0] === "diamond") && I.picks[3] === false){
          Message("Crafting Table", "You need " + (60-I.inv.diamond) + " more " + Diamond, message);
      }
      else if(args[0] === 3 || args[0] === "diamond"){
        Message("Crafting Table", "You own this pickaxe!", message);
      }
      //gold
      if(I.inv.gold >= 60 && (args[0] === 6 || args[0] === "gold") && I.picks[6] === false){
          I.pick = 6;
          I.picks[6] = true;
          I.inv.gold -=60;
          Message("Crafting Table", "You just got the Gold Pickaxe! " + pickaxes[I.pick], message);
      }
      else if((args[0] === 6 || args[0] === "gold") && I.picks[6] === false){
          Message("Crafting Table", "You need " + (60-I.inv.gold) + " more " + Gold, message);
      }
      else if(args[0] === 6 || args[0] === "gold"){
        Message("Crafting Table", "You own this pickaxe!", message);
      }
      //redstone
      if(I.inv.redstone >= 60 && (args[0] === 7 || args[0] === "redstone") && I.picks[7] === false){
          I.pick = 7;
          I.picks[7] = true;
          I.inv.redstone -=60;
          Message("Crafting Table", "You just got the Redstone Pickaxe! " + pickaxes[I.pick], message);
      }
      else if((args[0] === 7 || args[0] === "redstone") && I.picks[7] === false){
          Message("Crafting Table", "You need " + (60-I.inv.redstone) + " more " + Redstone, message);
      }
      else if(args[0] === 7 || args[0] === "redstone"){
        Message("Crafting Table", "You own this pickaxe!", message);
      }
      //lapis
      if(I.inv.lapis >= 60 && (args[0] === 8 || args[0] === "lapis") && I.picks[8] === false){
          I.pick = 8;
          I.picks[8] = true;
          I.inv.lapis -=60;
          Message("Crafting Table", "You just got the Lapis Pickaxe! " + pickaxes[I.pick], message);
      }
      else if((args[0] === 8 || args[0] === "lapis") && I.picks[8] === false){
          Message("Crafting Table", "You need " + (60-I.inv.lapis) + " more " + Lapis, message);
      }
      else if(args[0] === 8 || args[0] === "lapis"){
        Message("Crafting Table", "You own this pickaxe!", message);
      }
      //keplerium
      if(I.inv.keplerium >= 16 && (args[0] === 9 || args[0] === "keplerium") && I.picks[9] === false){
          I.pick = 9;
          I.picks[9] = true;
          I.inv.keplerium -=16;
          Message("Crafting Table", "You just got the Keplerium pickaxe! It's the BEST PICKAXE! " + pickaxes[I.pick], message);
      }
      else if((args[0] === 9 || args[0] === "keplerium") && I.picks[9] === false){
          Message("Crafting Table", "You need " + (16-I.inv.keplerium) + " more " + Keplerium, message);
      }
      else if(args[0] === 9 || args[0] === "keplerium"){
        Message("Crafting Table", "You own this pickaxe!", message);
      }
    }
  //nether portal
  
      if(I.inv.obsidian >= 14 && (args[0] === "netherportal" || args[0] === "nether") && (I.picks[3] === true || I.picks[4] === true || I.picks[5] === true || I.picks[9] === true) && I.level >= 10 && I.dims[1] === false){
          I.inv.obsidian -=14;
          I.dims[1] = true;
          Message("Crafting Table", "You just created a Nether Portal! " + pickaxes[I.pick], message);
      }
      else if((args[0] === "netherportal" || args[0] === "nether") && !(I.picks[3] === true || I.picks[4] === true || I.picks[5] === true || I.picks[9] === true)){
          Message("Crafting Table", "You don't own an allowed pickaxe!", message);
      }
      else if((args[0] === "netherportal" || args[0] === "nether") && I.level < 10){
        Message("Crafting Table", "You must be at least level 10", message);
      }
      else if((args[0] === "netherportal" || args[0] === "nether") && I.inv.obsidian < 14){
        Message("Crafting Table", "You need " + (14-I.inv.obsidian) + " more Obsidian!", message);
      }
      else if((args[0] === "netherportal" || args[0] === "nether")){
        Message("Crafting Table", "You own this dimension!", message);
      }
    if(args[0] === ""){
        Message("Crafting Table", "Please add in what pickaxe you want to craft! iron, stone, diamond, etc.", message); 
    }
    addPickaxeRoles(message, I);
};

/** ARENAS **/
var MultiMineCommand = function(message, args){
    var yourarray = findYourId(message.author.id);
    if(yourarray == -1){
        makeNewInventory(message);
        yourarray = Invs.length-1;
        console.log("User " + Invs[Invs.length-1].id + " Created!");
    }
    var I = Invs[yourarray];
  
    updateInventory(I);
    if(I.dim !== 0){
      Message("Uh oh!", "You must be in the overworld dimension! use `kb!dimension overworld` to return!", message, "ee3333");
      return;
    }
    if(I.ar === -1){
      Message("Uh oh!", "You have to join an arena first! Use `kb!arena join <arenaid>`", message, "ee3333");
      return;
    }
    if(Date.now() > I.lastmine+waittime){
      /*
      Arenas.push({
        id: Arenas.length,
        minpick: minP,
        ispublic: ispublic,
        name: name,
        password: password,
        owner: message.author.id,
        lastmine: Date.now(),
        lastregen: Date.now(),
        data: createMultiLand(minP),
      });
      */
      I.name = message.author.username.toString();
      var AR = Arenas[I.ar];
      AR.lastmine = Date.now();
      var ardata = AR.data;
      if(ardata == "" || args[0] == "regenland" || args[0] === "rl"){
        if(args[0] == "recreate" && AR.lastregen+180000 < Date.now()){
          AR.lastregen = Date.now();
          AR.data = createMultiLand(AR.minpick);
        }
        else if(ardata != ""){ 
          Message("Too fast!", "Please wait " + (((AR.lastregen+180000)-Date.now())/1000).toFixed(1) + " Seconds!");
        }
        else if(ardata == ""){
          AR.lastregen = Date.now();
          AR.data = createMultiLand(AR.minpick);
        }
      }
      var ardata = AR.data;
      if((args[0] == "right" || args[0] == "r") && I.mp.x < 7){
          I.mp.x ++;
      }
      if((args[0] == "left" || args[0] == "l") && I.mp.x > 0){
          I.mp.x --;
      }
      if((args[0] == "down" || args[0] == "d") && I.mp.y < 7){
          I.mp.y ++;
      }
      if((args[0] == "up" || args[0] == "u") && I.mp.y > 0){
          I.mp.y --;
      }
      var XPBOOST = 0.9+(amtInArena(AR.id)/10);
      var m = `\n**${AR.name} Arena - XP Boost: ${XPBOOST}x**`;
      for(var i = 0;i < 8;i ++){
          m = m + "\n";
          for(var j = 0;j < 8;j ++){
              if(i === I.mp.y && j === I.mp.x){
                  m +=pickaxes[I.pick];
                  if(ardata[i*8+j] == "6"){ 
                      var randit = Math.floor(Math.random()*5);
                      if(randit == 0){
                          I.inv.stone +=20;
                          message.reply("You got 20 stone!");
                      }
                      if(randit == 1){
                          I.inv.coal +=20;
                          message.reply("You got 20 coal!");
                      }
                      if(randit == 2){
                          I.inv.iron +=10;
                          message.reply("You got 10 iron!");
                      }
                      if(randit == 3){
                          I.inv.gold +=5;
                          message.reply("You got 5 gold!");
                      }
                      if(randit == 4){
                          I.inv.diamond +=5;
                          message.reply("You got 5 diamonds!");
                      }
                  }
                  if(ardata[i*7+j] == "a"){ I.inv.obsidian +=1; I.xp+=5*timesXpBoost(I.en.xp, I)*XPBOOST;}
                  if(ardata[i*8+j] == "9"){ I.inv.keplerium +=1; I.xp+=50*timesXpBoost(I.en.xp, I)*XPBOOST;}
                  if(ardata[i*8+j] == "8"){ I.inv.lapis +=1*calcFortune(I.en.fortune, I); I.xp+=3*timesXpBoost(I.en.xp, I)*XPBOOST;}
                  if(ardata[i*8+j] == "7"){ I.inv.redstone +=1*calcFortune(I.en.fortune, I); I.xp+=3*timesXpBoost(I.en.xp, I)*XPBOOST;}
                  if(ardata[i*8+j] == "5"){ I.inv.diamond +=1*calcFortune(I.en.fortune, I); I.xp+=10*timesXpBoost(I.en.xp, I)*XPBOOST;}
                  if(ardata[i*8+j] == "4"){ I.inv.gold +=1*calcFortune(I.en.fortune, I); I.xp+=5*timesXpBoost(I.en.xp, I)*XPBOOST;}
                  if(ardata[i*8+j] == "3"){ I.inv.iron +=1*calcFortune(I.en.fortune, I);I.xp+=3*timesXpBoost(I.en.xp, I)*XPBOOST;}
                  if(ardata[i*8+j] == "2"){ I.inv.coal +=1*calcFortune(I.en.fortune, I);I.xp+=1*timesXpBoost(I.en.xp, I)*XPBOOST;}
                  if(ardata[i*8+j] == "1"){ I.inv.stone +=1*calcFortune(I.en.fortune, I);}
                  I.xp = Math.floor(I.xp);
                  AR.data = replaceInString(AR.data, i*8+j, "0");
              }
              else if(ardata[i*8+j] === "a"){
                  m += obsidian;
              }
              else if(ardata[i*8+j] === "9"){
                  m += keplerium;
              }
              else if(ardata[i*8+j] === "8"){
                  m += lapis;
              }
              else if(ardata[i*8+j] === "7"){
                  m += redstone;
              }
              else if(ardata[i*8+j] === "6"){
                  m += random;
              }
              else if(ardata[i*8+j] === "5"){
                  m += diamond;
              }
              else if(ardata[i*8+j] === "4"){
                  m += gold;
              }
              else if(ardata[i*8+j] === "3"){
                  m += iron;
              }
              else if(ardata[i*8+j] === "2"){
                  m += coal;
              }
              else if(ardata[i*8+j] === "1"){
                  m += stone;
              }
              else if(ardata[i*8+j] === "0"){
                  var doair = true;
                  for(var k = 0;k < Invs.length;k ++){
                      if(yourarray !== k && doair){
                          var K = Invs[k];
                          updateInventory(K);
                          if(K.mp.y === i && K.mp.x === j && K.ar === AR.id){
                              m +=pickaxes[K.pick];
                              doair = false;
                          }
                      }
                  }
                  if(doair){m += air;}
              }
          }
      }
      message.channel.send(m);
      if(args[0] === ""){
        message.channel.send("**Don't forget to add a direction at the end in the direction you want to mine!**");
      }
      if(I.xp >= I.level*10){levelUp(I, message);}
      addPickaxeRoles(message, I);
      //console.log(m.length);
    }
  else{
    message.channel.send("Please wait " + (((I.lastmine+waittime)-Date.now())/1000).toFixed(2) + " Seconds!");
  }
    
};
var amtInArena = function(arenaid){
  var amt = 0;
  for(var a = 0;a < Invs.length;a ++){
    if(Invs[a].ar === arenaid){
      amt ++;
    }
  }
  return amt;
};
var ArenaCommand = function(message, args){
    var yourarray = findYourId(message.author.id);
    if(yourarray == -1){
        makeNewInventory(message);
        yourarray = Invs.length-1;
        console.log("User " + Invs[Invs.length-1].id + " Created!");
    }
    var I = Invs[yourarray];
    updateInventory(I);
  
    /**
    Possible ways:
    - kb!arena create <minimumpickaxe> <private or public> <name> [password]
    (password only if private.)
    - kb!arena join <id> [password]
    - kb!arena delete <id>
    - kb!arena list <page>
    */
  
    if(args[0] === undefined || args[0] === ""){
      Message("Usage", "`kb!arena create <minimumpickaxe> <private or public> <name> [password]`\nCreate an arena, private people will have to enter with a password.\n`kb!arena join <id> [password]`\nJoin an existing arena! Note that if the arena is private you will have to enter in a password.\n`kb!arena delete <id>`\nDelete one of your arenas, note this will only work if it's yours. Anyone who was in the arena will be kicked out.\n`kb!arena list <page>`\nView some existing arenas!\n", message, "eeee33");
      return;
    }
  
    //Create an arena.
    if(args[0] === "create"){ //kb!arena create <minimumpickaxe> <private or public> <name> [password]
      
      //Pickaxes
      var minP = -1;
      if(args[1] === "wooden" || args[1] === "wood" || args[1] === 0){
        minP = 0;
      }
      if(args[1] === "stone" || args[1] === 1){
        minP = 1;
      }
      if(args[1] === "iron" || args[1] === 2){
        minP = 2;
      }
      if(args[1] === "diamond" || args[1] === 3){
        minP = 3;
      }
      if(args[1] === "keplerium" || args[1] === 9){
        minP = 9;
      }
      if(minP === -1){
        Message("Uh oh!", "Please specify the minimum pickaxe!\nFor example, stone would be the minimum pickaxe.\nSo wooden pickaxes couldn't join, but stone and higher could.", message, "ee3333");
        return;
      }
      
      //Private or Public
      var ispublic = -1;
      if(args[2] === "private"){
        ispublic = 0;
      }
      if(args[2] === "public"){
        ispublic = 1;
      }
      if(ispublic === -1){
        Message("Uh oh!", "Please specify if your arena will be public or private! If it's public anyone can join, but if it's private then they will need a password.", message, "ee3333");
        return;
      }
      
      //name
      var name = args[3];
      if(!args[3]){
        Message("Uh oh!", "You'll need a one word name! \"Keplermine\" is allowed but \"Keplers Mine\" isn't. However \"Keplers_Mine\" will work! :)", message, "ee3333");
        return;
      }
      if(args[3].length > 14){
        Message("Uh oh!", "Your Name is too long! 14 characters max!", message, "ee3333");
        return;
      }
      for(var i=0;i<profanities.length;i++) {
        if(name.includes(profanities[i])) return Message("Uh oh!", "It looks like you may have used an explitive for your name! Please try again!", message, "ee3333");
      }
      
      //password
      var password = "";
      if(ispublic === 0){
        if(args[4] === "" || args[4] === undefined){
          Message("Uh oh!", "Since this is a private arena you're making, you'll need a password! No spaces of course!", message, "ee3333");
          return;
        }
        password = args[4];
      }
      
      //lets create the arena now yahoo
      var yourarenas = 0;
      for(var i = 0;i < Arenas.length;i ++){
        if(Arenas[i].owner === I.id && I.donator === false){
          Message("Uh oh!", "Only Donators can create multiple arenas! Delete one of your older ones!", message, "ee3333");
          yourarenas ++;
          return;
        }
      }
      if(yourarenas > 8 && I.donator){
          Message("Uh oh!", "Donators can have a maximum of 8 arenas! Delete one of your older ones!", message, "ee3333");
      }
      var ArenaId = 0;
      for(var i = 0;i < Arenas.length;i ++){
        if(Arenas[i].id === ArenaId){
          ArenaId = Arenas[i].id + 1;
        }
      }
      Arenas.push({
        id: ArenaId,
        minpick: minP,
        ispublic: ispublic,
        name: name,
        password: password,
        owner: message.author.id,
        lastmine: Date.now(),
        lastregen: Date.now(),
        data: createMultiLand(minP),
      });
      I.ar = Arenas.length-1;
      if(ispublic === 1){ //public arena.
        Message("Success!", `You've created a new arena called ${name}! The ID is ${ArenaId}`, message, "33ee33");
      }
      if(ispublic === 0){ //private arena.
        bot.users.get(message.author.id).send("Your password: " + password);
        message.delete(1);
        Message("Success!", `You've created a new arena called ${name}! I've DMed you the password so others cannot see! The ID is ${ArenaId}`, message, "33ee33");
        return; //ok
      }//one sec
      //in #kepler-bot-testing and in the console
        
    }
  //join an arena
  if(args[0] === "join"){ //kb!arena join <id> [password]
    if(args[1] === undefined || args[1] === ""){
      Message("Uh oh!", "Please specify an ID! Must be a valid number!", message, "ee3333");
      return;
    }
    if(Math.floor(args[1]) < 0 || Math.floor(args[1]) >= Arenas.length || isNaN(Math.floor(parseInt(args[1])))){
      Message("Uh oh!", "Please specify an ID! Must be a valid number!", message, "ee3333");
      return;
    }
    var tarena = Arenas[Math.floor(args[1])];
    if(tarena.ispublic === 0 && args[2] !== tarena.password){
      Message("Wrong!", "That's not the right password!", message, "ee3333");
      return;
    }
    if(I.pick < tarena.minpick){
      Message("Uh oh!", "You'll need a higher pickaxe!", message, "ee3333");
      return;
    }
    I.ar = Math.floor(args[1]);
    message.delete(1);
    Message("Joined!", `You've joined ${tarena.name}`, message, "33ee33");
  }
  
  if(args[0] === "delete"){
    if(args[1] === undefined || args[1] === ""){
      Message("Uh oh!", "Please specify an ID! Must be a valid number!", message, "ee3333");
      return;
    }
    if(Math.floor(args[1]) < 0 || Math.floor(args[1]) >= Arenas.length || isNaN(Math.floor(parseInt(args[1])))){
      Message("Uh oh!", "Please specify an ID! Must be a valid number!", message, "ee3333");
      return;
    }
    var tarena = Arenas[Math.floor(args[1])];
    if(tarena.owner !== message.author.id){
      Message("Uh oh!", "You don't own this arena which means you cannot delete it!", message, "ee3333");
      return;
    }
    const oldname = tarena.name;
    for(var i = 0;i < Invs.length;i ++){
      updateInventory(Invs[i]);
      if(Invs[i].ar === Math.floor(args[1])){
        Invs[i].ar = -1;
      }
    }
    Arenas.splice(Math.floor(args[1]), 1);
    Message("Successfully deleted!", `You've deleted ${oldname}`, message, "33ee33");
  }
  if(args[0] === "list"){
    var PG = 0;
    if(args[1] !== undefined && args[1] !== "" && !isNaN(Math.floor(parseInt(args[1]))) && Math.floor(args[1]) >= 0 && Math.floor(args[1]) <= Math.floor(Arenas.length/10)){
      PG = Math.floor(args[1]);
    }
    var stpg = PG*10;
    var edpg = PG*10 + 10;
    if(edpg >= Arenas.length){
      edpg = Arenas.length;
    }
    var Mm = "";
    for(var i = stpg;i < edpg;i ++){
      var timescale = "s";
      var timelastmined = Math.floor((Date.now()-Arenas[i].lastmine)/1000);
      if(timelastmined > 120){
        timescale = "m";
        timelastmined = Math.floor(timelastmined/60);
      }
      if(timelastmined > 120){
        timescale = "h";
        timelastmined = Math.floor(timelastmined/60);
      }
      if(timelastmined > 48){
        timescale = "d";
        timelastmined = Math.floor(timelastmined/24);
      }
      Mm +=`ID ${Arenas[i].id}: **${Arenas[i].name}** - Created by: **${Invs[findYourId(Arenas[i].owner)].name}**\n**${amtInArena(Arenas[i].id)}** Recent Miners here | Last Mine: **${timelastmined + timescale} ago**\nMinimum Pickaxe: **${(Arenas[i].minpick === 0) ? "Wooden" : (Arenas[i].minpick === 1) ? "Stone" : (Arenas[i].minpick === 2) ? "Iron" : (Arenas[i].minpick === 3) ? "Diamond" : "Keplerium"}**\n`;
    }
    Message(`Arenas - Page ${1+PG}/${1+Math.floor(Arenas.length/10)}`, Mm, message, "ee3333");
  }
  //console.log(Arenas);
};
//More Commands yeet
var TopListCommand = function(message, args){
    
    var yourarray = findYourId(message.author.id);
    if(yourarray == -1){
        makeNewInventory(message);
        yourarray = Invs.length-1;
    }
    var I = Invs[yourarray];
  
    updateInventory(I);
    I.name = message.author.username.toString();
    
    var thepage = Math.floor(args[1]-1) || 0;
    thepage = thepage * 10;
    if(thepage > Invs.length){
      thepage = 0;
    }
  
    TopInvs = [];
    for(var i = 0;i < Invs.length;i ++){
        TopInvs.push(Invs[i]);
    }
    if(args[0] === "levels" || args[0] !== "emeralds"){ TopInvs.sort(function(a,b){return b.level-a.level;});}
    if(args[0] === "emeralds"){ TopInvs.sort(function(a,b){return b.inv.emerald-a.inv.emerald;});}
    var ms = "";
    var MAX = thepage+10;
    if(MAX > TopInvs.length){
      MAX = TopInvs.length;
    }
    for(var i = thepage;i < MAX;i ++){
        ms +=(i+1) + ". " + pickaxes[TopInvs[i].pick];
        ms +=TopInvs[i].name;
        //ms +=tokenToUser(TopInvs[i].id);
        //console.log(tokenToUser(TopInvs[i].id));
        if(args[0] === "emeralds"){ ms +=" - " + emerald + " " + TopInvs[i].inv.emerald + "\n";}
        else if(args[0] === "levels" || args[0] !== "emeralds"){ms +=" - Level " + TopInvs[i].level + "\n";}
    }
    if(1+findYourPlace(message.author.id) > 10){ ms +="...\n" + (1+findYourPlace(message.author.id)) + ". " + TopInvs[findYourPlace(message.author.id)].name + " - Level " + TopInvs[findYourPlace(message.author.id)].level;}
    Message("Top 10 Leaderboard! Do kb!lb <levels:emeralds> <page> to change pages", ms, message, "eeee33");
    addPickaxeRoles(message, I);
};
var PickaxeCommand = function(message, args){
    var yourarray = findYourId(message.author.id);
    if(yourarray == -1){
        makeNewInventory(message);
        yourarray = Invs.length-1;
    }
    var I = Invs[yourarray];
  
    updateInventory(I);
    I.name = message.author.username.toString();
    var pickk = args[0];
    pickk = pickk.toLowerCase();
    if((pickk === "wood" || pickk === "planks" || pickk === "wooden") && I.dim === 0){pickk = 0;}
    if((pickk === "stone" || pickk === "cobble" || pickk === "cobblestone") && I.dim === 0){pickk = 1;}
    if(pickk === "iron" && I.dim === 0){pickk = 2;}
    if(pickk === "diamond"){pickk = 3;}
    if((pickk === "vote" || pickk === "voter" || pickk === "voting")){pickk = 4;}
    if((pickk === "donate" || pickk === "donator" || pickk === "donated")){pickk = 5;}
    if(pickk === "gold" && I.dim === 0){pickk = 6;}
    if(pickk === "redstone" && I.dim === 0){pickk = 7;}
    if(pickk === "lapis" && I.dim === 0){pickk = 8;}
    if(pickk === "keplerium"){pickk = 9;}
    pickk = Math.floor(pickk);
    if(pickk !== 3 && pickk !== 4 && pickk !== 5 && pickk !== 9 && I.dim === 1){
        Message("Uh oh!", "You can't use that pickaxe here!", message, "ee3333");
        return;
    }
    if(pickk < 0 || pickk > I.picks.length-1){
      Message("Uh oh!", "That pickaxe doesn't exist!", message, "ee3333");
      return;
    }
    if(I.picks[pickk] === true){
      I.pick = pickk;
      Message("Pickaxe Switched!", "Pickaxe switched to " + pickaxes[pickk], message);
    }
    else{
      Message("Uh oh!", "You don't own that pick!", message, "ee3333");
    }
};
var CrateCommand = function(message, args){
    var yourarray = findYourId(message.author.id);
    if(yourarray == -1){
        makeNewInventory(message);
        yourarray = Invs.length-1;
    }
    var I = Invs[yourarray];
  
    updateInventory(I);
    I.name = message.author.username.toString();
    if(args[0] === undefined || args[0] === ""){
      var CR = "";
      for(var i = 0;i < 4;i ++){
        CR +="\n" + crates[i] + " **" + I.crates[i] + "**"; 
      }
      Message("**YOUR CRATES: **"+ crates[4], CR + "\n**Do `kb!crate [common:uncommon:rare:legendary]` to open a crate of that type**", message);
        
      return; 
    }
  if(args[0] === "common" && I.crates[0] > 0){
    var chance = Math.floor(Math.random()*5); //0, 1, 3, 5, 10
    I.crates[0] --;
    if(chance === 0){
      Message("Common Crate", "You just won 50 XP!", message, "3ae842");
      I.xp +=50;
    }
    if(chance === 1){
      Message("Common Crate", "You just won 20 Gold", message, "3ae842");
      I.inv.gold +=20;
      I.xp +=5*20;
    }
    if(chance === 2){
      Message("Common Crate", "You just won 20 Iron", message, "3ae842");
      I.inv.iron +=20;
      I.xp +=3*20;
    }
    if(chance === 3){
      Message("Common Crate", "You just won 100 Stone", message, "3ae842");
      I.inv.stone +=100;
    }
    if(chance === 4){
      Message("Common Crate", "You just won 30 Coal", message, "3ae842");
      I.inv.coal +=30;
      I.xp +=30;
    }
  }
  if(args[0] === "uncommon" && I.crates[1] > 0){
    var chance = Math.floor(Math.random()*5); //0, 1, 3, 5, 10
    I.crates[1] --;
    if(chance === 0){
      Message("Uncommon Crate", "You just won 100 XP!", message, "eadb3a");
      I.xp +=100;
    }
    if(chance === 1){
      Message("Uncommon Crate", "You just won 25 Gold", message, "eadb3a");
      I.inv.gold +=25;
      I.xp +=5*25;
    }
    if(chance === 2){
      Message("Uncommon Crate", "You just won 30 Iron", message, "eadb3a");
      I.inv.iron +=30;
      I.xp +=3*30;
    }
    if(chance === 3){
      Message("Uncommon Crate", "You just levelled up!", message, "eadb3a");
      I.level ++;
      I.xp = 0;
    }
    if(chance === 4){
      Message("Uncommon Crate", "You just won 10 Diamonds!", message, "eadb3a");
      I.inv.diamond +=10;
      I.xp +=10*10;
    }
  }
  if(args[0] === "rare" && I.crates[2] > 0){
    var chance = Math.floor(Math.random()*5); //0, 1, 3, 5, 10
    I.crates[2] --;
    if(chance === 0){
      Message("Rare Crate", "You just won 250 XP!", message, "3b82ed");
      I.xp +=250;
    }
    if(chance === 1){
      Message("Rare Crate", "You just won 50 Gold!", message, "3b82ed");
      I.inv.gold +=50;
      I.xp +=5*50;
    }
    if(chance === 2){
      Message("Rare Crate", "You just won 15 Diamonds!", message, "3b82ed");
      I.inv.diamond +=15;
      I.xp +=15*10;
    }
    if(chance === 3){
      Message("Rare Crate", "You just won 25 Diamonds!", message, "3b82ed");
      I.inv.diamond +=25;
      I.xp +=25*10;
    }
    if(chance === 4){
      var BB = "You just earned a bonus crate!";
      var cratechance = Math.floor(Math.random()*10)+1;
      if(cratechance === 10){ I.crates[3] ++; BB+="\nYou got a Legendary Crate! " + crates[3];}
      else if(cratechance >= 8){ I.crates[2] ++; BB+="\nYou got a Rare Crate! " + crates[2];}
      else if(cratechance >= 5){ I.crates[1] ++; BB+="\nYou got a Uncommon Crate! " + crates[1];}
      else{ I.crates[0] ++; BB+="\nYou got a Common Crate! " + crates[0];}
      Message("Rare Crate", BB, message, "3b82ed");
    }
  }
  if(args[0] === "legendary" && I.crates[3] > 0){
    var chance = Math.floor(Math.random()*5); //0, 1, 3, 5, 10
    I.crates[3] --;
    if(chance === 0){
      Message("Legendary Crate", "You just won 500 XP!", message, "bc3bef");
      I.xp +=500;
    }
    if(chance === 1){
      Message("Legendary Crate", "You just won the VOTING PICKAXE!", message, "bc3bef");
      I.picks[4] = true;
      I.pick = 4;
    }
    if(chance === 2){
      Message("Legendary Crate", "You just won 50 Diamonds!", message, "bc3bef");
      I.inv.diamond +=50;
      I.xp +=50*10;
    }
    if(chance === 3){
      var BB = "You just earned a bonus crate!";
      var cratechance = Math.floor(Math.random()*10)+1;
      if(cratechance === 10){ I.crates[3] ++; BB+="\nYou got a Legendary Crate! " + crates[3];}
      else if(cratechance >= 8){ I.crates[2] ++; BB+="\nYou got a Rare Crate! " + crates[2];}
      else if(cratechance >= 5){ I.crates[1] ++; BB+="\nYou got a Uncommon Crate! " + crates[1];}
      else{ I.crates[0] ++; BB+="\nYou got a Common Crate! " + crates[0];}
      Message("Legendary Crate", BB, message, "bc3bef");
    }
    if(chance === 4){
      Message("Legendary Crate", "You just won 1 Keplerium Ore!", message, "bc3bef");
      I.inv.keplerium +=1;
      I.xp +=40;
    }
  }
};
var AddItemsCommand = function(message, args){
  //console.log(args[0].toString());
  if(args[0][0] === "<" && args[0][1] === "@"){
    var tex = args[0];
    var TX = "";
    for(var i = 2;i < tex.length-1;i ++){
      TX +=tex[i];
    }//oh hello there.
    args[0] = TX;
  }
    var yourarray = findYourId(message.author.id);
    if(yourarray == -1){
        makeNewInventory(message);
        yourarray = Invs.length-1;
    }
    var I = Invs[yourarray];
  
    updateInventory(I);
    I.name = message.author.username.toString();
  if(I.id === "374929883698036736" || I.id === "468811298466168852"){
    if(args[0] === "" || args[0] === undefined){
      Message("Uh oh!", "Do kb!additems <id> <pick:ore:xp:levels:enchant:crates> <item:number:enchanttype:cratetype> [enchantlevel or crate amount]", message, "ee3333");
      return;
    }
    else{
      var selectedid = findYourId(args[0].toString());
      if(selectedid === -1){
        Message("Uh oh!", "This person isn't a miner!", message, "ee3333");
        return;
      }
      var SI = Invs[selectedid];
    updateInventory(SI);
      if(args[1] === "pick"){
        SI.pick = Math.floor(args[2]);
        SI.picks[Math.floor(args[2])] = true;
        Message("Give Command", "Gave " + SI.name + " the " + pickaxes[SI.pick] + " Pickaxe!", message);
      }
      else{
        if(args[1] === "stone"){
          SI.inv.stone +=Math.floor(args[2]);
          Message("Give Command", "Gave " + SI.name + " " + args[2] + " Stone!", message);
        }
        if(args[1] === "coal"){
          SI.inv.coal +=Math.floor(args[2]);
          Message("Give Command", "Gave " + SI.name + " " + args[2] + " Coal!", message);
        }
        if(args[1] === "iron"){
          SI.inv.iron +=Math.floor(args[2]);
          Message("Give Command", "Gave " + SI.name + " " + args[2] + " Iron!", message);
        }
        if(args[1] === "gold"){
          SI.inv.gold +=Math.floor(args[2]);
          Message("Give Command", "Gave " + SI.name + " " + args[2] + " Gold!", message);
        }
        if(args[1] === "diamond"){
          SI.inv.diamond +=Math.floor(args[2]);
          Message("Give Command", "Gave " + SI.name + " " + args[2] + " Diamonds!", message);
        }
        if(args[1] === "redstone"){
          SI.inv.redstone +=Math.floor(args[2]);
          Message("Give Command", "Gave " + SI.name + " " + args[2] + " Redstone!", message);
        }
        if(args[1] === "lapis"){
          SI.inv.lapis +=Math.floor(args[2]);
          Message("Give Command", "Gave " + SI.name + " " + args[2] + " Lapis!", message);
        }
        if(args[1] === "keplerium"){
          SI.inv.keplerium +=Math.floor(args[2]);
          Message("Give Command", "Gave " + SI.name + " " + args[2] + " Keplerium!", message);
        }
        if(args[1] === "xp"){
          SI.xp +=Math.floor(args[2]);
          Message("Give Command", "Gave " + SI.name + " " + args[2] + " XP!", message);
        }
        if(args[1] === "levels"){
          SI.level +=Math.floor(args[2]);
          Message("Give Command", "Gave " + SI.name + " " + args[2] + " Levels!", message);
        }
        if(args[1] === "donator"){
          SI.donator = !SI.donator;
          Message("Donator Perks", SI.name + " is" + (SI.donator ? "" : "n't") + " a Donator now!", message);
        }
        if(args[1] === "crate"){
          SI.crates[Math.floor(args[2])] +=1;
          var cratenames = ["Common", "Uncommon", "Rare", "Legendary"];
          Message("Give Command", SI.name + "Got a " + cratenames[Math.floor(args[2])] + " crate!", message);
        }
        if(args[1] === "obsidian"){
          SI.obsidian +=Math.floor(args[2]);
          Message("Give Command", "Gave " + SI.name + " " + args[2] + " Obsidian!", message);
        }
        if(args[1] === "enchant"){
          if(args[2] === "cooldown"){
            SI.en.cooldown = Math.floor(args[3]);
            Message("Give Command", "Gave " + SI.name + " level " + args[3] + " of cooldown!", message);
          }
          if(args[2] === "xp"){
            SI.en.xp = Math.floor(args[3]);
            Message("Give Command", "Gave " + SI.name + " level " + args[3] + " of xp!", message);
          }
          if(args[2] === "luck"){
            SI.en.luck = Math.floor(args[3]);
            Message("Give Command", "Gave " + SI.name + " level " + args[3] + " of luck!", message);
          }
          if(args[2] === "fortune"){
            SI.en.fortune = Math.floor(args[3]);
            Message("Give Command", "Gave " + SI.name + " level " + args[3] + " of fortune!", message);
          }
        }
        if(args[1] === "crates" || args[1] === "crate"){
          if(args[2] === "common"){
            SI.crates[0] +=Math.floor(args[3]);
            Message("Give Command", "Gave " + SI.name + " " + args[3] + " common crates!", message);
          }
          if(args[2] === "uncommon"){
            SI.crates[1] +=Math.floor(args[3]);
            Message("Give Command", "Gave " + SI.name + " " + args[3] + " uncommon crates!", message);
          }
          if(args[2] === "rare"){
            SI.crates[2] +=Math.floor(args[3]);
            Message("Give Command", "Gave " + SI.name + " " + args[3] + " rare crates!", message);
          }
          if(args[2] === "legendary"){
            SI.crates[3] +=Math.floor(args[3]);
            Message("Give Command", "Gave " + SI.name + " " + args[3] + " legendary crates!", message);
          }
        }
      }
    }
  }
  else{
    Message("Uh oh!", "You can't use this command unless you are KeplerTeddy!", message, "ee3333");
    return;
  }
};
var GiveCommand = function(message, args){//I think it's .includes()
  let targetUser = message.guild.member(message.mentions.users.first()) || args[0];
  if(!targetUser) return Message("Uh oh!", "Who do you want to give items to?", message, "ee3333");
  console.log(targetUser.id);
  if(targetUser.id === message.author.id && message.author.id !== "468811298466168852" ) return Message("Uh oh!", "You can't give yourself items silly!", message, "ee3333");
  
    var yourarray = findYourId(message.author.id);
    if(yourarray == -1){
        makeNewInventory(message);
        yourarray = Invs.length-1;
    }
    var I = Invs[yourarray];//Bowtie it works
  
    updateInventory(I);
    I.name = message.author.username.toString();
    
    if(args[0] === "" || args[0] === undefined || args[1] === "" || args[1] === undefined || args[2] === "" || args[2] === undefined){
      Message("Uh oh!", "Do kb!give <id> <ore> <item:number>", message, "ee3333");
      return;
    }
    else{
      var selectedid = findYourId(targetUser.id);
      if(selectedid === -1){
        Message("Uh oh!", "This person isn't a miner!", message, "ee3333");
        return;
      }
      var SI = Invs[selectedid];
    updateInventory(SI);
    updateInventory(I);
      if(args[1] === "pick" || args[1] === "xp" || args[1] === "levels" || args[1] === "donator" || args[1] === "crate"){
        Message("Uh oh!", `${message.author.username} doesn't have permission to do that...`, message, "ee3333");
        return;
      } else {
        let amt = parseInt(args[2]);//it works. look in the discord thingy
        if(parseInt(amt) <= 0 || isNaN(Math.floor(parseInt(args[2])))) return Message("Uh oh!", `You have to choose a positive number to give!`, message, "ee3333");
        
        if(args[1] === "stone"){
          if(amt > I.inv.stone) return Message("Uh oh!", "You don't have enough of that material!", message, "ee3333");
          I.inv.stone -= Math.floor(amt);
          SI.inv.stone += Math.floor(amt);
        }
        if(args[1] === "coal"){
          if(amt > I.inv.coal) return Message("Uh oh!", "You don't have enough of that material!", message, "ee3333");
          I.inv.coal -= Math.floor(amt);
          SI.inv.coal +=Math.floor(args[2]);
        }
        if(args[1] === "iron"){
          if(amt > I.inv.iron) return Message("Uh oh!", "You don't have enough of that material!", message, "ee3333");
          I.inv.iron -= Math.floor(amt);
          SI.inv.iron +=Math.floor(args[2]);
        }
        if(args[1] === "gold"){
          if(amt > I.inv.gold) return Message("Uh oh!", "You don't have enough of that material!", message, "ee3333");
          I.inv.gold -= Math.floor(amt);
          SI.inv.gold +=Math.floor(args[2]);
        }
        if(args[1] === "diamond"){
          if(amt > I.inv.diamond) return Message("Uh oh!", "You don't have enough of that material!", message, "ee3333");
          I.inv.diamond -= Math.floor(amt);
          SI.inv.diamond +=Math.floor(args[2]);
        }
        if(args[1] === "redstone"){
          if(amt > I.inv.redstone) return Message("Uh oh!", "You don't have enough of that material!", message, "ee3333");
          I.inv.redstone -= Math.floor(amt);
          SI.inv.redstone +=Math.floor(args[2]);
         }
        if(args[1] === "lapis"){
          if(amt > I.inv.lapis) return Message("Uh oh!", "You don't have enough of that material!", message, "ee3333");
          I.inv.lapis -= Math.floor(amt);
          SI.inv.lapis +=Math.floor(args[2]);
        }
        if(args[1] === "keplerium"){
          if(amt > I.inv.keplerium) return Message("Uh oh!", "You don't have enough of that material!", message, "ee3333");
          I.inv.keplerium -= Math.floor(amt);
          SI.inv.keplerium +=Math.floor(args[2]);
        }
        Message("Give Command", `${message.author.username} gave ${SI.name} ${args[2]} ${args[1]}`, message);
      }
    }
  
};
var StatsCommand = function(message){
    var activethisday = 0;
    var activethisweek = 0;
    for(var i = 0; i < Invs.length;i ++){
      var d = Date.now();
      if(Invs[i].lastmine+86400000 > d){
        activethisday ++;
      }
      if(Invs[i].lastmine+604800000 > d){
        activethisweek ++;
      }
    }
    Message("**Stats!:**","Players: **" + Invs.length + "**\nServers: **" + bot.guilds.size + "**\nActive in the past 24 hours: **" + activethisday + "**\nActive in the past 7 Days: **" + activethisweek + "**", message);
};
var ShopCommand = function(message, args){
  var yourarray = findYourId(message.author.id);
  if(yourarray == -1){
      makeNewInventory(message);
      yourarray = Invs.length-1;
      console.log("User " + Invs[Invs.length-1].id + " Created!");
  }
  //console.log(message.author.username.toString());
  var I = Invs[yourarray];
  updateInventory(I);
  var shoptype = -1;
  var Items = [];
  var Display = "";
  if(args[0] === "redstone" || args[0] === "cooldown"){
    shoptype = 0;
      Items = [
        {name:"Cooldown",cost:80,addcost:60,maxlevel:3},
      ];
  }
  else if(args[0] === "lapis" || args[0] === "enchant"){
    shoptype = 1;
      Items = [
        {name:"Fortune",cost:40,addcost:30,maxlevel:3},
        {name:"Luck",cost:80,addcost:40,maxlevel:3},
        {name:"XP Boost",cost:60,addcost:35,maxlevel:3},
      ];
  }
  else{
    Message("Uh oh!", "There are only two shops, cooldown and enchant.", message, "ee3333");
    return;
  }
  if(args[1] === "" || args[1] === undefined){
    if(shoptype === 0){
      
      for(var i = 0;i < Items.length;i ++){
        Display +="\nID: " + i + " - **" + Items[i].name + " ";
        var DD = 0;
        if(i === 0)DD =I.en.cooldown;
        Display +=(DD+1);
        Display +="** - ";
        if(DD >= Items[i].maxlevel){
          Display +="MAXED OUT";
        }
        else{
          Display +=(Items[i].cost + (Items[i].addcost * DD)) + redstone;
        }
      }
    }
    if(shoptype === 1){
      for(var i = 0;i < Items.length;i ++){
        Display +="\nID: " + i + " - **" + Items[i].name + " ";
        var DD = 0;
        if(i === 0)DD =I.en.fortune;
        if(i === 1)DD =I.en.luck;
        if(i === 2)DD =I.en.xp;
        Display +=(DD+1);
        Display +="** - ";
        if(DD >= Items[i].maxlevel){
          Display +="MAXED OUT";
        }
        else{
          Display +=(Items[i].cost + (Items[i].addcost * DD)) + lapis;
        }
      }
    }
    Message("**" + (shoptype == 0 ? "Cooldown" : "Enchantment") + " Shop:**", Display, message);
  }
  else if(Math.floor(args[1]) >= 0 && Math.floor(args[1]) < Items.length){
    var chosen = Items[Math.floor(args[1])];
    var type = Math.floor(args[1]);
    var thingy = 0;
    if(shoptype === 0){
      if(type === 0)thingy = I.en.cooldown;
      var cost = (chosen.cost + (chosen.addcost * thingy));
      if(thingy >= chosen.maxlevel){
        Message("Maxed Out", "You've already maxed this enchantment out! Awesome!", message);
      }
      else if(I.inv.redstone >= cost){
        I.inv.redstone -=cost;
        if(type === 0)I.en.cooldown ++;
        thingy ++;
        Message("Successfully Bought", "You just bought " + chosen.name + " " + thingy, message);
      }
      else{
        Message("Oops!", "You need " + (cost - I.inv.redstone) + " more " + redstone, message);
      }
    }
    if(shoptype === 1){
      if(type === 0)thingy = I.en.fortune;
      if(type === 1)thingy = I.en.luck;
      if(type === 2)thingy = I.en.xp;
      var cost = (chosen.cost + (chosen.addcost * thingy));
      if(thingy >= chosen.maxlevel){
        Message("Maxed Out", "You've already maxed this enchantment out! Awesome!", message);
      }
      else if(I.inv.lapis >= cost){
        I.inv.lapis -=cost;
        if(type === 0)I.en.fortune ++;
        if(type === 1)I.en.luck ++;
        if(type === 2)I.en.xp ++;
        thingy ++;
        Message("Successfully Bought", "You just bought " + chosen.name + " " + thingy, message);
      }
      else{
        Message("Oops!", "You need " + (cost - I.inv.lapis) + " more " + lapis, message);
      }
    }
  }
};
var EnchantCommand = function(message){
  var yourarray = findYourId(message.author.id);
  if(yourarray == -1){
      makeNewInventory(message);
      yourarray = Invs.length-1;
      console.log("User " + Invs[Invs.length-1].id + " Created!");
  }
  //console.log(message.author.username.toString());
  var I = Invs[yourarray];
  updateInventory(I);
  Message("Your Enchantments", "**Cooldown " + I.en.cooldown + "**\nYou can mine every **" + (5-I.en.cooldown)
          + " seconds\nFortune " + I.en.fortune + "**\nYou get **" + (I.en.fortune*100) + "%** more ores"
          + "\n**Luck " + I.en.luck + "**\nYou are **" + (I.en.luck*5) + "%** more likely to get ores than stone"
          + "\n**XP Boost" + I.en.xp + "**\nYou will get **" + (-1+timesXpBoost(I.en.xp, I)) + "%** more xp", message);
};
var DimensionCommand = function(message, args){
  var yourarray = findYourId(message.author.id);
  if(yourarray == -1){
      makeNewInventory(message);
      yourarray = Invs.length-1;
      console.log("User " + Invs[Invs.length-1].id + " Created!");
  }
  //console.log(message.author.username.toString());
  var I = Invs[yourarray];
  updateInventory(I);
  if(args[0] === undefined || args[0] === ""){
      Message("Hmmm", "Usage: `kb!dim <overworld/nether>`", message, "eeee33");
  }
  if(Date.now() < I.ds+(regentime*2)){
      Message("A little too quick!", "Please wait " + (((I.ds+(regentime*2))-Date.now())/1000/60).toFixed(0) + " Minutes!", message, "ee3333");
      return;
  }
  if(args[0] === "0" || args[0] === 0 || args[0] === "overworld"){
    if(I.pick >= 10){
      Message("Uh oh!", "You need to be using an allowed pickaxe in this dimension!", message, "ee3333");
      return;
    }
    I.dim = 0;
    I.ds = Date.now();
    I.lastregen = Date.now();
    createLand(I, 0);
    Message("Success", "You have now been transported to the Overworld!", message, "ee3333");
  }
  if(args[0] === "1" || args[0] === 1 || args[0] === "nether"){
    if(I.dims[1] === false){
      Message("Uh oh!", "You have to craft a nether portal first! Use `kb!craft nether` to make one!", message, "ee3333");
      return;
    }
    if(I.pick !== 3 && I.pick !== 4 && I.pick !== 5 && I.pick !== 9){
      Message("Uh oh!", "You need to be using an allowed pickaxe in this dimension!\nOnly Diamond, Keplerium, Voter and Donator Pickaxes are aloud.", message, "ee3333");
      return;
    }
    I.dim = 1;
    I.ds = Date.now();
    I.lastregen = Date.now();
    createLand(I, 1);
    Message("Success", "You have now been transported to the Nether!", message, "ee3333");
  }
};

//Trading
var tradeables = ["stone", "coal", "iron", "diamond", "gold", "redstone", "lapis", "keplerium", "emerald"];
var TradeCommand = function(message, args){ //kb!trade @User/userid type(diamond, keplerium etc.) amt type2 amt2  (which sets a trade up)  OR   kb!trade @User (which confirms the trade)
  var yourarray = findYourId(message.author.id);
  if(yourarray == -1){
      makeNewInventory(message);
      yourarray = Invs.length-1;
      console.log("User " + Invs[Invs.length-1].id + " Created!");
  }
  //console.log(message.author.username.toString());
  var I = Invs[yourarray];
  updateInventory(I);
  
  //Setup user
  if(args[0] === "" || args[0] === undefined || args[0] === "cancel" || args[0] === "confirm"){
    Message("Hmm...", "Usage: `kb!trade <user> <item from you to them> <amt> <item from them to you> <amt>` to start a trade\nor\n`kb!trade <user> confirm` to confirm a trade", message, "eeee33");
    return;
  }
  var ID = "";
  let targetUser = message.guild.member(message.mentions.users.first()) || args[0];
  //console.log(targetUser.id + " vs. " + targetUser);
  ID = targetUser.id || targetUser;
  //console.log("ID Became: " + ID);
  var theirarray = findYourId(ID);
  if(theirarray === -1 || theirarray + "a" === "NaNa" || theirarray === undefined){
    return;
  }
  var J = Invs[theirarray];
  updateInventory(J);
  //console.log(Math.floor(args[2]) + "a");
  if(theirarray === -1){
    Message("Uh oh!", "The person you are trading with isn't a miner! Ask them to join!", message, "ee3333");
    return;
  }
  
  if(args[1] === "" || args[1] === undefined || args[1] === "cancel" || args[1] === "confirm"){
    //Trade confirmation code here
    if(args[1] === "cancel"){
      //cancel command
      if(checkIfTraded(yourarray, theirarray) >= 0){
        ActiveTrades.splice(checkIfTraded(yourarray, theirarray), 1);
        Message("Success", "Trade Successfully Cancelled! :D", message, "33ee33");
        return;
      }
      else{
        Message("Hmm...", "Looks like you don't have any trades with this person...", message, "eeee33");
        return;
      }
    }
    if(args[1] === "confirm"){
      if(checkIfTraded(yourarray, theirarray) >= 0){
        var TR = ActiveTrades[checkIfTraded(yourarray, theirarray)];
        /*
            tradecreation: Date.now(),
            tradedeletion: Date.now()+1800000,
            trader1: yourarray,
            trader2: theirarray,
            trade1: args[1],
            trade2: args[3],
            amt1: Math.floor(args[2]),
            amt2: Math.floor(args[4]),
      */
        var trader1 = Invs[TR.trader1];
        var trader2 = Invs[TR.trader2];
        if(TR.trader1 === yourarray){
          Message("Uh oh!", "The other person has to confirm it, not you!", message, "ee3333");
          return;
        }
        //you give them their stuff
        if(TR.trade1 === "stone"){
          trader2.inv.stone +=TR.amt1;
          trader1.inv.stone -=TR.amt1;
        }
        if(TR.trade1 === "coal"){
          trader2.inv.coal +=TR.amt1;
          trader1.inv.coal -=TR.amt1;
        }
        if(TR.trade1 === "iron"){
          trader2.inv.iron +=TR.amt1;
          trader1.inv.iron -=TR.amt1;
        }
        if(TR.trade1 === "diamond"){
          trader2.inv.diamond +=TR.amt1;
          trader1.inv.diamond -=TR.amt1;
        }
        if(TR.trade1 === "gold"){
          trader2.inv.gold +=TR.amt1;
          trader1.inv.gold -=TR.amt1;
        }
        if(TR.trade1 === "redstone"){
          trader2.inv.redstone +=TR.amt1;
          trader1.inv.redstone -=TR.amt1;
        }
        if(TR.trade1 === "lapis"){
          trader2.inv.lapis +=TR.amt1;
          trader1.inv.lapis -=TR.amt1;
        }
        if(TR.trade1 === "keplerium"){
          trader2.inv.keplerium +=TR.amt1;
          trader1.inv.keplerium -=TR.amt1;
        }
        if(TR.trade1 === "emerald"){
          trader2.inv.emerald +=TR.amt1;
          trader1.inv.emerald -=TR.amt1;
        }
        
        //and they give you some of their stuff!
        
        if(TR.trade2 === "stone"){
          trader1.inv.stone +=TR.amt2;
          trader2.inv.stone -=TR.amt2;
        }
        if(TR.trade2 === "coal"){
          trader1.inv.coal +=TR.amt2;
          trader2.inv.coal -=TR.amt2;
        }
        if(TR.trade2 === "iron"){
          trader1.inv.iron +=TR.amt2;
          trader2.inv.iron -=TR.amt2;
        }
        if(TR.trade2 === "diamond"){
          trader1.inv.diamond +=TR.amt2;
          trader2.inv.diamond -=TR.amt2;
        }
        if(TR.trade2 === "gold"){
          trader1.inv.gold +=TR.amt2;
          trader2.inv.gold -=TR.amt2;
        }
        if(TR.trade2 === "redstone"){
          trader1.inv.redstone +=TR.amt2;
          trader2.inv.redstone -=TR.amt2;
        }
        if(TR.trade2 === "lapis"){
          trader1.inv.lapis +=TR.amt2;
          trader2.inv.lapis -=TR.amt2;
        }
        if(TR.trade2 === "keplerium"){
          trader1.inv.keplerium +=TR.amt2;
          trader2.inv.keplerium -=TR.amt2;
        }
        if(TR.trade2 === "emerald"){
          trader1.inv.emerald +=TR.amt2;
          trader2.inv.emerald -=TR.amt2;
        }
        ActiveTrades.splice(checkIfTraded(yourarray, theirarray), 1);
        Message("Traded!", "You have successfully traded with " + trader1.name, message, "33ee33");
      }
      else{
        Message("Uh oh!", "You have to start a trade with them silly!", message, "ee3333");
      }
    }
  }
  else{
    var T = -1;
    for(var i = 0;i < tradeables.length;i ++){
      if(args[1] === tradeables[i]){
        T = i;
      }
    }
    if(T === -1){
      Message("Uh oh!", "That ain't an item silly!", message, "ee3333");
      return;
    }
    if(Math.floor(args[2]) <= 0){
      Message("Uh oh!", "That number has to be ABOVE 0", message, "ee3333");
      return;
    }
    if(isNaN(Math.floor(parseInt(args[2])))) {
      Message("Uh oh!", "That ain't a number silly!", message, "ee3333");
      return;
    }
    var T = -1;
    for(var i = 0;i < tradeables.length;i ++){
      if(args[3] === tradeables[i]){
        T = i;
      }
    }
    if(T === -1){
      Message("Uh oh!", "That ain't an item silly!", message, "ee3333");
      return;
    }
    if(Math.floor(args[4]) <= 0){
      Message("Uh oh!", "That number has to be ABOVE 0", message, "ee3333");
      return;
    }
    if(Math.floor(args[4]) + "a" === "NaNa"){
      Message("Uh oh!", "That ain't a number silly!", message, "ee3333");
      return;
    }
    if(args[1] === "stone" && I.inv.stone < Math.floor(args[2])){ Message("Uh oh!", "You don't have enough!", message, "ee3333");}
    if(checkIfTraded(yourarray, theirarray) >= 0){
      Message("Hmm...", "Looks like you have an ongoing trade with this person already.\ndo kb!trade @User cancel to cancel that trade and re enter in your new one.", message, "eeee33");
      return;
    }
    if(!checkIfEnough(I, args[1], Math.floor(args[2]))){
      Message("Uh oh!", "You don't have enough!", message, "ee3333");
      return;
    }
    if(!checkIfEnough(J, args[3], Math.floor(args[4]))){
      Message("Uh oh!", "They don't have enough!", message, "ee3333");
      return;
    }
    ActiveTrades.push({
      tradecreation: Date.now(),
      tradedeletion: Date.now()+1800000,
      trader1: yourarray,
      trader2: theirarray,
      trade1: args[1],
      trade2: args[3],
      amt1: Math.floor(args[2]),
      amt2: Math.floor(args[4]),
    });
    var AT = ActiveTrades[ActiveTrades.length-1];
    Message("Trade Requested", Invs[AT.trader1].name + " has successfully asked " + Invs[AT.trader2].name + " to give them " + AT.amt2 + " " + AT.trade2 + "\nin exchange for "
            + AT.amt1 + " " + AT.trade1 + ".\nThe trade will expire 30 minutes from now if they don't confirm", message, "33ee33");
  }
};

var conversions = [
  300, 250, 60, 60, 30, 30, 30, 0.1, //stone, coal, iron, gold, diamond, redstone, lapis, keplerium
];//these are how much of each material for an emerald, this may change overtime with a noise().
//
var materialsToBuy = [Stone, Coal, Iron, Gold, Diamond, Redstone, Lapis, Keplerium];
var VillagerCommand = function(message, args){
  var yourarray = findYourId(message.author.id);
  if(yourarray == -1){
      makeNewInventory(message);
      yourarray = Invs.length-1;
      console.log("User " + Invs[Invs.length-1].id + " Created!");
  }
  var I = Invs[yourarray];
  updateInventory(I);
  
  if(I.level < 5){
    Message("Uh oh!", "You must be level 5 to use the villager!", message, "ee3333");
    return;
  }
  //kb!villager buy [material] [amt]
  //kb!villager list/prices (or nothing)
  //kb!villager invest [material] [amt]
  var M = "";
  if(!args[0] || args[0] === undefined || args[0] === "" || args[0] === "prices"){
    for(var i = 0;i < materialsToBuy.length;i ++){
      if(conversions[i] < 1){
        M +=`${materialsToBuy[i]}1 = ${Math.floor(emvalue/conversions[i])}${emerald}\n`;
      }
      else{
        M +=`${materialsToBuy[i]}${Math.floor(conversions[i]*emvalue)} = 1 ${emerald}\n`;
      }
    }
  }      
      //end command
      //we'll use this as I want to put an image of a villager
  let embed = new Commando.RichEmbed()
        .setAuthor(bot.user.username, bot.user.avatarURL)
        .setTitle('Villager')
        .setDescription(M)
        .setThumbnail('https://gamepedia.cursecdn.com/minecraft_gamepedia/thumb/5/55/Librarian.png/116px-Librarian.png?version=c47755bed4dfc1ea80b464bbae5a4ef8')
        .setFooter(`Requested by ${message.author.username}`, message.author.displayAvatarURL)
        .setColor("22ff88");

  message.channel.send(embed);
};
var buyables = ["stone", "coal", "iron", "gold", "diamond", "redstone", "lapis", "keplerium"];
//buy materials from ems
var GetBuying = function(arg){
  for(var i = 0;i < buyables.length;i ++){
    if(buyables[i] === arg){
      return i;
    }
  }
  return -1;
};
var BuyCommand = function(message, args){//kb!buy <material-to-buy> <number of ems to sell>
  var yourarray = findYourId(message.author.id);
  if(yourarray == -1){
      makeNewInventory(message);
      yourarray = Invs.length-1;
      console.log("User " + Invs[Invs.length-1].id + " Created!");
  }
  var I = Invs[yourarray];
  updateInventory(I);
  
  if(I.level < 5){
    Message("Uh oh!", "You must be level 5 to use the buy command!", message, "ee3333");
    return;
  }
  if(args[0] === undefined || args[0] === ""){
    Message("Hmm...", "Usage: `kb!buy <emstosell> <itemtobuy>`", message, "eeee33");
    return;
  }
  if(args[1] === undefined || args[1] === ""){
    Message("Uh oh!", "Please specify the item you want to get", message, "ee3333");
    return;
  }
  var emtosell = Math.floor(args[0]);
    //Checks if the material is available to buy
    if(GetBuying(args[1]) !== -1) {
      //message.channel.send(`You can buy ${args[1]} material`);//thats it, just switch them around
      var AMT = Math.floor(conversions[GetBuying(args[1])]*emvalue)*emtosell;
      if(I.inv.emerald >= emtosell && AMT > 0){
        if(I.lb+3600000> Date.now()){
          Message("Oof", `You must wait ${Math.floor((I.lb+60000-Date.now())/60000)} minutes!`, message, "ee3333");
          return;
        }
        I.inv.emerald -=emtosell;
        if(GetBuying(args[1]) === 0){
          I.inv.stone +=AMT;
          Message("Success!", `You've earned ${AMT} stone!`, message, "33ee33");
        }
        if(GetBuying(args[1]) === 1){
          I.inv.coal +=AMT;
          Message("Success!", `You've earned ${AMT} coal!`, message, "33ee33");
        }
        if(GetBuying(args[1]) === 2){
          I.inv.iron +=AMT;
          Message("Success!", `You've earned ${AMT} iron!`, message, "33ee33");
        }
        if(GetBuying(args[1]) === 3){
          I.inv.gold +=AMT;
          Message("Success!", `You've earned ${AMT} gold!`, message, "33ee33");
        }
        if(GetBuying(args[1]) === 4){
          I.inv.diamond +=AMT;
          Message("Success!", `You've earned ${AMT} diamonds!`, message, "33ee33");
        }
        if(GetBuying(args[1]) === 5){
          I.inv.redstone +=AMT;
          Message("Success!", `You've earned ${AMT} redstone!`, message, "33ee33");
        }
        if(GetBuying(args[1]) === 6){
          I.inv.lapis +=AMT;
          Message("Success!", `You've earned ${AMT} lapis!`, message, "33ee33");
        }
        if(GetBuying(args[1]) === 7){
          I.inv.keplerium +=Math.floor(emvalue/conversions[GetBuying(args[1])])*emtosell;
          Message("Success!", `You've earned ${AMT} keplerium!`, message, "33ee33");
        }
        I.lb = Date.now();
        investamt --;
        if(investamt < -10) investamt = -10;
        if(investamt > 10) investamt = 10;
      } 
      else if(AMT < 0){
        Message("Oof", "You wouldn't get anything out of this trade! Perhaps wait the for the value to change.", message, "eeee33");
      }
      else{
        Message("Uh oh!", "You don't have enough emeralds!", message, "ee3333");
      }
    } else {
        Message("Uh oh!", `You cannot buy ${args[1]} material!`, message, "ee3333");
    }
};
//get ems from materials
var InvestCommand = function(message, args){
  var yourarray = findYourId(message.author.id);
  if(yourarray == -1){
      makeNewInventory(message);
      yourarray = Invs.length-1;
      console.log("User " + Invs[Invs.length-1].id + " Created!");
  }
  var I = Invs[yourarray];
  updateInventory(I); //you'll need this to access the inventory of the user
  
  if(I.level < 5){
    Message("Uh oh!", "You must be level 5 to use the invest command!", message, "ee3333");
    return;
  }
    for(var i = 0; i < materialsToBuy.length; i++) {
        //console.log(Math.floor(Math.floor(conversions[i]*emvalue)));
    }

  //Checks which material to buy/invest
  if(GetBuying(args[0]) !== -1) {//oh nope this is different
    //ok that should work.
    let emAmt = Math.floor(args[1]/conversions[GetBuying(args[0])]/emvalue);
    let amt = parseInt(args[1]);
    let remain = amt-Math.floor(conversions[GetBuying(args[0])]*emvalue)*emAmt;
    amt = amt - remain;
    console.log(remain);
    if(amt <= 0 || isNaN(Math.floor(parseInt(args[1])))) return Message("Oof", `${args[1]} is not a valid number!`, message, "ee3333");
    if(!args[1] || args[1] === "" || args [1] === undefined || args[1] === null) return message.reply(`You gotta specify an amount to invest ...`); //overkill?
    if(emAmt <= 0){ 
        Message("Oof", "You wouldn't get anything out of this trade! Perhaps wait the for the value to change.", message, "eeee33");
      return;
    }
    if(I.li+3600000 > Date.now()){
      Message("Oof", `You must wait ${Math.floor((I.li+3600000-Date.now())/60000)} minutes!`, message, "ee3333");
      return;
    }
    //console.log(emAmt);
    if(GetBuying(args[0]) === 0) { //stone
      if(I.inv.stone < amt){Message("Uh oh!", `You don't have enough ${args[0]} !`, message, "ee3333");return;}
        I.inv.stone -= amt;
        I.inv.emerald += emAmt;
    }
    if(GetBuying(args[0]) === 1) { //coal
      if(I.inv.coal < amt){Message("Uh oh!", `You don't have enough ${args[0]} !`, message, "ee3333");return;}
        I.inv.coal -= amt;
        I.inv.emerald += emAmt;
    }
    if(GetBuying(args[0]) === 2) { //iron
      if(I.inv.iron < amt){Message("Uh oh!", `You don't have enough ${args[0]} !`, message, "ee3333");return;}
        I.inv.iron -= amt;
        I.inv.emerald += emAmt;
    }
    if(GetBuying(args[0]) === 3) { //gold
      if(I.inv.gold < amt){Message("Uh oh!", `You don't have enough ${args[0]} !`, message, "ee3333");return;}
        I.inv.gold -= amt;
        I.inv.emerald += emAmt;
    }
    if(GetBuying(args[0]) === 4) { //diamond
      if(I.inv.diamond < amt){Message("Uh oh!", `You don't have enough ${args[0]} !`, message, "ee3333");return;}
        I.inv.diamond -= amt;
        I.inv.emerald += emAmt;
    }
    if(GetBuying(args[0]) === 5) { //redstone
      if(I.inv.redstone < amt){Message("Uh oh!", `You don't have enough ${args[0]} !`, message, "ee3333");return;}
        I.inv.redstone -= amt;
        I.inv.emerald += emAmt;
    }
    if(GetBuying(args[0]) === 6) { //lapis
      if(I.inv.lapis < amt){Message("Uh oh!", `You don't have enough ${args[0]} !`, message, "ee3333");return;}
        I.inv.lapis -= amt;
        I.inv.emerald += emAmt;
    }
    if(GetBuying(args[0]) === 7) { //keplerium
      if(I.inv.keplerium < amt){Message("Uh oh!", `You don't have enough ${args[0]} !`, message, "ee3333");return;}
        I.inv.keplerium -= amt;
        I.inv.emerald += Math.floor(1/conversions[GetBuying(args[0])]);
    }
    console.log(I.inv.emeralds);
    Message("Yay!", `You invested ${amt} ${args[0]} and got ${emAmt} emerald in return! You also got ${remain} ${args[0]} back!`, message, "ee33ee");
    I.li = Date.now();
    investamt ++;
    if(investamt < -10) investamt = -10;
    if(investamt > 10) investamt = 10;
    updateInventory(I);
  } else {
      Message("Uh oh!", "That is not an investible material at this time!", message, "ee3333");
  }
};
//em value
var EmValueCommand = function(message, args){
  var yourarray = findYourId(message.author.id);
  if(yourarray == -1){
      makeNewInventory(message);
      yourarray = Invs.length-1;
      console.log("User " + Invs[Invs.length-1].id + " Created!");
  }
  var I = Invs[yourarray];
  updateInventory(I); //you'll need this to access the inventory of the user
  
  if(I.level < 5){
    Message("Uh oh!", "You must be level 5 to use the value command!", message, "ee3333");
    return;
  }
  
  var M = "";
  for(var i = 0;i < materialsToBuy.length;i ++){
    if(conversions[i] < 1){
      M +=`${materialsToBuy[i]}1 = ${Math.floor(1/conversions[i])}${emerald}\n`;
    }
    else{
      M +=`${materialsToBuy[i]}${Math.floor(conversions[i]*1)} = 1 ${emerald}\n`;
    }
  }
  Message("Emerald Value", `An Emerald is **${Math.floor(emvalue*100)}%** of its regular value\nRegular Values:\n${M}`, message, "33ee33");
};
/** MESSAGE FUNCTION */
dbl.webhook.on('ready', hook => {
  console.log(`Webhook running at http://${hook.hostname}:${hook.port}${hook.path}`);
});
dbl.webhook.on('vote', vote => {
  var VotedUser = vote.user;
  var theinv = -1;
  console.log(`User with ID ${vote.user} just voted!`);
  try{
    for(var i = 0;i < Invs.length;i ++){
      if(Invs[i].id === VotedUser.toString()){
        theinv = i;
        var I = Invs[i];
        var cratechance = Math.floor(Math.random()*10)+1;
        if(cratechance === 10){ I.crates[3] ++; bot.users.get(VotedUser).send("You got a Legendary Crate! " + crates[3]);}
        else if(cratechance >= 8){ I.crates[2] ++; bot.users.get(VotedUser).send("You got a Rare Crate! " + crates[2]);}
        else if(cratechance >= 5){ I.crates[1] ++; bot.users.get(VotedUser).send("You got a Uncommon Crate! " + crates[1]);}
        else{ I.crates[0] ++; bot.users.get(VotedUser).send("You got a Common Crate! " + crates[0]);}
      }
    }
    if(theinv === -1){
      makeNewInventory("unknown", VotedUser, VotedUser.toString());
        var I = Invs[Invs.length-1];
        var cratechance = Math.floor(Math.random()*10)+1;
        if(cratechance === 10){ I.crates[3] ++; bot.users.get(VotedUser).send("You got a Legendary Crate! " + crates[3]);}
        else if(cratechance >= 8){ I.crates[2] ++; bot.users.get(VotedUser).send("You got a Rare Crate! " + crates[2]);}
        else if(cratechance >= 5){ I.crates[1] ++; bot.users.get(VotedUser).send("You got a Uncommon Crate! " + crates[1]);}
        else{ I.crates[0] ++; bot.users.get(VotedUser).send("You got a Common Crate! " + crates[0]);}
    }
  }
  catch(error){
    console.log('Uh oh! ' + error);
  }
});
dbl.webhook.on('error', e => {
 console.log(`Oops! ${e}`);
});
var bottype = 2;
bot.on('error', error => { console.log(error);});
bot.on('message', message => {
  //console.log(message.author);
  
  if(message.author.id !== bot.user.id && message.author.bot) return;
    var checkPrefixMessage = message.toString();
    checkPrefixMessage = checkPrefixMessage.toLowerCase();
    //var Member = message.guild.members.get(message.author.id);
    if(checkPrefixMessage.startsWith('kb!') || message.channel.type === 'dm') { //Checks if the user is in a DM or is using the kb! thingy
        if(maintenance === false || (maintenance === true)){
            if(maintenance){
              if(message.channel.type === 'dm'){
                return;
              }
              if(!(message.member.roles.find(r => r.name === "Backup-ers") && message.guild.id === "550036987772403714")){
                return;
              }
            }
            var fullCmd;
            if (checkPrefixMessage.startsWith('kb!')) {
                var fullCmd = message.content.slice(3); //takes out kb! for checking the command
            } else {
                fullCmd = message.content; //message stays as it is
            }
            var nameCmd = fullCmd.split(' ')[0]; //gets the name of the commandi
            //console.log(fullCmd);

            var args = fullCmd.replace(nameCmd, ''); //gets the args and takes out the name of the command
            nameCmd = nameCmd.toLowerCase(); //converts the command to lowercase, so Flip and flip will work for example.
            args = args.slice(1); //takes out the space before the args
            args = args.split(' ');
            //console.log(args[0]);
            if(nameCmd === "about" || nameCmd === "ab"){
                AboutCommand(message);
            }
            else if(nameCmd === "tutorial" || nameCmd === "start"){
                TutorialCommand(message);
            }
            else if(nameCmd === "server"){
                ServerCommand(message);
            }
            else if(nameCmd === "vote" || nameCmd === "v"){
                VoteCommand(message);
            }
            else if(nameCmd === "help" || nameCmd === "h"){
                HelpCommand(message, args);
            }
            else if(nameCmd === "invite"){
                InviteCommand(message);
            }
            else if(nameCmd === "stats"){
                StatsCommand(message);
            }
            else if(nameCmd === "shop" || nameCmd === "s"){
                ShopCommand(message, args);
            }
            else if(nameCmd === "mine" || nameCmd === "m"){
                MineCommand(message, args);
            }
            else if(nameCmd === "inv" || nameCmd === "inventory"){
                InvCommand(message, args);
            }
            else if(nameCmd === "regenland" || nameCmd === "rl"){
                RegenLandCommand(message, args);
            }
            else if(nameCmd === "enchantments" || nameCmd === "enchant"){
                EnchantCommand(message);
            }
            else if(nameCmd === "trade"){
                TradeCommand(message, args);
            }
            else if(nameCmd === "dim" || nameCmd === "dimension"){
                DimensionCommand(message, args);
            }
            else if(nameCmd === "villager"){
                VillagerCommand(message, args);
            }
            else if(nameCmd === "invest"){
                InvestCommand(message, args);
            }
            else if(nameCmd === "buy"){
                BuyCommand(message, args);
            }
            else if(nameCmd === "value" || nameCmd === "emvalue"){
                EmValueCommand(message, args);
            }
            else if(nameCmd === "backup" && (message.author.id.toString() === '374929883698036736' || message.author.id.toString() === "542878436885266474") && message.channel.type === "dm"){
                BackupCommand(message, args);
            }
            else if(nameCmd === "backup" && (message.member.roles.find(r => r.name === "Backup-ers") && message.guild.id === "550036987772403714") && message.channel.type !== "dm"){
                BackupCommand(message, args);
            }
            else if(nameCmd === "backup"){
                message.reply("This only works in the Kepler Miner Server and you have the Backup-ers role! Or if you are KeplerTeddy in DM");
                //message.reply("This is better in DM.");
            }
            else if(nameCmd === "craft"){
                CraftCommand(message, args);
            }
            else if(nameCmd === "multimine" || nameCmd === "mm"){
                MultiMineCommand(message, args);
            }
            else if(nameCmd === "arena"){
                ArenaCommand(message, args);
            }
            else if(nameCmd === "toplist" || nameCmd === "top" || nameCmd === "lb"){
                TopListCommand(message, args);
            }
            else if(nameCmd === "pickaxe"){
                PickaxeCommand(message, args);
            }
            else if(nameCmd === "crate" || nameCmd === "crates"){
                CrateCommand(message, args);
            }
            else if(nameCmd === "add-items" || nameCmd === "additems" || nameCmd === "add"){
                AddItemsCommand(message, args);
            }
            else if(nameCmd === "give" || nameCmd === "pay") {
                GiveCommand(message, args);
            }
            else{
                //message.reply("I have not heard of this command! Do kb!help to see the list of commands!");
            }
        }
        else if(maintenance === true){
        }
    }
    else{
        return;
    }
});

/** WHEN THE BOT IS READY DO THIS */
bot.on('ready', function(){
  console.log(bot.users.size);
  setInterval(() => {
    if(emvalue <= 0.3){ emvalue +=(investamt/100)+(Math.random()*0.1);console.log(`Emerald Value is now ${emvalue}`);}
    else if(emvalue <= 0.6){ emvalue +=(investamt/100)+-0.025+(Math.random()*0.1);console.log(`Emerald Value is now ${emvalue}`);}
    else if(emvalue <= 1.4){ emvalue +=(investamt/100)+-0.05+(Math.random()*0.1);console.log(`Emerald Value is now ${emvalue}`);}
    else if(emvalue <= 2){ emvalue +=(investamt/100)+-0.075+(Math.random()*0.1);console.log(`Emerald Value is now ${emvalue}`);}
    else if(emvalue <= 3){ emvalue +=(investamt/100)+-0.1+(Math.random()*0.1);console.log(`Emerald Value is now ${emvalue}`);}
    if(emvalue < 0.3){emvalue = 0.3;}
    if(emvalue > 3){emvalue = 3;}
  }, 300000);
  setInterval(() => {
        dbl.postStats(bot.guilds.size);
        if(!maintenance){
          if(bottype === 0){
            bottype ++;
            bot.user.setActivity(bot.guilds.size + " Servers | kb!start", { type: 'WATCHING' })
            .then(presence => console.log(`Activity set!`))
            .catch(console.error);
            return;
          }
          if(bottype === 1){
            bottype ++;
            bot.user.setActivity(Invs.length + " Miners | kb!start", { type: 'WATCHING' })
            .then(presence => console.log(`Activity set!`))
            .catch(console.error);
            return;
          }
          if(bottype === 2){
            bottype = 0;
            bot.user.setActivity(Math.floor(emvalue*100) + "% Em Val | kb!start", { type: 'WATCHING' })
            .then(presence => console.log(`Activity set!`))
            .catch(console.error);
            return;
          }
        }
    }, 600000);
    setInterval(() => {
      for(var i = 0;i < Invs.length;i ++){
        if(Date.now() > Invs[i].lastmine+1800000){
          Invs[i].ar = -1;
        }
      }
        BackupQuick();
    }, 60000);
    if(maintenance){
        bot.user.setActivity("Maintenance!!!", { type: 'LISTENING' })
  .then(presence => console.log(`Activity set!`))
  .catch(console.error);
    }
    else{
        bot.user.setActivity(bot.guilds.size + " Servers | kb!help", { type: 'WATCHING' })
  .then(presence => console.log(`Activity set!`))
  .catch(console.error);
    }
    console.log("Bot is now on :P");
});

bot.login(process.env.TOKEN);

