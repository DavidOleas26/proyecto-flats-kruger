import { useState } from "react";
import { Button } from 'primereact/button';
import { Star } from "lucide-react";
import Swal from "sweetalert2";
import axios from "axios";
import { useParams } from "react-router-dom";
import { LocalStorageService } from "../../../../services/localStorage/localStorage";
import { ProgressSpinner } from "primereact/progressspinner";
        
// eslint-disable-next-line react/prop-types
export const ReviewsForm = ({addedReview}) => {

    const [showFormReview, setShowFormReview] = useState(false)
    const [reviewText, setReviewText] = useState("")
    const [rating, setRating] = useState(0)
    const [hoverRating, setHoverRating] = useState(0)

    const [loadingAddReview, setLoadingAddReview] = useState(false);

    let { flatId } = useParams();
    const localStorageService = new LocalStorageService();
    const token = localStorageService.getUserToken()

    const toggleForm = () => {
        setShowFormReview(prev => !prev)
        if (!showFormReview) {
            setRating(0)
            setReviewText('')
        }
    }

    const handleRating = (index) => {
        setRating(index)
    }

    const validateForm = () => {
        if (reviewText.trim() === '') return showError('Review text is required.') 
        if (rating === 0) return showError('Please provide a rating.')
        return true
    }

    const showError = (message) => {
        Swal.fire({ icon: 'error', title: 'Validation Error', text: message });
        return false;
    }

    const submit = async(event) => {
        event.preventDefault();
        if (!validateForm()) return;

        const review = {
            content: reviewText,
            rating: rating
        }
        setLoadingAddReview(true)
        try {
            const response = await axios.post(`http://localhost:8080/flats/${flatId}/comments`, review, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            // eslint-disable-next-line no-unused-vars
            const { comment } = response.data

            if ( response.status === 201 ) {
                addedReview()
                toggleForm()
            }
        } catch (error) {
            const errorMessage = error?.response?.data?.error ||  error.code ||'Something went wrong'
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: errorMessage,
                showConfirmButton: false,
                timer: 1500,
            });
        }finally {
            setLoadingAddReview(false); 
        }
    }

    return(
        <>
            <div className="flex flex-col gap-2 md:flex-row overflow-x-auto ">
                <Button label="Write a Review" className="w-fit h-fit bg-teal-600" onClick={toggleForm}></Button>
                {showFormReview && (
                    <div className="grow">
                        <form onSubmit={(event)=> submit(event)} className="relative w-11/12 mx-auto pb-4 mb-2 flex flex-col gap-2">
                            {loadingAddReview && (
                            <div className="absolute z-50 self-center flex justify-center items-center mt-4">
                                <ProgressSpinner />
                            </div>
                            )}
                            <div className="flex flex-col gap-1">
                                <span className="text-sm text-gray-700 font-semibold">Overall Rating</span>
                                <div className="flex gap-2">
                                    {
                                        [1,2,3,4,5].map((index) => (
                                            <Star
                                                key={index}
                                                size={24}
                                                onClick={() => handleRating(index)}
                                                onMouseEnter={() => setHoverRating(index)}
                                                onMouseLeave={() => setHoverRating(0)}
                                                className={`cursor-pointer transition-colors ${(hoverRating || rating) >= index ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                                            />
                                        ))
                                    }
                                </div>
                            </div>
                            <div>
                                <label htmlFor="review" className="text-sm text-gray-700 font-semibold">Your Review</label>
                                <textarea
                                    id="review"
                                    rows={4}
                                    value={reviewText}
                                    onChange={(e) => setReviewText(e.target.value)}
                                    placeholder="Share your thoughts about this apartment..."
                                    className="w-full p-2 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-teal-600 outline-none"
                                />
                            </div>
                            <button className="self-end px-4 py-2 bg-[#F26721] hover:bg-[#a93f0a] text-white text-sm font-semibold rounded-lg shadow-md transition duration-200">submit</button>
                        </form>
                    </div>
                )}
            </div>

        </>
    );
}

