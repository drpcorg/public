const yaml = require("yaml");
const fs = require("fs");

let manualChains = new Map([
  [
    2020,
    {
      currency: {
        name: "Ronin",
        symbol: "RON",
        decimals: 18,
      },
      explorers: ["https://app.roninchain.com/"],
    },
  ],
  [
    7000,
    {
      explorers: ["https://explorer.zetachain.com/"],
    },
  ],
  [
    111188,
    {
      currency: {
        name: "reETH",
        symbol: "reETH",
        decimals: 18,
      },
      explorers: ["https://explorer.re.al"],
    },
  ],
  [
    1829,
    {
      currency: {
        name: "PBG",
        symbol: "PBG",
        decimals: 18,
      },
      explorers: ["https://explorer.playblock.io"],
    },
  ],
  [
    123420111,
    {
      currency: {
        name: "ETH",
        symbol: "ETH",
        decimals: 18,
      },
      explorers: ["https://opcelestia-raspberry.gelatoscout.com"],
    },
  ],
  [
    88153591557,
    {
      currency: {
        name: "ETH",
        symbol: "ETH",
        decimals: 18,
      },
      explorers: ["https://arb-blueberry.gelatoscout.com"],
    },
  ],
  [
    94204209,
    {
      currency: {
        name: "ETH",
        symbol: "ETH",
        decimals: 18,
      },
      explorers: ["https://polygon-blackberry.gelatoscout.com"],
    },
  ],
  [
    656476,
    {
      currency: {
        name: "EDU",
        symbol: "EDU",
        decimals: 18,
      },
      explorers: ["https://opencampus-codex.blockscout.com"],
    },
  ],
  [
    10888,
    {
      currency: {
        name: "GSWIFT",
        symbol: "tGS",
        decimals: 18,
      },
      explorers: ["https://testnet.gameswift.io/"],
    },
  ],
  [
    48900,
    {
      currency: {
        name: "Zircuit",
        symbol: "ETH",
        decimals: 18,
      },
      explorers: ["https://explorer.zircuit.com/"],
    },
  ],
  [
    2021,
    {
      currency: {
        name: "Ronin",
        symbol: "RON",
        decimals: 18,
      },
      explorers: ["https://saigon-app.roninchain.com"],
    },
  ],
  [
    48815,
    {
      currency: {
        name: "GOAT Testnet",
        symbol: "BTC",
        decimals: 18,
      },
      explorers: ["http://explorer.testnet.goat.network/"],
    },
  ],
]);

function merge(el) {
  let meta = {
    currency: el.nativeCurrency,
    ["chain-id"]: el.chainId,
    explorers: el.explorers?.map((el) => el.url),
  };
  if (!manualChains.has(el.chainId)) {
    return meta;
  } else {
    return {
      ...meta,
      ...manualChains.get(el.chainId),
    };
  }
}

async function init() {
  const response = await fetch("https://chainid.network/chains.json");
  const chains = await response.json();
  const chainConfig = yaml.parse(
    (await fs.promises.readFile("../chains.yaml")).toString()
  );
  const chainIds = [];
  for (let protocol of chainConfig["chain-settings"].protocols) {
    for (let chain of protocol.chains) {
      chainIds.push(chain["chain-id"]);
    }
  }
  let cids = chains.map((el) => el.chainId);
  const neededChains = chains
    .filter((el) => {
      return chainIds.includes(el.chainId) && !manualChains.has(el.chainId);
    })
    .map((el) => merge(el));
  for (let c of manualChains) {
    c[1]["chain-id"] = c[0];
    neededChains.push(c[1]);
  }
  await fs.promises.writeFile(
    "../chains-meta.yaml",
    yaml.stringify(neededChains)
  );
}

init();
