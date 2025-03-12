(()=>{"use strict";var e={n:t=>{var r=t&&t.__esModule?()=>t.default:()=>t;return e.d(r,{a:r}),r},d:(t,r)=>{for(var s in r)e.o(r,s)&&!e.o(t,s)&&Object.defineProperty(t,s,{enumerable:!0,get:r[s]})},o:(e,t)=>Object.prototype.hasOwnProperty.call(e,t)};const t=window.ReactJSXRuntime,r=window.wp.element,s=window.React;var a=e.n(s);let o={data:""},i=e=>"object"==typeof window?((e?e.querySelector("#_goober"):window._goober)||Object.assign((e||document.head).appendChild(document.createElement("style")),{innerHTML:" ",id:"_goober"})).firstChild:e||o,n=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,l=/\/\*[^]*?\*\/|  +/g,c=/\n+/g,d=(e,t)=>{let r="",s="",a="";for(let o in e){let i=e[o];"@"==o[0]?"i"==o[1]?r=o+" "+i+";":s+="f"==o[1]?d(i,o):o+"{"+d(i,"k"==o[1]?"":t)+"}":"object"==typeof i?s+=d(i,t?t.replace(/([^,])+/g,(e=>o.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,(t=>/&/.test(t)?t.replace(/&/g,e):e?e+" "+t:t)))):o):null!=i&&(o=/^--/.test(o)?o:o.replace(/[A-Z]/g,"-$&").toLowerCase(),a+=d.p?d.p(o,i):o+":"+i+";")}return r+(t&&a?t+"{"+a+"}":a)+s},p={},u=e=>{if("object"==typeof e){let t="";for(let r in e)t+=r+u(e[r]);return t}return e},m=(e,t,r,s,a)=>{let o=u(e),i=p[o]||(p[o]=(e=>{let t=0,r=11;for(;t<e.length;)r=101*r+e.charCodeAt(t++)>>>0;return"go"+r})(o));if(!p[i]){let t=o!==e?e:(e=>{let t,r,s=[{}];for(;t=n.exec(e.replace(l,""));)t[4]?s.shift():t[3]?(r=t[3].replace(c," ").trim(),s.unshift(s[0][r]=s[0][r]||{})):s[0][t[1]]=t[2].replace(c," ").trim();return s[0]})(e);p[i]=d(a?{["@keyframes "+i]:t}:t,r?"":"."+i)}let m=r&&p.g?p.g:null;return r&&(p.g=p[i]),((e,t,r,s)=>{s?t.data=t.data.replace(s,e):-1===t.data.indexOf(e)&&(t.data=r?e+t.data:t.data+e)})(p[i],t,s,m),i};function f(e){let t=this||{},r=e.call?e(t.p):e;return m(r.unshift?r.raw?((e,t,r)=>e.reduce(((e,s,a)=>{let o=t[a];if(o&&o.call){let e=o(r),t=e&&e.props&&e.props.className||/^go/.test(e)&&e;o=t?"."+t:e&&"object"==typeof e?e.props?"":d(e,""):!1===e?"":e}return e+s+(null==o?"":o)}),""))(r,[].slice.call(arguments,1),t.p):r.reduce(((e,r)=>Object.assign(e,r&&r.call?r(t.p):r)),{}):r,i(t.target),t.g,t.o,t.k)}f.bind({g:1});let h,y,g,b=f.bind({k:1});function x(e,t){let r=this||{};return function(){let s=arguments;function a(o,i){let n=Object.assign({},o),l=n.className||a.className;r.p=Object.assign({theme:y&&y()},n),r.o=/ *go\d+/.test(l),n.className=f.apply(r,s)+(l?" "+l:""),t&&(n.ref=i);let c=e;return e[0]&&(c=n.as||e,delete n.as),g&&c[0]&&g(n),h(c,n)}return t?t(a):a}}var v=(e,t)=>(e=>"function"==typeof e)(e)?e(t):e,w=(()=>{let e=0;return()=>(++e).toString()})(),E=(()=>{let e;return()=>{if(void 0===e&&typeof window<"u"){let t=matchMedia("(prefers-reduced-motion: reduce)");e=!t||t.matches}return e}})(),j=(e,t)=>{switch(t.type){case 0:return{...e,toasts:[t.toast,...e.toasts].slice(0,20)};case 1:return{...e,toasts:e.toasts.map((e=>e.id===t.toast.id?{...e,...t.toast}:e))};case 2:let{toast:r}=t;return j(e,{type:e.toasts.find((e=>e.id===r.id))?1:0,toast:r});case 3:let{toastId:s}=t;return{...e,toasts:e.toasts.map((e=>e.id===s||void 0===s?{...e,dismissed:!0,visible:!1}:e))};case 4:return void 0===t.toastId?{...e,toasts:[]}:{...e,toasts:e.toasts.filter((e=>e.id!==t.toastId))};case 5:return{...e,pausedAt:t.time};case 6:let a=t.time-(e.pausedAt||0);return{...e,pausedAt:void 0,toasts:e.toasts.map((e=>({...e,pauseDuration:e.pauseDuration+a})))}}},N=[],O={toasts:[],pausedAt:void 0},C=e=>{O=j(O,e),N.forEach((e=>{e(O)}))},k={blank:4e3,error:4e3,success:2e3,loading:1/0,custom:4e3},_=e=>(t,r)=>{let s=((e,t="blank",r)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:t,ariaProps:{role:"status","aria-live":"polite"},message:e,pauseDuration:0,...r,id:(null==r?void 0:r.id)||w()}))(t,e,r);return C({type:2,toast:s}),s.id},$=(e,t)=>_("blank")(e,t);$.error=_("error"),$.success=_("success"),$.loading=_("loading"),$.custom=_("custom"),$.dismiss=e=>{C({type:3,toastId:e})},$.remove=e=>C({type:4,toastId:e}),$.promise=(e,t,r)=>{let s=$.loading(t.loading,{...r,...null==r?void 0:r.loading});return"function"==typeof e&&(e=e()),e.then((e=>{let a=t.success?v(t.success,e):void 0;return a?$.success(a,{id:s,...r,...null==r?void 0:r.success}):$.dismiss(s),e})).catch((e=>{let a=t.error?v(t.error,e):void 0;a?$.error(a,{id:s,...r,...null==r?void 0:r.error}):$.dismiss(s)})),e};var A=(e,t)=>{C({type:1,toast:{id:e,height:t}})},D=()=>{C({type:5,time:Date.now()})},S=new Map,T=e=>{let{toasts:t,pausedAt:r}=((e={})=>{let[t,r]=(0,s.useState)(O),a=(0,s.useRef)(O);(0,s.useEffect)((()=>(a.current!==O&&r(O),N.push(r),()=>{let e=N.indexOf(r);e>-1&&N.splice(e,1)})),[]);let o=t.toasts.map((t=>{var r,s,a;return{...e,...e[t.type],...t,removeDelay:t.removeDelay||(null==(r=e[t.type])?void 0:r.removeDelay)||(null==e?void 0:e.removeDelay),duration:t.duration||(null==(s=e[t.type])?void 0:s.duration)||(null==e?void 0:e.duration)||k[t.type],style:{...e.style,...null==(a=e[t.type])?void 0:a.style,...t.style}}}));return{...t,toasts:o}})(e);(0,s.useEffect)((()=>{if(r)return;let e=Date.now(),s=t.map((t=>{if(t.duration===1/0)return;let r=(t.duration||0)+t.pauseDuration-(e-t.createdAt);if(!(r<0))return setTimeout((()=>$.dismiss(t.id)),r);t.visible&&$.dismiss(t.id)}));return()=>{s.forEach((e=>e&&clearTimeout(e)))}}),[t,r]);let a=(0,s.useCallback)((()=>{r&&C({type:6,time:Date.now()})}),[r]),o=(0,s.useCallback)(((e,r)=>{let{reverseOrder:s=!1,gutter:a=8,defaultPosition:o}=r||{},i=t.filter((t=>(t.position||o)===(e.position||o)&&t.height)),n=i.findIndex((t=>t.id===e.id)),l=i.filter(((e,t)=>t<n&&e.visible)).length;return i.filter((e=>e.visible)).slice(...s?[l+1]:[0,l]).reduce(((e,t)=>e+(t.height||0)+a),0)}),[t]);return(0,s.useEffect)((()=>{t.forEach((e=>{if(e.dismissed)((e,t=1e3)=>{if(S.has(e))return;let r=setTimeout((()=>{S.delete(e),C({type:4,toastId:e})}),t);S.set(e,r)})(e.id,e.removeDelay);else{let t=S.get(e.id);t&&(clearTimeout(t),S.delete(e.id))}}))}),[t]),{toasts:t,handlers:{updateHeight:A,startPause:D,endPause:a,calculateOffset:o}}},z=b`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,I=b`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,L=b`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`,R=x("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#ff4b4b"};
  position: relative;
  transform: rotate(45deg);

  animation: ${z} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${I} 0.15s ease-out forwards;
    animation-delay: 150ms;
    position: absolute;
    border-radius: 3px;
    opacity: 0;
    background: ${e=>e.secondary||"#fff"};
    bottom: 9px;
    left: 4px;
    height: 2px;
    width: 12px;
  }

  &:before {
    animation: ${L} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`,P=b`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,M=x("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${e=>e.secondary||"#e0e0e0"};
  border-right-color: ${e=>e.primary||"#616161"};
  animation: ${P} 1s linear infinite;
`,H=b`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`,F=b`
0% {
	height: 0;
	width: 0;
	opacity: 0;
}
40% {
  height: 0;
	width: 6px;
	opacity: 1;
}
100% {
  opacity: 1;
  height: 10px;
}`,B=x("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#61d345"};
  position: relative;
  transform: rotate(45deg);

  animation: ${H} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;
  &:after {
    content: '';
    box-sizing: border-box;
    animation: ${F} 0.2s ease-out forwards;
    opacity: 0;
    animation-delay: 200ms;
    position: absolute;
    border-right: 2px solid;
    border-bottom: 2px solid;
    border-color: ${e=>e.secondary||"#fff"};
    bottom: 6px;
    left: 6px;
    height: 10px;
    width: 6px;
  }
`,Q=x("div")`
  position: absolute;
`,U=x("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,W=b`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`,Y=x("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${W} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,q=({toast:e})=>{let{icon:t,type:r,iconTheme:a}=e;return void 0!==t?"string"==typeof t?s.createElement(Y,null,t):t:"blank"===r?null:s.createElement(U,null,s.createElement(M,{...a}),"loading"!==r&&s.createElement(Q,null,"error"===r?s.createElement(R,{...a}):s.createElement(B,{...a})))},G=e=>`\n0% {transform: translate3d(0,${-200*e}%,0) scale(.6); opacity:.5;}\n100% {transform: translate3d(0,0,0) scale(1); opacity:1;}\n`,J=e=>`\n0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}\n100% {transform: translate3d(0,${-150*e}%,-1px) scale(.6); opacity:0;}\n`,X=x("div")`
  display: flex;
  align-items: center;
  background: #fff;
  color: #363636;
  line-height: 1.3;
  will-change: transform;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05);
  max-width: 350px;
  pointer-events: auto;
  padding: 8px 10px;
  border-radius: 8px;
`,Z=x("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`,K=s.memo((({toast:e,position:t,style:r,children:a})=>{let o=e.height?((e,t)=>{let r=e.includes("top")?1:-1,[s,a]=E()?["0%{opacity:0;} 100%{opacity:1;}","0%{opacity:1;} 100%{opacity:0;}"]:[G(r),J(r)];return{animation:t?`${b(s)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${b(a)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}})(e.position||t||"top-center",e.visible):{opacity:0},i=s.createElement(q,{toast:e}),n=s.createElement(Z,{...e.ariaProps},v(e.message,e));return s.createElement(X,{className:e.className,style:{...o,...r,...e.style}},"function"==typeof a?a({icon:i,message:n}):s.createElement(s.Fragment,null,i,n))}));!function(e,t,r,s){d.p=t,h=e,y=r,g=s}(s.createElement);var V=({id:e,className:t,style:r,onHeightUpdate:a,children:o})=>{let i=s.useCallback((t=>{if(t){let r=()=>{let r=t.getBoundingClientRect().height;a(e,r)};r(),new MutationObserver(r).observe(t,{subtree:!0,childList:!0,characterData:!0})}}),[e,a]);return s.createElement("div",{ref:i,className:t,style:r},o)},ee=f`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`,te=({reverseOrder:e,position:t="top-center",toastOptions:r,gutter:a,children:o,containerStyle:i,containerClassName:n})=>{let{toasts:l,handlers:c}=T(r);return s.createElement("div",{id:"_rht_toaster",style:{position:"fixed",zIndex:9999,top:16,left:16,right:16,bottom:16,pointerEvents:"none",...i},className:n,onMouseEnter:c.startPause,onMouseLeave:c.endPause},l.map((r=>{let i=r.position||t,n=((e,t)=>{let r=e.includes("top"),s=r?{top:0}:{bottom:0},a=e.includes("center")?{justifyContent:"center"}:e.includes("right")?{justifyContent:"flex-end"}:{};return{left:0,right:0,display:"flex",position:"absolute",transition:E()?void 0:"all 230ms cubic-bezier(.21,1.02,.73,1)",transform:`translateY(${t*(r?1:-1)}px)`,...s,...a}})(i,c.calculateOffset(r,{reverseOrder:e,gutter:a,defaultPosition:t}));return s.createElement(V,{id:r.id,key:r.id,onHeightUpdate:c.updateHeight,className:r.visible?ee:"",style:n},"custom"===r.type?v(r.message,r):o?o(r):s.createElement(K,{toast:r,position:i}))})))},re=$;const se=()=>(0,t.jsx)(te,{position:"bottom-center",containerStyle:{zIndex:1e5},toastOptions:{duration:2e3,className:"strsai-toast",style:{background:"#1e1e1e",color:"#fff"}}}),ae=e=>window.stspi18n&&window.stspi18n[e]||e,oe=e=>(0,t.jsx)("button",{type:"button",className:"stsp-button",onClick:e.onClick,children:e.children}),ie=e=>(0,t.jsx)("div",{className:"stsp-page-container",children:e.children}),ne=e=>{const r=(0,s.useRef)(null);return(0,s.useEffect)((()=>{const e=()=>{r.current&&(window.scrollY>0?r.current.classList.add("is-scrolled"):r.current.classList.remove("is-scrolled"))};return window.addEventListener("scroll",e),()=>{window.removeEventListener("scroll",e)}}),[]),(0,t.jsx)("div",{ref:r,className:"stsp-page-header",children:(0,t.jsx)("h1",{className:"stsp-page-header-title",children:e.title})})},le=()=>(0,t.jsxs)("div",{className:"stsp-scan-home",children:[(0,t.jsx)(se,{}),(0,t.jsx)(ne,{title:ae("SEAT_SCANNER")}),(0,t.jsx)(ie,{children:(0,t.jsx)("div",{className:"stsp-scan-home-content",children:(0,t.jsxs)("div",{className:"stsp-scan-home-content-start",children:[(0,t.jsx)("h2",{children:ae("QR_CODE_SCANNER")}),(0,t.jsx)("p",{children:ae("SCAN_THE_QR_CODE_TO_GET_SEAT_DETAILS")}),(0,t.jsx)(oe,{onClick:()=>{re.error(ae("SCAN_NOT_ALLOWED"))},children:ae("SCAN_NOW")})]})})})]}),ce=document.getElementById("stsp-scanner");(0,r.createRoot)(ce).render((0,t.jsx)(a().StrictMode,{children:(0,t.jsx)(le,{})}))})();