"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var SPEECH_START_CONTEXT_TITLE = "%s를 일본어로 읽기";
var SPEECH_STOP_CONTEXT_TITLE = "일본어로 그만읽기";
var CONVERT_CONTEXT_TITLE = "%s를 일본어로 변환";
var CONTEXT_TYPES = ["selection", "editable"];
var JKService = /** @class */ (function () {
    function JKService(contextMenu) {
        this.contextMenu = contextMenu;
    }
    JKService.prototype.getContext = function () {
        return null;
    };
    JKService.prototype.onCreate = function () {
        this.contextMenu.create(this.getContext());
    };
    JKService.prototype.onUpdate = function (menuItemId) {
        this.contextMenu.update(menuItemId, this.getContext());
    };
    /**
     * 자음 index 를 가져옵니다. 일본어에서 발음할 수 없는 쌍자음 index 를 한단계 낮춰줍니다.
     */
    JKService.prototype.getConsonantIndexAtKr = function (char) {
        var charCode = char.charCodeAt(0);
        if (charCode >= JKService.KR_WORD_CODE_FIRST && charCode <= JKService.KR_WORD_CODE_LAST) {
            var index = Math.floor(((charCode - JKService.KR_WORD_CODE_FIRST) / 28) / 21);
            if (index > 0)
                index--; // ㄲ
            if (index > 3)
                index--; // ㄸ
            if (index > 5)
                index--; // ㅃ
            if (index > 6)
                index--; // ㅆ
            if (index > 8)
                index--; // ㅉ
            return index;
        }
        else {
            return null;
        }
    };
    /**
     * 모음 index 를 가져옵니다.
     */
    JKService.prototype.getVowelIndexAtKr = function (char) {
        var charCode = char.charCodeAt(0);
        if (charCode >= JKService.KR_WORD_CODE_FIRST && charCode <= JKService.KR_WORD_CODE_LAST) {
            return Math.floor((charCode - JKService.KR_WORD_CODE_FIRST) / 28) % 21;
        }
        else {
            return null;
        }
    };
    /**
     * 받칌 index를 가져옵니다.
     */
    JKService.prototype.getBadchimIndexAtKr = function (char) {
        var charCode = char.charCodeAt(0);
        if (charCode >= JKService.KR_WORD_CODE_FIRST && charCode <= JKService.KR_WORD_CODE_LAST) {
            charCode = (charCode - JKService.KR_WORD_CODE_FIRST) % 28;
            return charCode;
        }
        else {
            return null;
        }
    };
    /**
     * 한글 읽는 표기를 히라가나로 바꿔줍니다.
     */
    JKService.prototype.getHiraganaAtKr = function (korean) {
        var _this = this;
        return korean.split("")
            .map(function (char) {
            if (char) {
                var consIndex = _this.getConsonantIndexAtKr(char);
                var vowelIndex = _this.getVowelIndexAtKr(char);
                if (consIndex !== null && vowelIndex !== null) {
                    var badchimIndex = _this.getBadchimIndexAtKr(char);
                    return "" + JKService.JP_WORD_TABLE[consIndex][vowelIndex] + (badchimIndex ? JKService.JP_BADCHIM_TABLE[badchimIndex] : '');
                }
                else if (char === '-') {
                    return 'ー';
                }
                else if (char === ' ' || char === ',') {
                    return '\\';
                }
                else if (char === '.') {
                    return '。';
                }
                else {
                    return char;
                }
            }
            else {
                return null;
            }
        }).join("");
    };
    /**
     * Created by park9eon on 8/25/16.
     * from - https://github.com/Park9eon/Javascript-Korean-read-hiragana/blob/master/script.js
     */
    // 일본어 자모 조합 리스트
    JKService.JP_WORD_TABLE = [
        ["が", "げ", "ぎゃ", "ぎぇ", "ご", "げ", "ぎょ", "ぎぇ", "ご", "ごぁ", "きぇ", "ごぇ", "ぎょ", "ぐ", "ぐぉ", "ぐえ", "ぐぃ", "ぎゅ", "ぐ", "ぐい", "ぎ"],
        ["な", "ね", "にゃ", "しぇ", "の", "ね", "にょ", "にぇ", "の", "のぁ", "にぇ", "のぇ", "にょ", "ぬ", "ぬぉ", "ぬえ", "ぬぃ", "にゅ", "ぬ", "ぬい", "に"],
        ["だ", "で", "ぢゃ", "ぢぇ", "ど", "で", "ぢょ", "ぢぇ", "ど", "どぁ", "ぢぇ", "どぇ", "ぢょ", "づ", "づぉ", "づえ", "づぃ", "ぢゅ", "ど", "づい", "ぢ"],
        ["ら", "れ", "りゃ", "ふぇ", "ろ", "れ", "りょ", "ふぇ", "ろ", "ろぁ", "りぇ", "ろぇ", "りょ", "る", "るぉ", "るえ", "るぃ", "りゅ", "る", "るい", "り"],
        ["ま", "め", "みゃ", "みぇ", "も", "め", "みょ", "みぇ", "も", "もぁ", "みぇ", "もぇ", "みょ", "む", "むぉ", "むえ", "むぃ", "みゅ", "む", "むい", "み"],
        ["ば", "べ", "びゃ", "びぇ", "ぼ", "べ", "びょ", "びぇ", "ぼ", "ぼぁ", "びぇ", "ぼぇ", "びょ", "ぶ", "ぶぉ", "ぶえ", "ぶぃ", "びゅ", "ぶ", "ぶい", "び"],
        ["さ", "せ", "しゃ", "しぇ", "そ", "せ", "しょ", "しぇ", "そ", "そぁ", "しぇ", "そぇ", "しょ", "す", "すぉ", "すえ", "すぃ", "しゅ", "す", "すい", "し"],
        ["あ", "え", "や", "いぇ", "お", "え", "よ", "いぇ", "お", "わ", "おえ", "おぃ", "よ", "う", "うぉ", "うえ", "うぃ", "ゆ", "う", "うい", "い"],
        ["じゃ", "じぇ", "じゃ", "じぇ", "じょ", "じぇ", "じょ", "じぇ", "じょ", "じょあ", "しぇ", "じぇ", "じょ", "じゅ", "じゅ", "じゅえ", "じゅい", "じゅ", "じゅ", "じゅい", "じ"],
        ["ちゃ", "ちぇ", "ちゃ", "ちぇ", "ちょ", "ちぇ", "ちょ", "ちゅえ", "ちょ", "ちょあ", "ちぇ", "ちぇ", "ちょ", "ちゅ", "ちゅ", "つえ", "ちゅい", "ちゅ", "つ", "ちゅい", "ち"],
        ["か", "け", "きゃ", "きぇ", "こ", "け", "きょ", "きぇ", "こ", "こあ", "きぇ", "こぇ", "きょ", "く", "くぉ", "くえ", "くぃ", "きゅ", "く", "くい", "き"],
        ["た", "て", "ちゃ", "ちぇ", "と", "て", "ちょ", "ちぇ", "と", "とあ", "ちぇ", "とい", "ちょ", "つ", "つぉ", "つえ", "つぃ", "ちゅ", "つ", "つい", "ち"],
        ["ぱ", "ぺ", "ぴゃ", "ぴぇ", "ぽ", "ぺ", "ぴょ", "ぴぇ", "ぽ", "ぽあ", "ぴぇ", "ぴぇ", "ぴょ", "ぷ", "ぷぉ", "ぷえ", "ぷぃ", "ぴゅ", "ぷ", "ぷい", "ぴ"],
        ["は", "へ", "ひゃ", "ひぇ", "ほ", "へ", "ひょ", "ひぇ", "ほ", "ほあ", "ほえ", "ほい", "ひょ", "ふ", "ふぉ", "ふえ", "ふぃ", "ひゅ", "ふ", "ふい", "ひ"] // ㅎ
    ];
    // 일본어 받침모음 []                ㄱ,   ㄲ,   ㄳ,   ㄴ,   ㄵ,    ㄶ,  ㄷ,   ㄹ,    ㄺ,   ㄻ,    ㄼ,   ㄽ,    ㄾ,   ㄿ,   ㅀ,   ㅁ,    ㅂ,  ㅄ,   ㅅ,ㅆ,ㅇ,ㅈ,ㅊ,ㅋ,ㅌ,ㅍ,ㅎ
    JKService.JP_BADCHIM_TABLE = [null, "ぐ", "ぐ", "ぐ", "ん", "ん", "ん", "っ", "る", "ぐ", "ん", "ぶ", "る", "っ", "ぶ", "る", "ん", "ぶ", "ぶ", "っ", "っ", "ん", "っ", "っ", "く", "っ", "っ", "ぷ"];
    JKService.KR_WORD_CODE_FIRST = "가".charCodeAt(0);
    JKService.KR_WORD_CODE_LAST = "힣".charCodeAt(0);
    return JKService;
}());
var SpeechService = /** @class */ (function (_super) {
    __extends(SpeechService, _super);
    function SpeechService(contextMenu, tts) {
        var _this = _super.call(this, contextMenu) || this;
        _this.status = false; // 실행중 true
        _this.status = false;
        _this.tts = tts;
        return _this;
    }
    SpeechService.create = function (contextMenu, tts) {
        return new SpeechService(contextMenu, tts);
    };
    SpeechService.prototype.getContext = function () {
        if (this.status) {
            return {
                title: SPEECH_STOP_CONTEXT_TITLE,
                contexts: CONTEXT_TYPES,
                onclick: this.stop.bind(this)
            };
        }
        else {
            // startContext
            return {
                title: SPEECH_START_CONTEXT_TITLE,
                contexts: CONTEXT_TYPES,
                onclick: this.start.bind(this)
            };
        }
    };
    // 읽습니다.
    // 읽지 않는중에만 재생!
    SpeechService.prototype.start = function (info, tab) {
        this.status = true;
        var jpText = this.getHiraganaAtKr(info.selectionText);
        // 선택한 글자, 언어, 속도, event처리
        this.tts.speak(jpText, {
            'lang': 'ja-JP',
            'rate': 1.0,
            "onEvent": this.createSpeechListener(info.menuItemId).bind(this)
        });
    };
    SpeechService.prototype.stop = function (info, tab) {
        this.tts.stop();
        this.status = false;
        this.onUpdate(info.menuItemId);
    };
    SpeechService.prototype.createSpeechListener = function (menuItemId) {
        var self = this;
        return function (eventRequest) {
            switch (eventRequest.type) {
                case "word":// 읽는 중 - 정지버튼 활성화
                    self.status = true;
                    self.onUpdate(menuItemId);
                    break;
                case "end":
                    self.status = false;
                    self.onUpdate(menuItemId);
                    break;
            }
        };
    };
    return SpeechService;
}(JKService));
var ConvertService = /** @class */ (function (_super) {
    __extends(ConvertService, _super);
    function ConvertService(contextMenu) {
        return _super.call(this, contextMenu) || this;
    }
    ConvertService.create = function (contextMenu) {
        return new ConvertService(contextMenu);
    };
    ConvertService.prototype.getContext = function () {
        return {
            title: CONVERT_CONTEXT_TITLE,
            contexts: CONTEXT_TYPES,
            onclick: this.translate.bind(this)
        };
    };
    ConvertService.prototype.translate = function (info, tab) {
        var jpText = this.getHiraganaAtKr(info.selectionText);
        if (info.editable) {
            chrome.tabs.executeScript({
                // language=JavaScript
                code: "var selection = window.getSelection();\nconsole.log(selection);\nif (selection.anchorNode.childNodes.length > 0) {\n    for (var i = 0; i < selection.anchorNode.childNodes.length; i++) {\n        var node = selection.anchorNode.childNodes[i];\n        if (node.value &&\n            (\n                node.type === 'text' ||\n                node.type === 'textarea' ||\n                node.type === 'search' ||\n                node.type === 'email'\n            )) {\n            if (node.value) {\n                node.value = \"" + jpText + "\";\n            }\n            if (node.nodeValue) {\n                node.nodeValue = \"" + jpText + "\";\n            }\n            if (node.nodeValue) {\n                node.textContent = \"" + jpText + "\";\n            }\n        }\n    }\n} else {\n    selection.anchorNode.nodeValue = \"" + jpText + "\";\n    selection.anchorNode.textContent = \"" + jpText + "\";\n}\n"
            });
        }
    };
    return ConvertService;
}(JKService));
// init
var speechService = SpeechService.create(chrome.contextMenus, chrome.tts);
var convertService = ConvertService.create(chrome.contextMenus);
speechService.onCreate();
convertService.onCreate();
