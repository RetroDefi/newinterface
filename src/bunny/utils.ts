import BigNumber from "bignumber.js";
import { isAddress } from "@ethersproject/address";
import { AddressZero, MaxUint256 } from "@ethersproject/constants";
import { TransactionReceipt } from "@ethersproject/providers";
import {
  EMPTY_APY_DATA,
  RocketBunnyAddress,
  supportedPools,
  supportedSushiZaps,
  supportedWalletImageSymbols,
  supportedZaps,
  WETH,
  Zaps
} from "./lib/constants";
import { TransactionDetails } from "../state/transactions/reducer";
import ApolloClient from "apollo-client/ApolloClient";
import { NormalizedCacheObject } from "apollo-cache-inmemory";
//import { GET_BLOCKS } from "../apollo/queries";
import { polygonBlockClient } from "../apollo/client";
import { ChainId, polyRPC } from "../connections/connectors";
import Bunny from "./Bunny";
import {
  Auction,
  BunnyPool,
  BunnyPoolAPY,
  BunnyPoolValue,
  BunnyPoolWithValue,
  BunnyZap,
  PoolTypes,
  Swap
} from "./lib/types";
import { TransactionResponse } from "@ethersproject/abstract-provider";

BigNumber.config({
  EXPONENTIAL_AT: [-100, 100],
  DECIMAL_PLACES: 18
});

const DUST = new BigNumber(1000);
const ZERO = new BigNumber(0);
const MWEI = new BigNumber(10).pow(6);
const ETHER = new BigNumber(10).pow(18);
const UINT_MAX = new BigNumber(MaxUint256.toString());
const EMPTY_ADDRESS = AddressZero;
export { BigNumber, ZERO, MWEI, ETHER, UINT_MAX, EMPTY_ADDRESS, DUST };

export const POLY_GUIDE =
  "https://docs.matic.network/docs/develop/metamask/hello";
export const getPolyScanTokenLink = (token: string) =>
  `https://polygonscan.com/token/${token}`;
export const getPolyScanAddressLink = (address: string) =>
  `https://polygonscan.com/address/${address}`;
export const getPolyScanTxLink = (hash: string) =>
  `https://polygonscan.com/tx/${hash}`;

export const isEmptyObject = (obj: object) => !obj || !Object.keys(obj).length;
export const isEmptyArray = (arr: any[]) => !arr || arr.length === 0;
export const snooze = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Display
 * */
export const addComma = (numString: string) => {
  let numParts = numString.split(".");
  numParts[0] = numParts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return numParts.join(".");
};

export const shortenAddress = (address: string) => {
  if (!address) return "";
  return `${address.substring(0, 6)}...${address.substring(
    address.length - 4,
    address.length
  )}`;
};

export const shortenTransaction = (hash: string) => {
  if (!hash) return "";
  return hash.slice(0, 8) + "..." + hash.slice(58, 65);
};

export const toDisplayBalanceComma = (
  balance: BigNumber | number,
  decimals = 18,
  digits: boolean = true
): string => {
  const balanceBigNumber: BigNumber =
    typeof balance === "number" ? new BigNumber(balance).times(ETHER) : balance;
  const displayBalance = balanceBigNumber.dividedBy(
    new BigNumber(10).pow(decimals)
  );
  if (displayBalance.lt(1)) {
    return digits ? displayBalance.toPrecision(4) : displayBalance.toString();
  } else {
    return addComma(
      digits ? displayBalance.toFixed(2) : displayBalance.toFixed(0)
    );
  }
};

export const toDisplayBalance = (balance: BigNumber, decimals = 18): string => {
  const displayBalance = balance.dividedBy(new BigNumber(10).pow(decimals));
  if (displayBalance.lt(1)) {
    return displayBalance.toPrecision(4);
  } else {
    return displayBalance.toFixed(2);
  }
};

export const toFullDisplayBalance = (
  balance: BigNumber,
  decimals = 18
): string => {
  return balance.dividedBy(new BigNumber(10).pow(decimals)).toFixed();
};

