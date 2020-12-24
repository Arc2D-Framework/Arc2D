

@tag("about-page");
namespace `display.views` (
	class About extends WebComponent {
		async onConnected(){
            await super.onConnected();
        }

        onLoadInstanceStylesheet(){
            return false;
		}

		cssText(){
			`
				html,
				body {
					margin: 0;
					padding: 0;
					box-sizing: border-box;
					font-family: "Quicksand", sans-serif;
					font-size: 62.5%;
					font-size: 10px;
				}
			`;
        }
        
        template(){
            return `
                <template>
                    <div>
                        <section class="about">
                            <h2 id="headerTxt" class="myH2 animated fadeInLeft">About Us Page</h2>
                        </section>
                        <div style="height: 1000px">
                                <h2 class="myH2">Arc2D SPA Example</h2>
                                <p class="centerP">This is the About Us Page of our SPA Demo.</p>
                                <p class="myP">Pellentesque habitant morbi tristique senectus et netus et 
                                    malesuada fames ac turpis egestas. Vestibulum tortor quam, 
                                    feugiat vitae, ultricies eget, tempor sit amet, ante. Donec 
                                    eu libero sit amet quam egestas semper. Aenean ultricies mi 
                                    vitae est. Mauris placerat eleifend leo. Quisque sit amet est 
                                    et sapien ullamcorper pharetra. Vestibulum erat wisi, condimentum 
                                    sed, commodo vitae, ornare sit amet, wisi. Aenean fermentum, elit 
                                    eget tincidunt condimentum, eros ipsum rutrum orci, sagittis tempus 
                                    lacus enim ac dui. Donec non enim in turpis pulvinar facilisis. Ut felis. 
                                    Praesent dapibus, neque id cursus faucibus, tortor neque egestas augue, 
                                    eu vulputate magna eros eu erat. Aliquam erat volutpat. Nam dui mi, 
                                    tincidunt quis, accumsan porttitor, facilisis luctus, metus
                                </p>
                        </div>
                    </div>
                </template>
            `
        }
	}
);