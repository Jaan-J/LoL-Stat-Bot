const fetch = require("node-fetch");
const { Client, Intents, MessageEmbed } = require('discord.js');
const bot = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const PREFIX = '!lolsb'; // Set the prefix


require("dotenv").config(); // used to hide API key
bot.login(process.env.BOTTOKEN);


bot.on('ready', readyDiscord);
function readyDiscord() {
    console.log("Bot started!");

}

// Fetches the account information for a player such as their account id, level, and icon id
async function fetchSummoner(name, ch) {
    const summonerInfoAPI = `https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${name}?api_key=${process.env.RIOTKEY}`;
    const playerResponse = await fetch(summonerInfoAPI);
    let playerData = await playerResponse.json();

    switch
    (ch) {
        case "profileIconId":
            return playerData.profileIconId;
        case "summonerLevel":
            return playerData.summonerLevel;
        case "summonerID":
            return playerData.id;
        default:
            return "Error";
    }
}

// Fetches the mastery level of a player
async function fetchMastery(summonerID) {
    const masteryAPI = `https://na1.api.riotgames.com/lol/champion-mastery/v4/scores/by-summoner/${summonerID}?api_key=${process.env.RIOTKEY}`;
    const masteryResponse = await fetch(masteryAPI);

    let masteryData = await masteryResponse.json();
    return masteryData;
}

// Fetches most played champions
async function fetchMasteryChamps(summonerID, mostPlayed, returnData) {
    const masteryAPI = `https://na1.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/${summonerID}?api_key=${process.env.RIOTKEY}`;
    const masteryResponse = await fetch(masteryAPI);
    let masteryData = await masteryResponse.json();

    if (mostPlayed === 0) {
        if (!masteryData[0].championId) {
            return null;
        }
        switch
        (returnData) {
            case "championId":
                return masteryData[0].championId;
            case "championPoints":
                return masteryData[0].championPoints;
            case "championLevel":
                return masteryData[0].championLevel;
            default:
                console.log("Error: No valid entry.");
                return null;
        }
    } else if (mostPlayed === 1) {
        if (!masteryData[1].championId) {
            return null;
        }
        switch
        (returnData) {
            case "championId":
                return masteryData[1].championId;
            case "championPoints":
                return masteryData[1].championPoints;
            case "championLevel":
                return masteryData[1].championLevel;
            default:
                console.log("Error: No valid entry.");
                return null;
        }
    } else if (mostPlayed === 2) {
        if (!masteryData[2].championId) {
            return null;
        }
        switch
        (returnData) {
            case "championId":
                return masteryData[2].championId;
            case "championPoints":
                return masteryData[2].championPoints;
            case "championLevel":
                return masteryData[2].championLevel;
            default:
                console.log("Error: No valid entry.");
                return null;
        }
    }
}

// Fetches the rank info of a player
async function fetchRank(summonerID, queueType, returnData) {
    const rankAPI = `https://na1.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerID}?api_key=${process.env.RIOTKEY}`;
    const rankResponse = await fetch(rankAPI);
    let rankData = await rankResponse.json();

    if (queueType === "solo") {
        for (i = 0; i < rankData.length; i++) {
            if (rankData[i].queueType === "RANKED_SOLO_5x5") {
                switch
                (returnData) {
                    case "tier":
                        return rankData[i].tier;
                    case "rank":
                        return rankData[i].rank;
                    case "leaguePoints":
                        return rankData[i].leaguePoints;
                    case "wins":
                        return rankData[i].wins;
                    case "losses":
                        return rankData[i].losses;
                    case "winRatio":
                        return rankData[i].wins / (rankData[i].wins + rankData[i].losses);
                    default:
                        console.log("Error: No valid entry.");
                        return null;
                }
            }
        }
        return ("Unranked");
    } else if (queueType === "flex") {
        for (i = 0; i < rankData.length; i++) {
            if (rankData[i].queueType === "RANKED_FLEX_SR") {
                switch
                (returnData) {
                    case "tier":
                        return rankData[i].tier;
                    case "rank":
                        return rankData[i].rank;
                    case "leaguePoints":
                        return rankData[i].leaguePoints;
                    case "wins":
                        return rankData[i].wins;
                    case "losses":
                        return rankData[i].losses;
                    case "winRatio":
                        return rankData[i].wins / (rankData[i].wins + rankData[i].losses);
                    default:
                        console.log("Error: No valid entry.");
                        return null;
                }
            }
        }
        return ("Unranked");
    }
}

