import {
  CONTRACT_ADDRESSES,
  ConnectWallet,
  ThirdwebProvider,
  embeddedWallet,
  en,
  metamaskWallet,
  useContract,
  useContractRead,
} from "@thirdweb-dev/react";
import "./styles/Home.css";
import FeatureTabs from "./components/FeatureTabs";
import { Box, Button, Typography } from "@mui/material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LightlinkPegasusTestnet } from "@thirdweb-dev/chains";

export default function Home() {
  return (
    <ThirdwebProvider
      activeChain={LightlinkPegasusTestnet}
      clientId={import.meta.env.VITE_TEMPLATE_CLIENT_ID}
      locale={en()}
      supportedWallets={[
        metamaskWallet(),
        embeddedWallet({
          auth: {
            options: ["google"],
          },
        }),
      ]}
    >
      <main className="main">
        <Box padding="10px">
          <Box display="flex" alignItems="center">
            <Box flex="1" textAlign="center">
              <Typography variant="h1">
                <span className="gradient-text-0">DEventify.</span>
              </Typography>
              <Typography variant="h5">
                Your on chain event ticketting platform.
              </Typography>
            </Box>
            <Box sx={{ align: "left" }}>
              <ConnectWallet
                theme={"dark"}
                switchToActiveChain={true}
                modalSize={"compact"}
              />
            </Box>
          </Box>

          <FeatureTabs />
        </Box>
      </main>
    </ThirdwebProvider>
  );
}
