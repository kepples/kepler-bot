const commando = require('discord.js-commando');

const mine = require('./mine.js');
const Invs = mine.Invs;
var findYourId = mine.findyourid;
class CraftCommand extends commando.Command
{
    constructor(client){
        super(client,{
            name: "craft",
            group: "kepminer",
            memberName: "craft",
            description: "Craft a pickaxe! Required 60 of required material"
        });
    }

    async run(message, args){
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
        }
        var I = Invs[yourarray];
        var stone = "<:stone:550125781842395136>";
        var iron = "<:iron:550125781859172382>";
        var coal = "<:coal:550125781720891399>";
        var gold = "<:gold:550738153405677578>";
        var diamond = "<:diamond:550738152797765652>";
        var pickaxes = ["<:wooden_pickaxe:550733904051437570>", "<:stone_pickaxe:550733903896379445>", "<:iron_pickaxe:550049621477425176>", "<:diamond_pickaxe:550733904009625612>"];
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
    }
}

module.exports = CraftCommand;