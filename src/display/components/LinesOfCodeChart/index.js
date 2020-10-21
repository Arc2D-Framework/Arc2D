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
            this.barChartData = {
				labels: [ 'Arc2D', 'VueJS', 'ReactJS', 'AngularJS'],
				datasets: [{
						label: 'Lines of Code',
						backgroundColor: this.gradient,
						pointBackgroundColor: 'white',
						borderWidth: 2,
						borderColor: '#1ac6ff',
						data: [1316, 15029, 31540, 48295]
				}]
			};
		}

		createChart() {
			this.chartInstanceObj = this.querySelector('#loc-chart').getContext('2d');
			this.gradient = this.chartInstanceObj.createLinearGradient(0, 0, 0, 0);
			this.gradient.addColorStop(0, 'rgba(26, 198,255, 0.5)');
			this.gradient.addColorStop(0.5, 'rgba(26, 198,255, 0.25)');
			this.gradient.addColorStop(1, 'rgba(26, 198,255, 0)');

            Chart.defaults.global.defaultFontFamily = "'Poppins', 'Helvetica', 'Arial', sans-serif";
            Chart.defaults.global.animation.easing = 'easeOutBack';
            var loc_chart = new Chart(this.chartInstanceObj, {
                type: 'line',
                data: this.barChartData,
                options: {
					responsive: true,
					responsiveAnimationDuration: 2000,
                    aspectRatio: this.aspectRatioViewPort(),
					animation: {
						easing: 'easeInOutQuad',
						duration: 520
					},
					scales: {
						xAxes: [{
							gridLines: {
								color: 'rgba(200, 200, 200, 0.05)',
								lineWidth: 1
							}
						}],
						yAxes: [{
							gridLines: {
								color: 'rgba(200, 200, 200, 0.08)',
								lineWidth: 1
							}
						}]
					},
					// elements: {
					// 	line: {
					// 		tension: 0.4
					// 	}
					// },
					legend: {
						display: false
					},
					// point: {
					// 	backgroundColor: 'white'
					// },
					tooltips: {
						// titleFontFamily: 'Open Sans',
						// backgroundColor: 'rgba(0,0,0,0.3)',
						// titleFontColor: 'red',
						// caretSize: 5,
						// cornerRadius: 2,
						xPadding: 10,
						yPadding: 10,
						titleFontSize: 15,
						callbacks: {
                            label: (tooltipItem, data) => {
                                const value = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
                                return `${data.datasets[tooltipItem.datasetIndex].label}: ${this.numberWithCommas(value)}`
                            },
                            footer: (tooltipItem) => {
                                return this.onHoverCustomToolTipMsgs(tooltipItem);
                            }
                        }
					}
				}
            });
        }

		aspectRatioViewPort(){
            return (window.matchMedia('(max-width: 480px)').matches) ? 1 : 1.5;
        }

        onHoverCustomToolTipMsgs(tooltipItem){
            for(let item of tooltipItem)
                return (item.label == "ReactJS") ? "\n*These results were based on React Library,\nReact-DOM, React Router and could vary\ndepending on any other needed dependencies" :
                    (item.label == "VueJS") ? "\n*These results were based on VueJS Library,\nVue Router and could vary depending on\nany other needed dependencies" :
					(item.label == "AngularJS") ? "\n*These results were based on AngularJS\nFramework, Angular Route, Angular-UI-Router\nand could vary depending on any other needed\ndependencies" :
					"*These results were based on the entire Arc Framework including it's router and 2 dependencies."
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
                    visibility: visible;
                }
            `;
        }
	}
)