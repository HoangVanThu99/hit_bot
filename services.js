const axios =  require('axios')
const moment = require ('moment-timezone')
const config = require('./config.json')
const excelToJson = require('convert-excel-to-json');

const Discord = require('discord.js')
const fs =  require("fs");

const processCommand = (message) => {
    
    let fullCommand = message.content.substr(4,message.content.length)
    if (fullCommand==null || fullCommand =='') return;
    let splitCommand = fullCommand.split(" ")
    let cmd = splitCommand[0].toLowerCase()
    let arguments = splitCommand.slice(1)
    let firstArg = splitCommand[1]
    let secondArg = splitCommand[2]
    let thirdArg = splitCommand[3]

    // console.log(splitCommand)
    // console.log("Command received: " + cmd)
    // console.log("Arguments: " + arguments)
    // console.log("Arguments 1: " + firstArg)
    // console.log("Arguments 2: " + secondArg)
    // console.log("Arguments 3: " + thirdArg)

    switch(cmd)
    {
        case "commands":
            Commands(message)
            break
        case "joke":
            Joke(message,arguments)
            break
        case "anime":
            ShowAnimeImage(message)
            break
        case "get_user_react":
            GetUserReact(message,arguments)
            break
        case "ask":
            AskQuestion(message,arguments)
            break
        case "covid":
            Covid(message);
            break
        case "meme":
            Meme(message,arguments)
            break
        case "girl":
            Girl(message)
            break
        case "boy":
            Boy(message)
            break
        case "poetry":
            Poetry(message)
            break
        case "weather":
            Weather(message)
            break
        case "level":
            break
        case "help":
            Help(message)
            break
        case "setlevel":
            break
        case "leaderboard":
            break
        case "test":
            Test(message)
            break
        default:
            message.channel.send("Bot kh??ng h???u, bot kh??ng h???u, bot kh??ng h???u")
            break;
    }
}

const Test = (message) =>{
    return;
    const result = excelToJson({
        sourceFile: config.CAPTION_GIRL_FILE,
        columnToKey: {
            A: '{{A1}}',
        }
    });
    var l = result['Sheet1'].length
    var rs = result['Sheet1'].splice(1)[Math.floor(Math.random() * (l-1))]
    var content = rs['noi_dung']
    message.channel.send(content)
    const girlImages = fs.readdirSync(config.GIRL_IMAGE_FOLDER);
    const attachment = new Discord.MessageAttachment(config.GIRL_IMAGE_FOLDER + girlImages[Math.floor(Math.random() * animeImages.length)])
    message.channel.send(attachment)
}

const Help = (message) =>{
    var content = `Ch??o <@${message.author.id}> , t??i l?? Hit Bot, m???t tr??? l?? ?????c l???c c???a HIT COMUNITY. H??y s??? d???ng c??u l???nh `
    + `***hit:commands*** ????? xem danh s??ch c??c c??u l???nh`
    message.channel.send(content)
}

const Commands = (message) =>{
    const result = excelToJson({
        sourceFile: config.BOT_COMMANDS_FILE,
        columnToKey: {
            A: '{{A1}}',
            B: '{{B1}}',
            C: '{{C1}}',
            D: '{{D1}}',
            E: '{{E1}}',
        }
    });
    const commands = result.Sheet1.map(res =>{
        const name = res.cau_lenh;
        const value =  res.mieu_ta;
        return {name,value,inline:false};
    }).splice(1);
    var commandsList = new Discord.MessageEmbed()
    .setColor("#0099ff")
    .setTitle("Danh s??ch c??u l???nh")
    .addFields(commands)
    message.channel.send(commandsList)

}

const animeImages = fs.readdirSync(config.ANIME_IMAGE_FOLDER);
const ShowAnimeImage = (receivedMessage) => {
     // L???y t???t c??? ???nh th??nh m???t list trong folder Image/Anime
    // L???y random ???nh anime
    const attachment = new Discord.MessageAttachment(config.ANIME_IMAGE_FOLDER + animeImages[Math.floor(Math.random() * animeImages.length)])
    receivedMessage.channel.send(attachment)
};

