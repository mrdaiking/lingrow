export default {
  practice: {
    title: "文章を改善する",
    subtitle: "以下の文章をより専門的または自然な口調で書き直してください",
    originalSentence: "元の文章：",
    yourImprovedVersion: "あなたの改善版：",
    placeholder: "ここに文章を書き直してください...",
    getFeedback: "フィードバックを得る",
    analyzing: "分析中...",
    cancel: "キャンセル",
    tryAnother: "別の文章を試す",
    yourVersion: "あなたの改善版：",
    score: "スコア：",
    feedback: "フィードバック：",
    suggestedVersion: "提案された改善版：",
    howHelpful: "このフィードバックは役に立ちましたか？",
    errorMessage: "フィードバックを取得できませんでした。もう一度お試しください。"
  },
  feedback: {
    professionalism: "プロフェッショナリズム",
    clarity: "明確さ",
    tone: "トーン",
    grammar: "文法と語彙",
    noFeedback: "フィードバックはありません"
  },
  promptInstructions: `
    あなたはビジネス英語の専門家です。以下の文章を評価してください：
    
    元の文章: "{originalSentence}"
    ユーザーの書き直した文章: "{userSentence}"
    
    ユーザーの文章について以下の点についてフィードバックを提供してください：
    1. プロフェッショナリズム
    2. 明確さ
    3. トーン
    4. 文法と語彙
    
    そして、元の文章の改善案を提案してください。
    
    以下のフィールドを持つJSONとして回答を形式化してください：
    {
      "feedback": "詳細なフィードバックを日本語で記入してください",
      "suggestedVersion": "あなたが提案する改善版を日本語で記入してください",
      "score": 改善度を1から10で評価する数字
    }
    
    回答は日本語でお願いします。
  `
};