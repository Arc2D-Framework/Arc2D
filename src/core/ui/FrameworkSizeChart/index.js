namespace `core.ui` (
	class FrameworkSizeChart extends w3c.ui.WebComponent  {
		constructor(){
            super();
		}
		
		async onConnected(){
            // await this.render({});
            await super.onConnected();
            // this.addEventListener("click", (e)=>this.onClick(e), false);
			this.initBarData();
            this.createChart();
		}
		
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
                    data: [46,1343,250,120,150]
                }]
    
            };
        }

        createChart() {
            this.chartInstanceObj = this.querySelector('#myChart');
			Chart.defaults.global.defaultFontFamily = "'Poppins', 'Helvetica', 'Arial', sans-serif";
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
                                return `${data.datasets[tooltipItem.datasetIndex].label}: ${this.numberWithCommas(value)} kB`;
                            }
                        }
                    },
                    scales: {
                        yAxes: [{
                            type: 'linear',
                            display: true,
                            position: 'left',
							id: 'y-axis-1'
                        },{
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
        }

        numberWithCommas(num){
            return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
	}
)