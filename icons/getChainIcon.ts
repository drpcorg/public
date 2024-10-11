import AlephZero from "./AlephZero.svg";
import Arbitrum from "./Arbitrum.svg";
import ArbitrumNova from "./ArbitrumNova.svg";
import ArbitrumNovaDark from "./ArbitrumNovaDark.svg";
import Astar from "./Astar.png";
import Aurora from "./Aurora.svg";
import Avalanche from "./Avalanche.svg";
import Axelar from "./Axelar.svg";
import Base from "./Base.svg";
import BaseDark from "./BaseDark.svg";
import Berachain from "./Berachain.svg";
import Bitcoin from "./Bitcoin.svg";
import Bittorrent from "./Bittorrent.png";
import Blast from "./Blast.svg";
import BOB from "./BOB.svg";
import Boba from "./Boba.svg";
import BSC from "./BSC.svg";
import Celo from "./Celo.svg";
import CeloDark from "./CeloDark.svg";
import Core from "./Core.png";
import CosmosHub from "./CosmosHub.svg";
import Cronos from "./Cronos.svg";
import Dymension from "./Dymension.png";
import Ethereum from "./Ethereum.svg";
import Everclear from "./Everclear.png";
import Evmos from "./Evmos.svg";
import Fantom from "./Fantom.svg";
import FantomDark from "./FantomDark.svg";
import Filecoin from "./Filecoin.svg";
import Fraxtal from "./Fraxtal.svg";
import Fuse from "./Fuse.png";
import GameSwift from "./GameSwift.png";
import Gnosis from "./Gnosis.svg";
import Goat from "./Goat.svg";
import Haqq from "./Haqq.svg";
import Harmony from "./Harmony.svg";
import Heco from "./Heco.jpeg";
import ImmutableZkEvm from "./ImmutableZkEvm.svg";
import Kava from "./Kava.svg";
import Klaytn from "./Klaytn.svg";
import Kusama from "./Kusama.svg";
import Linea from "./Linea.svg";
import Lisk from "./Lisk.png";
import Manta from "./Manta.png";
import Mantle from "./Mantle.svg";
import MantleDark from "./MantleDark.svg";
import Metall2 from "./Metall2.svg";
import Metis from "./Metis.svg";
import Mode from "./Mode.svg";
import Moonbeam from "./Moonbeam.svg";
import Moonriver from "./Moonriver.svg";
import Near from "./Near.svg";
import Neon from "./Neon.jpeg";
import Neutron from "./Neutron.jpeg";
import OKTChain from "./OKTChain.png";
import OpBNB from "./OpBNB.svg";
import OpenCampusCodex from "./OpenCampusCodex.svg";
import Optimism from "./Optimism.svg";
import Osmosis from "./Osmosis.svg";
import Playnance from "./Playnance.jpeg";
import Polkadot from "./Polkadot.svg";
import Polygon from "./Polygon.svg";
import Pyth from "./Pyth.svg";
import Quicksilver from "./Quicksilver.svg";
import ReAl from "./ReAl.svg";
import Ronin from "./Ronin.png";
import Rootstock from "./Rootstock.svg";
import Scroll from "./Scroll.svg";
import Snaxchain from "./Snaxchain.svg";
import Solana from "./Solana.svg";
import Starknet from "./Starknet.svg";
import Taiko from "./Taiko.jpg";
import Telos from "./Telos.png";
import Threshold from "./Threshold.svg";
import Thundercore from "./Thundercore.png";
import Tron from "./Tron.png";
import Umnee from "./Umnee.svg";
import Vara from "./Vara.svg";
import Vega from "./Vega.svg";
import Wemix from "./Wemix.png";
import Xlayer from "./Xlayer.png";
import Zetachain from "./Zetachain.png";
import Zircuit from "./Zircuit.svg";
import Zksync from "./Zksync.svg";
import Zora from "./Zora.png";

const Icons: Record<string, any> = {
  arbitrum: Arbitrum,
  "arb-blueberry": Arbitrum,
  "arbitrum-nova": ArbitrumNova,
  alephzero: AlephZero,
  axelar: Axelar,
  avalanche: Avalanche,
  aurora: Aurora,
  bitcoin: Bitcoin,
  base: Base,
  bsc: BSC,
  blast: Blast,
  celo: Celo,
  gnosis: Gnosis,
  fantom: Fantom,
  polygon: Polygon,
  "polygon-blackberry": Polygon,
  "polygon-zkevm": Polygon,
  "opcelestia-raspberry": Optimism,
  optimism: Optimism,
  linea: Linea,
  mantle: Mantle,
  metis: Metis,
  moonbeam: Moonbeam,
  klaytn: Klaytn,
  kusama: Kusama,
  opbnb: OpBNB,
  polkadot: Polkadot,
  pyth: Pyth,
  quicksilver: Quicksilver,
  scroll: Scroll,
  starknet: Starknet,
  threshold: Threshold,
  umnee: Umnee,
  vega: Vega,
  zksync: Zksync,
  cronos: Cronos,
  kava: Kava,
  "immutable-zkevm": ImmutableZkEvm,
  astar: Astar,
  solana: Solana,
  vara: Vara,
  okt: OKTChain,
  filecoin: Filecoin,
  harmony: Harmony,
  haqq: Haqq,
  manta: Manta,
  taiko: Taiko,
  fuse: Fuse,
  berachain: Berachain,
  lisk: Lisk,
  bittorrent: Bittorrent,
  "boba-ethereum": Boba,
  "boba-bnb": Boba,
  core: Core,
  dymension: Dymension,
  evmos: Evmos,
  heco: Heco,
  mode: Mode,
  near: Near,
  "neon-evm": Neon,
  playnance: Playnance,
  ronin: Ronin,
  everclear: Everclear,
  "cosmos-hub": CosmosHub,
  neutron: Neutron,
  osmosis: Osmosis,
  real: ReAl,
  rootstock: Rootstock,
  "open-campus-codex": OpenCampusCodex,
  gameswift: GameSwift,
  zircuit: Zircuit,
  tron: Tron,
  fraxtal: Fraxtal,
  goat: Goat,
  ethereum: Ethereum,
  telos: Telos,
  thundercore: Thundercore,
  "zeta-chain": Zetachain,
  zora: Zora,
  metall2: Metall2,
  bob: BOB,
  moonriver: Moonriver,
  wemix: Wemix,
  xlayer: Xlayer,
  snaxchain: Snaxchain,
};

const DarkIcons: Record<string, any> = {
  "arbitrum-nova": ArbitrumNovaDark,
  base: BaseDark,
  celo: CeloDark,
  fantom: FantomDark,
  mantle: MantleDark,
};

export const getChainIcon = (network: string, isDark = false) => {
  if (isDark) {
    return DarkIcons[network] ?? Icons[network] ?? Ethereum;
  }

  return Icons[network] ?? Ethereum;
};
