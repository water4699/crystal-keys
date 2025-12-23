import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { hardhat, sepolia } from "wagmi/chains";

export const config = getDefaultConfig({
  appName: "Crystal Keys - Encrypted Rights Distributor",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "YOUR_PROJECT_ID",
  chains: [hardhat, sepolia],
  ssr: false, // Disable SSR to prevent indexedDB errors
});
