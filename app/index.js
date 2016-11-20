import { createStore, applyMiddleware, compose } from 'redux';
import { combineEpics } from 'redux-observable';
import { createEpicMiddleware } from 'redux-observable';
import Rx from 'rxjs/Rx';
import $ from 'jquery';
// import 'rxjs/observable/dom/ajax';

//noinspection JSUnresolvedVariable
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const CHUCK_SUCCESS = 'SUCCESS';
const CHUCK_FAILED = 'FAILED';
const REQUEST_CHUCK = 'REQUEST';
const REQUEST_PENDING = 'PENDING';
const REQUEST_FINISHED = 'COMPLETED';

// const chuck$ =
//     Rx.Observable.defer(() => Rx.Observable
//         .fromPromise($.ajax({
//             type: "GET",
//             cache: false,
//             headers: { "cache-control": "no-cache" },
//             url: "https://api.chucknorris.io/jokes/random"}))
//         .map(data => ({ type: CHUCK_SUCCESS,
//             payload: data.value }))
//         .catch(err => Rx.Observable.of({
//             type: CHUCK_FAILED,
//             payload: err,
//             error: true })));

const chuck$ =
    Rx.Observable.defer(() =>
        Rx.Observable.ajax({
            crossDomain:true,
            url: "https://api.chucknorris.io/jokes/random?" + new Date().getTime().toString(),
            responseType: 'json',
            method: 'GET'
        })
        .map(data => ({ type: CHUCK_SUCCESS,
            payload: data.response.value }))
        .catch(err => Rx.Observable.of({
            type: CHUCK_FAILED,
            payload: err,
            error: true })));

// const chuckEpic = action$ =>
//     action$
//         .ofType(REQUEST_CHUCK)
//         .concatMapTo(Rx.Observable.concat(
//             Rx.Observable.of({type: REQUEST_PENDING}),
//             chuck$,
//             Rx.Observable.of({type: REQUEST_FINISHED})));

const chuckEpic = action$ =>
    action$
        .ofType(REQUEST_CHUCK)
        .mergeMapTo(Rx.Observable.concat(
            Rx.Observable.of({type: REQUEST_PENDING}),
            chuck$,
            Rx.Observable.of({type: REQUEST_FINISHED})));

const rootEpic = combineEpics(chuckEpic);

const epicMiddleware = createEpicMiddleware(rootEpic);

const reducer = (state = { fetchingChuck: false }, action) => {
    switch (action.type) {
        case REQUEST_CHUCK:
            console.log('CHUCK');
            return { fetchingChuck: true };
        case CHUCK_SUCCESS:
            console.log('SUCCESS: ' + JSON.stringify(action.payload));
            return state;
        case CHUCK_FAILED:
            console.log('ERROR: ' + JSON.stringify(action.payload));
            return state;

        case REQUEST_FINISHED:
            console.log('REQ FINISHED');
            return state;
        case REQUEST_PENDING:
            console.log('REQ PENDING');
            return state;
        default:
            return state;
    }
};

const store = createStore(
    reducer,
    composeEnhancers(
        applyMiddleware(epicMiddleware)
    )
);

const click$ = Rx.Observable.fromEvent(document.querySelector('button'), 'click');
click$.subscribe(evt => store.dispatch({ type: REQUEST_CHUCK }));
// console.log(store.dispatch({ type: REQUEST_CHUCK }));
