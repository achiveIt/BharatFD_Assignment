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

export{
    addFAQ,
    deleteFAQ
} 
