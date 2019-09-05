import '/src/core/models/Collection.js';
import '/src/core/drivers/storage/MockStorageDevice.js';
import '/src/core/drivers/storage/OpenWeatherDevice.js';

namespace('core.models.WeatherDays', class extends core.models.Collection {
    @public device_driver = "core.drivers.storage.OpenWeatherDevice";
    @public seeds = ROUTES.DATA.WEATHER_DAYS;

    constructor(...items) {
        super(...items);
    }

    isSeedable() {
        return false;
    }

    async current(cb, query) {
        const response = await fetch("http://api.openweathermap.org/data/2.5/forecast?lat=27.967206&lon=-81.5887347&appid=cf27fb714ecb7fc8280461822b491d59&units=imperial");
        const res = await response.json();//.then((res) =>{ console.log(res); return res; }) }catch(err){ console.error("Error: ", err) } }
        return res;
    }

    async forecast(cb, query) {
        var days = {};

        const response = await fetch("http://api.openweathermap.org/data/2.5/forecast?lat=27.967206&lon=-81.5887347&appid=cf27fb714ecb7fc8280461822b491d59&units=imperial");
        const res = await response.json();//.then((res) =>{ console.log(res); return res; }) }catch(err){ console.error("Error: ", err) } }
        for (var i = 0; i <= res.list.length - 1; i++) {
            var day = res.list[i];
            var date = day.dt_txt.split(" ")[0];
            days[date] = days[date] || [];
            days[date].push(day)
        }
        return days;
    }

    async average_forecast() {
        var days = await this.forecast();
        var avg_days = {};
        // console.log("Average Temp: ", days);
        // return days;
        console.log("days", days)
        for (const key of Object.keys(days)) {

            var day = days[key];
            var current_day_min = 0;
            var current_day_max = 0;
            for (let hour of day) {
                current_day_min += hour.main.temp_min;
                current_day_max += hour.main.temp_max;
            }
            current_day_min = current_day_min / day.length;
            current_day_max = current_day_max / day.length;

            avg_days[key] = {
                avg_temp_min: current_day_min,
                avg_temp_max: current_day_max,
                data: day
            }

            current_day_min = 0;
            current_day_max = 0;
        }
        console.log("ave days", avg_days)
    }
});
