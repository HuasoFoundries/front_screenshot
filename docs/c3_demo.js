function drawgraph() {

    var chart = c3.generate({
        bindto: '#c3graph',
        axis: {
            x: {
                type: 'category',
                tick: {
                    rotate: 45,
                    multiline: false
                    //,values: ['tick 1', 'tick 2', 'tick 3', 'tick 4', 'tick 5', 'tick 6']
                },
                height: 40
            }
        },
        data: {
            x: 'x',
            columns: [
                ['x', 'tick 1', 'tick 2', 'tick 3', 'tick 4', 'tick 5', 'tick 6'],
                ['data1', 30, 20, 50, 40, 60, 50],
                ['data2', 200, 130, 90, 240, 130, 220],
                ['data3', 300, 200, 160, 400, 250, 250],
                ['data4', 200, 130, 90, 240, 130, 220],
                ['data5', 130, 120, 150, 140, 160, 150],
                ['data6', 90, 70, 20, 50, 60, 120],
            ],
            type: 'bar',
            types: {
                data3: 'spline',
                data4: 'line',
                data6: 'area',
            },
            groups: [
                ['data1', 'data2']
            ]
        }
    });
}