// Fetches the Rank Icon of a player
async function fetchRankIcon(tier) {
    switch (tier) {
        case "Iron":
            return "https://static.wikia.nocookie.net/leagueoflegends/images/f/fe/Season_2022_-_Iron.png";
        case "Bronze":
            return "https://static.wikia.nocookie.net/leagueoflegends/images/e/e9/Season_2022_-_Bronze.png";
        case "Silver":
            return "https://static.wikia.nocookie.net/leagueoflegends/images/4/44/Season_2022_-_Silver.png";
        case "Gold":
            return "https://static.wikia.nocookie.net/leagueoflegends/images/8/8d/Season_2022_-_Gold.png";
        case "Platinum":
            return "https://static.wikia.nocookie.net/leagueoflegends/images/3/3b/Season_2022_-_Platinum.png";
        case "Diamond":
            return "https://static.wikia.nocookie.net/leagueoflegends/images/e/ee/Season_2022_-_Diamond.png";
        case "Master":
            return "https://static.wikia.nocookie.net/leagueoflegends/images/e/eb/Season_2022_-_Master.png";
        case "Grandmaster":
            return "https://static.wikia.nocookie.net/leagueoflegends/images/f/fc/Season_2022_-_Grandmaster.png";
        case "Challenger":
            return "https://static.wikia.nocookie.net/leagueoflegends/images/0/02/Season_2022_-_Challenger.png";
        default:
            return null;
    }
}

async function fetchChampionName(championID) {
    const champAPI = `https://ddragon.leagueoflegends.com/cdn/12.9.1/data/en_US/champion.json`;
    const champResponse = await fetch(champAPI);
    let champData = await champResponse.json();
    let championList = champData.data;
    for (var i in championList) {
        if (championList[i].key == championID) {
            return championList[i].name;
        }
    }
}


