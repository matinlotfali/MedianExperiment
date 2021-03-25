let container;
let button;

let order = [];
let participantID;
let startType;

let currentStep = -1;
let trialStartTime;
let trialNumbers;

let report = [];

function medianIndex() {
    return Math.floor(trialNumbers.length/2);
}

function findIndex(number, numbers) {
    for(let i = 0; i<numbers.length; i++)
        if(numbers[i] === number)
            return i;
    return -1;
}

function saveTrialInfo(numberClicked, type) {
    let sortedNumbers = [...trialNumbers];
    sortedNumbers.sort(function(a, b){return a-b});

    const median = sortedNumbers[medianIndex()];
    const errorIndex = Math.abs(findIndex(numberClicked, sortedNumbers)-medianIndex());
    const errorDiff = Math.abs(numberClicked - median);
    const time = new Date() - trialStartTime;

    let result = {
        PID: participantID,
        startType: startType,
        order: JSON.stringify(order),
        type: type,
        numbers: trialNumbers.length,
        selection: numberClicked,
        median: median,
        time: time,
        errorIndex: errorIndex,
        errorDiff: errorDiff
    }
    console.log(result);
    report.push(result);
}

function barClick(event) {
    const heightStrPx = event.target.style.height;
    const heightStr = heightStrPx.substr(0,heightStrPx.length-2);
    const height = parseInt(heightStr);
    const number = height/4;

    saveTrialInfo(number, '1');
    nextTrial();
}

function textClick(event) {
    const textStr = event.target.innerText;
    const text = parseInt(textStr);

    saveTrialInfo(text, '0');
    nextTrial();
}

function generateRandomNumbers(count) {
    let r = [];
    for(let i =0; i<count; i++)
        r.push(Math.floor(Math.random()*100));
    return r;
}

function generateTexts() {
    container.className = 'textView';
    container.textContent = '';
    for(let i =0; i<trialNumbers.length; i++) {
        let element = document.createElement('div');
        element.className = 'text';
        element.setAttribute('style',
            'width:' + (100/Math.ceil(Math.sqrt(trialNumbers.length))) + '%');
        element.innerText = trialNumbers[i];
        element.onclick = textClick;
        container.appendChild(element);
    }
}

function generateBars() {
    container.className = 'barChart';
    container.textContent = '';
    for(let i =0; i<trialNumbers.length; i++) {
        let element = document.createElement('div');
        element.className = 'bar';
        element.setAttribute('style','height:' + (trialNumbers[i]*4) + 'px');
        element.onclick = barClick;
        container.appendChild(element);
    }
}

function generateReport() {
    let table = '<table>';
    for (let row of report) {
        table += '<tr>';
        for (let item in row)
            table += '<td>' + row[item] + '</td>';
        table += '</tr>';
    }
    table += '</table>';
    document.body.innerHTML = table;
}

function nextTrial() {
    currentStep++;

    container.textContent = '';
    trialNumbers = generateRandomNumbers(order[currentStep%order.length]);

    if(currentStep < order.length) {
        alert('Showing new numbers.\nYou should click on the median number as fast as you can.\nPress OK when you are ready.');
        if (startType === '0')
            generateTexts();
        else if (startType === '1')
            generateBars();
    } else if(currentStep < order.length * 2) {
        alert('Showing new numbers.\nYou should click on the median number as fast as you can.\nPress OK when you are ready.');
        if (startType === '0')
            generateBars();
        else if (startType === '1')
            generateTexts();
    } else {
        generateReport();
    }

    trialStartTime = new Date();
}

function startButton() {
    const codeElement = document.getElementById('code');
    const values = codeElement.value.split(',');
    participantID = values[0];
    startType = values[1];
    for (i = 2; i<values.length; i++)
        order.push(parseInt(values[i]))

    console.log(values);
    nextTrial();
}

window.onload = function () {
    container = document.getElementById('container');
    button = document.getElementById('confirmButton');
}