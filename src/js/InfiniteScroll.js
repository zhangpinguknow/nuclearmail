/**
 * @jsx React.DOM
 *
 * Based off https://github.com/guillaumervls/react-infinite-scroll
 */

var React = require('react');

var PropTypes = React.PropTypes;

var InfiniteScroll = React.createClass({
  propTypes: {
    // Whether or not to listen for scroll and resize events. Set this to `true`
    // when you have loaded all the data already.
    hasMore: PropTypes.bool.isRequired,

    // Called when page is within `threshold` of the bottom.
    onRequestMoreItems: PropTypes.func.isRequired,
    onScroll: PropTypes.func,
    threshold: PropTypes.number,
  },

  getDefaultProps() {
    return {
      hasMore: false,
      isScrollContainer: false,
      onRequestMoreItems: null,
      threshold: 250,
    };
  },

  componentDidMount() {
    this._attachListeners();
  },

  componentWillReceiveProps(nextProps) {
    if (!nextProps.hasMore) {
      this._detachListeners();
    }
  },

  componentWillUnmount() {
    this._detachListeners();
  },

  _attachListeners() {
    window.addEventListener('resize', this._update);
    this._update();
  },

  _detachListeners() {
    window.removeEventListener('resize', this._update);
  },

  _onScroll(event) {
    this.props.onScroll && this.props.onScroll(event);

    this._update();
  },

  _update() {
    var el = this.getDOMNode();
    var height = el.scrollHeight;
    // ScrollTop + offsetHeight is within threshold of scrollHeight
    var isPastThreshold = (el.scrollHeight -
      el.offsetHeight -
      el.scrollTop
    ) < Number(this.props.threshold);

    if ((!this.lastHeight || this.lastHeight < height) && isPastThreshold) {
      // call loadMore after _detachListeners to allow
      // for non-async loadMore functions
      this.props.onRequestMoreItems && this.props.onRequestMoreItems();
      this.lastHeight = height;
    }
  },

  render() {
    var style = this.props.isScrollContainer ? {overflow: 'auto'} : null;
    return (
      <div
        className={this.props.className}
        onScroll={this._onScroll}
        style={style}>
        {this.props.children}
      </div>
    );
  },
});

function getAbsoluteOffsetTop(element) {
  if (!element) {
    return 0;
  }
  return element.offsetTop + getAbsoluteOffsetTop(element.offsetParent);
}

function getWindowScrollTop() {
  return (window.pageYOffset !== undefined) ?
    window.pageYOffset :
    (document.documentElement ||
      document.body.parentNode ||
      document.body).scrollTop;
}

module.exports = InfiniteScroll;