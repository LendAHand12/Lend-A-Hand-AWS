import{c as L,s as G,p as X}from"./zustand-96774db3.js";import{m as Z,g as J,a as S,U as b,R as A,c as Y,n as Q,S as V,b as tt,d as I,f as R,h as et,w as it}from"./viem-a9891897.js";import{E as nt}from"./eventemitter3-951c0ce8.js";var yt={id:56,name:"BNB Smart Chain",network:"bsc",nativeCurrency:{decimals:18,name:"BNB",symbol:"BNB"},rpcUrls:{default:{http:["https://rpc.ankr.com/bsc"]},public:{http:["https://rpc.ankr.com/bsc"]}},blockExplorers:{etherscan:{name:"BscScan",url:"https://bscscan.com"},default:{name:"BscScan",url:"https://bscscan.com"}},contracts:{multicall3:{address:"0xca11bde05977b3631167028862be2a173976ca11",blockCreated:15921452}}},kt={id:5,network:"goerli",name:"Goerli",nativeCurrency:{name:"Goerli Ether",symbol:"ETH",decimals:18},rpcUrls:{alchemy:{http:["https://eth-goerli.g.alchemy.com/v2"],webSocket:["wss://eth-goerli.g.alchemy.com/v2"]},infura:{http:["https://goerli.infura.io/v3"],webSocket:["wss://goerli.infura.io/ws/v3"]},default:{http:["https://rpc.ankr.com/eth_goerli"]},public:{http:["https://rpc.ankr.com/eth_goerli"]}},blockExplorers:{etherscan:{name:"Etherscan",url:"https://goerli.etherscan.io"},default:{name:"Etherscan",url:"https://goerli.etherscan.io"}},contracts:{ensRegistry:{address:"0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e"},ensUniversalResolver:{address:"0x56522D00C410a43BFfDF00a9A569489297385790",blockCreated:8765204},multicall3:{address:"0xca11bde05977b3631167028862be2a173976ca11",blockCreated:6507670}},testnet:!0},St={id:1,network:"homestead",name:"Ethereum",nativeCurrency:{name:"Ether",symbol:"ETH",decimals:18},rpcUrls:{alchemy:{http:["https://eth-mainnet.g.alchemy.com/v2"],webSocket:["wss://eth-mainnet.g.alchemy.com/v2"]},infura:{http:["https://mainnet.infura.io/v3"],webSocket:["wss://mainnet.infura.io/ws/v3"]},default:{http:["https://cloudflare-eth.com"]},public:{http:["https://cloudflare-eth.com"]}},blockExplorers:{etherscan:{name:"Etherscan",url:"https://etherscan.io"},default:{name:"Etherscan",url:"https://etherscan.io"}},contracts:{ensRegistry:{address:"0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e"},ensUniversalResolver:{address:"0xc0497E381f536Be9ce14B0dD3817cBcAe57d2F62",blockCreated:16966585},multicall3:{address:"0xca11bde05977b3631167028862be2a173976ca11",blockCreated:14353601}}},st=Object.defineProperty,rt=(t,e,i)=>e in t?st(t,e,{enumerable:!0,configurable:!0,writable:!0,value:i}):t[e]=i,g=(t,e,i)=>(rt(t,typeof e!="symbol"?e+"":e,i),i),j=(t,e,i)=>{if(!e.has(t))throw TypeError("Cannot "+i)},q=(t,e,i)=>(j(t,e,"read from private field"),i?i.call(t):e.get(t)),K=(t,e,i)=>{if(e.has(t))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(t):e.set(t,i)},F=(t,e,i,n)=>(j(t,e,"write to private field"),n?n.call(t,i):e.set(t,i),i),ot=class extends nt{constructor({chains:t=[Z,J],options:e}){super(),g(this,"chains"),g(this,"options"),g(this,"storage"),this.chains=t,this.options=e}getBlockExplorerUrls(t){const{default:e,...i}=t.blockExplorers??{};if(e)return[e.url,...Object.values(i).map(n=>n.url)]}isChainUnsupported(t){return!this.chains.some(e=>e.id===t)}setStorage(t){this.storage=t}},ct=class extends Error{constructor({chainId:t,connectorId:e}){super(`Chain "${t}" not configured for connector "${e}".`),g(this,"name","ChainNotConfiguredForConnectorError")}},m=class extends Error{constructor(){super(...arguments),g(this,"name","ConnectorNotFoundError"),g(this,"message","Connector not found")}};function x(t){return typeof t=="string"?Number.parseInt(t,t.trim().substring(0,2)==="0x"?16:10):typeof t=="bigint"?Number(t):t}function at(t){var i;if(!t)return"Injected";const e=n=>{if(n.isApexWallet)return"Apex Wallet";if(n.isAvalanche)return"Core Wallet";if(n.isBackpack)return"Backpack";if(n.isBifrost)return"Bifrost Wallet";if(n.isBitKeep)return"BitKeep";if(n.isBitski)return"Bitski";if(n.isBlockWallet)return"BlockWallet";if(n.isBraveWallet)return"Brave Wallet";if(n.isCoinbaseWallet)return"Coinbase Wallet";if(n.isDawn)return"Dawn Wallet";if(n.isDefiant)return"Defiant";if(n.isEnkrypt)return"Enkrypt";if(n.isExodus)return"Exodus";if(n.isFrame)return"Frame";if(n.isFrontier)return"Frontier Wallet";if(n.isGamestop)return"GameStop Wallet";if(n.isHyperPay)return"HyperPay Wallet";if(n.isImToken)return"ImToken";if(n.isHaloWallet)return"Halo Wallet";if(n.isKuCoinWallet)return"KuCoin Wallet";if(n.isMathWallet)return"MathWallet";if(n.isNovaWallet)return"Nova Wallet";if(n.isOkxWallet||n.isOKExWallet)return"OKX Wallet";if(n.isOneInchIOSWallet||n.isOneInchAndroidWallet)return"1inch Wallet";if(n.isOpera)return"Opera";if(n.isPhantom)return"Phantom";if(n.isPortal)return"Ripio Portal";if(n.isRabby)return"Rabby Wallet";if(n.isRainbow)return"Rainbow";if(n.isStatus)return"Status";if(n.isTalisman)return"Talisman";if(n.isTally)return"Taho";if(n.isTokenPocket)return"TokenPocket";if(n.isTokenary)return"Tokenary";if(n.isTrust||n.isTrustWallet)return"Trust Wallet";if(n.isXDEFI)return"XDEFI Wallet";if(n.isZerion)return"Zerion";if(n.isMetaMask)return"MetaMask"};if((i=t.providers)!=null&&i.length){const n=new Set;let r=1;for(const a of t.providers){let o=e(a);o||(o=`Unknown Wallet #${r}`,r+=1),n.add(o)}const s=[...n];return s.length?s:s[0]??"Injected"}return e(t)??"Injected"}var E,z=class extends ot{constructor({chains:t,options:e}={}){const i={shimDisconnect:!0,getProvider(){if(typeof window>"u")return;const r=window.ethereum;return r!=null&&r.providers?r.providers[0]:r},...e};super({chains:t,options:i}),g(this,"id","injected"),g(this,"name"),g(this,"ready"),K(this,E,void 0),g(this,"shimDisconnectKey",`${this.id}.shimDisconnect`),g(this,"onAccountsChanged",r=>{r.length===0?this.emit("disconnect"):this.emit("change",{account:S(r[0])})}),g(this,"onChainChanged",r=>{const s=x(r),a=this.isChainUnsupported(s);this.emit("change",{chain:{id:s,unsupported:a}})}),g(this,"onDisconnect",async r=>{var s;r.code===1013&&await this.getProvider()&&await this.getAccount()||(this.emit("disconnect"),this.options.shimDisconnect&&((s=this.storage)==null||s.removeItem(this.shimDisconnectKey)))});const n=i.getProvider();if(typeof i.name=="string")this.name=i.name;else if(n){const r=at(n);i.name?this.name=i.name(r):typeof r=="string"?this.name=r:this.name=r[0]}else this.name="Injected";this.ready=!!n}async connect({chainId:t}={}){var e;try{const i=await this.getProvider();if(!i)throw new m;i.on&&(i.on("accountsChanged",this.onAccountsChanged),i.on("chainChanged",this.onChainChanged),i.on("disconnect",this.onDisconnect)),this.emit("message",{type:"connecting"});const n=await i.request({method:"eth_requestAccounts"}),r=S(n[0]);let s=await this.getChainId(),a=this.isChainUnsupported(s);return t&&s!==t&&(s=(await this.switchChain(t)).id,a=this.isChainUnsupported(s)),this.options.shimDisconnect&&((e=this.storage)==null||e.setItem(this.shimDisconnectKey,!0)),{account:r,chain:{id:s,unsupported:a}}}catch(i){throw this.isUserRejectedRequestError(i)?new b(i):i.code===-32002?new A(i):i}}async disconnect(){var e;const t=await this.getProvider();t!=null&&t.removeListener&&(t.removeListener("accountsChanged",this.onAccountsChanged),t.removeListener("chainChanged",this.onChainChanged),t.removeListener("disconnect",this.onDisconnect),this.options.shimDisconnect&&((e=this.storage)==null||e.removeItem(this.shimDisconnectKey)))}async getAccount(){const t=await this.getProvider();if(!t)throw new m;const e=await t.request({method:"eth_accounts"});return S(e[0])}async getChainId(){const t=await this.getProvider();if(!t)throw new m;return t.request({method:"eth_chainId"}).then(x)}async getProvider(){const t=this.options.getProvider();return t&&F(this,E,t),q(this,E)}async getWalletClient({chainId:t}={}){const[e,i]=await Promise.all([this.getProvider(),this.getAccount()]),n=this.chains.find(r=>r.id===t);if(!e)throw new Error("provider is required.");return Y({account:i,chain:n,transport:tt(e)})}async isAuthorized(){var t;try{if(this.options.shimDisconnect&&!((t=this.storage)!=null&&t.getItem(this.shimDisconnectKey)))return!1;if(!await this.getProvider())throw new m;return!!await this.getAccount()}catch{return!1}}async switchChain(t){var n,r,s;const e=await this.getProvider();if(!e)throw new m;const i=Q(t);try{return await Promise.all([e.request({method:"wallet_switchEthereumChain",params:[{chainId:i}]}),new Promise(a=>this.on("change",({chain:o})=>{(o==null?void 0:o.id)===t&&a()}))]),this.chains.find(a=>a.id===t)??{id:t,name:`Chain ${i}`,network:`${i}`,nativeCurrency:{name:"Ether",decimals:18,symbol:"ETH"},rpcUrls:{default:{http:[""]},public:{http:[""]}}}}catch(a){const o=this.chains.find(c=>c.id===t);if(!o)throw new ct({chainId:t,connectorId:this.id});if(a.code===4902||((r=(n=a==null?void 0:a.data)==null?void 0:n.originalError)==null?void 0:r.code)===4902)try{if(await e.request({method:"wallet_addEthereumChain",params:[{chainId:i,chainName:o.name,nativeCurrency:o.nativeCurrency,rpcUrls:[((s=o.rpcUrls.public)==null?void 0:s.http[0])??""],blockExplorerUrls:this.getBlockExplorerUrls(o)}]}),await this.getChainId()!==t)throw new b(new Error("User rejected switch after adding network."));return o}catch(c){throw new b(c)}throw this.isUserRejectedRequestError(a)?new b(a):new V(a)}}async watchAsset({address:t,decimals:e=18,image:i,symbol:n}){const r=await this.getProvider();if(!r)throw new m;return r.request({method:"wallet_watchAsset",params:{type:"ERC20",options:{address:t,decimals:e,image:i,symbol:n}}})}isUserRejectedRequestError(t){return t.code===4001}};E=new WeakMap;var D=(t,e,i)=>{if(!e.has(t))throw TypeError("Cannot "+i)},P=(t,e,i)=>(D(t,e,"read from private field"),i?i.call(t):e.get(t)),W=(t,e,i)=>{if(e.has(t))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(t):e.set(t,i)},k=(t,e,i,n)=>(D(t,e,"write to private field"),n?n.call(t,i):e.set(t,i),i),lt=(t,e,i)=>(D(t,e,"access private method"),i);function Et(t,e,{batch:i={multicall:{wait:32}},pollingInterval:n=4e3,rank:r,retryCount:s,retryDelay:a,stallTimeout:o}={}){if(!t.length)throw new Error("must have at least one chain");let c=[];const f={},u={};for(const l of t){let h=!1;for(const d of e){const p=d(l);p&&(h=!0,c.some(({id:w})=>w===l.id)||(c=[...c,p.chain]),f[l.id]=[...f[l.id]||[],...p.rpcUrls.http],p.rpcUrls.webSocket&&(u[l.id]=[...u[l.id]||[],...p.rpcUrls.webSocket]))}if(!h)throw new Error([`Could not find valid provider configuration for chain "${l.name}".
`,"You may need to add `jsonRpcProvider` to `configureChains` with the chain's RPC URLs.","Read more: https://wagmi.sh/core/providers/jsonRpc"].join(`
`))}return{chains:c,publicClient:({chainId:l})=>{const h=c.find(w=>w.id===l)??t[0],d=f[h.id];if(!d||!d[0])throw new Error(`No providers configured for chain "${h.id}"`);const p=I({batch:i,chain:h,transport:R(d.map(w=>et(w,{timeout:o})),{rank:r,retryCount:s,retryDelay:a}),pollingInterval:n});return Object.assign(p,{chains:c})},webSocketPublicClient:({chainId:l})=>{const h=c.find(w=>w.id===l)??t[0],d=u[h.id];if(!d||!d[0])return;const p=I({batch:i,chain:h,transport:R(d.map(w=>it(w,{timeout:o})),{rank:r,retryCount:s,retryDelay:a}),pollingInterval:n});return Object.assign(p,{chains:c})}}}var ht=class extends Error{constructor(){super(...arguments),this.name="ConnectorAlreadyConnectedError",this.message="Connector already connected"}};function M(t,e){if(t===e)return!0;if(t&&e&&typeof t=="object"&&typeof e=="object"){if(t.constructor!==e.constructor)return!1;let i,n;if(Array.isArray(t)&&Array.isArray(e)){if(i=t.length,i!=e.length)return!1;for(n=i;n--!==0;)if(!M(t[n],e[n]))return!1;return!0}if(t.valueOf!==Object.prototype.valueOf)return t.valueOf()===e.valueOf();if(t.toString!==Object.prototype.toString)return t.toString()===e.toString();const r=Object.keys(t);if(i=r.length,i!==Object.keys(e).length)return!1;for(n=i;n--!==0;)if(!Object.prototype.hasOwnProperty.call(e,r[n]))return!1;for(n=i;n--!==0;){const s=r[n];if(s&&!M(t[s],e[s]))return!1}return!0}return t!==t&&e!==e}var _=(t,{find:e,replace:i})=>t&&e(t)?i(t):typeof t!="object"?t:Array.isArray(t)?t.map(n=>_(n,{find:e,replace:i})):t instanceof Object?Object.entries(t).reduce((n,[r,s])=>({...n,[r]:_(s,{find:e,replace:i})}),{}):t;function ut(t){const e=JSON.parse(t);return _(e,{find:n=>typeof n=="string"&&n.startsWith("#bigint."),replace:n=>BigInt(n.replace("#bigint.",""))})}function T(t,e){return t.slice(0,e).join(".")||"."}function $(t,e){const{length:i}=t;for(let n=0;n<i;++n)if(t[n]===e)return n+1;return 0}function ft(t,e){const i=typeof t=="function",n=typeof e=="function",r=[],s=[];return function(o,c){if(typeof c=="object")if(r.length){const f=$(r,this);f===0?r[r.length]=this:(r.splice(f),s.splice(f)),s[s.length]=o;const u=$(r,c);if(u!==0)return n?e.call(this,o,c,T(s,u)):`[ref=${T(s,u)}]`}else r[0]=c,s[0]=o;return i?t.call(this,o,c):c}}function dt(t,e,i,n){return JSON.stringify(t,ft((r,s)=>{const a=typeof s=="bigint"?`#bigint.${s.toString()}`:s;return(e==null?void 0:e(r,a))||a},n),i??void 0)}var gt={getItem:t=>"",setItem:(t,e)=>null,removeItem:t=>null};function pt({deserialize:t=ut,key:e="wagmi",serialize:i=dt,storage:n}){return{...n,getItem:(r,s=null)=>{const a=n.getItem(`${e}.${r}`);try{return a?t(a):s}catch(o){return console.warn(o),s}},setItem:(r,s)=>{if(s===null)n.removeItem(`${e}.${r}`);else try{n.setItem(`${e}.${r}`,i(s))}catch(a){console.error(a)}},removeItem:r=>n.removeItem(`${e}.${r}`)}}var N="store",C,y,U,H,wt=class{constructor({autoConnect:t=!1,connectors:e=[new z],publicClient:i,storage:n=pt({storage:typeof window<"u"?window.localStorage:gt}),logger:r={warn:console.warn},webSocketPublicClient:s}){var f,u;W(this,U),this.publicClients=new Map,this.webSocketPublicClients=new Map,W(this,C,void 0),W(this,y,void 0),this.args={autoConnect:t,connectors:e,logger:r,publicClient:i,storage:n,webSocketPublicClient:s};let a="disconnected",o;if(t)try{const l=n.getItem(N),h=(f=l==null?void 0:l.state)==null?void 0:f.data;a=h!=null&&h.account?"reconnecting":"connecting",o=(u=h==null?void 0:h.chain)==null?void 0:u.id}catch{}const c=typeof e=="function"?e():e;c.forEach(l=>l.setStorage(n)),this.store=L(G(X(()=>({connectors:c,publicClient:this.getPublicClient({chainId:o}),status:a,webSocketPublicClient:this.getWebSocketPublicClient({chainId:o})}),{name:N,storage:n,partialize:l=>{var h,d;return{...t&&{data:{account:(h=l==null?void 0:l.data)==null?void 0:h.account,chain:(d=l==null?void 0:l.data)==null?void 0:d.chain}},chains:l==null?void 0:l.chains}},version:2}))),this.storage=n,k(this,y,n==null?void 0:n.getItem("wallet")),lt(this,U,H).call(this),t&&typeof window<"u"&&setTimeout(async()=>await this.autoConnect(),0)}get chains(){return this.store.getState().chains}get connectors(){return this.store.getState().connectors}get connector(){return this.store.getState().connector}get data(){return this.store.getState().data}get error(){return this.store.getState().error}get lastUsedChainId(){var t,e;return(e=(t=this.data)==null?void 0:t.chain)==null?void 0:e.id}get publicClient(){return this.store.getState().publicClient}get status(){return this.store.getState().status}get subscribe(){return this.store.subscribe}get webSocketPublicClient(){return this.store.getState().webSocketPublicClient}setState(t){const e=typeof t=="function"?t(this.store.getState()):t;this.store.setState(e,!0)}clearState(){this.setState(t=>({...t,chains:void 0,connector:void 0,data:void 0,error:void 0,status:"disconnected"}))}async destroy(){var t,e;this.connector&&await((e=(t=this.connector).disconnect)==null?void 0:e.call(t)),k(this,C,!1),this.clearState(),this.store.destroy()}async autoConnect(){if(P(this,C))return;k(this,C,!0),this.setState(i=>{var n;return{...i,status:(n=i.data)!=null&&n.account?"reconnecting":"connecting"}});const t=P(this,y)?[...this.connectors].sort(i=>i.id===P(this,y)?-1:1):this.connectors;let e=!1;for(const i of t){if(!i.ready||!i.isAuthorized||!await i.isAuthorized())continue;const r=await i.connect();this.setState(s=>({...s,connector:i,chains:i==null?void 0:i.chains,data:r,status:"connected"})),e=!0;break}return e||this.setState(i=>({...i,data:void 0,status:"disconnected"})),k(this,C,!1),this.data}setConnectors(t){this.args={...this.args,connectors:t};const e=typeof t=="function"?t():t;e.forEach(i=>i.setStorage(this.args.storage)),this.setState(i=>({...i,connectors:e}))}getPublicClient({chainId:t}={}){let e=this.publicClients.get(-1);if(e&&(e==null?void 0:e.chain.id)===t||(e=this.publicClients.get(t??-1),e))return e;const{publicClient:i}=this.args;return e=typeof i=="function"?i({chainId:t}):i,this.publicClients.set(t??-1,e),e}setPublicClient(t){var i,n;const e=(n=(i=this.data)==null?void 0:i.chain)==null?void 0:n.id;this.args={...this.args,publicClient:t},this.publicClients.clear(),this.setState(r=>({...r,publicClient:this.getPublicClient({chainId:e})}))}getWebSocketPublicClient({chainId:t}={}){let e=this.webSocketPublicClients.get(-1);if(e&&(e==null?void 0:e.chain.id)===t||(e=this.webSocketPublicClients.get(t??-1),e))return e;const{webSocketPublicClient:i}=this.args;return e=typeof i=="function"?i({chainId:t}):i,e&&this.webSocketPublicClients.set(t??-1,e),e}setWebSocketPublicClient(t){var i,n;const e=(n=(i=this.data)==null?void 0:i.chain)==null?void 0:n.id;this.args={...this.args,webSocketPublicClient:t},this.webSocketPublicClients.clear(),this.setState(r=>({...r,webSocketPublicClient:this.getWebSocketPublicClient({chainId:e})}))}setLastUsedConnector(t=null){var e;(e=this.storage)==null||e.setItem("wallet",t)}};C=new WeakMap;y=new WeakMap;U=new WeakSet;H=function(){const t=o=>{this.setState(c=>({...c,data:{...c.data,...o}}))},e=()=>{this.clearState()},i=o=>{this.setState(c=>({...c,error:o}))};this.store.subscribe(({connector:o})=>o,(o,c)=>{var f,u,l,h,d,p;(f=c==null?void 0:c.off)==null||f.call(c,"change",t),(u=c==null?void 0:c.off)==null||u.call(c,"disconnect",e),(l=c==null?void 0:c.off)==null||l.call(c,"error",i),o&&((h=o.on)==null||h.call(o,"change",t),(d=o.on)==null||d.call(o,"disconnect",e),(p=o.on)==null||p.call(o,"error",i))});const{publicClient:n,webSocketPublicClient:r}=this.args;(typeof n=="function"||typeof r=="function")&&this.store.subscribe(({data:o})=>{var c;return(c=o==null?void 0:o.chain)==null?void 0:c.id},o=>{this.setState(c=>({...c,publicClient:this.getPublicClient({chainId:o}),webSocketPublicClient:this.getWebSocketPublicClient({chainId:o})}))})};var B;function vt(t){const e=new wt(t);return B=e,e}function O(){if(!B)throw new Error("No wagmi config found. Ensure you have set up a config: https://wagmi.sh/react/config");return B}async function Pt({chainId:t,connector:e}){const i=O(),n=i.connector;if(n&&e.id===n.id)throw new ht;try{i.setState(s=>({...s,status:"connecting"}));const r=await e.connect({chainId:t});return i.setLastUsedConnector(e.id),i.setState(s=>({...s,connector:e,chains:e==null?void 0:e.chains,data:r,status:"connected"})),i.storage.setItem("connected",!0),{...r,connector:e}}catch(r){throw i.setState(s=>({...s,status:s.connector?"connected":"disconnected"})),r}}async function Wt(){const t=O();t.connector&&await t.connector.disconnect(),t.clearState(),t.storage.removeItem("connected")}function At(){const{data:t,connector:e,status:i}=O();switch(i){case"connected":return{address:t==null?void 0:t.account,connector:e,isConnected:!0,isConnecting:!1,isDisconnected:!1,isReconnecting:!1,status:i};case"reconnecting":return{address:t==null?void 0:t.account,connector:e,isConnected:!!(t!=null&&t.account),isConnecting:!1,isDisconnected:!1,isReconnecting:!0,status:i};case"connecting":return{address:t==null?void 0:t.account,connector:e,isConnected:!1,isConnecting:!0,isDisconnected:!1,isReconnecting:!1,status:i};case"disconnected":return{address:void 0,connector:void 0,isConnected:!1,isConnecting:!1,isDisconnected:!0,isReconnecting:!1,status:i}}}function _t(){return function(t){return t.rpcUrls.public.http[0]?{chain:t,rpcUrls:t.rpcUrls.public}:null}}var v,Ut=class extends z{constructor({chains:t,options:e}={}){const i={name:"MetaMask",shimDisconnect:!0,getProvider(){function n(s){if(s!=null&&s.isMetaMask&&!(s.isBraveWallet&&!s._events&&!s._state)&&!s.isApexWallet&&!s.isAvalanche&&!s.isBitKeep&&!s.isBlockWallet&&!s.isMathWallet&&!(s.isOkxWallet||s.isOKExWallet)&&!(s.isOneInchIOSWallet||s.isOneInchAndroidWallet)&&!s.isOpera&&!s.isPortal&&!s.isRabby&&!s.isDefiant&&!s.isTokenPocket&&!s.isTokenary&&!s.isZerion)return s}if(typeof window>"u")return;const r=window.ethereum;return r!=null&&r.providers?r.providers.find(n):n(r)},...e};super({chains:t,options:i}),g(this,"id","metaMask"),g(this,"shimDisconnectKey",`${this.id}.shimDisconnect`),K(this,v,void 0),F(this,v,i.UNSTABLE_shimOnConnectSelectAccount)}async connect({chainId:t}={}){var e,i,n,r;try{const s=await this.getProvider();if(!s)throw new m;s.on&&(s.on("accountsChanged",this.onAccountsChanged),s.on("chainChanged",this.onChainChanged),s.on("disconnect",this.onDisconnect)),this.emit("message",{type:"connecting"});let a=null;if(q(this,v)&&((e=this.options)!=null&&e.shimDisconnect)&&!((i=this.storage)!=null&&i.getItem(this.shimDisconnectKey))&&(a=await this.getAccount().catch(()=>null),!!a))try{await s.request({method:"wallet_requestPermissions",params:[{eth_accounts:{}}]}),a=await this.getAccount()}catch(u){if(this.isUserRejectedRequestError(u))throw new b(u);if(u.code===new A(u).code)throw u}if(!a){const f=await s.request({method:"eth_requestAccounts"});a=S(f[0])}let o=await this.getChainId(),c=this.isChainUnsupported(o);return t&&o!==t&&(o=(await this.switchChain(t)).id,c=this.isChainUnsupported(o)),(n=this.options)!=null&&n.shimDisconnect&&((r=this.storage)==null||r.setItem(this.shimDisconnectKey,!0)),{account:a,chain:{id:o,unsupported:c},provider:s}}catch(s){throw this.isUserRejectedRequestError(s)?new b(s):s.code===-32002?new A(s):s}}};v=new WeakMap;export{Ut as M,pt as a,O as b,vt as c,At as d,Wt as e,M as f,kt as g,Pt as h,yt as i,Et as j,St as m,gt as n,_t as p};
