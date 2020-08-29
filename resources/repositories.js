


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
    EMPLOYEES: {
        config : {
            table: "employees"
        },
        dev: Config.ROOTPATH + "resources/data/employees.json",
        staging: Config.ROOTPATH + "resources/data/employees.json",
        test : Config.ROOTPATH + "resources/data/employees.json",
        prod : Config.ROOTPATH + "resources/data/employees.json"
    }
}

