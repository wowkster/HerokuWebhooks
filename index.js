import express from "express";
const app = express();
import request from "request";
import pkg from 'body-parser';
const { json, urlencoded } = pkg;

app.use(json());
app.use(urlencoded({ extended: true }));

app.post("/webhook", async (req, res) => {
 const Payload = req.body;
//Respond To Heroku Webhook
 res.sendStatus(200);

 const options = {
  method: "POST",
  url:
   "https://discord.com/api/webhooks/846362498952986646/LXK4yC-jN7qEqw_ZIOMKyEhf8v705SAB896XRdKyE6PCWW2Iz_IgdDXiWMjkQPpjuAYb",
  headers: {
   "Content-type": "application/json",
  },
//Format JSON DATA
  body: JSON.stringify({
   content: `This is A Webhook notification!A build for your app ${Payload.data.app.name} was just triggered`,
  }),
 };
 request(options, function (error, response) {
  if (error) throw new Error(error);
  console.log(response);
 });
});
app.listen(3000, () => console.log("App is running on port 3000!"));