export const toBalanceFromDisplay = (val: string, decimals = 18): BigNumber => {
  const value = new BigNumber(val);
  return value.dividedBy(new BigNumber(10).pow(18 - decimals));
};

export const toDisplayNumber = (balance: BigNumber, decimals = 18): number => {
  const displayBalance = balance.dividedBy(new BigNumber(10).pow(decimals));
  return displayBalance.toNumber();
};

export const toDisplayAPYPercent = (percent: BigNumber): string => {
  return percent.times(100).div(ETHER).toFixed(2);
};

export const toDisplayPercent = (percent: number | BigNumber): string => {
  if (!percent) return "-.--";
  if (typeof percent === "number") {
    return percent.toFixed(2);
  } else {
    return (percent as BigNumber).times(100).div(ETHER).toFixed(2);
  }
};

export const isMore = (target: string, base: string): boolean => {
  return new BigNumber(target).gt(new BigNumber(base));
};

/**
 * Portfolio
 * */
export const getPortfolioEvaluated = async (
  bunny: Bunny
): Promise<BigNumber> => {
  if (!isAddress(bunny.account)) throw new Error("Invalid Account");

  try {
    const dashboardBSC = bunny.contracts.getDashboardContract();

    const evaluatedBSC = await dashboardBSC.portfolioOf(
      bunny.account,
      supportedPools
        .filter((each) => each.type !== PoolTypes.Compensate)
        .map((each) => each.address)
    );
    return new BigNumber(evaluatedBSC.toString());
  } catch (ex) {
    throw ex;
  }
};

/**
 * network
 * */
export const setupMATICNetwork = async (): Promise<boolean> => {
  try {
    const provider = window.ethereum;
    if (!provider) return false;

    await provider.request({
      method: "wallet_addEthereumChain",
      params: [
        {
          chainId: `0x${ChainId.POLY.toString(16)}`,
          chainName: "Polygon Network",
          nativeCurrency: { name: "MATIC", symbol: "MATIC", decimals: 18 },
          rpcUrls: [polyRPC],
          blockExplorerUrls: ["https://polygonscan.com/"]
        }
      ]
    });
    return true;
  } catch (ex) {
    console.warn("ex", ex, setupMATICNetwork.name);
    return false;
  }
};

/**
 * transactions
 * */
export const calculateGasMargin = (value: any): BigNumber =>
  new BigNumber(value.toString()).times(150).idiv(100);

export const fetchTxReceipt = async (
  bunny: Bunny,
  hash: string
): Promise<TransactionReceipt> => {
  return await bunny.contracts.library.getTransactionReceipt(hash);
};

export const isRecentTransaction = (tx: TransactionDetails): boolean => {
  return new Date().getTime() - tx.addedTime < 86_400_000;
};

export const sortByNewTransactions = (
  a: TransactionDetails,
  b: TransactionDetails
) => {
  return b.addedTime - a.addedTime;
};

/**
 * erc20
 * */
export const getTokenBalance = async (
  bunny: Bunny,
  token: string
): Promise<BigNumber> => {
  if (!bunny || !bunny.account) return ZERO;

  try {
    if (!token) {
      return ZERO;
    } else if (token === EMPTY_ADDRESS) {
      const bnbBalance = await bunny.contracts.library.getBalance(
        bunny.account
      );
      return new BigNumber(bnbBalance.toString());
    } else {
      const tokenContract = bunny.contracts.getTokenReadOnlyContract(token);
      const tokenBalance = await tokenContract.balanceOf(bunny.account);
      return new BigNumber(tokenBalance.toString());
    }
  } catch (ex) {
    console.warn("ex", ex, getTokenBalance.name);
    return ZERO;
  }
};

