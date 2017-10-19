import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import {Responsive, WidthProvider} from 'react-grid-layout';
const ResponsiveReactGridLayout = WidthProvider(Responsive);

const testLayout = [];

class ShowcaseLayout extends React.Component {

  static propTypes = {
    onLayoutChange: PropTypes.func.isRequired
  };

  static defaultProps = {
    className: "layout",
    rowHeight: 30,
    onLayoutChange: function() {},
    cols: {lg: 12, md: 10, sm: 6, xs: 4, xxs: 2},
    initialLayout: generateLayout()
  };

  state = {
    currentBreakpoint: 'lg',
    compactType: 'vertical',
    mounted: false,
    layouts: {lg: this.props.initialLayout},
  };

  componentDidMount() {
    this.setState({mounted: true});
  }

  generateDOM() {
    return _.map(this.state.layouts.lg, function (l) {
      return (
        <div key={l.i} className={l.static ? 'static' : ''}>
          {l.static ?
            <span className="text" title="This item is static and cannot be removed or resized.">Static - {l.i}</span>
            : <span className="text">{l.i}</span>
          }
        </div>);
    });
  }

  onBreakpointChange = (breakpoint) => {
    this.setState({
      currentBreakpoint: breakpoint
    });
  };

  onCompactTypeChange = () => {
    const {compactType: oldCompactType} = this.state;
    const compactType = oldCompactType === 'horizontal' ? 'vertical' :
                        oldCompactType === 'vertical' ? null : 'horizontal';
    this.setState({compactType});
  };

  onLayoutChange = (layout, layouts) => {
    this.props.onLayoutChange(layout, layouts);
  };

  onNewLayout = () => {
    this.setState({
      layouts: {lg: generateLayout(true)}
    });
  };

  render() {
    return (
      <div>
        <div>
          Current Breakpoint: {this.state.currentBreakpoint} ({this.props.cols[this.state.currentBreakpoint]} columns)
        </div>
        <div>Compaction type: {_.capitalize(this.state.compactType) || 'No Compaction'}</div>
        <button onClick={this.onNewLayout}>Generate New Layout</button>
        <button onClick={this.onCompactTypeChange}>Change Compaction Type</button>
        <ResponsiveReactGridLayout
          {...this.props}
          layouts={this.state.layouts}
          onBreakpointChange={this.onBreakpointChange}
          onLayoutChange={this.onLayoutChange}
          // WidthProvider option
          measureBeforeMount={false}
          // I like to have it animate on mount. If you don't, delete `useCSSTransforms` (it's default `true`)
          // and set `measureBeforeMount={true}`.
          useCSSTransforms={this.state.mounted}
          compactType={this.state.compactType}
          preventCollision={!this.state.compactType}
          >
          {this.generateDOM()}
        </ResponsiveReactGridLayout>
      </div>
    );
  }
}

module.exports = ShowcaseLayout;

function generateLayout(change) {
  if (change) {
    testLayout.unshift({
        x: 0,
        y: 0,
        w: 4,
        h: 6,
        i: 'C' + testLayout.length,
      });
  }

  if (testLayout.length === 0) {
    testLayout.unshift({
        x: 0,
        y: 0,
        w: 12,
        h: 1,
        i: 'A',
      });
    testLayout.unshift({
        x: 6,
        y: 1,
        w: 4,
        h: 1,
        i: 'B',
      });
  }

  return _.cloneDeep(testLayout);
}

  // function generateLayout() {
  //   return _.map(_.range(0, 25), function (item, i) {
  //     var y = Math.ceil(Math.random() * 4) + 1;
  //     return {
  //       x: _.random(0, 5) * 2 % 12,
  //       y: Math.floor(i / 6) * y,
  //       w: 2,
  //       h: y,
  //       i: i.toString(),
  //       static: Math.random() < 0.05
  //     };
  //   });
  // }

  if (require.main === module) {
    require('../test-hook.jsx')(module.exports);
  }
