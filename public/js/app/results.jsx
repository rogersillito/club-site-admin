/* global fetch */

(function() {

  const React = window.React;
  const reactRouter = window.ReactRouter;
  const Router = reactRouter.Router;
  const Route = reactRouter.Route;
  const Link = reactRouter.Link;
  const browserHistory = reactRouter.browserHistory;

    var Loader = React.createClass({
      render: function() {
        return (
        <div className="col-sm-9 col-md-10">
          <div className="spinner">
            <h1><small>Loading...</small></h1>
            <img src={'/images/spinner.gif'} />
          </div>
        </div>);
      }
    });

    var ResultsMessage = React.createClass({
        render: function() {
            return (
              <div className="col-sm-9 col-md-10">
                <h3 className="text-muted">{this.props.text}</h3>
              </div>
            );
        }
    });

    var EventResult = React.createClass({
        getHtml: function() {
            var resultHtml = this.props.data.html;
            return { __html: resultHtml };
        },
        fullResultLink: function(url, linkText) {
          if (!url) {
            return null;
          }
          return (
            <p>View Full Results: <a href={url} target="_blank">{linkText}</a></p>
          );
        },
        render: function() {
            var result = this.props.data;
            return (
                <div className="event-result">
                    <a name={result.key}></a>
                    <h3>{result.name}
                        <span className="pull-right text-muted margin-left-md"><small>{result.date}</small></span>
                    </h3>
                    {this.fullResultLink(result.url, result.linkText)}
                    <div className="table-responsive" dangerouslySetInnerHTML={this.getHtml()} />
                </div>
            );
        }
    });

  var ResultsMenu = React.createClass({
    renderMonths: function(year) {
      return year.months.map(m => {
        var key = m.monthName + '/' + year.year;
        return (
          <Link key={key} to={'/results/' + key} className="list-group-item">{m.monthName}</Link>
        );
      });
    },
    renderYears: function() {
      return this.menuData.map(y => {
				var id = 'result-menu-year-' + y.year;
				if (!this.firstYear) {
					this.firstYear = id;
				}
        return (
          <div key={y.year}>
            <a href={'#item-' + y.year} id={id} className="list-group-item" data-toggle="collapse">
                <i className="glyphicon glyphicon-chevron-right"></i><strong>{y.year}</strong>
              </a>
              <div className="list-group collapse" id={'item-' + y.year}>
                {this.renderMonths(y)}
              </div>
          </div>
        );
      });
    },
		firstYear: undefined,
    menuData: JSON.parse($('#menu-data').val()),
    render: function() {
      if (!this.menuData.length) {
        return null;
      }
      return (
        <div className="col-sm-3 col-md-2">
          <h3>Past Results</h3>
          <div className="list-group list-group-root well" id="results-menu">
            {this.renderYears()}
          </div>
        </div>
      );
    },
		componentDidMount: function() {
      console.log(this.firstYear);
			$('#'+this.firstYear).click();
		}
  });

  var ResultsContainer = React.createClass({
    render: function() {
      var results = this.props.results;
      if (this.props.loading) {
        return (
            <Loader />
        );
      }
      if (results.items.length) {
        var eventResultNodes = results.items.map(function (r) {
            return (
                <EventResult data={r} key={r.key} />
            );
        });
        return (
            <div className="col-sm-9 col-md-10">
                <h2>{results.displayMonth} {results.displayYear}</h2>
                {eventResultNodes}
            </div>
        );
      } else {
        return (
            <ResultsMessage text="There are no results for this date." />
        );
      }
    }
  });

  var ResultsPage = React.createClass({
    // fakeItems: {
    //   items: [
    //       {
    //           key: 'a-race-test-13th-sept-2016',
    //           name: 'A Race {test2}',
    //           html: '<p>blah blah results</p>',
    //           date: 'Sunday 13th September 2015'
    //       }, {
    //           key: 'some-other-race-5th-sept-2016',
    //           name: 'Some Other Race {test}',
    //           html: '<p>info stuff</p>',
    //           date: 'Saturday 5th September 2015'
    //       }
    //   ],
    //   displayMonth: 'FAKE API MONTH',
    //   displayYear: '2015'
    // },
    getApiResults: function(month, year) {
      var url = '/api/results/' + month + '/' + year;
      /* console.log("url = ", url);*/
      fetch(url)
        .then(response =>  {
          if (response.ok) {
            return response;
          }
          return response.text().then(body => {
            var error = new Error(response.statusText);
            error.responseBody = body;
            throw error;
          });
        })
        .then(res => res.json())
        .then(data => {
          this.setState({
            results: data,
            loading: false
          });
          window.scrollTo(0,0);
        })
        .catch(err => {
          console.log(`${err.message}: ${err.responseBody}`);
          this.setState({
            results: {items: []},
            loading: false
          });
          window.scrollTo(0,0);
        });
    },
    updateData: function(month, year) {
      if (month !== undefined && year !== undefined) {
        this.getApiResults(month, year);
      }
    },
    getInitialState: function() {
      if (this.props.route.defaultResults) {
        return {
          results: this.props.route.defaultResults,
          loading: false
        };
      }
      this.updateData(this.props.params.month, this.props.params.year);
      return {
        results: {items: []},
        loading: true
      };
    },
    componentWillReceiveProps: function(nextProps) {
      var p = this.props.params;
      var np = nextProps.params;
      if (p.month !== np.month || p.year !== np.year) {
        this.setState({loading: true});
        this.updateData(np.month, np.year);
      }
    },
    //TODO: get this working... https://github.com/ReactTraining/react-router/issues/394
    /* setAnchorScrollingBehaviour() {
     *   // Decode entities in the URL
     *   // Sometimes a URL like #/foo#bar will be encoded as #/foo%23bar
     *   window.location.hash = window.decodeURIComponent(window.location.hash);
     *   const scrollToAnchor = () => {
     *     const hashParts = window.location.hash.split('#');
     *     if (hashParts.length > 2) {
     *       const hash = hashParts.slice(-1)[0];
     *       document.querySelector(`#${hash}`).scrollIntoView();
     *     }
     *   };
     *   scrollToAnchor();
     *   window.onhashchange = scrollToAnchor;
     * },
     * componentDidMount() {
     *   this.setAnchorScrollingBehaviour();
     * },
     * componentDidUdpate() {
     *   this.setAnchorScrollingBehaviour();
     * },*/
    render: function() {
      return (
        <div className="row">
          <ResultsContainer results={this.state.results} loading={this.state.loading}/>
          <ResultsMenu />
        </div>
      );
    }
  });

  const mostRecentResults = JSON.parse($('#result-data').val());
  
  ReactDOM.render((
   <Router history={browserHistory}>
     <Route path="/results" component={ResultsPage} defaultResults={mostRecentResults}/>
      <Route path="/results/:month/:year" component={ResultsPage}/>
    </Router>
  ), document.getElementById('results-page'));

})();
