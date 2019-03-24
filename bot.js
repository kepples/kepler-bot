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
const dbl = new DBL(process.env.DBLTOKEN, { webhookServer: server, webhookAuth: 'webhook auth here' }, bot);

/** BIG VARIABLES */
var maintenance = false;
var version = "1.3";
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
        .addField(t, m)
        .setColor(c);
        //.setTimestamp();

    message.channel.send(embed);
};
//Functions
var CoinFlipCommand = function(message){
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
        name: "kb!flip",
        values: "none",
        d: "Flips a coin, either lands on Heads or Tails.",
    },
    {
        name: "kb!dice",
        values: "none",
        d: "Rolls a six sided dice",
    },
    {
        name: "kb!pickfrom [maxnumber]",
        values: "maxnumber: any number",
        d: "Picks a number between 0 and the maximum number",
    },
    {
        name: "kb!about",
        values: "none",
        d: "Info on the kepler bot!",
    },
    {
        name: "kb!invite",
        values: "none",
        d: "Invite the Kepler Bot to your server!",
    },
    {
        name: "kb!server",
        values: "none",
        d: "Invite link for The Kepler Bot Official Server!",
    },
    {
        name: "kb!stats",
        values: "none",
        d: "Stats on The Kepler Bot!",
    },
    {
        name: "kb!vote",
        values: "none",
        d: "Vote for the Kepler Bot and get 100XP!",
    },
    {
        name: "kb!help [page]",
        values: "none",
        d: "This exact command, known as the help command!",
    },
];

