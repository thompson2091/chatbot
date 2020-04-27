# chatbot
This repository houses a test chatbot application that utilizes Socket.io and Wit.ai to collect leads.  There is also integration with the Slack Event and Web APIs that can be enabled.

```
npm install
npm run dev

localhost:3001  = typical form to insert lead
localhost:3001/chat = this is where you can chat with our bot using socket.io
localhost:3001/bots/slack/events = slack events api callback endpoint
```
