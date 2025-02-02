import { Faq } from '../model/faq.model.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/apiResponse.js';
import { translate } from '@vitalets/google-translate-api';

const translateText =  async(text, lang) =>{
    try {
        const res = await translate(
            text, 
            { 
                to : lang 
            }
        );

        return res.text;

      } catch (error) {
        console.error("Translation Error:", error);
        return text; 
      }
}
const getFAQs = asyncHandler(async (req, res) => {
    try {
        const faqs = await Faq.find().select('-_id');
        console.log(faqs);

        const lang = req.params.lang || 'en';
        let translatedFAQs = faqs;

        if (lang !== 'en') {
            translatedFAQs = await Promise.all(
                faqs.map(async (faq) => {
                    const translatedQuestion = await translateText(faq.question, lang);
                    const translatedAnswer = await translateText(faq.answer, lang);
                    
                    return {
                        question: translatedQuestion,
                        answer: translatedAnswer,
                    };
                })
            );
        }

        return res
                .status(200)
                .json(
                    new ApiResponse(200, translatedFAQs, "FAQs fetched successfully")
                );
    } catch (error) {
        return res
                .status(500)
                .json(
                new ApiResponse(500, {}, "Error fetching FAQs", error.message)
            );
    }
});



export{
    getFAQs,
} 
