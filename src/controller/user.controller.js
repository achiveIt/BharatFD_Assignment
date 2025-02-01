import { Faq } from '../model/faq.model.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/apiResponse.js';

const getAllFAQs = asyncHandler(async (req, res) => {
    try {
        const faqs = await Faq.find().select('-_id'); 

        return res
                .status(200)
                .json(
                    new ApiResponse(200, { faqs }, "FAQs fetched successfully")
                );
    } catch (error) {
        return res
                .status(500)
                .json(
                    new ApiResponse(500, {}, "Error fetching FAQs", error.message)
                );
    }
});

export default getAllFAQs;
