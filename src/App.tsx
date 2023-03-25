import React from 'react';
import logo from './logo.svg';
import './App.css';
import { registerPeer, registerAltPool, writeToPool, getPeers } from './generated/AltPool'
import { Fluence } from '@fluencelabs/fluence';
import { krasnodar } from '@fluencelabs/fluence-network-environment';

const Hypercore = require('hypercore')
const ram = require('random-access-memory')

const core = new Hypercore(ram, {
  valueEncoding: 'json' 
})

const BUNDLER_ID = '12D3KooWEjFY51dMJ1VnwMVpMtRS9GpY24roCYXix5NPrr3U4rAA'

function App() {

  const bootUp = async () => {
      await Fluence.start({
        connectTo: krasnodar[0]
    })

    registerAltPool({
        write: async (peer_id: any, user_op: any, client: any) => {
            console.log('writing')
            // save to local
            await core.append(user_op)
            if(client){
                // get all peers
                const peers = await getPeers(BUNDLER_ID)
                console.log(peers)
                for (const peer of peers) {
                    // write to peer
                    if(peer != peer_id){
                        try{
                            console.log('write')
                            const res = await writeToPool(user_op, peer, false, {ttl: 7000})
                            console.log(res)
                        }catch(e){
                            console.log(e)
                            return false
                        }
                    }
                }
            }
            return true
        },
        read: async () => {
            console.log('read')
            const blob = []
            for await (const key of core.createReadStream()) {
                console.log(key)
                blob.push(key)
            }
            // loop through
            return blob
        }
    })

    const res = await registerPeer(BUNDLER_ID)
    console.log(res)

    setInterval(async () => {
        for await (const key of core.createReadStream()) {
            console.log(key)
        }
    }, 2000)

    console.log('connected', Fluence.getStatus().peerId)
  }

  React.useEffect(() => {
    bootUp()
  })

  const userOperation = async () => {
    const peers = await getPeers(BUNDLER_ID)
    const res = await writeToPool({address: '0x', nonce: Date.now()}, peers[peers.length - 1], true)
  }

  return (
    <div className="App">
      <button onClick={() => {userOperation()}}>user 𝒏uance</button>
    </div>
  );
}

export default App;
