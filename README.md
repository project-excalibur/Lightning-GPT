# Lightning-GPT

This is a little application that will allow users to pay XXX amount of Satoshis for a XXXms session with ChatGPT-4. You can test this application live [here](https://lightning-gpt.vercel.app/)

There are bound to be bugs and performance issues, but we wanted to release this for anyone who wanted to learn more about lightning, chatGPT and making cutting edge webapps. 

This software is open source and free to all. ( See LICENSE.md )

## How it works

On page-load the user is assigned a UUID kept in local.storage ( So they'd lose access if they cleared their browser cache ). This UUID is what allows us to track whether a user has paid. 

The flow operation:
1. We create an invoice using the `/lightning/createInvoice` route
2. User pays the invoice
3. We call `/lightning/checkInvoice` route - if invoice was paid, then set a KV of {uuid: Date.now()}
4. We can now call `/chat` route ( checks that their uuid:timestamp is within the duration )
5. We return the GPT access

## Notes
- We probably could have used a better session validation solution ( not storing a UUID in local.storage ) - however it was easy and quick to implement. So we stuck with the KISS principle.
- Our site is using https://legend.lnbits.com/ - which is fine for testing but not production. I believe they shut off access every once and a while so people don't rely on them
- We initially did pay-per-question, but the user experience was shit

## Running it yourself
If you want to run and deploy this yourself, you'll have to, clone the repo, and fill in the .env file

### Pre Req
You'll have to setup a Vercel KV project: https://vercel.com/docs/storage/vercel-kv/quickstart

### Getting it Running
First clone the Repo
`git clone https://github.com/project-excalibur/Lightning-GPT.git`

Then copy `.env.example` -> `.env`

Then you'll have to fill in all of the appropriate fields in the `.env` file

`NEXT_PUBLIC_API_URL=http://localhost:3000/api` - This is how the app knows where to route the api calls. When hosting you will have to replace this with your url + /api

`NEXT_PUBLIC_SESSION_TIME=300000` - This is how long the ChatGPT session lasts for in ms. 

`NEXT_PUBLIC_SESSION_COST=100` - How many sats per session

`GPT_API_KEY=[YOUR_KEY_HERE]` - This is your chat-gpt api key ( do not commit this to github ). You can get one [here](https://platform.openai.com/account/api-keys)

`LNBITS_API_KEY=[YOUR_KEY_HERE]` - This is what allows you to interface with the lightning network, we suggest you spin one up with Ledgend LNBits [here](https://legend.lnbits.com/). Do not use this for any production application

```
KV_REST_API_READ_ONLY_TOKEN=[YOUR_KEY_HERE]
KV_REST_API_TOKEN=[YOUR_KEY_HERE]
KV_REST_API_URL=[YOUR_URL_HERE]
KV_URL=[YOUR_URL_HERE]
```
These are your Vercel VK variables. Most of this is auto-generated using `vercel env pull .env.development.local` which will output to the file `.env.development.local`

Lastly run
`pnpm install`
`pnpm dev`