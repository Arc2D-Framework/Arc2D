(()=> {
  var modulemap = window.modulemap ={};
  window.require = async function importModule(url) {
    var absURL = toAbsoluteURL(url);
    var mod=modulemap[absURL];
    return new Promise(async (resolve, reject) => {
      if (mod) { return resolve(mod)};
      var s1 = document.createElement("script");
          s1.type = "module";
          s1.onerror = () => reject(new Error(`404: ${url}`));
          s1.onload  = () => {
            resolve(modulemap[absURL]);URL.revokeObjectURL(s1.src);s1.remove();
          };
      const loader = `import * as m from "${absURL}"; modulemap['${absURL}'] = m;`;
      const blob = new Blob([loader], { type: "text/javascript" });
      s1.src = URL.createObjectURL(blob);
      document.head.appendChild(s1);
    });
  };
  function supportsDynamicImport() {
    try { new Function('import("")'); return true;} catch (err) {return false;}
  }
})();