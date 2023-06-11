namespace `domain.services` (
    class Meld {
        static async GetLessonData(curriculumID) {
            var response = await fetch(`/resources/meld/services/GetLessonData.asmx?curriculumID=${curriculumID}`, {
                method: "GET",
                cache: "no-cache",
                headers: {
                    "Content-Type": "application/json"
                }
                // body: JSON.stringify({curriculumID})
            });

            if(response && response.ok) {
                return await this.toJson(response);
            }
        }

        static async GetMuseFrameData(frameID) {
            var response = await fetch(`/resources/meld/services/GetMuseFrameData_${frameID}.asmx?frameID=${frameID}`, {
                method: "GET",
                cache: "no-cache",
                headers: {
                    "Content-Type": "application/json"
                }
                // body: JSON.stringify({curriculumID})
            });
            if(response && response.ok) {
                return await this.toJson(response);
            }
        }

        static async toJson(response) {
            var string = await response.text();
            var json = string === "" ? {} : JSON.parse(string);
            return json;
        }
    }
)