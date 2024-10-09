import React from "react";
import { UrlObject } from "url";

interface IGetFAQ {
  LinkComponent: React.ComponentType<{
    href: string | UrlObject;
    children: React.ReactNode;
    style?: React.CSSProperties;
  }>;
  siteMap: { EXTERNAL: { DOCS: { INDEX: string } } };
}

export const getFAQ = ({ LinkComponent, siteMap }: IGetFAQ) => {
  const DocsLink: React.FC = () => (
    <LinkComponent
      href={siteMap.EXTERNAL.DOCS.INDEX}
      style={{ textDecoration: "underline" }}
    >
      documentation
    </LinkComponent>
  );

  const BOBA = {
    what: `RPC in Boba Network enables seamless interaction with the Layer 2 solution, allowing developers to query data and execute transactions efficiently.`,
    why: `Boba Network utilizes RPC to provide external access to its Layer 2 solution, enabling developers to integrate Boba into their Web3 projects effortlessly.`,
    how: (
      <>
        Using Boba Network RPC involves sending requests to a Boba node through
        an RPC API. dRPC offers efficient and reliable Boba ETH RPC and Boba BNB
        RPC endpoints for seamless communication with the Boba Network,
        empowering developers to build scalable and secure Web3 applications.
        Learn more from dRPC&lsquo;s {DocsLink}.
      </>
    ),
  };

  const FAQ_BY_NETWORK = {
    "gelato-orbit-anytrust": {
      what: `Gelato Orbit Anytrust RPC refers to the protocol used for interfacing with the Gelato blockchain network. It allows external applications to communicate with Gelato, facilitating various operations such as querying data and executing transactions.`,
      why: `Gelato Orbit Anytrust RPC offers fast, secure, and scalable access to Gelato's blockchain network. It enables developers to build efficient and reliable Web3 applications while leveraging Gelato's innovative features and capabilities.`,
      how: (
        <>
          Using Gelato Orbit Anytrust RPC involves connecting to a Gelato node
          through an RPC API. Developers can send requests to the Gelato network
          using various tools and programming libraries. dRPC provides
          accessible Gelato Gelato Orbit Anytrust RPC endpoints, ensuring
          seamless integration and data interaction for developers and users.
          Learn more from dRPC&lsquo;s {DocsLink}.
        </>
      ),
    },
    "gelato-op-celestia": {
      what: `RPC in Gelato OP Celestia refers to the protocol used for interacting with the Celestia blockchain network. It enables external applications to communicate with the network, facilitating data retrieval and transaction processing.`,
      why: `Gelato OP Celestia utilizes RPC to provide external access to its blockchain network. This enables applications to interact with the network, query data, and perform transactions, supporting the development and adoption of decentralized applications.`,
      how: (
        <>
          Using Gelato OP Celestia RPC involves connecting to a Celestia node
          through an RPC API. dRPC offers Gelato OP Celestia RPC endpoints,
          providing reliable data access and integration for Web3 applications,
          supporting scalability and innovation in the decentralized ecosystem.
          Learn more from dRPC&lsquo;s {DocsLink}.
        </>
      ),
    },
    dymension: {
      what: `RPC in Dymension facilitates interaction with the Dymension blockchain network, allowing external applications to communicate with RollApps and access decentralized data efficiently.`,
      why: `Dymension employs RPC to provide external access to its modular blockchain network, enabling seamless communication between applications and RollApps for scalable decentralized solutions.`,
      how: (
        <>
          Using Dymension RPC involves connecting to a Dymension node through an
          RPC API. dRPC offers reliable Dymension RPC endpoints, ensuring smooth
          integration and access to decentralized data for Web3 applications.
          Learn more from dRPC&lsquo;s {DocsLink}.
        </>
      ),
    },
    playnance: {
      what: `RPC in Playnance facilitates communication between external applications and the Playnance Web3 ecosystem. It allows for efficient data retrieval and interaction, enhancing the functionality of Playnance's platforms.`,
      why: `Playnance utilizes RPC to provide external access to its Web3 iGaming platforms. It enables seamless interaction with player accounts, game data, and financial transactions, enhancing the user experience and platform functionality.`,
      how: (
        <>
          To leverage Playnance RPC, developers can connect to dRPC&apos;s RPC
          endpoints using various tools and programming libraries. This allows
          for efficient communication with the Playnance Web3 ecosystem,
          facilitating integration with gaming platforms and financial services.
          Learn more from dRPC&lsquo;s {DocsLink}.
        </>
      ),
    },
    near: {
      what: `RPC in NEAR refers to Remote Procedure Call, a protocol used for interacting with the NEAR blockchain. It enables external applications to communicate with the network, facilitating data retrieval and transaction processing.`,
      why: `NEAR utilizes RPC to provide external access to its high-performant blockchain network. It enables developers and users to interact with NEAR's ecosystem, facilitating operations such as querying data, submitting transactions, and interacting with smart contracts.`,
      how: (
        <>
          To use NEAR RPC, developers can send requests to a NEAR node through
          an RPC API. dRPC offers NEAR RPC endpoints for seamless communication
          with the NEAR blockchain, ensuring reliability and efficiency in data
          interaction and integration. Learn more from dRPC&lsquo;s {DocsLink}.
        </>
      ),
    },
    polygon: {
      what: "RPC in Polygon stands for Remote Procedure Call, a protocol enabling external applications to interact with the Polygon network. It's essential for requesting data and performing transactions efficiently on Polygon's blockchain.",
      why: `Polygon leverages RPC to facilitate external access and interaction with its Layer-2 network. This allows for operations like data queries, transaction processing, and smart contract interactions, supporting the overall scalability and efficiency of the network.`,
    },
    arbitrum: {
      what: "RPC in Arbitrum refers to the Remote Procedure Call protocol used for interacting with the Arbitrum Layer-2 network. It allows external applications to communicate with the Arbitrum blockchain, enabling data requests and transaction processing.",
      why: `Arbitrum uses RPC to offer efficient, external connectivity to its Layer-2 network. This enables streamlined interactions with smart contracts and facilitates operations like querying data and processing transactions, enhancing the scalability and accessibility of the Arbitrum network.`,
    },
    solana: {
      what: `RPC in Solana is a protocol used for interfacing with the Solana blockchain. It allows external applications to communicate with the network, making it possible to query data, submit transactions, and interact with smart contracts efficiently.`,
      why: `Solana employs RPC to provide external access to its high-speed blockchain network. It facilitates a range of operations including querying blockchain information, executing transactions, and smart contract interactions, essential for developers and users in the Solana ecosystem.`,
    },
    ethereum: {
      what: `RPC in Ethereum, which stands for Remote Procedure Call, is a communication protocol used for interacting with the Ethereum blockchain. It allows external applications to request data from, and perform actions on, the Ethereum network, typically using the JSON-RPC format.`,
      why: `Ethereum uses RPC to facilitate external access to its blockchain. It enables applications to perform operations like querying blockchain data, sending transactions, and interacting with smart contracts, without running a full node. This approach promotes decentralization and accessibility of the Ethereum network.`,
    },
    optimism: {
      what: `RPC in Optimism is a protocol that enables direct communication with the Optimism Layer 2 network, allowing users and applications to interact with the blockchain more efficiently, especially for executing transactions and querying data.`,
      why: `RPC is crucial in Optimism as it facilitates smoother and more efficient interactions with the Ethereum blockchain. It allows for the execution of smart contracts and transactions at a significantly reduced cost and higher speed, enhancing the overall scalability of Ethereum.`,
      how: (
        <>
          To use Optimism RPC, connect to an Optimism node via RPC API calls.
          These calls can be made through programming libraries or tools
          designed for blockchain connectivity. dRPC offers accessible Optimism
          RPC endpoints to ensure seamless communication with the Optimism
          network for developers and users. Learn more from dRPC&lsquo;s{" "}
          {DocsLink}.
        </>
      ),
    },
    zksync: {
      what: `RPC in zkSync is a protocol that enables direct interaction with the zkSync layer 2 network. It allows for efficient communication with the Ethereum blockchain, providing faster and more cost-effective transactions.`,
      why: `zkSync uses RPC to streamline external access to its layer 2 scaling solution, facilitating smoother and more efficient interactions with Ethereum-based applications and services.`,
    },
    base: {
      what: `Base RPC refers to the fundamental Remote Procedure Call infrastructure that facilitates core interactions with blockchain networks. It is crucial for executing basic blockchain operations, including data retrieval and transaction processing.`,
      why: `Base uses RPC to offer efficient, external connectivity to its Layer-2 network. This enables streamlined interactions with smart contracts and facilitates operations like querying data and processing transactions, enhancing the scalability and accessibility of the Base network.`,
    },
    bitcoin: {
      what: `Bitcoin RPC is a protocol enabling external applications to interact with the Bitcoin network. It allows for querying blockchain data, executing transactions, and managing wallets, enhancing the functionality and accessibility of Bitcoin.`,
      why: `RPC is crucial in Bitcoin for providing a standardized way for external software to communicate with the Bitcoin network, facilitating a wide range of operations essential for users and developers within the Bitcoin ecosystem.`,
      how: (
        <>
          To use Bitcoin RPC, you can connect through dRPC&apos;s endpoints to
          the Bitcoin network. This connection enables efficient management of
          Bitcoin transactions and access to blockchain data, making it a
          valuable tool for developers and blockchain enthusiasts. Learn more
          from dRPC&apos;s {DocsLink}.
        </>
      ),
    },
    fantom: {
      what: `RPC in Fantom refers to the Remote Procedure Call protocol, which allows for direct communication with the Fantom blockchain. It enables external applications to interact seamlessly with the network, facilitating data queries, transactions, and smart contract operations.`,
      why: `Fantom utilizes RPC to enhance its network accessibility and functionality. This protocol allows for efficient interaction with the blockchain, making it ideal for a range of applications from decentralized finance to general data retrieval.`,
      how: (
        <>
          To use Fantom RPC, you can connect to a Fantom node via RPC API. This
          involves sending structured requests, usually in JSON-RPC format. dRPC
          offers reliable Fantom RPC endpoints, simplifying the process for
          users and developers to interact with the Fantom network effectively.
          Learn more from dRPC&lsquo;s {DocsLink}.
        </>
      ),
    },
    cronos: {
      what: `RPC in Cronos is a protocol enabling external applications to interact with the Cronos blockchain. It allows for querying blockchain data, executing transactions, and managing smart contracts, vital for streamlined network operations.`,
      why: `Cronos utilizes RPC to facilitate easy access to its blockchain, ensuring developers and applications can seamlessly connect, query, and transact on the network. This approach enhances the usability and efficiency of the Cronos ecosystem.`,
      how: (
        <>
          To use Cronos RPC, connect to a Cronos node via RPC API. These
          connections can be made through various programming libraries and
          tools, allowing for smooth communication with the Cronos blockchain.
          dRPC provides reliable Cronos RPC endpoints, optimizing your
          blockchain interactions. Learn more from dRPC&lsquo;s {DocsLink}.
        </>
      ),
    },
    bsc: {
      what: `RPC in BNB refers to the protocol used for interacting with the Binance Smart Chain. It enables applications to connect to the blockchain, facilitating transactions and smart contract operations efficiently.`,
      why: `RPC plays a crucial role in BNB by enabling seamless interaction with the Binance Smart Chain. It allows for efficient and secure communication, essential for developers and businesses leveraging the blockchain's capabilities.`,
      how: (
        <>
          To connect to BNB using RPC, utilize dRPC&lsquo;s BNB RPC endpoints.
          These endpoints enable direct and reliable communication with the
          Binance Smart Chain, ensuring high-speed transactions and access to
          blockchain services. Learn more from dRPC&lsquo;s {DocsLink}.
        </>
      ),
    },
    avalanche: {
      what: `RPC in Avalanche refers to the Remote Procedure Call protocol, facilitating interaction with the Avalanche network. It allows external applications to communicate with Avalanche for data queries, transaction execution, and smart contract operations.`,
      why: `Avalanche employs RPC to enhance its accessibility and functionality, allowing for streamlined interaction with its high-speed blockchain. It is essential for efficient DApp development, data retrieval, and transaction processing on the Avalanche platform.`,
      how: `To utilize Avalanche RPC, connect to an Avalanche node via an RPC API.
          This involves sending formatted requests using tools or programming
          libraries, which dRPC provides to ensure seamless and reliable access to
          Avalanche's capabilities.`,
    },
    gnosis: {
      what: `RPC in Gnosis stands for Remote Procedure Call, a protocol enabling interaction with the Gnosis blockchain. It allows for querying data and executing transactions in the Gnosis ecosystem, facilitating efficient and reliable blockchain operations.`,
      why: `RPC plays a vital role in Gnosis by enabling external applications to interact with its blockchain. It simplifies the process of accessing blockchain data and executing smart contracts, thereby enhancing the utility and accessibility of the Gnosis platform.`,
      how: (
        <>
          To use Gnosis RPC, connect to a Gnosis node via RPC API. This
          connection can be established using tools like dRPC&lsquo;s endpoints,
          offering a streamlined and secure way to interact with the Gnosis
          blockchain for various applications. Learn more from dRPC&lsquo;s{" "}
          {DocsLink}.
        </>
      ),
    },
    starknet: {
      what: `RPC in Starknet facilitates interaction with its ZK-Rollup technology, enabling applications to communicate with the Starknet network. It supports various operations like querying data, processing transactions, and interacting with smart contracts.`,
      why: `Starknet employs RPC to ensure smooth access and functionality for its decentralized network. This protocol is key to managing complex computations and transactions on Starknet, enhancing its scalability and user accessibility.`,
      how: (
        <>
          To use Starknet RPC, developers connect to Starknet nodes using RPC
          API calls. These calls can be made through different tools and
          programming libraries, with dRPC providing reliable endpoints for
          efficient Starknet network communication. Learn more from dRPC&lsquo;s{" "}
          {DocsLink}.
        </>
      ),
    },
    moonbeam: {
      what: `RPC in Moonbeam facilitates interaction with the Moonbeam network, allowing applications to communicate effectively with this Ethereum-compatible blockchain on Polkadot for diverse operational needs.`,
      why: `Moonbeam RPC is crucial for developers seeking to leverage Moonbeam's Ethereum compatibility and Polkadot's scalability, offering a bridge for efficient and secure blockchain interactions.`,
      how: (
        <>
          To connect to Moonbeam RPC, utilize dRPC&lsquo;s endpoints, which
          provide a reliable and easy-to-use interface for interacting with
          Moonbeam’s network, ensuring smooth and secure operations. Learn more
          from dRPC&lsquo;s {DocsLink}.
        </>
      ),
    },
    "polygon-zkevm": {
      what: `Polygon zkEVM RPC refers to the Remote Procedure Call interface for Polygon's zkEVM, a Layer 2 solution blending ZK-Rollups with Ethereum's EVM. It facilitates efficient, secure interactions between applications and the Polygon network.`,
      why: ` Utilizing Polygon zkEVM RPC offers enhanced scalability and reduced transaction costs for Ethereum-based dApps. It is ideal for developers seeking to leverage Ethereum's ecosystem with the added efficiency of Polygon's zkEVM technology.`,
      how: (
        <>
          Connecting to Polygon zkEVM RPC is done via dRPC&lsquo;s endpoints,
          enabling developers to interact with the Polygon network through a
          robust and user-friendly interface, suitable for a wide range of
          decentralized applications. Learn more from dRPC&lsquo;s {DocsLink}.
        </>
      ),
    },
    klaytn: {
      what: `Klaytn RPC enables seamless interactions with the Klaytn blockchain, allowing external applications to access and transact on its network efficiently.`,
      why: `Klaytn RPC is the key to leveraging Klaytn's high throughput and low latency for robust blockchain applications, making it ideal for enterprise solutions.`,
      how: (
        <>
          Accessing Klaytn RPC is simple with dRPC&lsquo;s endpoints, offering a
          straightforward way for applications to engage with Klaytn’s
          blockchain technology. Learn more from dRPC&lsquo;s {DocsLink}.
        </>
      ),
    },
    aurora: {
      what: `Pioneered as an EVM on the NEAR Protocol, Aurora RPC is a protocol enabling efficient interaction with the Aurora blockchain, ensuring developers can leverage its high-throughput, scalable environment with ease.`,
      why: `Aurora's use of RPC is integral for its operation as an Ethereum-compatible platform. It enables seamless application interactions, ensuring developers can utilize Aurora's advanced features like its fast transaction finalization and scalability.`,
      how: (
        <>
          Accessing Aurora RPC involves connecting to the Aurora network using
          RPC endpoints. dRPC provides these endpoints, ensuring efficient
          communication with Aurora for operations like data requests and smart
          contract interactions. Learn more from dRPC&lsquo;s {DocsLink}.
        </>
      ),
    },
    linea: {
      what: `RPC in Linea stands for Remote Procedure Call, a protocol allowing for seamless interaction with the Linea network. It supports both existing Ethereum applications and the development of new, more efficient solutions.`,
      why: `Linea uses RPC to ensure developers can easily access its network, fostering an environment where applications can scale beyond the limitations of Ethereum Mainnet. This accessibility is crucial for the evolution and expansion of blockchain applications.`,
      how: (
        <>
          To utilize Linea RPC, developers connect through RPC endpoints to
          interact with the Linea network. dRPC offers these endpoints, enabling
          straightforward, secure, and fast communication for deploying and
          managing applications. Learn more from dRPC&lsquo;s {DocsLink}.
        </>
      ),
    },
    "arbitrum-nova": {
      what: `Arbitrum Nova RPC is a set of interfaces for interacting with the Arbitrum Nova chain, designed to facilitate ultra-low fee transactions and efficient data handling through its unique AnyTrust model. dRPC provides seamless access to these endpoints, enhancing blockchain connectivity.`,
      why: `Choosing Arbitrum Nova for RPC operations means benefiting from its groundbreaking approach to minimizing transaction fees while ensuring high data availability and security. dRPC&apos;s Arbitrum Nova RPC endpoints are tailored to support this, offering a competitive edge in blockchain development.`,
      how: (
        <>
          Connecting to Arbitrum Nova RPC involves utilizing dRPC&lsquo;s
          specialized endpoints, which enable direct communication with the Nova
          network. This connection facilitates various operations, from querying
          blockchain data to executing transactions, all with the advantage of
          Arbitrum Nova&apos;s low-cost structure. Learn more from dRPC&lsquo;s{" "}
          {DocsLink}.
        </>
      ),
    },

    harmony: {
      what: `RPC in Harmony allows developers to interact with the Harmony blockchain, enabling the execution of smart contracts, transactions, and data queries through a straightforward API interface.`,
      why: `Harmony uses RPC to ensure developers and applications can easily access its blockchain, fostering an environment where building and integration on Harmony are seamless and efficient.`,
      how: (
        <>
          To utilize Harmony RPC, connect via dRPC&lsquo;s endpoints. This
          grants reliable and fast access to Harmony&lsquo;s network,
          simplifying operations like smart contract interaction and transaction
          processing. Learn more from dRPC&lsquo;s {DocsLink}.
        </>
      ),
    },
    kava: {
      what: `RPC in Kava facilitates communication between external applications and the Kava blockchain, allowing for data queries, transaction submission, and smart contract interaction with ease.`,
      why: `Kava RPC is essential for developers looking to leverage Kava’s unique blend of Cosmos’s interoperability and Ethereum's extensive developer ecosystem, providing a streamlined interface for robust dApp development.`,
      how: (
        <>
          Accessing Kava RPC is straightforward with dRPC&lsquo;s endpoints,
          offering developers a reliable and efficient way to connect to the
          Kava network for querying data, executing transactions, and more.
          Learn more from dRPC&lsquo;s {DocsLink}.
        </>
      ),
    },
    celo: {
      what: `RPC in Celo stands for Remote Procedure Call, a protocol that allows external applications to interact with the Celo blockchain, enabling users to perform secure and efficient financial transactions directly from their mobile devices.`,
      why: `Celo utilizes RPC to enhance its mobile-first blockchain's accessibility, allowing for straightforward financial operations. This ensures that developers can build user-friendly applications on the Celo network, promoting financial inclusion on a global scale.`,
      how: (
        <>
          To use Celo RPC, developers connect to the Celo network via RPC
          endpoints provided by services like dRPC. These endpoints facilitate
          communication with the blockchain, allowing for transactions, wallet
          interactions, and access to blockchain data, all geared towards mobile
          efficiency. Learn more from dRPC&lsquo;s {DocsLink}.
        </>
      ),
    },
    opbnb: {
      what: `RPC in opBNB stands for Remote Procedure Call, a protocol enabling external applications to interact with the opBNB blockchain. It allows for efficient data querying, transaction submission, and smart contract operations, making it indispensable for developers building on opBNB.`,
      why: `opBNB uses RPC to facilitate seamless communication between external applications and its blockchain, ensuring developers can easily access blockchain data, submit transactions, and interact with smart contracts. This accessibility is crucial for the scalability and functionality of applications within the opBNB ecosystem.`,
      how: (
        <>
          To use opBNB RPC, developers need to connect to an opBNB node through
          RPC API calls. These calls can be made using various tools or
          libraries tailored to blockchain development. dRPC offers reliable and
          scalable opBNB RPC endpoints, simplifying the process for developers
          to connect and interact with the opBNB blockchain. Learn more from
          dRPC&lsquo;s {DocsLink}.
        </>
      ),
    },
    mantle: {
      what: `RPC in Mantle facilitates interaction with the Mantle Network, allowing applications to query data, execute transactions, and interact with smart contracts efficiently through a set of standardized protocols.`,
      why: `Mantle utilizes RPC to ensure developers can easily access its EVM-compatible technology stack, enabling fast, secure, and scalable solutions for Ethereum scaling and beyond.`,
      how: (
        <>
          To use Mantle RPC, connect with a Mantle node via dRPC&apos;s provided
          endpoints. This connection enables you to interact with the Mantle
          Network using simple API calls for data retrieval, transaction
          submissions, and more. Learn more from dRPC&lsquo;s {DocsLink}.
        </>
      ),
    },
    metis: {
      what: `RPC in Metis, standing for Remote Procedure Call, is a critical communication protocol that enables external applications to interact with the Metis Layer 2 network. It allows for efficient querying of blockchain data, transaction submissions, and smart contract deployments.`,
      why: `Metis RPC is vital for accessing the enhanced capabilities of the Metis Layer 2 Rollup platform, including improved transaction speeds, reduced costs, and increased scalability. It supports developers in building more efficient and effective Web3 applications on Metis.`,
      how: (
        <>
          To use Metis RPC, developers can connect to dRPC&apos;s Metis RPC
          endpoints, offering reliable and scalable access to the Metis network.
          This connection enables the seamless execution of smart contracts and
          transactions, ensuring a high-performance foundation for Web3
          projects. Learn more from dRPC&lsquo;s {DocsLink}.
        </>
      ),
    },
    filecoin: {
      what: `RPC in Filecoin refers to the Remote Procedure Call protocol used for interacting with the Filecoin network. It enables external applications to communicate with the network, facilitating operations such as querying storage data and submitting storage and retrieval deals.`,
      why: `Filecoin utilizes RPC to provide external access to its decentralized storage network. RPC allows applications to interact with the network efficiently, enabling storage providers and clients to access and manage storage deals seamlessly.`,
      how: (
        <>
          Using Filecoin RPC involves sending requests to a Filecoin node
          through an RPC API. These requests can be made using various tools and
          programming libraries. dRPC provides accessible Filecoin RPC endpoints
          for efficient and reliable communication with the Filecoin network.
          Learn more from dRPC&lsquo;s {DocsLink}.
        </>
      ),
    },
    fuse: {
      what: `RPC in Fuse refers to Remote Procedure Call, a protocol for communication between a client and a server. In the context of Fuse, RPC allows external applications to interact with the Fuse blockchain, facilitating actions such as querying data and executing transactions.`,
      why: `Fuse utilizes RPC to enable external access to its blockchain network. This allows developers to build decentralized applications (dApps) and integrate with the Fuse ecosystem efficiently, promoting innovation and adoption in decentralized finance (DeFi) and other Web3 projects.`,
      how: (
        <>
          To use Fuse RPC, developers can send RPC requests to a Fuse node using
          the appropriate API. These requests enable interaction with the Fuse
          blockchain, including querying data and executing transactions. dRPC
          offers reliable and scalable Fuse RPC endpoints, facilitating seamless
          integration with Fuse-powered applications. Learn more from
          dRPC&lsquo;s {DocsLink}.
        </>
      ),
    },
    taiko: {
      what: `RPC in Taiko refers to Remote Procedure Call, a protocol used for communication with the Taiko blockchain network. It enables external applications to request data and perform actions on the Taiko network.`,
      why: `Taiko utilizes RPC to provide external access to its blockchain network, allowing developers to interact with smart contracts, query blockchain data, and execute transactions efficiently.`,
      how: (
        <>
          To use Taiko RPC, connect to a Taiko node using RPC API calls. These
          calls can be made through various tools or programming libraries. dRPC
          offers reliable and decentralized Taiko RPC endpoints for seamless
          communication with the Taiko blockchain. Learn more from dRPC&lsquo;s{" "}
          {DocsLink}.
        </>
      ),
    },
    astar: {
      what: `RPC in Astar zkEVM refers to Remote Procedure Call, a protocol used for communication between client applications and the zkEVM network. It enables querying blockchain data and executing transactions securely and efficiently.`,
      why: `Astar zkEVM utilizes RPC to provide external access to its blockchain network. RPC facilitates interaction with smart contracts, querying blockchain data, and submitting transactions, enabling developers to build scalable and privacy-preserving applications on the zkEVM platform.`,
      how: (
        <>
          To use Astar zkEVM RPC, developers can send RPC requests to Astar
          zkEVM nodes, either directly or through a service like dRPC. These
          requests enable actions such as querying blockchain data and executing
          transactions securely and efficiently. Learn more from dRPC&lsquo;s{" "}
          {DocsLink}.
        </>
      ),
    },
    berachain: {
      what: `RPC in Berachain enables external applications to communicate with the Berachain blockchain, facilitating data retrieval and interaction with smart contracts.`,
      why: `Berachain utilizes RPC to offer external access to its blockchain network, allowing for efficient communication and interaction with decentralized applications.`,
      how: (
        <>
          To use Berachain RPC, developers can send requests to a Berachain node
          through an RPC API. dRPC provides reliable Berachain RPC endpoints,
          ensuring seamless integration with the Berachain blockchain. Learn
          more from dRPC&lsquo;s {DocsLink}.
        </>
      ),
    },
    haqq: {
      what: `RPC in HAQQ is a communication protocol used for interacting with the HAQQ blockchain. It facilitates external access to the network, allowing for data retrieval, transaction processing, and smart contract interactions.`,
      why: `HAQQ utilizes RPC to enable external applications to communicate with its blockchain network. This promotes interoperability and accessibility, facilitating various blockchain functionalities within the HAQQ ecosystem.`,
      how: (
        <>
          To use HAQQ RPC, developers connect to HAQQ nodes using RPC API calls.
          These calls can be made through programming libraries or tools,
          enabling seamless integration with HAQQ&apos;s blockchain network.
          dRPC provides efficient HAQQ RPC endpoints for reliable communication
          and data interaction. Learn more from dRPC&lsquo;s {DocsLink}.
        </>
      ),
    },
    "immutable-zkevm": {
      what: `RPC in Immutable zkEVM is a protocol used for interfacing with the zkEVM-based blockchain. It enables external applications to communicate with the network, facilitating various operations such as querying data and executing transactions efficiently.`,
      why: `Immutable zkEVM utilizes RPC to enable external access to its zkEVM-based blockchain network. This allows developers and users to interact with the network, query blockchain data, and execute transactions, promoting decentralization and accessibility.`,
      how: (
        <>
          To use Immutable zkEVM RPC, you can connect to an Immutable zkEVM node
          using an RPC API. These requests can be made using various tools and
          programming libraries. dRPC offers reliable and scalable Immutable
          zkEVM RPC endpoints, ensuring seamless integration with Web3 projects.
          Learn more from dRPC&lsquo;s {DocsLink}.
        </>
      ),
    },
    manta: {
      what: `RPC in Manta Network is a protocol used to interact with the Manta Network blockchain. It allows external applications to communicate with the network, facilitating various operations such as querying data and interacting with smart contracts.`,
      why: `Manta Network utilizes RPC to enable external access to its privacy-focused blockchain network. RPC facilitates efficient communication with the Manta Network, allowing developers and users to interact with decentralized applications and conduct transactions securely.`,
      how: (
        <>
          Using Manta Network RPC involves sending requests to a Manta Network
          node through an RPC API. These requests can be made using various
          tools and programming libraries. dRPC offers accessible Manta Network
          RPC endpoints, ensuring efficient and reliable communication with the
          Manta Network blockchain. Learn more from dRPC&lsquo;s {DocsLink}.
        </>
      ),
    },
    okt: {
      what: `RPC in OKT Chain, or Remote Procedure Call, is a protocol used for communication between applications and the OKT Chain blockchain. It enables external access to the blockchain, allowing for tasks such as querying data and executing transactions.`,
      why: `OKT Chain utilizes RPC to provide external access to its blockchain, enabling interaction with decentralized applications and smart contracts. RPC facilitates the seamless transfer of data and commands between applications and the OKT Chain network.`,
      how: (
        <>
          To use OKT Chain RPC, developers connect to an OKT Chain node through
          an RPC API. This allows for tasks such as querying blockchain data and
          executing transactions. dRPC offers efficient OKT Chain RPC endpoints
          for smooth communication with the OKT Chain network. Learn more from
          dRPC&lsquo;s {DocsLink}.
        </>
      ),
    },
    vara: {
      what: `RPC in Vara Network is a protocol used for interfacing with the Vara Network blockchain. It allows external applications to communicate with the network, making it possible to query data, submit transactions, and interact with smart contracts efficiently.`,
      why: `Vara Network employs RPC to provide external access to its blockchain network. It facilitates a range of operations including querying blockchain information, executing transactions, and smart contract interactions, essential for developers and users in the Vara Network ecosystem.`,
      how: (
        <>
          Using Vara Network RPC involves sending requests to a Vara Network
          node through an RPC API. These requests can be made using various
          tools and programming libraries. dRPC provides accessible Vara Network
          RPC endpoints for efficient and reliable communication with the Vara
          Network blockchain. Learn more from dRPC&lsquo;s {DocsLink}.
        </>
      ),
    },
    scroll: {
      what: `RPC in Scroll refers to the Remote Procedure Call protocol used for communication with the Scroll blockchain. It enables external applications to interact with the Scroll network, facilitating data retrieval and transaction processing.`,
      why: `Scroll utilizes RPC to provide external access to its blockchain network, allowing applications to communicate with the Scroll network efficiently. This promotes seamless integration and interaction with Scroll-based decentralized applications.`,
      how: (
        <>
          To use Scroll RPC, developers can send JSON-RPC formatted requests to
          a Scroll node using tools or programming libraries. dRPC offers
          convenient and reliable Scroll RPC endpoints for streamlined
          communication with the Scroll blockchain. Learn more from dRPC&lsquo;s{" "}
          {DocsLink}.
        </>
      ),
    },
    lisk: {
      what: `RPC in Lisk is a protocol used for interfacing with the Lisk blockchain. It enables external applications to communicate with the network, facilitating operations such as querying data, submitting transactions, and interacting with smart contracts.`,
      why: `Lisk utilizes RPC to provide external access to its blockchain network. This enables developers and users to interact with the Lisk blockchain, execute transactions, and deploy smart contracts, fostering innovation and decentralized applications within the Lisk ecosystem.`,
      how: (
        <>
          To use Lisk RPC, developers can send requests to a Lisk node using RPC
          API calls. These requests can be made using various programming
          languages and tools. dRPC offers scalable Lisk RPC endpoints, ensuring
          reliable and efficient communication with the Lisk blockchain network.
          Learn more from dRPC&lsquo;s {DocsLink}.
        </>
      ),
    },
    blast: {
      what: `RPC in Blast refers to the Remote Procedure Call protocol used for interacting with the Blast blockchain. It enables external applications to communicate with the Blast network, facilitating data queries and transaction processing.`,
      why: `Blast utilizes RPC to provide external access to its blockchain network. This enables developers and users to interact with Blast, facilitating operations such as querying data, executing transactions, and accessing smart contracts.`,
      how: (
        <>
          To use Blast RPC, developers can send RPC requests to a Blast node
          using JSON-RPC formatted calls. These requests can be made using
          various tools and libraries, allowing seamless integration with the
          Blast blockchain. dRPC offers efficient and reliable Blast RPC
          endpoints for developers looking to interact with Blast&apos;s
          blockchain. Learn more from dRPC&lsquo;s {DocsLink}.
        </>
      ),
    },
    evmos: {
      what: `RPC in Evmos, known as Remote Procedure Call, enables communication with the Evmos blockchain. It allows external applications to interact with the network, facilitating tasks such as querying data and executing transactions.`,
      why: `Evmos utilizes RPC to provide external access to its blockchain network. This enables developers and users to communicate with the network efficiently, supporting functions like accessing blockchain data and executing transactions.`,
      how: (
        <>
          To use Evmos RPC, developers can send RPC requests to an Evmos node
          using dRPC APIs. These requests can be made using various programming
          languages or tools. dRPC offers Evmos RPC endpoints for seamless
          integration and interaction with the Evmos blockchain. Learn more from
          dRPC&lsquo;s {DocsLink}.
        </>
      ),
    },
    heco: {
      what: `RPC in Heco, short for Remote Procedure Call, facilitates communication with the Heco blockchain. It enables external applications to interact with the network, making it possible to retrieve data and execute transactions.`,
      why: `Heco utilizes RPC to offer external access to its blockchain network. This allows applications to interact with smart contracts, retrieve blockchain data, and perform various operations without running a full node, promoting decentralization and accessibility.`,
      how: (
        <>
          To use Heco RPC, developers can connect to a Heco node through RPC API
          calls. dRPC provides dedicated Heco RPC endpoints for seamless
          integration, enabling efficient communication with the Heco
          blockchain. Learn more from dRPC&lsquo;s {DocsLink}.
        </>
      ),
    },
    mode: {
      what: `RPC in Mode is a protocol used for interacting with the Mode blockchain. It facilitates communication between external applications and the Mode network, allowing for data retrieval, transaction processing, and smart contract interactions.`,
      why: `Mode utilizes RPC to provide external access to its blockchain network, enabling developers to build and scale applications on the Mode platform. It supports various operations such as querying data, executing transactions, and interacting with smart contracts, crucial for developers and users in the Mode ecosystem.`,
      how: (
        <>
          Using Mode RPC involves sending requests to a Mode node through an RPC
          API. These requests can be made using various tools and programming
          libraries. dRPC offers reliable and efficient Mode RPC APIs, ensuring
          seamless communication with the Mode blockchain for developers and
          users. Learn more from dRPC&lsquo;s {DocsLink}.
        </>
      ),
    },
    moonriver: {
      what: `RPC in Moonriver allows external applications to communicate with the Moonriver blockchain, facilitating data retrieval, transaction processing, and smart contract interactions.`,
      why: `Moonriver utilizes RPC to provide external access to its blockchain network, enabling developers and users to interact with the Moonriver ecosystem efficiently.`,
      how: (
        <>
          To use Moonriver RPC, developers can send requests to a Moonriver node
          through an RPC API. dRPC offers reliable and efficient Moonriver RPC
          APIs, simplifying blockchain integration and data interaction for
          developers. Learn more from dRPC&lsquo;s {DocsLink}.
        </>
      ),
    },
    "neon-evm": {
      what: `RPC in Neon EVM enables seamless communication between applications and the Neon EVM blockchain. It facilitates data retrieval, transaction processing, and smart contract interactions, enhancing the scalability and accessibility of Ethereum dApps on Solana.`,
      why: `Neon EVM utilizes RPC to offer efficient access to its blockchain network. This allows developers to interact with Ethereum dApps on Solana, tapping into the benefits of Solana's high-performance ecosystem while leveraging familiar Ethereum tools and infrastructure.`,
      how: (
        <>
          Using Neon EVM RPC involves connecting to a Neon EVM node through an
          RPC API. This allows for seamless integration of Ethereum dApps on
          Solana, enabling developers to harness the power of Solana&apos;s
          vibrant ecosystem with ease. dRPC provides reliable Neon EVM RPC
          endpoints for efficient and scalable blockchain connectivity. Learn
          more from dRPC&lsquo;s {DocsLink}.
        </>
      ),
    },
    ronin: {
      what: `RPC in Ronin is a protocol used for interacting with the Ronin blockchain. It facilitates communication between external applications and the blockchain, enabling actions such as querying data and executing transactions efficiently.`,
      why: `RPC in Ronin is a protocol used for interacting with the Ronin blockchain. It facilitates communication between external applications and the blockchain, enabling actions such as querying data and executing transactions efficiently.`,
      how: (
        <>
          To use Ronin RPC, developers can connect to the Ronin blockchain
          through RPC API calls. These calls enable access to blockchain data
          and execution of transactions. With dRPC&apos;s reliable Ronin RPC
          endpoints, integrating Ronin into your Web3 projects is fast, secure,
          and scalable. Learn more from dRPC&lsquo;s {DocsLink}.
        </>
      ),
    },
    telos: {
      what: `RPC in Telos refers to the Remote Procedure Call protocol used for interacting with the Telos blockchain. It enables external applications to communicate with the network, facilitating data retrieval, transaction processing, and smart contract interactions.`,
      why: `Telos utilizes RPC to provide external access to its high-speed and scalable blockchain network. It enables developers and users to interact with the Telos blockchain efficiently, supporting a wide range of operations essential for decentralized applications and blockchain projects.`,
      how: (
        <>
          To use Telos RPC, developers can connect to a Telos node using RPC API
          calls. These calls can be made through various tools and programming
          libraries. dRPC offers reliable and efficient Telos RPC endpoints,
          ensuring seamless communication with the Telos blockchain for your
          Web3 projects. Learn more from dRPC&lsquo;s {DocsLink}.
        </>
      ),
    },
    thundercore: {
      what: `RPC in Thundercore facilitates seamless communication with the Thundercore blockchain. It enables external applications to interact with Thundercore's network, allowing for data queries, transaction submissions, and smart contract interactions.`,
      why: `Thundercore utilizes RPC to provide external access to its blockchain infrastructure. By offering RPC endpoints, Thundercore enables developers to integrate their applications with the Thundercore network efficiently, enhancing interoperability and functionality.`,
      how: (
        <>
          To use Thundercore RPC, developers can send requests to a Thundercore
          node through an RPC API. These requests can be made using various
          tools and libraries, ensuring seamless communication with the
          Thundercore blockchain. dRPC offers Thundercore RPC endpoints,
          facilitating smooth integration and data interaction for developers.
          Learn more from dRPC&lsquo;s {DocsLink}.
        </>
      ),
    },
    "zeta-chain": {
      what: `RPC in ZetaChain facilitates communication with the ZetaChain blockchain, allowing external applications to interact with the network, query data, and execute transactions efficiently.`,
      why: `ZetaChain utilizes RPC to provide external access to its foundational blockchain network, enabling seamless communication with other blockchains and supporting a fluid, multi-chain crypto ecosystem.`,
      how: (
        <>
          To use ZetaChain RPC, developers connect to a ZetaChain node through
          RPC API calls. These calls enable actions such as querying blockchain
          data and executing transactions, fostering integration and data
          interoperability within the ZetaChain ecosystem. Learn more from
          dRPC&lsquo;s {DocsLink}.
        </>
      ),
    },
    zora: {
      what: `RPC in Zora refers to the Remote Procedure Call protocol used for interacting with the Zora Network blockchain. It allows external applications to communicate with the Zora Network, enabling data requests and transaction processing.`,
      why: `Zora utilizes RPC to offer efficient, external connectivity to its Layer-2 network. This enables streamlined interactions with NFTs and facilitates operations like querying data and processing transactions, enhancing the scalability and accessibility of the Zora Network.    `,
      how: (
        <>
          To use Zora RPC, connect to a Zora Network node using RPC API calls.
          These calls can be made through various tools or programming
          libraries. dRPC provides easy-to-use Zora RPC endpoints for this
          purpose, ensuring smooth communication with the Zora Network. Learn
          more from dRPC&lsquo;s {DocsLink}.
        </>
      ),
    },
    bittorrent: {
      what: `RPC in Bittorrent enables seamless interaction with the Bittorrent-Chain, allowing external applications to access blockchain data and execute transactions efficiently.`,
      why: `Bittorrent utilizes RPC to provide external connectivity to its blockchain network, facilitating operations such as querying data and interacting with smart contracts, essential for decentralized application development.`,
      how: (
        <>
          To leverage Bittorrent RPC, developers can send requests to a
          Bittorrent node via RPC API calls. dRPC offers user-friendly
          Bittorrent RPC endpoints, ensuring smooth communication with the
          Bittorrent-Chain for seamless blockchain integration. Learn more from
          dRPC&lsquo;s {DocsLink}.
        </>
      ),
    },
    "boba-ethereum": BOBA,
    "boba-bnb": BOBA,
    core: {
      what: `RPC in Core allows external applications to interact with the Core blockchain, facilitating tasks such as data retrieval, transaction submission, and smart contract interactions efficiently.`,
      why: `Core utilizes RPC to provide developers and users with external access to its blockchain network, enabling seamless integration and interaction with Core's decentralized ecosystem.`,
      how: (
        <>
          To utilize Core Network RPC, developers can send requests to a Core
          node through an RPC API. These requests can be made using various
          tools and programming libraries. dRPC offers reliable and efficient
          Core Network RPC endpoints, ensuring smooth communication with the
          Core blockchain. Learn more from dRPC&lsquo;s {DocsLink}.
        </>
      ),
    },
  } as Record<string, { what: string; why: string; how?: React.ReactNode }>;

  const HowToFAQ = ({ networkName }: { networkName: string }) => (
    <>
      To use {networkName} RPC, you need to send JSON-RPC formatted requests to
      an {networkName} node, either your own or via a service dRPC. These
      requests can be made using tools like cURL or programming libraries in
      various languages. The node then processes these requests and returns the
      desired information or confirmation of actions performed. Learn more from
      dRPC&lsquo;s {DocsLink}.
    </>
  );

  return { FAQ_BY_NETWORK, HowToFAQ };
};