export const getTokenBalanceInUSD = async (
  bunny: Bunny,
  token: string,
  balance: string,
  chainId: ChainId
): Promise<BigNumber> => {
  try {
    const priceCalculator = bunny.contracts.getPriceCalculator();
    const { 1: valueInUSD } = await priceCalculator.valueOfAsset(
      token,
      balance
    );
    return new BigNumber(valueInUSD.toString());
  } catch (ex) {
    console.warn("ex", ex, getTokenBalanceInUSD.name);
    return ZERO;
  }
};

export const getTokenAllowance = async (
  bunny: Bunny,
  token: string,
  spender: string
): Promise<BigNumber> => {
  if (!bunny || !bunny.account) return ZERO;

  try {
    if (!token) {
      return ZERO;
    } else if (token === EMPTY_ADDRESS) {
      return UINT_MAX;
    } else {
      const tokenContract = bunny.contracts.getTokenReadOnlyContract(token);
      const tokenAllowance = await tokenContract.allowance(
        bunny.account,
        spender
      );
      return new BigNumber(tokenAllowance.toString());
    }
  } catch (ex) {
    console.warn(getTokenAllowance.name, ex);
    return ZERO;
  }
};

export const getBunnyPrice = async (bunny: Bunny): Promise<BigNumber> => {
  try {
    const priceCalculator = bunny.contracts.getPriceCalculator();
    const bunnyPrice = await priceCalculator.priceOfBunny();
    return new BigNumber(bunnyPrice.toString());
  } catch (ex) {
    return ZERO;
  }
};

// TODO parameter ordering
export const registerTokenToWallet = async (
  bunny: Bunny,
  symbol: string,
  address: string
) => {
  try {
    if (!address || address === EMPTY_ADDRESS) return;

    const tokenContract = bunny.contracts.getTokenReadOnlyContract(address);
    const decimals = await tokenContract.decimals();

    const loweredSymbol = symbol
      .trim()
      .toLowerCase()
      .replaceAll(" flip", "")
      .replaceAll(" lp", "")
      .replaceAll("-", "_");

    const image = supportedWalletImageSymbols.includes(symbol)
      ? `https://raw.githubusercontent.com/PancakeBunny-finance/Bunny/main/assets/wallet-logo-${loweredSymbol}.png`
      : undefined;
    // @Danny FLIP to LP (zaps.json)
    let symbolInWallet = symbol.includes("FLIP")
      ? "UNI-V2"
      : symbol.includes("LP")
      ? "UNI-V2"
      : symbol;

    await bunny.contracts.library.provider.request({
      method: "wallet_watchAsset",
      params: {
        type: "ERC20",
        options: {
          address: address,
          symbol: symbolInWallet,
          decimals: decimals,
          image: image
        }
      }
    } as any);
  } catch (ex) {
    console.warn("ex", ex, registerTokenToWallet.name);
  }
};

/**
 * Apollo Graph
 * */
const splitQuery = async (
  query: any,
  localClient: ApolloClient<NormalizedCacheObject>,
  vars: any[],
  list: number[],
  skipCount = 100
) => {
  let fetchedData = {};
  let allFound = false;
  let skip = 0;

  while (!allFound) {
    let end = list.length;
    if (skip + skipCount < list.length) {
      end = skip + skipCount;
    }
    let sliced = list.slice(skip, end);
    let result = await localClient.query({
      query: query(...vars, sliced),
      fetchPolicy: "cache-first"
    });
    fetchedData = {
      ...fetchedData,
      ...result.data
    };
    if (
      Object.keys(result.data).length < skipCount ||
      skip + skipCount > list.length
    ) {
      allFound = true;
    } else {
      skip += skipCount;
    }
  }

  return fetchedData;
};

export const getBlocksFromTimestamps = async (
  chainId: number,
  timestamps: number[],
  skipCount = 500
) => {
  if (timestamps.length === 0) {
    return [];
  }

  const blocks = [];
  const fetchedData: any = await splitQuery(
    GET_BLOCKS,
    polygonBlockClient,
    [],
    timestamps,
    skipCount
  );
  if (fetchedData) {
    for (let t in fetchedData) {
      if (fetchedData.hasOwnProperty(t) && fetchedData[t].length > 0) {
        blocks.push({
          timestamp: t.split("t")[1],
          number: fetchedData[t][0]["number"]
        });
      }
    }
  }
  return blocks;
};

