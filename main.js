let currentword = 0;
let maxword = 0;
let correctwords = 0;
let incorrectwords = 0;
let scores = 0;
let words = [];
let dict = {};
function speakcurrentword() {
    if ('speechSynthesis' in window) {
        var msg = new SpeechSynthesisUtterance();
        msg.text = words[currentword];
        msg.voice = window.speechSynthesis.getVoices()[document.getElementById('voices').options[parseInt(document.getElementById('voices').selectedIndex)].value];
        window.speechSynthesis.speak(msg);
        var voices = window.speechSynthesis.getVoices();
        console.log(voices)

    }else{
        alert("Sorry, your browser doesn't support text to speech!");
    }
}
function test() {
    var msg = new SpeechSynthesisUtterance();
    msg.text = 'hello world';
    msg.voice = window.speechSynthesis.getVoices()[document.getElementById('voices').options[parseInt(document.getElementById('voices').selectedIndex)].value];
    window.speechSynthesis.speak(msg);
    update()
}
function on() {
    var youtyped = document.getElementById("enter").value;
    youtyped.replaceAll("/[^A-Za-z0-9]/g","");
    youtyped.replaceAll(" ","")
    document.getElementById("wordwass").innerText = words[currentword].toLowerCase();
    document.getElementById("youtyped").innerText = youtyped.toLowerCase();
    var perecent = calculatepercent(youtyped.toLowerCase(),words[currentword].toLowerCase());
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
    achievements();
    document.getElementById("overlay").style.display = "none";
    document.getElementById("enter").value = "";
    if(currentword == maxword) {
        return end();
    }
    currentword++;
    updatedict();
    document.getElementById("rem").innerText = maxword-currentword;
}
function updatedict() {
    fetch('https://api.dictionaryapi.dev/api/v2/entries/en/'+words[currentword])
        .then(response => response.text())
        .then(text => {
            dict = (JSON.parse(text));
            var defs = "";
            console.log(dict[0]);
            dict[0].meanings.forEach(meaning => {
                defs += "" + meaning.partOfSpeech+ ": "
                for(var i = 0; i < Math.min(meaning.definitions.length,2); i++) {
                    defs += meaning.definitions[i].definition;
                    defs += " ";
                }
                defs += "<br>"
            })
            document.getElementById("definition").innerHTML = defs;
            document.getElementById("link").innerHTML = "";
            var link = document.createElement("a");
            link.href = dict[0].sourceUrls[0];
            link.innerText = words[currentword] + " on " + new URL(dict[0].sourceUrls[0]).hostname;
            document.getElementById("link").append(link);
            console.log(link.innerText);

        });
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
    update();
}

function achievements() {
    if(scores >= 100) {
        setachievement("Get a score of over 100", "New theme unlocked!", "darktheme")
    }
    if(scores >= 200) {
        setachievement("Get a score of over 200", "New theme unlocked!", "bluetheme")
    }
    if(scores >= 300) {
        setachievement("Get a score of over 300", "New theme unlocked!", "oledtheme")
    }
    if(scores >= 400) {
        setachievement("Get a score of over 400", "New theme unlocked!", "darkbluetheme")
    }
    if(scores >= 500) {
        setachievement("Get a score of over 500", "New theme unlocked!", "greendient")
    }
    if(scores >= 1000) {
        setachievement("Get a score of over 1000", "You've won a free hamburger", "hsmb")
    }
    if(scores >= 2000) {
        setachievement("Get a score of over 2000", "Still offering that hamburger.", "ham")
    }
    if(scores >= 3000) {
        setachievement("Get a score of over 3000", "Anyone who can send me a screenshot that they earned this legit wins like $5000.", "hm")
    }

    if(correctwords >= 50) {
        setachievement("Get 50 correct words in a row.", "New theme unlocked!", "rainbow")
    }
    if(correctwords >= 100) {
        setachievement("Get 100 correct words in a row.", "New theme unlocked!", "pinecone")
    }
    if(correctwords >= 200) {
        setachievement("Get 200 correct words in a row.", "New theme unlocked!", "colors")
    }
    if(correctwords >= 500) {
        setachievement("Get 500 correct words in a row.", "New theme unlocked!", "red")
    }
    if(correctwords >= 1000) {
        setachievement("Get 1000 correct words in a row?!?!?!?!?", "New theme unlocked!", "epicrainbow")
    }

}
function setachievement(body,reward,id) {
    if(localStorage.getItem(id) == null) {
        document.getElementById("notificationbody").innerText = body;
        document.getElementById("notificationgoal").innerText = reward;
        document.getElementById("notification").style.display = "block";
        localStorage.setItem(id,"active");
        console.log("its null")
    }
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
    var e = document.getElementById("wordlists");
    fetch(e.value)
        .then(response => response.text())
        .then(text => {
            words = text.split("\n");

            for(var i = 0; i < words.length; i++) {
                words[i] = words[i].replace(/(\r\n|\n|\r)/gm, "");
            }
            if(document.getElementById("randomize").checked) {
                shuffle(words);
            }
            document.getElementById("rem").innerText = maxword-currentword;
            document.getElementById('finishword').innerText = words[document.getElementById('finishnum').value]
            document.getElementById('startword').innerText = words[document.getElementById('startnum').value];
            document.getElementById('finishnum').max = words.length-1;
            document.getElementById('startnum').max = words.length-1;
            updatedict();
        })
}
function update() {
    console.log("RUNNING")

    document.getElementById("prevscore").innerText = localStorage.getItem("lastscore");

    var voices = window.speechSynthesis.getVoices();
    for(var i = 0; i < voices.length; i++) {
        var el = document.createElement("option");
        el.value = i;
        el.innerText = voices[i].name;
        document.getElementById("voices").append(el);
    }

    gentable();
}

function shuffle(arr) {
    var index = arr.length;
    var randindex = 0;

    while(index != 0) {
        randindex = Math.floor(Math.random() * index);
        index--;

        [arr[index],arr[randindex]] = [arr[randindex],arr[index]];
    }
    return arr;
}
function play() {
    scores = 0;
    currentword = 0;
    correctwords = 0;
    incorrectwords = 0;
    currentword = document.getElementById('startnum').value;
    maxword = document.getElementById('finishnum').value;
    document.getElementById("wordright").innerText = correctwords;
    document.getElementById("wordwrong").innerText = incorrectwords;
    document.getElementById("score").innerText = scores;
    document.getElementById("rem").innerText = maxword-currentword;

    document.getElementById("titlescreen").style.display = "none";
    document.getElementById("game").style.display = "inline";
    updatedict()
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
    var nums = [];
    storedNames.forEach(score => {
        nums.push(parseInt(score));
    });
    nums = nums.sort(function(a, b) {
        return a - b;
    }).reverse();
    nums.forEach(score => {

        let row = table.insertRow().insertCell().textContent = score;
    });
    table.id = "datable";
    document.getElementById("tablespot").append(table);


}