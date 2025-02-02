import mongoose,{Schema} from "mongoose";

const faqSchema = new Schema(
    {
        question : {
            type : String
        },
        answer : {
            type : String
        }
    },
    {
        timestamps: true
    }
)

export const Faq = mongoose.model("Faq", faqSchema)