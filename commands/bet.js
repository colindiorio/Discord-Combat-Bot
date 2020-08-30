const Discord = require('discord.js');
const fs = require('fs');
const challenged = new Set();
const coins = require('../data/coins.json');

module.exports.run = async (bot, message, args) => {
  await message.delete();

  // Gets the first mention in the message then checks if there is one
  let target = message.mentions.members.first();
  if (!target) {
    return message.reply('You must mention a member to bet')
      .then(r => r.delete(10000).catch(err => {}));
  }
  target = target.user;

  // Checks to make sure target is not a bot
  if (target.bot) {
    return message.reply('You can not challenge a bot')
      .then(r => r.delete(10000).catch(err => {}));
  }

  // Checks to make sure they aren't challenging themselves
  if (message.author.id === target.id) {
    return message.reply('You can\'t bet against yourself')
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
  let bet = args[1];
  if (bet && bet.toLowerCase() === 'all') {
    if (coins[message.author.id].coins > coins[target.id.coins]) {
      bet = coins[target.id].coins;
    } else {
      bet = coins[message.author.id].coins;
    }
  }

  // Gets the price argument then checks if there was one given
  bet = bet === args[1] ? parseInt(args[1]) : bet;
  if (!bet || isNaN(bet) || bet < 1) {
    return message.reply('`~bet @user {amount}`')
      .then(r => r.delete(10000).catch(err => {}));
  }

  // Checks if target is challenged by someone else
  if (challenged.has(target.id)) {
    return message.reply('Target is already being challenged')
      .then(r => r.delete(10000).catch(err => {}));
  }

  // Checks if sender is already challenging someone or being challenged
  if (challenged.has(message.author.id)) {
    return message.reply('You are already challenging someone')
      .then(r => r.delete(10000).catch(err => {}));
  }

  // Checks if sender has enough coins
  if (coins[message.author.id].coins < bet) {
    return message.reply('You do not have enough coins for this bet')
      .then(r => r.delete(10000).catch(err => {}));
  }

  // Checks if target has enough coins
  if (coins[target.id].coins < bet) {
    return message.reply('Target doesn\'t have enough coins for this bet')
      .then(r => r.delete(10000).catch(err => {}));
  }

  challenged.add(target.id);
  challenged.add(message.author.id);

  // States the challenge in chat
  message.channel.send(`${target} you have been challenged by ` +
    `${message.author.username} for ${bet.toLocaleString()} ` +
    '<:coins:743231902844190780>\n\nRespond with reactions below ' +
    'in the next 20 seconds.').then(async challengeMsg => {
    // Add reactions for responses (in order)
    await challengeMsg.react('✅');
    await challengeMsg.react('❌');

    // Filters for targets response
    const filter = (response, user) => user.id === target.id &&
      ['✅', '❌'].includes(response.emoji.name);

    challengeMsg.awaitReactions(filter, {
      max: 1,
      time: 20000
    }).then(collected => {
      // Checks if they don't want to bet
      if (collected.first().emoji.name === '❌') {
        challengeMsg.delete();

        challenged.delete(target.id);
        challenged.delete(message.author.id);

        return message.reply('Challenge denied').then(r => r.delete(10000));
      } else if (collected.first().emoji.name === '✅') {
        challengeMsg.delete();

        // Setting up variables for reference
        const starter = Math.floor(Math.random() * 2);
        const player1 = starter === 0 ? target : message.author;
        const player2 = starter === 0 ? message.author : target;

        // Starting fight message
        const coinEmbed = new Discord.RichEmbed()
          .setColor('#64a4ff')
          .setAuthor(`Bet: ${bet.toLocaleString()} | Prefight`,
            bot.user.avatarURL)
          .addField(player1.username, '99 / 99\n' +
            ':heart: :heart: :heart: :heart: :heart:', true)
          .addField(player2.username, '99 / 99\n' +
            ':heart: :heart: :heart: :heart: :heart:', true);

        // Initiate the fight message
        return message.channel.send(coinEmbed).then(m => {
          // Get health values from fields
          let p1 = parseInt(coinEmbed.fields[0].value.split(' ')[0]);
          let p2 = parseInt(coinEmbed.fields[1].value.split(' ')[0]);
          let turn = 1;

          // Repeating task that ends if one player dies
          const update = setInterval(async function () {
            const hit = Math.floor(Math.random() * 26);
            let u1 = `${p1} / 99\n${getHearts(p1)}`;
            let u2 = `${p2} / 99\n${getHearts(p2)}`;

            // Changes between the 2 players
            if (turn % 2 !== 0) {
              p2 -= hit;
              u2 = `${p2} / 99 **(-${hit})**\n${getHearts(p2)}`;
            } else {
              p1 -= hit;
              u1 = `${p1} / 99 **(-${hit})**\n${getHearts(p1)}`;
            }

            // Updates the message and increments the turn counter
            coinEmbed.fields[0].value = u1;
            coinEmbed.fields[1].value = u2;
            coinEmbed.setAuthor(`Bet: ${bet.toLocaleString()} | ` +
              `Attack ${turn}`, bot.user.avatarURL);

            m.edit(coinEmbed);
            turn++;

            // Triggers on win
            if (p1 < 1 || p2 < 1) {
              // Stops repeating task
              clearInterval(update);
              // Update variables and the fight message
              const winner = p1 < 1 ? player2 : player1;
              const loser = p1 < 1 ? player1 : player2;

              coinEmbed.setAuthor(`WINNER -> ${winner.username} ` +
                `(+${bet.toLocaleString()})`, winner.avatarURL);
              coins[winner.id].coins += bet;
              coins[loser.id].coins -= bet;

              coins[winner.id].wins = !coins[winner.id].wins
                ? 1 : coins[winner.id].wins += 1;

              coins[loser.id].losses = !coins[loser.id].losses
                ? 1 : coins[loser.id].losses += 1;

              coins[winner.id].gainedCoins = !coins[winner.id].gainedCoins
                ? bet : coins[winner.id].gainedCoins += bet;

              coins[loser.id].lostCoins = !coins[loser.id].lostCoins
                ? bet : coins[loser.id].lostCoins += bet;

              // Save the new coin balances
              fs.writeFile('./data/coins.json', JSON.stringify(coins),
                (err) => {
                  if (err) console.log(err);
                });

              challenged.delete(target.id);
              challenged.delete(message.author.id);

              // Shows win message
              m.edit(coinEmbed).then(c => {
                c.delete(15000);
              });
            }
          }, 3000);
        });
      }

    // Handles the error if it doesn't get a response
    }).catch(err => {
      if (err);

      challengeMsg.delete();
      challenged.delete(target.id);
      challenged.delete(message.author.id);

      return message.reply('Challenge canceled').then(r => r.delete(10000)
        .catch(err => {}));
    });
  });
};

function getHearts (hp) {
  const hearts = [':heart:', ':heart:', ':heart:', ':heart:', ':heart:'];

  if (hp === 0) hp = -1;
  for (let i = Math.floor(hp / 20) + 1; i < 5; i++) {
    hearts[i] = ':black_heart:';
  }

  if (Math.floor(hp / 10) / 2 === Math.floor(hp / 20)) {
    hearts[Math.floor(hp / 20)] = ':broken_heart:';
  }

  return hearts.join(' ');
}

module.exports.challengeSet = challenged;

// This is where it gets the command to process in chat (!coins)
module.exports.help = {
  name: 'bet'
};
