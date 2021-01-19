const express = require("express");
const router = express.Router();
const StreamrClient = require('streamr-client')
const ethers = require('ethers')


router.post("/form",(req,res)=>{
var SHARED_SECRET = "9rpMdLArQ3C8_-ISvBLrLgrTzIjC2oRFuE5YuPyfyc3w"
var DATA_UNION_CONTRACT_ADDRESS = "0x9a722acfb84b51e5b01b9b9331648924814f8f8d"

var playerWallet = StreamrClient.generateEthereumAccount()
console.log(playerWallet)

var provider = ethers.getDefaultProvider()
var wallet = new ethers.Wallet(playerWallet.privateKey)

const streamr = new StreamrClient({
    auth: {
        privateKey: playerWallet.privateKey
    },
        url: "wss://hack.streamr.network/api/v1/ws",
        restUrl : "https://hack.streamr.network/api/v1"

})


streamr.joinDataUnion(DATA_UNION_CONTRACT_ADDRESS, SHARED_SECRET)
  .then((memberDetails)=> {
    console.log('memberDetails: ', memberDetails)
    streamr.publish('0xfe0d298da1223de5d6b3ef8c0785ab57a46e68f5/test', {
        temperature: 21.4,
        humidity: 21,
        happy: false,
    }).then(()=>{
    streamr.getMemberStats(DATA_UNION_CONTRACT_ADDRESS, memberDetails.memberAddress)
    .then((stats) => {
      console.log('stats:', stats)
})
  })
})
res.send("data sent")
});
module.exports = router;
