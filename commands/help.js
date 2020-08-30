const { prefix } = require('../data/config.json');

module.exports.run = async (bot, message, args) => {
  await message.delete();

  // Format: :white_large_square: `{prefix}{commandName} {arguments}` - {description}
  return message.channel.send(
    '**GAMBLING COMMANDS**\n' +
    `:white_large_square: \`${prefix}bet @user {amount}\` - Challenges another player to a battle for gold\n` +
    `:white_large_square: \`${prefix}coins [@user]\` - Shows a player's gold\n` +
    `:white_large_square: \`${prefix}profile [@user]\` - Shows a player's betting record\n` +
    `:white_large_square: \`${prefix}top\` - Shows the top 10 richest players\n` +
    `:white_large_square: \`${prefix}give @user {amount}\` - Gives another player gold\n` +

    '\n**MISC COMMANDS**\n' +
    `:white_large_square: \`${prefix}flip\` - Flip a coin\n` +

    '\n**SOURCE CODE**\n' +
    '<https://github.com/cresyls/RuneBoi>')
    .then(m => m.delete(15000).catch(err => {}));
};

module.exports.help = {
  name: 'help'
};
