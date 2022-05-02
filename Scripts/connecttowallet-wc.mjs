"use strict"

import WalletConnect from "@walletconnect/client";
import QRCodeModal from "@walletconnect/qrcode-modal";
import Moralis from "moralis/node.js";
import Web3 from "web3"; // Only when using npm/yarn
import { convertUtf8ToHex } from "@walletconnect/utils";

/* Moralis init code */
const serverUrl = "https://7qqa1roazazw.usemoralis.com:2053/server";
const appId = "vkq9D0OSPhXmiZiBuHo7mQyCRVsa4Ru8JGQeXitq";
const masterKey = "NLHTR4Yd3LX617Eeym1IAcm4ksMlvfA9mpDkiPeo";
console.log("Hello Moralis 2");


const StartMoralis = async () => {
    await Moralis.start({ serverUrl, appId, masterKey });
    console.log('moralis started');
};

StartMoralis();

// Create a connector
const connector = new WalletConnect.default({
    bridge: "https://bridge.walletconnect.org", // Required
    qrcodeModal: QRCodeModal,
});

// Subscribe to connection events
connector.on("connect", (error, payload) => {
    if (error) {
        console.log("walletConnector connect Error ..");
        console.log(error);
        throw error;
    }

   
    // Get provided accounts and chainId
    const { accounts, chainId } = payload.params[0];
    console.log("walletConnector Connected ..");
    console.log(accounts);
    console.log(chainId);
    const account = accounts[0];
    console.log(account);
    if (!account) 
    {
        // throw new Error('Address not found');
        console.log("Address not found")
    }
    else
    {
      SignInUser(account);
    }
    
    
});

/**
 * Creates the data for the authentication message by extending the message
 * with a unique string with applicationId and current time
 */


 const MoralisCreateSigningData = async (message) =>  {
    let data;
  
    try {
      const {
        dateTime
      } = await Moralis.Cloud.run('getServerTime');
      console.log("Server Time : ");
      console.log(dateTime);
      const applicationId = Moralis.applicationId;
  
      data = `${message}\n\nId: ${applicationId}:${dateTime}`;
      console.log("MoralisCreateSigningData data : ");
      console.log(data);
    } catch (error) {
      data = `${message}`;
    }
  
    return data;
  }


  const SignPersonalMessage = async (address, message) => {
    console.log("Signing Personal Message : ");
    console.log(address);
    console.log(message);
    const msgParams = [
      convertUtf8ToHex(message),                                                 // Required
      address                             // Required
    ];
    console.log("msgParams : ");
    console.log(msgParams);
   
    // send message
    if(connector.connected)
    {
      
      const result = await connector.signMessage(msgParams);
      console.log(result);
    }
    
     
  }
const SignInUser = async (address) => {
    console.log('Signing In User : ');
    console.log(address);
    const dotAddress = address;
    const message = Moralis.Dot.getSigningData();
    console.log("message");
    console.log(message);
    const data = await MoralisCreateSigningData(message);
    console.log("SignInUser Data : ");
    console.log(data);
    await SignPersonalMessage(address, data);
};

connector.on("disconnect", (error, payload) => {
    if (error) {
        console.log("walletConnector disconnect Error ..");
        console.log(error);
        throw error;
    }
    console.log("walletConnector disconnect ..");
    // Delete walletConnector
});

// Subscribe to session requests
connector.on("session_request", (error, payload) => {
    if (error) {
        throw error;
    }
    else{
      console.log("session_request : ");
      console.log(payload);
    }

});

connector.on("session_update", (error, payload) => {
    if (error) {
        console.log("walletConnector session_update Error ..");
        console.log(error);
        throw error;
    }

    // Get updated accounts and chainId
    const { accounts, chainId } = payload.params[0];
    console.log("walletConnector session_update ..");
    console.log(accounts);
    console.log(chainId);
});

// Subscribe to call requests
connector.on("call_request", (error, payload) => {
    if (error) {
        throw error;
    }
    else{
      console.log("call_request : ");
      console.log(payload);
    }

});
if (!connector.connected) {
    // create new session
    connector.createSession().then(() => {
        // get uri for QR Code modal
        const uri = connector.uri;
        //copy the uri and use this link : https://www.the-qrcode-generator.com to generate a "FREE TEXT" QR Code
        console.log("WC URI : ");
        console.log(uri);
        
    });
}
else {
    console.log("Wallet is already connected");
}


