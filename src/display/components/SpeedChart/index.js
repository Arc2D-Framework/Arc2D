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
						backgroundColor: 'rgb(233, 214, 27)',
						data: [1.00, 1.00, 1.00, 1.00],
						pointHitRadius: 50,
						borderColor: 'rgba(255, 255, 255, 0.5)',
						pointBorderColor: 'rgb(233, 214, 27)',
						pointHoverRadius: 8,
						borderWidth: 1,
						pointBorderWidth: 2,
					}, {
						label: 'Arc2D',
						backgroundColor: 'rgb(0, 83, 163)',
						data: [1.08, 1.00, 1.32, 1.12],
						pointHitRadius: 50,
						borderColor: 'rgba(255, 255, 255, 0.5)',
						pointBorderColor: 'rgb(0, 83, 163)',
						pointHoverRadius: 8,
						borderWidth: 1,
						pointBorderWidth: 2,
					}, {
						label: 'VueJS',
						backgroundColor: 'rgb(63, 178, 127)',
						data: [1.17, 3.52, 1.40, 1.80],
						pointHitRadius: 50,
						borderColor: 'rgba(255, 255, 255, 0.5)',
						pointBorderColor: 'rgb(63, 178, 127)',
						pointHoverRadius: 8,
						borderWidth: 1,
						pointBorderWidth: 2,
						
					}, {
						label: 'ReactJS',
						backgroundColor: 'rgb(94, 211, 243)',
						data: [1.33, 4.19, 1.74, 2.13],
						pointHitRadius: 50,
						borderColor: 'rgba(255, 255, 255, 0.5)',
						pointBorderColor: 'rgb(94, 211, 243)',
						pointHoverRadius: 8,
						borderWidth: 1,
						pointBorderWidth: 2,
					}, {
						label: 'Angular',
						backgroundColor: 'rgb(216, 45, 47)',
						data: [1.48, 13.94, 1.97, 3.44],
						pointHitRadius: 50,
						borderColor: 'rgba(255, 255, 255, 0.5)',
						pointBorderColor: 'rgb(216, 45, 47)',
						pointHoverRadius: 8,
						borderWidth: 1,
						pointBorderWidth: 2,
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
						// caretSize: 5,
						mode: 'index',
						intersect: false,
						// cornerRadius: 2,
						xPadding: 10,
						yPadding: 10,
						callbacks: {
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
						borderWidth: 1,
						xAxes: [{
							scaleLabel: {
								display: false,
								labelString: 'Month'
							},
							ticks: {
								fontSize: this.xAxesFontSize()
							},
							gridLines: {
								zeroLineWidth: 0
							}
						}],
						yAxes: [{
							stacked: true,
							scaleLabel: {
								display: true,
								labelString: 'Benchmark Score Result',
								fontSize: 14
							},
							gridLines: {
								zeroLineWidth: 0
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
	}
)