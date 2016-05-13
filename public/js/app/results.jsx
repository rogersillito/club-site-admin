(function() {

  const reactRouter = window.ReactRouter;
  const Router = reactRouter.Router;
  const Route = reactRouter.Route;
  const Link = reactRouter.Link;
  const browserHistory = reactRouter.browserHistory;

    var NoResultsMessage = React.createClass({
        render: function() {
            return (
              <div className="col-sm-9 col-md-10">
                <h3 className="text-muted">There are no results for this date.</h3>
              </div>
            );
        }
    });

    var EventResult = React.createClass({
        getHtml: function() {
            var resultHtml = this.props.data.html;
            return { __html: resultHtml };
        },
        render: function() {
            var result = this.props.data;
            return (
                <div className="event-result">
                    <h3>{result.name}
                        <div className="pull-right text-muted">{result.date}</div>
                    </h3>
                    <div dangerouslySetInnerHTML={this.getHtml()} />
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
        return (
          <div key={y.year}>
            <a href={'#item-' + y.year} className="list-group-item" data-toggle="collapse">
                <i className="glyphicon glyphicon-chevron-right"></i><strong>{y.year}</strong>
              </a>
              <div className="list-group collapse" id={'item-' + y.year}>
                {this.renderMonths(y)}
              </div>
          </div>
        );
      });
    },
    menuData: JSON.parse($('#menu-data').val()),
    render: function() {
      if (!this.menuData.length) {
        return null;
      }
      return (
        <div class="col-sm-3 col-md-2">
          <h3>Past Results (react)</h3>
          <div className="list-group list-group-root well" id="results-menu">
            {this.renderYears()}
          </div>
        </div>
      );
    }
  });

    var ResultsContainer = React.createClass({
        render: function() {
            var results = this.props.results;
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
                    <NoResultsMessage />
                );
            }
        }
    });

  var ResultsPage = React.createClass({
    fakeItems: {
      items: [
          {
              key: 'a-race-test-13th-sept-2016',
              name: 'A Race {test2}',
              html: '<p>blah blah results</p>',
              date: 'Sunday 13th September 2015'
          }, {
              key: 'some-other-race-5th-sept-2016',
              name: 'Some Other Race {test}',
              html: '<p>info stuff</p>',
              date: 'Saturday 5th September 2015'
          }
      ],
      displayMonth: 'FAKE API MONTH',
      displayYear: '2015'
    },
    mostRecentResults: JSON.parse($('#result-data').val()),
    getApiResults: function(month, year) {
      //TODO: get data from api (have added fetch/es6 promises via bower - are they being loaded?)
      return this.fakeItems;
    },
    getData: function() {
      var p = this.props.params;
      if (p.month !== undefined && p.year !== undefined) {
        console.log(p);
        //TODO: validate month/year params
        return this.getApiResults(p.month, p.year);
      }
      return this.mostRecentResults;
    },
    render: function() {
      return (
        <div className="row">
          <ResultsContainer results={this.getData()}/>
          <ResultsMenu />
        </div>
      );
    }
  });

  ReactDOM.render((
   <Router history={browserHistory}>
      <Route path="/results" component={ResultsPage}/>
      <Route path="/results/:month/:year" component={ResultsPage}/>
    </Router>
  ), document.getElementById('results-page'));

})();