const Joke = (message, arguments) =>
{
    joke = arguments[0];
    switch (joke)
    {
        case 'ohno':
            setTimeout(() => {  message.channel.send("??u n??u"); }, 1000);
            setTimeout(() => {  message.channel.send("??u n??u"); }, 3000);
            setTimeout(() => {  message.channel.send("??u n???u n??u n??u n??u n??u"); }, 5000);
            break
        default:
            message.channel.send("B???n ???? d??ng sai c?? ph??p. B???n l?? ch??a h???!!")
            break
    }
}

const GetUserReact = (message,arguments) =>
{
    message.guild.channels.cache.forEach((channel)=>{
        try
        {
            channel.messages.fetch(arguments[0]).then((message) =>{
                message.reactions.cache.forEach(reaction=>{
                    reaction.users.fetch().then(user => user.map((user) => message.channel.send(user.username)))
                })
            })
        }
        catch(err)
        {
            
        }
    })
}


const Meme = (message,arguments) =>
{
    //console.log(arguments[0])
    meme = arguments[0]
    if (meme === undefined)
    {
        const memeImages = fs.readdirSync(config.MEME_IMAGE_FOLDER);
        const attachment = new Discord.MessageAttachment(config.MEME_IMAGE_FOLDER + memeImages[Math.floor(Math.random() * memeImages.length)])
        message.channel.send(attachment)
        return
    }
    switch(meme)
    {
        case 'thamlam':
            attachment = new Discord.MessageAttachment("Image/Meme/thamlam.jpeg")
            message.channel.send(attachment)
            break
        case 'ngudot':
            attachment = new Discord.MessageAttachment("Image/Meme/ngudot.jpeg")
            message.channel.send(attachment)
            break
        case 'concainit':
            attachment = new Discord.MessageAttachment("Image/Meme/concainit.jpeg")
            message.channel.send(attachment)
            break
        case 'simpson':
            attachment = new Discord.MessageAttachment("Image/Meme/simpson.png")
            message.channel.send(attachment)
            break
    }
}

const Girl = (message) =>
{
    const girlImages = fs.readdirSync(config.HITGIRL_IMAGE_FOLDER);
    const attachment = new Discord.MessageAttachment(config.HITGIRL_IMAGE_FOLDER + girlImages[Math.floor(Math.random() * girlImages.length)])
    message.channel.send(attachment)
}

const Boy = (message) =>
{
    const boyImages = fs.readdirSync(config.HITBOY_IMAGE_FOLDER);
    const attachment = new Discord.MessageAttachment(config.HITBOY_IMAGE_FOLDER + boyImages[Math.floor(Math.random() * boyImages.length)])
    message.channel.send(attachment)
}

const Poetry = (message) =>
{
    const result = excelToJson({
        sourceFile: config.POETRY_FILE,
        columnToKey: {
            A: '{{A1}}',
            B: '{{B1}}',
            C: '{{C1}}',
            D: '{{D1}}',
            E: '{{E1}}',
        }
    });
    let i =0
    result['Sheet1'][Math.floor(Math.random() * result['Sheet1'].length)]['noi_dung'].split('\n').forEach(str =>{
        i++
        setTimeout(() => { message.channel.send(str)}, 2000*i);
    })
}

const AskQuestion = (message,arguments) =>
{
    var question = arguments.join(' ')
    message.channel.send(question).then((message) =>{
        message.react('???')
        message.react('???')
    })
}


const getCovidEmbeded = (data) => new Discord.MessageEmbed()
  .setColor("#0099ff")
  .setTitle("Covid 19")
  .setURL("https://ncov.moh.gov.vn/")
  .addFields(data)
  .setImage("https://disease.sh/assets/img/flags/vn.png");

