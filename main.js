let currentword = 0;
let maxword = 0;
let correctwords = 0;
let incorrectwords = 0;
let scores = 0;
let words = [];
function speakcurrentword() {
    if ('speechSynthesis' in window) {
        var msg = new SpeechSynthesisUtterance();
        msg.text = words[currentword];
        window.speechSynthesis.speak(msg);
    }else{
        alert("Sorry, your browser doesn't support text to speech!");
    }
}

function on() {
    document.getElementById("wordwass").innerText = words[currentword];
    document.getElementById("youtyped").innerText = document.getElementById("enter").value;
    var perecent = calculatepercent(document.getElementById("enter").value,words[currentword]);
    document.getElementById("accuracy").innerText = perecent;
    var congrat;
    if(perecent <= 25) {
        congrat = "You tried."
        var audio = document.getElementById("wrong");
        audio.play();
        incorrectwords++;
    }
    else if(perecent < 100) {
        congrat = "Close!"
        var audio = document.getElementById("wrong");
        audio.play();
        incorrectwords++;
    }
    else {
        congrat = "Perfect!"
        var audio = document.getElementById("correct");
        audio.play();
        correctwords++;

    }
    document.getElementById("congrat").innerText = congrat;

    document.getElementById("overlay").style.display = "block";
    document.getElementById("wordright").innerText = correctwords;
    document.getElementById("wordwrong").innerText = incorrectwords;
    document.getElementById("score").innerText = scores;


}

function off() {
    document.getElementById("overlay").style.display = "none";
    document.getElementById("enter").value = "";
    if(currentword == maxword) {
        return end();
    }
    currentword++;
    document.getElementById("rem").innerText = maxword-currentword;
}

function end() {
    var storedNames = JSON.parse(localStorage.getItem("scores"));
    if(!storedNames) {
        storedNames = [];
    }
    storedNames.push(scores);
    storedNames.sort();
    localStorage.setItem("scores", JSON.stringify(storedNames));
    localStorage.setItem("lastscore", scores);

    currentword = document.getElementById('startnum').value;
    maxword = document.getElementById('finishnum').value;
    document.getElementById("titlescreen").style.display = "inline";
    document.getElementById("game").style.display = "none";
    update()
}
function calculatepercent(a, b) {
    if(a == b) {
        scores += b.length;
        return 100;
    }
    if(a.length == 0) {
        return 0;
    }
    var maxlen = Math.max(a.length,b.length);
    var minlen = Math.min(a.length, b.length);
    var charatindex = 0;
    for(var i = 0; i < minlen; i++) {
        if(a[i] == b[i]) {
            charatindex++;
        }
    }
    scores += charatindex;
    return charatindex / maxlen * 100;
}
function load() {
    update()
    fetch('words.txt')
        .then(response => response.text())
        .then(text => {
            words = text.split("\n");
            document.getElementById("rem").innerText = maxword-currentword;
            document.getElementById('finishword').innerText = words[document.getElementById('finishnum').value]
            document.getElementById('startword').innerText = words[document.getElementById('startnum').value];
            document.getElementById('finishnum').max = words.length-1;
            document.getElementById('startnum').max = words.length-1;

        })
}
function update() {
    document.getElementById("prevscore").innerText = localStorage.getItem("lastscore");
    gentable();
}
function play() {
    currentword = document.getElementById('startnum').value;
    maxword = document.getElementById('finishnum').value;
    document.getElementById("titlescreen").style.display = "none";
    document.getElementById("game").style.display = "inline";

}
function gentable() {
    if(document.getElementById("datable") != null) {
        document.getElementById("datable").remove();
    }
    let table = document.createElement('table');
    var headerCell = document.createElement("TH");
    headerCell.innerText = "High Scores:"
    table.insertRow().append(headerCell);
    var storedNames = JSON.parse(localStorage.getItem("scores"));
    if(!storedNames) {
        storedNames = [];
    }
    storedNames.sort().reverse();
    storedNames.forEach(score => {
        let row = table.insertRow().insertCell().textContent = score;
    });
    table.id = "datable";
    document.getElementById("tablespot").append(table);

}