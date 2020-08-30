const Discord = require('discord.js');
const coins = require('../data/coins.json');

module.exports.run = async (bot, message, args) => {
  // Deletes user sent message
  await message.delete();
  let targetUser = message.author;

  // Checks if there is a target
  const target = message.mentions.members.first();
  if (target) targetUser = target.user;

  // Gets the coins that the user has
  const uCoins = (coins[targetUser.id] && coins[targetUser.id].coins) || 0;

  // Creates embeded message
  const coinEmbed = new Discord.RichEmbed()
    .setAuthor(targetUser.username, targetUser.avatarURL)
    .setColor('#64a4ff')
    // Uses custom emoji from my server + localString has commas in the number
    .setDescription(`<:coins:743231902844190780> ${uCoins.toLocaleString()}`);

  // Sends message then deletes it in 10 seconds (10 * 1000)
  return message.channel.send(coinEmbed).then(m => m.delete(10000)
    .catch(err => {}));
};

// This is where it gets the command to process in chat (!coins)
module.exports.help = {
  name: 'coins'
};
