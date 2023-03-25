
import {registerPeer, registerAltPool, writeToPool, getPeers} from '../generated/AltPool'
import { Fluence } from '@fluencelabs/fluence';
import { krasnodar } from '@fluencelabs/fluence-network-environment';

const Hyperbee = require('hyperbee')
const Hypercore = require('hypercore')

// Create a Hypercore instance for the Hyperbee
const core = new Hypercore('./hyperbee-storage-2', {
valueEncoding: 'json' // The blocks will be UTF-8 strings.
})

const db = new Hyperbee(core, {
  valueEncoding: 'json'
});

(async (BUNDLER_ID: any)=>{
    await Fluence.start({
        connectTo: krasnodar[0]
    })

    registerAltPool({
        write: async (peer_id: any, user_op: any, client: any) => {
            console.log('writing')

            // save to local
            await db.put(String(user_op.nonce), user_op)

            if(client){
            //     // get all peers
                const peers = await getPeers(BUNDLER_ID)
                console.log(peers)
                for (const peer of peers) {
            //         // write to peer
                    console.log(peer)
                    console.log(peer_id)
                    if(peer != peer_id){
                        console.log('populating')
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
            for await (const { key, value } of db.createReadStream()) {
                console.log(`${key} -> ${value}`)
                blob.push(value)
            }

            // loop through
            return blob
        }
    })

    const res = await registerPeer(BUNDLER_ID)
    console.log(res)

    console.log('connected', Fluence.getStatus().peerId)
})("12D3KooWJdoDgBh9t5bxvCW6E9cErensp33NN8Vc1GRKhPi2JNhs")