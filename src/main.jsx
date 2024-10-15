import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import "@radix-ui/themes/styles.css";
import { Theme } from "@radix-ui/themes";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import { Sepolia } from "@thirdweb-dev/chains";
import { lightTheme } from '@thirdweb-dev/react';
const customTheme = lightTheme({
  colors: {
    modalBg: 'white',
  },
});



import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import { providers } from "ethers";
import Dashbaord from "./components/Dashbaord.jsx";
import AuthorizeProvider from "./components/AuthorizeProvider.jsx";
import ViewRecords from "./components/ViewRecords.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/dashboard",
    element:  <Dashbaord />
  }, {
    path: '/dashboard/authorize',
    element: <AuthorizeProvider />
  },{ 
      path: "/dashboard/viewrecords",
      element: <ViewRecords />
  }
]);


const CLIENT_ID = process.env.CLIENT_ID;

const local_network = {
  chainId: 1337,
  rpc: ["http://127.0.0.1:7545"],
  nativeCurrency: {
    decimals: 18,
    name: "LOCAL ETH TESTNET",
    symbol: "ETH",
  },
  shortName: "leth", // Display value shown in the wallet UI
  slug: "localeth", // Display value shown in the wallet UI
  testnet: true, // Boolean indicating whether the chain is a testnet or mainnet
  chain: "LOCAL ETH", // Name of the network
  name: "Localhost Testnet", // Name of the network
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThirdwebProvider
      activeChain={Sepolia}
      clientId= "39b67f86ea8b9955ef27bddc46f6b84e"
      theme={customTheme}
    >
      <Theme appearance="light">
        <RouterProvider router={router} />
      </Theme>
    </ThirdwebProvider>
  </StrictMode>
);
