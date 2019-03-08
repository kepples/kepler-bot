const Commando = require('discord.js-commando');
const bot = new Commando.Client({commandPrefix: 'keplerbot!'});
const token = require('./token.js');
const TOKEN = token.token;

/** BIG VARIABLES */
var maintenance = false;
var version = "1.0";

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
//Functions
var CoinFlipCommand = function(message){
    var chance = Math.floor(Math.random()*2);
    if(chance == 0){
        message.reply("Your coin landed on Heads! " + coins[0]);
    }
    else if(chance == 1){
        message.reply("Your coin landed on Tails! " + coins[1]);//, {files:[__dirname+"/data/TailsCoin.png"]}
    }
};
var DiceRollCommand = function(message){
    var chance = 1 + Math.floor(Math.random()*6);
    message.reply("The dice rolled a " + chance + "!" + "  " + dice[chance-1]);
};
var PickFromCommand = function(message, args){
    var num = Math.floor(args[0]);
    var chance = Math.floor(Math.random()*num);
    message.reply("The number I have chosen is " + chance);
};

/** OTHER COMMANDS */
//Variables
var Helps = [
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
        name: "kb!help [page]",
        values: "none",
        d: "This exact command, known as the help command!",
    },
    {
        name: "kb!mine [dir] or kb!m [dir]",
        values: "dir: right, left, up or down, can use single letters as well",
        d: "Mines a block in the direction said with your pickaxe",
    },
    {
        name: "kb!inv or kb!inventory",
        values: "none",
        d: "This exact command, known as the help command!",
    },
    {
        name: "kb!regenland or kb!rl",
        values: "none",
        d: "This exact command, known as the help command!",
    },
    {
        name: "kb!backup",
        values: "none",
        d: "Backups the user data",
    },
    {
        name: "kb!craft",
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
];

//Functions
var AboutCommand = function(message){
    message.reply("\nThe Kepler Bot:\nCreated by: KeplerTeddy#1138\nVersion: " + version + "\nProgramming Language: Node.js + Discord.js");
};

var HelpCommand = function(message, args){
    
    var fn = "**HELP:**\n";
    var page = 0 || (Math.floor(args[0])-1);
    if(page < 0 || page > Math.floor(Helps.length/5)){
        page = 0;
    }
    var maxx = (page*5)+5;
    fn +="Page " + (page+1) + "/" + Math.floor((Helps.length/5)+1);
    if(maxx >= Helps.length){maxx=Helps.length;}
    for(var i = page*5;i < maxx;i ++){
        //console.log(i);
        fn +="\n**" + Helps[i].name + "**\nValues: " + Helps[i].values + "\nDescription: " + Helps[i].d;
    }
    fn +="\n\nIf you want to switch to another page use **\"kb!help [page number]\"**";
    message.reply(fn);
};
var InviteCommand = function(message){
    message.reply("\n**Invite link:**\nhttps://bit.ly/2VD18ef");
};

/** KEPLER MINER COMMANDS */

