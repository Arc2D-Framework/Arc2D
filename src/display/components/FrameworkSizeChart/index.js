namespace `display.components` (
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
                    data: [10,122,304,173]
                }, {
                    label: 'Non-Optimized',
                    backgroundColor: 'rgb(255, 134, 35)',
                    yAxisID: 'y-axis-1',
                    data: [28,418,1091,1343]
                }]
            };
        }


        createChart(){
            const chartInstanceObj = this.querySelector('#sizeChart');
            Chart.defaults.global.defaultFontFamily = "'Poppins', 'Helvetica', 'Arial', sans-serif";
            Chart.defaults.global.animation.easing = 'easeOutBack';
            var chart = new Chart(chartInstanceObj, {
                type: 'bar',
                data: this.barChartData,
                options: {
                    responsiveAnimationDuration: 2000,
                    aspectRatio: this.aspectRatioViewPort(),
                    responsive: true,
                    title: {
                        display: true,
                        text: 'Framework/Library Size Comparison Chart (Kilobytes)',
                        fontSize: 14
                    },
                    tooltips: {
                        titleFontSize: 15,
                        xPadding: 8,
                        yPadding: 8,
                        mode: 'index',
					    intersect: false,
                        callbacks: {
                            label: (tooltipItem, data) => {
                                const value = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
                                return ` ${data.datasets[tooltipItem.datasetIndex].label}: ${this.numberWithCommas(value)} kB`
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
                        yAxes: [{
                            type: 'linear',
                            display: true,
                            position: 'left',
                            id: 'y-axis-1'
                        },{
                            type: 'linear',
                            display: true,
                            position: 'left',
                            id: 'y-axis-1',
                            gridLines: {
                                drawOnChartArea: true,
                                color: 'rgba(200, 200, 200, 0.40)',
							    lineWidth: 1
                            }
                        }],
                        xAxes: [{
                            gridLines: {
                                color: 'rgba(200, 200, 200, .40)',
                                lineWidth: 1,
                                zeroLineWidth: 0
                            }
                        }],
                    }
                }
            });
        }

        aspectRatioViewPort(){
            return (window.matchMedia('(max-width: 480px)').matches) ? 1 : 1.5;
        }

        onHoverCustomToolTipMsgs(tooltipItem){
            for(let item of tooltipItem)
                return (item.label == "ReactJS") ? "\n*This is excluding Redux, Babel,\nWebpack and any other needed\ndependencies" :
                    (item.label == "VueJS") ? "\n*This is excluding Babel, Webpack \nand any other needed dependencies" :
                    (item.label == "AngularJS") ? "\n*This is excluding workspace\nnpm dependencies, dev dependencies,\nangular packages & support packages" : null;
        }

        numberWithCommas(num){
            return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }

        template(){
            return `<template>
                        <div>
                            <canvas id="sizeChart" style="width: 100%;"></canvas>
                        </div>
                    </template>`;
        }

        cssStyle(){
            return `
                .FrameworkSizeChart {
                    visibility: visible;
                }
            `;
        }

        onLoadInstanceStylesheet(){
            return false;
        }
    }
)