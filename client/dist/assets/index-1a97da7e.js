import{r as s,j as e}from"./react-2cd99521.js";import{G as l,q as d}from"./react-organizational-chart-29b77366.js";import{U as c}from"./index-4749bbbd.js";import{Q as x,k as h}from"./react-toastify-9069338f.js";import{L as j}from"./index-f32d7dd4.js";import"./@ethereumjs-a0310e2a.js";import"./react-dom-3bfafca0.js";import"./scheduler-765c72db.js";import"./react-redux-5bfe471e.js";import"./hoist-non-react-statics-23d96a9a.js";import"./react-is-e8e5dbb3.js";import"./use-sync-external-store-b588041f.js";import"./wagmi-a971f881.js";import"./@tanstack-45f509e5.js";import"./@wagmi-21bd2ff5.js";import"./zustand-96774db3.js";import"./viem-a9891897.js";import"./@noble-904ea724.js";import"./eventemitter3-951c0ce8.js";import"./@reduxjs-5da8789b.js";import"./immer-41fd5235.js";import"./redux-4e8b28bc.js";import"./@babel-1086f5cb.js";import"./redux-thunk-ef899f4c.js";import"./react-router-dom-e78e2396.js";import"./react-router-d6ff755c.js";import"./history-ab5531d8.js";import"./resolve-pathname-e210f2ac.js";import"./value-equal-17d7769a.js";import"./tiny-invariant-dd7d57d2.js";import"./mini-create-react-context-6807ee74.js";import"./prop-types-19d89cee.js";import"./path-to-regexp-e4bf7bdb.js";import"./isarray-7a86238f.js";import"./react-i18next-e3fc60cf.js";import"./axios-4a70c6fc.js";import"./query-string-e8aaf39e.js";import"./i18next-81de2c97.js";import"./i18next-browser-languagedetector-057d838e.js";import"./clsx-1229b3e0.js";const n=({children:t})=>e.jsx("div",{className:"p-3 rotate-180 text-white text-sm rounded-md inline-block bg-green-600",children:e.jsxs("div",{className:"flex flex-col items-center",children:[e.jsx("span",{children:t}),e.jsxs("svg",{className:"w-10 h-auto text-red-500",viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:[e.jsx("path",{d:"M18.6675 8.40949C15.9295 5.55221 13.2894 7.72919 12.3116 8.91972C11.3167 7.73083 8.14152 5.60094 5.3558 8.45428C1.87366 12.0209 5.85325 19.1543 8.83795 20.6829C10.3303 21.4472 12.3116 20.6543 12.3116 20.1448C12.3116 20.655 13.7783 21.4203 15.245 20.655C18.1785 19.1243 22.0899 11.9811 18.6675 8.40949Z",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"}),e.jsx("path",{d:"M18.6675 8.40949C15.9295 5.55221 13.2894 7.72919 12.3116 8.91972C11.3167 7.73083 8.14152 5.60094 5.3558 8.45428C1.87366 12.0209 5.85325 19.1543 8.83795 20.6829C10.3303 21.4472 12.3116 20.6543 12.3116 20.1448C12.3116 20.655 13.7783 21.4203 15.245 20.655C18.1785 19.1243 22.0899 11.9811 18.6675 8.40949Z",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"}),e.jsx("path",{d:"M12.7395 5.27826L14.5178 3.50002",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"})]})]})}),a=({node:t})=>e.jsx(d,{label:e.jsx(n,{children:t.name}),children:t.children&&t.children.length>0&&t.children.map(o=>e.jsx(a,{node:o},o._id))}),te=()=>{const[t,o]=s.useState(!1),[i,m]=s.useState({});return s.useEffect(()=>{(async()=>(o(!0),await c.getTree().then(r=>{o(!1),m(r.data)}).catch(r=>{let p=r.response&&r.response.data.error?r.response.data.error:r.message;x.error(p),o(!1)})))()},[]),e.jsxs(e.Fragment,{children:[e.jsx(h,{}),t?e.jsx("div",{className:"flex justify-center",children:e.jsx(j,{})}):e.jsx("div",{className:"w-full overflow-auto rotate-180",children:e.jsx(l,{lineWidth:"10px",lineColor:"brown",lineBorderRadius:"10px",label:e.jsx(n,{children:i.name}),children:i.children&&i.children.length>0&&i.children.map(r=>e.jsx(a,{node:r},r._id))})})]})};export{te as default};
