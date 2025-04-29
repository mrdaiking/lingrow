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
    Phiên bản viết lại của người dùng: "{userSentence}"
    
    Cung cấp phản hồi về câu của người dùng liên quan đến:
    1. Tính chuyên nghiệp
    2. Sự rõ ràng
    3. Giọng điệu
    4. Ngữ pháp và từ vựng
    
    Sau đó, đề xuất một phiên bản cải thiện của câu gốc.
    
    Định dạng phản hồi của bạn dưới dạng JSON với các trường sau:
    {
      "feedback": "Phản hồi chi tiết của bạn ở đây bằng tiếng Việt",
      "suggestedVersion": "Phiên bản đề xuất của bạn ở đây bằng tiếng Việt",
      "score": Một số từ 1 đến 10 đánh giá mức độ cải thiện tổng thể
    }
    
    PHẢN HỒI CỦA BẠN PHẢI BẰNG TIẾNG VIỆT.
  `
};