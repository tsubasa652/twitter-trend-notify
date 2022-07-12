const Twitter = require("./twitter")
const fetch = require("node-fetch")
const {app} = require("deta")

const twitter = new Twitter(process.env["twitter_token"])

async function notify(){

    const timestamp = (new Date()).toISOString()

    const trends = {
        global: {
            data: await twitter.trends().get(1),
        },
        japan: {
            data: await twitter.trends().get(23424856),
        }
    }

    for(const country in trends){
        const fields = []
        let cnt = 0
        for(const trend of trends[country].data[0].trends){
            if(cnt>=25) break
            const field = {
                name: `${cnt+1}: ${trend.name} ${trend.tweet_volume}tweets`,
                value: trend.url,
                inline: false
            }
            fields.push(field)
            cnt++
        }
        trends[country].fields = fields
    }

    const res = await fetch(process.env["discord_url"], {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            embeds: [
                {
                    title: "Twitter Trends",
                    timestamp,
                    description: "グローバルトレンド",
                    fields: trends.global.fields
                },
                {
                    title: "Twitter Trends",
                    timestamp,
                    description: "日本のトレンド",
                    fields: trends.japan.fields
                }
            ]
        })
    })

    console.log(res)
    console.log(await res.text())
}

if (require.main === module) {
    !(async()=>{
        await notify()
    })()
}else{
    app.lib.cron(notify)
}

module.exports = app