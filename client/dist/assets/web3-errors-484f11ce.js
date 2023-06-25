const f=1100;class o extends Error{constructor(s,t){super(s),this.innerError=t,this.name=this.constructor.name,typeof Error.captureStackTrace=="function"?Error.captureStackTrace(new.target.constructor):this.stack=new Error().stack}static convertToString(s,t=!1){if(s==null)return"undefined";const e=JSON.stringify(s,(a,c)=>typeof c=="bigint"?c.toString():c);return t&&["bigint","string"].includes(typeof s)?e.replace(/['\\"]+/g,""):e}toJSON(){return{name:this.name,code:this.code,message:this.message,innerError:this.innerError}}}class n extends o{constructor(s,t){super(`Invalid value given "${o.convertToString(s,!0)}". Error: ${t}.`),this.name=this.constructor.name}}class U extends o{constructor(){super("Private key must be 32 bytes."),this.code=701}}class b extends o{constructor(){super("Invalid Private Key, Not a valid string or uint8Array"),this.code=702}}class G extends o{constructor(s){super(`"${s}"`),this.code=802}}class X extends o{constructor(){super("Invalid key derivation function"),this.code=703}}class H extends o{constructor(){super("Key derivation failed - possibly wrong password"),this.code=704}}class y extends o{constructor(){super("Unsupported key store version"),this.code=705}}class F extends o{constructor(){super("Password cannot be empty"),this.code=706}}class $ extends o{constructor(){super("Initialization vector must be 16 bytes"),this.code=707}}class k extends o{constructor(){super("c > 1000, pbkdf2 is less secure with less iterations"),this.code=709}}class _ extends o{constructor(s,t){super(s),this.code=500,t&&(this.errorCode=t.code,this.errorReason=t.reason)}toJSON(){return Object.assign(Object.assign({},super.toJSON()),{errorCode:this.errorCode,errorReason:this.errorReason})}}class B extends _{constructor(s){super("Connection not open",s),this.code=503}}class w extends _{constructor(s){super(`Maximum number of reconnect attempts reached! (${s})`),this.code=505}}class K extends _{constructor(){super("CONNECTION ERROR: Provider started to reconnect before the response got received!"),this.code=506}}class j extends _{constructor(s){super(`Request already sent with following id: ${s}`),this.code=507}}class N extends o{constructor(s,t){super(s),this.code=300,this.receipt=t}}class J extends o{constructor(s,t){super(`The resolver at ${s} does not implement requested method: "${t}".`),this.address=s,this.name=t,this.code=301}toJSON(){return Object.assign(Object.assign({},super.toJSON()),{address:this.address,name:this.name})}}class d extends N{constructor(s){if(super(s.message||"Error"),this.name="name"in s&&s.name||this.constructor.name,this.stack="stack"in s&&s.stack||void 0,this.code=s.code,typeof s.data=="object"){let t;"originalError"in s.data?t=s.data.originalError:t=s.data,this.data=t.data,this.innerError=new d(t)}else this.data=s.data}setDecodedProperties(s,t,e){this.errorName=s,this.errorSignature=t,this.errorArgs=e}toJSON(){let s=Object.assign(Object.assign({},super.toJSON()),{data:this.data});return this.errorName&&(s=Object.assign(Object.assign({},s),{errorName:this.errorName,errorSignature:this.errorSignature,errorArgs:this.errorArgs})),s}}class W extends N{constructor(s){super("Error happened while trying to execute a function inside a smart contract"),this.code=310,this.innerError=new d(s)}}class Y extends n{constructor(s){var t,e;super(`data: ${(t=s.data)!==null&&t!==void 0?t:"undefined"}, input: ${(e=s.input)!==null&&e!==void 0?e:"undefined"}`,`You can't have "data" and "input" as properties of a contract at the same time, please use either "data" or "input" instead.`),this.code=311}}class q extends o{constructor(s){super(`ENS is not supported on network ${s}`),this.code=902}}class Q extends o{constructor(){super("Network not synced"),this.code=903}}class z extends o{constructor(s){super(`Invalid parameters passed. "${typeof s<"u"?s:""}"`),this.hint=s,this.code=207}toJSON(){return Object.assign(Object.assign({},super.toJSON()),{hint:this.hint})}}class Z extends o{constructor(){super(...arguments),this.code=201}}class ss extends o{constructor(){super("The method you're trying to call is not implemented."),this.code=202}}class rs extends o{constructor(){super(...arguments),this.code=203}}class ts extends o{constructor(){super(...arguments),this.code=204}}class es extends o{constructor(){super(...arguments),this.code=205}}class os extends o{constructor(s){super(`A plugin with the namespace: ${s} has already been registered.`),this.code=206}}class ns extends o{constructor(){super(...arguments),this.code=600}}class as extends o{constructor(s){super(`Client URL "${s}" is invalid.`),this.code=602}}class cs extends o{constructor(){super(...arguments),this.code=603}}class is extends o{constructor(){super(...arguments),this.code=604}}class Rs extends n{constructor(){super(...arguments),this.code=801}}class u extends o{constructor(s,t){super(s),this.receipt=t,this.code=400}toJSON(){return Object.assign(Object.assign({},super.toJSON()),{receipt:this.receipt})}}class l extends o{constructor(s,t,e,a){super(`Transaction has been reverted by the EVM${e===void 0?"":`:
 ${o.convertToString(e)}`}`),this.reason=s,this.signature=t,this.receipt=e,this.data=a,this.code=402}toJSON(){return Object.assign(Object.assign({},super.toJSON()),{reason:this.reason,signature:this.signature,receipt:this.receipt,data:this.data})}}class Es extends l{constructor(s,t,e,a,c,E,h){super(s),this.reason=s,this.customErrorName=t,this.customErrorDecodedSignature=e,this.customErrorArguments=a,this.signature=c,this.receipt=E,this.data=h,this.code=438}toJSON(){return Object.assign(Object.assign({},super.toJSON()),{reason:this.reason,customErrorName:this.customErrorName,customErrorDecodedSignature:this.customErrorDecodedSignature,customErrorArguments:this.customErrorArguments,signature:this.signature,receipt:this.receipt,data:this.data})}}class _s extends u{constructor(s){super(`Transaction has been reverted by the EVM${s===void 0?"":`:
 ${o.convertToString(s)}`}`,s),this.code=405}}class ds extends u{constructor(){super("Raw transaction undefined"),this.code=407}}class us extends u{constructor(){super("Transaction not found"),this.code=430}}class Is extends n{constructor(s){super(s,"invalid transaction with invalid sender"),this.code=408}}class Ns extends n{constructor(s){super(s,"invalid transaction with invalid receiver"),this.code=437}}class Ts extends n{constructor(){super("MissingCustomChainError","If tx.common is provided it must have tx.common.customChain"),this.code=410}}class hs extends n{constructor(){super("MissingCustomChainIdError","If tx.common is provided it must have tx.common.customChain and tx.common.customChain.chainId"),this.code=411}}class ls extends n{constructor(s){super(JSON.stringify(s),"Chain Id doesnt match in tx.chainId tx.common.customChain.chainId"),this.code=412}}class As extends n{constructor(s){super(JSON.stringify(s),"Chain doesnt match in tx.chain tx.common.basechain"),this.code=435}}class Os extends n{constructor(s){super(JSON.stringify(s),"hardfork doesnt match in tx.hardfork tx.common.hardfork"),this.code=436}}class ps extends n{constructor(){super("CommonOrChainAndHardforkError","Please provide the common object or the chain and hardfork property but not all together."),this.code=413}}class Ss extends n{constructor(s){var t,e;super("MissingChainOrHardforkError",`When specifying chain and hardfork, both values must be defined. Received "chain": ${(t=s.chain)!==null&&t!==void 0?t:"undefined"}, "hardfork": ${(e=s.hardfork)!==null&&e!==void 0?e:"undefined"}`),this.code=414}}class Ps extends n{constructor(s){var t,e,a,c;super(`gas: ${(t=s.gas)!==null&&t!==void 0?t:"undefined"}, gasPrice: ${(e=s.gasPrice)!==null&&e!==void 0?e:"undefined"}, maxPriorityFeePerGas: ${(a=s.maxPriorityFeePerGas)!==null&&a!==void 0?a:"undefined"}, maxFeePerGas: ${(c=s.maxFeePerGas)!==null&&c!==void 0?c:"undefined"}`,'"gas" is missing'),this.code=415}}class Cs extends n{constructor(s){var t,e,a,c;super(`gas: ${(t=s.gas)!==null&&t!==void 0?t:"undefined"}, gasPrice: ${(e=s.gasPrice)!==null&&e!==void 0?e:"undefined"}, maxPriorityFeePerGas: ${(a=s.maxPriorityFeePerGas)!==null&&a!==void 0?a:"undefined"}, maxFeePerGas: ${(c=s.maxFeePerGas)!==null&&c!==void 0?c:"undefined"}`,"transaction must specify legacy or fee market gas properties, not both"),this.code=434}}class Ds extends n{constructor(s){var t,e;super(`gas: ${(t=s.gas)!==null&&t!==void 0?t:"undefined"}, gasPrice: ${(e=s.gasPrice)!==null&&e!==void 0?e:"undefined"}`,"Gas or gasPrice is lower than 0"),this.code=416}}class ms extends n{constructor(s){var t,e;super(`maxPriorityFeePerGas: ${(t=s.maxPriorityFeePerGas)!==null&&t!==void 0?t:"undefined"}, maxFeePerGas: ${(e=s.maxFeePerGas)!==null&&e!==void 0?e:"undefined"}`,"maxPriorityFeePerGas or maxFeePerGas is lower than 0"),this.code=417}}class Ls extends n{constructor(s){super(s,"eip-1559 transactions don't support gasPrice"),this.code=418}}class gs extends n{constructor(s){var t,e;super(`maxPriorityFeePerGas: ${(t=s.maxPriorityFeePerGas)!==null&&t!==void 0?t:"undefined"}, maxFeePerGas: ${(e=s.maxFeePerGas)!==null&&e!==void 0?e:"undefined"}`,"pre-eip-1559 transaction don't support maxFeePerGas/maxPriorityFeePerGas"),this.code=419}}class xs extends n{constructor(s){super(s,"invalid transaction object"),this.code=420}}class Ms extends n{constructor(s){var t,e;super(`nonce: ${(t=s.nonce)!==null&&t!==void 0?t:"undefined"}, chainId: ${(e=s.chainId)!==null&&e!==void 0?e:"undefined"}`,"Nonce or chainId is lower than 0"),this.code=421}}class vs extends n{constructor(){super("UnableToPopulateNonceError","unable to populate nonce, no from address available"),this.code=422}}class Vs extends n{constructor(){super("Eip1559NotSupportedError","Network doesn't support eip-1559"),this.code=423}}class fs extends n{constructor(s){super(s,"unsupported transaction type"),this.code=424}}class Us extends n{constructor(s){var t,e;super(`data: ${(t=s.data)!==null&&t!==void 0?t:"undefined"}, input: ${(e=s.input)!==null&&e!==void 0?e:"undefined"}`,`You can't have "data" and "input" as properties of transactions at the same time, please use either "data" or "input" instead.`),this.code=425}}class bs extends o{constructor(s){super(`The connected Ethereum Node did not respond within ${s.numberOfSeconds} seconds, please make sure your transaction was properly sent and you are connected to a healthy Node. Be aware that transaction might still be pending or mined!
	Transaction Hash: ${s.transactionHash?s.transactionHash.toString():"not available"}`),this.code=431}}function T(r){return`Please make sure your transaction was properly sent and there no pervious pending transaction for the same account. However, be aware that it might still be mined!
	Transaction Hash: ${r?r.toString():"not available"}`}class Gs extends o{constructor(s){super(`Transaction was not mined within ${s.numberOfSeconds} seconds. ${T(s.transactionHash)}`),this.code=426}}class Xs extends o{constructor(s){super(`Transaction started at ${s.starterBlockNumber} but was not mined within ${s.numberOfBlocks} blocks. ${T(s.transactionHash)}`),this.code=432}}class Hs extends n{constructor(s){var t,e;super(`receipt: ${JSON.stringify(s.receipt)}, blockHash: ${(t=s.blockHash)===null||t===void 0?void 0:t.toString()}, transactionHash: ${(e=s.transactionHash)===null||e===void 0?void 0:e.toString()}`,"Receipt missing or blockHash null"),this.code=427}}class ys extends n{constructor(s){super(`receipt: ${JSON.stringify(s.receipt)}`,"Receipt missing block number"),this.code=428}}class Fs extends o{constructor(s){super(`Invalid signature. "${s}"`),this.code=433}}class $s extends n{constructor(){super("LocalWalletNotAvailableError","Attempted to index account in local wallet, but no wallet is available"),this.code=429}}class ks extends o{constructor(s,t){const e=[];s.forEach(a=>e.push(a.keyword.match(/data.(.+)/)[1])),super(`The following properties are invalid for the transaction type ${t}: ${e.join(", ")}`),this.code=439}}class Bs extends n{constructor(s){super(s,"can not parse as byte data"),this.code=1002}}class ws extends n{constructor(s){super(s,"can not parse as number data"),this.code=1003}}class Ks extends n{constructor(s){super(s,"invalid ethereum address"),this.code=1005}}class js extends n{constructor(s){super(s,"not a valid string"),this.code=1001}}class Js extends n{constructor(s){super(s,"invalid unit"),this.code=1004}}class Ws extends n{constructor(s){super(s,"can not be converted to hex"),this.code=1006}}class Ys extends n{constructor(s){super(s,"value greater than the nibble width"),this.code=1014}}class qs extends n{constructor(s){super(s,"not a valid boolean."),this.code=1008}}class Qs extends n{constructor(s){super(s,"not a valid unsigned integer."),this.code=1009}}class zs extends n{constructor(s){super(s,"invalid size given."),this.code=1010}}class Zs extends n{constructor(s){super(s,"value is larger than size."),this.code=1011}}class sr extends n{constructor(s){super(s,"invalid string given"),this.code=1012}}const A=r=>!Array.isArray(r)&&r.jsonrpc==="2.0"&&!!r&&(r.result===void 0||r.result===null)&&"error"in r&&(typeof r.id=="number"||typeof r.id=="string"),I=r=>A(r)?r.error.message:"";class O extends o{constructor(s,t,e){var a;super(t??`Returned error: ${Array.isArray(s)?s.map(c=>I(c)).join(","):I(s)}`),this.code=100,t||(this.data=Array.isArray(s)?s.map(c=>{var E;return(E=c.error)===null||E===void 0?void 0:E.data}):(a=s==null?void 0:s.error)===null||a===void 0?void 0:a.data),this.request=e}toJSON(){return Object.assign(Object.assign({},super.toJSON()),{data:this.data,request:this.request})}}class rr extends O{constructor(s,t){super(s,void 0,t),this.code=101;let e;"error"in s?e=s.error:s instanceof Array&&(e=s.map(a=>a.error)),this.innerError=e}}class tr extends o{constructor(s,t){super(`Web3Config hardfork doesnt match in defaultHardfork ${s} and common.hardfork ${t}`),this.code=1101}}class er extends o{constructor(s,t){super(`Web3Config chain doesnt match in defaultHardfork ${s} and common.hardfork ${t}`),this.code=1101}}class i extends o{constructor(s,t){super(t??`An Rpc error has occured with a code of ${s.error.code}`),this.code=s.error.code,this.id=s.id,this.jsonrpc=s.jsonrpc,this.jsonRpcError=s.error}toJSON(){return Object.assign(Object.assign({},super.toJSON()),{error:this.jsonRpcError,id:this.id,jsonRpc:this.jsonrpc})}}class p extends i{constructor(s){super(s,"Parse error"),this.code=-32700}}class S extends i{constructor(s){super(s,"Invalid request"),this.code=-32600}}class P extends i{constructor(s){super(s,"Method not found"),this.code=-32601}}class C extends i{constructor(s){super(s,"Invalid request"),this.code=-32602}}class D extends i{constructor(s){super(s,"Internal error"),this.code=-32603}}class m extends i{constructor(s){super(s,"Invalid input"),this.code=-32e3}}class L extends i{constructor(s){super(s,"Method not supported"),this.code=-32004}}class g extends i{constructor(s){super(s,"Resource unavailable"),this.code=-32002}}class x extends i{constructor(s){super(s,"Resource not found"),this.code=-32001}}class M extends i{constructor(s){super(s,"JSON-RPC version not supported"),this.code=-32006}}class v extends i{constructor(s){super(s,"Transaction rejected"),this.code=-32003}}class V extends i{constructor(s){super(s,"Limit exceeded"),this.code=-32005}}const R=new Map;R.set(-32700,{error:p});R.set(-32600,{error:S});R.set(-32601,{error:P});R.set(-32602,{error:C});R.set(-32603,{error:D});R.set(-32e3,{error:m});R.set(-32004,{error:L});R.set(-32002,{error:g});R.set(-32003,{error:v});R.set(-32001,{error:x});R.set(-32006,{error:M});R.set(-32005,{error:V});export{X as $,ps as A,Ss as B,er as C,As as D,os as E,Ps as F,Cs as G,Os as H,z as I,Ds as J,gs as K,$s as L,Ts as M,Ls as N,rs as O,ns as P,ms as Q,O as R,cs as S,Us as T,fs as U,es as V,ds as W,G as X,F as Y,$ as Z,k as _,tr as a,U as a0,b as a1,Fs as a2,y as a3,H as a4,N as a5,Y as a6,J as a7,Q as a8,q as a9,Ks as aa,as as ab,ss as ac,B as ad,Bs as ae,Ws as af,ws as ag,Js as ah,sr as ai,Ys as aj,Z as ak,js as al,qs as am,zs as an,Zs as ao,Qs as ap,_ as aq,K as ar,w as as,is as at,j as au,o as av,f as aw,i as b,rr as c,W as d,ts as e,ks as f,Vs as g,Is as h,Ns as i,vs as j,Xs as k,bs as l,Gs as m,Hs as n,ys as o,d as p,_s as q,R as r,l as s,Es as t,Rs as u,us as v,xs as w,Ms as x,hs as y,ls as z};
