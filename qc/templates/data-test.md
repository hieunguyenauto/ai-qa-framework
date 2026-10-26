| No. | Item | Test content | Test Data | Remarks |
|---|---|---|---|---|
| D01 | Blank | Required field left blank | (empty) | |
| D02 | White space | Leading / trailing spaces must be trimmed | "  abc  " | |
| D03 | Hiragana | | ひらがな | |
| D04 | Katakana full-width | | カタカナ | |
| D05 | Katakana half-width | | ｶﾀｶﾅ | |
| D06 | Kanji | | 漢字 | |
| D07 | Romaji full-width | | Ｍａｎｇａ | |
| D08 | Full-width digits | | ０１２３ | |
| D09 | JP signs | | ，．。「」（）【】・ | |
| D10 | Emoji / circled numbers | | 🙇‍♀️ ① ② | |
| D11 | SQL injection | Must not return DB data | SELECT * FROM Users WHERE UserId=105 OR 1=1; | |
| D12 | Max length | max / max+1 | 255 / 256 characters | 1 line break = 1 character |
| D13 | Date | Leap year / non-leap year / wrong format | 2020/02/29 · 2022/02/29 · 2022-20-20 | |
| D14 | int32 | min / max | -2147483648 / 2147483647 | |
