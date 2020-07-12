

namespace `core.ui` (
    class TestProtected extends w3c.ui.ProtectedComponent{
        constructor (element){
            super(element);
        }

        onConnected(){
            firebase.auth().onAuthStateChanged(user => {
              if (user) {
                this.render()
              } else {
                console.warn(this.namespace + "#onConnected() - did not render. Need to login")
              }
            })
        }


        inShadow() {
            return false
        }
    }
);
