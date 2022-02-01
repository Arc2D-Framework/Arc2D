


REPOSITORIES = {  
    MOVIES: {
        config : {
            table: "movies"
        },
        dev: Config.ROOTPATH + "resources/data/movies.json",
        staging: Config.ROOTPATH + "resources/data/movies.json",
        test : Config.ROOTPATH + "resources/data/movies.json",
        prod : Config.ROOTPATH + "resources/data/movies.json"
    },

    FOODS: {
        config : {
            table: "foods"
        },
        dev: Config.ROOTPATH + "resources/data/foods.json",
        staging: Config.ROOTPATH + "resources/data/foods.json",
        test : Config.ROOTPATH + "resources/data/foods.json",
        prod : Config.ROOTPATH + "resources/data/foods.json"
    }
}

