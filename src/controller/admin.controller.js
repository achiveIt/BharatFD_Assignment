import { Faq } from '../model/faq.model.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/apiResponse.js';

const addFAQ = asyncHandler(async (req, res) => {
    const { question, answer } = req.body;

    if (!question || !answer) {
        return res.status(400).json(
            new ApiResponse(400, {}, "Both question and answer are required")
        );
    }

    try {
        const newFAQ = new Faq({
            question,
            answer,
        });

        await newFAQ.save();

        return res.status(201).json(
            new ApiResponse(201, { faq: newFAQ }, "FAQ added successfully")
        );

    } catch (error) {
        return res.status(500).json(
            new ApiResponse(500, {}, `Error adding FAQ ${error.message}`)
        );
    }
});

export{
    addFAQ
} 
