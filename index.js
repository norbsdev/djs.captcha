const axios = require('axios');
const { MessageEmbed } = require('discord.js');
const { EventEmitter } = require('events');

class Captcha extends EventEmitter {
  Captcha_Emit = this
  constructor(client, options) {
    super();
    this.client = client;
    this.options = options;
    require('discord-buttons')(client);

    client.on('ready', async () => {
            console.log('> [djs.captcha loaded]')
      if (!options.channelID) {
        console.log('> [djs.captcha] \x1b[31mError\x1b[0m You did not provide a channel ID!')
        process.exit(1)
      }
      if (!options.roleID) {
         console.log('> [djs.captcha] \x1b[31mError\x1b[0m You did not provide a role ID!');
        process.exit(1)
      }

      if (!options.onFail) {
        console.log('> [djs.captcha] \x1b[31mError\x1b[0m You did not provide "kick" or "ban" for onFail option!')
        process.exit(1)
      }

      const Channel = client.channels.cache.find(channel => channel.id === options.channelID);
      if (!Channel) {
        console.log('> [djs.captcha] \x1b[93mWarning\x1b[0m The channel ' + options.channelID + ' does not exist or I do not have permissions to see it.')
         process.exit(1)
      }
      const Role = Channel.guild.roles.cache.find(role => role.id === options.roleID);

      if (!Role) {
      console.log('> [djs.captcha] \x1b[93mWarning\x1b[0m The role ' + options.roleID + ' does not exist.')
       process.exit(1)
      }
      const Messages = await Channel.messages.fetch({
        limit: 100
      });

      if (1 < Messages.size) {
        console.log('> [djs.captcha] \x1b[93mWarning\x1b[0m There are messages in the channel. Please delete them before running.')
         process.exit(1)
      } 

      let e;
      if (options.onFail.toLowerCase() === "ban") {
        e = "banned";
      } else if (options.onFail.toLowerCase() === "kick") {
        e = "kicked";
      }
      if (Messages.first()) {
        if (!Messages.first().author.bot) { 
          console.log('> [djs.captcha] \x1b[93mWarning\x1b[0m There are messages in the channel. Please delete them before running.')
                 process.exit(1)
                 }
      } else {
        Channel.send('', {
          button: {
            "type": 2,
            "style": 3,
            "label": 'Verify',
            "disabled": false,
            "custom_id": 'Verify_Button'
          },
          embed: {
            "title": 'Verification',
            "type": 'rich',
            "description": `Press Verify to gain access to the rest of the server! \n ⚠ If you fail, you will be ${e}! ⚠`
          }
        }).catch(err => {
          console.log("> [djs.captcha] \x1b[31mError\x1b[0m I can not send messages in the verification channel!")
                   process.exit(1)
        })
      }

      client.on('message', message => {
        if (message.channel.id === options.channelID) {
          if (message.author.bot) return;
          message.delete({
            timeout: 100
          })
        }
      })
      const Emit = this.Captcha_Emit

      function succeeded(info) {
        Emit.emit('success', info)
      }

      function failed(info) {
        Emit.emit('failure', info)
      }
      client.on('clickButton', async (button) => {

        if (button.id === 'Verify_Button') {

          let trys = 0

          async function captcha() {
            const response = await axios.default.get('https://api.no-api-key.com/api/v2/captcha')

            if (trys > 0) button.reply.edit({
              content: "You failed the captcha!",
              ephemeral: true
            })

            let embed;
            if (options.onFail.toLowerCase() === "ban") {
              embed = new MessageEmbed()
                .setTitle(`If you fail, You will be banned!`)
                .setImage(response.data.captcha);
            }

            if (options.onFail.toLowerCase() === "kick") {
              embed = new MessageEmbed()
                .setTitle(`If you fail, You will be kicked!`)
                .setImage(response.data.captcha);
            }
            if (trys == 0) await button.reply.send({
              embed: embed,
              content: null,
              ephemeral: true
            })

            const filter = m => m.author.id === button.clicker.id;

            const collecter = button.channel.createMessageCollector(filter, {
              max: 1
            });

            collecter.on("end", (resp) => {

              resp.forEach((val) => {
                let m = val.content.toLowerCase();
                let ans = m === response.data.captcha_text ? true : false;
                trys++
                let info = {
                  succeeded: ans,
                  trys: trys,
                  response: m,
                  correct_response: response.data.captcha_text,
                  user: button.clicker.member.user,
                }
                if (ans == true) {

                  if (!button.clicker.member.manageable) {
                    console.log('> [djs.captcha] \x1b[93mWarning\x1b[0m I do not have permission to give users the verified role.')
                   return button.reply.edit(`I don\'t not have permission to give you <@&${options.roleID}>`, true)
                  }
                  button.clicker.member.roles.add(options.roleID).catch(err => { })
                  button.reply.edit(`:tada: You have been verified in ${button.guild.name} :tada:`, true);
                  succeeded(info);
                } else {
                  let v;
                  if (options.onFail.toLowerCase() === "ban") {
button.clicker.member.send(`You were ${e} for failing the captcha!`)
button.clicker.member.ban({ reason: "Failed Captcha" })
failed(info)
                  } else if (options.onFail.toLowerCase() === "kick") {
button.clicker.member.send(`You were ${e} for failing the captcha!`)
 button.clicker.member.kick({ reason: "Failed Captcha" })
 failed(info)
                  }
                }
              })
            });
          }
          captcha()
        }
      })
    });
  }
}
module.exports = Captcha