const Covid = async (receivedMessage) => {
  const data = await getCovidData();

  receivedMessage.reply("");
  receivedMessage.channel.send(getCovidEmbeded(data));
}

const getWeatherEmbeded = (data) => new Discord.MessageEmbed()
    .setColor("#0099ff")
    .setTitle("Th???i ti???t")
    //.setURL("https://ncov.moh.gov.vn/")
    .addFields(data)
    .setImage("https://x2tienganh.com/wp-content/uploads/2019/10/have-a-nice-day.jpg");

const Weather = async (receiveMessage) => {
    const data = await getWeatherData()
    receiveMessage.reply("")
    receiveMessage.channel.send(getWeatherEmbeded(data))
};

const covidUrl = "https://corona.lmao.ninja/v2/countries/vn";
const fetchApi = () => axios.get(covidUrl);

const getCovidData = async () => {
    const {data} = await fetchApi();
    const {
      updated,
      country,
      cases,
      todayCases,
      deaths,
      todayDeaths,
      recovered,
      todayRecovered,
      population,
      continent,
      undefined: undefine,
      // active,
      // critical,
      // casesPerOneMillion,
      // deathsPerOneMillion,
      // tests,
      // testsPerOneMillion,
      // oneCasePerPeople,
      // oneDeathPerPeople,
      // oneTestPerPeople,
      // activePerOneMillion,
      // recoveredPerOneMillion,
      // criticalPerOneMillion,
    } = data;
  
    const arr = [
      `Qu???c gia:${country}`,
      `Khu v???c:${continent}`,
      `D??n s???:${population}`,
      `S??? ca nhi???m:${cases}`,
      `S??? ca t??? vong:${deaths}`,
      `S??? ca ???? ph???c h???i:${recovered}`,
      `S??? ca nhi???m (nay):${todayCases}`,
      `S??? ca t??? vong (nay):${todayDeaths}`,
      `S??? ca ???? ph???c h???i (nay):${todayRecovered}`,
      `S??? ca ch??a x??c ?????nh:${undefine}`,
      `C???p nh???t l??c:${moment(updated)
        .locale("vi")
        .format("HH:mm:ss, DD/MM/YYYY")}`,
    ];
  
    return arr.map(e => {
      const items = e.split(":");
      const name = items[0];
      const value = items.slice(1).join(":");
      return {name, value, inline: true};
    },
    );
};

const weatherUrl = "http://api.openweathermap.org/data/2.5/weather?q=hanoi&appid=c2364c9a824b35ae8a0c3639abc0589a"
const fetchApiWeather = () => axios.get(weatherUrl)

const getWeatherData = async () => {
    const {data} = await fetchApiWeather();
    const {
      weather,
      main,
      clouds,
      sys
    } = data;
 
    const arr =[
        `Qu???c gia: Vi???t Nam`,
        `Th??nh ph???: H?? N???i`,
        `Th???i ti???t: ${weather[0]?.description}`,
        `Nhi???t ?????: ${main.temp - 273.15}???`,
        `Nhi???t ????? th???c: ${main.feels_like - 273.15}???`,
        `????? ???m: ${main.humidity}%`,
        `????? che ph??? c???a m??y: ${clouds.all}%`,
        `Th???i gian m???t tr???i m???c: ${moment.unix(sys.sunrise)
            .locale("vi")
            .format("HH:mm:ss, DD/MM/YYYY")}`,
        `Th???i gian m???t tr???i l???n: ${moment.unix(sys.sunset)
            .locale("vi")
            .format("HH:mm:ss, DD/MM/YYYY")}`
    ]
 
    return arr.map(e => {
        const items = e.split(":");
        const name = items[0];
        const value = items.slice(1).join(":");
        return {name, value, inline: true};
    },
    );
};

// reactionRole MessageID, EmojiID, RoleID


module.exports = {getCovidData,getCovidEmbeded,processCommand,getWeatherData,getWeatherEmbeded}