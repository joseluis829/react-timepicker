
import React, { Component } from 'react';
import moment from 'moment';
//import {DateTimePickerTime} from './TimeView.js';
import './react-datetime.css';
import onClickOutside from "react-onclickoutside";

var assign = Object.assign,
    PropTypes = React.PropTypes,
    createClass = React.createClass
    //,
    //moment = moment
    //,
    //React = React
    //CalendarContainer = require('./src/CalendarContainer')
    ;


    class DateTimePickerTime1 extends React.Component {

        constructor(props) {
            super(props);

            this.getInitialState = this.getInitialState.bind(this)
                this.calculateState = this.calculateState.bind(this)
                this.renderCounter = this.renderCounter.bind(this)
                this.renderDayPart = this.renderDayPart.bind(this)
                this.componentWillReceiveProps = this.componentWillReceiveProps.bind(this)
                this.updateMilli = this.updateMilli.bind(this)
                this.renderHeader = this.renderHeader.bind(this)
                this.onStartClicking = this.onStartClicking.bind(this)
                this.toggleDayPart = this.toggleDayPart.bind(this)
                this.increase = this.increase.bind(this)
                this.decrease = this.decrease.bind(this)
                this.pad = this.pad.bind(this)
                this.handleClickOutside = this.handleClickOutside.bind(this)

                this.state = this.getInitialState()

            }

            getInitialState() {
                return this.calculateState(this.props);
            }

            calculateState(props) {
                var date = props.selectedDate || props.viewDate,
                    format = props.timeFormat,
                    counters = []
                    ;

                if (format.toLowerCase().indexOf('h') !== -1) {
                    counters.push('hours');
                    if (format.indexOf('m') !== -1) {
                        counters.push('minutes');
                        if (format.indexOf('s') !== -1) {
                            counters.push('seconds');
                        }
                    }
                }

                var hours = date.format('H');

                var daypart = false;
                if (this.state !== null && this.props.timeFormat.toLowerCase().indexOf(' a') !== -1) {
                    if (this.props.timeFormat.indexOf(' A') !== -1) {
                        daypart = (hours >= 12) ? 'PM' : 'AM';
                    } else {
                        daypart = (hours >= 12) ? 'pm' : 'am';
                    }
                }

                return {
                    hours: hours,
                    minutes: date.format('mm'),
                    seconds: date.format('ss'),
                    milliseconds: date.format('SSS'),
                    daypart: daypart,
                    counters: counters
                };
            }

            renderCounter(type) {
                if (type !== 'daypart') {
                    var value = this.state[type];
                    if (type === 'hours' && this.props.timeFormat.toLowerCase().indexOf(' a') !== -1) {
                        value = (value - 1) % 12 + 1;

                        if (value === 0) {
                            value = 12;
                        }
                    }
                    return React.createElement('div', { key: type, className: 'rdtCounter' }, [
                        React.createElement('span', { key: 'up', className: 'rdtBtn', onMouseDown: this.onStartClicking('increase', type), onContextMenu: this.disableContextMenu }, '▲'),
                        React.createElement('div', { key: 'c', className: 'rdtCount' }, value),
                        React.createElement('span', { key: 'do', className: 'rdtBtn', onMouseDown: this.onStartClicking('decrease', type), onContextMenu: this.disableContextMenu }, '▼')
                    ]);
                }
                return '';
            }

            renderDayPart() {
                return React.createElement('div', { key: 'dayPart', className: 'rdtCounter' }, [
                    React.createElement('span', { key: 'up', className: 'rdtBtn', onMouseDown: this.onStartClicking('toggleDayPart', 'hours'), onContextMenu: this.disableContextMenu }, '▲'),
                    React.createElement('div', { key: this.state.daypart, className: 'rdtCount' }, this.state.daypart),
                    React.createElement('span', { key: 'do', className: 'rdtBtn', onMouseDown: this.onStartClicking('toggleDayPart', 'hours'), onContextMenu: this.disableContextMenu }, '▼')
                ]);
            }

            render() {
                var me = this,
                    counters = []
                    ;

                this.state.counters.forEach(function (c) {
                    if (counters.length)
                        counters.push(React.createElement('div', { key: 'sep' + counters.length, className: 'rdtCounterSeparator' }, ':'));
                    counters.push(me.renderCounter(c));
                });

                if (this.state.daypart !== false) {
                    counters.push(me.renderDayPart());
                }

                if (this.state.counters.length === 3 && this.props.timeFormat.indexOf('S') !== -1) {
                    counters.push(React.createElement('div', { className: 'rdtCounterSeparator', key: 'sep5' }, ':'));
                    counters.push(
                        React.createElement('div', { className: 'rdtCounter rdtMilli', key: 'm' },
                            React.createElement('input', { value: this.state.milliseconds, type: 'text', onChange: this.updateMilli })
                        )
                    );
                }

                return React.createElement('div', { className: 'rdtTime' },
                    React.createElement('table', {}, [
                        this.renderHeader(),
                        React.createElement('tbody', { key: 'b' }, React.createElement('tr', {}, React.createElement('td', {},
                            React.createElement('div', { className: 'rdtCounters' }, counters)
                        )))
                    ])
                );
            }

            componentWillMount() {
                var me = this;
                me.timeConstraints = {
                    hours: {
                        min: 0,
                        max: 23,
                        step: 1
                    },
                    minutes: {
                        min: 0,
                        max: 59,
                        step: 1
                    },
                    seconds: {
                        min: 0,
                        max: 59,
                        step: 1
                    },
                    milliseconds: {
                        min: 0,
                        max: 999,
                        step: 1
                    }
                };
                ['hours', 'minutes', 'seconds', 'milliseconds'].forEach(function (type) {
                    Object.assign(me.timeConstraints[type], me.props.timeConstraints[type]);
                });
                this.setState(this.calculateState(this.props));
            }

            componentWillReceiveProps(nextProps) {
                this.setState(this.calculateState(nextProps));
            }

            updateMilli(e) {
                var milli = parseInt(e.target.value, 10);
                if (milli === e.target.value && milli >= 0 && milli < 1000) {
                    this.props.setTime('milliseconds', milli);
                    this.setState({ milliseconds: milli });
                }
            }

            renderHeader() {
                if (!this.props.dateFormat)
                    return null;

                var date = this.props.selectedDate || this.props.viewDate;
                return React.createElement('thead', { key: 'h' }, React.createElement('tr', {},
                    React.createElement('th', { className: 'rdtSwitch', colSpan: 4, onClick: this.props.showView('days') }, date.format(this.props.dateFormat))
                ));
            }

            onStartClicking(action, type) {
                var me = this;

                return function () {
                    var update = {};
                    update[type] = me[action](type);
                    me.setState(update);

                    me.timer = setTimeout(function () {
                        me.increaseTimer = setInterval(function () {
                            update[type] = me[action](type);
                            me.setState(update);
                        }, 70);
                    }, 500);

                    me.mouseUpListener = function () {
                        clearTimeout(me.timer);
                        clearInterval(me.increaseTimer);
                        me.props.setTime(type, me.state[type]);
                        document.body.removeEventListener('mouseup', me.mouseUpListener);
                    };

                    document.body.addEventListener('mouseup', me.mouseUpListener);
                };
            }

            disableContextMenu(event) {
                event.preventDefault();
                return false;
            }

            padValues = {
                hours: 1,
                minutes: 2,
                seconds: 2,
                milliseconds: 3
            }

            toggleDayPart(type) { // type is always 'hours'
                var value = parseInt(this.state[type], 10) + 12;
                if (value > this.timeConstraints[type].max)
                    value = this.timeConstraints[type].min + (value - (this.timeConstraints[type].max + 1));
                return this.pad(type, value);
            }

            increase(type) {
                var value = parseInt(this.state[type], 10) + this.timeConstraints[type].step;
                if (value > this.timeConstraints[type].max)
                    value = this.timeConstraints[type].min + (value - (this.timeConstraints[type].max + 1));
                return this.pad(type, value);
            }

            decrease(type) {
                var value = parseInt(this.state[type], 10) - this.timeConstraints[type].step;
                if (value < this.timeConstraints[type].min)
                    value = this.timeConstraints[type].max + 1 - (this.timeConstraints[type].min - value);
                return this.pad(type, value);
            }

            pad(type, value) {
                var str = value + '';
                while (str.length < this.padValues[type])
                    str = '0' + str;
                return str;
            }

            handleClickOutside() {
                this.props.handleClickOutside();
            }
        }


        var DateTimePickerTime = onClickOutside(DateTimePickerTime1);


