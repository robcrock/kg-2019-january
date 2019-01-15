////////////////////////////////////////////////////////////////////////////////
// GET STARTED WITH A CHART CLASS
////////////////////////////////////////////////////////////////////////////////
class Chart {
  constructor(opts) {
    this.element = opts.element;
    this.width = opts.width;
    this.height = opts.height;
    this.margin = opts.margin;
    this.padding = opts.padding;

    this.marginConvention();
  }

  marginConvention() {
    this.plotWidth = this.width - this.margin.right;
    this.plotHeight = this.height - this.margin.bottom;
    this.chartWidth = this.plotWidth - this.padding.right;
    this.chartHeight = this.plotHeight - this.padding.bottom;

    // This SVG is the full size of the container. All charts will fit inside this space
    const svg = d3.select(this.element).append('svg')
      .attr('width', this.width)
      .attr('height', this.height);

    this.plot = svg.append('g')
      .classed('plot', true)
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`)
      .attr('width', this.plotWidth)
      .attr('height', this.plotHeight);
  }

}

////////////////////////////////////////////////////////////////////////////////
// EXTEND CHART CLASS TO CREATE CREATE A LINE CHART CLASS
////////////////////////////////////////////////////////////////////////////////
class BarChart extends Chart {
  constructor(opts) {
    super({
      element: opts.element,
      width: opts.width,
      height: opts.height,
      margin: opts.margin,
      padding: opts.padding
    });

    this.data = opts.data

    this.transformData(this.data);
    this.scales();
    this.axes();
    this.createBar();
  }

  transformData(data) {
    this.transformedData = [];

    data.forEach(exercise => {
      if(exercise.sets === '1 Minute') {
        exercise.reps = +exercise.reps;
        this.transformedData.push(exercise);
      }
    })
    
    return this.transformedData;
  }

  scales() {
    const athletes = this.transformedData.map(d => d.athlete);

    this.xScale = d3.scaleBand()
      .domain(athletes)
      .range([0, this.chartWidth])
      .paddingInner(0.1);

    this.yScale = d3.scaleLinear()
      .domain([0, 35])
      .range([this.chartHeight, this.margin.top + this.padding.top]);
  }

  axes() {
    this.xAxis = d3.axisBottom()
      .scale(this.xScale);

    this.yAxis = d3.axisLeft()
      .scale(this.yScale);
  }

  createBar() {

    // May need to upate the index of your data
    this.g = this.plot.selectAll('rect').data(this.transformedData, d => d.athelete);

    this.gEnter = this.g.enter().append('rect');

    this.gEnter
      .attr('x', d => this.xScale(d.athlete))
      // Spent HOURS getting this to work.
      // My "W" was capped and it shouldn't have been 😫
      .attr('width', this.xScale.bandwidth())
      .attr('y', d => this.yScale(d.reps))
      .attr('height', d => this.chartHeight - this.yScale(d.reps));
  }
  
}

d3.csv('box-jump.csv').then( data => {
  const width = 400;
  const height = 400;
  const element = document.querySelector('body');
  const margin = {top: 0, right: 0, bottom: 0, left: 0};
  const padding = {top: 0, right: 30, bottom: 5, left: 30};

  const chart = new BarChart({width, height, element, margin, padding, data});
});