(function($) {

    function formatNumber(number) {
        return String(number).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
    }

    function drawTotal(settings, buf, total) {
        buf.push(
            '<div class="item-total"><span>',
                settings.totalPrefix,
            '</span><span class="number">',
                formatNumber(Math.round(total)),
            '</span><span>',
                settings.totalSuffix,
            '</span></div>'
        );
    }

    //TODO: Revert data order and inner cycles for drawers.
    function drawBars(settings, buf, fill, scale, total) {
        var lenItem = settings.data.length;
        var lenData = settings.data[0].length;
        var i, j, surplus;

        for(i = 0; i < lenItem; i++) {
            buf.push(
                '<div class="chart-item-bar">',

                '<div class="item-label">'
            );
            if (settings.showLabel) {
                buf.push('<span>', settings.label[i], '</span>&nbsp;');
            }
            if (settings.showSubTotal) {
                buf.push('(<span id="', this.id, '-label-', i, '">0</span><span>%)</span>');
            }
            buf.push(
                '</div>',//.item-label

                '<div class="item-data" style="width:', settings.barWidth, ';">'
            );
            for(j = lenData - 1; j>=0; j--) {
                surplus = !j && settings.data[i][j] < 0;
                buf.push('<div class="', settings.style[j]);
                if (surplus) {
                    buf.push(' surplus');
                }
                buf.push('" style="width: 0%;');
                if (surplus) {
                    buf.push('left:', (total[i] - fill[i] - settings.data[i][j]) * scale, '%');
                }
                buf.push('" id="',
                            this.id, '-item-', i, '-', j,
                        '"></div>'
                );
            }
            buf.push(
                '<div class="data-fill" style="width: ', fill[i] * scale, '%;"></div>',
                '</div>'//.item-data
            );

            if (settings.showTotal) {
                drawTotal(settings, buf, total[i]);
            }

            buf.push('</div>'); //.chart-item-bar
        }
    }

    function drawColumns(settings, buf, fill, scale, total) {
        var lenItem = settings.data.length;
        var lenData = settings.data[0].length;
        var i, j, surplus;

        for (i = 0; i < lenItem; i++) {
            if (total[i] != 0) {
                buf.push('<div class="chart-item-col" style="width:', settings.barWidth, ';">');

                if (settings.showTotal) {
                    drawTotal(settings, buf, total[i]);
                }

                buf.push('<div class="item-data" style="height:', settings.barHeight, ';">');
                if (settings.animateFrom == 1) {
                    buf.push('<div class="data-fill" id="', this.id, '-item-', i, '" style="height: 100%;"></div>');
                } else {
                    buf.push('<div class="data-fill" style="height:', fill[i] * scale, '%;"></div>');
                }
                for (j = 0; j < lenData; j++) {
                    surplus = !j && settings.data[i][j] < 0;
                    buf.push('<div class="', settings.style[j]);
                    if (surplus) {
                        buf.push(' surplus');
                    }
                    if (j == settings.animateFrom - 2) {
                        buf.push('" id="', this.id, '-item-', i, '" style="height:100%;');
                    } else {
                        buf.push('" style="height:', Math.abs(settings.data[i][j]) * scale, '%;');
                    }
                    if (surplus) {
                        buf.push('width:100%;top:', fill[i] * scale, '%');
                    }
                    buf.push('"></div>');
                }
                buf.push('</div>');//.item-data

                if (settings.showSubTotal) {
                    buf.push('<div class="item-label-animated"><span id="', this.id, '-label-', i, '">0</span><span>%</span></div>');
                }

                if (settings.showLabel) {
                    buf.push('<div class="item-label">', settings.label[i], '</div>');
                }

                buf.push('</div>');//.chart-item-col
            }
        }
    }

    function drawLegend(settings, buf, total) {
        var lenItem = settings.data.length;
        var i, j, n, legendString;
        buf.push(
            '<table class="chart-legend" style="width: ' + settings.legendWidth + ';">',
                '<tr>',
                    '<td class="chart-legend-title" colspan="3">', settings.legendTitle, '</td>',
                '</tr>'
        );
        var lenLegend = settings.legend.length;
        for(j = 0; j < lenLegend; j++) {
            legendString = settings.legend[j];
            n = 0;
            for(i = 0; i < lenItem; i++) {
                n += settings.data[i][j];
            }
            if (legendString instanceof Array) {
                legendString = legendString[+(n < 0)];
            }
            buf.push('<tr>');
            buf.push(
                    '<td class="chart-legend-background"><div class="', settings.style[j], '"></div></td>',
                    '<td class="chart-legend-label ' + (settings.styleText[j] || '') + '">', legendString, '</td>'
            );
            buf.push('<td class="chart-legend-sub-total">');
            if (settings.showLegendValues) {
                buf.push(
                    '<span>',
                        n > 0 ? '' : '-',
                        settings.totalPrefix,
                    '</span><span class="number">',
                        formatNumber(Math.abs(n)), '</span>'
                );
            }

            buf.push('</td>');
            buf.push('</tr>');
        }
        if (settings.showLegendValues) {
            buf.push(
                    '<tr>',
                        '<td class="chart-legend-background"><div></div></td>',
                        '<td class="chart-legend-label"></td>'
            );
            n = 0;
            for(i = 0; i < lenItem; i++) {
                n += total[i];
            }
            buf.push(
                    '<td class="chart-legend-total"><span>',
                        n > 0 ? '' : '-',
                        settings.totalPrefix,
                    '</span><span class="number">',
                        formatNumber(Math.abs(n)),
                    '</span></td>',
                '</tr>'
            );
        }
        buf.push('</table>');
    }

    $.fn.animatedChart = function(options) {

        // Establish our default settings
        var settings = $.extend({
            data:[],
            label:[],
            style:[],
            styleText:[],
            legend:[],
            legendTitle:'',
            subTotalMax:0,
            chartType:'column',
            barHeight:'300px',
            barWidth:'100px',
            legendWidth:'400px',
            totalSuffix:'',
            totalPrefix:'',
            duration:2500,
            animateFrom:0,
            showLegend:true,
            showLegendValues:true,
            showLabel:true,
            showTotal:true,
            showSubTotal:true,
            complete:null
        }, options);

        return this.each(function() {

            var buf = [];
            var lenItem = settings.data.length;
            var lenData = settings.data[0].length;
            var i, j, n, m, value;

            var max = 0;
            var total = [];
            var subTotal = [];

            for(i = 0; i < lenItem; i++) {
                n = 0;
                m = 0;
                for(j = 0; j < lenData; j++) {
                    //TODO: actually we should identify surplus as required - financed.
                    value = settings.data[i][j];
                    n += value;
                    if (value >= 0) {
                        if (j >= ( lenData - settings.subTotalMax )) {
                            m += value;
                        }
                    }
                }
                total.push(n);
                subTotal.push(m);
                if (n > max) {
                    max = n;
                }
            }
            var scale = 100 / max;

            var fill = [];
            for(i = 0; i < lenItem; i++) {
                fill.push(max - total[i]);
            }

            buf.push('<div class="chart">');

            if (settings.showLegend) {
                buf.push('<div class="chart-content">');
            } else {
                buf.push('<div class="chart-content-no-legend">');
            }

            switch (settings.chartType) {
                case 'bar':
                    drawBars.call(this, settings, buf, fill, scale, total);
                    break;
                case 'column':
                    drawColumns.call(this, settings, buf, fill, scale, total);
                    break;
            }

            buf.push('</div>');//.chart-content

            if (settings.showLegend) {
                drawLegend(settings, buf, total);
            }

            buf.push('</div>');//.chart

            $(this).append(buf.join(''));

            for(i = 0; i < lenItem; i++) {
                var id = '#' + this.id;
                var animateTo = 0;

                if (settings.chartType == 'bar') {
                    for(j = 0; j < lenData; j++) {
                        $(id + '-item-' + i + '-' + j).animate({width:Math.abs(settings.data[i][j]) * scale + '%'}, settings.duration, 'easeOutCubic');
                    }
                } else {
                    if (settings.animateFrom == 1) {
                        animateTo = fill[i] * scale;
                    } else {
                        animateTo = Math.abs(settings.data[i][settings.animateFrom - 2]) * scale;
                    }
                    $(id + '-item-' + i).animate({height:animateTo + '%'}, settings.duration, 'easeOutCubic');
                }

                $(id + '-label-' + i).animateNumbers(Math.round((subTotal[i] / total[i]) * 100), true, settings.duration);
            }

            if ($.isFunction(settings.complete)) {
                settings.complete.call(this);
            }

        });

    };

}(jQuery));