class CalendarContainer extends React.Component {

    constructor(props) {
        super(props);
    }

//React.createElement( this.viewComponents[ this.props.view ], this.props.viewProps );

    render() {
        console.log(this.props.viewProps)
        return (<DateTimePickerTime {...this.props.viewProps} ></DateTimePickerTime>);
    }
};





export class DateTime extends React.Component {


    static defaultProps = {
      ...Component.defaultProps,
      className: '',
			defaultValue: '',
			inputProps: {},
			input: true,
			onFocus: () => {},
			onBlur: () => {},
			onChange: () => {},
			onViewModeChange: () => {},
			timeFormat: true,
			timeConstraints: {},
			dateFormat: true,
			strictParsing: true,
			closeOnSelect: false,
			closeOnTab: true,
			utc: false
    }

    constructor(props) {
        super(props);

        this.getInitialState = this.getInitialState.bind(this)
        this.getStateFromProps = this.getStateFromProps.bind(this)
        this.getFormats = this.getFormats.bind(this)
        this.componentWillReceiveProps = this.componentWillReceiveProps.bind(this)
        this.onInputChange = this.onInputChange.bind(this)
        this.onInputKey = this.onInputKey.bind(this)
        this.setDate = this.setDate.bind(this)
        this.addTime = this.addTime.bind(this)
        this.subtractTime = this.subtractTime.bind(this)
        this.updateTime = this.updateTime.bind(this)
        this.setTime = this.setTime.bind(this)
        this.updateSelectedDate = this.updateSelectedDate.bind(this)
        this.openCalendar = this.openCalendar.bind(this)
        this.closeCalendar = this.closeCalendar.bind(this)
        this.handleClickOutside = this.handleClickOutside.bind(this)
        this.localMoment = this.localMoment.bind(this)
        this.getComponentProps = this.getComponentProps.bind(this)

        //this.props = { ...this.getDefaultProps(), ...this.props }

        this.state = this.getInitialState()

    }



