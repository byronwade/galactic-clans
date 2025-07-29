"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[4754],{4754:(e,t,r)=>{r.r(t),r.d(t,{default:()=>c});var a=r(5155),o=r(2115),n=r(1991),i=r(7558),l=r(6898),s=r(4688);function u(){let e=o.useRef(null);return(0,n.D)(t=>{e.current&&(e.current.rotation.y+=.005)}),(0,a.jsxs)("mesh",{ref:e,children:[(0,a.jsx)("sphereGeometry",{args:[2,32,32]}),(0,a.jsx)("meshStandardMaterial",{color:"#4a7c59",roughness:.8,metalness:.2})]})}function c(){return(0,a.jsx)("div",{className:"w-full h-full",children:(0,a.jsx)(i.Hl,{camera:{position:[0,0,8],fov:75},style:{width:"100%",height:"100%"},children:(0,a.jsxs)(o.Suspense,{fallback:null,children:[(0,a.jsx)("ambientLight",{intensity:.3}),(0,a.jsx)("pointLight",{position:[10,10,10],intensity:1}),(0,a.jsx)(u,{}),(0,a.jsx)(l.A,{radius:100,depth:50,count:5e3,factor:4,saturation:0,fade:!0,speed:1}),(0,a.jsx)(s.N,{enablePan:!1,enableZoom:!1,enableRotate:!0,autoRotate:!0,autoRotateSpeed:.5})]})})})}},6898:(e,t,r)=>{r.d(t,{A:()=>u});var a=r(2115),o=r(1991),n=r(7431);let i=parseInt(n.REVISION.replace(/\D+/g,""));class l extends n.ShaderMaterial{constructor(){super({uniforms:{time:{value:0},fade:{value:1}},vertexShader:`
      uniform float time;
      attribute float size;
      varying vec3 vColor;
      void main() {
        vColor = color;
        vec4 mvPosition = modelViewMatrix * vec4(position, 0.5);
        gl_PointSize = size * (30.0 / -mvPosition.z) * (3.0 + sin(time + 100.0));
        gl_Position = projectionMatrix * mvPosition;
      }`,fragmentShader:`
      uniform sampler2D pointTexture;
      uniform float fade;
      varying vec3 vColor;
      void main() {
        float opacity = 1.0;
        if (fade == 1.0) {
          float d = distance(gl_PointCoord, vec2(0.5, 0.5));
          opacity = 1.0 / (1.0 + exp(16.0 * (d - 0.25)));
        }
        gl_FragColor = vec4(vColor, opacity);

        #include <tonemapping_fragment>
	      #include <${i>=154?"colorspace_fragment":"encodings_fragment"}>
      }`})}}let s=e=>new n.Vector3().setFromSpherical(new n.Spherical(e,Math.acos(1-2*Math.random()),2*Math.random()*Math.PI)),u=a.forwardRef(({radius:e=100,depth:t=50,count:r=5e3,saturation:i=0,factor:u=4,fade:c=!1,speed:f=1},m)=>{let d=a.useRef(null),[h,p,v]=a.useMemo(()=>{let a=[],o=[],l=Array.from({length:r},()=>(.5+.5*Math.random())*u),c=new n.Color,f=e+t,m=t/r;for(let e=0;e<r;e++)f-=m*Math.random(),a.push(...s(f).toArray()),c.setHSL(e/r,i,.9),o.push(c.r,c.g,c.b);return[new Float32Array(a),new Float32Array(o),new Float32Array(l)]},[r,t,u,e,i]);(0,o.D)(e=>d.current&&(d.current.uniforms.time.value=e.clock.elapsedTime*f));let[g]=a.useState(()=>new l);return a.createElement("points",{ref:m},a.createElement("bufferGeometry",null,a.createElement("bufferAttribute",{attach:"attributes-position",args:[h,3]}),a.createElement("bufferAttribute",{attach:"attributes-color",args:[p,3]}),a.createElement("bufferAttribute",{attach:"attributes-size",args:[v,1]})),a.createElement("primitive",{ref:d,object:g,attach:"material",blending:n.AdditiveBlending,"uniforms-fade-value":c,depthWrite:!1,transparent:!0,vertexColors:!0}))})}}]);