export const getAuction = async (bunny: any): Promise<Auction> => {
  try {
    const rocketBunny = await bunny.contracts.getRocketBunnyReadOnly();
    const result = await rocketBunny.getAuction(0);

    const auctionId = 0;
    const tokenContract = bunny.contracts.getTokenReadOnlyContract(
      result.token
    );
    const tokenSymbol = await tokenContract.symbol();
    const tokenDecimals = await tokenContract.decimals();

    let info: Auction = {
      id: 0,
      name: result.name,
      deadline: result.deadline.toNumber(),
      swapRatio: result.swapRatio.toNumber() / 10000,
      allocation: new BigNumber(result.allocation.toString()),
      capacity: new BigNumber(result.capacity.toString()),
      engaged: new BigNumber(result.engaged.toString()),
      token: result.token,
      tokenRemain: new BigNumber(result.tokenRemain.toString()),
      tokenSupply: new BigNumber(result.tokenSupply.toString()),
      tokenContract: tokenContract,
      tokenSymbol: tokenSymbol,
      tokenDecimals: tokenDecimals,
      archived: result.archived,
      beneficiary: result.beneficiary,
      option: result.option,
      accountEngaged: new BigNumber(0),
      accountClaimed: false
    };

    if (bunny.account) {
      const { 0: engaged, 1: claim } = await rocketBunny.getUserInfo(
        auctionId,
        bunny.account
      );
      info.accountEngaged = new BigNumber(engaged.toString());
      info.accountClaimed = claim;
    }

    return info;
  } catch (ex) {
    return undefined;
  }
};

export const approvePresale = async (bunny: any): Promise<any> => {
  try {
    const maxUint256 = MaxUint256.toString();
    const tokenContract = bunny.contracts.getTokenContract(WETH);
    const gasOptions = await bunny.estimateTxGas(
      tokenContract.estimateGas.approve(RocketBunnyAddress, maxUint256)
    );
    return await tokenContract.approve(RocketBunnyAddress, maxUint256, {
      ...gasOptions
    });
  } catch (ex) {
    console.warn("ex", ex, approvePresale.name);
    return undefined;
  }
};

export const joinAuction = async (
  bunny: any,
  id: number,
  amount: string
): Promise<any> => {
  try {
    const amountWithDecimals = new BigNumber(amount).times(ETHER).toString();
    const rocketBunny = bunny.contracts.getRocketBunny();
    const gasOptions = await bunny.estimateTxGas(
      rocketBunny.estimateGas.engage(id, amountWithDecimals)
    );
    return await rocketBunny.engage(id, amountWithDecimals, { ...gasOptions });
  } catch (ex) {
    console.warn("ex", ex, joinAuction.name);
    return undefined;
  }
};

