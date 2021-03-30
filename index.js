let container;
let button;

let order = [];
let participantID;
let startType;

let currentStep = -1;
let trialStartTime;
let trialNumbers;
let readyInterval;

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
    for(let i =0; i<count; i++) {
        let num;
        do {
            num = Math.floor(Math.random() * 100);
        } while (findIndex(num, r) >= 0);
        r.push(num);
    }
    return r;
}

function generateTexts() {
    container.className = 'textView';
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
    table += 'Please complete the following <a href="https://forms.gle/KepbBzrjm1TzS8Lt7" target="_blank">survey</a>';
    document.body.innerHTML = table;
}

function generateReadyText() {
    readyInterval--;
    if(readyInterval === 0) {
        trialStartTime = new Date();
        container.textContent = '';
        if(currentStep < order.length) {
            if (startType === '0')
                generateTexts();
            else if (startType === '1')
                generateBars();
        } else if(currentStep < order.length * 2) {
            if (startType === '0')
                generateBars();
            else if (startType === '1')
                generateTexts();
        }
    }
    else {
        container.className = 'textView';
        container.innerHTML = 'Get Ready<br>' + readyInterval;
        setTimeout(generateReadyText, 1000);
    }
}

function nextTrial() {
    currentStep++;

    container.textContent = '';
    trialNumbers = generateRandomNumbers(order[currentStep%order.length]);

    if (currentStep === order.length * 2){
        generateReport();
    }
    else {
        alert('Press OK when you are ready. then click on the median number.');
        readyInterval = 4;
        generateReadyText();
    }
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
