import React from "react";

const crypto = require('crypto')
const hyperswarmweb = require('hyperswarm-web')

const App = () => {
  React.useEffect(() => {
    const port = 4977
    const hostname = `ws://localhost:${port}`
    const client = hyperswarmweb({
      bootstrap: [hostname]
    })

    client.once('connection', (connection) => {
      console.log(connection)
    })

    const topic = crypto.createHash('sha256')
    .update('cribbage')
    .digest()

    client.join(topic)
  })
  return <h1>Hello React</h1>;
};

export default App;