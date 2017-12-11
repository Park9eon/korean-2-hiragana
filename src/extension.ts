const SPEECH_START_CONTEXT_TITLE = "%s를 일본어로 읽기";
const SPEECH_STOP_CONTEXT_TITLE = "일본어로 그만읽기";
const CONVERT_CONTEXT_TITLE = "%s를 일본어로 변환";
const CONTEXT_TYPES = ["selection", "editable"];

class JKService {

    /**
     * Created by park9eon on 8/25/16.
     * from - https://github.com/Park9eon/Javascript-Korean-read-hiragana/blob/master/script.js
     */
        // 일본어 자모 조합 리스트
    static JP_WORD_TABLE =
        [//   ㅏ,　　 ㅐ,　　　 ㅑ,　　　ㅒ,　　 ㅓ,　　  ㅔ,　　　ㅕ,　　　ㅖ,　　　  ㅗ,　　　ㅘ,　　　  ㅙ,　　　ㅚ,　　　ㅛ,　　  ㅜ,　　　ㅝ,　　 ㅞ,　　　  ㅟ,　　　  ㅠ,　　　　ㅡ,　　  ㅢ,　　  ㅣ
            ["が", "げ", "ぎゃ", "ぎぇ", "ご", "げ", "ぎょ", "ぎぇ", "ご", "ごぁ", "きぇ", "ごぇ", "ぎょ", "ぐ", "ぐぉ", "ぐえ", "ぐぃ", "ぎゅ", "ぐ", "ぐい", "ぎ"], // ㄱ
            ["な", "ね", "にゃ", "しぇ", "の", "ね", "にょ", "にぇ", "の", "のぁ", "にぇ", "のぇ", "にょ", "ぬ", "ぬぉ", "ぬえ", "ぬぃ", "にゅ", "ぬ", "ぬい", "に"], // ㄴ
            ["だ", "で", "ぢゃ", "ぢぇ", "ど", "で", "ぢょ", "ぢぇ", "ど", "どぁ", "ぢぇ", "どぇ", "ぢょ", "づ", "づぉ", "づえ", "づぃ", "ぢゅ", "づ", "づい", "ぢ"], // ㄷ
            ["ら", "れ", "りゃ", "ふぇ", "ろ", "れ", "りょ", "ふぇ", "ろ", "ろぁ", "りぇ", "ろぇ", "りょ", "る", "るぉ", "るえ", "るぃ", "りゅ", "る", "るい", "り"], // ㄹ
            ["ま", "め", "みゃ", "みぇ", "も", "め", "みょ", "みぇ", "も", "もぁ", "みぇ", "もぇ", "みょ", "む", "むぉ", "むえ", "むぃ", "みゅ", "む", "むい", "み"], // ㅁ
            ["ば", "べ", "びゃ", "びぇ", "ぼ", "べ", "びょ", "びぇ", "ぼ", "ぼぁ", "びぇ", "ぼぇ", "びょ", "ぶ", "ぶぉ", "ぶえ", "ぶぃ", "びゅ", "ぶ", "ぶい", "び"], // ㅂ
            ["さ", "せ", "しゃ", "しぇ", "そ", "せ", "しょ", "しぇ", "そ", "そぁ", "しぇ", "そぇ", "しょ", "す", "すぉ", "すえ", "すぃ", "しゅ", "す", "すい", "し"], // ㅅ
            ["あ", "え", "や", "いぇ", "お", "え", "よ", "いぇ", "お", "わ", "おえ", "おぃ", "よ", "う", "うぉ", "うえ", "うぃ", "ゆ", "う", "うい", "い"], // ㅇ
            ["じゃ", "じぇ", "じゃ", "じぇ", "じょ", "じぇ", "じょ", "じぇ", "じょ", "じょあ", "しぇ", "じぇ", "じょ", "じゅ", "じゅ", "じゅえ", "じゅい", "じゅ", "じゅ", "じゅい", "じ"], // ㅈ
            ["ちゃ", "ちぇ", "ちゃ", "ちぇ", "ちょ", "ちぇ", "ちょ", "ちゅえ", "ちょ", "ちょあ", "ちぇ", "ちぇ", "ちょ", "ちゅ", "ちゅ", "つえ", "ちゅい", "ちゅ", "つ", "ちゅい", "ち"], // ㅊ
            ["か", "け", "きゃ", "きぇ", "こ", "け", "きょ", "きぇ", "こ", "こあ", "きぇ", "こぇ", "きょ", "く", "くぉ", "くえ", "くぃ", "きゅ", "く", "くい", "き"], // ㅋ
            ["た", "て", "ちゃ", "ちぇ", "と", "て", "ちょ", "ちぇ", "と", "とあ", "ちぇ", "とい", "ちょ", "つ", "つぉ", "つえ", "つぃ", "ちゅ", "つ", "つい", "ち"], // ㅌ
            ["ぱ", "ぺ", "ぴゃ", "ぴぇ", "ぽ", "ぺ", "ぴょ", "ぴぇ", "ぽ", "ぽあ", "ぴぇ", "ぴぇ", "ぴょ", "ぷ", "ぷぉ", "ぷえ", "ぷぃ", "ぴゅ", "ぷ", "ぷい", "ぴ"], // ㅍ
            ["は", "へ", "ひゃ", "ひぇ", "ほ", "へ", "ひょ", "ひぇ", "ほ", "ほあ", "ほえ", "ほい", "ひょ", "ふ", "ふぉ", "ふえ", "ふぃ", "ひゅ", "ふ", "ふい", "ひ"] // ㅎ
        ];
    // 일본어 받침모음 []                ㄱ,   ㄲ,   ㄳ,   ㄴ,   ㄵ,    ㄶ,  ㄷ,   ㄹ,    ㄺ,   ㄻ,    ㄼ,   ㄽ,    ㄾ,   ㄿ,   ㅀ,   ㅁ,    ㅂ,  ㅄ,   ㅅ,ㅆ,ㅇ,ㅈ,ㅊ,ㅋ,ㅌ,ㅍ,ㅎ
    static JP_BADCHIM_TABLE = [null, "ぐ", "ぐ", "ぐ", "ん", "ん", "ん", "っ", "る", "ぐ", "ん", "ぶ", "る", "っ", "ぶ", "る", "ん", "ぶ", "ぶ", "っ", "っ", "ん", "っ", "っ", "く", "っ", "っ", "ぷ"];

