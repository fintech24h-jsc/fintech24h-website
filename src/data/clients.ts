export interface Client {
  name: string;
  logo?: string;
  industry: string;
}

export const clients: Client[] = [
  { name: 'Avalanche', logo: '', industry: 'L1 Blockchain' },
  { name: 'Aptos', logo: '', industry: 'L1 Blockchain' },
  { name: 'Polkadot', logo: '', industry: 'L1 Blockchain' },
  { name: 'Decentraland', logo: '', industry: 'GameFi / Metaverse' },
  { name: 'Synthetix', logo: '', industry: 'DeFi Protocol' },
  { name: 'Kyber Network', logo: '', industry: 'DeFi Protocol' },
  { name: 'PancakeSwap', logo: '', industry: 'Exchange / DEX' },
  { name: 'Chainlink', logo: '', industry: 'Oracle Network' },
  { name: 'Coin98', logo: '', industry: 'Web3 Wallet' },
  { name: 'SingularityNET', logo: '', industry: 'AI Network' }
];
