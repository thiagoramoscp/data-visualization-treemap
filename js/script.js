fetch('https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json').
then(response => response.json()).
then(dataset => {

  const WIDTH = 1200;
  const HEIGHT = 800;
  const PADDING_TOP = 105;
  const PADDING_BOTTOM = 105;
  const PADDING_LEFT = 85;
  const PADDING_RIGHT = 85;

  const tooltipXOffset = 10;
  const tooltipYOffset = -50;

  const INNER_WIDTH = WIDTH - (PADDING_LEFT + PADDING_RIGHT);
  const INNER_HEIGHT = HEIGHT - (PADDING_TOP + PADDING_BOTTOM);

  const rootNode = d3.hierarchy(dataset).
  sum(d => d.value).
  sort((a, b) => b.value - a.value);

  const svg = d3.select('svg').
  attr('width', WIDTH).
  attr('height', HEIGHT).
  attr('font-family', '"Lato", sans-serif');


  const treemapFunc = dataset => d3.treemap().
  tile(d3.treemapSquarify) //default
  .size([INNER_WIDTH, INNER_HEIGHT]).
  padding(1).
  round(true)(
  rootNode);

  const root = treemapFunc(dataset);


  const colorScale = d3.scaleOrdinal().
  domain(root.leaves().map(d => d.data.category)).
  range(['#66c2a5', '#fc8d62', '#8da0cb', '#e78ac3', '#a6d854', '#ffd92f', '#e5c494']);

  const tileWidth = d => d.x1 - d.x0;
  const tileHeight = d => d.y1 - d.y0;
  const nameValue = d => d.data.name;
  const categoryValue = d => d.data.category;
  const salesValue = d => d.data.value;

  const treemapG = svg.append('g');

  const leafNodes = treemapG.selectAll("g").
  data(root.leaves()).
  join("g").
  attr("transform", d => `translate(${d.x0},${d.y0})`);

  leafNodes.append("rect").
  attr('class', 'tile').
  attr('data-name', nameValue).
  attr('data-category', categoryValue).
  attr('data-value', salesValue).
  attr("width", tileWidth).
  attr("height", tileHeight).
  attr('fill', d => colorScale(categoryValue(d))).
  on('mouseover', d => {
    tooltip.select('rect').
    attr('data-value', `${salesValue(d)}`);
    tooltip.style('visibility', 'visible').
    append('text').
    attr('font-size', '1em').
    attr('font-weight', '600').
    attr('transform', `translate(${PADDING_LEFT}, ${HEIGHT - PADDING_BOTTOM + 15})`).
    append('tspan').
    text(`Name: ${nameValue(d)}`).
    attr('x', '.5em').
    attr('dy', '.4em').
    append('tspan').
    attr('dy', '1.3em').
    attr('x', '.5em').
    text(`Category: ${categoryValue(d)}`).
    append('tspan').
    attr('dy', '1.3em').
    attr('x', '.5em').
    text(`Sales: $${salesValue(d)}`);
  }).
  on('mousemove', d => {
    tooltip.select('rect').
    attr('data-value', salesValue(d));
  }).
  on('mouseout', d => {
    tooltip.style('visibility', 'hidden');
    tooltip.select('rect').
    attr('data-value', '');
    tooltip.select('text').remove();
  });

  let tooltip = svg.append('g').
  attr('id', 'tooltip');

  tooltip.append('rect').
  attr('visibility', 'hidden').
  attr('class', 'tooltip').
  attr('width', '0').
  attr('height', '0').
  attr('rx', '.5em').
  attr('ry', '.4em').
  attr('fill', 'gray');

  leafNodes.append('text').
  text(nameValue).
  attr('x', '3').
  attr('y', '15').
  attr('font-size', '.7em').
  attr('fill', 'white');

  treemapG.attr("transform", `translate(${PADDING_LEFT},${PADDING_TOP})`);

  const fullCategoriesList = root.leaves().map(d => d.data.category);
  const categories = [...new Set(fullCategoriesList)];

  const legendG = svg.append('g').
  attr('id', 'legend').
  attr('transform', `translate(${PADDING_LEFT + 200} , ${HEIGHT - PADDING_BOTTOM})`);


  const legend = legendG.selectAll('g').
  data(categories).
  join('g');

  legend.append('rect').
  attr('class', 'legend-item').
  attr('y', '30').
  attr('x', d => categories.indexOf(d) * 120).
  attr("width", '25').
  attr("height", '25').
  attr('fill', d => colorScale(d)).
  attr('stroke', 'gray');

  legend.append('text').
  text(d => d).
  attr('x', d => categories.indexOf(d) * 120 + 29).
  attr('y', '48');




  // treemap.append("title")
  //     .text(d => `${d.ancestors().reverse().map(d => d.data.name).join("/")}\n${format(d.value)}`);

  //     const legendData = [
  //     {temp: 2},
  //     {temp: 3},
  //     {temp: 4},
  //     {temp: 5},
  //     {temp: 6},
  //     {temp: 7},
  //     {temp: 8},
  //     {temp: 9},
  //     {temp: 10},
  //     {temp: 11},
  //     {temp: 12},
  //     {temp: 13}
  //   ];




  // const tooltipXOffset = 10;
  // const tooltipYOffset = -50;

  //   const monthValue = d => d.month;
  //   const yearValue = d => d.year;
  //   const tempValue = d => d.temperature;


  //         /* --TEXT-- */

  svg.append('text').
  attr('id', 'title').
  text('Movie Sales').
  attr('x', WIDTH / 2).
  attr('text-anchor', 'middle').
  attr('y', PADDING_TOP - 60).
  attr('font-size', '2.3em').
  attr('fill', "#222");

  svg.append('text').
  attr('id', 'description').
  text("Top 95 Most Sold Movies Grouped by Category").
  attr('x', WIDTH / 2).
  attr('text-anchor', 'middle').
  attr('y', PADDING_TOP - 25).
  attr('font-size', '1.5em').
  attr('fill', "#222");

  //   /* --LEGEND-- */

  //   const legendG = svg.append('g')
  //     .attr('id', 'legend')
  //     .attr('font-size', '.9em')
  //     .attr('fill', '#444');

  //   legendG.append('text')
  //     .attr('text-anchor', 'start')
  //     .text('Temperature Scale (℃)')
  //     .attr('x', PADDING_LEFT)
  //     .attr('y', HEIGHT - PADDING_BOTTOM + 45);

  //     /* --SCALES-- */

  //   const yScale = d3.scaleBand()
  //     .domain(['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'])
  //     .range([HEIGHT - PADDING_BOTTOM, PADDING_TOP]);

  //   let xDomainArr = [dataset.monthlyVariance[0].year];
  //   dataset.monthlyVariance.forEach(d => {
  //     if (d.year > xDomainArr[xDomainArr.length - 1]) {
  //       xDomainArr.push(d.year)  
  //     }
  //   });

  //   const xScale = d3.scaleBand()
  //     .domain(xDomainArr)
  //     .range([PADDING_LEFT, WIDTH - PADDING_RIGHT]);

  //   const colorScale = d3.scaleThreshold()
  //     .domain([3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
  //     .range(['rgb(49, 54, 149)', 'rgb(69, 117, 180)', 'rgb(116, 173, 209)', 'rgb(171, 217, 233)', 'rgb(224, 243, 248)', 'rgb(255, 255, 191)', 'rgb(254, 224, 144)', 'rgb(253, 174, 97)', 'rgb(244, 109, 67)', 'rgb(215, 48, 39)', 'rgb(165, 0, 38)']);

  //   const legendXScale = d3.scaleLinear()
  //     .domain(d3.extent(legendData, d => d.temp))
  //     .range([PADDING_LEFT, d3.max(legendData, d => d.temp) * 30 + PADDING_LEFT - 60]);


  //     /* --AXES-- */

  //   const xAxis = d3.axisBottom(xScale)
  //      .tickFormat(d => (d % 10 == 0) ? d : null);

  //   // .tickValues(xDomainArr.map(d => (d % 10 == 0) ? d : null));
  //   svg.append('g')
  //      .attr('id', 'x-axis')
  //      .attr('transform', `translate(0, ${HEIGHT - PADDING_BOTTOM})`)
  //      .call(xAxis);


  //   const yAxis = d3.axisLeft(yScale)
  //     .tickPadding(7);

  //   svg.append('g')
  //      .attr('id', 'y-axis')
  //      .attr('transform', `translate(${PADDING_LEFT} , 0)`)
  //      .call(yAxis);

  //    const colorAxis = d3.axisBottom(legendXScale);

  //     legendG.append('g')
  //       .attr('id', 'color-axis')
  //       .attr('transform', `translate(0, ${HEIGHT - PADDING_BOTTOM + 70})`)
  //       .call(colorAxis);

  //     /* --DATA RENDERING-- */

  // svg.selectAll('rect')
  //     .data(dataset.monthlyVariance)
  //     .enter()
  //     .append('rect')
  //     .attr('class', 'cell')
  //     .attr('data-month', monthValue)
  //     .attr('data-year', yearValue)
  //     .attr('data-temp', tempValue)
  //     .attr('x', d => xScale(d.year))
  //     .attr('y', d => yScale(d.month))
  //     .attr('width', xScale.bandwidth())
  //     .attr('height', yScale.bandwidth())
  //     .attr('fill', d => colorScale(d.temperature))


  //         .append('text')
  //         .attr('font-size', '1em')
  //         .attr('font-weight', '600')
  //         .attr('transform', `translate(10, 15)`)
  //           .append('tspan')
  //           .text(`${d.year} / ${d.month}`)
  //           .attr('x', '.15em')
  //           .attr('dy', '.4em')
  //           .append('tspan')
  //           .attr('dy', '1.5em')
  //           .attr('x', '.15em')
  //           .text(`Temperature: ${d.temperature.toFixed(2)}℃`)
  //           .append('tspan')
  //           .attr('dy', '1.5em')
  //           .attr('x', '.15em')
  //           .text(`Variance: ${d.variance.toFixed(2)}℃`);
  //       })
  //     .on('mouseout', () => {      
  //       tooltip.style('visibility', 'hidden');
  //       tooltip.select('rect')       
  //         .attr('data-year', '');
  //       tooltip.select('text').remove();
  //       })
  //     .on('mousemove', (d) => {
  //         let mousePosition = d3.mouse(d3.event.currentTarget);
  //         let xPosition = mousePosition[0];
  //         let yPosition = mousePosition[1];
  //         tooltip.attr('transform', `translate(${xPosition + tooltipXOffset}, ${yPosition + tooltipYOffset})`)
  //         .attr('data-year', `${d.year}`);
  //       });  



  //   // --legend rendering
  //   legendG.selectAll('rect')
  //     .data(legendData)
  //     .enter()
  //     .append('rect')
  //     .attr('x', d => d.temp == 13 ? -100 : d.temp * 30 + PADDING_LEFT - 60)
  //     .attr('y', HEIGHT - PADDING_BOTTOM + 55)
  //     .attr('width', '30')
  //     .attr('height', '15')
  //     .attr('fill', d => colorScale(d.temp));



  //     /* --TOOLTIP-- */

  //     let tooltip = svg.append('g')
  //       .attr('id', 'tooltip');

  //       tooltip.append('rect')
  //       .attr('class', 'tooltip')
  //       .attr('width', '168')
  //       .attr('height', '80')
  //       .attr('rx', '.5em')
  //       .attr('ry', '.4em');

  //       tooltip.style('visibility', 'hidden');

}).
catch(() => {
  const svg = d3.select('svg');

  svg.attr('width', '300').
  attr('height', '50').
  attr('font-family', '"Lato", sans-serif').
  append('text').
  attr('x', '150').
  attr('text-anchor', 'middle').
  attr('y', '30').
  text('Unable to load data. Sorry =/');
});