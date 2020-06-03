//Timer et Slider

//Timer
const FULL_DASH_ARRAY = 283;
const WARNING_THRESHOLD = 10;
const ALERT_THRESHOLD = 5;

const COLOR_CODES = {
    info: {
        color: "green"
    },
    warning: {
        color: "orange",
        threshold: WARNING_THRESHOLD
    },
    alert: {
        color: "red",
        threshold: ALERT_THRESHOLD
    }
};

let TIME_LIMIT;
let timePassed;
let timeLeft;
let timerInterval;
let remainingPathColor;


function StopTime() {
    clearInterval(timerInterval);
}

function startTimer(value) {
    clearInterval(timerInterval);
    TIME_LIMIT = value;
    timePassed = 0;
    timeLeft = TIME_LIMIT;
    timerInterval = null;
    remainingPathColor = COLOR_CODES.info.color;
    
    TIME_LIMIT = value;

    document.getElementById("app").innerHTML = `
                <div class="base-timer">
                  <svg class="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <g class="base-timer__circle">
                      <circle class="base-timer__path-elapsed" cx="50" cy="50" r="45"></circle>
                      <path
                        id="base-timer-path-remaining"
                        stroke-dasharray="283"
                        class="base-timer__path-remaining ${remainingPathColor}"
                        d="
                          M 50, 50
                          m -45, 0
                          a 45,45 0 1,0 90,0
                          a 45,45 0 1,0 -90,0
                        "
                      ></path>
                    </g>
                  </svg>
                  <span id="base-timer-label" class="base-timer__label">${formatTime(
        timeLeft
        )}</span>
                    </div>
                    `;
        timerInterval = setInterval(() => {
            timePassed = timePassed += 1;
            timeLeft = TIME_LIMIT - timePassed;
            //document.getElementById("base-timer-label") == null || 
            if (document.getElementById("app") == null) {
                StopTime();
            }
            else {
                document.getElementById("base-timer-label").innerHTML = formatTime(
                    timeLeft
                );
                setCircleDasharray();
                setRemainingPathColor(timeLeft);
            }

            if (timeLeft === 0) {
                StopTime();
            }
        }, 1000);
    }

function TimerExists() {
    if (document.getElementById("app") == null) {
        return false;
    }
    else return true;
}

function formatTime(time) {
    const minutes = Math.floor(time / 60);
    let seconds = time % 60;

    if (seconds < 10) {
        seconds = `0${seconds}`;
    }

    return `${minutes}:${seconds}`;
}

function setRemainingPathColor(timeLeft) {
    const { alert, warning, info } = COLOR_CODES;
    if (timeLeft <= alert.threshold) {
        document
            .getElementById("base-timer-path-remaining")
            .classList.remove(warning.color);
        document
            .getElementById("base-timer-path-remaining")
            .classList.add(alert.color);
    } else if (timeLeft <= warning.threshold) {
        document
            .getElementById("base-timer-path-remaining")
            .classList.remove(info.color);
        document
            .getElementById("base-timer-path-remaining")
            .classList.add(warning.color);
    }
}

function calculateTimeFraction() {
    const rawTimeFraction = timeLeft / TIME_LIMIT;
    return rawTimeFraction - (1 / TIME_LIMIT) * (1 - rawTimeFraction);
}

function setCircleDasharray() {
    const circleDasharray = `${(
        calculateTimeFraction() * FULL_DASH_ARRAY
    ).toFixed(0)} 283`;
    document
        .getElementById("base-timer-path-remaining")
        .setAttribute("stroke-dasharray", circleDasharray);
}

//Slider
var SliderValue;
var pipsSlider;

function ActivateSlider(difficulty) {
    pipsSlider = document.getElementById('slider-pips');

    noUiSlider.create(pipsSlider, {
        step: 1,
        range: {
            min: 0,
            max: 4
        },
        start: [difficulty],
        pips: { mode: 'values', values: [0, 1, 2, 3, 4], density: 20 ,  }
    });

    SliderValue = 2;
    var pips = pipsSlider.querySelectorAll('.noUi-value');
    var Largepips = pipsSlider.querySelectorAll('.noUi-marker');

    for (i = 0; i < Largepips.length; i++) {
        Largepips[i].classList.remove('noUi-marker-large');
        Largepips[i].classList.add('noUi-marker-sub');
    }

    function clickOnPip() {
        var value = Number(this.getAttribute('data-value'));
        pipsSlider.noUiSlider.set(value);
        //DotNet.invokeMethodAsync('ProjetTp1', 'SetSliderValue', value),
        //SliderValue = value;
    }

    pips[0].innerHTML = "Très Facile";
    pips[0].style.color = "black"
    pips[1].innerHTML = "Facile";
    pips[1].style.color = "black"
    pips[2].innerHTML = "Normal";
    pips[2].style.color = "black"
    pips[3].innerHTML = "Difficile";
    pips[3].style.color = "black"
    pips[4].innerHTML = "Très Difficile";
    pips[4].style.color = "black"

    for (var i = 0; i < pips.length; i++) {

        // For this example. Do this in CSS!
        pips[i].style.cursor = 'pointer';
        pips[i].addEventListener('click', clickOnPip);
    }

    pipsSlider.noUiSlider.on('update', function (values) {
        DotNet.invokeMethodAsync('ProjetTp1', 'SetSliderValue', values[0])
    });

};

function SliderExists() {
    var exists = (document.getElementById('slider-pips').innerHTML != "");
    if (exists == false) {
        return false;
    }
    else {
        return true;
    }
}

function UpdateSlider(value) {
    pipsSlider.noUiSlider.set(value)
}

//Window gestion
function GetWindowHeight() {
    return window.innerHeight;
};
function GetWindowWidth() {
    return window.innerWidth;
};
function GetDivToWindowSize(DivName) {
    var newHeight = document.documentElement.clientHeight;
    document.getElementById(DivName).style.height = Math.round(newHeight * 0.8).toString() + "px";
}
function changeBodyColor(color) {
    document.body.style.backgroundColor = color;
}

function focusElement(id) {
    const element = document.getElementById(id);
    $("#" + id).click();
    element.focus();
}

function GiveFocusKeyboard() {
    var element = document.getElementsByClassName('blazored-typeahead__input-mask')[0]
    var element1 = document.getElementsByClassName('blazored-typeahead__input-mask-wrapper')[0]
    var element2 = document.getElementsByClassName('blazored-typeahead__controls')[0]
    var element3 = document.getElementsByClassName('blazored-typeahead')[0]


    if (element1 != null) {
        element1.addEventListener('focusin', function (event) {
            if (element.textContent.trimLeft().trimRight() == "") {
                console.log("rien");
            $(".blazored-typeahead__input-mask").click();
            }
            //console.log(element.innerHTML);
        }, true);
    }

    //focusout
    if (element != null) {
        element.addEventListener('focusout', function (event) {
            $(".blazored-typeahead").click();
        }, true);
    }

    if (element1 != null) {
        element1.addEventListener('focusout', function (event) {
            $(".blazored-typeahead").click();
        }, true);
    }

    if (element2 != null) {
        element2.addEventListener('focusout', function (event) {
            $(".blazored-typeahead").click();
        }, true);
    }

    if (element3 != null) {
        element3.addEventListener('focusout', function (event) {
            $(".blazored-typeahead").click();
        }, true);
    }
}