"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[8913],{1007:(e,t,a)=>{a.d(t,{A:()=>i});let i=(0,a(9946).A)("user",[["path",{d:"M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2",key:"975kel"}],["circle",{cx:"12",cy:"7",r:"4",key:"17ys0d"}]])},2580:(e,t,a)=>{a.d(t,{A:()=>i});let i=(0,a(9946).A)("crosshair",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["line",{x1:"22",x2:"18",y1:"12",y2:"12",key:"l9bcsi"}],["line",{x1:"6",x2:"2",y1:"12",y2:"12",key:"13hhkx"}],["line",{x1:"12",x2:"12",y1:"6",y2:"2",key:"10w3f3"}],["line",{x1:"12",x2:"12",y1:"22",y2:"18",key:"15g9kq"}]])},2657:(e,t,a)=>{a.d(t,{A:()=>i});let i=(0,a(9946).A)("eye",[["path",{d:"M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",key:"1nclc0"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]])},2834:(e,t,a)=>{a.d(t,{mK:()=>M,E8:()=>k,s0:()=>g,nU:()=>A,fE:()=>S});var i=a(5155),n=a(2115),o=a(7431),r=a(1991),l=a(1004);function s(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}new o.Vector2,new o.Vector2;function c(e,t){if(!(e instanceof t))throw TypeError("Cannot call a class as a function")}var f=function e(t,a,i){var n=this;c(this,e),s(this,"dot2",function(e,t){return n.x*e+n.y*t}),s(this,"dot3",function(e,t,a){return n.x*e+n.y*t+n.z*a}),this.x=t,this.y=a,this.z=i},u=[new f(1,1,0),new f(-1,1,0),new f(1,-1,0),new f(-1,-1,0),new f(1,0,1),new f(-1,0,1),new f(1,0,-1),new f(-1,0,-1),new f(0,1,1),new f(0,-1,1),new f(0,1,-1),new f(0,-1,-1)],d=[151,160,137,91,90,15,131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,23,190,6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,88,237,149,56,87,174,20,125,136,171,168,68,175,74,165,71,134,139,48,27,166,77,146,158,231,83,111,229,122,60,211,133,230,220,105,92,41,55,46,245,40,244,102,143,54,65,25,63,161,1,216,80,73,209,76,132,187,208,89,18,169,200,196,135,130,116,188,159,86,164,100,109,198,173,186,3,64,52,217,226,250,124,123,5,202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42,223,183,170,213,119,248,152,2,44,154,163,70,221,153,101,155,167,43,172,9,129,22,39,253,19,98,108,110,79,113,224,232,178,185,112,104,218,246,97,228,251,34,242,193,238,210,144,12,191,179,162,241,81,51,145,235,249,14,239,107,49,192,214,31,181,199,106,157,184,84,204,176,115,121,50,45,127,4,150,254,138,236,205,93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180],h=Array(512),p=Array(512);!function(e){e>0&&e<1&&(e*=65536),(e=Math.floor(e))<256&&(e|=e<<8);for(var t,a=0;a<256;a++)t=1&a?d[a]^255&e:d[a]^e>>8&255,h[a]=h[a+256]=t,p[a]=p[a+256]=u[t%12]}(0);function v(e){var t=function(e){if("number"==typeof e)e=Math.abs(e);else if("string"==typeof e){var t=e;e=0;for(var a=0;a<t.length;a++)e=(e+(a+1)*(t.charCodeAt(a)%96))%0x7fffffff}return 0===e&&(e=311),e}(e);return function(){var e=48271*t%0x7fffffff;return t=e,e/0x7fffffff}}new function e(t){var a=this;c(this,e),s(this,"seed",0),s(this,"init",function(e){a.seed=e,a.value=v(e)}),s(this,"value",v(this.seed)),this.init(t)}(Math.random());o.BufferGeometry;a(4687);let m=(0,n.createContext)(null),y=e=>(2&e.getAttributes())==2,g=(0,n.memo)((0,n.forwardRef)(({children:e,camera:t,scene:a,resolutionScale:s,enabled:c=!0,renderPriority:f=1,autoClear:u=!0,depthBuffer:d,enableNormalPass:h,stencilBuffer:p,multisampling:v=8,frameBufferType:g=o.HalfFloatType},x)=>{let{gl:b,scene:w,camera:M,size:k}=(0,r.C)(),A=a||w,P=t||M,[S,E,C]=(0,n.useMemo)(()=>{let e=new l.s0(b,{depthBuffer:d,stencilBuffer:p,multisampling:v,frameBufferType:g});e.addPass(new l.AH(A,P));let t=null,a=null;return h&&((a=new l.Xe(A,P)).enabled=!1,e.addPass(a),void 0!==s&&((t=new l.SP({normalBuffer:a.texture,resolutionScale:s})).enabled=!1,e.addPass(t))),[e,a,t]},[P,b,d,p,v,g,A,h,s]);(0,n.useEffect)(()=>S?.setSize(k.width,k.height),[S,k]),(0,r.D)((e,t)=>{if(c){let e=b.autoClear;b.autoClear=u,p&&!u&&b.clearStencil(),S.render(t),b.autoClear=e}},c?f:0);let _=(0,n.useRef)(null);(0,n.useLayoutEffect)(()=>{let e=[],t=_.current.__r3f;if(t&&S){let a=t.children;for(let t=0;t<a.length;t++){let i=a[t].object;if(i instanceof l.Mj){let n=[i];if(!y(i)){let e=null;for(;(e=a[t+1]?.object)instanceof l.Mj&&!y(e);)n.push(e),t++}let o=new l.Vu(P,...n);e.push(o)}else i instanceof l.oF&&e.push(i)}for(let t of e)S?.addPass(t);E&&(E.enabled=!0),C&&(C.enabled=!0)}return()=>{for(let t of e)S?.removePass(t);E&&(E.enabled=!1),C&&(C.enabled=!1)}},[S,e,P,E,C]),(0,n.useEffect)(()=>{let e=b.toneMapping;return b.toneMapping=o.NoToneMapping,()=>{b.toneMapping=e}},[b]);let R=(0,n.useMemo)(()=>({composer:S,normalPass:E,downSamplingPass:C,resolutionScale:s,camera:P,scene:A}),[S,E,C,s,P,A]);return(0,n.useImperativeHandle)(x,()=>S,[S]),(0,i.jsx)(m.Provider,{value:R,children:(0,i.jsx)("group",{ref:_,children:e})})})),x=0,b=new WeakMap,w=(e,t)=>function({blendFunction:a=t?.blendFunction,opacity:o=t?.opacity,...l}){let s=b.get(e);if(!s){let t=`@react-three/postprocessing/${e.name}-${x++}`;(0,r.e)({[t]:e}),b.set(e,s=t)}let c=(0,r.C)(e=>e.camera),f=n.useMemo(()=>[...t?.args??[],...l.args??[{...t,...l}]],[JSON.stringify(l)]);return(0,i.jsx)(s,{camera:c,"blendMode-blendFunction":a,"blendMode-opacity-value":o,...l,args:f})};l.Mj;let M=w(l.bv,{blendFunction:0}),k=w(l.t$),A=(l.i,l.hH,(0,n.forwardRef)(function(e,t){let{camera:a,normalPass:o,downSamplingPass:r,resolutionScale:s}=(0,n.useContext)(m),c=(0,n.useMemo)(()=>null===o&&null===r?(console.error("Please enable the NormalPass in the EffectComposer in order to use SSAO."),{}):new l.w2(a,o&&!r?o.texture:null,{blendFunction:21,samples:30,rings:4,distanceThreshold:1,distanceFalloff:0,rangeThreshold:.5,rangeFalloff:.1,luminanceInfluence:.9,radius:20,bias:.5,intensity:1,color:void 0,normalDepthBuffer:r?r.texture:null,resolutionScale:s??1,depthAwareUpsampling:!0,...e}),[a,r,o,s]);return(0,i.jsx)("primitive",{ref:t,object:c,dispose:null})}));var P=(e=>(e[e.Linear=0]="Linear",e[e.Radial=1]="Radial",e[e.MirroredLinear=2]="MirroredLinear",e))(P||{});l.Mj;let S=w(l.K1),E=(l.To,{fragmentShader:`

    // original shader by Evan Wallace

    #define MAX_ITERATIONS 100

    uniform float blur;
    uniform float taper;
    uniform vec2 start;
    uniform vec2 end;
    uniform vec2 direction;
    uniform int samples;

    float random(vec3 scale, float seed) {
        /* use the fragment position for a different seed per-pixel */
        return fract(sin(dot(gl_FragCoord.xyz + seed, scale)) * 43758.5453 + seed);
    }

    void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
        vec4 color = vec4(0.0);
        float total = 0.0;
        vec2 startPixel = vec2(start.x * resolution.x, start.y * resolution.y);
        vec2 endPixel = vec2(end.x * resolution.x, end.y * resolution.y);
        float f_samples = float(samples);
        float half_samples = f_samples / 2.0;

        // use screen diagonal to normalize blur radii
        float maxScreenDistance = distance(vec2(0.0), resolution); // diagonal distance
        float gradientRadius = taper * (maxScreenDistance);
        float blurRadius = blur * (maxScreenDistance / 16.0);

        /* randomize the lookup values to hide the fixed number of samples */
        float offset = random(vec3(12.9898, 78.233, 151.7182), 0.0);
        vec2 normal = normalize(vec2(startPixel.y - endPixel.y, endPixel.x - startPixel.x));
        float radius = smoothstep(0.0, 1.0, abs(dot(uv * resolution - startPixel, normal)) / gradientRadius) * blurRadius;

        #pragma unroll_loop_start
        for (int i = 0; i <= MAX_ITERATIONS; i++) {
            if (i >= samples) { break; } // return early if over sample count
            float f_i = float(i);
            float s_i = -half_samples + f_i;
            float percent = (s_i + offset - 0.5) / half_samples;
            float weight = 1.0 - abs(percent);
            vec4 sample_i = texture2D(inputBuffer, uv + normalize(direction) / resolution * percent * radius);
            /* switch to pre-multiplied alpha to correctly blur transparent images */
            sample_i.rgb *= sample_i.a;
            color += sample_i * weight;
            total += weight;
        }
        #pragma unroll_loop_end

        outputColor = color / total;

        /* switch back from pre-multiplied alpha */
        outputColor.rgb /= outputColor.a + 0.00001;
    }
    `});l.Mj;l.Mj;l.Mj},3314:(e,t,a)=>{a.d(t,{A:()=>i});let i=(0,a(9946).A)("cpu",[["path",{d:"M12 20v2",key:"1lh1kg"}],["path",{d:"M12 2v2",key:"tus03m"}],["path",{d:"M17 20v2",key:"1rnc9c"}],["path",{d:"M17 2v2",key:"11trls"}],["path",{d:"M2 12h2",key:"1t8f8n"}],["path",{d:"M2 17h2",key:"7oei6x"}],["path",{d:"M2 7h2",key:"asdhe0"}],["path",{d:"M20 12h2",key:"1q8mjw"}],["path",{d:"M20 17h2",key:"1fpfkl"}],["path",{d:"M20 7h2",key:"1o8tra"}],["path",{d:"M7 20v2",key:"4gnj0m"}],["path",{d:"M7 2v2",key:"1i4yhu"}],["rect",{x:"4",y:"4",width:"16",height:"16",rx:"2",key:"1vbyd7"}],["rect",{x:"8",y:"8",width:"8",height:"8",rx:"1",key:"z9xiuo"}]])},4355:(e,t,a)=>{a.d(t,{A:()=>i});let i=(0,a(9946).A)("camera",[["path",{d:"M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z",key:"1tc9qg"}],["circle",{cx:"12",cy:"13",r:"3",key:"1vg3eu"}]])},4516:(e,t,a)=>{a.d(t,{A:()=>i});let i=(0,a(9946).A)("map-pin",[["path",{d:"M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0",key:"1r0f0z"}],["circle",{cx:"12",cy:"10",r:"3",key:"ilqhr7"}]])},5273:(e,t,a)=>{a.d(t,{A:()=>i});let i=(0,a(9946).A)("volume-2",[["path",{d:"M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z",key:"uqj9uw"}],["path",{d:"M16 9a5 5 0 0 1 0 6",key:"1q6k2b"}],["path",{d:"M19.364 18.364a9 9 0 0 0 0-12.728",key:"ijwkga"}]])},5456:(e,t,a)=>{a.d(t,{A:()=>i});let i=(0,a(9946).A)("compass",[["path",{d:"m16.24 7.76-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z",key:"9ktpf1"}],["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}]])},5690:(e,t,a)=>{a.d(t,{A:()=>i});let i=(0,a(9946).A)("play",[["polygon",{points:"6 3 20 12 6 21 6 3",key:"1oa8hb"}]])},6561:(e,t,a)=>{a.d(t,{A:()=>i});let i=(0,a(9946).A)("timer",[["line",{x1:"10",x2:"14",y1:"2",y2:"2",key:"14vaq8"}],["line",{x1:"12",x2:"15",y1:"14",y2:"11",key:"17fdiu"}],["circle",{cx:"12",cy:"14",r:"8",key:"1e1u0o"}]])},7330:(e,t,a)=>{a.d(t,{A:()=>i});let i=(0,a(9946).A)("settings-2",[["path",{d:"M14 17H5",key:"gfn3mx"}],["path",{d:"M19 7h-9",key:"6i9tg"}],["circle",{cx:"17",cy:"17",r:"3",key:"18b49y"}],["circle",{cx:"7",cy:"7",r:"3",key:"dfmy0x"}]])},8358:(e,t,a)=>{a.d(t,{o:()=>n});var i=a(7431);class n{setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}}new i.OrthographicCamera(-1,1,1,-1,0,1);class o extends i.BufferGeometry{constructor(){super(),this.setAttribute("position",new i.Float32BufferAttribute([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new i.Float32BufferAttribute([0,2,0,0,2,0],2))}}new o},8497:(e,t,a)=>{a.d(t,{m:()=>u});var i=a(9630),n=a(2115),o=a(7431);let r=parseInt(o.REVISION.replace(/\D+/g,""));var l=Object.defineProperty,s=(e,t,a)=>(((e,t,a)=>t in e?l(e,t,{enumerable:!0,configurable:!0,writable:!0,value:a}):e[t]=a)(e,"symbol"!=typeof t?t+"":t,a),a);let c=(()=>{let e={uniforms:{turbidity:{value:2},rayleigh:{value:1},mieCoefficient:{value:.005},mieDirectionalG:{value:.8},sunPosition:{value:new o.Vector3},up:{value:new o.Vector3(0,1,0)}},vertexShader:`
      uniform vec3 sunPosition;
      uniform float rayleigh;
      uniform float turbidity;
      uniform float mieCoefficient;
      uniform vec3 up;

      varying vec3 vWorldPosition;
      varying vec3 vSunDirection;
      varying float vSunfade;
      varying vec3 vBetaR;
      varying vec3 vBetaM;
      varying float vSunE;

      // constants for atmospheric scattering
      const float e = 2.71828182845904523536028747135266249775724709369995957;
      const float pi = 3.141592653589793238462643383279502884197169;

      // wavelength of used primaries, according to preetham
      const vec3 lambda = vec3( 680E-9, 550E-9, 450E-9 );
      // this pre-calcuation replaces older TotalRayleigh(vec3 lambda) function:
      // (8.0 * pow(pi, 3.0) * pow(pow(n, 2.0) - 1.0, 2.0) * (6.0 + 3.0 * pn)) / (3.0 * N * pow(lambda, vec3(4.0)) * (6.0 - 7.0 * pn))
      const vec3 totalRayleigh = vec3( 5.804542996261093E-6, 1.3562911419845635E-5, 3.0265902468824876E-5 );

      // mie stuff
      // K coefficient for the primaries
      const float v = 4.0;
      const vec3 K = vec3( 0.686, 0.678, 0.666 );
      // MieConst = pi * pow( ( 2.0 * pi ) / lambda, vec3( v - 2.0 ) ) * K
      const vec3 MieConst = vec3( 1.8399918514433978E14, 2.7798023919660528E14, 4.0790479543861094E14 );

      // earth shadow hack
      // cutoffAngle = pi / 1.95;
      const float cutoffAngle = 1.6110731556870734;
      const float steepness = 1.5;
      const float EE = 1000.0;

      float sunIntensity( float zenithAngleCos ) {
        zenithAngleCos = clamp( zenithAngleCos, -1.0, 1.0 );
        return EE * max( 0.0, 1.0 - pow( e, -( ( cutoffAngle - acos( zenithAngleCos ) ) / steepness ) ) );
      }

      vec3 totalMie( float T ) {
        float c = ( 0.2 * T ) * 10E-18;
        return 0.434 * c * MieConst;
      }

      void main() {

        vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
        vWorldPosition = worldPosition.xyz;

        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        gl_Position.z = gl_Position.w; // set z to camera.far

        vSunDirection = normalize( sunPosition );

        vSunE = sunIntensity( dot( vSunDirection, up ) );

        vSunfade = 1.0 - clamp( 1.0 - exp( ( sunPosition.y / 450000.0 ) ), 0.0, 1.0 );

        float rayleighCoefficient = rayleigh - ( 1.0 * ( 1.0 - vSunfade ) );

      // extinction (absorbtion + out scattering)
      // rayleigh coefficients
        vBetaR = totalRayleigh * rayleighCoefficient;

      // mie coefficients
        vBetaM = totalMie( turbidity ) * mieCoefficient;

      }
    `,fragmentShader:`
      varying vec3 vWorldPosition;
      varying vec3 vSunDirection;
      varying float vSunfade;
      varying vec3 vBetaR;
      varying vec3 vBetaM;
      varying float vSunE;

      uniform float mieDirectionalG;
      uniform vec3 up;

      const vec3 cameraPos = vec3( 0.0, 0.0, 0.0 );

      // constants for atmospheric scattering
      const float pi = 3.141592653589793238462643383279502884197169;

      const float n = 1.0003; // refractive index of air
      const float N = 2.545E25; // number of molecules per unit volume for air at 288.15K and 1013mb (sea level -45 celsius)

      // optical length at zenith for molecules
      const float rayleighZenithLength = 8.4E3;
      const float mieZenithLength = 1.25E3;
      // 66 arc seconds -> degrees, and the cosine of that
      const float sunAngularDiameterCos = 0.999956676946448443553574619906976478926848692873900859324;

      // 3.0 / ( 16.0 * pi )
      const float THREE_OVER_SIXTEENPI = 0.05968310365946075;
      // 1.0 / ( 4.0 * pi )
      const float ONE_OVER_FOURPI = 0.07957747154594767;

      float rayleighPhase( float cosTheta ) {
        return THREE_OVER_SIXTEENPI * ( 1.0 + pow( cosTheta, 2.0 ) );
      }

      float hgPhase( float cosTheta, float g ) {
        float g2 = pow( g, 2.0 );
        float inverse = 1.0 / pow( 1.0 - 2.0 * g * cosTheta + g2, 1.5 );
        return ONE_OVER_FOURPI * ( ( 1.0 - g2 ) * inverse );
      }

      void main() {

        vec3 direction = normalize( vWorldPosition - cameraPos );

      // optical length
      // cutoff angle at 90 to avoid singularity in next formula.
        float zenithAngle = acos( max( 0.0, dot( up, direction ) ) );
        float inverse = 1.0 / ( cos( zenithAngle ) + 0.15 * pow( 93.885 - ( ( zenithAngle * 180.0 ) / pi ), -1.253 ) );
        float sR = rayleighZenithLength * inverse;
        float sM = mieZenithLength * inverse;

      // combined extinction factor
        vec3 Fex = exp( -( vBetaR * sR + vBetaM * sM ) );

      // in scattering
        float cosTheta = dot( direction, vSunDirection );

        float rPhase = rayleighPhase( cosTheta * 0.5 + 0.5 );
        vec3 betaRTheta = vBetaR * rPhase;

        float mPhase = hgPhase( cosTheta, mieDirectionalG );
        vec3 betaMTheta = vBetaM * mPhase;

        vec3 Lin = pow( vSunE * ( ( betaRTheta + betaMTheta ) / ( vBetaR + vBetaM ) ) * ( 1.0 - Fex ), vec3( 1.5 ) );
        Lin *= mix( vec3( 1.0 ), pow( vSunE * ( ( betaRTheta + betaMTheta ) / ( vBetaR + vBetaM ) ) * Fex, vec3( 1.0 / 2.0 ) ), clamp( pow( 1.0 - dot( up, vSunDirection ), 5.0 ), 0.0, 1.0 ) );

      // nightsky
        float theta = acos( direction.y ); // elevation --> y-axis, [-pi/2, pi/2]
        float phi = atan( direction.z, direction.x ); // azimuth --> x-axis [-pi/2, pi/2]
        vec2 uv = vec2( phi, theta ) / vec2( 2.0 * pi, pi ) + vec2( 0.5, 0.0 );
        vec3 L0 = vec3( 0.1 ) * Fex;

      // composition + solar disc
        float sundisk = smoothstep( sunAngularDiameterCos, sunAngularDiameterCos + 0.00002, cosTheta );
        L0 += ( vSunE * 19000.0 * Fex ) * sundisk;

        vec3 texColor = ( Lin + L0 ) * 0.04 + vec3( 0.0, 0.0003, 0.00075 );

        vec3 retColor = pow( texColor, vec3( 1.0 / ( 1.2 + ( 1.2 * vSunfade ) ) ) );

        gl_FragColor = vec4( retColor, 1.0 );

      #include <tonemapping_fragment>
      #include <${r>=154?"colorspace_fragment":"encodings_fragment"}>

      }
    `},t=new o.ShaderMaterial({name:"SkyShader",fragmentShader:e.fragmentShader,vertexShader:e.vertexShader,uniforms:o.UniformsUtils.clone(e.uniforms),side:o.BackSide,depthWrite:!1});class a extends o.Mesh{constructor(){super(new o.BoxGeometry(1,1,1),t)}}return s(a,"SkyShader",e),s(a,"material",t),a})();function f(e,t,a=new o.Vector3){let i=Math.PI*(e-.5),n=2*Math.PI*(t-.5);return a.x=Math.cos(n),a.y=Math.sin(i),a.z=Math.sin(n),a}let u=n.forwardRef(({inclination:e=.6,azimuth:t=.1,distance:a=1e3,mieCoefficient:r=.005,mieDirectionalG:l=.8,rayleigh:s=.5,turbidity:u=10,sunPosition:d=f(e,t),...h},p)=>{let v=n.useMemo(()=>new o.Vector3().setScalar(a),[a]),[m]=n.useState(()=>new c);return n.createElement("primitive",(0,i.A)({object:m,ref:p,"material-uniforms-mieCoefficient-value":r,"material-uniforms-mieDirectionalG-value":l,"material-uniforms-rayleigh-value":s,"material-uniforms-sunPosition-value":d,"material-uniforms-turbidity-value":u,scale:v},h))})},8979:(e,t,a)=>{a.d(t,{A:()=>i});let i=(0,a(9946).A)("square",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}]])},9397:(e,t,a)=>{a.d(t,{A:()=>i});let i=(0,a(9946).A)("activity",[["path",{d:"M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2",key:"169zse"}]])},9803:(e,t,a)=>{a.d(t,{A:()=>i});let i=(0,a(9946).A)("key",[["path",{d:"m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4",key:"g0fldk"}],["path",{d:"m21 2-9.6 9.6",key:"1j0ho8"}],["circle",{cx:"7.5",cy:"15.5",r:"5.5",key:"yqb3hr"}]])}}]);