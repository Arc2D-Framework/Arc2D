namespace `display.components` (
	class SpeedChart  extends w3c.ui.WebComponent  {
		constructor(){
            super();
        }
        
        async onConnected(){
            await super.onConnected();
            this.initBarData();
            this.createChart();
        }

        onLoadInstanceStylesheet(){
            return false;
		}

		initBarData(){
			var lineGraph = {
				type: 'line',
				data: {
					labels: ['Consistently Interactive', 'Script Bootup Time', 'Total Kilobyte Weight', 'Geometric Mean'],
					datasets: [{
						label: 'Vanilla JS',
						borderColor: 'rgb(233, 214, 27)',
						backgroundColor: 'rgb(233, 214, 27)',
						data: [1.00, 1.00, 1.00, 1.00],
					}, {
						label: 'Arc2D',
						borderColor: 'rgb(0, 83, 163)',
						backgroundColor: 'rgb(0, 83, 163)',
						data: [1.08, 1.00, 1.32, 1.12],
					}, {
						label: 'VueJS',
						borderColor: window.chartColors.green,
						backgroundColor: window.chartColors.green,
						data: [1.17, 3.52, 1.40, 1.80],
					}, {
						label: 'ReactJS',
						borderColor: window.chartColors.yellow,
						backgroundColor: window.chartColors.yellow,
						data: [1.33, 4.19, 1.74, 2.13],
					}, {
						label: 'Angular',
						borderColor: window.chartColors.yellow,
						backgroundColor: window.chartColors.yellow,
						data: [1.48, 13.94, 1.97, 3.44],
					}]
				},
				options: {
					aspectRatio: this.aspectRatioViewPort(),
					responsive: true,
					title: {
						display: true,
						text: 'Startup metrics (Lighthouse with Mobile Simulation)'
					},
					tooltips: {
						titleFontSize: 15,
						caretSize: 5,
						mode: 'index',
						intersect: false,
						cornerRadius: 2,
						xPadding: 10,
						yPadding: 10,
						callbacks: {
							label: (tooltipItem, data) => {
								const value = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
								return ` ${data.datasets[tooltipItem.datasetIndex].label}: ${this.numberWithCommas(value)}`
							},
							footer: (tooltipItem) => {
								return this.onHoverCustomToolTipMsgs(tooltipItem);
							}
						}
					},
					hover: {
						mode: 'nearest',
						intersect: true
					},
					scales: {
						xAxes: [{
							scaleLabel: {
								display: false,
								labelString: 'Month'
							}
						}],
						yAxes: [{
							stacked: true,
							scaleLabel: {
								display: false,
								labelString: 'Value'
							}
						}]
					}
				}
			};

			this.lineGraph = {
				data: lineGraph.data,
				options: lineGraph.options
			}
		}

		createChart() {
			var chart = this.querySelector('#speed-chart').getContext('2d');
		
			Chart.defaults.global.defaultFontFamily = "'Poppins', 'Helvetica', 'Arial', sans-serif";
			Chart.defaults.global.animation.easing = 'easeOutBack';
			var chartInstance = new Chart(chart, {
				type: 'line',
				data: this.lineGraph.data,
				options: this.lineGraph.options
			});
		}

		aspectRatioViewPort(){
            return (window.matchMedia('(max-width: 480px)').matches) ? 1 : 1.5;
        }
		
		template(){
            return `<template>
                        <div>
                            <canvas id="speed-chart" style="width: 100%;"></canvas>
                        </div>
                    </template>`;
        }

        // cssStyle(){
            
        // }
	}
)