namespace `core.ui` (
	class FrameworkSizeChart extends w3c.ui.WebComponent  {
		constructor(){
            super();
		}
		
		async onConnected(){
            await super.onConnected();
			this.initBarData();
			this.createChart();
		}
		
		initBarData(){
            this.barChartData = {
                labels: ['Arc2D', 'VueJS', 'ReactJS', 'AngularJS'],
                datasets: [{
                    label: 'Optimized',
                    backgroundColor: 'rgb(26, 198, 255)',
                    yAxisID: 'y-axis-1',
                    data: [9,92,304,173]
                }, {
                    label: 'Non-Optimized',
                    backgroundColor: 'rgb(255, 134, 35)',
                    yAxisID: 'y-axis-2',
                    data: [46,335,1091,1343]
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
						text: 'Framework/Library Size Comparison Chart (Kilobytes)',
						fontSize: 14
                    },
                    tooltips: {
                        mode: 'index',
                        intersect: true,
                        callbacks: {
							label: (tooltipItem, data) => {
								const value = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
								return (data.datasets[tooltipItem.datasetIndex].label == "Optimized") ?
									`${data.datasets[tooltipItem.datasetIndex].label} (Left Y-Axis): ${this.numberWithCommas(value)} kB` :
									`${data.datasets[tooltipItem.datasetIndex].label} (Right Y-Axis): ${this.numberWithCommas(value)} kB`;
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