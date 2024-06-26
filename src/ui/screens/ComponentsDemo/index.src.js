(async (global)=>{ 

namespace `ui.loaders` (
    class ProgressRing extends WebComponent {
		constructor(){
			super();
			this.progress=0;
		}
        async onConnected() {
			await super.onConnected();
			this.duration = this.getAttribute("duration")||1200;
            document.addEventListener("showsplash", e => this.onShow(), false);
			document.addEventListener("hidesplash", e => this.onHide(), false);
			this.on("transitionend", e=>this.onTransitionEnd(e), false);
			// this.on("mozTransitionend", e=>this.onTransitionEnd(e));
			// this.fade();

			// await wait(3000)
			this.setProgress(this.getAttribute("progress")||20);
        }

		async setProgress(percent=this.progress) {
			this.stroke = this.getAttribute('stroke')||4;
			this.radius = this.getAttribute('radius')||60;
			this.normalizedRadius = this.radius - this.stroke * 2;
			this._circumference = this.normalizedRadius * 2 * Math.PI;

			this.offset = this._circumference - (percent / 100 * this._circumference);
			const circle = this.querySelector('circle#marker');
			const bg = this.querySelector('circle#bg');
			var svg = this.querySelector("svg");
				svg.setAttribute("width",this.radius*2);
				svg.setAttribute("height",this.radius*2);

			
				circle.style.strokeDashoffset = this.offset; 
				circle.setAttribute("stroke-dasharray",`${this._circumference} ${this._circumference}`);
				circle.setAttribute("stroke-width",this.stroke);
				circle.setAttribute("r",this.normalizedRadius);
				circle.setAttribute("cx",this.radius);
				circle.setAttribute("cy",this.radius);
				bg.setAttribute("stroke-width",this.stroke);
				bg.setAttribute("r",this.normalizedRadius);
				bg.setAttribute("cx",this.radius);
				bg.setAttribute("cy",this.radius);

			if(this.progress>=100){this.fade();}
		}

		static get observedAttributes() {
			return ['progress'];
		}

		async attributeChangedCallback(name, oldValue, newValue) {

			if (name === 'progress') {
				this.progress = this.getAttribute("progress");
				this.isConnected && this.setProgress();
			}
		}

		onTransitionEnd(e){
			e.propertyName=="opacity" && this.onHide()
		}

		async fade(){
			await wait(parseInt(this.duration));
			this.classList.add("fade");//fires 'transitionend'
		}
		
        async onShow(){
            this.classList.remove("hidden");
			this.classList.remove("fade");
			this.fade();
        }

        onHide(){
            this.classList.add("hidden");
        }

        //Override. No css file to load, it's baked.
        onLoadInstanceStylesheet(){
            return false
        }

        //template baked: fast loading
        template (){
        	return `
        		<template>
					<div class="loader">
						<svg height="60" width="60">
							<circle id="bg" stroke="white" fill="transparent"/>
							<circle id="marker" stroke="red" fill="transparent"/>
						</svg>
					</div>
				</template>
        	`
        }

        //css baked: fast loading
        cssStyle(){
        	return `
				:host {
					border: 0;
    				display: block;
    				padding: 0px;
    				position: fixed;
    				left: 0;
    				top: 0;
    				right: 0;
    				bottom: 0;
    				background:
    				#1c2336;
    				color:
    				white;
    				opacity: 1;
    				z-index: 10000000;
    				transition: opacity .7s;
    				box-sizing: border-box;
				}
				:host(.fade),
				:host.fade{
    				opacity:0;
    			}

				:host(.hidden),
				:host.hidden{
    				display:none;
    			}
				
				:host .loader  {
					transform: translate3d(-50%,-50%,0);
					position:absolute;
					top:50%;
					left:50%;
				}

				:host circle {
					transition: stroke-dashoffset 0.35s;
					transform: rotate(-90deg);
					transform-origin: 50% 50%;
				}
			`
        }
    }
);

tag(ui.loaders.ProgressRing, "splash-loader");


                
namespace `ui.components` (
	class MenuToggleButton extends WebComponent  {
		async onConnected(){
			super.onConnected();
			this.on("click", e=>this.onClick(e), false, ".nav-icon");
		}

		onClick(e){
			e.target.classList.toggle("active")
		}
	}
)


                ui.components.MenuToggleButton.prototype.template = function(){
                    return `<template>
	<div class="nav-icon">
		<div></div>
	</div>
</template>
`
                };

                ui.components.MenuToggleButton.prototype.cssStyle = function(){
                    return `:host .nav-icon {
  margin: 1em;
  width: 40px;
}

:host .nav-icon:after, 
:host .nav-icon:before, 
:host .nav-icon div {
  background-color: black;
  border-radius: 3px;
  content: '';
  display: block;
  height: 5px;
  margin: 7px 0;
  transition: all .2s ease-in-out;
}

:host .nav-icon.active:before {
  transform: translateY(12px) rotate(135deg);
}

:host .nav-icon.active:after {
  transform: translateY(-12px) rotate(-135deg);
}

:host .nav-icon.active div {
  transform: scale(0);
}
`
                };

                ui.components.MenuToggleButton.prototype.onLoadInstanceStylesheet = function(){ return false }




                
namespace `ui.components` (
	class RippleButton extends WebComponent  {
		async onConnected(){
			super.onConnected();
			this.on("click", e=>this.onClick(e), "false", "button");
		}

		onClick(e){
			const button = e.target;//event.currentTarget;

			const circle = document.createElement("span");
			const diameter = Math.max(button.clientWidth, button.clientHeight);
			const radius = diameter / 2;

			circle.style.width = circle.style.height = `${diameter}px`;
			circle.style.left = `${e.src.clientX - button.offsetLeft - radius}px`;
			circle.style.top = `${e.src.clientY - button.offsetTop - radius}px`;
			circle.classList.add("ripple");

			const ripple = button.querySelector(".ripple");
			ripple && ripple.remove();

			button.appendChild(circle);
		}
	}
)


                ui.components.RippleButton.prototype.template = function(){
                    return `<template>
	<button>Find out more</button>
</template>
`
                };

                ui.components.RippleButton.prototype.cssStyle = function(){
                    return `.RippleButton {
	
}

:host button {
    position: relative;
    overflow: hidden;
    transition: background 400ms;
    color: #fff;
    background-color: #176ab3;
    padding: 1rem 2rem;
    font-family: 'Roboto', sans-serif;
    font-size: 1.5rem;
    outline: 0;
    border: 0;
    border-radius: 0.25rem;
    box-shadow: 0 0 0.5rem rgba(0, 0, 0, 0.3); /* black with 30% opacity */
    cursor: pointer;
  }
  
  :host span.ripple {
    position: absolute;
    border-radius: 50%;
    transform: scale(0);
    animation: ripple 600ms linear;
    background-color: rgba(255, 255, 255, 0.7);
  }
  
  @keyframes ripple {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }
  
`
                };

                ui.components.RippleButton.prototype.onLoadInstanceStylesheet = function(){ return false }




                

namespace `ui.components` (
	class ParticleButton extends WebComponent  {
		async onConnected(){
			super.onConnected();
			this.on("click", e=>this.onClick(e), false, "button");
		}

		onClick(e){
			e=e.src;//original event;
			for (let i = 0; i < 30; i++) {
				this.addParticleAt(e.clientX, e.clientY);
			}
		}

		addParticleAt (x, y) {
			const particle = document.createElement('particle');
			// Calculate a random size from 5px to 25px
			const size = Math.floor(Math.random() * 20 + 5);
			particle.style.width = `${size}px`;
			particle.style.height = `${size}px`;

			// Generate a random blue/purple palette
			particle.style.background = `hsl(${Math.random() * 90 + 180}, 70%, 60%)`;
			
			// Generate a random x & y destination within a distance of 75px from the mouse
			const destinationX = x + (Math.random() - 0.5) * 2 * 75;
			const destinationY = y + (Math.random() - 0.5) * 2 * 75;
			document.body.appendChild(particle);
			
			// Store the animation in a variable as we will need it later
			const animation = particle.animate([
			  {
				// Set the origin position of the particle
				// We offset the particle with half its size to center it around the mouse
				transform: `translate3d(-50%, -50%, 0) translate3d(${x}px, ${y}px, 0px)`,
				opacity: 1
			  },
			  {
				// We define the final coordinates as the second keyframe
				transform: `translate3d(${destinationX}px, ${destinationY}px, 0px)`,
				opacity: 0
			  }
			], 
			{//animate options
			  duration: Math.random() * 1000 + 500,
			  easing: 'cubic-bezier(0, .9, .57, 1)',
			  delay: Math.random() * 200
			});
			
			animation.onfinish = () => particle.remove();
		}
	}
)


                ui.components.ParticleButton.prototype.template = function(){
                    return `<template>
	<button>Yay!</button>
</template>
`
                };

                ui.components.ParticleButton.prototype.cssStyle = function(){
                    return `particle {
  position: fixed;
  left: 0;
  top: 0;
  border-radius: 50%;
  pointer-events: none;
  opacity: 0;
}

:host {
  padding: 10px;
}

:host button {
  position: relative;
  overflow: hidden;
  transition: background 400ms;
  color: #fff;
  background-color: #176ab3;
  padding: 1rem 2rem;
  font-family: 'Roboto', sans-serif;
  font-size: 1.5rem;
  outline: 0;
  border: 0;
  border-radius: 0.25rem;
  box-shadow: 0 0 0.5rem rgba(0, 0, 0, 0.3); /* black with 30% opacity */
  cursor: pointer;
}
`
                };

                ui.components.ParticleButton.prototype.onLoadInstanceStylesheet = function(){ return false }




                
namespace `ui.components` (
	class SideBar  extends w3c.ui.WebComponent  {
		
	}
)


                ui.components.SideBar.prototype.template = function(){
                    return `<template>
	<div class="page-wrapper chiller-theme toggled">
		<a id="show-sidebar" class="btn btn-sm btn-dark" href="#">
		  <i class="fas fa-bars"></i>
		</a>
		<nav id="sidebar" class="sidebar-wrapper">
		  <div class="sidebar-content">
			<div class="sidebar-brand">
			  <a href="#">pro sidebar</a>
			  <div id="close-sidebar">
				<i class="fas fa-times"></i>
			  </div>
			</div>
			<div class="sidebar-header">
			  <div class="user-pic">
				<img class="img-responsive img-rounded" src="https://raw.githubusercontent.com/azouaoui-med/pro-sidebar-template/gh-pages/src/img/user.jpg" alt="User picture">
			  </div>
			  <div class="user-info">
				<span class="user-name">Jhon
				  <strong>Smith</strong>
				</span>
				<span class="user-role">Administrator</span>
				<span class="user-status">
				  <i class="fa fa-circle"></i>
				  <span>Online</span>
				</span>
			  </div>
			</div>
			<!-- sidebar-header  -->
			<div class="sidebar-search">
			  <div>
				<div class="input-group">
				  <input type="text" class="form-control search-menu" placeholder="Search...">
				  <div class="input-group-append">
					<span class="input-group-text">
					  <i class="fa fa-search" aria-hidden="true"></i>
					</span>
				  </div>
				</div>
			  </div>
			</div>
			<!-- sidebar-search  -->
			<div class="sidebar-menu">
			  <ul>
				<li class="header-menu">
				  <span>General</span>
				</li>
				<li class="sidebar-dropdown">
				  <a href="#">
					<i class="fa fa-tachometer-alt"></i>
					<span>Dashboard</span>
					<span class="badge badge-pill badge-warning">New</span>
				  </a>
				  <div class="sidebar-submenu">
					<ul>
					  <li>
						<a href="#">Dashboard 1
						  <span class="badge badge-pill badge-success">Pro</span>
						</a>
					  </li>
					  <li>
						<a href="#">Dashboard 2</a>
					  </li>
					  <li>
						<a href="#">Dashboard 3</a>
					  </li>
					</ul>
				  </div>
				</li>
				<li class="sidebar-dropdown">
				  <a href="#">
					<i class="fa fa-shopping-cart"></i>
					<span>E-commerce</span>
					<span class="badge badge-pill badge-danger">3</span>
				  </a>
				  <div class="sidebar-submenu">
					<ul>
					  <li>
						<a href="#">Products
	  
						</a>
					  </li>
					  <li>
						<a href="#">Orders</a>
					  </li>
					  <li>
						<a href="#">Credit cart</a>
					  </li>
					</ul>
				  </div>
				</li>
				<li class="sidebar-dropdown">
				  <a href="#">
					<i class="far fa-gem"></i>
					<span>Components</span>
				  </a>
				  <div class="sidebar-submenu">
					<ul>
					  <li>
						<a href="#">General</a>
					  </li>
					  <li>
						<a href="#">Panels</a>
					  </li>
					  <li>
						<a href="#">Tables</a>
					  </li>
					  <li>
						<a href="#">Icons</a>
					  </li>
					  <li>
						<a href="#">Forms</a>
					  </li>
					</ul>
				  </div>
				</li>
				<li class="sidebar-dropdown">
				  <a href="#">
					<i class="fa fa-chart-line"></i>
					<span>Charts</span>
				  </a>
				  <div class="sidebar-submenu">
					<ul>
					  <li>
						<a href="#">Pie chart</a>
					  </li>
					  <li>
						<a href="#">Line chart</a>
					  </li>
					  <li>
						<a href="#">Bar chart</a>
					  </li>
					  <li>
						<a href="#">Histogram</a>
					  </li>
					</ul>
				  </div>
				</li>
				<li class="sidebar-dropdown">
				  <a href="#">
					<i class="fa fa-globe"></i>
					<span>Maps</span>
				  </a>
				  <div class="sidebar-submenu">
					<ul>
					  <li>
						<a href="#">Google maps</a>
					  </li>
					  <li>
						<a href="#">Open street map</a>
					  </li>
					</ul>
				  </div>
				</li>
				<li class="header-menu">
				  <span>Extra</span>
				</li>
				<li>
				  <a href="#">
					<i class="fa fa-book"></i>
					<span>Documentation</span>
					<span class="badge badge-pill badge-primary">Beta</span>
				  </a>
				</li>
				<li>
				  <a href="#">
					<i class="fa fa-calendar"></i>
					<span>Calendar</span>
				  </a>
				</li>
				<li>
				  <a href="#">
					<i class="fa fa-folder"></i>
					<span>Examples</span>
				  </a>
				</li>
			  </ul>
			</div>
			<!-- sidebar-menu  -->
		  </div>
		  <!-- sidebar-content  -->
		  <div class="sidebar-footer">
			<a href="#">
			  <i class="fa fa-bell"></i>
			  <span class="badge badge-pill badge-warning notification">3</span>
			</a>
			<a href="#">
			  <i class="fa fa-envelope"></i>
			  <span class="badge badge-pill badge-success notification">7</span>
			</a>
			<a href="#">
			  <i class="fa fa-cog"></i>
			  <span class="badge-sonar"></span>
			</a>
			<a href="#">
			  <i class="fa fa-power-off"></i>
			</a>
		  </div>
		</nav>
		<!-- page-content" -->
	</div>
	  <!-- page-wrapper -->
</template>
`
                };

                ui.components.SideBar.prototype.cssStyle = function(){
                    return `
  body {
    font-size: 0.9rem;
  }
  .page-wrapper .sidebar-wrapper,
  .sidebar-wrapper .sidebar-brand > a,
  .sidebar-wrapper .sidebar-dropdown > a:after,
  .sidebar-wrapper .sidebar-menu .sidebar-dropdown .sidebar-submenu li a:before,
  .sidebar-wrapper ul li a i,
  .page-wrapper .page-content,
  .sidebar-wrapper .sidebar-search input.search-menu,
  .sidebar-wrapper .sidebar-search .input-group-text,
  .sidebar-wrapper .sidebar-menu ul li a,
  #show-sidebar,
  #close-sidebar {
    -webkit-transition: all 0.3s ease;
    -moz-transition: all 0.3s ease;
    -ms-transition: all 0.3s ease;
    -o-transition: all 0.3s ease;
    transition: all 0.3s ease;
  }
  
  /*----------------page-wrapper----------------*/
  
  .page-wrapper {
    height: 100vh;
  }
  
  .page-wrapper .theme {
    width: 40px;
    height: 40px;
    display: inline-block;
    border-radius: 4px;
    margin: 2px;
  }
  
  .page-wrapper .theme.chiller-theme {
    background: #1e2229;
  }
  
  /*----------------toggeled sidebar----------------*/
  :host {
    position: absolute;
  }
  .page-wrapper.toggled .sidebar-wrapper {
    left: 0px;
  }
  
  @media screen and (min-width: 768px) {
    .page-wrapper.toggled .page-content {
      padding-left: 300px;
    }
  }
  /*----------------show sidebar button----------------*/
  #show-sidebar {
    position: fixed;
    left: 0;
    top: 10px;
    border-radius: 0 4px 4px 0px;
    width: 35px;
    transition-delay: 0.3s;
  }
  .page-wrapper.toggled #show-sidebar {
    left: -40px;
  }
  /*----------------sidebar-wrapper----------------*/
  
  .sidebar-wrapper {
    width: 260px;
    height: 100%;
    max-height: 100%;
    position: fixed;
    top: 0;
    left: -300px;
    z-index: 999;
  }
  
  .sidebar-wrapper ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
  }
  
  .sidebar-wrapper a {
    text-decoration: none;
  }
  
  /*----------------sidebar-content----------------*/
  
  .sidebar-content {
    max-height: calc(100% - 30px);
    height: calc(100% - 30px);
    overflow-y: auto;
    position: relative;
  }
  
  .sidebar-content.desktop {
    overflow-y: hidden;
  }
  
  /*--------------------sidebar-brand----------------------*/
  
  .sidebar-wrapper .sidebar-brand {
    padding: 10px 20px;
    display: flex;
    align-items: center;
  }
  
  .sidebar-wrapper .sidebar-brand > a {
    text-transform: uppercase;
    font-weight: bold;
    flex-grow: 1;
  }
  
  .sidebar-wrapper .sidebar-brand #close-sidebar {
    cursor: pointer;
    font-size: 20px;
  }
  /*--------------------sidebar-header----------------------*/
  
  .sidebar-wrapper .sidebar-header {
    padding: 20px;
    overflow: hidden;
  }
  
  .sidebar-wrapper .sidebar-header .user-pic {
    float: left;
    width: 60px;
    padding: 2px;
    border-radius: 12px;
    margin-right: 15px;
    overflow: hidden;
  }
  
  .sidebar-wrapper .sidebar-header .user-pic img {
    object-fit: cover;
    height: 100%;
    width: 100%;
  }
  
  .sidebar-wrapper .sidebar-header .user-info {
    float: left;
  }
  
  .sidebar-wrapper .sidebar-header .user-info > span {
    display: block;
  }
  
  .sidebar-wrapper .sidebar-header .user-info .user-role {
    font-size: 12px;
  }
  
  .sidebar-wrapper .sidebar-header .user-info .user-status {
    font-size: 11px;
    margin-top: 4px;
  }
  
  .sidebar-wrapper .sidebar-header .user-info .user-status i {
    font-size: 8px;
    margin-right: 4px;
    color: #5cb85c;
  }
  
  /*-----------------------sidebar-search------------------------*/
  
  .sidebar-wrapper .sidebar-search > div {
    padding: 10px 20px;
  }
  
  /*----------------------sidebar-menu-------------------------*/
  
  .sidebar-wrapper .sidebar-menu {
    padding-bottom: 10px;
  }
  
  .sidebar-wrapper .sidebar-menu .header-menu span {
    font-weight: bold;
    font-size: 14px;
    padding: 15px 20px 5px 20px;
    display: inline-block;
  }
  
  .sidebar-wrapper .sidebar-menu ul li a {
    display: inline-block;
    width: 100%;
    text-decoration: none;
    position: relative;
    padding: 8px 30px 8px 20px;
  }
  
  .sidebar-wrapper .sidebar-menu ul li a i {
    margin-right: 10px;
    font-size: 12px;
    width: 30px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    border-radius: 4px;
  }
  
  .sidebar-wrapper .sidebar-menu ul li a:hover > i::before {
    display: inline-block;
    animation: swing ease-in-out 0.5s 1 alternate;
  }
  
  .sidebar-wrapper .sidebar-menu .sidebar-dropdown > a:after {
    font-family: "Font Awesome 5 Free";
    font-weight: 900;
    content: "\f105";
    font-style: normal;
    display: inline-block;
    font-style: normal;
    font-variant: normal;
    text-rendering: auto;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    background: 0 0;
    position: absolute;
    right: 15px;
    top: 14px;
  }
  
  .sidebar-wrapper .sidebar-menu .sidebar-dropdown .sidebar-submenu ul {
    padding: 5px 0;
  }
  
  .sidebar-wrapper .sidebar-menu .sidebar-dropdown .sidebar-submenu li {
    padding-left: 25px;
    font-size: 13px;
  }
  
  .sidebar-wrapper .sidebar-menu .sidebar-dropdown .sidebar-submenu li a:before {
    content: "\f111";
    font-family: "Font Awesome 5 Free";
    font-weight: 400;
    font-style: normal;
    display: inline-block;
    text-align: center;
    text-decoration: none;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    margin-right: 10px;
    font-size: 8px;
  }
  
  .sidebar-wrapper .sidebar-menu ul li a span.label,
  .sidebar-wrapper .sidebar-menu ul li a span.badge {
    float: right;
    margin-top: 8px;
    margin-left: 5px;
  }
  
  .sidebar-wrapper .sidebar-menu .sidebar-dropdown .sidebar-submenu li a .badge,
  .sidebar-wrapper .sidebar-menu .sidebar-dropdown .sidebar-submenu li a .label {
    float: right;
    margin-top: 0px;
  }
  
  .sidebar-wrapper .sidebar-menu .sidebar-submenu {
    display: none;
  }
  
  .sidebar-wrapper .sidebar-menu .sidebar-dropdown.active > a:after {
    transform: rotate(90deg);
    right: 17px;
  }
  
  /*--------------------------side-footer------------------------------*/
  
  .sidebar-footer {
    position: absolute;
    width: 100%;
    bottom: 0;
    display: flex;
  }
  
  .sidebar-footer > a {
    flex-grow: 1;
    text-align: center;
    height: 30px;
    line-height: 30px;
    position: relative;
  }
  
  .sidebar-footer > a .notification {
    position: absolute;
    top: 0;
  }
  
  .badge-sonar {
    display: inline-block;
    background: #980303;
    border-radius: 50%;
    height: 8px;
    width: 8px;
    position: absolute;
    top: 0;
  }
  
  .badge-sonar:after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    border: 2px solid #980303;
    opacity: 0;
    border-radius: 50%;
    width: 100%;
    height: 100%;
    animation: sonar 1.5s infinite;
  }
  
  /*--------------------------page-content-----------------------------*/
  
  .page-wrapper .page-content {
    display: inline-block;
    width: 100%;
    padding-left: 0px;
    padding-top: 20px;
  }
  
  .page-wrapper .page-content > div {
    padding: 20px 40px;
  }
  
  .page-wrapper .page-content {
    overflow-x: hidden;
  }
  
  /*------scroll bar---------------------*/
  
  ::-webkit-scrollbar {
    width: 5px;
    height: 7px;
  }
  ::-webkit-scrollbar-button {
    width: 0px;
    height: 0px;
  }
  ::-webkit-scrollbar-thumb {
    background: #525965;
    border: 0px none #ffffff;
    border-radius: 0px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: #525965;
  }
  ::-webkit-scrollbar-thumb:active {
    background: #525965;
  }
  ::-webkit-scrollbar-track {
    background: transparent;
    border: 0px none #ffffff;
    border-radius: 50px;
  }
  ::-webkit-scrollbar-track:hover {
    background: transparent;
  }
  ::-webkit-scrollbar-track:active {
    background: transparent;
  }
  ::-webkit-scrollbar-corner {
    background: transparent;
  }
  
  
  /*-----------------------------chiller-theme-------------------------------------------------*/
  
  .chiller-theme .sidebar-wrapper {
      background: #31353D;
  }
  
  .chiller-theme .sidebar-wrapper .sidebar-header,
  .chiller-theme .sidebar-wrapper .sidebar-search,
  .chiller-theme .sidebar-wrapper .sidebar-menu {
      border-top: 1px solid #3a3f48;
  }
  
  .chiller-theme .sidebar-wrapper .sidebar-search input.search-menu,
  .chiller-theme .sidebar-wrapper .sidebar-search .input-group-text {
      border-color: transparent;
      box-shadow: none;
  }
  
  .chiller-theme .sidebar-wrapper .sidebar-header .user-info .user-role,
  .chiller-theme .sidebar-wrapper .sidebar-header .user-info .user-status,
  .chiller-theme .sidebar-wrapper .sidebar-search input.search-menu,
  .chiller-theme .sidebar-wrapper .sidebar-search .input-group-text,
  .chiller-theme .sidebar-wrapper .sidebar-brand>a,
  .chiller-theme .sidebar-wrapper .sidebar-menu ul li a,
  .chiller-theme .sidebar-footer>a {
      color: #818896;
  }
  
  .chiller-theme .sidebar-wrapper .sidebar-menu ul li:hover>a,
  .chiller-theme .sidebar-wrapper .sidebar-menu .sidebar-dropdown.active>a,
  .chiller-theme .sidebar-wrapper .sidebar-header .user-info,
  .chiller-theme .sidebar-wrapper .sidebar-brand>a:hover,
  .chiller-theme .sidebar-footer>a:hover i {
      color: #b8bfce;
  }
  
  .page-wrapper.chiller-theme.toggled #close-sidebar {
      color: #bdbdbd;
  }
  
  .page-wrapper.chiller-theme.toggled #close-sidebar:hover {
      color: #ffffff;
  }
  
  .chiller-theme .sidebar-wrapper ul li:hover a i,
  .chiller-theme .sidebar-wrapper .sidebar-dropdown .sidebar-submenu li a:hover:before,
  .chiller-theme .sidebar-wrapper .sidebar-search input.search-menu:focus+span,
  .chiller-theme .sidebar-wrapper .sidebar-menu .sidebar-dropdown.active a i {
      color: #16c7ff;
      text-shadow:0px 0px 10px rgba(22, 199, 255, 0.5);
  }
  
  .chiller-theme .sidebar-wrapper .sidebar-menu ul li a i,
  .chiller-theme .sidebar-wrapper .sidebar-menu .sidebar-dropdown div,
  .chiller-theme .sidebar-wrapper .sidebar-search input.search-menu,
  .chiller-theme .sidebar-wrapper .sidebar-search .input-group-text {
      background: #3a3f48;
  }
  
  .chiller-theme .sidebar-wrapper .sidebar-menu .header-menu span {
      color: #6c7b88;
  }
  
  .chiller-theme .sidebar-footer {
      background: #3a3f48;
      box-shadow: 0px -1px 5px #282c33;
      border-top: 1px solid #464a52;
  }
  
  .chiller-theme .sidebar-footer>a:first-child {
      border-left: none;
  }
  
  .chiller-theme .sidebar-footer>a:last-child {
      border-right: none;
  }
  





  @keyframes swing {
    0% {
      transform: rotate(0deg);
    }
    10% {
      transform: rotate(10deg);
    }
    30% {
      transform: rotate(0deg);
    }
    40% {
      transform: rotate(-10deg);
    }
    50% {
      transform: rotate(0deg);
    }
    60% {
      transform: rotate(5deg);
    }
    70% {
      transform: rotate(0deg);
    }
    80% {
      transform: rotate(-5deg);
    }
    100% {
      transform: rotate(0deg);
    }
  }
  
  @keyframes sonar {
    0% {
      transform: scale(0.9);
      opacity: 1;
    }
    100% {
      transform: scale(2);
      opacity: 0;
    }
  }
`
                };

                ui.components.SideBar.prototype.onLoadInstanceStylesheet = function(){ return false }




                

namespace `ui.components` (
	class Accordion extends WebComponent  {
		
	}
)




                ui.components.Accordion.prototype.template = function(){
                    return `<template>
	<ul>
		<li>
			<input type="checkbox" checked>
			<i></i>
			<h2>Languages Used</h2>
			<p>This page was written in HTML and CSS. The CSS was compiled from SASS. I used Normalize as my CSS reset and -prefix-free to save myself some headaches. I haven't quite gotten the hang of Slim for compiling into HTML, but someday I'll use it since its syntax compliments that of SASS. Regardless, this could all be done in plain HTML and CSS.</p>
		</li>
		<li>
			<input type="checkbox" checked>
			<i></i>
			<h2>How it Works</h2>
			<p>Using the sibling and checked selectors, we can determine the styling of sibling elements based on the checked state of the checkbox input element. One use, as demonstrated here, is an entirely CSS and HTML accordion element. Media queries are used to make the element responsive to different screen sizes.</p>
		</li>
		<li>
			<input type="checkbox" checked>
			<i></i>
			<h2>Points of Interest</h2>
			<p>By making the open state default for when :checked isn't detected, we can make this system accessable for browsers that don't recognize :checked. The fallback is simply an open accordion. The accordion can be manipulated with Javascript (if needed) by changing the "checked" property of the input element.</p>
		</li>
	</ul>
</template>
`
                };

                ui.components.Accordion.prototype.cssStyle = function(){
                    return `.transition, ul li i:before, ul li i:after, p {
    transition: all 0.25s ease-in-out;
  }
  
  .flipIn, ul li, h1 {
    animation: flipdown 0.5s ease both;
  }
  
  .no-select, h2 {
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
  

  /* @media (max-width: 550px) {
    body {
      box-sizing: border-box;
      transform: translate(0, 0);
      max-width: 100%;
      min-height: 100%;
      margin: 0;
      left: 0;
    }
  } */
  
  :host h1, 
  :host h2 {
    color: #ff6873;
  }
  
  :host h1 {
    text-transform: uppercase;
    font-size: 36px;
    line-height: 42px;
    letter-spacing: 3px;
    font-weight: 100;
  }
  
  :host h2 {
    font-size: 26px;
    line-height: 34px;
    font-weight: 300;
    letter-spacing: 1px;
    display: block;
    background-color: #fefffa;
    margin: 0;
    cursor: pointer;
  }
  
  :host p {
    color: rgba(48, 69, 92, 0.8);
    font-size: 17px;
    line-height: 26px;
    letter-spacing: 1px;
    position: relative;
    overflow: hidden;
    max-height: 800px;
    opacity: 1;
    transform: translate(0, 0);
    margin-top: 14px;
    z-index: 2;
  }
  
  :host ul {
    list-style: none;
    perspective: 900;
    padding: 0;
    margin: 0;
  }
  :host ul li {
    position: relative;
    padding: 0;
    margin: 0;
    padding-bottom: 4px;
    padding-top: 18px;
    border-top: 1px dotted #dce7eb;
  }
  :host ul li:nth-of-type(1) {
    animation-delay: 0.5s;
  }
  :host ul li:nth-of-type(2) {
    animation-delay: 0.75s;
  }
  :host ul li:nth-of-type(3) {
    animation-delay: 1s;
  }
  :host ul li:last-of-type {
    padding-bottom: 0;
  }
  :host ul li i {
    position: absolute;
    transform: translate(-6px, 0);
    margin-top: 16px;
    right: 0;
  }
  :host ul li i:before, 
  :host ul li i:after {
    content: "";
    position: absolute;
    background-color: #ff6873;
    width: 3px;
    height: 9px;
  }
  :host ul li i:before {
    transform: translate(-2px, 0) rotate(45deg);
  }
  :host ul li i:after {
    transform: translate(2px, 0) rotate(-45deg);
  }
  :host ul li input[type=checkbox] {
    position: absolute;
    cursor: pointer;
    width: 100%;
    height: 100%;
    z-index: 1;
    opacity: 0;
  }
  :host ul li input[type=checkbox]:checked ~ p {
    margin-top: 0;
    max-height: 0;
    opacity: 0;
    transform: translate(0, 50%);
  }
  :host ul li input[type=checkbox]:checked ~ i:before {
    transform: translate(2px, 0) rotate(45deg);
  }
  :host ul li input[type=checkbox]:checked ~ i:after {
    transform: translate(-2px, 0) rotate(-45deg);
  }
  
  @keyframes flipdown {
    0% {
      opacity: 0;
      transform-origin: top center;
      transform: rotateX(-90deg);
    }
    5% {
      opacity: 1;
    }
    80% {
      transform: rotateX(8deg);
    }
    83% {
      transform: rotateX(6deg);
    }
    92% {
      transform: rotateX(-3deg);
    }
    100% {
      transform-origin: top center;
      transform: rotateX(0deg);
    }
  }
`
                };

                ui.components.Accordion.prototype.onLoadInstanceStylesheet = function(){ return false }

tag(ui.components.Accordion, 'accordion-list');


                
namespace `ui.components.accordions` (
	class BasicAccordion extends WebComponent  {
		
	}
)


                ui.components.accordions.BasicAccordion.prototype.template = function(){
                    return `<template>
	<div class="tabs">
		<slot name="content" append>
			<div class="tab">
				<input type="checkbox" id="chck1">
				<label class="tab-label" for="chck1">Item 1</label>
				<div class="tab-content">
				Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ipsum, reiciendis!
				</div>
			</div>
			<div class="tab">
				<input type="checkbox" id="chck2">
				<label class="tab-label" for="chck2">Item 2</label>
				<div class="tab-content">
				Lorem ipsum dolor sit amet consectetur adipisicing elit. A, in!
				</div>
			</div>
		</slot>
	</div>
</template>
`
                };

                ui.components.accordions.BasicAccordion.prototype.cssStyle = function(){
                    return `
/* 
h1 {
  margin: 0;
  line-height: 2;
  text-align: center;
}

h2 {
  margin: 0 0 0.5em;
  font-weight: normal;
} */
:host {
    width: 300px;
}
:host input {
  position: absolute;
  opacity: 0;
  z-index: -1;
}
/* 
.row {
  display: flex;
}
.row .col {
  flex: 1;
}
.row .col:last-child {
  margin-left: 1em;
} */

/* Accordion styles */
:host .tabs {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 4px -2px rgba(0, 0, 0, 0.5);
}

:host .tab {
  width: 100%;
  color: white;
  overflow: hidden;
}
:host .tab-label {
  display: flex;
  justify-content: space-between;
  padding: 1em;
  background: #2c3e50;
  font-weight: bold;
  cursor: pointer;
  /* Icon */
}
:host .tab-label:hover {
  background: #1a252f;
}
:host .tab-label::after {
  content: "❯";
  width: 1em;
  height: 1em;
  text-align: center;
  transition: all 0.35s;
  transform: rotate(90deg);

}

:host .tab-content {
  /* max-height: 0; */
  display: none;
  max-height: 100vh;
  padding: 0 1em;
  color: #2c3e50;
  background: white;
  transition: all 0.35s;
}
:host .tab-close {
  display: flex;
  justify-content: flex-end;
  padding: 1em;
  font-size: 0.75em;
  background: #2c3e50;
  cursor: pointer;
}
:host .tab-close:hover {
  background: #1a252f;
}

:host input:checked + .tab-label {
  background: #1a252f;
}
:host input:checked + .tab-label::after {
  transform: rotate(-90deg);
}
:host input:checked ~ .tab-content {
  /* max-height: 100vh; */
  padding: 10px;
  display: block;
}
`
                };

                ui.components.accordions.BasicAccordion.prototype.onLoadInstanceStylesheet = function(){ return false }



await require('/src/system/libs/sample_modules/a.mjs')

namespace `ui.screens` (
    class ComponentsDemo extends Application {
        constructor(element){
            super(element);
        }

        async onConnected() {
            await super.onConnected();
        }
    }
);


 })(this)