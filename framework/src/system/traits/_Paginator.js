
namespace `core.traits` (
    class Paginator {
        constructor(options) {
            this.data = options.data;
            this.pageSize = options.pageSize;
            this.currentPage=("currentPage" in options)? options.currentPage:0;
        }

        next(){
            if(this.currentPage==this.totalpages()){this.currentPage--};
            var d = this.data.slice(this.currentPage*this.pageSize, (this.currentPage+1)*this.pageSize);
            this.currentPage++;
            this.dispatchEvent("change", {type: "next", currentPage:this.currentPage});
            this.dispatchEvent("next", {currentPage:this.currentPage});
            return d;
        }

        update(){
            var d = this.data.slice((this.currentPage-1)*this.pageSize, (this.currentPage)*this.pageSize);
            this.dispatchEvent("change", {type: "next", currentPage:this.currentPage});
            return d;
        }

        previous(){
            if(this.currentPage<=1){this.currentPage=1;}
            else{this.currentPage--}
            var previousPage = this.currentPage;
            var d = this.data.slice((previousPage*this.pageSize)-this.pageSize, (previousPage)*this.pageSize);
            this.dispatchEvent("change", {type: "previous", currentPage:this.currentPage});
            this.dispatchEvent("previous", {currentPage:this.currentPage});
            return d;
        }

        current(){
            if(this.currentPage<=1){this.currentPage=1;}
            if(this.currentPage==this.totalpages()){this.currentPage--};
            var d = this.data.slice(this.currentPage*this.pageSize, (this.currentPage+1)*this.pageSize);
            return d;
        }

        pagenumber(){
            return this.currentPage;
        }

        totalpages(){
            return Math.ceil(this.data.length/this.pageSize);
        }

        totalrecords(){
            return this.data.length;//Math.ceil(this.data.length/this.pageSize);
        }

        islastpage(){
            return this.currentPage >= this.totalpages();
        }

        isfirstpage(){
            return this.currentPage <= 1;
        }

        resetindex(){
            this.currentPage = 0;
        }

        first(){
            this.resetindex();
            this.dispatchEvent("change", {type: "first", currentPage:this.currentPage});
            return this.next();
        }

        last(){
            this.currentPage = this.totalpages();
            this.dispatchEvent("change", {type: "last", currentPage:this.currentPage});
        }

        resizepage(size){
            this.pageSize = size || this.pageSize;
            this.resetindex();
            this.dispatchEvent("change", {type: "resize", currentPage:this.currentPage});
        }

        pagesize(){
            return this.pageSize;
        }
    }
);

traits(core.traits.Paginator,[new Observer]);