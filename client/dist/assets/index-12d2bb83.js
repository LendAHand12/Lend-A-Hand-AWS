import{r as i,j as e}from"./react-2cd99521.js";import{A as h}from"./Auth-c3d56798.js";import{L as g}from"./index-f32d7dd4.js";import{u as j}from"./react-hook-form-bd013bdf.js";import{Q as y}from"./react-toastify-9069338f.js";import{u as b}from"./react-i18next-e3fc60cf.js";import"./@ethereumjs-a0310e2a.js";import"./index-4749bbbd.js";import"./react-dom-3bfafca0.js";import"./scheduler-765c72db.js";import"./react-redux-5bfe471e.js";import"./hoist-non-react-statics-23d96a9a.js";import"./react-is-e8e5dbb3.js";import"./use-sync-external-store-b588041f.js";import"./wagmi-a971f881.js";import"./@tanstack-45f509e5.js";import"./@wagmi-21bd2ff5.js";import"./zustand-96774db3.js";import"./viem-a9891897.js";import"./@noble-904ea724.js";import"./eventemitter3-951c0ce8.js";import"./@reduxjs-5da8789b.js";import"./immer-41fd5235.js";import"./redux-4e8b28bc.js";import"./@babel-1086f5cb.js";import"./redux-thunk-ef899f4c.js";import"./react-router-dom-e78e2396.js";import"./react-router-d6ff755c.js";import"./history-ab5531d8.js";import"./resolve-pathname-e210f2ac.js";import"./value-equal-17d7769a.js";import"./tiny-invariant-dd7d57d2.js";import"./mini-create-react-context-6807ee74.js";import"./prop-types-19d89cee.js";import"./path-to-regexp-e4bf7bdb.js";import"./isarray-7a86238f.js";import"./axios-4a70c6fc.js";import"./query-string-e8aaf39e.js";import"./i18next-81de2c97.js";import"./i18next-browser-languagedetector-057d838e.js";import"./clsx-1229b3e0.js";const le=()=>{var s;const{t:r}=b(),{register:m,handleSubmit:a,formState:{errors:l}}=j(),[n,o]=i.useState(!1),[p,c]=i.useState(""),d=async u=>{const{code:x}=u;await h.getLinkVerify({email:x}).then(t=>{console.log(t.data),c(t.data.url),o(!1)}).catch(t=>{let f=t.response&&t.response.data.message?t.response.data.message:t.message;y.error(r(f)),o(!1)})};return e.jsx("div",{className:"text-gray-900 flex justify-center bg-white",children:e.jsx("div",{className:"max-w-screen-xl m-0 sm:m-10 flex justify-center flex-1",children:e.jsx("div",{className:"w-full p-12",children:e.jsxs("div",{className:"mt-12 flex flex-col items-center",children:[e.jsx("h1",{className:"text-2xl xl:text-3xl font-extrabold",children:r("linkVerify")}),e.jsx("div",{className:"w-full flex-1 mt-8",children:e.jsxs("form",{className:"mx-auto max-w-xl",onSubmit:a(d),autoComplete:"off",children:[e.jsx("input",{className:"w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white",type:"text",placeholder:"Email",...m("code",{required:"Email is required"})}),e.jsx("p",{className:"error-message-text",children:(s=l.code)==null?void 0:s.message}),e.jsxs("button",{type:"submit",className:"w-full flex justify-center items-center hover:underline gradient text-white font-bold rounded-full my-6 py-4 px-8 shadow-lg focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out",children:[n&&e.jsx(g,{}),r("confirm")]}),e.jsx("div",{className:"mx-auto max-w-xs text-center break-words",children:p})]})})]})})})})};export{le as default};
