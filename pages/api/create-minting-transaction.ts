import type { NextApiRequest, NextApiResponse } from "next";
import { KoiosProvider, AppWallet, ForgeScript, AssetMetadata, Mint, largestFirst, Transaction, UTxO } from "@meshsdk/core";

type Data = {
    recipientAddress: string;
    utxos: UTxO[]
}

const handler = async function(
    request: NextApiRequest, 
    response: NextApiResponse,
)  {
    try {
        console.log("mint ...");
        
        const recipientAddress = request.body.recipientAddress;
        const utxos = request.body.utxos;
        
        const koiosProvider = new KoiosProvider("preprod");
        

        const appWallet = new AppWallet({
            networkId: 0,
            fetcher: koiosProvider,
            submitter: koiosProvider,
            key: {
                type: "mnemonic",
                words: ['acid', 'forget', 'trouble', 'reduce', 'sunset', 'lens', 'embody', 'salad', 'thought', 'mystery', 'since', 'canal', 'mistake', 'insect', 'city', 'fire', 'country', 'spice', 'fluid', 'isolate', 'decorate', 'accident', 'monitor', 'install']
            }
        })


        const appWalletAddress = appWallet.getPaymentAddress();
        const forgingScript = ForgeScript.withOneSignature(appWalletAddress);

        const assetName = "Nguyen Khanh";
        const assetMetadata: AssetMetadata = {
            name: "Nguyen Khanh",
            image: "ipfs://QmRzicpReutwCkM6aotuKjErFCUD213DpwPq6ByuzMJaua",
            mediaType: "image/png",
        }


        const asset: Mint = {
            assetName: assetName,
            assetQuantity: "1",
            metadata: assetMetadata,
            label: "721",
            recipient: recipientAddress,
        }


        const costLoveLace = '10000000';
        const selectedUtxos = largestFirst(costLoveLace, utxos, true);
        const bankWalletAddress = "addr_test1qrpvgytw7tejqfp82jpppztaq4zpc3qh0w75yyjxhm69x03nv2xkhsrfk0k3xe7gy3g06jcknw4ddvtvez3t5uhueuuqmxvzfj";
        const tx = new Transaction({initiator: appWallet});
        tx.setTxInputs(selectedUtxos);
        tx.mintAsset(forgingScript, asset);
        tx.sendLovelace(bankWalletAddress, costLoveLace),
        tx.setChangeAddress(recipientAddress);
        const _unsignedTx = await tx.build();
        const unsignedTx = await appWallet.signTx(_unsignedTx, true);


        response.status(200).json({
            unsignedTx: unsignedTx
        })
    } catch(error) {

    }
}


export default handler;