export const getPools = async (
  bunny: Bunny,
  chainId: number,
  apyData: Record<string, BunnyPoolAPY>
): Promise<BunnyPoolWithValue[]> => {
  try {
    const account = bunny.account ? bunny.account : EMPTY_ADDRESS;
    const dashboardContract = bunny.contracts.getDashboardContract();
    const filteredPools = supportedPools.filter((pool) => pool.address);
    const responses: any[] = await dashboardContract.poolsOf(
      account,
      filteredPools.map((each) => each.address)
    );
    const result = responses.map((info, index: number) => {
      const pool = filteredPools[index];
      const poolValue: BunnyPoolValue = {
        balance: ZERO,
        principal: ZERO,
        available: ZERO,
        tvl: ZERO,
        utilized: ZERO,
        liquidity: ZERO,
        pBASE: ZERO,
        pBUNNY: ZERO,
        portfolio: ZERO,
        depositedAt: 0,
        feeDuration: 0,
        feePercentage: 0,
        ...(apyData[pool.address] || EMPTY_APY_DATA)
      };

      try {
        poolValue.balance = new BigNumber(info.balance.toString());
        poolValue.principal = new BigNumber(info.principal.toString());
        poolValue.available = new BigNumber(info.available.toString());
        poolValue.tvl = new BigNumber(info.tvl.toString());
        poolValue.pBASE = new BigNumber(info.pBASE.toString());
        poolValue.pBUNNY = new BigNumber(info.pBUNNY.toString());
        poolValue.portfolio = new BigNumber(info.portfolio.toString());
        poolValue.depositedAt = info.depositedAt.toNumber();
        poolValue.feeDuration = info.feeDuration.toNumber();
        poolValue.feePercentage = info.feePercentage.toNumber() / 100;
      } catch (e) {
        if (window.dev) {
          console.warn(pool.name, e);
        }
      }
      return { ...pool, ...poolValue };
    });

    return result.filter((each) => !!each);
  } catch (ex) {
    if (window.dev) {
      console.log("ex", ex, getPools.name);
    }
    return [];
  }
};

export const getPool = async (
  bunny: Bunny,
  name: string,
  apyData: Record<string, BunnyPoolAPY>
): Promise<BunnyPoolWithValue | null> => {
  const account = bunny.account ? bunny.account : EMPTY_ADDRESS;
  const pool = supportedPools.find((pool) => pool.name === name);
  if (!pool) return null;

  const poolValue: BunnyPoolValue = {
    balance: ZERO,
    principal: ZERO,
    available: ZERO,
    tvl: ZERO,
    utilized: ZERO,
    liquidity: ZERO,
    pBASE: ZERO,
    pBUNNY: ZERO,
    portfolio: ZERO,
    depositedAt: 0,
    feeDuration: 0,
    feePercentage: 0,
    ...(apyData[pool.address] || EMPTY_APY_DATA)
  };

  try {
    const dashboardContract = bunny.contracts.getDashboardContract();
    const info = await dashboardContract.infoOfPool(pool.address, account);
    poolValue.balance = new BigNumber(info.balance.toString());
    poolValue.principal = new BigNumber(info.principal.toString());
    poolValue.available = new BigNumber(info.available.toString());
    poolValue.tvl = new BigNumber(info.tvl.toString());
    poolValue.pBASE = new BigNumber(info.pBASE.toString());
    poolValue.pBUNNY = new BigNumber(info.pBUNNY.toString());
    poolValue.portfolio = new BigNumber(info.portfolio.toString());
    poolValue.depositedAt = info.depositedAt.toNumber();
    poolValue.feeDuration = info.feeDuration.toNumber();
    poolValue.feePercentage = info.feePercentage.toNumber() / 100;

    return { ...pool, ...poolValue };
  } catch (e) {
    if (window.dev) {
      console.warn(pool.name, e);
    }

    return { ...pool, ...poolValue };
  }
};

export const poolApprove = async (
  bunny: Bunny,
  pool: BunnyPool
): Promise<TransactionResponse> => {
  try {
    const maxUint256 = MaxUint256.toString();
    const tokenContract = bunny.contracts.getTokenContract(pool.token);

    const gasOptions = await bunny.estimateTxGas(
      tokenContract.estimateGas.approve(pool.address, maxUint256)
    );
    return await tokenContract.approve(pool.address, maxUint256, {
      ...gasOptions
    });
  } catch (ex) {
    console.warn("ex", ex, poolApprove.name);
    return undefined;
  }
};

