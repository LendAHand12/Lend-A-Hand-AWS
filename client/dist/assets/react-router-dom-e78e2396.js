import{R as x,c as z,m as F}from"./react-router-d6ff755c.js";import{j as M,l as H,_ as g}from"./@babel-1086f5cb.js";import{R as c}from"./react-2cd99521.js";import{d as G,e as I,b as $,a as J}from"./history-ab5531d8.js";import{i as W}from"./tiny-invariant-dd7d57d2.js";var rr=function(r){M(e,r);function e(){for(var a,i=arguments.length,o=new Array(i),n=0;n<i;n++)o[n]=arguments[n];return a=r.call.apply(r,[this].concat(o))||this,a.history=G(a.props),a}var t=e.prototype;return t.render=function(){return c.createElement(x,{history:this.history,children:this.props.children})},e}(c.Component);c.Component;var E=function(e,t){return typeof e=="function"?e(t):e},S=function(e,t){return typeof e=="string"?J(e,null,null,t):e},j=function(e){return e},v=c.forwardRef;typeof v>"u"&&(v=j);function O(r){return!!(r.metaKey||r.altKey||r.ctrlKey||r.shiftKey)}var Q=v(function(r,e){var t=r.innerRef,a=r.navigate,i=r.onClick,o=H(r,["innerRef","navigate","onClick"]),n=o.target,l=g({},o,{onClick:function(s){try{i&&i(s)}catch(u){throw s.preventDefault(),u}!s.defaultPrevented&&s.button===0&&(!n||n==="_self")&&!O(s)&&(s.preventDefault(),a())}});return j!==v?l.ref=e||t:l.ref=t,c.createElement("a",l)}),U=v(function(r,e){var t=r.component,a=t===void 0?Q:t,i=r.replace,o=r.to,n=r.innerRef,l=H(r,["component","replace","to","innerRef"]);return c.createElement(z.Consumer,null,function(f){f||W(!1);var s=f.history,u=S(E(o,f.location),f.location),C=u?s.createHref(u):"",p=g({},l,{href:C,navigate:function(){var m=E(o,f.location),d=$(f.location)===$(S(m)),L=i||d?s.replace:s.push;L(m)}});return j!==v?p.ref=e||n:p.innerRef=n,c.createElement(a,p)})}),q=function(e){return e},w=c.forwardRef;typeof w>"u"&&(w=q);function V(){for(var r=arguments.length,e=new Array(r),t=0;t<r;t++)e[t]=arguments[t];return e.filter(function(a){return a}).join(" ")}w(function(r,e){var t=r["aria-current"],a=t===void 0?"page":t,i=r.activeClassName,o=i===void 0?"active":i,n=r.activeStyle,l=r.className,f=r.exact,s=r.isActive,u=r.location,C=r.sensitive,p=r.strict,h=r.style,m=r.to,d=r.innerRef,L=H(r,["aria-current","activeClassName","activeStyle","className","exact","isActive","location","sensitive","strict","style","to","innerRef"]);return c.createElement(z.Consumer,null,function(B){B||W(!1);var y=u||B.location,K=S(E(m,y),y),T=K.pathname,b=T&&T.replace(/([.+*?=^!:${}()[\]|/\\])/g,"\\$1"),D=b?F(y.pathname,{path:b,exact:f,sensitive:C,strict:p}):null,R=!!(s?s(D,y):D),N=typeof l=="function"?l(R):l,P=typeof h=="function"?h(R):h;R&&(N=V(N,o),P=g({},P,n));var A=g({"aria-current":R&&a||null,className:N,style:P,to:K},L);return q!==w?A.ref=e||d:A.innerRef=d,c.createElement(U,A)})});export{rr as B,U as L};