    static KR_WORD_CODE_FIRST = "가".charCodeAt(0);
    static KR_WORD_CODE_LAST = "힣".charCodeAt(0);

    protected contextMenu: any;

    protected constructor(contextMenu: any) {
        this.contextMenu = contextMenu;
    }

    getContext(): any {
        return null;
    }

    onCreate() {
        this.contextMenu.create(this.getContext());
    }

    onUpdate(menuItemId: number) {
        this.contextMenu.update(menuItemId, this.getContext());
    }

    /**
     * 자음 index 를 가져옵니다. 일본어에서 발음할 수 없는 쌍자음 index 를 한단계 낮춰줍니다.
     */
    getConsonantIndexAtKr(char: string): number | null {
        let charCode = char.charCodeAt(0);
        if (charCode >= JKService.KR_WORD_CODE_FIRST && charCode <= JKService.KR_WORD_CODE_LAST) {
            let index = Math.floor(((charCode - JKService.KR_WORD_CODE_FIRST) / 28) / 21);
            if (index > 0) index--; // ㄲ
            if (index > 3) index--; // ㄸ
            if (index > 5) index--; // ㅃ
            if (index > 6) index--; // ㅆ
            if (index > 8) index--; // ㅉ
            return index;
        } else {
            return null;
        }
    }

    /**
     * 모음 index 를 가져옵니다.
     */
    getVowelIndexAtKr(char: string): number | null {
        let charCode = char.charCodeAt(0);
        if (charCode >= JKService.KR_WORD_CODE_FIRST && charCode <= JKService.KR_WORD_CODE_LAST) {
            return Math.floor((charCode - JKService.KR_WORD_CODE_FIRST) / 28) % 21;
        } else {
            return null;
        }
    }

    /**
     * 받칌 index를 가져옵니다.
     */
    getBadchimIndexAtKr(char: string): number | null {
        let charCode = char.charCodeAt(0);
        if (charCode >= JKService.KR_WORD_CODE_FIRST && charCode <= JKService.KR_WORD_CODE_LAST) {
            charCode = (charCode - JKService.KR_WORD_CODE_FIRST) % 28;
            return charCode;
        } else {
            return null;
        }
    }

