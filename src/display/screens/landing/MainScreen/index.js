
namespace `display.screens.landing` (
    class MainScreen extends Application {
        constructor(element){
            super(element);
        }

        async onConnected() {
            await super.onConnected();

            // this.headingContainer = this.querySelector(".heading-container");
            // this.heading1 = "<h1>An Agnostic, W3C/ES6 Compliant <div class='highlight'> 2D World & GUI Engine</div></h1><h5 style='margin-bottom: 33px;'>Native ES6 and HTML5 with time dependent simulation stepper for AI, DOM Physics and 2D Canvas games up to 60fps. No compilers, pre or post processors, no webpack, grunt or babel, no typescript or parsers</h5>";
            // this.heading2 = "<h1>The Dawn of a New Age –<div class='highlight'> Arc2D</div> a Dynamic HTML W3C/ES6 Compliant Framework</h1><h5 style='margin-bottom: 33px;'>Arc2D is a dynamic HTML Framework used for its architecture, building apps, 2D games and more!</h5>";
            // this.heading3 = "<h1>Lorem ipsum dolor sit atmet si <div class='highlight'> Lorem ipsum dolor sit</div></h1><h5 style='margin-bottom: 33px;'>Lorem ipsum dolor sit atmet siLorem ipsum dolor sit atmet siLorem ipsum dolor sit atmet siLorem ipsum dolor sit atmet siLorem ipsum dolor sit atmet siLorem ipsum dolor sit atmet siLorem ipsum dolor sit </h5>";
            // this.headingsArray = [this.heading1, this.heading2, this.heading3];

            // this.randomizeHeading();
            this.initBarData();
            this.createChart();
        }

        // checkScrollPos(){
        //     if(this.isInViewport()){
        //         var chart = new Chart(this.chartInstanceObj, {
        //             // The type of chart we want to create
        //             type: 'bar',
                
        //             // The data for our dataset
        //             data: {
        //                 labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        //                 datasets: [{
        //                     label: 'My First dataset',
        //                     backgroundColor: 'rgb(255, 99, 132)',
        //                     borderColor: 'rgb(255, 99, 132)',
        //                     data: [0, 10, 5, 2, 20, 30, 45]
        //                 }]
        //             },
                
        //             // Configuration options go here
        //             options: {
        //                 responsive: true,
        //                 responsiveAnimationDuration: 2000,
        //                 aspectRatio:1
        //             }
        //         });
        //         this.scroller = undefined;
        //     }
        // }

        // isInViewport() {
        //     const rect = this.chartInstanceObj.getBoundingClientRect();
        //     return (
        //         rect.top >= 0 &&
        //         rect.left >= 0 &&
        //         rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        //         rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        //     );
        // }

        initBarData(){
            this.barChartData = {
                labels: ['Arc2D', 'AngularJS', 'ReactJS', 'VueJS', 'Svelte'],
                datasets: [{
                    label: 'Optimized',
                    backgroundColor: [
                        'rgb(255, 99, 132)',
                        'rgb(255, 99, 132)',
                        'rgb(255, 99, 132)',
                        'rgb(255, 99, 132)',
                        'rgb(255, 99, 132)'
                    ],
                    yAxisID: 'y-axis-1',
                    data: [9,173,150,190,100]
                }, {
                    label: 'Non-Optimized',
                    backgroundColor: 'rgb(255, 99, 132)',
                    yAxisID: 'y-axis-2',
                    data: [27,1343,250,120,150]
                }]
    
            };
        }

        createChart() {
            this.chartInstanceObj = this.querySelector('#myChart');
            var chart = new Chart(this.chartInstanceObj, {
                type: 'bar',
                data: this.barChartData,
                options: {
                    responsiveAnimationDuration: 2000,
                    aspectRatio: 1.5,
                    responsive: true,
                    title: {
                        display: true,
                        text: 'Framework/Library Size Comparison Chart (Kilobytes)'
                    },
                    tooltips: {
                        mode: 'index',
                        intersect: true,
                        callbacks: {
                            label: (tooltipItem, data) => {
                                const value =
                                    data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
                                return data.datasets[tooltipItem.datasetIndex].label + ": " + this.numberWithCommas(value);
                            }
                        }
                    },
                    scales: {
                        yAxes: [{
                            type: 'linear',
                            display: true,
                            position: 'left',
                            id: 'y-axis-1'
                        }, {
                            type: 'linear',
                            display: true,
                            position: 'right',
                            id: 'y-axis-2',
                            gridLines: {
                                drawOnChartArea: false
                            }
                        }],
                    }
                }
            });
            console.log("chart",chart);
        }

        numberWithCommas(num){
            return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }

        // randomizeHeading() {
        //     this.headingContainer.innerHTML = this.headingsArray[Math.floor(Math.random() * this.headingsArray.length)];
        // }
    }
);
