// Copyright Wowkster 2021. All Rights Reserved.

import { config as load_env } from "dotenv"
load_env()
import express from "express";
const app = express();
import request from "request";
import pkg from 'body-parser';
const { json, urlencoded } = pkg;

const PORT = process.env.PORT || 3000;

app.use(json());
app.use(urlencoded({ extended: true }));

app.post("/webhook", async (req, res) => {
    const Payload = req.body;

    res.sendStatus(200);

    const webhookContent = getWebhookData(Payload)

    if (Payload.resource === 'dyno') console.log(Payload.data)

    if (!webhookContent) return

    const options = {
        method: "POST",
        url: process.env.WEBHOOK_URL,
        headers: {
            "Content-type": "application/json",
        },
        //Format JSON DATA
        body: JSON.stringify(webhookContent),
    };

    request(options, function (error, response) {
        if (error) throw new Error(error);
        console.log(`Response: ${ JSON.stringify(response) }`)
    });

    console.log("Sent Discord POST Request")
});
app.listen(PORT, () => console.log(`App is running on port ${PORT}!`));

function getWebhookData(Payload) {
    if (Payload.resource === 'build'){
        const succeeded = (Payload.data.status === 'succeeded')
        const email = Payload.actor.email

        if (!Payload.data.slug) return null

        const commit = Payload.data.slug.commit
        const app = Payload.data.app.name

        return {
            "content": null,
            "embeds": [
              {
                "title": "Build Notification",
                "description": `A build for your app [\`${app}\`](https://dashboard.heroku.com/apps/${app}) was just triggered`,
                "color": (succeeded ? 5832556 : 16734296),
                "fields": [
                  {
                    "name": "User",
                    "value": `\`${email}\``
                  },
                  {
                    "name": "Status",
                    "value": (succeeded ? "Succeeded" : "Failed")
                  },
                  {
                    "name": "Commit",
                    "value": `ID: [\`${commit}\`](https://github.com/wowkster/ExeMinion/commit/${commit})`
                  }
                ]
              }
            ]
          }
    } else if (Payload.resource === 'dyno') {
        const app = Payload.data.app.name

        if (Payload.data.state !== 'up' && Payload.data.state !== 'down') return null

        const up = Payload.data.state == "up"
        return {
            "content": null,
            "embeds": [
              {
                "title": "Status Notification",
                "description": `Your app [\`${app}\`](https://dashboard.heroku.com/apps/${app}) is ${(up ? "online" : "currently down")}!`,
                "color": (up ? 5822463 : 15081504)
              }
            ]
          }
    }
}