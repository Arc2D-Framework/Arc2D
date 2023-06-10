namespace `domain.services` (
    class Meld {
        static async GetLessonData(curriculumID) {
            return await (await fetch(`/resources/meld/services/GetLessonData.asmx?curriculumID=${curriculumID}`, {
                method: "GET",
                cache: "no-cache",
                headers: {
                    "Content-Type": "application/json"
                }
                // body: JSON.stringify({curriculumID})
            })).json();
        }

        static async GetMuseFrameData(frameID) {
            return await (await fetch(`/resources/meld/services/GetMuseFrameData_${frameID}.asmx?frameID=${frameID}`, {
                method: "GET",
                cache: "no-cache",
                headers: {
                    "Content-Type": "application/json"
                }
                // body: JSON.stringify({curriculumID})
            })).json();
        }
    }
)