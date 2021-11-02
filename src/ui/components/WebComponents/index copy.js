
namespace `ui.components` (
	class WebComponents extends WebComponent  {
		static get observedAttributes() {
			return ['open'];
		}

		constructor() {
			super();
			this.attachShadow({ mode: 'open' });
		}
		
		attributeChangedCallback(attrName, oldValue, newValue) {
			if (oldValue !== newValue) {
			this[attrName] = this.hasAttribute(attrName);
			}
		}
		
		connectedCallback() {
			this.shadowRoot.innerHTML = `
			<style>
				.wrapper {
					opacity: 0;
					transition: visibility 0s, opacity 0.25s ease-in;
				}
				.wrapper:not(.open) {
					visibility: hidden;
				}
				.wrapper.open {
					align-items: center;
					display: flex;
					justify-content: center;
					height: 100vh;
					position: fixed;
					top: 0;
					left: 0;
					right: 0;
					bottom: 0;
					opacity: 1;
					visibility: visible;
				}
				.overlay {
					background: rgba(0, 0, 0, 0.8);
					height: 100%;
					position: fixed;
					top: 0;
					right: 0;
					bottom: 0;
					left: 0;
					width: 100%;
				}
				.dialog {
					background: #ffffff;
					max-width: 600px;
					padding: 1rem;
					position: fixed;
				}
				button {
					all: unset;
					cursor: pointer;
					font-size: 1.25rem;
					position: absolute;
					top: 1rem;
					right: 1rem;
				}
				button:focus {
					border: 2px solid blue;
				}
			</style>

			<div class="wrapper">
				<div class="overlay"></div>
				<div class="dialog" role="dialog" aria-labelledby="title" aria-describedby="content">
					<button class="close" aria-label="Close">✖️</button>
					<h1 id="title">Hello world</h1>
					<div id="content" class="content">
						<p>This is content in the body of our modal</p>
					</div>
				</div>
			</div>
			`;
			
			
			this.shadowRoot.querySelector('button').addEventListener('click', e => this.close(e));
			this.shadowRoot.querySelector('.overlay').addEventListener('click', e => this.close(e));
			this.open = this.open;
			this.open =true
		}
		
		disconnectedCallback() {
			// this.shadowRoot.querySelector('button').removeEventListener('click', e => this.close(e));
			// this.shadowRoot.querySelector('.overlay').removeEventListener('click', e => this.close(e));
		}
		
		get open() {
			return this.hasAttribute('open');
		}
		
		
		set open(isOpen) {
			this.shadowRoot.querySelector('.wrapper').classList.toggle('open', isOpen);
			this.shadowRoot.querySelector('.wrapper').setAttribute('aria-hidden', !isOpen);
			if (isOpen) {
				this._wasFocused = document.activeElement;
				this.setAttribute('open', '');
				document.addEventListener('keydown', e=>this.cancel(e));
				this.focus();
				this.shadowRoot.querySelector('button').focus();
			} else {
				this._wasFocused && this._wasFocused.focus && this._wasFocused.focus();
				this.removeAttribute('open');
				document.removeEventListener('keydown', e=>this.cancel(e));
				this.close();
			}
		}
		
		
		close() {
			if (this.open !== false) {
				this.open = false;
			}
			const closeEvent = new CustomEvent('dialog-closed');
			this.dispatchEvent(closeEvent);
		}
		
		cancel(e) {
			if (e.key === 'Escape') {
				this.close();   
			}
		}
	}
)