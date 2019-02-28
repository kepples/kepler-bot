const commando = require('discord.js-commando');

const mine = require('./mine.js');
const Invs = mine.Invs;
var findYourId = mine.findyourid;
var createLand = mine.createLand;
class RegenLandCommand extends commando.Command
{
    constructor(client){
        super(client,{
            name: "regenland",
            group: "kepminer",
            memberName: "regenland",
            description: "Regenerate Your Land",
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
                    iron:0
                },
                pick: 0,
            });
            yourarray = Invs.length-1;
        }
        var I = Invs[yourarray];
        createLand(I);
        message.reply("Created land! Do the mine command to mine in it!");
    }
}

module.exports = RegenLandCommand;