bot.on('messageCreate', async (msg) => {
    const content = msg.content;
    console.log(msg.content);

    // Ignore any message that doesn't start with the correct prefix.
    if (!content.startsWith(PREFIX)) {
        return;
    }

    // If the messages start with the prefix, utilize the defined functions to recieve the data.
    if (content.startsWith(PREFIX)) {
        let buffer = content.replace(PREFIX, "");
        playerName = buffer.trim();

        let playerProfileIconId = await fetchSummoner(playerName, "profileIconId");
        let playerSummonerID = await fetchSummoner(playerName, "summonerID");

        let playerSummonerLevel = await fetchSummoner(playerName, "summonerLevel");
        let playerMasteryLevel = await fetchMastery(playerSummonerID);

        let soloqTier = await fetchRank(playerSummonerID, "solo", "tier");
        soloqTier = soloqTier.charAt(0) + soloqTier.slice(1).toLowerCase();
        let soloqRank = await fetchRank(playerSummonerID, "solo", "rank");
        let soloqLP = await fetchRank(playerSummonerID, "solo", "leaguePoints") + " LP";
        let soloqWins = await fetchRank(playerSummonerID, "solo", "wins");
        let soloqLosses = await fetchRank(playerSummonerID, "solo", "losses");
        let soloqWinRatio = await fetchRank(playerSummonerID, "solo", "winRatio");
        if (soloqTier != "Unranked")
            soloqWinRatio = soloqWinRatio.toFixed(4) * 100;
        let soloqIcon = await fetchRankIcon(soloqTier);

        let flexqTier = await fetchRank(playerSummonerID, "flex", "tier");
        flexqTier = flexqTier.charAt(0) + flexqTier.slice(1).toLowerCase();
        let flexqRank = await fetchRank(playerSummonerID, "flex", "rank");
        let flexqLP = await fetchRank(playerSummonerID, "flex", "leaguePoints") + " LP";
        let flexqWins = await fetchRank(playerSummonerID, "flex", "wins");
        let flexqLosses = await fetchRank(playerSummonerID, "flex", "losses");
        let flexqWinRatio = await fetchRank(playerSummonerID, "flex", "winRatio");
        if (flexqTier != "Unranked")
            flexqWinRatio = flexqWinRatio.toFixed(4) * 100;

        let num1Champ = await fetchMasteryChamps(playerSummonerID, 0, "championId");
        let num1ChampLevel = await fetchMasteryChamps(playerSummonerID, 0, "championLevel");
        let num1ChampPoints = await fetchMasteryChamps(playerSummonerID, 0, "championPoints");

        let num2Champ = await fetchMasteryChamps(playerSummonerID, 1, "championId");
        let num2ChampLevel = await fetchMasteryChamps(playerSummonerID, 1, "championLevel");
        let num2ChampPoints = await fetchMasteryChamps(playerSummonerID, 1, "championPoints");

        let num3Champ = await fetchMasteryChamps(playerSummonerID, 2, "championId");
        let num3ChampLevel = await fetchMasteryChamps(playerSummonerID, 2, "championLevel");
        let num3ChampPoints = await fetchMasteryChamps(playerSummonerID, 2, "championPoints");

        let mastery1Champ = await fetchChampionName(num1Champ);
        let mastery2Champ = await fetchChampionName(num2Champ);
        let mastery3Champ = await fetchChampionName(num3Champ);

        // If is unranked in either queue, set the value to "Unranked."
        if (flexqTier === "Unranked") {
            flexqRank = "";
            flexqLP = "";
            flexqWins = "0";
            flexqLosses = "0";
            flexqWinRatio = "0.00";
        }

        if (soloqTier === "Unranked") {
            soloqRank = "";
            soloqLP = "";
            soloqWins = "0";
            soloqLosses = "0";
            soloqWinRatio = "0.00";
        }

        // Create the embed to send to the channel.
        const statsEmbed = new MessageEmbed()
            .setTitle(playerName)
            .setColor('#0099ff')
            .setThumbnail(`https://ddragon.leagueoflegends.com/cdn/12.9.1/img/profileicon/${playerProfileIconId}.png`)
            .addFields(
                { name: '\u200B', value: '\u200B' },
                { name: 'Level', value: String(playerSummonerLevel), inline: true },
                { name: 'Mastery Score', value: String(playerMasteryLevel), inline: true },
                { name: '\u200B', value: '\u200B' },
                { name: "Most Played Champs 🕹", value: '\u200B' },
                { name: `${mastery1Champ} `, value: `${num1ChampPoints} Points \n Lvl ${num1ChampLevel}`, inline: true },
                { name: `${mastery2Champ} `, value: `${num2ChampPoints} Points \n Lvl ${num2ChampLevel}`, inline: true },
                { name: `${mastery3Champ} `, value: `${num3ChampPoints} Points \n Lvl ${num3ChampLevel}`, inline: true },
                { name: '\u200B', value: '\u200B' },
                { name: 'Solo Queue', value: ` ${soloqTier}  ${soloqRank} ${soloqLP}`, inline: true },
                { name: 'Stats', value: `${soloqWins}W ${soloqLosses}L ${Math.round(soloqWinRatio)}%`, inline: true },
                { name: '\u200B', value: '\u200B' },
                { name: 'Flex Queue', value: `${flexqTier} ${flexqRank} ${flexqLP}`, inline: true },
                { name: 'Stats', value: `${flexqWins}W ${flexqLosses}L ${Math.round(flexqWinRatio)}%`, inline: true },
            )
            .setImage(soloqIcon);
        msg.reply({ embeds: [statsEmbed] });
    }
});

bot.on('error', err => {
    console.warn(err);
});
