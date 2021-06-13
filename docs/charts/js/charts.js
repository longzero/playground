// Second row of color is just the first row duplicated.
const colors = ['rgb(229,229,299)', 'rgb(211,53,107)', 'rgb(51,51,51)', 'rgb(118,118,118)', 'rgb(204,156,164)',
'rgb(229,229,299)', 'rgb(211,53,107)', 'rgb(51,51,51)', 'rgb(118,118,118)', 'rgb(204,156,164)']

const chartPie = document.querySelectorAll('[data-chart-type="donut"], [data-chart-type="pie"]')
if (chartPie) {
  for (let i = 0; i < chartPie.length; i++) {
    let chartValue = chartPie[i].querySelectorAll('[data-chart-value]')
    // background: conic-gradient(rgb(229,229,299) 0 54%, rgb(211,53,107) 0 75%, rgb(51,51,51) 0 86%, rgb(118,118,118) 0 97%, rgb(204,156,164) 0 0%);
    let chartData = ''
    let cumulativeValue = 0
    for (let j = 0; j < chartValue.length; j++) {
      if (chartData != '') chartData += ', '
      cumulativeValue = parseFloat(cumulativeValue) + parseFloat(chartValue[j].dataset.chartValue)
      chartData += colors[j] + ' 0 ' + cumulativeValue + '%'
    }
    // let chartDraw = 'background: conic-gradient(' + chartData + ');'
    let chartDraw = 'conic-gradient(' + chartData + ')'
    // console.warn(chartDraw)
    // console.log("conic-gradient(rgb(229,229,299) 0 54%, rgb(211,53,107) 0 75%, rgb(51,51,51) 0 86%, rgb(118,118,118) 0 97%, rgb(204,156,164) 0 0%)")
    chartPie[i].querySelector('.chart-graphic').style.backgroundImage = chartDraw
  }
}

console.log("charts.js loaded")