export const poolDeposit = async (
  bunny: Bunny,
  pool: BunnyPool,
  amount: string
): Promise<TransactionResponse> => {
  try {
    const amountWithDecimals = new BigNumber(amount).times(ETHER).toString();
    const strategyContract = bunny.contracts.getStrategyContract(pool.address);

    if (pool.token === EMPTY_ADDRESS) {
      const gasOptions = await bunny.estimateTxGas(
        strategyContract.estimateGas.depositBNB({ value: amountWithDecimals })
      );
      return await strategyContract.depositBNB({
        value: amountWithDecimals,
        ...gasOptions
      });
    } else {
      const gasOptions = await bunny.estimateTxGas(
        strategyContract.estimateGas.deposit(amountWithDecimals)
      );
      return await strategyContract.deposit(amountWithDecimals, {
        ...gasOptions
      });
    }
  } catch (ex) {
    console.warn("ex", ex, poolDeposit.name);
    return undefined;
  }
};

export const poolWithdraw = async (
  bunny: Bunny,
  pool: BunnyPool,
  amount: string
): Promise<TransactionResponse> => {
  try {
    const amountWithDecimals = new BigNumber(amount).times(ETHER).toString();
    const strategyContract = bunny.contracts.getStrategyContract(pool.address);

    // TODO check use withdraw function
    const useUnderlying =
      pool.type === PoolTypes.FlipToFlip ||
      pool.type === PoolTypes.BunnyToBunny ||
      pool.type === PoolTypes.BunnyETH;
    if (useUnderlying) {
      const gasOptions = await bunny.estimateTxGas(
        strategyContract.estimateGas.withdrawUnderlying(amountWithDecimals)
      );
      return await strategyContract.withdrawUnderlying(amountWithDecimals, {
        ...gasOptions
      });
    } else {
      const gasOptions = await bunny.estimateTxGas(
        strategyContract.estimateGas.withdraw(amountWithDecimals)
      );
      return await strategyContract.withdraw(amountWithDecimals, {
        ...gasOptions
      });
    }
  } catch (ex) {
    console.warn("ex", ex, poolWithdraw.name);
    return undefined;
  }
};

export const poolClaim = async (
  bunny: Bunny,
  pool: BunnyPool
): Promise<TransactionResponse> => {
  try {
    const strategyContract = bunny.contracts.getStrategyContract(pool.address);

    const gasOptions = await bunny.estimateTxGas(
      strategyContract.estimateGas.getReward()
    );
    return await strategyContract.getReward({ ...gasOptions });
  } catch (ex) {
    console.warn("ex", ex, poolClaim.name);
    return undefined;
  }
};

export const poolRedeem = async (
  bunny: Bunny,
  pool: BunnyPool
): Promise<TransactionResponse> => {
  try {
    const strategyContract = bunny.contracts.getStrategyContract(pool.address);

    const gasOptions = await bunny.estimateTxGas(
      strategyContract.estimateGas.withdrawAll()
    );
    return await strategyContract.withdrawAll({ ...gasOptions });
  } catch (ex) {
    console.warn("ex", ex, poolRedeem.name);
    return undefined;
  }
};

/**
 * Zap
 * */
export const getZapItems = (
  selected: BunnyZap | undefined = undefined,
  swap: Swap | undefined = undefined
): BunnyZap[] => {
  try {
    const zapList =
      swap === Swap.SushiSwap ? supportedSushiZaps : supportedZaps;
    if (selected) {
      const merged = [
        ...zapList.filter((zap) => selected.zapIn.includes(zap.name)),
        ...zapList.filter((zap) => selected.zapInToken.includes(zap.name)),
        ...zapList.filter((zap) => selected.zapOut.includes(zap.name)),
        ...zapList.filter((zap) => selected.wrap.includes(zap.name)),
        ...zapList.filter((zap) => selected.unwrap.includes(zap.name))
      ];
      return merged.sort((a, b) => {
        if (a.index < b.index) return -1;
        if (a.index > b.index) return 1;
        return 0;
      });
    } else {
      return zapList.filter((zap) => !zap.virtual);
    }
  } catch {
    return [];
  }
};

