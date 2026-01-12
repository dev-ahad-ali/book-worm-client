import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface Review {
  _id: string
  bookId: string
  userId: string
  userName: string
  rating: number
  reviewText: string
  status: "pending" | "approved"
  createdDate: string
}

interface ReviewsState {
  reviews: Review[]
}

const initialState: ReviewsState = {
  reviews: [],
}

const reviewsSlice = createSlice({
  name: "reviews",
  initialState,
  reducers: {
    setReviews: (state, action: PayloadAction<Review[]>) => {
      state.reviews = action.payload
    },
    addReview: (state, action: PayloadAction<Review>) => {
      state.reviews.push(action.payload)
    },
    updateReviewStatus: (state, action: PayloadAction<{ reviewId: string; status: "pending" | "approved" }>) => {
      const review = state.reviews.find((r) => r._id === action.payload.reviewId)
      if (review) {
        review.status = action.payload.status
      }
    },
    deleteReview: (state, action: PayloadAction<string>) => {
      state.reviews = state.reviews.filter((r) => r._id !== action.payload)
    },
  },
})

export const { setReviews, addReview, updateReviewStatus, deleteReview } = reviewsSlice.actions
export default reviewsSlice.reducer
