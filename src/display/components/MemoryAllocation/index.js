namespace `display.components` (
	class MemoryAllocation  extends w3c.ui.WebComponent  {
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
					labels: [['Ready', 'Memory'], 'Run Memory', ['Update Each', '10th Row For', '1k Rows (5 Cycles)'], ['Replace 1k', 'Rows (5 Cycles)'], ['Creating/Clearing', '1k Rows, (5 Cycles)'], ['Geometric', 'Mean']],
					datasets: [{
						label: 'Vanilla JS',
						backgroundColor: 'rgb(233, 214, 27)',
						data: [1.00, 1.00, 1.00, 1.00, 1.00, 1.00],
						pointHitRadius: 50,
						borderColor: 'rgb(233, 214, 27)',
						pointBorderColor: 'rgb(233, 214, 27)',
						pointHoverRadius: 8,
						borderWidth: 1,
                        pointBorderWidth: 2,
                        yAxisID: 'bm-score',
					}, {
						label: 'Arc2D',
						backgroundColor: 'rgb(0, 83, 163)',
						data: [1.03, 1.12, 1.11, 1.47, 1.22, 1.18],
						pointHitRadius: 50,
						borderColor: 'rgb(0, 83, 163)',
						pointBorderColor: 'rgb(0, 83, 163)',
						pointHoverRadius: 8,
						borderWidth: 1,
                        pointBorderWidth: 2,
                        yAxisID: 'bm-score',
					}, {
						label: 'VueJS',
						backgroundColor: 'rgb(63, 178, 127)',
						data: [1.15, 2.51, 2.28, 2.31, 1.16, 1.78],
						pointHitRadius: 50,
						borderColor: 'rgb(63, 178, 127)',
						pointBorderColor: 'rgb(63, 178, 127)',
						pointHoverRadius: 8,
						borderWidth: 1,
                        pointBorderWidth: 2,
                        yAxisID: 'bm-score',
					}, {
						label: 'ReactJS',
						backgroundColor: 'rgb(94, 211, 243)',
						data: [1.23, 2.72, 2.66, 3.66, 1.60, 2.20],
						pointHitRadius: 50,
						borderColor: 'rgb(94, 211, 243)',
						pointBorderColor: 'rgb(94, 211, 243)',
						pointHoverRadius: 8,
						borderWidth: 1,
                        pointBorderWidth: 2,
                        yAxisID: 'bm-score',
					}, {
						label: 'Angular',
						backgroundColor: 'rgb(216, 45, 47)',
						data: [2.54, 3.21, 2.85, 2.93, 1.91, 2.65],
						pointHitRadius: 50,
						borderColor: 'rgb(216, 45, 47)',
						pointBorderColor: 'rgb(216, 45, 47)',
						pointHoverRadius: 8,
						borderWidth: 1,
                        pointBorderWidth: 2,
                        yAxisID: 'bm-score',
					}]
				},
				options: {
					aspectRatio: this.aspectRatioViewPort(),
					responsive: true,
					title: {
						display: true,
						text: 'Memory Allocation in MBs ± 95% Confidence Interval',
						fontSize: 15
					},
					tooltips: {
						bodySpacing: 5,
						titleFontSize: 15,
						mode: 'index',
						intersect: false,
						xPadding: 10,
						yPadding: 10,
						callbacks: {
							footer: (tooltipItem) => {
                                console.log("tooltipItem",tooltipItem)
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
							ticks: {
								min:0.5
							},
							stacked: false,
							scaleLabel: {
								display: true,
								labelString: 'Benchmark Score Result',
								fontSize: 14
							},
							gridLines: {
								zeroLineWidth: 0
                            },
                            type: 'linear',
                            display: true,
                            position: 'left',
                            id: 'bm-score'
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
			var chart = this.querySelector('#memory-chart').getContext('2d');
		
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
                return (item.label == "Ready,Memory") ? "\n*Memory usage after page load." :
                    (item.label == "Run Memory") ? "\n*Memory usage after adding 1000 rows." :
					(item.label == "Update Each,10th Row For,1k Rows (5 Cycles)") ? "\n*Memory usage after clicking update every 10th\nrow 5 times." :
                    (item.label == "Replace 1k,Rows (5 Cycles)") ? "\n*Memory usage after clicking\ncreate 1000 rows 5 times." :
                    (item.label == "Creating/Clearing,1k Rows, (5 Cycles)") ? "\n*Memory usage after creating and clearing 1000\nrows 5 times." :
                    "\n*Geometric Mean of all\nfactors in the table.";
        }

		aspectRatioViewPort(){
            return (window.matchMedia('(max-width: 480px)').matches) ? 1 : 1.3;
		}

		xAxesFontSize(){
			return (window.matchMedia('(max-width: 480px)').matches) ? 9 : 12;
		}
		
		template(){
            return `<template>
                        <div>
                            <canvas id="memory-chart" style="width: 100%;"></canvas>
                        </div>
                    </template>`;
		}
		
		onLoadInstanceStylesheet(){
            return false;
		}
	}
)