//Functions
var AboutCommand = function(message){
    Message("About The Kepler Bot: ", "Created by: KeplerTeddy#1138\nHelpers: spongejr#5845, Bowtieman#1999\nVersion: " + version + "\nProgramming Language: Node.js + Discord.js", message);
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
    Message("Help - " + "Page " + ((page+1) + "/" + Math.floor((Helps.length/5)+1)), fn, message);
};
var InviteCommand = function(message){
    message.reply("\n**Invite link:**\nhttps://bit.ly/2VD18ef");
};
var VoteCommand = function(message){
  //message.reply("\n**Vote for The Kepler Bot:**\nhttps://bit.ly/2JbLSUf");
  let embed = new Commando.RichEmbed()
        .setAuthor(bot.user.username, bot.user.avatarURL)
        .setTitle('Vote for The Kepler Bot!')
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
const datas = require('./datas.js');
const Datas = require('./datas.json');
const rawdata = fs.readFileSync('datas.json');  
const inv = JSON.parse(rawdata);  
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
var createLand = function(I){
    //pickaxe: 0 = wooden, 1 = stone, 2 = iron, 3 = diamond
    I.d = "";
    var pick = I.pick;
    for(var i = 0;i < 7;i ++){
        for(var j = 0;j < 7;j ++){
            var mathrandom = Math.random()*10;
            if(pick == 0){
                if(mathrandom >= 9){
                    I.d += "2";
                }
                else if(mathrandom >= -1){
                    I.d += "1";
                }
            }
            else if(pick == 1){
                if(mathrandom >= 9){
                    I.d += "3";
                }
                else if(mathrandom >= 7){
                    I.d += "2";
                }
                else if(mathrandom >= -1){
                    I.d += "1";
                }
            }
            else if(pick == 2){
                if(mathrandom >= 9.6){
                    I.d += "5";
                }
                else if(mathrandom >= 9){
                    I.d += "4";
                }
                else if(mathrandom >= 8){
                    I.d += "3";
                }
                else if(mathrandom >= 6.5){
                    I.d += "2";
                }
                else if(mathrandom >= -1){
                    I.d += "1";
                }
            }
            else if(pick == 3){
                if(mathrandom >= 9.8){
                    I.d += "6";
                }
                else if(mathrandom >= 9.6){
                    I.d += "5";
                }
                else if(mathrandom >= 8.9){
                    I.d += "4";
                }
                else if(mathrandom >= 7.8){
                    I.d += "3";
                }
                else if(mathrandom >= 6.4){
                    I.d += "2";
                }
                else if(mathrandom >= -1){
                    I.d += "1";
                }
            }
            else if(pick == 4){
                if(mathrandom >= 9.7){
                    I.d += "6";
                }
                else if(mathrandom >= 9.3){
                    I.d += "5";
                }
                else if(mathrandom >= 8.7){
                    I.d += "4";
                }
                else if(mathrandom >= 7.7){
                    I.d += "3";
                }
                else if(mathrandom >= 6.3){
                    I.d += "2";
                }
                else if(mathrandom >= -1){
                    I.d += "1";
                }
            }
            else if(pick == 5){
                if(mathrandom >= 9.6){
                    I.d += "6";
                }
                else if(mathrandom >= 9.2){
                    I.d += "5";
                }
                else if(mathrandom >= 8.6){
                    I.d += "4";
                }
                else if(mathrandom >= 7.8){
                    I.d += "3";
                }
                else if(mathrandom >= 6.5){
                    I.d += "2";
                }
                else if(mathrandom >= -1){
                    I.d += "1";
                }
            }
        }
    }
    console.log("Created world for " + I.id);
};
var createMultiLand = function(){
    //pickaxe: 0 = wooden, 1 = stone, 2 = iron, 3 = diamond
    cml = "";
    for(var i = 0;i < 8;i ++){
        for(var j = 0;j < 8;j ++){
            var mathrandom = Math.random()*10;
            if(mathrandom >= 9.8){
                cml += "6";
            }
            else if(mathrandom >= 9.6){
                cml += "5";
            }
            else if(mathrandom >= 8.9){
                cml += "4";
            }
            else if(mathrandom >= 7.8){
                cml += "3";
            }
            else if(mathrandom >= 6.4){
                cml += "2";
            }
            else if(mathrandom >= -1){
                cml += "1";
            }
        }
    }
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
        },
        pick: 0,
        level: 1,
        mp: {x:4,y:4},
        xp: 0,
        name: Name,
        lastmine: 0,
        lastregen: 0,
        picks: [true, false, false, false, false, false],
        crates: [0, 0, 0, 0],
    });
};
var addPickaxeRoles = function(message, I){
    if(message.channel.type !== 'dm' && (bot.guilds.get(message.guild.id).id).toString() === "550036987772403714"){
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
    }
};
var updateInventory = function(I){
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
  if(I.crates === undefined){
    I.crates = [1, 0, 0, 0]; //common, uncommon, rare, legendary
  }
};
var stone = "<:stone:550125781842395136>";
var iron = "<:iron:550125781859172382>";
var coal = "<:coal:550125781720891399>";
var gold = "<:gold:550738153405677578>";
var redstone = "<:redstone:550738154911432704>";
var lapis = "<:lapis:550738153896542212>";
var diamond = "<:diamond:550738152797765652>";
var random = "<:random:550738153414328405>";
var pickaxes = ["<:wp:550733904051437570>", "<:sp:550733903896379445>", "<:ip:550049621477425176>", "<:dp:550733904009625612>", "<:vp:557200040633040947>", "<:dop:557200041517776896>"];
var air = "<:air:550335949909786625>";
var xps = ["<:xp_0:550744679550025728>", "<:xp_1:550744679327596545>", "<:xp_2:550744679495237643>", "<:xp_3:550744679680049167>", 
        "<:xp_4:550744679776256050>", "<:xp_5:550744679830781967>", 
        "<:xp_6:550744679910473753>", "<:xp_7:550744679562608642>", "<:xp_8:550744679835107340>"];
