import { utils } from "web3";
import { NextResponse } from "next/server";

const getChainRPCEndpoint = (chain) => {
  switch (true) {
    case chain === "mantle":
      return "https://rpc.mantle.xyz";
    case chain === "linea":
      return "https://rpc.linea.build";
    case chain === "kroma":
      return "https://api.kroma.network";
    default:
      return null;
  }
};

const getPastBlockHex = (pastHours, currentBlockHex) => {
  const averageBlockTime = 14;
  const currentBlockNumber = convertToDecimal(currentBlockHex);
  console.log("sdahfiudsahfiudsahfiusdahfiudshihiuhidhfiu");
  console.log(pastHours, currentBlockHex, currentBlockNumber);
  //  Calculate number of blocks in 12 hours

  // 12 hours in seconds
  const secondsInPastHours = pastHours * 60 * 60;
  const blocksInPastHours = Math.floor(secondsInPastHours / averageBlockTime);

  // Estimate the block number 12 hours ago
  const pastBlockNumber = currentBlockNumber - blocksInPastHours;
  console.log(pastBlockNumber);
  const pastBlockHex = utils.toHex(pastBlockNumber);
  console.log(pastBlockHex);
  return pastBlockHex;
};

const getTokenBalance = async (
  blockAddress = "latest",
  contractAddress,
  chainEndpoint
) => {
  const rpcBody = {
    jsonrpc: "2.0",
    method: "eth_getBalance",
    params: [contractAddress, blockAddress],
    id: 1,
  };
  const res = await fetch(chainEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(rpcBody),
  });
  const { result } = await res.json();
  return result;
};

const getRecentBlock = async (chainEndpoint) => {
  const rpcBody = {
    jsonrpc: "2.0",
    method: "eth_blockNumber",
    id: 1,
  };
  const res = await fetch(chainEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(rpcBody),
  });
  const { result } = await res.json();
  return result;
};

const convertToDecimal = (hex) => {
  return utils.hexToNumber(hex);
};

const convertToWei = (hex) => {
  const decimal = utils.hexToNumber(hex);
  return utils.toWei(decimal, "wei");
};

// To handle a POST request to /api
export async function POST(request) {
  const body = await request.json();

  // chain will be an enum with following valid values ['mantle', 'kroma', 'linea']
  const { chain, contractAddress, pastHours } = body;
  console.log(body);
  console.log(chain, contractAddress);

  const chainEndpoint = getChainRPCEndpoint(chain);

  const currentBalanceHex = await getTokenBalance(
    "latest",
    contractAddress,
    chainEndpoint
  );
  const currentBlockHex = await getRecentBlock(chainEndpoint);

  const currentBalanceDecimal = convertToWei(currentBalanceHex) / 1e18;

  const pastBlockHex = getPastBlockHex(pastHours, currentBlockHex);
  const pastBalanceHex = await getTokenBalance(
    pastBlockHex,
    contractAddress,
    chainEndpoint
  );
  const pastBalanceDecimal = convertToWei(pastBalanceHex) / 1e18;
  console.log(pastBalanceDecimal, currentBalanceDecimal);

  const percentageChange =
    ((currentBalanceDecimal - pastBalanceDecimal) * 100) / pastBalanceDecimal;
  console.log(percentageChange);
  return NextResponse.json(
    {
      chain: chain,
      contractAddress: contractAddress,
      currentBalance: currentBalanceDecimal,
      pastBalance: pastBalanceDecimal,
      percentageChange: percentageChange,
    },
    { status: 200 }
  );
}
