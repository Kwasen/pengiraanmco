const { interval, Subject, pipe } = rxjs;
const { takeUntil } = rxjs.operators;

// CONSTANTS
let beenHereTimer = 0; // 10 seconds
const mcoEndDay = moment([2020, 5, 9]);
const showDays = document.getElementById('showDays');
const showHours = document.getElementById('showHours');
const showMinutes = document.getElementById('showMinutes');
const showSeconds = document.getElementById('showSeconds');
const movieTimes = [
    // { name: 'One piece', duration: { days: 16, hours: 18, minutes: 30 } },
    { name: 'Breaking bad', duration: { days: 2, hours: 14, minutes: 0 } },
    { name: 'Money Heist', duration: { days: 0, hours: 22, minutes: 54 } },
    { name: 'Stranger Things', duration: { days: 0, hours: 20, minutes: 50 } },
    { name: 'Standard anime episode (23 min)', duration: { days: 0, hours: 0, minutes: 23 } },
    { name: 'Adventure Time', duration: { days: 2, hours: 22, minutes: 45 } },
    { name: 'Avatar: The Last Airbender', duration: { days: 1, hours: 6, minutes: 30 } },
    { name: 'The Big Bang Theory', duration: { days: 5, hours: 19, minutes: 30 } },
    { name: 'The Simpsons', duration: { days: 14, hours: 6, minutes: 30 } },
    { name: 'Friends (1994)', duration: { days: 5, hours: 1, minutes: 0 } },
    { name: 'How I Met Your Mother', duration: { days: 4, hours: 8, minutes: 0 } }
];

// ---- //

//emit value in sequence every 1 second
const source = interval(1000);

//after countdown milliseconds is reached, emit value
const destroy$ = new Subject();

console.log('2505600 vs countdown:: ', countdown(moment(), mcoEndDay));

// set formatted countdown date
document.getElementById('mcoCountDownFormattedDate').innerText = mcoEndDay.format('Do MMMM, YYYY');

const subscribe = source.pipe(takeUntil(destroy$))
    .subscribe((val) => {
        beenHereTimer = val;
        prepareTimeDifference(moment());

        let countDownDiff = countdown(moment(), mcoEndDay);
        if ([countDownDiff.days, countDownDiff.hours, countDownDiff.minutes, countDownDiff.seconds].every((val) => val <= 0)) {
            console.log('MCO Ended:: ', beenHereTimer);
            destroy$.next();

            showItsOver();
        }
    });

function showItsOver() {
    document.getElementById('timeContainer').style.display = 'none';
    document.getElementById('bingeWatchInfo').style.display = 'none';

    const showMsg = document.createElement('div');
    document.getElementById('mainTag').children[0].style.display = 'none';
    document.getElementById('mainTag').appendChild(showMsg);
    showMsg.innerHTML = `<h3>MCO is over. Good luck!</h3>`
}

function prepareTimeDifference(momentNow) {
    const countdownTime = countdown(momentNow, mcoEndDay);
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

        if (countdownTimeInMinutes > movie.duration['totalMinutes']) {
            movie['rewatchByCountdownDifference'] = (countdownTimeInMinutes / movie.duration['totalMinutes']);
            movie['rewatchByCountdownDifference'] = Math.trunc(movie['rewatchByCountdownDifference']);
        } else {
            movie['rewatchByCountdownDifference'] = (movie.duration['totalMinutes'] / countdownTimeInMinutes).toFixed(1);
        }


    });

    displayBingeWatchInfo(movieTimes);
}

function displayBingeWatchInfo(movieTimes) {
    // clear ul every time. FIXME: This might be DOM stressing, risky.
    document.getElementById('bingWatchList').textContent = '';
    movieTimes.forEach((movie) => {
        let listItem = document.createElement("li");
        listItem.innerHTML = `${movie.name} - <strong>${movie['rewatchByCountdownDifference']} times</strong>`;
        document.getElementById('bingWatchList').appendChild(listItem);
    });
}

