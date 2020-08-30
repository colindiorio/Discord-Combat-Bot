# Discord Combat Bot
For fun I created a discord combat bot with [discord.js](https://discord.js.org/) and it allows you to duel your friends. The combat is inspired by RuneScape's duel arena, so it plays a lot like that.

## Gameplay
![Duel Gameplay]()

When you challenge someone to a duel, you enter a turn based combat where you both take turns hitting each other for anywhere from **0 to 25 damage**.  When someone runs out of health they lose.  The only way to get coins to bet currently is to be in a voice call on a server and it gives out a random amount of money (5000-55000) every 5 minutes.

## Usage
If you wish to use the bot, you can download the files and self host it.  Remember to update the bot's token in the config file.

## Commands

 ### Gambling
  * `~bet @user {amount}` challenges another player to a battle for gold
  * `~coins [@user]` shows a player's gold
  * `~profile [@user]` shows a player's profile
  * `~top` shows the top 10 richest players and where you stand
  * `~give @user {amount}` gives another player some of your gold

 ### Misc
  * `~flip` flips a coin
  * `~help` view all these commands
