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

    // console.log(`Webhook Data: `, webhookContent)

    const options = {
        method: "POST",
        url: "https://discord.com/api/webhooks/846362498952986646/LXK4yC-jN7qEqw_ZIOMKyEhf8v705SAB896XRdKyE6PCWW2Iz_IgdDXiWMjkQPpjuAYb",
        headers: {
            "Content-type": "application/json",
        },
        //Format JSON DATA
        body: JSON.stringify(webhookContent),
    };

    // console.log(`Request Options: `, options)

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

        const up = true
        return {
            "content": null,
            "embeds": [
              {
                "title": "Status Notification",
                "description": `Your app [\`${app}\`](https://dashboard.heroku.com/apps/${app}) is ${(up ? "online" : "currently down")}!`,
                "color": (up ? 5822463 : 16744536)
              }
            ]
          }
    }
}