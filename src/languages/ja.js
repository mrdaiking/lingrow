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
    learningTips: "学ぶべき文法とフレーズ：",
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
    あなたの書き直した文章: "{userSentence}"
    
    以下の正確な構造でJSONとしてレスポンスをフォーマットしてください：
    {
      "feedback": {
        "professionalism": "プロフェッショナリズムの分析をここに日本語で記入",
        "clarity": "明確さの分析をここに日本語で記入",
        "tone": "トーンの分析をここに日本語で記入",
        "grammar": "文法と語彙の分析をここに日本語で記入"
      },
      "suggestedVersion": "提案バージョンをここに英語で記入 - 日本語に翻訳しないでください",
      "learningTips": "提案バージョンから学ぶべき1-2つの文法ルールや便利なフレーズを日本語で提供",
      "score": 改善度を1から10で評価する数字
    }
    
    フィードバックはすべて日本語で記入してください。ただし、suggestedVersionは英語のままにしてください。
    
    回答は日本語でお願いします（suggestedVersionを除く）。
  `
};