import "../styles/styles.css";
import { WagmiConfig, createClient } from "wagmi";
import { ConnectKitProvider, getDefaultClient } from "connectkit";

const client = createClient(
  getDefaultClient({
    appName: "PetOrbz",
    infuraId: process.env.NEXT_PUBLIC_INFURA_ID,
  })
);

const App = ({ Component, pageProps }) => (
  <WagmiConfig client={client}>
    <ConnectKitProvider theme="auto" mode="dark">
      <Component {...pageProps} />
    </ConnectKitProvider>
  </WagmiConfig>
);

export default App;
