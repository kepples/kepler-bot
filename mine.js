const commando = require('discord.js-commando');
var Invs = [ { pickx: 6,
    picky: 6,
    id: '374929883698036736',
    d: '1121112111111111211121111111111111111111111112110',
    inv: { stone: 45, coal: 5, iron: 0, gold: 0, diamond: 0 },
    pick: 0,
    level: 1,
    xp: 0 } ];
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
// air = 0, stone = 1, coal = 2, iron = 3, gold = 4, diamond = 5, random = 6,
class MineCommand extends commando.Command
{
    constructor(client){
        super(client,{
            name: "mine",
            group: "kepminer",
            memberName: "mine",
            description: "Mine stuff with your pickaxe!"
        });
    }

    async run(message, args){
        //console.log(message.content);
        //console.log(d);
        //console.log(d.length);
        var yourarray = findYourId(message.author.id);
        if(yourarray == -1){
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
                xp: 0,
            });
            yourarray = Invs.length-1;
            console.log("User " + Invs[Invs.length-1].id + " Created!");
        }
        var I = Invs[yourarray];
        if(I.d == ""){createLand(I);}
        if((args == "right" || args == "r") && I.pickx < 6){
            I.pickx ++;
        }
        if((args == "left" || args == "l") && I.pickx > 0){
            I.pickx --;
        }
        if((args == "down" || args == "d") && I.picky < 6){
            I.picky ++;
        }
        if((args == "up" || args == "u") && I.picky > 0){
            I.picky --;
        }
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
                    if(I.xp >= I.level*10){
                        I.xp -=I.level*10;
                        I.level ++;
                    }
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
        message.reply(m);
    }
}

module.exports = MineCommand;
module.exports.Invs = Invs;
module.exports.findyourid = findYourId;
module.exports.createLand = createLand;