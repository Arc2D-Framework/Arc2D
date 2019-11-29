
namespace`core.drivers.storage` (
    class OpenWeatherDevice {
        constructor() {}

        setCollection(name) {
            this.collection_name = name.toLowerCase();
        }


        weather(cb, query) {
            debugger;
            query = JSON.stringify(query || {});
            var xhr = new XMLHttpRequest();
            xhr.addEventListener("readystatechange", function () {
                if (this.readyState === 4) {
                    // alert(this.responseText)
                    var res = this.responseText;
                    var c = new core.drivers.storage.Cursor({
                        all: function () {
                            return JSON.parse(res);
                        }
                    });
                    cb(c, null)
                }
            });
            xhr.open("GET", "http://api.openweathermap.org/data/2.5/weather?lat=27.967206&lon=-81.5887347&appid=cf27fb714ecb7fc8280461822b491d59&units=imperial");
            xhr.setRequestHeader("content-type", "application/json");
            // xhr.setRequestHeader("x-apikey", "5bd6ef18cb62286429f4ef19");
            xhr.setRequestHeader("cache-control", "no-cache");

            xhr.send(null);
        }

    }
);
