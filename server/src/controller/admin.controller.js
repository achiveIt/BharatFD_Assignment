import { Faq } from '../model/faq.model.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/apiResponse.js';
import { redisCache } from './user.controller.js';

const clearCache = async () => {
    try {
        await redisCache.flushAll(); 
        console.log('Redis cache cleared');
    } catch (err) {
        console.error('Error clearing Redis cache:', err);
    }
};

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
        await clearCache();

        return res.status(201).json(
            new ApiResponse(201, { faq: newFAQ }, "FAQ added successfully")
        );

    } catch (error) {
        return res.status(500).json(
            new ApiResponse(500, {}, `Error adding FAQ ${error.message}`)
        );
    }
});

const deleteFAQ = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res
                .status(400)
                .json(
                    new ApiResponse(400, {}, "FAQ ID is required to delete")
                );
    }

    try {
        await Faq.deleteOne({
            _id : id
        })
        await clearCache();

        return res
                .status(200)
                .json(
                    new ApiResponse(200, {}, "FAQ deleted successfully")
                );

    } catch (error) {
        return res
                .status(500)
                .json(
                    new ApiResponse(500, {}, `Error deleting FAQ ${error.message}`)
                );
    }
});

const editFAQ = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { question, answer } = req.body;

    if (!id) {
        return res
                .status(400)
                .json(
                    new ApiResponse(400, {}, "FAQ id is required to edit")
                );
    }

    if (!question && !answer) {
        return res
                .status(400)
                .json(
                    new ApiResponse(400, {}, "Either question or answer are required to update")
                );
    }

    try {
        const faq = await Faq.findById(id);

        if (!faq) {
            return res
                    .status(404)
                    .json(
                        new ApiResponse(404, {}, "FAQ not found")
                    );
        }

        if (!answer) {
            faq.question = question;
        } else if (!question) {
            faq.answer = answer;
        } else {
            faq.question = question;
            faq.answer = answer;
        }
       
        await faq.save();
        await clearCache();

        return res
                .status(200)
                .json(
                    new ApiResponse(200, { faq }, "FAQ updated successfully")
                );

    } catch (error) {
        return res
                .status(500)
                .json(
                    new ApiResponse(500, {}, "Error updating FAQ", error.message)
                );
    }
});


export{
    addFAQ,
    deleteFAQ,
    editFAQ
} 
