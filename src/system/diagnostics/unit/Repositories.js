import! 'domain.collections.Movies';

@traits([system.diagnostics.UnitTest]);
namespace `system.diagnostics.unit` (
    class Repositories {
        constructor(){
            

        }



        async test (){
            var self=this;
            await domain.collections.Movies.seed();
            


            
            this.expected("cursor object after calling .find()", async (resolve,reject) => {
                var cursor = await domain.collections.Movies.find({
                    query : {},
                    skip:0,
                    limit:10,
                    totals:true
                    // groupby : "genre"
                });

                if(cursor && cursor instanceof Array){
                    resolve(true)
                }
                else {
                    reject("but cursor is", cursor)
                }
            });




            this.expected("cursor object to be empty[] on initial .find()", async (resolve,reject) => {
                var cursor = await domain.collections.Movies.find({
                    query : {},
                    skip:0,
                    limit:10,
                    totals:true
                    // groupby : "genre"
                });

                
                if(cursor && cursor instanceof Array){
                    if(cursor.length<=0){
                        resolve(true)
                    }
                    else {
                        reject("but cursor had results in its array on initial .find()", cursor)
                    }
                }
                else {
                    reject("but cursor is is null/undefined", cursor)
                }
            });


            
            this.expected("cursor object to have >= 7 movies", async (resolve,reject) => {
                var cursor = await domain.collections.Movies.find({
                    query : {},
                    skip:0,
                    limit:10,
                    totals:true
                    // groupby : "genre"
                });
                if(cursor && cursor instanceof Array){
                    if(cursor.count >= 7){
                        resolve(true)
                    }
                    else {
                        reject(`but cursor total record count was ${cursor.length}`)
                    }
                }
                else {
                    reject("but cursor is is null/undefined", cursor)
                }
            });


            this.expected("cursor.next() with limit:2 to return 2 records", async (resolve,reject) => {
                var cursor = await domain.collections.Movies.find({
                    query : {},
                    skip:0,
                    limit:2,
                    totals:true
                    // groupby : "genre"
                });
                await cursor.next();
                if(cursor && cursor.length==2){
                    resolve(true)
                }
                else {
                    reject(`but cursor.next() was ${cursor.length}`, cursor)
                }
            });



            this.expected("cursor.next() with limit:5 to return 5 records", async (resolve,reject) => {
                var cursor = await domain.collections.Movies.find({
                    query : {},
                    skip:0,
                    limit:5,
                    totals:true
                    // groupby : "genre"
                });
                await cursor.next();
                if(cursor && cursor.length==5){
                    resolve(true)
                }
                else {
                    reject(`but cursor.next() was ${cursor.length}`, cursor)
                }
            });


            this.expected("cursor.find() to find 1 record of 'Gladiator' movie", async (resolve,reject) => {
                var cursor = await domain.collections.Movies.find({
                    query : {title:"Gladiator"},
                    skip:0,
                    limit:5,
                    totals:true
                    // groupby : "genre"
                });
                await cursor.next();
                if(cursor && cursor.length==1){
                    if(cursor[0].title == "Gladiator"){
                        resolve(true)
                    }
                    else {
                        reject(`but cursors only result was ${cursor[0].title}`)
                    }
                }
                else {
                    reject(`but cursor.find() was ${cursor.length}`, cursor)
                }
            });



            this.expected("cursor.find() to find 2 records of 'Action' movies when taking only 2 at a time", async (resolve,reject) => {
                var cursor = await domain.collections.Movies.find({
                    query : {genre:"Action"},
                    skip:0,
                    limit:2,
                    totals:true
                    // groupby : "genre"
                });

                await cursor.next();
                if(cursor && cursor.length==2){
                    resolve(true)
                }
                else {
                    reject(`but cursor.find() was ${cursor.length}`, cursor)
                }
            });


            this.expected("cursor.find() to find 2 of 3+ records of 'Action' movies", async (resolve,reject) => {
                var cursor = await domain.collections.Movies.find({
                    query : {genre:"Action"},
                    skip:0,
                    limit:2,
                    totals:true
                    // groupby : "genre"
                });

                await cursor.next();

                if(cursor && cursor.length==2){
                    if(cursor.count >= 3){
                        resolve(true)
                    }
                    else {
                        reject("got 2 action movies on .next() when total should be >= 3")
                    }
                }
                else {
                    reject(`but cursor.find() was ${cursor.length}`, cursor)
                }
            });


        }
        
    }
);