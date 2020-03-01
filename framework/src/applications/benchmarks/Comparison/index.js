
namespace `applications.benchmarks` (
    @tag("benchmark-comparison");
    class Comparison extends w3c.ui.Application {
        async onConnected() {
            await this.render();
            this.draw()
        }

        draw(){
            var ctx = this.querySelector('#myChart').getContext('2d');
            var myChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['Rendering', 'Sorting', 'Other'],
                    datasets: [
                        {
                            label: 'Arc',
                            backgroundColor: 'rgb(255, 99, 132)',
                            borderColor: 'rgb(255, 99, 132)',
                            data: [5, 2, 10]
                        },
                        {
                            label: 'React',
                            backgroundColor: 'rgb(155, 99, 132)',
                            borderColor: 'rgb(255, 99, 132)',
                            data: [5, 2, 10]
                        },
                        {
                            label: 'Angular',
                            backgroundColor: 'rgb(155, 200, 132)',
                            borderColor: 'rgb(255, 99, 132)',
                            data: [5, 2, 10]
                        }
                    ]
                }
            });
        }
    }
);
