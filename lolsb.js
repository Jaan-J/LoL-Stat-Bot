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

    if (ch == "profileIconId") {
        return playerData.profileIconId;
    } else if (ch == "summonerLevel") {
        return playerData.summonerLevel;
    } else if (ch == "summonerID") {
        return playerData.id;
    } else {
        console.log("Error: No valid entry.");
        return null;
    }
}

// Fetches the mastery level of a player
async function fetchMastery(summonerID) {
    const masteryAPI = `https://na1.api.riotgames.com/lol/champion-mastery/v4/scores/by-summoner/${summonerID}?api_key=${process.env.RIOTKEY}`;
    const masteryResponse = await fetch(masteryAPI);

    let masteryData = await masteryResponse.json();
    return masteryData;

}

// Fetches the rank info of a player
async function fetchRank(summonerID, queueType, specificData) {
    const rankAPI = `https://na1.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerID}?api_key=${process.env.RIOTKEY}`;
    const rankResponse = await fetch(rankAPI);
    let rankData = await rankResponse.json();

    if (queueType === "solo") {
        if (rankData[0] != undefined) {
            if (specificData === "tier") {
                return rankData[0].tier;
            } else if (specificData === "rank") {
                return rankData[0].rank;
            } else if (specificData === "leaguePoints") {
                return rankData[0].leaguePoints;
            } else if (specificData === "wins") {
                return rankData[0].wins;
            } else if (specificData === "losses") {
                return rankData[0].losses;
            } else if (specificData === "winRatio") {
                return rankData[0].wins / (rankData[0].wins + rankData[0].losses);
            } else {
                console.log("Error: No valid entry.");
            }
        } else {
            return "Unranked.";
        }
    } else if (queueType === "flex") {
        if (rankData[1] != undefined) {
            if (specificData === "tier") {
                return rankData[1].tier;
            } else if (specificData === "rank") {
                return rankData[1].rank;
            } else if (specificData === "leaguePoints") {
                return rankData[1].leaguePoints;
            } else if (specificData === "wins") {
                return rankData[1].wins;
            } else if (specificData === "losses") {
                return rankData[1].losses;
            } else if (specificData === "winRatio") {
                return rankData[1].wins / (rankData[1].wins + rankData[1].losses);
            } else {
                console.log("Error: No valid entry.");
            }
        } else {
            return "Unranked.";
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
        let soloqRank = await fetchRank(playerSummonerID, "solo", "rank");
        let soloqLP = await fetchRank(playerSummonerID, "solo", "leaguePoints") + " LP";

        let flexqTier = await fetchRank(playerSummonerID, "flex", "tier");
        let flexqRank = await fetchRank(playerSummonerID, "flex", "rank");
        let flexqLP = await fetchRank(playerSummonerID, "flex", "leaguePoints") + " LP";

        // If is unranked in either queue, set the value to "Unranked."
        if (flexqTier === "Unranked.") {
            flexqRank = "";
            flexqLP = "";
        }

        if (soloqTier === "Unranked.") {
            soloqRank = "";
            soloqLP = "";
        }

        // Create the embed to send to the channel.
        const statsEmbed = new MessageEmbed()
            .setTitle(playerName)
            .setColor('#0099ff')
            .setThumbnail(`https://ddragon.leagueoflegends.com/cdn/10.19.1/img/profileicon/${playerProfileIconId}.png`)
            .addFields(
                { name: 'Level', value: String(playerSummonerLevel) },
                { name: 'Mastery Score', value: String(playerMasteryLevel) },
                { name: 'Solo Queue', value: `${soloqTier} ${soloqRank} ${soloqLP}` },
                { name: 'Flex Queue', value: `${flexqTier} ${flexqRank} ${flexqLP}` }
            );
        msg.reply({ embeds: [statsEmbed] });

    }
});

bot.on('error', err => {
    console.warn(err);
});