var xp = "<:xp:550773197398736928>";
var crates = ["<:crate1:557290667135467520>", "<:crate2:557290668003688449>", "<:crate3:557290667986911250>", "<:crate4:557290669647855618>", "<:crate0:557290666883809311>"];
//Functions
var count = 0;
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
      var m = "";
      for(var i = 0;i < 7;i ++){
          m = m + "\n";
          for(var j = 0;j < 7;j ++){
              if(i === I.picky && j === I.pickx){
                  m +=pickaxes[I.pick];
                  if(I.d[i*7+j] == "6"){ 
                      var randit = Math.floor(Math.random()*5);
                      if(randit == 0){
                          I.inv.stone +=100;
                          message.reply("You got 100 stone!");
                      }
                      if(randit == 1){
                          I.inv.coal +=50;
                          message.reply("You got 50 coal!");
                      }
                      if(randit == 2){
                          I.inv.iron +=25;
                          message.reply("You got 25 iron!");
                      }
                      if(randit == 3){
                          I.inv.gold +=15;
                          message.reply("You got 15 gold!");
                      }
                      if(randit == 4){
                          I.inv.diamond +=10;
                          message.reply("You got 10 diamonds!");
                      }
                  }
                  if(I.d[i*7+j] == "5"){ I.inv.diamond ++; I.xp+=10;}
                  if(I.d[i*7+j] == "4"){ I.inv.gold ++; I.xp+=5;}
                  if(I.d[i*7+j] == "3"){ I.inv.iron ++;I.xp+=3;}
                  if(I.d[i*7+j] == "2"){ I.inv.coal ++;I.xp+=1;}
                  if(I.d[i*7+j] == "1"){ I.inv.stone ++;}
                  I.d = replaceInString(I.d, i*7+j, "0");
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
      }
      //console.log(m.length);
      /*let embed = new Commando.RichEmbed()
        .setAuthor(bot.user.username, bot.user.avatarURL)
        .setTitle("**Your Arena**")
        .setDescription(m)
        .setColor("33ee33");*/
      message.channel.send("**Your Arena:**" + m);
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
          "You can get roles in The Official Kepler Bot Server based on your pickaxe!",
          "Check to see if you are on top using `kb!top`",
          "Vote for The Kepler Bot and earn XP! Use the `kb!vote` command to get a link for voting! :D",
          "Don't forget to check how many more materials you need to craft the next pickaxe!",
          "New features are being added every week! Be sure to try them out!",
          "Donating will give you many features! Donate from my website or in The Kepler Bot Official Server, type `donate`!",
          "Join The Kepler Bot Official Server by doing `kb!server`!",
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
  var ID = args[0] || message.author.id;
  if(ID === "" || ID === " "){
    ID = message.author.id;
  }
  console.log(ID);
  
  if(ID[0] === "<" && ID[1] === "@"){
    var tex = ID;
    var TX = "";
    var TODOD = 2;
    if(ID[2] === "!"){
      TODOD = 3;
    }
    for(var i = TODOD;i < tex.length-1;i ++){
      TX +=tex[i];
    }
    ID = TX;
  }
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
        var MMM =  "they have mined:\n" + stone + " " + I.inv.stone + "\n" + coal + " " + I.inv.coal + "\n" + iron + " " + I.inv.iron + "\n" + gold + " " 
        + I.inv.gold + "\n" + diamond + " " + I.inv.diamond + "\n\nLevel: " + I.level + "\n" + xp + XPP;
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
        MMM +="\n\n**THEIR PICKAXES: **" + pickss + "\n**Do kb!pickaxe [pickaxe] to switch your pickaxe!**";
        Message("**" + I.name + "'s Inventory**" + pickaxes[I.pick], MMM, message);
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
    if(I.lastregen+regentime< Date.now()){
      I.lastregen = Date.now();
      I.name = message.author.username.toString();
      createLand(I);
      Message("Created land!", "Do the `kb!mine` command to mine in it!", message);
      addPickaxeRoles(message, I);
    }
    else{
      Message("A little too quick!", "Please wait " + (((I.lastregen+regentime)-Date.now())/1000).toFixed(1) + " Seconds!", message, "ee3333");
    }
};
var filename = "./datas.json";
var BackupQuick = function(){
    var inv = {Invs:Invs};
    var data = JSON.stringify(inv);
    fs.writeFile('datas.json', data, (err) => {  
      if (err) throw err;
      console.log('Data written to file! ' + data.length + " Characters long!");
      console.log(data);
      const rawdata = fs.readFileSync('datas.json');  
      const inv = JSON.parse(rawdata);  
      Invs = inv.Invs;
    });
};
var BackupCommand = function(message, args){
    var inv = {Invs:Invs};
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
    if(I.inv.stone >= 60 && (args[0] === 1 || args[0] === "stone") && I.picks[1] === false){
        I.pick = 1;
        I.inv.stone -=60;
        I.picks[1] = true;
        Message("Crafting Table", "You just got the stone pickaxe! Nice work! " + pickaxes[I.pick], message);
    }
    else if((args[0] === 1 || args[0] === "stone") && I.picks[1] === false){
        Message("Crafting Table", "You need " + (60-I.inv.stone) + " more " + stone, message);
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
        Message("Crafting Table", "You need " + (60-I.inv.iron) + " more " + iron, message);
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
        Message("Crafting Table", "You need " + (60-I.inv.diamond) + " more " + diamond, message);
    }
    else if(args[0] === 3 || args[0] === "diamond"){
      Message("Crafting Table", "You own this pickaxe!", message);
    }
    if(args[0] === ""){
        Message("Crafting Table", "Please add in what pickaxe you want to craft! iron, stone, diamond, etc.", message); 
    }
    addPickaxeRoles(message, I);
};
var MultiMineCommand = function(message, args){
    var yourarray = findYourId(message.author.id);
    if(yourarray == -1){
        makeNewInventory(message);
        yourarray = Invs.length-1;
        console.log("User " + Invs[Invs.length-1].id + " Created!");
    }
    var I = Invs[yourarray];
  
    updateInventory(I);
  
    if(Date.now() > I.lastmine+waittime){
      I.lastmine = Date.now();
      I.name = message.author.username.toString();
      if(cml == "" || args[0] == "recreate"){
        if(args[0] == "recreate" && lastmultiregen+regentime < Date.now()){
          lastmultiregen = Date.now();
          createMultiLand();
        }
        else if(cml != ""){ 
          message.channel.send("Please wait " + (((lastmultiregen+regentime)-Date.now())/1000).toFixed(1) + " Seconds!");
        }
        else if(cml == ""){
          lastmultiregen = Date.now();
          createMultiLand();
        }
      }

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
      var m = "\n**Multiplayer Arena**";
      for(var i = 0;i < 8;i ++){
          m = m + "\n";
          for(var j = 0;j < 8;j ++){
              if(i === I.mp.y && j === I.mp.x){
                  m +=pickaxes[I.pick];
                  if(cml[i*8+j] == "6"){ 
                      var randit = Math.floor(Math.random()*5);
                      if(randit == 0){
                          I.inv.stone +=100;
                          message.reply("You got 100 stone!");
                      }
                      if(randit == 1){
                          I.inv.coal +=50;
                          message.reply("You got 50 coal!");
                      }
                      if(randit == 2){
                          I.inv.iron +=25;
                          message.reply("You got 25 iron!");
                      }
                      if(randit == 3){
                          I.inv.gold +=15;
                          message.reply("You got 15 gold!");
                      }
                      if(randit == 4){
                          I.inv.diamond +=10;
                          message.reply("You got 10 diamonds!");
                      }
                  }
                  if(cml[i*8+j] == "5"){ I.inv.diamond ++; I.xp+=10;}
                  if(cml[i*8+j] == "4"){ I.inv.gold ++; I.xp+=5;}
                  if(cml[i*8+j] == "3"){ I.inv.iron ++;I.xp+=3;}
                  if(cml[i*8+j] == "2"){ I.inv.coal ++;I.xp+=1;}
                  if(cml[i*8+j] == "1"){ I.inv.stone ++;}
                  cml = replaceInString(cml, i*8+j, "0");
              }
              else if(cml[i*8+j] === "6"){
                  m += random;
              }
              else if(cml[i*8+j] === "5"){
                  m += diamond;
              }
              else if(cml[i*8+j] === "4"){
                  m += gold;
              }
              else if(cml[i*8+j] === "3"){
                  m += iron;
              }
              else if(cml[i*8+j] === "2"){
                  m += coal;
              }
              else if(cml[i*8+j] === "1"){
                  m += stone;
              }
              else if(cml[i*8+j] === "0"){
                  var doair = true;
                  for(var k = 0;k < Invs.length;k ++){
                      if(yourarray !== k && doair){
                          var K = Invs[k];
                          if(K.mp.y === i && K.mp.x === j){
                              m +=pickaxes[K.pick];
                              doair = false;
                          }
                      }
                  }
                  if(doair){m += air;}
              }
          }
      }
      /*let embed = new Commando.RichEmbed()
        .setAuthor(bot.user.username, bot.user.avatarURL)
        .setTitle("**Multiplayer Arena**")
        .setDescription(m)
        .setColor("33ee33");*/
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
var TopListCommand = function(message, args){
    
    var yourarray = findYourId(message.author.id);
    if(yourarray == -1){
        makeNewInventory(message);
        yourarray = Invs.length-1;
    }
    var I = Invs[yourarray];
  
    updateInventory(I);
    I.name = message.author.username.toString();
    TopInvs = [];
    for(var i = 0;i < Invs.length;i ++){
        TopInvs.push(Invs[i]);
    }
    TopInvs.sort(function(a,b){return b.level-a.level;});
    var ms = "";
    var maxx = TopInvs.length;
    if(maxx > 10){ maxx = 10;}
    for(var i = 0;i < maxx;i ++){
        ms +=(i+1) + ". " + pickaxes[TopInvs[i].pick];
        ms +=TopInvs[i].name;
        //ms +=tokenToUser(TopInvs[i].id);
        //console.log(tokenToUser(TopInvs[i].id));
        ms +=" - Level " + TopInvs[i].level + "\n";
    }
    if(1+findYourPlace(message.author.id) > 10){ ms +="...\n" + (1+findYourPlace(message.author.id)) + ". " + TopInvs[findYourPlace(message.author.id)].name + " - Level " + TopInvs[findYourPlace(message.author.id)].level;}
    Message("Top 10 Leaderboard!", ms, message, "eeee33");
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
    if(pickk === "wood"){pickk = 0;}
    if(pickk === "stone"){pickk = 1;}
    if(pickk === "iron"){pickk = 2;}
    if(pickk === "diamond"){pickk = 3;}
    if(pickk === "voting"){pickk = 4;}
    if(pickk === "donator"){pickk = 5;}
    pickk = Math.floor(pickk);
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
    var chance = Math.floor(Math.random()*4); //0, 1, 3, 5, 10
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
  }
};
var GiveCommand = function(message, args){
  console.log(args[0].toString());
  if(args[0][0] === "<" && args[0][1] === "@"){
    var tex = args[0];
    var TX = "";
    for(var i = 2;i < tex.length-1;i ++){
      TX +=tex[i];
    }
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
  if(I.id === "374929883698036736"){
    if(args[0] === "" || args[0] === undefined){
      Message("Uh oh!", "Do kb!give <id> <pick:ore:xp:levels> <item:number>", message, "ee3333");
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
        if(args[1] === "xp"){
          SI.xp +=Math.floor(args[2]);
          Message("Give Command", "Gave " + SI.name + " " + args[2] + " XP!", message);
        }
        if(args[1] === "levels"){
          SI.level +=Math.floor(args[2]);
          Message("Give Command", "Gave " + SI.name + " " + args[2] + " Levels!", message);
        }
      }
    }
  }
  else{
    Message("Uh oh!", "You can't use this command unless you are KeplerTeddy!", message, "ee3333");
    return;
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
var bottype = Math.floor(Math.random()*2);
bot.on('error', error => { console.log(error);});
bot.on('message', message => {
  //console.log(message.author);
  if(message.author.id !== bot.user.id && message.author.bot) return;
    if(message.content.startsWith('kb!') || message.channel.type === 'dm') { //Checks if the user is in a DM or is using the kb! thingy
        if(maintenance === false || (maintenance === true && (message.author.id.toString() === '374929883698036736' || message.author.id.toString() === "542878436885266474"))){
            var fullCmd;
            if (message.content.startsWith('kb!')) {
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
            if(nameCmd === "flip" || nameCmd === "f" || nameCmd === "coin"){
                CoinFlipCommand(message);
            }
            else if(nameCmd === "dice" || nameCmd === "d" || nameCmd === "roll"){
                DiceRollCommand(message);
            }
            else if(nameCmd === "pickfrom" || nameCmd === "pick" || nameCmd === "pf"){
                PickFromCommand(message, args);
            }
            else if(nameCmd === "about" || nameCmd === "ab"){
                AboutCommand(message);
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
            else if(nameCmd === "mine" || nameCmd === "m"){
                MineCommand(message, args);
            }
            else if(nameCmd === "inv" || nameCmd === "inventory"){
                InvCommand(message, args);
            }
            else if(nameCmd === "regenland" || nameCmd === "rl"){
                RegenLandCommand(message, args);
            }
            else if(nameCmd === "backup" && (message.author.id.toString() === '374929883698036736' || message.author.id.toString() === "542878436885266474") && message.channel.type === "dm"){
                BackupCommand(message, args);
            }
            else if(nameCmd === "backup" && (message.member.roles.find(r => r.name === "Backup-ers") && message.guild.id === "550036987772403714") && message.channel.type !== "dm"){
                BackupCommand(message, args);
            }
            else if(nameCmd === "backup"){
                message.reply("This only works in the Kepler Bot Server and you have the Backup-ers role! Or if you are KeplerTeddy in DM");
                //message.reply("This is better in DM.");
            }
            else if(nameCmd === "craft"){
                CraftCommand(message, args);
            }
            else if(nameCmd === "multimine" || nameCmd === "mm"){
                MultiMineCommand(message, args);
            }
            else if(nameCmd === "toplist" || nameCmd === "top"){
                TopListCommand(message, args);
            }
            else if(nameCmd === "pickaxe"){
                PickaxeCommand(message, args);
            }
            else if(nameCmd === "crate"){
                CrateCommand(message, args);
            }
            else if(nameCmd === "give"){
                GiveCommand(message, args);
            }
            else{
                //message.reply("I have not heard of this command! Do kb!help to see the list of commands!");
            }
        }
        else if(maintenance === true){
            //message.reply("The Kepler Bot is under maintenance! Try again later!");
        }
    }
    else{
        return;
    }
});

/** WHEN THE BOT IS READY DO THIS */
bot.on('ready', function(){
  setInterval(() => {
        dbl.postStats(bot.guilds.size);
        if(!maintenance){
          if(bottype === 0){
            bottype ++;
            bot.user.setActivity(bot.guilds.size + " Servers | kb!help", { type: 'WATCHING' })
            .then(presence => console.log(`Activity set!`))
            .catch(console.error);
                BackupQuick();
          }
          if(bottype === 1){
            bottype = 0;
            bot.user.setActivity(Invs.length + " Miners | kb!help", { type: 'WATCHING' })
            .then(presence => console.log(`Activity set!`))
            .catch(console.error);
                BackupQuick();
          }
        }
    }, 600000);
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

