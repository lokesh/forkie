import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FoodItem {
  id: string;
  name: string;
  date: string;
  calories: number;
}

interface FoodTrackerState {
  foods: FoodItem[];
}

const initialState: FoodTrackerState = {
  foods: [],
};

export const foodTrackerSlice = createSlice({
  name: 'foodTracker',
  initialState,
  reducers: {
    addFood: (state, action: PayloadAction<FoodItem>) => {
      state.foods.push(action.payload);
      // TODO: Save to database
    },
    editFood: (state, action: PayloadAction<FoodItem>) => {
      const index = state.foods.findIndex(food => food.id === action.payload.id);
      if (index !== -1) {
        state.foods[index] = action.payload;
        // TODO: Update in database
      }
    },
    deleteFood: (state, action: PayloadAction<string>) => {
      state.foods = state.foods.filter(food => food.id !== action.payload);
      // TODO: Delete from database
    },
  },
});

export const { addFood, editFood, deleteFood } = foodTrackerSlice.actions;

export default foodTrackerSlice.reducer;