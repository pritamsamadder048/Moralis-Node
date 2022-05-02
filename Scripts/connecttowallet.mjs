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



const ConnectUser = async () => {
    console.log('Connecting User....');
    const user = await Moralis.authenticate({ provider: "walletconnect", chainId: 4 });
    console.log(user.get('ethAddress'));
};

ConnectUser();