export const zapApprove = async (
  bunny: Bunny,
  tokenIn: BunnyZap,
  swap: Swap
): Promise<TransactionResponse> => {
  try {
    const maxUint256 = MaxUint256.toString();
    const tokenContract = bunny.contracts.getTokenContract(tokenIn.address);

    const zapAddress = Zaps[swap];
    const gasOptions = await bunny.estimateTxGas(
      tokenContract.estimateGas.approve(zapAddress, maxUint256)
    );
    return await tokenContract.approve(zapAddress, maxUint256, {
      ...gasOptions
    });
  } catch (ex) {
    console.warn("ex", ex, poolApprove.name);
    return undefined;
  }
};

export const zapTokenRoute = async (
  bunny: Bunny,
  tokenIn: BunnyZap,
  tokenOut: BunnyZap,
  amount: string,
  swap: Swap
): Promise<TransactionResponse> => {
  try {
    let decimals = 18;
    if (tokenIn.address && tokenIn.address !== EMPTY_ADDRESS) {
      const tokenContract = bunny.contracts.getTokenContract(tokenIn.address);
      decimals = await tokenContract.decimals();
    }

    const amountWithDecimals = new BigNumber(amount)
      .times(new BigNumber(10).pow(decimals))
      .toString();
    const zapContract = bunny.contracts.getBunnyZap(swap);

    if (tokenIn.zapIn.includes(tokenOut.name)) {
      // MATIC -> others
      const gasOptions = await bunny.estimateTxGas(
        zapContract.estimateGas.zapIn(tokenOut.address, {
          value: amountWithDecimals
        })
      );
      return await zapContract.zapIn(tokenOut.address, {
        ...gasOptions,
        value: amountWithDecimals
      });
    } else if (tokenIn.zapInToken.includes(tokenOut.name)) {
      // others -> others
      const gasOptions = await bunny.estimateTxGas(
        zapContract.estimateGas.zapInToken(
          tokenIn.address,
          amountWithDecimals,
          tokenOut.address
        )
      );
      return await zapContract.zapInToken(
        tokenIn.address,
        amountWithDecimals,
        tokenOut.address,
        { ...gasOptions }
      );
    } else if (tokenIn.zapOut.includes(tokenOut.name)) {
      // others -> MATIC
      const gasOptions = await bunny.estimateTxGas(
        zapContract.estimateGas.zapOut(tokenIn.address, amountWithDecimals)
      );
      return await zapContract.zapOut(tokenIn.address, amountWithDecimals, {
        ...gasOptions
      });
    } else if (tokenIn.wrap.includes(tokenOut.name)) {
      // MATIC -> wMATIC
      const wmaticContract = bunny.contracts.getWMATICContract();
      const gasOptions = await bunny.estimateTxGas(
        wmaticContract.estimateGas.deposit({ value: amountWithDecimals })
      );
      return await wmaticContract.deposit({
        ...gasOptions,
        value: amountWithDecimals
      });
    } else if (tokenIn.unwrap.includes(tokenOut.name)) {
      // wMATIC -> MATIC
      const wmaticContract = bunny.contracts.getWMATICContract();
      const gasOptions = await bunny.estimateTxGas(
        wmaticContract.estimateGas.withdraw(amountWithDecimals)
      );
      return await wmaticContract.withdraw(amountWithDecimals, {
        ...gasOptions
      });
    }
  } catch (ex) {
    console.warn("ex", ex, zapTokenRoute.name);
    return undefined;
  }
};

export const getAmountsOutTokens = async (
  bunny: Bunny,
  amountIn: string,
  path: string[],
  swap: Swap
): Promise<any> => {
  try {
    const amountWithDecimals = new BigNumber(amountIn).times(ETHER).toString();
    const routerV2 = bunny.contracts.getRouterV2ContractReadOnly(swap);
    const res = await routerV2.getAmountsOut(amountWithDecimals, path);
    return new BigNumber(res[path.length - 1].toString());
  } catch (ex) {
    console.warn("ex", ex, getAmountsOutTokens.name);
    return undefined;
  }
};
