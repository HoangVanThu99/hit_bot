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
            message.channel.send("Bot không hỉu, bot không hỉu, bot không hỉu")
            break;
    }
}

const Test = (message) =>{
    onlineMemberList = message.guild.members.cache.filter(member => member.presence.status !== "offline").map(user => user.id)
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
    message.channel.send(content + "\n")
    try
    {
        if (rs['bai_hat'] == undefined || rs['bai_hat'] == null) return;
        const attachment = new Discord.MessageAttachment(rs['bai_hat'])
        message.channel.send(attachment)
    }
    catch
    {

    }
   
}

const Help = (message) =>{
    var content = `Chào <@${message.author.id}> , tôi là Hit Bot, một trợ lý đắc lực của HIT COMUNITY. Hãy sử dụng câu lệnh `
    + `***hit:commands*** để xem danh sách các câu lệnh`
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
    .setTitle("Danh sách câu lệnh")
    .addFields(commands)
    message.channel.send(commandsList)

}

const animeImages = fs.readdirSync(config.ANIME_IMAGE_FOLDER);
const ShowAnimeImage = (receivedMessage) => {
     // Lấy tất cả ảnh thành một list trong folder Image/Anime
    // Lấy random ảnh anime
    const attachment = new Discord.MessageAttachment(config.ANIME_IMAGE_FOLDER + animeImages[Math.floor(Math.random() * animeImages.length)])
    receivedMessage.channel.send(attachment)
};

const Joke = (message, arguments) =>
{
    joke = arguments[0];
    switch (joke)
    {
        case 'ohno':
            setTimeout(() => {  message.channel.send("Âu nâu"); }, 1000);
            setTimeout(() => {  message.channel.send("Âu nâu"); }, 3000);
            setTimeout(() => {  message.channel.send("Âu nấu nâu nâu nâu nâu"); }, 5000);
            break
        default:
            message.channel.send("Bạn đã dùng sai cú pháp. Bạn là chúa hề!!")
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
        message.react('✅')
        message.react('❌')
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
    .setTitle("Thời tiết")
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
      `Quốc gia:${country}`,
      `Khu vực:${continent}`,
      `Dân số:${population}`,
      `Số ca nhiễm:${cases}`,
      `Số ca tử vong:${deaths}`,
      `Số ca đã phục hồi:${recovered}`,
      `Số ca nhiễm (nay):${todayCases}`,
      `Số ca tử vong (nay):${todayDeaths}`,
      `Số ca đã phục hồi (nay):${todayRecovered}`,
      `Số ca chưa xác định:${undefine}`,
      `Cập nhật lúc:${moment(updated)
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
        `Quốc gia: Việt Nam`,
        `Thành phố: Hà Nội`,
        `Thời tiết: ${weather[0]?.description}`,
        `Nhiệt độ: ${main.temp - 273.15}℃`,
        `Nhiệt độ thực: ${main.feels_like - 273.15}℃`,
        `Độ ẩm: ${main.humidity}%`,
        `Độ che phủ của mây: ${clouds.all}%`,
        `Thời gian mặt trời mọc: ${moment.unix(sys.sunrise)
            .locale("vi")
            .format("HH:mm:ss, DD/MM/YYYY")}`,
        `Thời gian mặt trời lặn: ${moment.unix(sys.sunset)
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