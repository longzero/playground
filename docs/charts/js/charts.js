const BREAKPOINT_TABLET = 600;
const BREAKPOINT_TABLET_MAX = BREAKPOINT_TABLET - 1;


// ---------------------------------
// DONUT AND PIE CHARTS
// ---------------------------------

// Second row of color is just the first row duplicated.
const colors = ['rgb(229,229,299)', 'rgb(211,53,107)', 'rgb(51,51,51)', 'rgb(118,118,118)', 'rgb(204,156,164)',
'rgb(229,229,299)', 'rgb(211,53,107)', 'rgb(51,51,51)', 'rgb(118,118,118)', 'rgb(204,156,164)']

// The following code should work for both pie charts and donut charts.
const chartPie = document.querySelectorAll('[data-chart-type="donut"], [data-chart-type="pie"]')
if (chartPie) {
  for (let i = 0; i < chartPie.length; i++) {
    let chartValue = chartPie[i].querySelectorAll('[data-chart-value]') // Get data

    // Example of CSS property if this was hardcoded in CSS.
    // background: conic-gradient(rgb(229,229,299) 0 54%, rgb(211,53,107) 0 75%, rgb(51,51,51) 0 86%, rgb(118,118,118) 0 97%, rgb(204,156,164) 0 0%);

    let chartData = '' // This is the value that goes inside conic-gradient()
    let cumulativeValue = 0 // To avoid seeing a gradient, the value must be added to the previous ones.

    // Loop through each data
    for (let j = 0; j < chartValue.length; j++) {
      if (chartData != '') chartData += ', ' // Before concatenating another value, add a comma.
      cumulativeValue = parseFloat(cumulativeValue) + parseFloat(chartValue[j].dataset.chartValue) // Add to previous cumulative value.
      chartData += colors[j] + ' 0 ' + cumulativeValue + '%' // Build the string that will be part of the CSS value.
    }
    let chartDraw = 'conic-gradient(' + chartData + ')' // This is the final CSS value.
    chartPie[i].querySelector('.chart-graphic').style.backgroundImage = chartDraw // Apply the CSS value.
  }
}



// ---------------------------------
// RESPONSIVE CHARTS
// This should be executed BEFORE other responsive chart stuff.
// ---------------------------------

const responsiveCharts = document.querySelectorAll('[data-chart-responsive=true]')
if (responsiveCharts) {
  const alphabet = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z']
  for (let i = 0; i < responsiveCharts.length; i++) {
    let chartLabels = responsiveCharts[i].querySelectorAll('.chart-data-label')
    if (chartLabels) {

      // Create the container for the legend
      let mobileChartLabel = document.createElement('div')
      mobileChartLabel.classList.add('chart-vertical-labels-mobile')
      mobileChartLabel.setAttribute('aria-hidden', 'true')

      // Loop through labels to add them to the legend
      for (let j = 0; j < chartLabels.length; j++) {

        // This is the symbol for the legend.
        let chartLabelColumn = document.createElement('div')
        chartLabelColumn.classList.add('chart-vertical-labels-mobile__column')
        chartLabelColumn.innerHTML = alphabet[j]
        mobileChartLabel.appendChild(chartLabelColumn)

        // This is the label for the legend.
        let chartLabelLabel = document.createElement('div')
        chartLabelLabel.classList.add('chart-vertical-labels-mobile__label')
        chartLabelLabel.innerHTML = chartLabels[j].innerHTML
        mobileChartLabel.appendChild(chartLabelLabel)

        // Add the symbol (letter) to original labels
        // This should be done last so the symbol is not included in the label for the legend.
        // Result: <span aria-hidden="true">A</span>
        let chartLabelSymbol = document.createElement('span')
        chartLabelSymbol.setAttribute('aria-hidden', 'true')
        chartLabelSymbol.innerHTML = alphabet[j]
        chartLabels[j].prepend(chartLabelSymbol)
      }

      responsiveCharts[i].appendChild(mobileChartLabel) // Add the legend to the chart.
    }
  }
}



// ---------------------------------
// RESPONSIVE DONUT AND PIE CHARTS
// This should be executed AFTER creating legends.
// ---------------------------------

// The following code should work for both pie charts and donut charts.
const chartPieResponsive = document.querySelectorAll('[data-chart-type="donut"][data-chart-responsive=true], [data-chart-type="pie"][data-chart-responsive=true]')
if (chartPieResponsive) {
  for (let i = 0; i < chartPieResponsive.length; i++) {
    // console.log(chartPieResponsive[i])
    // console.log(i)
    if (document.documentElement.clientWidth < BREAKPOINT_TABLET) {
      let chartClass = 'chart-donut-pie-responsive-' + i
      chartPieResponsive[i].classList.add(chartClass)

      // Calculate height of the legend of THIS chart
      let legendHeight = window.getComputedStyle(chartPieResponsive[i].querySelector('.chart-vertical-labels-mobile'), null).getPropertyValue('height')

      // Create styling with margin-bottom by calculating the height of the legend.
      let responsiveChartsMargin = document.createElement('style')
      responsiveChartsMargin.innerHTML = ''
        + '@media (max-width: '+ BREAKPOINT_TABLET_MAX +'px) {'
          + '.' + chartClass + '{margin-bottom: ' + legendHeight + '}'
        + '}'
      console.log(responsiveChartsMargin)
      chartPieResponsive[i].prepend(responsiveChartsMargin)
    }
  }
}



console.log("charts.js loaded")
