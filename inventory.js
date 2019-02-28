const commando = require('discord.js-commando');

const mine = require('./mine.js');
const Invs = mine.Invs;
var findYourId = mine.findyourid;
class InventoryCommand extends commando.Command
{
    constructor(client){
        super(client,{
            name: "inv",
            group: "kepminer",
            memberName: "inv",
            description: "Opens your inventory from mining!"
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
        var xp = "<:xp:550773197398736928>";
        var pickaxes = ["<:wooden_pickaxe:550733904051437570>", "<:stone_pickaxe:550733903896379445>", "<:iron_pickaxe:550049621477425176>", "<:diamond_pickaxe:550733904009625612>"];
        var xps = ["<:xp_0:550744679550025728>", "<:xp_1:550744679327596545>", "<:xp_2:550744679495237643>", "<:xp_3:550744679680049167>", 
        "<:xp_4:550744679776256050>", "<:xp_5:550744679830781967>", 
        "<:xp_6:550744679910473753>", "<:xp_7:550744679562608642>", "<:xp_8:550744679835107340>"];
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
    }
}

module.exports = InventoryCommand;