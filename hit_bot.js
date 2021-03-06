const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json')
const schedule = require('node-schedule')
const moment = require ("moment-timezone")
const services = require('./services.js')
const excelToJson = require('convert-excel-to-json');
const fs =  require("fs");

moment.tz.setDefault("Asia/Ho_Chi_Minh");

client.on('ready',()=>{
    client.user.setActivity(' with hiter',{type:'PLAYING'})
    
    let server = client.guilds.cache.get(config.HIT_GUILD_ID);
    let channel = client.channels.cache.get("843116118448406538")
    //console.log(server.members.cache.filter(member => member.presence.status !== "offline").map(user => user.id))

    const sleepingTime= new schedule.RecurrenceRule();
    sleepingTime.tz = 'Asia/Ho_Chi_Minh';
    sleepingTime.hour = [0];
    sleepingTime.minute = 0;
    sleepingTime.second = 0;

    schedule.scheduleJob(
      sleepingTime,
      async () => {
        onlineMemberList = await server.members.cache.filter(member => member.presence.status !== "offline").map(user => user.id)
        const result = excelToJson({
            sourceFile: config.SLEEP_WISH_FILE,
            columnToKey: {
                A: '{{A1}}',
                B: '{{B1}}',
            }
        });
        var l = result['Sheet1'].length
        var rs = result['Sheet1'].splice(1)[Math.floor(Math.random() * (l-1))]
        var content = rs['noi_dung']
        var strTag = ``
        onlineMemberList.forEach(memberID =>{
            strTag += `<@${memberID}>`
        })
        channel.send(content + "\n" + strTag)
        try
        {
            if (rs['bai_hat'] == undefined || rs['bai_hat'] == null) return;
            const attachment = new Discord.MessageAttachment(rs['bai_hat'])
            channel.send(attachment)
        }
        catch
        {
    
        }
      })
      
    const girlTime= new schedule.RecurrenceRule();
    girlTime.tz = 'Asia/Ho_Chi_Minh';
    girlTime.hour = [8,16,21];
    girlTime.minute = 10;
    girlTime.second = 0;

    schedule.scheduleJob(
      girlTime,
      async () => {
        const result = excelToJson({
            sourceFile: config.CAPTION_GIRL_FILE,
            columnToKey: {
                A: '{{A1}}',
            }
        });
        var l = result['Sheet1'].length
        var rs = result['Sheet1'].splice(1)[Math.floor(Math.random() * (l-1))]
        var content = rs['noi_dung']
        
        const girlImages = await fs.readdirSync(config.GIRL_IMAGE_FOLDER);
        const attachment = new Discord.MessageAttachment(config.GIRL_IMAGE_FOLDER + girlImages[Math.floor(Math.random() * girlImages.length)])
        if (content!=null && attachment!=null)
        {
          channel.send(content)
          channel.send(attachment)
        }
      })

    const weatherTime = new schedule.RecurrenceRule();
    weatherTime.tz = 'Asia/Ho_Chi_Minh';
    weatherTime.hour = [7];
    weatherTime.minute = 0;
    weatherTime.second = 0;
  
    schedule.scheduleJob(
      weatherTime,
      async () => {
        channel.send(`B??y gi??? l??: ${moment()
          .locale("vi").format("HH:mm:ss")}`);
  
        const weatherData = await services.getWeatherData()
        channel.send(services.getWeatherEmbeded(weatherData))
      });


    const covidTime = new schedule.RecurrenceRule();
    covidTime.tz = 'Asia/Ho_Chi_Minh';
    covidTime.hour = [18];
    covidTime.minute = 0;
    covidTime.second = 0;
  
    schedule.scheduleJob(
       //"* * *6 * * *",
      covidTime,
      async () => {
        channel.send(`B??y gi??? l??: ${moment()
          .locale("vi").format("HH:mm:ss")}`);
  
        const covidData = await services.getCovidData();
        channel.send(services.getCovidEmbeded(covidData));
      });
})

client.on('guildMemberAdd', member => {
  const str = `Ch??o m???ng  <@${member.user.id}> ?????n v???i c???ng ?????ng **HIT COMUNITY**. ????y l?? c???ng ?????ng CLB HIT tr??n n???n t???ng Discord.`
  + `\nH??y ?????c h???t n???i dung ph???n ch??o m???ng b??n tr??n ????? hi???u th??m v??? c??ch th???c ho???t ?????ng c???a ch??ng t??i. C??m ??n b???n r???t nhi???u.`
  + `\nT??i l?? hit bot, n???u c???n ???????c tr??? gi??p h??y s??? d???ng c??u l???nh ***hit:help***. T??i lu??n c?? m???t ??? m???i n??i, m???i ch??? ^^`
  member.guild.channels.cache.get('820253588769079316')
  .send(str).then(msg => msg.delete({timeout:60000}))
})

//L???ng nghe s??? ki???n khi c?? ng?????i nh???p n???i dung
client.on('message', (message) =>{
    try {
      if (message.author == client.user || message.member.roles.cache.some((role) => role.name == "bot"))
      {
          return;
      }
    } catch(err) {
        return
    }
    

    if (message.content.toLowerCase()=="bot ngu")
    {
       const attachment = new Discord.MessageAttachment('Image/Meme/nguoianhemodau.jpg')
       
       message.channel.send(attachment)
    }

    if (message.content.substr(0,4).toLowerCase()==='hit:') {
        services.processCommand(message)
    }
})

