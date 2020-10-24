namespace `display.components` (
	class LinesOfCodeChart  extends w3c.ui.WebComponent  {
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
			var chart = document.getElementById('loc-chart').getContext('2d');
			var gradient = chart.createLinearGradient(0, 0, 0, 450);

			gradient.addColorStop(0.05, 'rgba(26, 198, 255, 0.5)');
			gradient.addColorStop(0.5, 'rgba(62, 62, 155, 0.20)');
			gradient.addColorStop(1, 'rgba(26, 198, 255, 0.30)');

            var data = {
				labels: ['Arc2D', 'VueJS', 'ReactJS', 'AngularJS'],
				datasets: [{
					label: 'Lines of Code',
					backgroundColor: gradient,
					borderWidth: 0,
					borderColor: '#fff',
					pointBorderColor: "#1ac6ff",
					pointBackgroundColor: "#1ac6ff",
					pointBorderWidth: 2,
					pointHoverRadius: 10,
					pointHoverBorderWidth: 1,
					pointRadius: 3,
					pointHitRadius: 100,
					data: [1316, 15029, 31540, 48295]
				}]
			};

			var options = {
				responsive: true,
				aspectRatio: this.aspectRatioViewPort(),
				scales: {
					xAxes: [{
						gridLines: {
							color: 'rgba(200, 200, 200, .3)',
							lineWidth: 1,
							zeroLineWidth: 0
						}
					}],
					yAxes: [{
						gridLines: {
							color: 'rgba(200, 200, 200, 0.3)',
							lineWidth: 1
						}
					}]
				},
				legend: {
					display: false
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
				}
			};
			
			this.lineGraph = {
				data: data,
				options: options
			}
		}
		
		createChart() {
			var chart = document.getElementById('loc-chart').getContext('2d');
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

        onHoverCustomToolTipMsgs(tooltipItem){
            for(let item of tooltipItem)
                return (item.label == "ReactJS") ? "\n*These results were based on the React Library,\nReact-DOM, React Router and could vary\ndepending on any other needed dependencies." :
                    (item.label == "VueJS") ? "\n*These results were based on the VueJS Library,\nVue Router and could vary depending on\nany other needed dependencies." :
					(item.label == "AngularJS") ? "\n*These results were based on the AngularJS\nFramework, Angular Route, Angular-UI-Router\nand could vary depending on any other needed\ndependencies." :
					"\n*These results were based on the entire\nArc Framework including its router and\n2 dependencies."
        }

        numberWithCommas(num){
            return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
		
		template(){
            return `<template>
                        <div>
                            <canvas id="loc-chart" style="width: 100%;"></canvas>
                        </div>
                    </template>`;
        }

        cssStyle(){
            return `
                .LinesOfCodeChart {
					visibility: hidden;
                }
            `;
        }
	}
)