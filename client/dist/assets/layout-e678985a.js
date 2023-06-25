import{j as e,r as n}from"./react-2cd99521.js";import{L as s}from"./react-router-dom-e78e2396.js";import{a as v}from"./index-4749bbbd.js";import{k as p}from"./react-toastify-9069338f.js";import{u as N}from"./react-i18next-e3fc60cf.js";import{u as b}from"./react-router-d6ff755c.js";const y="/assets/logo-vertical-e9aafd8f.png",k=()=>e.jsxs("footer",{className:"bg-white border-t",children:[e.jsx("div",{className:"container mx-auto px-8",children:e.jsxs("div",{className:"w-full flex flex-col md:flex-row py-6",children:[e.jsx("div",{className:"flex-1 mb-6 text-black",children:e.jsx(s,{className:"text-pink-600 no-underline hover:no-underline font-bold text-2xl lg:text-4xl",to:"/",children:e.jsx("img",{src:y,alt:"logo",className:"lg:w-32 w-20"})})}),e.jsxs("div",{className:"flex-1",children:[e.jsx("p",{className:"uppercase text-gray-500 md:mb-6",children:"Links"}),e.jsxs("ul",{className:"list-reset mb-6",children:[e.jsx("li",{className:"mt-2 inline-block mr-2 md:block md:mr-0",children:e.jsx("a",{href:"#",className:"no-underline hover:underline text-gray-800 hover:text-primary",children:"FAQ"})}),e.jsx("li",{className:"mt-2 inline-block mr-2 md:block md:mr-0",children:e.jsx("a",{href:"#",className:"no-underline hover:underline text-gray-800 hover:text-primary",children:"Help"})}),e.jsx("li",{className:"mt-2 inline-block mr-2 md:block md:mr-0",children:e.jsx("a",{href:"#",className:"no-underline hover:underline text-gray-800 hover:text-primary",children:"Support"})})]})]}),e.jsxs("div",{className:"flex-1",children:[e.jsx("p",{className:"uppercase text-gray-500 md:mb-6",children:"Legal"}),e.jsxs("ul",{className:"list-reset mb-6",children:[e.jsx("li",{className:"mt-2 inline-block mr-2 md:block md:mr-0",children:e.jsx("a",{href:"#",className:"no-underline hover:underline text-gray-800 hover:text-primary",children:"Terms"})}),e.jsx("li",{className:"mt-2 inline-block mr-2 md:block md:mr-0",children:e.jsx("a",{href:"#",className:"no-underline hover:underline text-gray-800 hover:text-primary",children:"Privacy"})})]})]}),e.jsxs("div",{className:"flex-1",children:[e.jsx("p",{className:"uppercase text-gray-500 md:mb-6",children:"Social"}),e.jsxs("ul",{className:"list-reset mb-6",children:[e.jsx("li",{className:"mt-2 inline-block mr-2 md:block md:mr-0",children:e.jsx("a",{href:"#",className:"no-underline hover:underline text-gray-800 hover:text-primary",children:"Facebook"})}),e.jsx("li",{className:"mt-2 inline-block mr-2 md:block md:mr-0",children:e.jsx("a",{href:"#",className:"no-underline hover:underline text-gray-800 hover:text-primary",children:"Linkedin"})}),e.jsx("li",{className:"mt-2 inline-block mr-2 md:block md:mr-0",children:e.jsx("a",{href:"#",className:"no-underline hover:underline text-gray-800 hover:text-primary",children:"Twitter"})})]})]}),e.jsxs("div",{className:"flex-1",children:[e.jsx("p",{className:"uppercase text-gray-500 md:mb-6",children:"Company"}),e.jsxs("ul",{className:"list-reset mb-6",children:[e.jsx("li",{className:"mt-2 inline-block mr-2 md:block md:mr-0",children:e.jsx("a",{href:"#",className:"no-underline hover:underline text-gray-800 hover:text-primary",children:"Official Blog"})}),e.jsx("li",{className:"mt-2 inline-block mr-2 md:block md:mr-0",children:e.jsx("a",{href:"#",className:"no-underline hover:underline text-gray-800 hover:text-primary",children:"About Us"})}),e.jsx("li",{className:"mt-2 inline-block mr-2 md:block md:mr-0",children:e.jsx("a",{href:"#",className:"no-underline hover:underline text-gray-800 hover:text-primary",children:"Contact"})})]})]})]})}),e.jsx("div",{className:"w-full text-gray-500 text-center my-4",children:"© 2023 Lend a Hand. All Rights Reserved."})]}),w=()=>{const{t:l,i18n:o}=N(),{hash:r,pathname:u}=b(),[f,d]=n.useState(!1),[a,i]=n.useState(!1),c=n.useRef(),m=()=>i(!1);n.useLayoutEffect(()=>{const t=()=>{window.scrollY>50?d(!0):d(!1)},x=h=>{c.current&&!c.current.contains(h.target)&&m&&m()};return window.addEventListener("scroll",t),document.addEventListener("click",x,!0),()=>{window.removeEventListener("scroll",t),document.removeEventListener("click",x,!0)}},[]);const g=t=>{o.changeLanguage(t.target.value),window.location.reload(!1)},j=()=>i(!a);return n.useEffect(()=>{i(!1)},[u,r]),e.jsxs(e.Fragment,{children:[e.jsx(p,{}),e.jsx("nav",{ref:c,className:`fixed w-full z-30 top-0 text-white shadow-lg ${f?"backdrop-blur-xl":"gradient"}`,children:e.jsxs("div",{className:"w-full container mx-auto flex flex-wrap items-center justify-between mt-0 py-2",children:[e.jsx("div",{className:"pl-4 flex items-center",children:e.jsx(s,{className:"toggleColour text-white no-underline hover:no-underline font-bold text-2xl lg:text-4xl",to:"/",children:e.jsx("img",{src:v,className:"w-auto h-12 lg:h-20"})})}),e.jsx("div",{className:"block lg:hidden pr-4",children:e.jsx("button",{onClick:j,className:"flex items-center p-1 text-gray-800 hover:text-gray-900 focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out",children:a?e.jsx("svg",{className:"fill-current h-8 w-8",viewBox:"-3.5 0 19 19",xmlns:"http://www.w3.org/2000/svg",children:e.jsx("path",{d:"M11.383 13.644A1.03 1.03 0 0 1 9.928 15.1L6 11.172 2.072 15.1a1.03 1.03 0 1 1-1.455-1.456l3.928-3.928L.617 5.79a1.03 1.03 0 1 1 1.455-1.456L6 8.261l3.928-3.928a1.03 1.03 0 0 1 1.455 1.456L7.455 9.716z"})}):e.jsx("svg",{className:"fill-current h-6 w-6",viewBox:"0 -5 32 32",version:"1.1",xmlns:"http://www.w3.org/2000/svg",children:e.jsx("g",{id:"icons",stroke:"none",strokeWidth:"1",fill:"none",fillRule:"evenodd",children:e.jsx("g",{id:"ui-gambling-website-lined-icnos-casinoshunter",transform:"translate(-2294.000000, -159.000000)",fill:"#1C1C1F",fillRule:"nonzero",children:e.jsx("g",{id:"1",transform:"translate(1350.000000, 120.000000)",children:e.jsx("path",{d:"M974,57 C975.104569,57 976,57.8954305 976,59 C976,60.1045695 975.104569,61 974,61 L946,61 C944.895431,61 944,60.1045695 944,59 C944,57.8954305 944.895431,57 946,57 L974,57 Z M974,48 C975.104569,48 976,48.8954305 976,50 C976,51.1045695 975.104569,52 974,52 L946,52 C944.895431,52 944,51.1045695 944,50 C944,48.8954305 944.895431,48 946,48 L974,48 Z M974,39 C975.104569,39 976,39.8954305 976,41 C976,42.1045695 975.104569,43 974,43 L946,43 C944.895431,43 944,42.1045695 944,41 C944,39.8954305 944.895431,39 946,39 L974,39 Z",id:"menu"})})})})})})}),e.jsx("div",{className:`w-full flex-grow lg:flex lg:items-center lg:w-auto ${a?"":"hidden"} mt-2 lg:mt-0 bg-inherit lg:bg-transparent text-black p-4 lg:p-0 z-20`,children:e.jsxs("ul",{className:"list-reset lg:flex justify-end flex-1 items-center",children:[e.jsx("li",{className:"mr-3",children:e.jsx(s,{className:`inline-block ${r.includes("#about")?"font-bold":""} py-2 px-4 text-black no-underline`,to:"/#about",children:l("aboutUs")})}),e.jsx("li",{className:"mr-3",children:e.jsx(s,{className:`inline-block ${r.includes("#features")?"font-bold":""} text-black no-underline hover:text-gray-800 hover:text-underline py-2 px-4`,to:"/#features",children:l("features")})}),e.jsx("li",{className:"mr-3",children:e.jsx(s,{className:`inline-block ${r.includes("#contact")?"font-bold":""} text-black no-underline hover:text-gray-800 hover:text-underline py-2 px-4`,to:"/#contact",children:l("contact")})}),e.jsx("li",{className:"mr-3",children:e.jsx(s,{to:"/login",className:"block hover:underline bg-white text-gray-800 font-bold rounded-full lg:mt-0 py-4 px-8 shadow opacity-75 focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out",children:l("login")})}),e.jsx("li",{className:"",children:e.jsxs("select",{className:"bg-inherit px-4 py-2 focus:outline-none active:outline-none",onChange:g,defaultValue:o.language.includes("vi")?"vi":"en",children:[e.jsx("option",{value:"en",children:"EN"}),e.jsx("option",{value:"vi",children:"VI"})]})})]})})]})})]})},F=({children:l})=>e.jsx(e.Fragment,{children:e.jsxs("div",{className:"leading-normal tracking-normal text-white gradient",children:[e.jsx(w,{}),l,e.jsx(k,{})]})});export{F as L};