	getInitialState () {
		var state = this.getStateFromProps( this.props );

		if ( state.open === undefined )
			state.open = !this.props.input;

		state.currentView = this.props.dateFormat ? (this.props.viewMode || state.updateOn || 'days') : 'time';

		return state;
	}

	getStateFromProps ( props ) {
		var formats = this.getFormats( props ),
			date = props.value || props.defaultValue,
			selectedDate, viewDate, updateOn, inputValue
			;

		if ( date && typeof date === 'string' )
			selectedDate = this.localMoment( date, formats.datetime );
		else if ( date )
			selectedDate = this.localMoment( date );

		if ( selectedDate && !selectedDate.isValid() )
			selectedDate = null;

		viewDate = selectedDate ?
			selectedDate.clone().startOf('month') :
			this.localMoment().startOf('month')
		;

		updateOn = this.getUpdateOn(formats);

		if ( selectedDate )
			inputValue = selectedDate.format(formats.datetime);
		else if ( date.isValid && !date.isValid() )
			inputValue = '';
		else
			inputValue = date || '';

		return {
			updateOn: updateOn,
			inputFormat: formats.datetime,
			viewDate: viewDate,
			selectedDate: selectedDate,
			inputValue: inputValue,
			open: props.open
		};
	}

	getUpdateOn ( formats ) {
		if ( formats.date.match(/[lLD]/) ) {
			return 'days';
		} else if ( formats.date.indexOf('M') !== -1 ) {
			return 'months';
		} else if ( formats.date.indexOf('Y') !== -1 ) {
			return 'years';
		}

		return 'days';
	}

	getFormats ( props ) {
		var formats = {
				date: props.dateFormat || '',
				time: props.timeFormat || ''
			},
			locale = this.localMoment( props.date, null, props ).localeData()
			;

		if ( formats.date === true ) {
			formats.date = locale.longDateFormat('L');
		}
		else if ( this.getUpdateOn(formats) !== 'days' ) {
			formats.time = '';
		}

		if ( formats.time === true ) {
			formats.time = locale.longDateFormat('LT');
		}

		formats.datetime = formats.date && formats.time ?
			formats.date + ' ' + formats.time :
			formats.date || formats.time
		;

		return formats;
	}

