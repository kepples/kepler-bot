const commando = require('discord.js-commando');

const mine = require('./mine.js');
const Invs = mine.Invs;
var findYourId = mine.findyourid;
var createLand = mine.createLand;
class BackupDataCommand extends commando.Command
{
    constructor(client){
        super(client,{
            name: "backup",
            group: "kepminer",
            memberName: "backup",
            description: "Backup the data for Kepler Miner!",
        });
    }

    async run(message, args){
        console.log(Invs);
        message.reply("Data has been backed up successfully! There are " + Invs.length + " user datas stored!");
    }
}

module.exports = BackupDataCommand;