///Variables
const datas = require('./data/datas.js');
const Invs = datas.Invs;
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
var tokenToUser = async function(id){
    await bot.fetchUser(id.toString())
    .then(user => {
       return user;
   }).catch(error => {
       return error;
    // here you can also try log it to console
  });
};
var makeNewInventory = function(){
    Invs.push({
        pickx: 3,
        picky: 3,
        id: message.author.id.toString(),
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
        name: message.author.username.toString(),
    });
};
var addPickaxeRoles = function(message, I){
    if(I.pick >= 0){
        var role = message.guild.roles.find(role => role.name === "Wooden Pickaxe");
        message.member.addRole(role);
    }
    if(I.pick >= 1){
        var role = message.guild.roles.find(role => role.name === "Stone Pickaxe");
        message.member.addRole(role);
    }
    if(I.pick >= 2){
        var role = message.guild.roles.find(role => role.name === "Iron Pickaxe");
        message.member.addRole(role);
    }
    if(I.pick >= 3){
        var role = message.guild.roles.find(role => role.name === "Diamond Pickaxe");
        message.member.addRole(role);
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
var pickaxes = ["<:wooden_pickaxe:550733904051437570>", "<:stone_pickaxe:550733903896379445>", "<:iron_pickaxe:550049621477425176>", "<:diamond_pickaxe:550733904009625612>"];
var air = "<:darkenedstone:550335949909786625>";
var xps = ["<:xp_0:550744679550025728>", "<:xp_1:550744679327596545>", "<:xp_2:550744679495237643>", "<:xp_3:550744679680049167>", 
        "<:xp_4:550744679776256050>", "<:xp_5:550744679830781967>", 
        "<:xp_6:550744679910473753>", "<:xp_7:550744679562608642>", "<:xp_8:550744679835107340>"];
var xp = "<:xp:550773197398736928>";
//Functions
var MineCommand = function(message, args){
    var yourarray = findYourId(message.author.id);
    if(yourarray == -1){
        makeNewInventory();
        yourarray = Invs.length-1;
        console.log("User " + Invs[Invs.length-1].id + " Created!");
    }
    console.log(message.author.username.toString());
    var I = Invs[yourarray];
    if(I.d == ""){createLand(I);}
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
    console.log(m.length);
    message.reply(m);
    if(I.xp >= I.level*10){
        I.xp -=I.level*10;
        I.level ++;
        message.reply(xp + "You just got to level " + I.level + "! " + xp);
    }
    var tips = [
        "If you get 60 stone, you can craft a stone pickaxe using \'kb!craft\'! Same goes for other materials like iron and diamond!",
        "Are you out of land? Use the \'kb!regenland\' command when you require new land!",
        "There might be a special ore you can find if you manage to get diamond!",
        "Gold is currently useless but you can soon use it to boost your pickaxe!",
        "Is there something that should be added to the bot? DM me or tell me on the official bot server!",
    ];
    if(Math.random()*10 > 8){
        message.reply("**TIP: **" + tips[Math.floor(Math.random()*tips.length)]);
    }
    addPickaxeRoles(message, I);
    
};
var InvCommand = function(message, args){
    var yourarray = findYourId(message.author.id);
        if(yourarray == -1){
            makeNewInventory();
            yourarray = Invs.length-1;
        }
        var I = Invs[yourarray];
        I.name = message.author.username.toString();
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
        message.reply("\n **" + message.member.user.tag.toString() + "'s Inventory** " + pickaxes[I.pick] + "\nYou have mined:\n" 
        + stone + " " + I.inv.stone + "\n" + coal + " " + I.inv.coal + "\n" + iron + " " + I.inv.iron + "\n" + gold + " " 
        + I.inv.gold + "\n" + diamond + " " + I.inv.diamond + "\n\nLevel: " + I.level + "\n" + xp + XPP);
        addPickaxeRoles(message, I);
};
var RegenLandCommand = function(message, args){
    var yourarray = findYourId(message.author.id);
    if(yourarray == -1){
        makeNewInventory();
        yourarray = Invs.length-1;
    }
    var I = Invs[yourarray];
    I.name = message.author.username.toString();
    createLand(I);
    message.reply("Created land! Do the mine command to mine in it!");
    addPickaxeRoles(message, I);
};
var BackupCommand = function(message, args){
    console.log("STARTING BACKUP");
    console.log(Invs);
    console.log("FINSHED BACKUP");
    message.reply("Data has been backed up successfully! There are " + Invs.length + " user datas stored!");
};
var CraftCommand = function(message, args){

    var yourarray = findYourId(message.author.id);
    if(yourarray == -1){
        makeNewInventory();
        yourarray = Invs.length-1;
    }
    var I = Invs[yourarray];
    I.name = message.author.username.toString();
    if(I.pick == 0){
        if(I.inv.stone >= 60){
            I.pick = 1;
            I.inv.stone -=60;
            message.reply("You just got the stone pickaxe! " + pickaxes[I.pick]);
        }
        else{
            message.reply("You need " + (60-I.inv.stone) + " more " + stone);
        }
    }
    else if(I.pick == 1){
        if(I.inv.iron >= 60){
            I.pick = 2;
            I.inv.iron -=60;
            message.reply("You just got the iron pickaxe! " + pickaxes[I.pick]);
        }
        else{
            message.reply("You need " + (60-I.inv.iron) + " more " + iron);
        }
    }
    else if(I.pick == 2){
        if(I.inv.diamond >= 60){
            I.pick = 3;
            I.inv.diamond -=60;
            message.reply("You just got the DIAMOND pickaxe! What a god! " + pickaxes[I.pick]);
        }
        else{
            message.reply("You need " + (60-I.inv.diamond) + " more " + diamond);
        }
    }
    else{
        message.reply("You own the maximum pickaxe!");
    }
    addPickaxeRoles(message, I);
};
var MultiMineCommand = function(message, args){
    var yourarray = findYourId(message.author.id);
    if(yourarray == -1){
        makeNewInventory();
        yourarray = Invs.length-1;
        console.log("User " + Invs[Invs.length-1].id + " Created!");
    }
    var I = Invs[yourarray];
    I.name = message.author.username.toString();
    if(cml == "" || args[0] == "recreate"){createMultiLand();}
    
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
    var m = "";
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
    message.reply(m);
    if(I.xp >= I.level*10){
        I.xp -=I.level*10;
        I.level ++;
        message.reply(xp + "You just got to level " + I.level + "! " + xp);
    }
    addPickaxeRoles(message, I);
    //console.log(m.length);
};
var TopListCommand = function(message, args){
    
    var yourarray = findYourId(message.author.id);
    if(yourarray == -1){
        makeNewInventory();
        yourarray = Invs.length-1;
    }
    var I = Invs[yourarray];
    I.name = message.author.username.toString();
    TopInvs = [];
    for(var i = 0;i < Invs.length;i ++){
        TopInvs.push(Invs[i]);
    }
    TopInvs.sort(function(a,b){return b.level-a.level;});
    var ms = "**TOP 10 LEADERBOARD**\n";
    var maxx = TopInvs.length;
    if(maxx > 10){ maxx = 10;}
    for(var i = 0;i < maxx;i ++){
        ms +=(i+1) + ". ";
        ms +=TopInvs[i].name;
        //ms +=tokenToUser(TopInvs[i].id);
        //console.log(tokenToUser(TopInvs[i].id));
        ms +=" - Level " + TopInvs[i].level + "\n";
    }
    if(1+findYourPlace(message.author.id) > 10){ ms +="...\n" + (1+findYourPlace()) + ". " + message.author.name + " - Level " + TopInvs[i].level;}
    message.reply(ms);
    addPickaxeRoles(message, I);
};
/** MESSAGE FUNCTION */
bot.on('message', function(message){
    if(message.content.startsWith('kb!') || message.channel.type === 'dm') { //Checks if the user is in a DM or is using the kb! thingy
        if(maintenance === false || (maintenance === true && message.member.user.tag.toString() === "KeplerTeddy#1138")){
            var fullCmd;
            if (message.content.startsWith('kb!')) {
                var fullCmd = message.content.slice(3); //takes out kb! for checking the command
            } else {
                fullCmd = message.content; //message stays as it is
            }
            var nameCmd = fullCmd.split(' ')[0]; //gets the name of the command
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
            else if(nameCmd === "help" || nameCmd === "h"){
                HelpCommand(message, args);
            }
            else if(nameCmd === "invite"){
                InviteCommand(message);
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
            else if(nameCmd === "backup"){
                BackupCommand(message, args);
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
            else{
                message.reply("I have not heard of this command! Do kb!help to see the list of commands!");
            }
        }
        else if(maintenance === true){
            message.reply("The Kepler Bot is under maintenance! Try again later!");
        }
    }
    else{
        return;
    }
});

/** WHEN THE BOT IS READY DO THIS */
bot.on('ready', function(){
    if(maintenance){
        bot.user.setActivity("Maintenance!!!", { type: 'LISTENING' })
  .then(presence => console.log(`Activity set to ${presence.activity.name}`))
  .catch(console.error);
    }
    else{
        bot.user.setActivity("Kepler Bot | kb!help", { type: 'PLAYING' })
  .then(presence => console.log(`Activity set to ${presence.activity.name}`))
  .catch(console.error);
    }
    console.log("Bot is now on :P");
});

bot.login(TOKEN); //how to turn on bot, type "node .", to turn it off do CTRL-C.

