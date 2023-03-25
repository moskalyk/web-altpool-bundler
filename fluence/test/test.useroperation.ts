
import {registerPeer, registerAltPool, writeToPool, getPeers} from '../generated/AltPool'
import { Fluence } from '../node_modules/@fluencelabs/fluence/dist/index';
import { krasnodar } from '../node_modules/@fluencelabs/fluence-network-environment/dist/index';

(async (BUNDLER_ID: any)=>{
    await Fluence.start({
        connectTo: krasnodar[0]
    })
    
        const peers = await getPeers(BUNDLER_ID)

        setInterval(async () => {
            try{
                    const res = await writeToPool({address: '0x', nonce: Date.now()}, peers[peers.length - 1], true)
                    console.log(res)
            }catch(e){
                console.log(e)
                console.log('error writing')
            }
        }, 5000)


    console.log('connected', Fluence.getStatus().peerId)
})("12D3KooWJdoDgBh9t5bxvCW6E9cErensp33NN8Vc1GRKhPi2JNhs")