const events = {
	MESSAGE_REACTION_ADD: 'messageReactionAdd',
	MESSAGE_REACTION_REMOVE: 'messageReactionRemove',
};

client.on('raw', async event => {
	if (!events.hasOwnProperty(event.t)) return;
	const { d: data } = event;
	const user = client.users.cache.get(data.user_id);
	const channel = client.channels.cache.get(data.channel_id) || await user.createDM();
	if (channel.messages.cache.has(data.message_id)) return;
	const message = await channel.messages.fetch(data.message_id);
	const emojiKey = (data.emoji.id) ? `${data.emoji.name}:${data.emoji.id}` : data.emoji.name;
	const reaction = message.reactions.cache.get(emojiKey); 
	client.emit(events[event.t], reaction, user);
});

client.on('messageReactionAdd', (reaction, user) => {
  try {
    if (reaction.message.guild.id != config.HIT_GUILD_ID || reaction.message.channel.id != "820903432361476106")
    {
      return;
    }
  } catch(err) {
      return
  }
  
  switch (reaction.emoji.name)
  {
    case "mobile":
      var member = reaction.message.guild.members.cache.get(user.id);
      var role = reaction.message.guild.roles.cache.get('821061956672815156');
      member.roles.add(role);
      break
    case "photoshop":
      var member = reaction.message.guild.members.cache.get(user.id);
      var role = reaction.message.guild.roles.cache.get('821022281106980884');
      member.roles.add(role);
      break
    case "unity":
      var member = reaction.message.guild.members.cache.get(user.id);
      var role = reaction.message.guild.roles.cache.get('820826091375558677');
      member.roles.add(role);
      break
    case "algorithm":
      var member = reaction.message.guild.members.cache.get(user.id);
      var role = reaction.message.guild.roles.cache.get('821773418164125757');
      member.roles.add(role);
      break
    case "web":
      var member = reaction.message.guild.members.cache.get(user.id);
      var role = reaction.message.guild.roles.cache.get('821205588818133012');
      member.roles.add(role);
      break
    case "mercylearning":
      var member = reaction.message.guild.members.cache.get(user.id);
      var role = reaction.message.guild.roles.cache.get('821053949804544000');
      member.roles.add(role);
      break

    case "????":
      var member = reaction.message.guild.members.cache.get(user.id);
      var role = reaction.message.guild.roles.cache.get('820903027430653963');
      member.roles.add(role);
      break
    case "????":
      var member = reaction.message.guild.members.cache.get(user.id);
      var role = reaction.message.guild.roles.cache.get('822791975572602942');
      member.roles.add(role);
      break
    case "anime":
      var member = reaction.message.guild.members.cache.get(user.id);
      var role = reaction.message.guild.roles.cache.get('820901954590343198');
      member.roles.add(role);
      break
    case "??????":
      var member = reaction.message.guild.members.cache.get(user.id);
      var role = reaction.message.guild.roles.cache.get('823127789599195136');
      member.roles.add(role);
      break
  }
  
  
});

client.on('messageReactionRemove', (reaction, user) => {
  try {
    if (reaction.message.guild.id != config.HIT_GUILD_ID || reaction.message.channel.id != "820903432361476106")
    {
      return;
    }
  } catch(err) {
      return
  }
  
  switch (reaction.emoji.name)
  {
    case "mobile":
      var member = reaction.message.guild.members.cache.get(user.id);
      var role = reaction.message.guild.roles.cache.get('821061956672815156');
      member.roles.remove(role);
      break
    case "photoshop":
      var member = reaction.message.guild.members.cache.get(user.id);
      var role = reaction.message.guild.roles.cache.get('821022281106980884');
      member.roles.remove(role);
      break
    case "unity":
      var member = reaction.message.guild.members.cache.get(user.id);
      var role = reaction.message.guild.roles.cache.get('820826091375558677');
      member.roles.remove(role);
      break
    case "algorithm":
      var member = reaction.message.guild.members.cache.get(user.id);
      var role = reaction.message.guild.roles.cache.get('821773418164125757');
      member.roles.remove(role);
      break
    case "web":
      var member = reaction.message.guild.members.cache.get(user.id);
      var role = reaction.message.guild.roles.cache.get('821205588818133012');
      member.roles.remove(role);
      break
    case "mercylearning":
      var member = reaction.message.guild.members.cache.get(user.id);
      var role = reaction.message.guild.roles.cache.get('821053949804544000');
      member.roles.remove(role);
      break

    case "????":
      var member = reaction.message.guild.members.cache.get(user.id);
      var role = reaction.message.guild.roles.cache.get('820903027430653963');
      member.roles.remove(role);
      break
    case "????":
      var member = reaction.message.guild.members.cache.get(user.id);
      var role = reaction.message.guild.roles.cache.get('822791975572602942');
      member.roles.remove(role);
      break
    case "anime":
      var member = reaction.message.guild.members.cache.get(user.id);
      var role = reaction.message.guild.roles.cache.get('820901954590343198');
      member.roles.remove(role);
      break
    case "??????":
      var member = reaction.message.guild.members.cache.get(user.id);
      var role = reaction.message.guild.roles.cache.get('823127789599195136');
      member.roles.remove(role);
      break
  }
});

// Login: ??i???n token (m???t m?? ????? truy c???p)
client.login(config.BOT_TOKEN)