import { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { WagmiConfig, createConfig, configureChains } from "wagmi";
import { bsc } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";

import FallbackLoading from "@/components/FallbackLoading";
import store from "@/store.js";
import App from "./App.jsx";
import "react-toastify/dist/ReactToastify.css";
import "./i18n";
import "./index.css";

const { publicClient, webSocketPublicClient } = configureChains(
  [bsc],
  [publicProvider()]
);

const config = createConfig({
  autoConnect: true,
  publicClient,
  webSocketPublicClient,
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <Suspense fallback={<FallbackLoading />}>
      <WagmiConfig config={config}>
        <App />
      </WagmiConfig>
    </Suspense>
  </Provider>
);
