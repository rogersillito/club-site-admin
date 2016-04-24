(function() {

  const reactRouter = window.ReactRouter;
  const Router = reactRouter.Router;
  const Route = reactRouter.Route;
  const IndexRoute = reactRouter.IndexRoute;
  const browserHistory = reactRouter.browserHistory;

  var getMenuData = function() {
    return JSON.parse($('#menu-data').val());
  }

    var getData = function(month, year) {
        if (month == 'September') {
          return {
              items: [
                  {
                      key: 'a-race-test-13th-sept-2016',
                      name: 'A Race {test}',
                      html: '<p>blah blah results</p>',
                      date: 'Sunday 13th September 2015'
                  }, {
                      key: 'some-other-race-5th-sept-2016',
                      name: 'Some Other Race {test}',
                      html: '<p>info stuff</p>',
                      date: 'Saturday 5th September 2015'
                  }
              ],
              displayMonth: 'September',
              displayYear: 2015
          };
        }

        return JSON.parse($('#result-data').val());
        return {
            items: [
                {
                    key: 'a-race-test-13th-mar-2016',
                    name: 'A Race {test}',
                    html: '<p>blah blah results</p>',
                    date: 'Sunday 13th March 2016'
                }, {
                    key: 'some-other-race-5th-mar-2016',
                    name: 'Some Other Race {test}',
                    html: '<p>info stuff</p>',
                    date: 'Saturday 5th March 2016'
                }
            ],
            displayMonth: 'March',
            displayYear: 2016
        };
    };

    var NoResultsMessage = React.createClass({
        render: function() {
            return (
                <h3 className="text-muted">There are no results for this date.</h3>
            )
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

    var ResultsContainer = React.createClass({
        render: function() {
            var results = this.props.data;
            if (results.items.length) {
                var eventResultNodes = results.items.map(function (r) {
                    return (
                        <EventResult data={r} key={r.key} />
                    );
                });
                return (
                    <div>
                        <h2>{results.displayMonth} {results.displayYear}</h2>
                        {eventResultNodes}
                    </div>
                );
            } else {
                return (
                    <NoResultsMessage />
                )
            }
        }
    });

  var ResultsMenu = React.createClass({
    monthItems: function(months, year) {
      months.map(m => {
        return (
          <a href="/results/{m.monthName}/{year}" class="list-group-item">{m.monthName}</a>
        );
      });
    },
    yearItems: function() {
      getMenuData().map(i => {
        return (
          <div>
            <a href="#item-{i.year}" class="list-group-item" data-toggle="collapse">
                  <i class="glyphicon glyphicon-chevron-right"></i><strong>{i.year}</strong>
              </a>
              <div class="list-group collapse" id="item-{i.year}">
                {this.monthItems(i.months, i.year)}
              </div>
          </div>
        );
      });
    },
    render: function() {
      return (
        <div>
          <h3>Past Results</h3>
          <div class="list-group list-group-root well" id="results-menu">
            {this.yearItems()}
          </div>
        </div>
      );
    }
  });


  var ResultsPage = React.createClass({
    render: function() {
      return (
        <div>
          <div class="col-sm-9 col-md-10" id="results-container">
            <ResultsContainer data={this.props.data} />,
          </div>
          <div class="col-sm-3 col-md-2">
            <ResultsMenu/>
          </div>
        </div>
      );
    }
  });


    /*
    //TODO: add handler for menu behaviour to load new data
    */
    ReactDOM.render(
//        <ResultsContainer data={getData()} />,
        <ResultsPage data={getData()} />,
        document.getElementById('results-container')
    );

    $(document).ready(function() {
      $('#results-menu .list-group .list-group-item').each((i, link) => {
        $(link).click(function(e) {
          ReactDOM.render(
            <ResultsPage data={getData('September')} />,
            /*
            (
              <Router history={browserHistory}>
                <Route path="/results/:month/:year" component={ResultsContainer}/>
              </Router>
            ),
            */
              document.getElementById('results-container')
          );
        });
      });
    });
})()
