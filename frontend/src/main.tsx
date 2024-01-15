import { ConnectKitProvider, getDefaultConfig } from "connectkit"
import React from 'react'
import ReactDOM from 'react-dom/client'
import { arbitrum, mainnet, optimism, polygon, polygonMumbai, sepolia } from "viem/chains"
import { WagmiConfig, createConfig } from "wagmi"
import App from './App.tsx'
import './index.css'

const chains = [polygonMumbai, sepolia, mainnet, polygon, optimism, arbitrum];

const config = createConfig(
    getDefaultConfig({
        // Required API Keys
        alchemyId: import.meta.env.VITE_ALCHEMY_ID, // or infuraId
        walletConnectProjectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID,
        chains: chains,

        // Required
        appName: "LFGHO",

        // Optional
        appDescription: "Borrow GHO with your NFTs",
        appUrl: "https://family.co", // your app's url
        appIcon: "https://family.co/logo.png", // your app's icon, no bigger than 1024x1024px (max. 1MB)
    }),
);

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <WagmiConfig config={config}>
            <ConnectKitProvider theme="midnight" >
                <App />
            </ConnectKitProvider>
        </WagmiConfig>
    </React.StrictMode>,
)
