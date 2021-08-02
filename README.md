# HerokuWebhooks

## Setup
1. Create a new Heroku app from this repo
2. Set the `WEBHOOK_URL` environment variable to your discord webhook 

![](https://i.imgur.com/yg2wbTs.png)

3. Go to the app you want updates for and go to "View Webhooks"

![](https://i.imgur.com/UCL6G1J.png)

4. Click "Create Webhook"

![](https://i.imgur.com/CGXhV0d.png)

5. Input a name for your webhook (doesn't matter) and the url of your webhook application. Make sure that the `api:build` and `dyno` event are selected

![](https://i.imgur.com/RDRXdH5.png)
