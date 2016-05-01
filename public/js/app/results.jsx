(function() {

  const reactRouter = window.ReactRouter;
  const Router = reactRouter.Router;
  const Route = reactRouter.Route;
  const IndexRoute = reactRouter.IndexRoute;
  const browserHistory = reactRouter.browserHistory;


    var getData = function(month, year) {
        if (month == 'September') {
          return {
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
              displayMonth: 'September',
              displayYear: 2015
          };
        }

        return JSON.parse($('#result-data').val());
        return {
            items: [
                {
                    key: 'a-race-test-13th-mar-2016',
                    name: 'A Race {test2}',
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
              <div className="col-sm-9 col-md-10">
                <h3 className="text-muted">There are no results for this date.</h3>
              </div>
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

  var ResultsMenu = React.createClass({
    renderMonths: function(year) {
      return year.months.map(m => {
        return (
          <a key={m.monthName + '-' + year.year} href={'/results/' + m.monthName + '/' + year.year} className="list-group-item">{m.monthName}</a>
        );
      });
    },
    renderYears: function(years) {
      return years.map(y => {
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
    getMenuData: function() {
      return JSON.parse($('#menu-data').val());
    },
    render: function() {
      var years = this.getMenuData();
      if (!years.length) {
        return null;
      }
      return (
        <div class="col-sm-3 col-md-2">
          <h3>Past Results (react)</h3>
          <div className="list-group list-group-root well" id="results-menu">
            {this.renderYears(years)}
          </div>
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
    render: function() {
      return (
        <div className="row">
          <ResultsContainer data={this.props.data} />
          <ResultsMenu />
        </div>
      );
    }
  });


    /*
    //TODO: add handler for menu behaviour to load new data
    */
    ReactDOM.render(
        <ResultsPage data={getData()} />,
        document.getElementById('results-page')
    );

    $(document).ready(function() {
      $('#results-menu .list-group .list-group-item').each((i, link) => {
        $(link).click(function(e) {
          ReactDOM.render(
            <ResultsPage data={getData('September')} />,
            document.getElementById('results-page')
          );
        });
      });
    });
})();
