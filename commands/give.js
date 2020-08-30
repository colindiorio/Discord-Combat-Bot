const fs = require('fs');
const challenges = require('./bet.js');
const coins = require('../data/coins.json');

module.exports.run = async (bot, message, args) => {
  await message.delete();

  // Gets the first mention in the message then checks if there is one
  let target = message.mentions.members.first();
  if (!target) {
    return message.reply('You must mention a member to send gold')
      .then(r => r.delete(10000).catch(err => {}));
  }
  target = target.user;

  // Checks to make sure target is not a bot
  if (target.bot) {
    return message.reply('You can not give gold to a bot')
      .then(r => r.delete(10000).catch(err => {}));
  }

  // Checks to make sure they aren't challenging themselves
  if (message.author.id === target.id) {
    return message.reply("You can't give yourself gold")
      .then(r => r.delete(10000).catch(err => {}));
  }

  // Checks if sender has gold and sets to 0 if not
  if (!coins[message.author.id]) {
    coins[message.author.id] = {
      coins: 0
    };
  }

  // Checks if target has gold and sets to 0 if not
  if (!coins[target.id]) {
    coins[target.id] = {
      coins: 0
    };
  }

  // Checks for all argument
  let amount = args[1];

  if (amount && amount.toLowerCase() === 'all') {
    if (coins[message.author.id].coins > coins[target.id.coins]) {
      amount = coins[target.id].coins;
    } else {
      amount = coins[message.author.id].coins;
    }
  }

  // Gets the price argument then checks if there was one given
  amount = amount === args[1] ? parseInt(args[1]) : amount;

  if (!amount || isNaN(amount) || amount < 1) {
    return message.reply('`~give @user {amount}`')
      .then(r => r.delete(10000).catch(err => {}));
  }

  // Checks if target is challenged by someone else
  if (challenges.challengeSet.has(target.id)) {
    return message.reply('You can not send money to people that are in combat')
      .then(r => r.delete(10000).catch(err => {}));
  }

  // Checks if sender is already challenging someone or being challenged
  if (challenges.challengeSet.has(message.author.id)) {
    return message.reply('You can not send money while in combat')
      .then(r => r.delete(10000).catch(err => {}));
  }

  // Checks if sender has enough coins
  if (coins[message.author.id].coins < amount) {
    return message.reply('You do not have enough gold for this action')
      .then(r => r.delete(10000).catch(err => {}));
  }

  coins[target.id].coins += amount;
  coins[target.id].username = target.username;
  coins[message.author.id].coins -= amount;
  coins[message.author.id].username = message.author.username;

  fs.writeFile('./data/coins.json', JSON.stringify(coins), (err) => {
    if (err) console.log(err);
  });

  return message.channel.send(`${target} you have recieved` +
    `${amount.toLocaleString()} ` + '<:coins:743231902844190780> from ' +
    `${message.author.username}`).then(r => r.delete(15000));
};

module.exports.help = {
  name: 'give'
};
