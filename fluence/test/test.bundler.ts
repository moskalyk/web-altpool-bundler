
import {registerPeer, registerBundler, readPool, getPeers} from '../generated/AltPool'
import { Fluence } from '../node_modules/@fluencelabs/fluence/dist/index';
import { krasnodar } from '../node_modules/@fluencelabs/fluence-network-environment/dist/index';

(async ()=>{
    await Fluence.start({
        connectTo: krasnodar[0]
    })

    const peer = []

    registerBundler({
        peers: () => {
            console.log('read')
            // loop through
            return peer
        },
        register: (peer_id: any) => {
            console.log('register')
            peer.push(peer_id)
            return true
        }
    })

    setInterval(async () => {
        try{
            const res0 = await getPeers(Fluence.getStatus().peerId)
            console.log(res0)
            try {
                const res = await readPool(res0[res0.length - 1])
                console.log(res)
            }catch(e){
                console.log(e)
            }
        }catch(e){
                
        }
    }, 4000)

    console.log('connected', Fluence.getStatus().peerId)
})()