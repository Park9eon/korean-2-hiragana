function createContextMenu(){
  return {
    title: "'%s'를 일본어로 읽기",
    contexts:["selection"],
    onclick: speech
  };
};

const contextMenuStop = {
  title: "그만!!!!",
  contexts:["selection"],
  onclick: stop
};

// 읽습니다.
function speech(info) {
  // 읽지 않는중에만 재생!
  var eventLinstener = function(eventRequest) {
    switch (eventRequest.type) {
      case "word": // 읽는 중 - 정지버튼 활성화
        chrome.contextMenus.update(info.menuItemId, contextMenuStop);
        break;
      case "end":
        chrome.contextMenus.update(info.menuItemId, createContextMenu());
        break;
    };
  };
  let jpText = korean_to_hiragana(info.selectionText)
  chrome.tts.speak(jpText, {'lang': 'ja-JP', 'rate': 1.0, "onEvent": eventLinstener}); // 선택한 글자, 언어, 속도, event처리
};

// 정지
function stop(info) {
  chrome.tts.stop();
  chrome.contextMenus.update(info.menuItemId, createContextMenu());
};

// 시작 - 기본설정
chrome.contextMenus.create(createContextMenu());

/**
 * Created by park9eon on 8/25/16.
 * from - https://github.com/Park9eon/Javascript-Korean-read-hiragana/blob/master/script.js
 */
// 일본어 자모 조합 리스트
const JP_WORD_TABLE =
    [//   ㅏ,　　 ㅐ,　　　 ㅑ,　　　ㅒ,　　 ㅓ,　　  ㅔ,　　　ㅕ,　　　ㅖ,　　　  ㅗ,　　　ㅘ,　　　  ㅙ,　　　ㅚ,　　　ㅛ,　　  ㅜ,　　　ㅝ,　　 ㅞ,　　　  ㅟ,　　　  ㅠ,　　　　ㅡ,　　  ㅢ,　　  ㅣ
        ["が",  "げ",   "ぎゃ", "ぎぇ", "ご",   "げ",  "ぎょ", "ぎぇ",   "ご",  "ごぁ",   "きぇ", "ごぇ", "ぎょ", "ぐ",  "ぐぉ", "ぐえ",   "ぐぃ",   "ぎゅ", "ぐ",   "ぐい",  "ぎ"], // ㄱ
        ["な",  "ね",   "にゃ", "しぇ", "の",   "ね",  "にょ", "にぇ",   "の",  "のぁ",   "にぇ", "のぇ", "にょ", "ぬ",  "ぬぉ", "ぬえ",   "ぬぃ",   "にゅ", "ぬ",   "ぬい",  "に"], // ㄴ
        ["だ",  "で",   "ぢゃ", "ぢぇ", "ど",   "で",  "ぢょ", "ぢぇ",   "ど",  "どぁ",   "ぢぇ", "どぇ", "ぢょ", "づ",  "づぉ", "づえ",   "づぃ",   "ぢゅ", "づ",   "づい",  "ぢ"], // ㄷ
        ["ら",  "れ",   "りゃ", "ふぇ", "ろ",   "れ",  "りょ", "ふぇ",   "ろ",  "ろぁ",   "りぇ", "ろぇ", "りょ", "る",  "るぉ", "るえ",   "るぃ",   "りゅ", "る",   "るい",  "り"], // ㄹ
        ["ま",  "め",   "みゃ", "みぇ", "も",   "め",  "みょ", "みぇ",   "も",  "もぁ",   "みぇ", "もぇ", "みょ", "む",  "むぉ", "むえ",   "むぃ",   "みゅ", "む",   "むい",  "み"], // ㅁ
        ["ば",  "べ",   "びゃ", "びぇ", "ぼ",   "べ",  "びょ", "びぇ",   "ぼ",  "ぼぁ",   "びぇ", "ぼぇ", "びょ", "ぶ",  "ぶぉ", "ぶえ",   "ぶぃ",   "びゅ", "ぶ",   "ぶい",  "び"], // ㅂ
        ["さ",  "せ",   "しゃ", "しぇ", "そ",   "せ",  "しょ", "しぇ",   "そ",  "そぁ",   "しぇ", "そぇ", "しょ", "す",  "すぉ", "すえ",   "すぃ",   "しゅ", "す",   "すい",  "し"], // ㅅ
        ["あ",  "え",   "や", 　"いぇ", "お",   "え",  "よ", 　"いぇ",   "お",  "わ",    "おえ", "おぃ",　"よ",  "う",  "うぉ", "うえ",   "うぃ",   "ゆ", 　 "う",  "うい",  "い"], // ㅇ
        ["じゃ", "じぇ", "じゃ", "じぇ", "じょ", "じぇ", "じょ", "じぇ",   "じょ", "じょあ", "しぇ", "じぇ", "じょ", "じゅ", "じゅ", "じゅえ", "じゅい",  "じゅ", "じゅ", "じゅい", "じ"], // ㅈ
        ["ちゃ", "ちぇ", "ちゃ", "ちぇ", "ちょ",　"ちぇ", "ちょ", "ちゅえ", "ちょ", "ちょあ", "ちぇ", "ちぇ", "ちょ", "ちゅ", "ちゅ", "つえ",   "ちゅい", "ちゅ",  "つ",  "ちゅい", "ち"], // ㅊ
        ["か",  "け",   "きゃ", "きぇ", "こ",   "け",  "きょ", "きぇ",   "こ",  "こあ",   "きぇ", "こぇ", "きょ",　"く",  "くぉ", "くえ",   "くぃ",  "きゅ",  "く",  "くい",  "き"], // ㅋ
        ["た",  "て",   "ちゃ", "ちぇ", "と",   "て",  "ちょ", "ちぇ",   "と",  "とあ",   "ちぇ", "とい", "ちょ",  "つ", "つぉ", "つえ",   "つぃ",   "ちゅ",  "つ",  "つい",  "ち"], // ㅌ
        ["ぱ",  "ぺ",   "ぴゃ", "ぴぇ", "ぽ",   "ぺ",  "ぴょ", "ぴぇ",   "ぽ",  "ぽあ",   "ぴぇ", "ぴぇ", "ぴょ",　"ぷ",  "ぷぉ", "ぷえ",   "ぷぃ",   "ぴゅ",  "ぷ",  "ぷい",  "ぴ"], // ㅍ
        ["は",  "へ",   "ひゃ", "ひぇ", "ほ",   "へ",  "ひょ", "ひぇ",   "ほ",  "ほあ",   "ほえ", "ほい", "ひょ",  "ふ", "ふぉ", "ふえ",   "ふぃ",   "ひゅ",  "ふ",  "ふい",  "ひ"] // ㅎ
    ];