    /**
     * 한글 읽는 표기를 히라가나로 바꿔줍니다.
     */
    getHiraganaAtKr(korean: string): string {
        return korean.split("")
            .map((char: string) => {
                if (char) {
                    let consIndex = this.getConsonantIndexAtKr(char);
                    let vowelIndex = this.getVowelIndexAtKr(char);
                    if (consIndex !== null && vowelIndex !== null) {
                        let badchimIndex = this.getBadchimIndexAtKr(char);
                        return `${JKService.JP_WORD_TABLE[consIndex][vowelIndex]}${badchimIndex ? JKService.JP_BADCHIM_TABLE[badchimIndex] : ''}`;
                    } else if (char === '-') {
                        return 'ー'
                    } else if (char === ' ' || char === ',') {
                        return '\\';
                    } else if (char === '.') {
                        return '。';
                    } else {
                        return char;
                    }
                } else {
                    return null;
                }
            }).join("");
    }
}

class SpeechService extends JKService {
    private status: boolean = false; // 실행중 true
    private tts: any;

    constructor(contextMenu: any, tts: any) {
        super(contextMenu);
        this.status = false;
        this.tts = tts;
    }

    static create(contextMenu: any, tts: any): SpeechService {
        return new SpeechService(contextMenu, tts);
    }

    getContext(): any {
        if (this.status) {
            return {
                title: SPEECH_STOP_CONTEXT_TITLE,
                contexts: CONTEXT_TYPES,
                onclick: this.stop.bind(this)
            };
        } else {
            // startContext
            return {
                title: SPEECH_START_CONTEXT_TITLE,
                contexts: CONTEXT_TYPES,
                onclick: this.start.bind(this)
            };
        }
    }

    // 읽습니다.
    // 읽지 않는중에만 재생!
    start(info: any, tab: any): void {
        this.status = true;
        let jpText = this.getHiraganaAtKr(info.selectionText);
        // 선택한 글자, 언어, 속도, event처리
        this.tts.speak(jpText, {
            'lang': 'ja-JP',
            'rate': 1.0,
            "onEvent": this.createSpeechListener(info.menuItemId).bind(this)
        });
    }

    stop(info: any, tab: any) {
        this.tts.stop();
        this.status = false;
        this.onUpdate(info.menuItemId);
    }

    createSpeechListener(menuItemId: number) {
        let self = this;
        return (eventRequest: any) => {
            switch (eventRequest.type) {
                case "word": // 읽는 중 - 정지버튼 활성화
                    self.status = true;
                    self.onUpdate(menuItemId);
                    break;
                case "end":
                    self.status = false;
                    self.onUpdate(menuItemId);
                    break;
            }
        };
    }
}

class ConvertService extends JKService {

    constructor(contextMenu: any) {
        super(contextMenu);
    }

    static create(contextMenu: any): ConvertService {
        return new ConvertService(contextMenu)
    }

    getContext(): any {
        return {
            title: CONVERT_CONTEXT_TITLE,
            contexts: CONTEXT_TYPES,
            onclick: this.translate.bind(this)
        };
    }

    translate(info: any, tab: any) {
        let jpText = this.getHiraganaAtKr(info.selectionText);
        if (info.editable) {
            chrome.tabs.executeScript({
                // language=JavaScript
                code:
                    `var selection = window.getSelection();
console.log(selection);
if (selection.anchorNode.childNodes.length > 0) {
    for (var i = 0; i < selection.anchorNode.childNodes.length; i++) {
        var node = selection.anchorNode.childNodes[i];
        if (node.value &&
            (
                node.type === 'text' ||
                node.type === 'textarea' ||
                node.type === 'search' ||
                node.type === 'email'
            )) {
            if (node.value) {
                node.value = "${jpText}";
            }
            if (node.nodeValue) {
                node.nodeValue = "${jpText}";
            }
            if (node.nodeValue) {
                node.textContent = "${jpText}";
            }
        }
    }
} else {
    selection.anchorNode.nodeValue = "${jpText}";
    selection.anchorNode.textContent = "${jpText}";
}
`
            });
        }
    }
}

// init
const speechService: SpeechService = SpeechService.create(chrome.contextMenus, chrome.tts);
const convertService: ConvertService = ConvertService.create(chrome.contextMenus);
speechService.onCreate();
convertService.onCreate();