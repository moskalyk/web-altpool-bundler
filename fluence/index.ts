import {Fluence}from "@fluencelabs/fluence";
import { krasnodar } from '@fluencelabs/fluence-network-environment';
const hyperswarm = require('hyperswarm')
const crypto = require('crypto');

(async () => {

    const swarm = new hyperswarm()

    await Fluence.start({
        connectTo: krasnodar[0]
    })

    swarm.on('connection', (connection) => {
        console.log(connection)
      })    

    const topic = crypto.createHash('sha256')
    .update('cribbage')
    .digest()

    swarm.join(topic)

    console.log("connected", Fluence.getStatus().peerId)
})()