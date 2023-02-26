import { CardanoWallet, useWallet, WalletContext } from "@meshsdk/react";
import React, {useState} from "react";
import { AppWallet } from "@meshsdk/core";
import { createTransaction } from "../backend";




const Home = function() {

  const [loading , setLoading] = useState<boolean>(false);
  const { wallet, connected, name, connecting, connect, disconnect, error } = useWallet();


  const test = async function() {
    setLoading(true);
    try {
        console.log("test is ok");
        const changeAddress = await wallet.getChangeAddress();
        console.log("changeAddress ",changeAddress)
        const utxos = await wallet.getUtxos();
        console.log("utxo ", utxos);
        const mnemonic = AppWallet.brew();
        console.log(
          "mnemonic", mnemonic
        )
          console.log("start");
        const { unsignedTx } = await createTransaction(changeAddress, utxos);
        console.log("unsignedTx ", unsignedTx);
        const signedTx = await wallet.signTx(unsignedTx, true);
        const txHash = await wallet.submitTx(signedTx);
        console.log("txHash", txHash);
        
        console.log("finish")
    } catch(error) {

    }

    setLoading(false)
  }
  return (
    <>
      <input type= "file" style={{
        padding: 10
      }}/>
      
      <CardanoWallet/>

      {loading ? "loadding...": <button style={{
        padding: 10
      }}onClick={() => test()}>Test</button>}
    </>
  )
}

export default Home;