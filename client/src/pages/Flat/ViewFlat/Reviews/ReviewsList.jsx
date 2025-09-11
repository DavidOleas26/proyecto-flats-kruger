import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { LocalStorageService } from "../../../../services/localStorage/localStorage";
import axios from "axios";
import { ReviewCard } from "./ReviewCard";
import Swal from "sweetalert2";
import { ProgressSpinner } from "primereact/progressspinner";


// eslint-disable-next-line react/prop-types
export const ReviewsList = ({ newReviewSearch }) => {

  const [reviews, setReviews] = useState([])
  const [loadingListReview, setLoadingListReview] = useState(false);

  const { flatId } = useParams();
  const localStorageService = new LocalStorageService();
  const token = localStorageService.getUserToken()

  
  const getFlatReviews = async() => {
    setLoadingListReview(true)
      try {
          const response = await axios.get(`http://localhost:8080/flats/${flatId}/comments`,{
              headers: {
                  Authorization: `Bearer ${token}`,
              },
          })
          setReviews(response.data)
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
          setLoadingListReview(false); 
      }
  }

  useEffect(()=>{
      getFlatReviews()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[newReviewSearch]);

  return(
    <>
      <div className="w-11/12 mx-auto mt-4 ">
        <h3 className="text-lg font-semibold text-gray-800">User Reviews</h3>
        <div className="relative flex flex-col gap-4 my-4">
          {loadingListReview && (
          <div className="absolute z-50 self-center flex justify-center items-center mt-4">
              <ProgressSpinner />
          </div>
          )}
          {reviews.length === 0 ? (
            <p className="text-sm text-gray-500">No reviews yet.</p>
          ) : (
            reviews.map((review) => (
              <ReviewCard key={review._id} review={review} />
            ))
          )}
        </div>
      </div>
    </>
  );
}