/***
 * address
 * */
import { assetTokens } from "../../assets/tokens";
import { BunnyPool, BunnyPoolAPY, BunnyZap } from "./types";

export const PriceCalculatorAddress: string =
  "0xE3B11c3Bd6d90CfeBBb4FB9d59486B0381D38021";
export const RocketBunnyAddress: string =
  "0x1C02773f409f260F5774c32bc77A05B8c19d3914";
export const WETH: string = "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619";
export const WMATIC: string = "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270";
export const BUNNY: string = "0x4c16f69302ccb511c5fac682c7626b9ef0dc126a";

export const DashboardAddress: string =
  "0xFA71FD547A6654b80c47DC0CE16EA46cECf93C02";
export const QuickRouter: string = "0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff";

export const Zaps: Record<string, string> = {
  QuickSwap: "0x663462430834E220851a3E981D0E1199501b84F6",
  SushiSwap: "0x93bCE7E49E26AF0f87b74583Ba6551DF5E4867B7"
};
export const Routers: Record<string, string> = {
  QuickSwap: "0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff",
  SushiSwap: "0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506"
};

export const PARTNERS_LINK = {
  discord: "https://discord.gg/HUYu6UJSZy",
  telegram: "https://t.me/pancakebunny_fin",
  twitter: "https://twitter.com/PancakeBunnyFin"
};

export const EMPTY_APY_DATA = {
  apr: "000.00",
  aprPool: "000.00",
  aprBunny: "000.00",
  aprSwap: "000.00",
  apy: "000.00",
  apyPoolComp: "000.00",
  apyPoolBorrow: "000.00",
  apyPoolBunny: "000.00",
  apyPool: "000.00",
  apyBunny: "000.00",
  apySwap: "000.00"
} as BunnyPoolAPY;

export const STORAGE_KEY_APY_DATA = "apy_data";
export const STORAGE_KEY_PERF_DATA = "perf_data";
export const STORAGE_KEY_MCAP_DATA = "mcap_data";
export const STORAGE_KEY_TVL_DATA = "tvl_data";

export const CloudEndpoint =
  "https://us-central1-bunny-polygon.cloudfunctions.net/api-bunnyData";

/**
 * links
 * */
export const LinkBunnyTokenInfo =
  "https://info.quickswap.exchange/token/0x4c16f69302ccb511c5fac682c7626b9ef0dc126a";

/**
 * wallet symbols
 * */
export const supportedWalletImageSymbols = [
  "WMATIC",
  "USDC",
  "ETH",
  "USDT",
  "BTC",
  "DAI"
];

export const tokens: Record<string, any> = require("./data/tokens.json");
export const supportedTokens = Object.keys(tokens).map((name) => {
  const token = tokens[name];
  return {
    icon: assetTokens[name],
    name: name,
    address: token.address
  };
});

export const pools: Record<string, any> = require("./data/pools.json");
export const supportedPools: BunnyPool[] = Object.keys(pools).map((name) => {
  const pool = pools[name];
  return {
    icon: assetTokens[name],
    name: name,
    address: pool.address,
    token: pool.token,
    deposit: pool.deposit ? pool.deposit : name,
    earn: pool.earn,
    summary: pool.summary ? pool.summary : null,
    description: pool.description ? pool.description : null,
    exchange: pool.exchange ? pool.exchange : null,
    type: pool.type,
    chainId: pool.chainId,
    relay: pool.relay ? pool.relay : null,
    relayToken: pool.relayToken ? pool.relayToken : null,
    path: name.replace(/-| /gi, "-"),
    closed: pool.closed,
    swap: pool.swap
  };
});

const makeZapItem = (name: string, zap: any) => {
  return {
    name: name,
    //icons: zap.symbols.map((symbol: string) => assetTokens[symbol]),
    symbols: zap.symbols,
    address: zap.address ? zap.address : null,
    virtual: zap.virtual ? zap.virtual : false,
    zapIn: zap.zapIn ? zap.zapIn : [],
    zapInToken: zap.zapInToken ? zap.zapInToken : [],
    zapOut: zap.zapOut ? zap.zapOut : [],
    wrap: zap.wrap ?? [],
    unwrap: zap.unwrap ?? [],
    index: zap.index,
    decimals: zap.decimals ? zap.decimals : [18]
  };
};

export const zaps: Record<string, any> = require("./data/zaps.json");
export const supportedZaps: BunnyZap[] = Object.keys(zaps).map((name) =>
  makeZapItem(name, zaps[name])
);

export const sushiZaps: Record<string, any> = require("./data/sushiZaps.json");
export const supportedSushiZaps: BunnyZap[] = Object.keys(
  sushiZaps
).map((name) => makeZapItem(name, sushiZaps[name]));
