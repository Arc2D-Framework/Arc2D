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

        onLoadInstanceStylesheet(){
            return false;
        }
        
        initBarData(){
            this.barChartData = {
                labels: ['Arc2D', 'VueJS', 'ReactJS', 'AngularJS'],
                datasets: [{
                    label: 'Optimized',
                    backgroundColor: 'rgb(26, 198, 255)',
                    yAxisID: 'y-axis-1',
                    data: [10,92,304,173]
                }, {
                    label: 'Non-Optimized',
                    backgroundColor: 'rgb(255, 134, 35)',
                    yAxisID: 'y-axis-1',
                    data: [28,335,1091,1343]
                }]
            };
        }

        template(){
            return `<template>
                        <div>
                            <canvas id="myChart" style="width: 100%;"></canvas>
                        </div>
                    </template>`;
        }

        createChart() {
            const chartInstanceObj = this.querySelector('#myChart');
            Chart.defaults.global.defaultFontFamily = "'Poppins', 'Helvetica', 'Arial', sans-serif";
            Chart.defaults.global.animation.easing = 'easeOutBack';
            var chart = new Chart(chartInstanceObj, {
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
                        titleFontSize: 15,
                        xPadding: 8,
                        yPadding: 8,
                        mode: 'index',
                        intersect: true,
                        callbacks: {
                            label: (tooltipItem, data) => {
                                const value = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
                                return `${data.datasets[tooltipItem.datasetIndex].label}: ${this.numberWithCommas(value)} kB`
                            },
                            footer: (tooltipItem, data) => {
                                return this.onHoverCustomToolTipMsgs(tooltipItem);
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
                            position: 'left',
                            id: 'y-axis-1',
                            gridLines: {
                                drawOnChartArea: true
                            }
                        }],
                    }
                }
            });
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
    }
)