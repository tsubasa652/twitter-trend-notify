const fetch = require('node-fetch')

class Twitter{
    #headers
    constructor(token){
        this.#headers = {
            "authorization": `Bearer ${token}`
        }
    }

    async get(url, method = "GET", headers = undefined, body = null){
        let res = await fetch(url, {
            method,
            headers: headers || this.#headers,
            body
        })
        if(!res.ok) throw new Error("Server returned Error response")
        res = await res.json()
        return res
    }

    trends(){
        return {
            countries: this.get("https://api.twitter.com/1.1/trends/available.json"),
            get: async function(country = "1"){
                const params = new URLSearchParams({
                    id: country
                })
                return await this.get(`https://api.twitter.com/1.1/trends/place.json?${params.toString()}`)
            }.bind(this)
        }
    }
}

module.exports = Twitter