	componentWillReceiveProps ( nextProps ) {
		var formats = this.getFormats( nextProps ),
			updatedState = {}
		;

		if ( nextProps.value !== this.props.value ||
			formats.datetime !== this.getFormats( this.props ).datetime ) {
			updatedState = this.getStateFromProps( nextProps );
		}

		if ( updatedState.open === undefined ) {
			if ( typeof nextProps.open !== 'undefined' ) {
				updatedState.open = nextProps.open;
			} else if ( this.props.closeOnSelect && this.state.currentView !== 'time' ) {
				updatedState.open = false;
			} else {
				updatedState.open = this.state.open;
			}
		}

		if ( nextProps.viewMode !== this.props.viewMode ) {
			updatedState.currentView = nextProps.viewMode;
		}

		if ( nextProps.locale !== this.props.locale ) {
			if ( this.state.viewDate ) {
				var updatedViewDate = this.state.viewDate.clone().locale( nextProps.locale );
				updatedState.viewDate = updatedViewDate;
			}
			if ( this.state.selectedDate ) {
				var updatedSelectedDate = this.state.selectedDate.clone().locale( nextProps.locale );
				updatedState.selectedDate = updatedSelectedDate;
				updatedState.inputValue = updatedSelectedDate.format( formats.datetime );
			}
		}

		if ( nextProps.utc !== this.props.utc ) {
			if ( nextProps.utc ) {
				if ( this.state.viewDate )
					updatedState.viewDate = this.state.viewDate.clone().utc();
				if ( this.state.selectedDate ) {
					updatedState.selectedDate = this.state.selectedDate.clone().utc();
					updatedState.inputValue = updatedState.selectedDate.format( formats.datetime );
				}
			} else {
				if ( this.state.viewDate )
					updatedState.viewDate = this.state.viewDate.clone().local();
				if ( this.state.selectedDate ) {
					updatedState.selectedDate = this.state.selectedDate.clone().local();
					updatedState.inputValue = updatedState.selectedDate.format(formats.datetime);
				}
			}
		}
		//we should only show a valid date if we are provided a isValidDate function. Removed in 2.10.3
		/*if (this.props.isValidDate) {
			updatedState.viewDate = updatedState.viewDate || this.state.viewDate;
			while (!this.props.isValidDate(updatedState.viewDate)) {
				updatedState.viewDate = updatedState.viewDate.add(1, 'day');
			}
		}*/
		this.setState( updatedState );
	}

	onInputChange ( e ) {
		var value = e.target === null ? e : e.target.value,
			localMoment = this.localMoment( value, this.state.inputFormat ),
			update = { inputValue: value }
			;

		if ( localMoment.isValid() && !this.props.value ) {
			update.selectedDate = localMoment;
			update.viewDate = localMoment.clone().startOf('month');
		} else {
			update.selectedDate = null;
		}

		return this.setState( update, function() {
			return this.props.onChange( localMoment.isValid() ? localMoment : this.state.inputValue );
		});
	}

	onInputKey( e ) {
		if ( e.which === 9 && this.props.closeOnTab ) {
			this.closeCalendar();
		}
	}

	showView ( view ) {
		var me = this;
		return function() {
			me.state.currentView !== view && me.props.onViewModeChange( view );
			me.setState({ currentView: view });
		};
	}

	setDate ( type ) {
		var me = this,
			nextViews = {
				month: 'days',
				year: 'months'
			}
		;
		return function( e ) {
			me.setState({
				viewDate: me.state.viewDate.clone()[ type ]( parseInt(e.target.getAttribute('data-value'), 10) ).startOf( type ),
				currentView: nextViews[ type ]
			});
			me.props.onViewModeChange( nextViews[ type ] );
		};
	}

	addTime ( amount, type, toSelected ) {
		return this.updateTime( 'add', amount, type, toSelected );
	}

	subtractTime ( amount, type, toSelected ) {
		return this.updateTime( 'subtract', amount, type, toSelected );
	}

	updateTime ( op, amount, type, toSelected ) {
		var me = this;

		return function() {
			var update = {},
				date = toSelected ? 'selectedDate' : 'viewDate'
			;

			update[ date ] = me.state[ date ].clone()[ op ]( amount, type );

			me.setState( update );
		};
	}

    allowedSetTime = ['hours', 'minutes', 'seconds', 'milliseconds']

	setTime( type, value ) {
		var index = this.allowedSetTime.indexOf( type ) + 1,
			state = this.state,
			date = (state.selectedDate || state.viewDate).clone(),
			nextType
			;

		// It is needed to set all the time properties
		// to not to reset the time
		date[ type ]( value );
		for (; index < this.allowedSetTime.length; index++) {
			nextType = this.allowedSetTime[index];
			date[ nextType ]( date[nextType]() );
		}

		if ( !this.props.value ) {
			this.setState({
				selectedDate: date,
				inputValue: date.format( state.inputFormat )
			});
		}
		this.props.onChange( date );
	}

