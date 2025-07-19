"use strict";function u(n){const t=document.createElementNS("http://www.w3.org/2000/svg",n);return Object.assign(t,{set:(e,i)=>(t.setAttribute(e,i),t)})}function p(n,t){let{parentElement:e}=t;for(;e;){if(e.localName==n)return e;e=e.parentElement}throw new Error("Parent element not found",{cause:{parentElementName:n,initialElement:t}})}function a(n,...t){const e=document.createElement("template");return e.innerHTML=n.reduce((i,s,o)=>i+s+(t[o]??""),""),e}const x=n=>{const t=new CSSStyleSheet;return t.insertRule(n.join("")),t},y=(n,t)=>[`${n} {`,t.join(";"),"}"];function b({clientX:n,clientY:t},{left:e,top:i}){return{x:Math.round(n-e),y:Math.round(t-i)}}const l={"v-canvas":[],"v-pin":["uid"],"v-label":["text"],"v-node":["xy"],"v-edge":["path"]},w={"v-canvas":["pointercancel","pointerdown","pointerleave","pointermove","pointerup"],"v-node":["pointerdown"]},E={"v-canvas":[x(y(":host",["--background-color: var(--flow-view-background-color, #fefefe)","color: var(--flow-view-text-color, #121212)","font-family: var(--flow-view-font-family, system-ui, Roboto, sans-serif)","--font-size: calc(var(--unit) * 1.6)","font-size: var(--font-size)","--transition: 200ms ease-in-out","background-color: var(--background-color)","cursor: var(--cursor)","display: block","overflow: hidden","position: relative","height: 100%","border: 0","margin: 0",...y("@media (prefers-color-scheme: dark)",["--background-color: var(--flow-view-background-color, #555)","color: var(--flow-view-text-color, #ccc)"])]))],"v-node":[],"v-edge":[],"v-col":[],"v-pin":[],"v-row":[],"v-label":[]},h={"v-canvas":a`<slot></slot>`,"v-col":a`<style>
:host {
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	gap: var(--unit);
	min-width: var(--unit);
}
</style>
<slot></slot>`,"v-row":a`<style>
:host {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	gap: var(--unit);
	min-height: var(--unit);
}
</style>
<slot></slot>`,"v-node":a`<style>
:host {
	position: absolute;
	left: calc(var(--unit) * var(--x) - var(--unit) * var(--origin-x));
	top: calc(var(--unit) * var(--y) - var(--unit) * var(--origin-y));
	background-color: var(--background-color);
	border-radius: calc(var(--unit) * 0.85);
	padding: calc(var(--unit) * 0.2);
	border: 1px solid;
	display: flex;
	flex-direction: column;
}
</style>
<slot></slot>`,"v-edge":a`<style>
:host {
	position: absolute;
	left: var(--left);
	top: var(--top);
	width: var(--width);
	height: var(--height);
}
</style>`,"v-pin":a`<style>
:host {
	width: var(--unit);
	height: var(--unit);
	border-radius: 50%;
	background-color: currentColor;
	opacity: 0.7;
	transition: opacity var(--transition);
}
:host(:hover) {
opacity: 1;
}
</style>`,"v-label":a`<style>
:host {
	font-size: var(--font-size);
	padding-inline: var(--unit);
	user-select: none;
}
</style>`};class C{#t=new Set;#i(t=2){let e="",i=!0;for(;i;)e=Math.random().toString(36).substring(2,2+t),i=this.#t.has(e),t++;return this.#t.add(e),e}createUid(){const t=this.#i();return this.#t.add(t),t}registerUid(t){return this.#t.has(t)?!1:(this.#t.add(t),!0)}unregisterUid(t){this.#t.delete(t)}}class S extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this.shadowRoot.appendChild(h["v-col"].content.cloneNode(!0))}}class V extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this.shadowRoot.appendChild(h["v-row"].content.cloneNode(!0))}}class R extends HTMLElement{#t=document.createElement("style");#i=10;#s=new Set;#o=new Map;#e={x:0,y:0};#n={isActive:!1,origin:{x:0,y:0},start:{x:0,y:0}};#r=u("svg");#h=new MutationObserver(t=>{for(const e of t)e.type==="childList"&&(console.log("TODO A child node has been added or removed."),console.log(e)),e.type==="attributes"&&console.log(`TODO The ${e.attributeName} attribute was modified.`)});#d=new ResizeObserver(t=>{for(const{contentBoxSize:[{blockSize:e,inlineSize:i}]}of t.filter(s=>s.target===this)){const s=Math.round(i),o=Math.round(e),{origin:{x:r,y:d},unit:c}=this;this.#r.set("width",`${s}`).set("height",`${o}`).set("viewBox",`${r*c} ${d*c} ${s} ${o}`)}});uidRegister=new C;constructor(){super(),this.attachShadow({mode:"open"});const t=h["v-canvas"].content.cloneNode(!0);this.#a(),t.insertBefore(this.#t,t.firstChild),t.appendChild(this.#r),this.shadowRoot.adoptedStyleSheets=E["v-canvas"],this.shadowRoot.appendChild(t)}connectedCallback(){this.#h.observe(this,{attributes:!0,childList:!0,subtree:!0}),this.#d.observe(this),w["v-canvas"].forEach(t=>{this.addEventListener(t,this)})}disconnectedCallback(){this.#h.disconnect(),this.#d.unobserve(this)}handleEvent(t){if(t instanceof PointerEvent&&t.target==this){const{type:e}=t;if(["pointercancel","pointerleave"].includes(e)&&this.#c(),e=="pointerdown"&&this.#u(b(t,this.getBoundingClientRect())),e=="pointermove"&&this.#n.isActive){const i=b(t,this.getBoundingClientRect()),s=this.#n.origin.x+parseFloat(((this.#n.start.x-i.x)/this.#i).toFixed(2)),o=this.#n.origin.y+parseFloat(((this.#n.start.y-i.y)/this.#i).toFixed(2));(s!=this.#e.x||o!=this.#e.y)&&(this.#e={x:s,y:o},this.#a(),this.#l())}e=="pointerup"&&this.#c()}}#a(){this.#t.innerHTML=`:host {
	--origin-x: ${this.#e.x};
	--origin-y: ${this.#e.y};
	--unit: ${this.#i}px;
	--cursor: ${this.#n.isActive?"grab":"default"};
}`}#u(t){this.#n.start=t,this.#n.origin=this.#e,this.#n.isActive=!0}#c(){this.#n.isActive=!1,this.#e={x:Math.round(this.#e.x),y:Math.round(this.#e.y)},this.#a(),this.#l()}#l(){for(const t of this.#s.values())t.updateBoundingRect()}#p(){for(const t of this.#s.values())t.updateBoundingRect(),t.updatePath()}get origin(){return this.#e}get unit(){return this.#i}registerEdge(t){this.#s.add(t)}unregisterEdge(t){this.#s.delete(t)}registerPin(t){this.#o.set(t.uid,t)}unregisterPin(t){this.#o.delete(t.uid)}getPinElementByUid(t){if(this.#o.has(t))return this.#o.get(t)}}class M extends HTMLElement{#t="";#i;constructor(){super(),this.attachShadow({mode:"open"}),this.shadowRoot.appendChild(h["v-pin"].content.cloneNode(!0))}static get observedAttributes(){return l["v-pin"]}attributeChangedCallback(t,e,i){if(t=="uid"){const s=this.#t;s&&i!=s&&this.setAttribute("uid",s)}}connectedCallback(){const t=this.node.canvas,e=this.getAttribute("uid")??t.uidRegister.createUid();if(t.uidRegister.registerUid(e))this.#t=e,t.registerPin(this);else{const s=t.uidRegister.createUid();this.#t=s,t.registerPin(this),this.setAttribute("uid",s)}}disconnectedCallback(){this.node.canvas.unregisterPin(this),this.node.canvas.uidRegister.unregisterUid(this.#t)}get size(){return this.node.canvas.unit}get position(){const t=getComputedStyle(this.node),e=parseFloat(t.paddingLeft),i=parseFloat(t.paddingTop);return{x:this.node.offsetLeft+this.offsetLeft+e,y:this.node.offsetTop+this.offsetTop+i}}get center(){const{position:t,size:e}=this;return{x:t.x+e/2,y:t.y+e/2}}get node(){if(this.#i)return this.#i;try{return this.#i=p("v-node",this)}catch(t){throw this.remove(),t}}get uid(){return this.#t}}class P extends HTMLElement{#t;#i=document.createElement("style");#s={x:0,y:0};constructor(){super(),this.attachShadow({mode:"open"});const t=h["v-node"].content.cloneNode(!0);this.#o(),t.insertBefore(this.#i,t.firstChild),this.shadowRoot.appendChild(t)}static get observedAttributes(){return l["v-node"]}attributeChangedCallback(t,e,i){if(t=="xy"){if(i===null){this.position={x:0,y:0};return}const[s,o]=i.split(",").map(r=>parseInt(r));if(isNaN(s)||isNaN(o)){this.setAttribute(t,"0,0");return}this.position={x:s,y:o}}}connectedCallback(){w["v-node"].forEach(t=>{this.addEventListener(t,this)})}handleEvent(t){t.type=="pointerdown"&&this.parentElement?.appendChild(this)}#o(){this.#i.innerHTML=`:host {
	--x: ${this.position.x};
	--y: ${this.position.y};
}`}get canvas(){if(this.#t)return this.#t;try{return this.#t=p("v-canvas",this)}catch(t){throw this.remove(),t}}get position(){return this.#s}set position({x:t,y:e}){t==this.#s.x&&e==this.#s.y||(this.#s={x:t,y:e},this.#o())}}class T extends HTMLElement{#t=document.createElement("style");#i;#s={left:0,top:0,width:0,height:0};#o=[];#e={container:u("svg"),path:u("path").set("fill","transparent").set("stroke","currentColor"),width:0,height:0};constructor(){super(),this.attachShadow({mode:"open"});const t=h["v-edge"].content.cloneNode(!0);this.#n(),t.insertBefore(this.#t,t.firstChild),this.#e.container.appendChild(this.#e.path),t.appendChild(this.#e.container),this.shadowRoot.appendChild(t)}static get observedAttributes(){return l["v-edge"]}attributeChangedCallback(t,e,i){if(t==="path"){if(!i)return;const s=i.split(","),o=s.join();if(o!=i){this.setAttribute("path",o);return}if(s.length<2){this.removeAttribute("path");return}this.#o=s}}connectedCallback(){this.canvas.registerEdge(this),this.updateBoundingRect(),this.updatePath()}disconnectedCallback(){this.canvas.unregisterEdge(this)}#n(){this.#t.innerHTML=`:host {
	--left: ${this.#s.left}px;
	--top: ${this.#s.top}px;
	--width: ${this.#s.width}px;
	--height: ${this.#s.height}px;
}`}#r(t,e){t==this.#e.width&&e==this.#e.height||(this.#e.width=t,this.#e.height=e,this.#e.container.set("width",`${t}`).set("height",`${e}`).set("viewBox",`0 0 ${t} ${e}`))}updatePath(){const{canvas:t}=this;let e="";const{top:i,left:s}=this.#s;for(const o of this.#o){const r=t.getPinElementByUid(o);if(!r)continue;const{center:{x:d,y:c}}=r;e+=`${e==""?"M":"L"} ${d-s} ${c-i}`}this.#e.path.set("d",e)}get canvas(){if(this.#i)return this.#i;try{return this.#i=p("v-canvas",this)}catch(t){throw this.remove(),t}}updateBoundingRect(){let t=1/0,e=1/0,i=-1/0,s=-1/0;const{canvas:o}=this;for(const c of this.#o){const v=o.getPinElementByUid(c);if(!v)continue;const{position:{x:g,y:f},size:m}=v;t=Math.min(t,g),e=Math.min(e,f),i=Math.max(i,g+m),s=Math.max(s,f+m)}const r=i-t,d=s-e;this.#s={top:e,left:t,width:r,height:d},this.#n(),this.#r(r,d)}}class k extends HTMLElement{textNode=document.createTextNode("");constructor(){super(),this.attachShadow({mode:"open"});const t=h["v-label"].content.cloneNode(!0);t.appendChild(this.textNode),this.shadowRoot.appendChild(t)}static get observedAttributes(){return l["v-label"]}attributeChangedCallback(t,e,i){t=="text"&&(this.textNode.textContent=i)}}export function defineFlowViewCustomElements(){customElements.define("v-canvas",R),customElements.define("v-node",P),customElements.define("v-pin",M),customElements.define("v-edge",T),customElements.define("v-label",k),customElements.define("v-row",V),customElements.define("v-col",S)}
