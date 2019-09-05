
ROUTES = {
    DATA:{  
        MOVIES: {
            config : {
                table: "movies"
            },
            dev: Config.ROOTPATH + "resources/data/movies.json",
            staging: Config.ROOTPATH + "resources/data/movies.json",
            test : Config.ROOTPATH + "resources/data/movies.json",
            prod : Config.ROOTPATH + "resources/data/movies.json"
        }
    }
};
