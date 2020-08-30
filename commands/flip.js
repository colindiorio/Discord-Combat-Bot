module.exports.run = async (bot, message, args) => {
  await message.delete();

  const possibleOutcomes = ['Heads :face_with_monocle:', 'Tails :eagle:'];
  const selectedOutcome = Math.floor(Math.random() * possibleOutcomes.length);
  const finalOutcome = possibleOutcomes[selectedOutcome];

  return message.channel.send(`You flipped **${finalOutcome}**`)
    .then(m => m.delete(3500).catch(err => {}));
};

module.exports.help = {
  name: 'flip'
};
