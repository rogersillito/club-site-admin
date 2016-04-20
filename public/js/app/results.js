(function() {
    var getData = function() {
        return {
            items: [
                {
                    key: 'a-race-test-13th-mar-2016',
                    nameOrLocation: 'A Race {test}',
                    resultHtml: '<p>blah blah results</p>',
                    date: 'Sunday 13th March 2016'
                }, {
                    key: 'some-other-race-5th-mar-2016',
                    nameOrLocation: 'Some Other Race {test}',
                    resultHtml: '<p>info stuff</p>',
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
            var html = this.props.data.resultHtml;
            return { __html: html };
        },
        render: function() {
            var result = this.props.data;
            return (
                <div className="event-result">
                    <h3>{result.nameOrLocation}
                        <div className="pull-right text-muted">{result.date}</div>
                    </h3>
                    <div dangerouslySetInnerHTML={this.getHtml()} />
                </div>
            )
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

    /*
    //TODO: add handler for menu behaviour to load new data
    */
    ReactDOM.render(
        <ResultsContainer data={getData()} />,
        document.getElementById('results-container')
    );

    $(document).ready(function() {
        //TODO: add behaviour to menu
    });
})()
