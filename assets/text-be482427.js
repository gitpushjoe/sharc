(function(){"use strict";function f(h,e){return{x:h,y:e}}function _(h){return`rgba(${h.red}, ${h.green}, ${h.blue}, ${h.alpha})`}function i(h,e,t,s=1){return{red:h,green:e,blue:t,alpha:s}}function m(h,e,t,s){return{x1:h,y1:e,x2:t,y2:s}}function W(h,e,t,s){return{x1:h,y1:e,x2:h+t,y2:e+s}}function E(h,e){return f(e.x-h.x1-(h.x2-h.x1)/2,e.y-h.y1-(h.y2-h.y1)/2)}function I(h){return m(E(h,f(h.x1,h.y1)).x,E(h,f(h.x1,h.y1)).y,E(h,f(h.x2,h.y2)).x,E(h,f(h.x2,h.y2)).y)}function c(h,e,t,s=console.error){const r=[];for(let n=0;n<h[e].length;n++){const o=h[e][n],a=o(...t);if(a!==void 0&&a!=1&&a!=0){const l=(()=>{try{return JSON.stringify(a)}catch{return a.toString()}})();s(`WARNING: Event listener ${e.toString()} returned non-meaningful value ${l}, ignored.
Event listeners should only return true (or 1), false (or 0), or undefined (including implicit return).`)}a==1&&r.push(o)}h[e]=h[e].filter(n=>!r.includes(n))}const F={LINEAR:h=>h,EASE_IN:h=>1-Math.pow(1-h,2),EASE_OUT:h=>h*h,EASE_IN_OUT:h=>h<.5?2*h*h:1-Math.pow(-2*h+2,2)/2,EASE_IN_CUBIC:h=>1-Math.pow(1-h,3),EASE_OUT_CUBIC:h=>h*h*h,EASE_IN_OUT_CUBIC:h=>h<.5?4*Math.pow(h,3):1-Math.pow(-2*h+2,3)/2,Bounce:h=>e=>e<.5?h(e*2):h(2*(1-e))},S={AliceBlue:i(240,248,255),AntiqueWhite:i(250,235,215),Aqua:i(0,255,255),Aquamarine:i(127,255,212),Azure:i(240,255,255),Beige:i(245,245,220),Bisque:i(255,228,196),Black:i(0,0,0),BlanchedAlmond:i(255,235,205),Blue:i(0,0,255),BlueViolet:i(138,43,226),Brown:i(165,42,42),BurlyWood:i(222,184,135),CadetBlue:i(95,158,160),Chartreuse:i(127,255,0),Chocolate:i(210,105,30),Coral:i(255,127,80),CornflowerBlue:i(100,149,237),Cornsilk:i(255,248,220),Crimson:i(220,20,60),Cyan:i(0,255,255),DarkBlue:i(0,0,139),DarkCyan:i(0,139,139),DarkGoldenRod:i(184,134,11),DarkGray:i(169,169,169),DarkGreen:i(0,100,0),DarkKhaki:i(189,183,107),DarkMagenta:i(139,0,139),DarkOliveGreen:i(85,107,47),Darkorange:i(255,140,0),DarkOrchid:i(153,50,204),DarkRed:i(139,0,0),DarkSalmon:i(233,150,122),DarkSeaGreen:i(143,188,143),DarkSlateBlue:i(72,61,139),DarkSlateGray:i(47,79,79),DarkTurquoise:i(0,206,209),DarkViolet:i(148,0,211),DeepPink:i(255,20,147),DeepSkyBlue:i(0,191,255),DimGray:i(105,105,105),DodgerBlue:i(30,144,255),FireBrick:i(178,34,34),FloralWhite:i(255,250,240),ForestGreen:i(34,139,34),Fuchsia:i(255,0,255),Gainsboro:i(220,220,220),GhostWhite:i(248,248,255),Gold:i(255,215,0),GoldenRod:i(218,165,32),Gray:i(128,128,128),Green:i(0,128,0),GreenYellow:i(173,255,47),HoneyDew:i(240,255,240),HotPink:i(255,105,180),IndianRed:i(205,92,92),Indigo:i(75,0,130),Ivory:i(255,255,240),Khaki:i(240,230,140),Lavender:i(230,230,250),LavenderBlush:i(255,240,245),LawnGreen:i(124,252,0),LemonChiffon:i(255,250,205),LightBlue:i(173,216,230),LightCoral:i(240,128,128),LightCyan:i(224,255,255),LightGoldenRodYellow:i(250,250,210),LightGrey:i(211,211,211),LightGreen:i(144,238,144),LightPink:i(255,182,193),LightSalmon:i(255,160,122),LightSeaGreen:i(32,178,170),LightSkyBlue:i(135,206,250),LightSlateGray:i(119,136,153),LightSteelBlue:i(176,196,222),LightYellow:i(255,255,224),Lime:i(0,255,0),LimeGreen:i(50,205,50),Linen:i(250,240,230),Magenta:i(255,0,255),Maroon:i(128,0,0),MediumAquaMarine:i(102,205,170),MediumBlue:i(0,0,205),MediumOrchid:i(186,85,211),MediumPurple:i(147,112,216),MediumSeaGreen:i(60,179,113),MediumSlateBlue:i(123,104,238),MediumSpringGreen:i(0,250,154),MediumTurquoise:i(72,209,204),MediumVioletRed:i(199,21,133),MidnightBlue:i(25,25,112),MintCream:i(245,255,250),MistyRose:i(255,228,225),Moccasin:i(255,228,181),NavajoWhite:i(255,222,173),Navy:i(0,0,128),OldLace:i(253,245,230),Olive:i(128,128,0),OliveDrab:i(107,142,35),Orange:i(255,165,0),OrangeRed:i(255,69,0),Orchid:i(218,112,214),PaleGoldenRod:i(238,232,170),PaleGreen:i(152,251,152),PaleTurquoise:i(175,238,238),PaleVioletRed:i(216,112,147),PapayaWhip:i(255,239,213),PeachPuff:i(255,218,185),Peru:i(205,133,63),Pink:i(255,192,203),Plum:i(221,160,221),PowderBlue:i(176,224,230),Purple:i(128,0,128),Red:i(255,0,0),RosyBrown:i(188,143,143),RoyalBlue:i(65,105,225),SaddleBrown:i(139,69,19),Salmon:i(250,128,114),SandyBrown:i(244,164,96),SeaGreen:i(46,139,87),SeaShell:i(255,245,238),Sienna:i(160,82,45),Silver:i(192,192,192),SkyBlue:i(135,206,235),SlateBlue:i(106,90,205),SlateGray:i(112,128,144),Snow:i(255,250,250),SpringGreen:i(0,255,127),SteelBlue:i(70,130,180),Tan:i(210,180,140),Teal:i(0,128,128),Thistle:i(216,191,216),Tomato:i(255,99,71),Turquoise:i(64,224,208),Violet:i(238,130,238),Wheat:i(245,222,179),White:i(255,255,255),WhiteSmoke:i(245,245,245),Yellow:i(255,255,0),YellowGreen:i(154,205,50),None:i(0,0,0,0),Transparent:i(0,0,0,0)},C={loop:!1,iterations:1,delay:0};class A{constructor(){this.queue=[],this.index=0,this.step=0}currentPackage(){return this.queue[0]}currentAnimation(){var e;return(e=this.currentPackage())==null?void 0:e.animations[this.index%this.currentPackage().animations.length]}queueIsEmpty(){return this.queue.length===0}stepForward(){return this.queueIsEmpty()?null:(this.step++,this.step>this.currentAnimation().delay+this.currentAnimation().duration+this.currentPackage().params.delay&&(this.step=0,this.index++,this.index>=this.currentPackage().animations.length*this.currentPackage().params.iterations&&(this.index=0,this.currentPackage().params.loop?this.step=0:this.queue.shift()),this.queue.length===0)?(this.index=0,this.step=0,null):this.step<this.currentAnimation().delay+this.currentPackage().params.delay?null:(this.currentAnimation().frame=Math.max(this.step-this.currentAnimation().delay-this.currentPackage().params.delay,0),this.currentAnimation().channel=this.index,this.currentAnimation()))}verifyAnimations(e,t=C){const[s,r,n]=[!!t.loop,t.iterations??1,t.delay??0];if(Array.isArray(e)||(e=[e]),e.length!==0){for(let o=0;o<e.length;o++){const a=e[o];if(a.delay??(a.delay=0),a.duration??(a.duration=60),a.easing??(a.easing=l=>l),a.name??(a.name=""),a.duration<=0)throw new Error("Animation duration must be greater than 0");a.delay<0&&(a.delay=0)}return{animations:e,params:{loop:s,iterations:r,delay:n}}}}push(e,t=C){const s=this.verifyAnimations(e,t);return s&&this.queue.push(s),this}unshift(e,t=C){const s=this.verifyAnimations(e,t);return s&&(this.queue.unshift(s),this.step=0,this.index=0),this}shift(){return this.queue.shift()}pop(){return this.queue.pop()}shiftAnimation(){var t,s;const e=(t=this.currentPackage())==null?void 0:t.animations.shift();return((s=this.currentPackage())==null?void 0:s.animations.length)===0&&this.queue.shift(),e}popAnimation(){var t,s;const e=(t=this.currentPackage())==null?void 0:t.animations.pop();return((s=this.currentPackage())==null?void 0:s.animations.length)===0&&this.queue.pop(),e}enqueue(e,t=1,s=C){return this.currentPackage()===void 0?(this.push(e,s),this):t===0?(this.clear(),this.push(e,s),this):t<=this.queue.length?(this.queue[t]=this.verifyAnimations(e,s),this):(this.push(e,s),this)}clear(){return this.queue=[],this.index=0,this.step=0,this}get animations(){return[...this.queue]}}class G{constructor(){this._children=[],this._parent=void 0,this._region=new Path2D,this.events=void 0,this.currentFrame=0,this.name="",this.details=void 0,this.channelCount=1,this.channels=[]}addChild(e){return this._children.push(e.removeSelf()),e._parent=this,this}addChildren(...e){return e.forEach(t=>this.addChild(t)),this}removeChild(e){const t=this._children.indexOf(e);if(t!==-1)return this._children.splice(t,1),e._parent=void 0,e}removeChildren(...e){const t=[];return e.forEach(s=>{const r=this._children.indexOf(s);r!==-1&&(this._children.splice(r,1),s._parent=void 0,t.push(s))}),t}removeAllChildren(){return this.removeChildren(...this._children)}removeSelf(){var e;return(e=this._parent)==null||e.removeChild(this),this}get children(){return[...this._children]}get descendants(){return this._children.reduce((e,t)=>e.concat(t,t.descendants),[])}get parent(){return this._parent}get root(){return this._parent?this._parent.root:this}findChild(e){return this._children.find(t=>t.name===e)}findDescendant(e){return this._children.find(t=>t.name===e)??this._children.reduce((t,s)=>t??s.findDescendant(e),void 0)}findChildren(e){return this._children.filter(t=>t.name===e)}findDescendants(e){return this._children.reduce((t,s)=>(s.name===e&&t.push(s),t.concat(s.findDescendants(e))),[])}findChildWhere(e){return this._children.find(e)}findDescendantWhere(e){return this._children.find(e)??this._children.reduce((t,s)=>t??s.findDescendantWhere(e),void 0)}findChildrenWhere(e){return this._children.filter(e)}findDescendantsWhere(e){return this._children.reduce((t,s)=>(e(s)&&t.push(s),t.concat(s.findDescendantsWhere(e))),[])}removeChildWhere(e){var t;return(t=this._children.find(e))==null?void 0:t.removeSelf()}removeDescendantWhere(e){const t=this._children.find(e);return t?(this.removeChild(t),t):this._children.reduce((s,r)=>s??r.removeDescendantWhere(e),void 0)}removeChildrenWhere(e){const t=[];return this._children=this._children.filter(s=>e(s)?(t.push(s),!1):!0),t}removeDescendantsWhere(e){const t=[];return this._children=this._children.filter(s=>(t.push(...s.removeDescendantsWhere(e)),e(s)?(t.push(s),!1):!0)),t}bringForward(){if(this._parent){const e=this._parent._children.indexOf(this);if(e==this._parent._children.length-1)return this;this._parent._children.splice(e,1),this._parent._children.splice(e+1,0,this)}return this}sendBackward(){if(this._parent){const e=this._parent._children.indexOf(this);if(e===0)return this;this._parent._children.splice(e,1),this._parent._children.splice(e-1,0,this)}return this}bringToFront(){var e;return(e=this._parent)==null||e.addChild(this),this}sendToBack(){const e=this._parent;return e&&(e._children.unshift(this.removeSelf()),this._parent=e),this}}class R extends G{get bounds(){return m(this.x1,this.y1,this.x2,this.y2)}set bounds(e){this.x1=e.x1,this.y1=e.y1,this.x2=e.x2,this.y2=e.y2}get color(){return i(this.red,this.green,this.blue)}set color(e){this.red=e.red,this.green=e.green,this.blue=e.blue}get scale(){return f(this.scaleX,this.scaleY)}set scale(e){this.scaleX=e.x,this.scaleY=e.y}get corner1(){return f(this.x1,this.y1)}set corner1(e){this.x1=e.x,this.y1=e.y}get corner2(){return f(this.x2,this.y2)}set corner2(e){this.x2=e.x,this.y2=e.y}get width(){return Math.abs(this.x2-this.x1)}set width(e){const t=(this.x1+this.x2)/2;this.x1=t-e/2,this.x2=t+e/2}get height(){return Math.abs(this.y2-this.y1)}set height(e){const t=(this.y1+this.y2)/2;this.y1=t-e/2,this.y2=t+e/2}get centerX(){return(this.x1+this.x2)/2}set centerX(e){const t=this.width;this.x1=e-t/2,this.x2=e+t/2}get centerY(){return(this.y1+this.y2)/2}set centerY(e){const t=this.height;this.y1=e-t/2,this.y2=e+t/2}get center(){return f(this.centerX,this.centerY)}set center(e){this.centerX=e.x,this.centerY=e.y}addEventListener(e,t){return this.eventListeners[e].push(t),this}on(e,t){return this.addEventListener(e,t)}removeEventListener(e,t){return t?(this.eventListeners[e]=this.eventListeners[e].filter(s=>s!==t),this):(this.eventListeners[e]=[],this)}includeEventListener(e,t){return this.removeEventListener(e,t),this.addEventListener(e,t),this}constructor(e){var t,s,r,n,o,a,l,v,u,d;super(),this.drawFunction=()=>{},this.rootPointerEventCallback=()=>{},this._region=new Path2D,this.currentFrame=0,this.rotation=0,this.alpha=1,this.gradient=null,this.effects=()=>{},this.name="",this.enabled=!0,this.channelCount=1,this.details=void 0,this.red=0,this.green=0,this.blue=0,this.colorAlpha=1,this.x1=0,this.y1=0,this.x2=0,this.y2=0,this.scaleX=1,this.scaleY=1,this.blur=0,this.pointerId=void 0,this.hovered=!1,this.eventListeners={click:[],drag:[],hover:[],hoverEnd:[],hold:[],release:[],keydown:[],keyup:[],scroll:[],beforeDraw:[],animationFinish:[]},this.events={stage:void 0},this.name=e.name??"",this.enabled=e.enabled??!0,this.rotation=e.rotation??this.rotation,this.alpha=e.alpha??this.alpha,this.gradient=e.gradient??this.gradient,this.effects=e.effects??this.effects,this.red=((t=e.color)==null?void 0:t.red)??this.red,this.green=((s=e.color)==null?void 0:s.green)??this.green,this.blue=((r=e.color)==null?void 0:r.blue)??this.blue,this.colorAlpha=((n=e.color)==null?void 0:n.alpha)??this.colorAlpha,this.x1=((o=e.bounds)==null?void 0:o.x1)??this.x1,this.y1=((a=e.bounds)==null?void 0:a.y1)??this.y1,this.x2=((l=e.bounds)==null?void 0:l.x2)??this.x2,this.y2=((v=e.bounds)==null?void 0:v.y2)??this.y2,this.scaleX=((u=e.scale)==null?void 0:u.x)??this.scaleX,this.scaleY=((d=e.scale)==null?void 0:d.y)??this.scaleY,this.channelCount=e.channelCount??this.channelCount,this.details=e.details,this.channels=Array.from({length:this.channelCount},()=>new A)}draw(e,t,s){if(!this.enabled)return;if(s=s??!0,s&&(this.rootPointerEventCallback=()=>{}),this.currentFrame++,this.animate(),e.save(),this.effects(e),e.globalAlpha=this.alpha,e.translate(Math.min(this.x1,this.x2)+this.width/2,Math.min(this.y1,this.y2)+this.height/2),e.fillStyle=this.gradient?this.gradient:_({red:this.red,green:this.green,blue:this.blue,alpha:this.colorAlpha}),this.rotation!==0&&e.rotate(this.rotation*Math.PI/180),(this.scaleX!==1||this.scaleY!==1)&&e.scale(this.scaleX,this.scaleY),this.blur!==0&&(e.filter=`blur(${this.blur}px)`),this.events.stage){const n=this.events.stage;c(this.eventListeners,"beforeDraw",[this,n.currentFrame,this.events.stage])}const r=this.drawFunction(e,t);r!==void 0&&(this._region=r),this._children.forEach(n=>{n.events=this.events,n.draw(e,void 0,!1)}),this.handlePointerEvents(e)||e.restore(),this.pointerId!==void 0&&c(this.eventListeners,"hold",[this]),s&&this.rootPointerEventCallback()}handlePointerEvents(e){var n,o,a,l,v,u;let t=!1;if(this.events===void 0||!this.events.down&&!this.events.up&&!this.events.move&&!this.events.scroll&&!this.events.keydown&&!this.events.keyup||[this.eventListeners.click,this.eventListeners.drag,this.eventListeners.hold,this.eventListeners.hover,this.eventListeners.hoverEnd,this.eventListeners.keydown,this.eventListeners.keyup,this.eventListeners.release].every(d=>d.length===0))return!1;const s=[this.events.down,this.events.up,this.events.move].every(d=>d===void 0||this.pointIsInPath(e,d.translatedPoint.x,d.translatedPoint.y));if(this.eventListeners.hover.length>0&&!this.hovered&&s)c(this.eventListeners,"hover",[this,((n=this.events.move)==null?void 0:n.translatedPoint)??((o=this.events.down)==null?void 0:o.translatedPoint)??this.events.up.translatedPoint,((a=this.events.move)==null?void 0:a.event)??((l=this.events.down)==null?void 0:l.event)??this.events.up.event]),this.hovered=!0;else if(!s&&this.hovered){if(this.eventListeners.hoverEnd.length>0){const d=[this.events.down,this.events.up,this.events.move].find(y=>y!==void 0&&!this.pointIsInPath(e,y.translatedPoint.x,y.translatedPoint.y));c(this.eventListeners,"hoverEnd",[this,d.translatedPoint,d.event])}this.hovered=!1}this.name!==""&&((v=this.events)!=null&&v.keydown&&this.eventListeners.keydown.length>0&&this.events.stage.keyTarget===this.name&&c(this.eventListeners,"keydown",[this,this.events.keydown]),(u=this.events)!=null&&u.keyup&&this.eventListeners.keyup.length>0&&this.events.stage.keyTarget===this.name&&c(this.eventListeners,"keyup",[this,this.events.keyup]),this.events.scroll&&this.eventListeners.scroll.length>0&&s&&this.events.stage.scrollTarget===this.name&&c(this.eventListeners,"scroll",[this,this.events.scroll]));const r=(d,y,L,p,x,b)=>{const{event:$,translatedPoint:N}=y,z=d.getTransform().inverse().transformPoint(N),k=d.getTransform(),J=function(D){d.save(),d.setTransform(k.a,k.b,k.c,k.d,k.e,k.f),c(p.eventListeners,x,[p,z,$]),D!==void 0&&(p.pointerId=D),d.restore()};x===void 0?L.rootPointerEventCallback=(function(D){D!==void 0&&(p.pointerId=D)}).bind(this,b):L.rootPointerEventCallback=J.bind(this,b)};if(this.events.move&&!this.events.up&&!this.events.down&&this.pointerId!==void 0&&this.eventListeners.drag.length>0&&(e.restore(),t=!0,r(e,this.events.move,this.root,this,"drag",this.pointerId)),this.events.up){if(e.restore(),t=!0,this.eventListeners.release.length>0&&this.pointerId!==void 0){const d=this.events.up;r(e,d,this.root,this,"release")}this.pointerId=void 0}else if(this.events.down&&s){e.restore(),t=!0;const d=this.events.down;this.eventListeners.click.length>0?r(e,d,this.root,this,"click",d.event.pointerId):r(e,d,this.root,this,void 0,d.event.pointerId)}return t}pointIsInPath(e,t,s){return e.isPointInPath(this._region,t,s)}static initializeProps(e){return{color:e.color??i(0,0,0),alpha:e.alpha??1,rotation:e.rotation??0,scale:e.scale??f(1,1),bounds:e.bounds??m(0,0,0,0),name:e.name??"",effects:e.effects??(()=>{})}}logHierarchy(e=0){const t=this.name===""?this.constructor.name:this.name,s=[this.red,this.green,this.blue].every(o=>o<25)?125:this.red,r=[this.red,this.green,this.blue].every(o=>o<25)?125:this.green,n=[this.red,this.green,this.blue].every(o=>o<25)?125:this.blue;console.log(`%c${"	".repeat(e)} ⌞${t} 	{ ${this.constructor.name} @ (${this.x1}, ${this.y1}) (${this.x2}, ${this.y2}) }`,`color: ${_(i(s,r,n))}; font-weight: bold;`),this._children.forEach(o=>o.logHierarchy(e+1))}distribute(e,t={loop:!1,iterations:1,delay:0}){if(e.length>this.channels.length)throw new Error(`Cannot distribute ${e.length} animations to ${this.channels.length} channels`);for(let s=0;s<e.length;s++){const r=e[s];this.channels[s%this.channels.length].push(r,t)}return this}set(e,t){return this[e]=t,!0}animate(){const e=this.channels.map(t=>t.stepForward()).filter(t=>t!==null);for(const t of e.reverse())this.animateProperty(t);return this}animateProperty(e){if((e._from===void 0||e.frame===0)&&(e.from===null?e._from=this[e.property]:e._from=e.from),e._to===void 0||e.frame===0)if(typeof e.to=="function"){const a=e.to;e._to=a(e._from)}else e._to=e.to;const[t,s,r,n,o]=[e._from,e._to,e.frame??0,e.duration,e.easing];if(typeof this[e.property]=="number"&&typeof t=="number"&&typeof s=="number")this.set(e.property,t+o(r/n)*(s-t));else if(typeof this[e.property]=="object"){(typeof t!="object"||typeof s!="object")&&this.raiseAnimationError(t,s,e.property);const a={...s};for(const l of Object.keys(s)){const v=t[l],u=s[l];(v===void 0||u===void 0)&&this.raiseAnimationError(t,s,l),a[l]=v+o(r/n)*(u-v)}this.set(e.property,a)}else throw new Error(`Property ${e.property} is not a valid property`);e.frame===e.duration&&c(this.eventListeners,"animationFinish",[this,e])}raiseAnimationError(e,t,s){throw new Error(`${e} -> ${t} is not a valid animation for property ${s}`)}setPointerEvents(e){return this.events=e,this}r_setPointerEvents(e){return this.setPointerEvents(e),this._children.forEach(t=>t.r_setPointerEvents(e)),this}createChannels(e){return this.channels.push(...Array.from({length:e},()=>new A)),this}schedule(e,t){const s=(r,n,o)=>{if(n>=e)return t(r,n,o),1};return this.addEventListener("beforeDraw",s),s}selfSchedule(e,t){const s=(r,n,o)=>{if(r.currentFrame>=e)return t(r,n,o),1};return this.addEventListener("beforeDraw",s),s}scheduleExactly(e,t){const s=(r,n,o)=>{if(n===e)return t(r,n,o),1};return this.addEventListener("beforeDraw",s),s}selfScheduleExactly(e,t){const s=(r,n,o)=>{if(r.currentFrame===e)return t(r,n,o),1};return this.addEventListener("beforeDraw",s),s}delay(e,t){var n;const s=(n=this.root.stage)==null?void 0:n.currentFrame;if(s===void 0)throw new Error("Sprite must be attached to a stage to use delay");const r=(o,a,l)=>{if(a>=s+e)return t(o,a,l),1};return this.addEventListener("beforeDraw",r),r}selfDelay(e,t){const s=this.currentFrame,r=(n,o,a)=>{if(n.currentFrame>=s+e)return t(n,o,a),1};return this.addEventListener("beforeDraw",r),r}when(e,t){const s=(r,n,o)=>{if(e(r))return t(r,n,o)};return this.addEventListener("beforeDraw",s),s}whenStage(e,t){const s=(r,n,o)=>{if(e(o))return t(r,n,o)};return this.addEventListener("beforeDraw",s),s}hasEventListeners(){return Object.values(this.eventListeners).some(e=>e.length>0)}spriteOrChildrenHaveEventListeners(){return this.hasEventListeners()?!0:this._children.some(e=>e.spriteOrChildrenHaveEventListeners())}copy(){const e=structuredClone({...this,_children:void 0,_parent:void 0,_region:void 0,events:void 0,rootPointerEventCallback:void 0,drawFunction:void 0,effects:void 0,channels:void 0,eventListeners:void 0}),t=Object.create(Object.getPrototypeOf(this),Object.getOwnPropertyDescriptors(e));t.eventListeners={};for(const[s,r]of Object.entries(this.eventListeners))t.eventListeners[s]=r.map(n=>n.bind(t));return t.channels=this.channels.map(function(){return new A}),t._children=this._children.map(s=>s.copy()),t._parent=void 0,t.rootPointerEventCallback=()=>{},t.drawFunction=this.drawFunction,t.effects=this.effects.bind(t),t}}class Y extends R{constructor(e){var t,s,r,n;e.bounds=m(((t=e.position)==null?void 0:t.x)??0,((s=e.position)==null?void 0:s.y)??0,((r=e.position)==null?void 0:r.x)??0,((n=e.position)==null?void 0:n.y)??0),e.color={red:0,green:0,blue:0,alpha:0},e.position??(e.position=f(0,0)),super(e)}get position(){return f(this.positionX,this.positionY)}set position(e){this.positionX=e.x,this.positionY=e.y}get positionX(){return this.centerX}set positionX(e){this.x1=e,this.x2=e}get positionY(){return this.centerY}set positionY(e){this.y1=e,this.y2=e}pointIsInPath(){return!1}}class w extends R{constructor(e){var t,s,r,n,o,a,l,v,u,d,y,L,p,x,b;super(e),this.strokeRed=0,this.strokeGreen=0,this.strokeBlue=0,this.strokeAlpha=1,this.strokeWidth=1,this.strokeJoin="miter",this.strokeCap="butt",this.strokeDash=0,this.strokeDashGap=0,this.strokeOffset=0,this.strokeEnabled=!1,this.strokeRed=((s=(t=e.stroke)==null?void 0:t.color)==null?void 0:s.red)??0,this.strokeGreen=((n=(r=e.stroke)==null?void 0:r.color)==null?void 0:n.green)??0,this.strokeBlue=((a=(o=e.stroke)==null?void 0:o.color)==null?void 0:a.blue)??0,this.strokeAlpha=((v=(l=e.stroke)==null?void 0:l.color)==null?void 0:v.alpha)??1,this.strokeWidth=((u=e.stroke)==null?void 0:u.lineWidth)??1,this.strokeJoin=((d=e.stroke)==null?void 0:d.lineJoin)??"miter",this.strokeCap=((y=e.stroke)==null?void 0:y.lineCap)??"butt",this.strokeDash=((L=e.stroke)==null?void 0:L.lineDash)??0,this.strokeDashGap=((p=e.stroke)==null?void 0:p.lineDashGap)??((x=e.stroke)==null?void 0:x.lineDash)??0,this.strokeOffset=((b=e.stroke)==null?void 0:b.lineDashOffset)??0,this.strokeEnabled=e.stroke!==null&&e.stroke!==void 0}get stroke(){return this.strokeEnabled?{color:{red:this.strokeRed,green:this.strokeGreen,blue:this.strokeBlue,alpha:this.strokeAlpha},lineWidth:this.strokeWidth,lineJoin:this.strokeJoin,lineCap:this.strokeCap,lineDash:this.strokeDash,lineDashGap:this.strokeDashGap,lineDashOffset:this.strokeOffset}:null}set stroke(e){var t,s,r,n;this.strokeEnabled=e!==null,e!==null&&(this.strokeRed=((t=e.color)==null?void 0:t.red)??0,this.strokeGreen=((s=e.color)==null?void 0:s.green)??0,this.strokeBlue=((r=e.color)==null?void 0:r.blue)??0,this.strokeAlpha=((n=e.color)==null?void 0:n.alpha)??1,this.strokeWidth=e.lineWidth??1,this.strokeJoin=e.lineJoin??"miter",this.strokeCap=e.lineCap??"butt",this.strokeDash=e.lineDash??0,this.strokeDashGap=e.lineDashGap??e.lineDash??0,this.strokeOffset=e.lineDashOffset??0)}get strokeColor(){return{red:this.strokeRed,green:this.strokeGreen,blue:this.strokeBlue,alpha:this.strokeAlpha}}set strokeColor(e){this.strokeRed=e.red,this.strokeGreen=e.green,this.strokeBlue=e.blue,this.strokeAlpha=e.alpha}static strokeRegion(e,t,s){var r,n,o,a;t!=null&&t.lineWidth!==0&&(e.lineWidth=t.lineWidth??1,e.lineJoin=t.lineJoin??"miter",e.lineCap=t.lineCap??"round",e.strokeStyle=`rgba(${((r=t.color)==null?void 0:r.red)??0}, ${((n=t.color)==null?void 0:n.green)??0}, ${((o=t.color)==null?void 0:o.blue)??0}, ${((a=t.color)==null?void 0:a.alpha)??1})`,e.setLineDash([t.lineDash??0,t.lineDashGap??0]),e.lineDashOffset=t.lineDashOffset??0,s&&e.stroke(s))}draw(e,t){super.draw(e,{...t,stroke:this.strokeEnabled?{color:{red:this.strokeRed,green:this.strokeGreen,blue:this.strokeBlue,alpha:this.strokeAlpha},lineWidth:this.strokeWidth,lineJoin:this.strokeJoin,lineCap:this.strokeCap,lineDash:this.strokeDash,lineDashGap:this.strokeDashGap,lineDashOffset:this.strokeOffset}:null})}}class B extends w{constructor(e){super(e),this.radius=[0],this.drawFunction=B.drawFunction,this.radius=e.radius??[0]}draw(e){super.draw(e,{bounds:this.bounds,radius:this.radius})}static Bounds(e,t,s,r){return W(e,t,s,r)}}B.drawFunction=(h,e)=>{var s,r;const t=I(e.bounds??m(0,0,0,0));if(e.stroke===null||((s=e.stroke)==null?void 0:s.lineWidth)===0)if(e.radius&&e.radius[0]===0&&e.radius.length===1){const n=new Path2D;return n.rect(t.x1,t.y1,t.x2-t.x1,t.y2-t.y1),h.fill(n,"nonzero"),n}else{const n=new Path2D;return n.roundRect(t.x1,t.y1,t.x2-t.x1,t.y2-t.y1,e.radius),h.fill(n,"nonzero"),n}if(w.strokeRegion(h,e.stroke),((r=e.stroke)==null?void 0:r.lineDash)===0){const n=new Path2D;return n.roundRect(t.x1,t.y1,t.x2-t.x1,t.y2-t.y1,e.radius),h.fill(n,"nonzero"),h.stroke(n),n}else{const n=new Path2D;return n.roundRect(t.x1,t.y1,t.x2-t.x1,t.y2-t.y1,e.radius),h.fill(n,"nonzero"),h.stroke(n),n}};class g extends w{constructor(e){super(e),this.path=[],this.closePath=!1,this.fillRule="nonzero",this.startRatio=0,this.endRatio=1,this.drawFunction=g.drawFunction,this.path=e.path??[],this.closePath=e.closePath??!1,this.fillRule=e.fillRule??"nonzero",this.startRatio=e.startRatio??0,this.endRatio=e.endRatio??1;const t=g.getBoundsFromPath(this.path);this.x1=t.x1,this.y1=t.y1,this.x2=t.x2,this.y2=t.y2}get bounds(){return g.getBoundsFromPath(this.path)}set bounds(e){throw new Error("Bounds cannot be set on Path")}draw(e){const t=g.getBoundsFromPath(this.path);this.x1=t.x1,this.y1=t.y1,this.x2=t.x2,this.y2=t.y2,super.draw(e,{path:this.path,closePath:this.closePath,fillRule:this.fillRule,startRatio:this.startRatio,endRatio:this.endRatio})}static getPathSegment(e,t,s){if(t===0&&s===1)return e;if(t===s)return[];if(t>s)return g.getPathSegment(e,s,t).reverse();if(t<0||s>1)throw new Error("Start and end must be between 0 and 1");const r=e.map((v,u)=>g.calculateDistance(v,e[u+1]??e[0]));r.pop();const n=r.reduce((v,u)=>v+u,0),o=[];let a=0,l=0;for(const v of r){const u=v/n;if(l+u<t){l+=u,a++;continue}let d=0;l+u>t&&l<t&&(d=(t-l)*(1/u));let y=1;if(l+u>s&&l<s&&(y=(s-l)*(1/u)),l+u>t&&o.push(g.interpolate(e[a],e[a+1]??e[0],d)),l<s&&l+u>s)return o.push(g.interpolate(e[a],e[a+1]??e[0],y)),o;l+=u,a++}return s===1?o.concat(e[e.length-1]):o}static interpolate(e,t,s){return f(e.x+s*(t.x-e.x),e.y+s*(t.y-e.y))}static calculateDistance(e,t){return Math.sqrt(Math.pow(e.x-t.x,2)+Math.pow(e.y-t.y,2))}static getBoundsFromPath(e){return m(Math.min(...e.map(t=>t.x)),Math.min(...e.map(t=>t.y)),Math.max(...e.map(t=>t.x)),Math.max(...e.map(t=>t.y)))}}g.drawFunction=(h,e)=>{var r;let t=((r=e.path)==null?void 0:r.map(n=>E(g.getBoundsFromPath(e.path??[]),n)))??[];if(t=g.getPathSegment(t,e.startRatio??0,e.endRatio??1),t.length===0)return new Path2D;const s=new Path2D;s.moveTo(t[0].x,t[0].y);for(const n of t.slice(1))s.lineTo(n.x,n.y);return e.closePath&&s.closePath(),h.fill(s,e.fillRule??"nonzero"),w.strokeRegion(h,e.stroke,s),s};class P extends w{constructor(e){var t,s;super(e),this.text="",this.positionIsCenter=!1,this.font="sans-serif",this.fontSize=16,this.bold=!1,this.italic=!1,this.textAlign="start",this.textBaseline="alphabetic",this.textDirection="inherit",this.maxWidth=null,this.positionX=0,this.positionY=0,this.drawFunction=P.drawFunction,this.text=e.text??"",this.positionX=((t=e.position)==null?void 0:t.x)??0,this.positionY=((s=e.position)==null?void 0:s.y)??0,this.positionIsCenter=e.positionIsCenter??!1,this.font=e.font??"sans-serif",this.fontSize=e.fontSize??16,this.textAlign=e.textAlign??"start",this.textBaseline=e.textBaseline??"alphabetic",this.textDirection=e.textDirection??"inherit",this.maxWidth=e.maxWidth??null,this.bold=e.bold??!1,this.italic=e.italic??!1}get position(){return f(this.positionX,this.positionY)}set position(e){this.positionX=e.x,this.positionY=e.y}draw(e){var o,a;((o=this.root.stage)==null?void 0:o.rootStyle)==="centered"&&(this.scaleY*=-1),e.font=`${this.bold?"bold ":""}${this.italic?"italic ":""}${this.fontSize}px ${this.font}`,e.textAlign=this.textAlign,e.textBaseline=this.textBaseline,e.direction=this.textDirection;const t=e.measureText(this.text),s=t.width,r=t.actualBoundingBoxAscent,n=this.fontSize;this.positionIsCenter?(this.x1=this.positionX-s/2,this.y1=this.positionY-n/2+(this.fontSize-r),this.x2=this.positionX+s/2,this.y2=this.positionY+n/2):(this.x1=this.positionX,this.y1=this.positionY,this.x2=this.positionX+s,this.y2=this.positionY+n),super.draw(e,{text:this.text,position:f(this.positionX,this.positionY),font:this.font,fontSize:this.fontSize,textAlign:this.textAlign,textBaseline:this.textBaseline,textDirection:this.textDirection,maxWidth:this.maxWidth,bold:this.bold,italic:this.italic,positionIsCenter:this.positionIsCenter}),((a=this.root.stage)==null?void 0:a.rootStyle)==="centered"&&(this.scaleY*=-1)}}P.drawFunction=(h,e)=>{var l;const{text:t,maxWidth:s}=e,r=h.measureText(t??""),n=r.width,o=r.actualBoundingBoxAscent+r.actualBoundingBoxDescent;h.fillText(t??"",-n/2,o/2,s??void 0),e.stroke!==null&&((l=e.stroke)==null?void 0:l.lineWidth)!==0&&(w.strokeRegion(h,e.stroke),h.strokeText(t??"",-n/2,o/2,s??void 0));const a=new Path2D;return a.moveTo(-n/2,-o/2),a.lineTo(n/2,-o/2),a.lineTo(n/2,o/2),a.lineTo(-n/2,o/2),a.closePath(),a};class T extends Y{constructor(e,t){super(t),this.stage=e}}class X{constructor(e,t="centered",s=S.White,r,n=!1){if(this.canvas=e,this.rootStyle=t,this.bgColor=s,this.active=!1,this.nextRenderTime=void 0,this.frameRate=60,this.lastRenderMs=0,this.currentFrame=0,this.drawEvents={},this.keyTarget="",this.scrollTarget="",this.resetKeyTargetOnClick=!0,this.resetScrollTargetOnClick=!0,this.onError=(o,a)=>{a=a==null?void 0:a.slice(0,a==null?void 0:a.indexOf("FrameRequestCallback*")),console.error(`WorkerStage: ${(o==null?void 0:o.message)??"Error"}
${a??""}`)},this.eventListeners={beforeDraw:[],click:[],release:[],move:[],keydown:[],keyup:[],scroll:[]},!e)throw new Error("No canvas element provided");this._root=t==="classic"?new T(this,{}):new T(this,{position:f(this.width/2,this.height/2),scale:f(1,-1)}),e.oncontextmenu=()=>!1,e.style.touchAction="none",this.ctx=r??(n?void 0:e.getContext("2d"))}get root(){return this._root}addEventListener(e,t){return this.eventListeners[e].push(t),this}on(e,t){return this.addEventListener(e,t),this}removeEventListener(e,t){return t?(this.eventListeners[e]=this.eventListeners[e].filter(s=>s!==t),this):(this.eventListeners[e]=[],this)}includeEventListener(e,t){return this.removeEventListener(e,t),this.addEventListener(e,t),this}pointerDownHandler(e){var s;if(!this.active)return;e.preventDefault();const t=f((e.offsetX||e.pageX-this.canvas.offsetLeft)*this.scaleX-(this.rootStyle==="centered"?this.width/2:0),((e.offsetY||e.pageY-this.canvas.offsetTop)*this.scaleY-(this.rootStyle==="centered"?this.height/2:0))*(this.rootStyle==="centered"?-1:1));c(this.eventListeners,"click",[this,t,e]),this.drawEvents.down={event:e,translatedPoint:this.positionOnCanvas(this.canvas,e)},(s=this.canvas)!=null&&s.focus&&this.canvas.focus()}pointerUpHandler(e){if(!this.active)return;e.preventDefault();const t=f((e.offsetX||e.pageX-this.canvas.offsetLeft)*this.scaleX-(this.rootStyle==="centered"?this.width/2:0),((e.offsetY||e.pageY-this.canvas.offsetTop)*this.scaleY-(this.rootStyle==="centered"?this.height/2:0))*(this.rootStyle==="centered"?-1:1));c(this.eventListeners,"release",[this,t,e]),this.drawEvents.up={event:e,translatedPoint:this.positionOnCanvas(this.canvas,e)}}pointerMoveHandler(e){if(!this.active)return;e.preventDefault();const t=f((e.offsetX||e.pageX-this.canvas.offsetLeft)*this.scaleX-(this.rootStyle==="centered"?this.width/2:0),((e.offsetY||e.pageY-this.canvas.offsetTop)*this.scaleY-(this.rootStyle==="centered"?this.height/2:0))*(this.rootStyle==="centered"?-1:1));c(this.eventListeners,"move",[this,t,e]),this.drawEvents.move={event:e,translatedPoint:this.positionOnCanvas(this.canvas,e)}}keydownHandler(e){this.active&&(e.preventDefault(),c(this.eventListeners,"keydown",[this,e]),this.drawEvents.keydown=e)}keyupHandler(e){this.active&&(e.preventDefault(),c(this.eventListeners,"keyup",[this,e]),this.drawEvents.keyup=e)}wheelHandler(e){this.active&&(c(this.eventListeners,"scroll",[this,e]),this.drawEvents.scroll=e,e.preventDefault())}positionOnCanvas(e,t){return f((t.offsetX||t.clientX-e.getBoundingClientRect().left)*e.width/e.clientWidth,(t.offsetY||t.clientY-e.getBoundingClientRect().top)*e.height/e.clientHeight)}loop(e=60){return this.stop(),this.canvas.addEventListener("pointerdown",this.pointerDownHandler.bind(this)),this.canvas.addEventListener("pointerup",this.pointerUpHandler.bind(this)),this.canvas.addEventListener("pointermove",this.pointerMoveHandler.bind(this)),this.canvas.addEventListener("wheel",this.wheelHandler.bind(this)),this.canvas.addEventListener("keydown",this.keydownHandler.bind(this)),this.canvas.addEventListener("keyup",this.keyupHandler.bind(this)),this.active=!0,this.frameRate=e,this.nextRenderTime=performance.now(),this.currentFrame=0,requestAnimationFrame(this.drawLoop.bind(this)),this}drawLoop(){const e=performance.now();if(this.nextRenderTime&&e<this.nextRenderTime){requestAnimationFrame(this.drawLoop.bind(this));return}this.nextRenderTime=e+800/this.frameRate,this.active&&(this.draw(this.ctx),this.lastRenderMs=performance.now()-e,requestAnimationFrame(this.drawLoop.bind(this)))}draw(e){e??(e=this.ctx),c(this.eventListeners,"beforeDraw",[this,this.currentFrame,this]),this.root.setPointerEvents(this.drawEvents),e.fillStyle=_(this.bgColor),e.fillRect(0,0,this.width??0,this.height??0),this.drawEvents.stage=this;try{this.root.draw(e)}catch(t){return this.stop(),this.onError(t),!1}return this.drawEvents={stage:this},this.resetKeyTargetOnClick&&this.drawEvents.up&&this.keyTarget!==""&&this.root.findDescendants(this.keyTarget).some(t=>t.pointerId===void 0)&&(this.keyTarget=""),this.resetScrollTargetOnClick&&this.drawEvents.down&&this.scrollTarget!==""&&this.root.findDescendants(this.scrollTarget).some(t=>t.pointerId===void 0)&&(this.scrollTarget=""),this.currentFrame++,!0}stop(){return this.canvas.removeEventListener("pointerdown",this.pointerDownHandler.bind(this)),this.canvas.removeEventListener("pointerup",this.pointerUpHandler.bind(this)),this.canvas.removeEventListener("pointermove",this.pointerMoveHandler.bind(this)),this.canvas.removeEventListener("wheel",this.wheelHandler.bind(this)),this.canvas.removeEventListener("keydown",this.keydownHandler.bind(this)),this.canvas.removeEventListener("keyup",this.keyupHandler.bind(this)),this.active=!1,this}get width(){var e;return(e=this.canvas)==null?void 0:e.width}get height(){var e;return(e=this.canvas)==null?void 0:e.height}get scaleX(){return(this.width??0)/this.canvas.clientWidth}get scaleY(){return(this.height??0)/this.canvas.clientHeight}}const q={width:0,height:0,oncontextmenu:()=>!1,style:{touchAction:"none"},getContext:()=>null,offsetLeft:0,offsetTop:0,addEventListener:()=>{},clientWidth:0,clientHeight:0,getBoundingClientRect:()=>({top:0,left:0}),removeEventListener:()=>{},transferToImageBitmap:()=>{}};class H extends X{constructor(e,t="centered",s=S.White){const r=new OffscreenCanvas(1,1);super(q,t,s,r.getContext("2d")),this._postMessage=e,this.rootStyle=t,this.bgColor=s,this.eventListeners={beforeDraw:[],click:[],release:[],move:[],scroll:[],message:[],keyup:[],keydown:[]},this.onError=function(n){this.postMessage({type:"error",error:(n==null?void 0:n.message)??"Error",stack:(n==null?void 0:n.stack)??"No stack"})},this.informOffscreenOfStop=!0,this.onmessage=n=>{c(this.eventListeners,"message",[this,n.data],this.sendErrorString.bind(this));const o=n.data;switch(o.type){case"init":this.canvas.height=o.height,this.canvas.offsetLeft=0,this.canvas.offsetTop=0,this.offscreenCanvas.width=o.width,this.offscreenCanvas.height=o.height,this._root.position=this.rootStyle==="centered"?f(o.width/2,o.height/2):f(0,0),this.postMessage({type:"ready"}),this.loop();break;case"beginLoop":this.setStageState({...o.stageState,type:"stageState"}),this.loop(o.frameRate*1.25);break;case"stageState":this.setStageState(o);break;case"stopLoop":this.stop();break}},this.offscreenCanvas=r}addEventListener(e,t){return this.eventListeners[e].push(t),this}on(e,t){return this.addEventListener(e,t),this}removeEventListener(e,t){return t?(this.eventListeners[e]=this.eventListeners[e].filter(s=>s!==t),this):(this.eventListeners[e]=[],this)}includeEventListener(e,t){return this.removeEventListener(e,t),this.addEventListener(e,t),this}setStageState(e){var t,s,r,n,o,a;this.nextDrawEvents??(this.nextDrawEvents={}),(t=this.nextDrawEvents).up??(t.up=e.events.up),(s=this.nextDrawEvents).down??(s.down=e.events.down),(r=this.nextDrawEvents).move??(r.move=e.events.move),(n=this.nextDrawEvents).keydown??(n.keydown=e.events.keydown),(o=this.nextDrawEvents).keyup??(o.keyup=e.events.keyup),(a=this.nextDrawEvents).scroll??(a.scroll=e.events.scroll),this.canvas.width=e.canvasProperties.width,this.canvas.height=e.canvasProperties.height,this.canvas.offsetLeft=e.canvasProperties.offsetLeft,this.canvas.offsetTop=e.canvasProperties.offsetTop,this.canvas.clientWidth=e.canvasProperties.clientWidth,this.canvas.clientHeight=e.canvasProperties.clientHeight,this.canvas.getBoundingClientRect=()=>e.canvasProperties.boundingClientRect}sendErrorString(e){const t=new Error(e);this.onError(t)}draw(e){this.drawEvents=this.nextDrawEvents?JSON.parse(JSON.stringify(this.nextDrawEvents)):this.drawEvents,c(this.eventListeners,"beforeDraw",[this,this.currentFrame,this],this.sendErrorString.bind(this));const{down:t,up:s,move:r,keydown:n,keyup:o,scroll:a}=this.drawEvents;t&&c(this.eventListeners,"click",[this,{x:t.translatedPoint.x-(this.rootStyle==="centered"?this.canvas.width/2:0),y:(t.translatedPoint.y-(this.rootStyle==="centered"?this.canvas.height/2:0))*(this.rootStyle==="centered"?-1:1)},t.event],this.sendErrorString.bind(this)),s&&c(this.eventListeners,"release",[this,{x:s.translatedPoint.x-(this.rootStyle==="centered"?this.canvas.width/2:0),y:(s.translatedPoint.y-(this.rootStyle==="centered"?this.canvas.height/2:0))*(this.rootStyle==="centered"?-1:1)},s.event],this.sendErrorString.bind(this)),r&&c(this.eventListeners,"move",[this,{x:r.translatedPoint.x-(this.rootStyle==="centered"?this.canvas.width/2:0),y:(r.translatedPoint.y-(this.rootStyle==="centered"?this.canvas.height/2:0))*(this.rootStyle==="centered"?-1:1)},r.event],this.sendErrorString.bind(this)),n&&c(this.eventListeners,"keydown",[this,n],this.sendErrorString.bind(this)),o&&c(this.eventListeners,"keyup",[this,o],this.sendErrorString.bind(this)),a&&c(this.eventListeners,"scroll",[this,a],this.sendErrorString.bind(this)),this.resetKeyTargetOnClick&&this.drawEvents.up&&this.keyTarget!==""&&this.root.findDescendants(this.keyTarget).some(l=>l.pointerId===void 0)&&(this.keyTarget=""),this.resetScrollTargetOnClick&&this.drawEvents.down&&this.scrollTarget!==""&&this.root.findDescendants(this.scrollTarget).some(l=>l.pointerId===void 0)&&(this.scrollTarget="");try{super.draw(e)}catch(l){return this.onError(l),!1}return this.postMessage({type:"render",img:this.offscreenCanvas.transferToImageBitmap(),lastRenderMs:this.lastRenderMs,currentFrame:this.currentFrame}),this.nextDrawEvents=void 0,!0}postCustomMessage(e,t){this.postMessage({type:"custom",message:e},t)}postMessage(e,t){if(!t){this._postMessage(e);return}t.postMessage(e)}loop(e=60){return this.informOffscreenOfStop=!1,super.loop(e),this.informOffscreenOfStop=!0,this}stop(){return super.stop(),this.informOffscreenOfStop&&this.postMessage({type:"stopLoop",source:"worker"}),this}}const O=new H(postMessage.bind(null),"centered",S.LightSlateGray);onmessage=O.onmessage;const M=new P({text:"Hello, World!",fontSize:80,positionIsCenter:!0,bold:!0,color:S.White,effects:h=>{h.shadowColor="black",h.shadowBlur=15}});M.channels[0].push({property:"color",from:null,to:()=>({red:Math.random()*100+155,green:Math.random()*100+155,blue:Math.random()*100+155,alpha:1}),duration:120,easing:F.EASE_IN_OUT},{loop:!0}),O.root.addChild(M)})();
