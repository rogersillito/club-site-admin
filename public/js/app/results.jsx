/* global fetch */
import $ from 'jquery';
import * as React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import createBrowserHitory from 'history/createBrowserHistory';

window.clubSiteAdmin.resultsInit = function() {

	class Loader extends React.Component {
		render() {
			return (
			<div className="col-sm-9 col-md-10">
				<div className="spinner">
					<h1><small>Loading...</small></h1>
					<img src={'/images/spinner.gif'} />
				</div>
			</div>);
		}
	}

	class ResultsMessage extends React.Component {
			render() {
					return (
						<div className="col-sm-9 col-md-10">
							<h3 className="text-muted">{this.props.text}</h3>
						</div>
					);
			}
	}

	class EventResult extends React.Component {
			getHtml() {
					var resultHtml = this.props.data.html;
					return { __html: resultHtml };
			}
			fullResultLink(url, linkText) {
				if (!url) {
					return null;
				}
				return (
					<p>View Full Results: <a href={url} target="_blank">{linkText}</a></p>
				);
			}
			render() {
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
	}

	class ResultsMenu extends React.Component {
		constructor(props) {
			super(props);
			this.state = {
				menuData: JSON.parse($('#menu-data').val())
			};
		}
		renderMonths(year) {
			return year.months.map(m => {
				var key = m.monthName + '/' + year.year;
				return (
					<Link key={key} to={'/results/' + key} className="list-group-item">{m.monthName}</Link>
				);
			});
		}
		renderYears() {
			return this.state.menuData.map(y => {
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
		}
		firstYear: undefined
		render() {
			if (!this.state.menuData.length) {
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
		}
		componentDidMount() {
			$('#'+this.firstYear).click();
		}
	}

	class ResultsContainer extends React.Component {
		render() {
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
	}

	class ResultsPage extends React.Component {
		constructor(props) {
			super(props);
			if (props.defaultResults) {
				this.state = {
					results: props.defaultResults,
					loading: false
				};
				return;
			}
			this.updateData(props.params.month, props.params.year);
			this.state = {
				results: {items: []},
				loading: true
			};
		}
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
		// }
		getApiResults(month, year) {
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
		}
		updateData(month, year) {
			if (month !== undefined && year !== undefined) {
				this.getApiResults(month, year);
			}
		}
		componentWillReceiveProps(nextProps) {
			var p = this.props.params;
			var np = nextProps.params;
			if (p.month !== np.month || p.year !== np.year) {
				this.setState({loading: true});
				this.updateData(np.month, np.year);
			}
		}
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
		 * }
		 * componentDidMount() {
		 *   this.setAnchorScrollingBehaviour();
		 * }
		 * componentDidUdpate() {
		 *   this.setAnchorScrollingBehaviour();
		 * }*/
		render() {
			return (
				<div className="row">
					<ResultsContainer results={this.state.results} loading={this.state.loading}/>
					<ResultsMenu />
				</div>
			);
		}
	}

	// Allows us to set/access route props in router v4
	// https://github.com/ReactTraining/react-router/issues/4105#issuecomment-289195202
	const renderMergedProps = (component, ...rest) => {
		const finalProps = Object.assign({}, ...rest);
		return (
			React.createElement(component, finalProps)
		);
	};

	const PropsRoute = ({ component, ...rest }) => {
		return (
			<Route {...rest} render={routeProps => {
				return renderMergedProps(component, routeProps, rest);
			}}/>
		);
	};

	const mostRecentResults = JSON.parse($('#result-data').val());
  const browserHistory = createBrowserHitory();
	
  ReactDOM.render((
   <BrowserRouter history={browserHistory}>
		  <div>
				<PropsRoute path="/results" component={ResultsPage} defaultResults={mostRecentResults}/>
				<Route path="/results/:month/:year" component={ResultsPage}/>
			</div>
    </BrowserRouter>
  ), document.getElementById('results-page'));
};
