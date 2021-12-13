namespace `ui.components` (
	class WebComponents extends WebComponent  {
		async onConnected() {
			await super.onConnected();
			this.on('click', e => this.close(e), true, "button");
			this.on('click', e => this.close(e), true, ".overlay");
			this.open = this.open;
			this.open =true
		}

		static get observedAttributes() {
			return ['open'];
		}
		
		attributeChangedCallback(attrName, oldValue, newValue) {
			if (oldValue !== newValue) {
				this[attrName] = this.hasAttribute(attrName);
			}
		}
		
		async connectedCallback() {
			await super.connectedCallback();
			// alert("cool modal")
		}
		
		get open() {
			return this.hasAttribute('open');
		}
		
		
		set open(isOpen) {
			this.querySelector('.wrapper').classList.toggle('open', isOpen);
			this.querySelector('.wrapper').setAttribute('aria-hidden', !isOpen);
			if (isOpen) {
				this._wasFocused = document.activeElement;
				this.setAttribute('open', '');
				document.addEventListener('keydown', e=>this.cancel(e));
				this.focus();
				this.querySelector('button').focus();
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