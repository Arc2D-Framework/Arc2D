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

		initBarData(){
			var lineGraph = {
				type: 'line',
				data: {
					labels: [['Consistently', 'Interactive'], 'Script Bootup Time', 'Total Kilobyte Weight', ['Geometric', 'Mean']],
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
						borderColor: 'rgb(63, 178, 127)',
						backgroundColor: 'rgb(63, 178, 127)',
						data: [1.17, 3.52, 1.40, 1.80],
					}, {
						label: 'ReactJS',
						borderColor: 'rgb(94, 211, 243)',
						backgroundColor: 'rgb(94, 211, 243)',
						data: [1.33, 4.19, 1.74, 2.13],
					}, {
						label: 'Angular',
						borderColor: 'rgb(216, 45, 47)',
						backgroundColor: 'rgb(216, 45, 47)',
						data: [1.48, 13.94, 1.97, 3.44],
					}]
				},
				options: {
					aspectRatio: this.aspectRatioViewPort(),
					responsive: true,
					title: {
						display: true,
						text: 'Startup Metrics (Lighthouse with Mobile Simulation)',
						fontSize: 15
					},
					tooltips: {
						bodySpacing: 4,
						titleFontSize: 15,
						caretSize: 5,
						mode: 'index',
						intersect: false,
						cornerRadius: 2,
						xPadding: 10,
						yPadding: 10,
						callbacks: {
							// label: (tooltipItem, data) => {
							// 	const value = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
							// 	return ` ${data.datasets[tooltipItem.datasetIndex].label}: ${this.numberWithCommas(value)}`
							// },
							footer: (tooltipItem) => {
								console.log("tooltipItem",tooltipItem);
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
							},
							ticks: {
								fontSize: this.xAxesFontSize()
							}
						}],
						yAxes: [{
							stacked: true,
							scaleLabel: {
								display: true,
								labelString: 'Benchmark Score Result',
								fontSize: 14
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

		onHoverCustomToolTipMsgs(tooltipItem){
            for(let item of tooltipItem)
                return (item.label == "Consistently,Interactive") ? "\n*A pessimistic TTI - when the CPU and\nnetwork are both definitely very idle\n(no more CPU tasks over 50ms)." :
                    (item.label == "Script Bootup Time") ? "\n*The total ms required to parse, compile\n& evaluate all the page's scripts." :
					(item.label == "Total Kilobyte Weight") ? "\n*Network transfer cost (post-compression)\nof all the resources loaded into the page." :
					"\n*The average score based on\nthe following start-up metrics."
        }

		aspectRatioViewPort(){
            return (window.matchMedia('(max-width: 480px)').matches) ? 1 : 1.3;
		}

		xAxesFontSize(){
			return (window.matchMedia('(max-width: 480px)').matches) ? 10 : 12;
		}
		
		template(){
            return `<template>
                        <div>
                            <canvas id="speed-chart" style="width: 100%;"></canvas>
                        </div>
                    </template>`;
		}
		
		onLoadInstanceStylesheet(){
            return false;
		}

        // cssStyle(){
            
        // }
	}
)