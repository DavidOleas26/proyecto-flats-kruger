import { useState } from "react";
import { ReviewsForm } from "./ReviewsForm";
import { ReviewsList } from "./ReviewsList";

export const Reviews = () => {
    const [reviewTrigger, setReviewTrigger] = useState(0)

    const handleReviewTrigger = () => {
        setReviewTrigger((prev) => prev+1)
    }

    return(
        <>
            <div className="space-y-6">
                <ReviewsForm addedReview={handleReviewTrigger}/>
                <ReviewsList newReviewSearch={reviewTrigger}/>
            </div>
        </>
    );
}