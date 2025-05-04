export default {
  practice: {
    title: "Cải Thiện Câu Của Bạn",
    subtitle: "Viết lại câu dưới đây với giọng điệu chuyên nghiệp hơn hoặc tự nhiên hơn",
    originalSentence: "Câu gốc:",
    yourImprovedVersion: "Phiên bản cải thiện của bạn:",
    placeholder: "Viết lại câu ở đây...",
    getFeedback: "Nhận phản hồi",
    analyzing: "Đang phân tích...",
    cancel: "Hủy",
    tryAnother: "Thử câu khác",
    yourVersion: "Phiên bản của bạn:",
    score: "Điểm:",
    feedback: "Phản hồi:",
    suggestedVersion: "Phiên bản đề xuất:",
    learningTips: "Mẹo:",
    howHelpful: "Phản hồi này có hữu ích không?",
    errorMessage: "Không thể nhận phản hồi. Vui lòng thử lại."
  },
  feedback: {
    professionalism: "Tính chuyên nghiệp",
    clarity: "Sự rõ ràng",
    tone: "Giọng điệu",
    grammar: "Ngữ pháp và từ vựng",
    noFeedback: "Không có phản hồi nào"
  },
  promptInstructions: `
    Bạn là một chuyên gia về tiếng Anh thương mại. Hãy đánh giá các câu sau đây:
    
    Câu gốc: "{originalSentence}"
    Phiên bản viết lại của bạn: "{userSentence}"
    
    Định dạng phản hồi của bạn dưới dạng JSON với cấu trúc chính xác sau đây:
    {
      "feedback": {
        "professionalism": "Phân tích về tính chuyên nghiệp ở đây bằng tiếng Việt",
        "clarity": "Phân tích về sự rõ ràng ở đây bằng tiếng Việt",
        "tone": "Phân tích về giọng điệu ở đây bằng tiếng Việt",
        "grammar": "Phân tích về ngữ pháp và từ vựng ở đây bằng tiếng Việt"
      },
      "suggestedVersion": "Phiên bản đề xuất ở đây bằng tiếng ANH - không dịch sang tiếng Việt",
      "learningTips": "Cung cấp 1-2 quy tắc ngữ pháp hoặc cụm từ hữu ích từ phiên bản đề xuất mà người dùng nên tập trung học (bằng tiếng Việt)",
      "score": Một số từ 1 đến 10 đánh giá mức độ cải thiện tổng thể
    }
    
    Tất cả phản hồi nên viết bằng tiếng Việt, nhưng giữ suggestedVersion bằng tiếng Anh.
    
    PHẢN HỒI CỦA BẠN PHẢI BẰNG TIẾNG VIỆT (ngoại trừ suggestedVersion).
  `
};