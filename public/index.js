const { interval, timer, pipe } = rxjs;
const { takeUntil } = rxjs.operators;

// CONSTANTS
let beenHereTimer = 0; // 10 seconds
const mcoDay = moment([2020, 03, 28]);
const showDays = document.getElementById('showDays');
const showHours = document.getElementById('showHours');
const showMinutes = document.getElementById('showMinutes');
const showSeconds = document.getElementById('showSeconds');
const movieTimes = [
    // { name: 'One piece', duration: { days: 16, hours: 18, minutes: 30 } },
    { name: 'Breaking bad', duration: { days: 2, hours: 14, minutes: 0 } },
    { name: 'Money Heist', duration: { days: 0, hours: 22, minutes: 54 } },
    { name: 'Stranger Things', duration: { days: 0, hours: 20, minutes: 50 } },
    { name: 'Standard anime episode (23 min)', duration: { days: 0, hours: 0, minutes: 23 } }
];

// ---- //

//emit value in sequence every 1 second
const source = interval(1000);

//after countdown milliseconds is reached, emit value
const timer$ = timer(countdown(moment(), mcoDay).value);

const subscribe = source.pipe(takeUntil(timer$)).subscribe((val) => {
    beenHereTimer = val;
    prepareTimeDifference(moment());
});

function prepareTimeDifference(momentNow) {
    const countdownTime = countdown(momentNow, mcoDay);
    showDays.innerText = countdownTime.days;
    showHours.innerText = countdownTime.hours;
    showMinutes.innerText = countdownTime.minutes;
    showSeconds.innerText = countdownTime.seconds;

    // get all minutes
    let countdownTimeInMinutes = Math.trunc((countdownTime.value / 1000) / 60);

    // if beenHere is divisible by 10 - meaning, every 10 seconds that passes
    if (beenHereTimer % 10 === 0) {
        // do movie calculation
        calculateMovieBinge(countdownTimeInMinutes);
    }
}

function calculateMovieBinge(countdownTimeInMinutes) {

    // TODO: (FEATURE) allow user to search for movie, base on movie result, do binge watch calculation
    movieTimes.forEach((movie) => {
        movie.duration['totalMinutes'] = ((movie.duration.days * 24) * 60) + (movie.duration.hours * 60) + (movie.duration.minutes);

        movie['rewatchByCountdownDifference'] = countdownTimeInMinutes > movie.duration['totalMinutes'] ? (countdownTimeInMinutes / movie.duration['totalMinutes']) : (movie.duration['totalMinutes'] / countdownTimeInMinutes);

        movie['rewatchByCountdownDifference'] = Math.trunc(movie['rewatchByCountdownDifference']);
    });

    displayBingeWatchInfo(movieTimes);
}

function displayBingeWatchInfo(movieTimes) {
    // clear ul every time. FIXME: This might be DOM stressing, risky.
    document.getElementById('bingWatchList').textContent = '';
    movieTimes.forEach((movie) => {
        let listItem = document.createElement("li");
        listItem.innerText = `${movie.name} - ${movie['rewatchByCountdownDifference']} times`;
        document.getElementById('bingWatchList').appendChild(listItem);
    });
}