	updateSelectedDate ( e, close ) {
		var target = e.target,
			modifier = 0,
			viewDate = this.state.viewDate,
			currentDate = this.state.selectedDate || viewDate,
			date
			;

		if (target.className.indexOf('rdtDay') !== -1) {
			if (target.className.indexOf('rdtNew') !== -1)
				modifier = 1;
			else if (target.className.indexOf('rdtOld') !== -1)
				modifier = -1;

			date = viewDate.clone()
				.month( viewDate.month() + modifier )
				.date( parseInt( target.getAttribute('data-value'), 10 ) );
		} else if (target.className.indexOf('rdtMonth') !== -1) {
			date = viewDate.clone()
				.month( parseInt( target.getAttribute('data-value'), 10 ) )
				.date( currentDate.date() );
		} else if (target.className.indexOf('rdtYear') !== -1) {
			date = viewDate.clone()
				.month( currentDate.month() )
				.date( currentDate.date() )
				.year( parseInt( target.getAttribute('data-value'), 10 ) );
		}

		date.hours( currentDate.hours() )
			.minutes( currentDate.minutes() )
			.seconds( currentDate.seconds() )
			.milliseconds( currentDate.milliseconds() );

		if ( !this.props.value ) {
			var open = !( this.props.closeOnSelect && close );
			if ( !open ) {
				this.props.onBlur( date );
			}

			this.setState({
				selectedDate: date,
				viewDate: date.clone().startOf('month'),
				inputValue: date.format( this.state.inputFormat ),
				open: open
			});
		} else {
			if ( this.props.closeOnSelect && close ) {
				this.closeCalendar();
			}
		}

		this.props.onChange( date );
	}

	openCalendar( e ) {
		if ( !this.state.open ) {
			this.setState({ open: true }, function() {
				this.props.onFocus( e );
			});
		}
	}

	closeCalendar() {
		this.setState({ open: false }, function () {
			this.props.onBlur( this.state.selectedDate || this.state.inputValue );
		});
	}

	handleClickOutside() {
		if ( this.props.input && this.state.open && !this.props.open ) {
			this.setState({ open: false }, function() {
				this.props.onBlur( this.state.selectedDate || this.state.inputValue );
			});
		}
	}

	localMoment( date, format, props ) {
		props = props || this.props;
    console.log(moment)
		var momentFn = props.utc ? moment.utc : moment;
		var m = momentFn( date, format, props.strictParsing );
		if ( props.locale )
			m.locale( props.locale );
		return m;
	}

	componentProps = {
		fromProps: ['value', 'isValidDate', 'renderDay', 'renderMonth', 'renderYear', 'timeConstraints'],
		fromState: ['viewDate', 'selectedDate', 'updateOn'],
		fromThis: ['setDate', 'setTime', 'showView', 'addTime', 'subtractTime', 'updateSelectedDate', 'localMoment', 'handleClickOutside']
	}

	getComponentProps () {
		var me = this,
			formats = this.getFormats( this.props ),
			props = {dateFormat: formats.date, timeFormat: formats.time}
			;

		this.componentProps.fromProps.forEach( function( name ) {
			props[ name ] = me.props[ name ];
		});
		this.componentProps.fromState.forEach( function( name ) {
			props[ name ] = me.state[ name ];
		});
		this.componentProps.fromThis.forEach( function( name ) {
			props[ name ] = me[ name ];
		});

		return props;
	}

	render () {
		// TODO: Make a function or clean up this code,
		// logic right now is really hard to follow
		var className = 'rdt' + (this.props.className ?
                  ( Array.isArray( this.props.className ) ?
                  ' ' + this.props.className.join( ' ' ) : ' ' + this.props.className) : ''),
			children = [];

		if ( this.props.input ) {
			var finalInputProps = assign({
				type: 'text',
				className: 'form-control',
				onClick: this.openCalendar,
				onFocus: this.openCalendar,
				onChange: this.onInputChange,
				onKeyDown: this.onInputKey,
				value: this.state.inputValue,
			}, this.props.inputProps);
			if ( this.props.renderInput ) {
				children = [ React.createElement('div', { key: 'i' }, this.props.renderInput( finalInputProps, this.openCalendar )) ];
			} else {
				children = [ React.createElement('input', assign({ key: 'i' }, finalInputProps ))];
			}
		} else {
			className += ' rdtStatic';
		}

		if ( this.state.open )
			className += ' rdtOpen';

        return React.createElement('div', { className: className },
        [
          React.createElement('input', assign({ key: 'i' }, finalInputProps )),
          React.createElement('div',
              { key: 'dt', className: 'rdtPicker' },
              React.createElement(CalendarContainer, { view: this.state.currentView, viewProps: this.getComponentProps(), onClickOutside: this.handleClickOutside })
          )
        ]

        );


        /*return (
        <div className={className}>
          <div key='dt' className='rdtPicker' >
            <CalendarContainer {...{ view: this.state.currentView, viewProps: this.getComponentProps(), onClickOutside: this.handleClickOutside }}>
            </CalendarContainer>
          </div>
        </div>);*/
	}
};

// Make moment accessible through the Datetime class
DateTime.moment = moment;
