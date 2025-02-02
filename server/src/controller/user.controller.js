import { Faq } from '../model/faq.model.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/apiResponse.js';
import { translate } from '@vitalets/google-translate-api';
import pLimit from 'p-limit';
import redis from 'redis';

const redisCache =  redis.createClient({
                        url: 'redis://localhost:6379',               
                    });

async function connectRedis() {
    try {
        await redisCache.connect();
        console.log('Connected to Redis');
    } catch (err) {
        console.error('Error connecting to Redis:', err);
    }
}

redisCache.on('error', (err) => {
console.error('Redis client error:', err);
});

connectRedis();

const defExpiration = 1800 

const limit = pLimit(3); 

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const translateText = async (text, lang, retries = 3, delayTime = 1000) => {
    for (let attempt = 0; attempt < retries; attempt++) {
        try {
            const res = await translate(text, { to: lang });
            return res.text;
        } catch (error) {
            if (error.message.includes("Too Many Requests")) {
                console.warn(`Rate limit hit, retrying... (${attempt + 1})`);
                await delay(delayTime * (attempt + 1)); 
            } else {
                console.error("Translation Error:", error);
                return text; 
            }
        }
    }
    return text;
};


const getFAQs = asyncHandler(async (req, res) => {
    try {
        const lang = req.query.lang || 'en';
        
        const faqsFromCache = await redisCache.get(lang);

        if (faqsFromCache) {
            return res.status(200).json(new ApiResponse(200, JSON.parse(faqsFromCache), "FAQs fetched successfully"));
        } else {

            const faqs = await Faq.find();
            let translatedFAQs = faqs;

            if (lang !== 'en') {
                translatedFAQs = await Promise.all(
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
            }

            await redisCache.setEx(lang, defExpiration, JSON.stringify(translatedFAQs));

            return res.status(200).json(new ApiResponse(200, translatedFAQs, "FAQs fetched successfully"));
        }
    } catch (error) {
        return res.status(500).json(new ApiResponse(500, {}, "Error fetching FAQs", error.message));
    }
});

export { getFAQs, redisCache };
