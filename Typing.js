const words = [
    "apple", "banana", "orange", "keyboard", "javascript",
    "window", "computer", "sushi", "game", "speed"
];

const GameState = {
    TITLE: "TITLE",
    PLAYING: "PLAYING",
    ENDED: "ENDED"
}

const wordEl = document.getElementById("word");
const inputEl = document.getElementById("input");
const scoreEl = document.getElementById("score");
const timeEl = document.getElementById("time");
const timeImageEL = document.getElementById("timeImage");
const enemyHPImageEL = document.createElement("enemyHPImage");
const startTime = 30;       //ゲームすべての制限時間
const questionTime = 5;     //１問あたりの制限時間
const startImageX = timeImageEL.offsetLeft;
const changeWordX = window.innerWidth - 100;
const enemyHP = 100;

let currentWord = "";
let score = 0;
let time = startTime;
let timerId = null;
let inputWord = "";
let num = 0;
let input = '';
let state = GameState.TITLE;
let x = timeImageEL.offsetLeft;


// ランダムな単語をセット
function setNewWord() {
    //画像表示
    timeImageEL.style.visibility = "visible";
    enemyHPImageEL.style.visibility = "visible";
    timeImageEL.style.left = startImageX + "px";
    x = startImageX;
    const index = Math.floor(Math.random() * words.length);
    currentWord = words[index];
    wordEl.textContent = currentWord;
    inputEl.value = "";
}

function setUpWord() {
    currentWord = 'Enterキーを押してスタート!';
    wordEl.textContent = currentWord;
}

function result(){
    currentWord = 'Enterキーでもう一度プレイ！'
    wordEl.textContent = currentWord;
}

// タイマー開始
function startTimer() {
    if (timerId !== null) return; // 二重起動防止
    timerId = setInterval(() => {
        time--;
        timeEl.textContent = `Time: ${time}`;

        if (time <= 0) {
            resetTimer();
            inputEl.disabled = true;
            wordEl.textContent = "終了!";
            state = GameState.ENDED;
        }
    }, 1000);
}

//タイマーリセット
function resetTimer(){
    stopTimer();
    time = startTime;
    timeEl.textContent = `Time: ${time}`;
}

//タイマーを止める
function stopTimer(){
    clearInterval(timerId);
    timerId = null;
}

function upData() {
    switch (state) {
        case GameState.TITLE:
            break;
        case GameState.PLAYING:
            x++;
            timeImageEL.style.left = x + "px";
            if(x >= changeWordX){
                x = startImageX;
                setNewWord();
                inputWord = "";
                num = 0;
                inputEl.textContent = inputWord;
            }
            break;
        case GameState.ENDED:
            break;
    }
    requestAnimationFrame(upData);
}

function setHP(percent) {
    const maxWidth = 200; // 画像の幅
    document.querySelector('.enemyHP-wrapper').style.width = (maxWidth * percent) + 'px';
}

// 50%にする
setHP(0.5);


requestAnimationFrame(upData);


// 初期化
setUpWord();
inputEl.focus();

//入力イベント
document.addEventListener('keydown', (e) => {
    //タイトル
    if(state === GameState.TITLE) {
        if(e.key === 'Enter'){
            //エンターキーでスタート
            startTimer();
            setNewWord();
            state = GameState.PLAYING;
        }
    }
    //ゲーム中
    else if(state === GameState.PLAYING) {
        if(e.key === 'Escape'){
            //エスケープキーでリザルトへ
            resetTimer();
            result();
            state = GameState.ENDED;
        }
        else{
            input = e.key;
            if(currentWord[num] === input){
                num++;
                inputWord += input;
                inputEl.textContent = inputWord;
                input = "";
                if(num >= currentWord.length){
                    score++;
                    scoreEl.textContent = "Score:" + score;
                    setNewWord();
                    num = 0;
                    inputWord = "";
                    inputEl.textContent = inputWord;
                }
            }
        }
    }
    //リザルト
    else if(state === GameState.ENDED){
        if(e.key === 'Enter'){
            //エンターキーでゲームスタート
            inputword = "";
            startTimer();
            setNewWord();
            state = GameState.PLAYING;
            score = 0;
        }
    }

});