// 일본어 받침모음 [] ㄱ,ㄲ,ㄳ,ㄴ,ㄵ,ㄶ,ㄷ,ㄹ,ㄺ,ㄻ,ㄼ,ㄽ,ㄾ,ㄿ,ㅀ,ㅁ,ㅂ,ㅄ,ㅅ,ㅆ,ㅇ,ㅈ,ㅊ,ㅋ,ㅌ,ㅍ,ㅎ
const JP_BADCHIM_TABLE = [undefined, "ぐ", "ぐ", "ぐ", "ん", "ん", "ん", "っ", "る", "ぐ", undefined, undefined, undefined, undefined, undefined, "る",　"ん", "ぶ", "ぶ", "っ", "っ", "ん", "っ", "っ", "く", "っ", "つ", "ぷ"];

const KR_WORD_CODE_FIRST = "가".charCodeAt(0);
const KR_WORD_CODE_LAST = "힣".charCodeAt(0);

/**
 * 자음 index 를 가져옵니다. 일본어에서 발음할 수 없는 쌍자음 index 를 한단계 낮춰줍니다.
 * @param ko_char {string}
 * @return {number}
 */
function get_kr_index_consonant(ko_char) {
    if (ko_char.length == 1) {
        var char_code = ko_char.charCodeAt(0);
        if (char_code >= KR_WORD_CODE_FIRST && char_code <= KR_WORD_CODE_LAST) {
            var number = parseInt(((char_code - KR_WORD_CODE_FIRST) / 28) / 21);
            if (number > 0) number--; // ㄲ
            if (number > 3) number--; // ㄸ
            if (number > 5) number--; // ㅃ
            if (number > 6) number--; // ㅆ
            if (number > 8) number--; // ㅉ
            return number;
        }
    }
}

/**
 * 모음 index 를 가져옵니다.
 * @param ko_char {string}
 * @return {number}
 */
function get_kr_index_vowel(ko_char) {
    if (ko_char.length == 1) {
        var char_code = ko_char.charCodeAt(0);
        if (char_code >= KR_WORD_CODE_FIRST && char_code <= KR_WORD_CODE_LAST) {
            return parseInt((char_code - KR_WORD_CODE_FIRST) / 28) % 21;
        }
    }
}

/**
 * 받칌 index를 가져옵니다.
 * @param ko_char {string}
 * @return {number}
 */
function get_kr_index_badchim(ko_char) {
    if (ko_char.length == 1) {
        var char_code = ko_char.charCodeAt(0);
        if (char_code >= KR_WORD_CODE_FIRST && char_code <= KR_WORD_CODE_LAST) {
            char_code = (char_code - KR_WORD_CODE_FIRST) % 28;
            return char_code;
        }
    }
}

/**
 * 한글 읽는 표기를 히라가나로 바꿔줍니다.
 * @param korean {string}
 * @return {string}
 */
function korean_to_hiragana(korean) {
    var japanese = "";
    for (var kr_char of korean) {
        var index_y = get_kr_index_consonant(kr_char);
        var index_x = get_kr_index_vowel(kr_char);
        if (index_x != undefined && index_y != undefined) {
            japanese += JP_WORD_TABLE[index_y][index_x];
            var index_z = get_kr_index_badchim(kr_char);
            var char = JP_BADCHIM_TABLE[index_z];
            if (char != undefined) {
                japanese += char;
            }
        } else {
            japanese += kr_char;
        }
    }
    return japanese;
}
