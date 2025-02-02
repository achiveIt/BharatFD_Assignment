import { Faq } from '../model/faq.model.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/apiResponse.js';
import { translate } from '@vitalets/google-translate-api';
import pLimit from 'p-limit';

// Limit concurrent translations to avoid rate limit errors
const limit = pLimit(3); // Allows only 3 concurrent API calls

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const translateText = async (text, lang, retries = 3, delayTime = 1000) => {
    for (let attempt = 0; attempt < retries; attempt++) {
        try {
            const res = await translate(text, { to: lang });
            return res.text;
        } catch (error) {
            if (error.message.includes("Too Many Requests")) {
                console.warn(`Rate limit hit, retrying... (${attempt + 1})`);
                await delay(delayTime * (attempt + 1)); // Exponential backoff
            } else {
                console.error("Translation Error:", error);
                return text; // Return original text if translation fails
            }
        }
    }
    return text;
};

const getFAQs = asyncHandler(async (req, res) => {
    try {
        const faqs = await Faq.find();
        const lang = req.query.lang || 'en';

        if (lang === 'en') {
            return res.status(200).json(new ApiResponse(200, faqs, "FAQs fetched successfully"));
        }

        const translatedFAQs = await Promise.all(
            faqs.map((faq) =>
                limit(async () => {
                    const translatedQuestion = await translateText(faq.question, lang);
                    const translatedAnswer = await translateText(faq.answer, lang);
                    return {
                        question: translatedQuestion,
                        answer: translatedAnswer,
                        _id: faq._id
                    };
                })
            )
        );

        return res.status(200).json(new ApiResponse(200, translatedFAQs, "FAQs fetched successfully"));
    } catch (error) {
        return res.status(500).json(new ApiResponse(500, {}, "Error fetching FAQs", error.message));
    }
});

export { getFAQs };
