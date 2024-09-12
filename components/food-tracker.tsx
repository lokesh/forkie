import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ChevronLeft, ChevronRight, Plus, X, Carrot, Apple, Egg, Wheat, Milk, Utensils } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../app/store/store';
import { addFood as addFoodAction, editFood, deleteFood } from '../app/store/foodTrackerSlice';

// Remove this unused import
// import { SetStateAction } from 'react'

// Add this interface
interface FoodItem {
  id: string;
  name: string;
  category: string;
}

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const foodIcons = {
  'Vegetables': Carrot,
  'Fruits': Apple,
  'Protein': Egg,
  'Grains': Wheat,
  'Dairy': Milk
}

export function FoodTrackerComponent() {
  const dispatch = useDispatch();
  const foods = useSelector((state: RootState) => state.foodTracker.foods);
  const [currentDate, setCurrentDate] = useState(new Date())
  const [trackedFoods, setTrackedFoods] = useState<Record<string, Record<string, boolean>>>({})
  const [newFood, setNewFood] = useState('')
  const [mealIdeas, setMealIdeas] = useState<Record<string, MealIdeas>>({})
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const getWeekDates = (date: Date): Date[] => {
    const week = []
    for (let i = 0; i < 7; i++) {
      const day = new Date(date)
      day.setDate(date.getDate() - date.getDay() + i)
      week.push(day)
    }
    return week
  }

  const weekDates = getWeekDates(currentDate)

  const toggleFood = (date: Date, food: string): void => {
    const dateString = date.toISOString().split('T')[0]
    setTrackedFoods(prev => ({
      ...prev,
      [dateString]: {
        ...prev[dateString],
        [food]: !prev[dateString]?.[food]
      }
    }))
  }

  const addFood = () => {
    if (newFood && !foods.some(food => food.name === newFood)) {
      dispatch(addFoodAction({ id: Date.now().toString(), name: newFood, category: 'Other' }));
      setNewFood('')
    }
  }

  const removeFood = (foodToRemove: FoodItem): void => {
    dispatch(deleteFood(foodToRemove.id));
  }

  const navigateWeek = (direction: number): void => {
    const newDate = new Date(currentDate)
    newDate.setDate(currentDate.getDate() + direction * 7)
    setCurrentDate(newDate)
  }

  const getFoodIcon = (food: string) => {
    return foodIcons[food as keyof typeof foodIcons] || Utensils
  }

  const addMealIdeas = (date: Date, ideas: MealIdeas): void => {
    const dateString = date.toISOString().split('T')[0]
    setMealIdeas(prev => ({
      ...prev,
      [dateString]: ideas
    }))
  }

  const handleDateClick = (event: React.MouseEvent, date: Date) => {
    if (!(event.target as HTMLElement).closest('button') && 
        !(event.target as HTMLElement).closest('.food-icon')) {
      setSelectedDate(date);
    }
  };

  const handleFoodIconClick = (event: React.MouseEvent, date: Date, food: string) => {
    event.stopPropagation();
    toggleFood(date, food);
  };

  const handleAddFood = (newFood: FoodItem) => {
    dispatch(addFood(newFood));
  };

  const handleEditFood = (editedFood: FoodItem) => {
    dispatch(editFood(editedFood));
  };

  const handleDeleteFood = (foodId: string) => {
    dispatch(deleteFood(foodId));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl w-full">
        <div className="flex justify-between items-center mb-6">
          <Button variant="outline" size="icon" onClick={() => navigateWeek(-1)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Edit Foods</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Food List</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col space-y-4">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Add new food"
                    value={newFood}
                    onChange={(e) => setNewFood(e.target.value)}
                  />
                  <Button onClick={addFood}><Plus className="h-4 w-4" /></Button>
                </div>
                <div className="space-y-2">
                  {foods.map((food) => (
                    <div key={food.id} className="flex justify-between items-center">
                      <span>{food.name}</span>
                      <Button variant="ghost" size="sm" onClick={() => removeFood(food)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Button variant="outline" size="icon" onClick={() => navigateWeek(1)}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="grid grid-cols-7 gap-4">
          {weekDates.map((date, index) => {
            const isToday = date.toDateString() === new Date().toDateString()
            const dateString = date.toISOString().split('T')[0]
            return (
              <div
                key={date.toISOString()}
                className={`${
                  isToday ? 'col-span-3 bg-gray-100' : 'col-span-1'
                } p-4 rounded-lg border ${isToday ? 'border-blue-500' : 'border-gray-200'} cursor-pointer`}
                onClick={(e) => handleDateClick(e, date)}
              >
                <div className="text-sm font-medium mb-2">
                  {daysOfWeek[index]} {date.getDate()}
                </div>
                {isToday ? (
                  <div className="space-y-2">
                    {foods.map((food) => {
                      const IconComponent = getFoodIcon(food)
                      return (
                        <Button
                          key={food.id}
                          variant={trackedFoods[dateString]?.[food.name] ? "default" : "outline"}
                          className="w-full justify-start"
                          onClick={(e) => handleFoodIconClick(e, date, food.name)}
                        >
                          <IconComponent className="h-4 w-4 mr-2" />
                          {food.name}
                        </Button>
                      )
                    })}
                  </div>
                ) : (
                  <div>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {foods.map((food) => {
                        const IconComponent = getFoodIcon(food)
                        return (
                          <div
                            key={food.id}
                            className={`food-icon w-6 h-6 rounded-full flex items-center justify-center ${
                              trackedFoods[dateString]?.[food.name] ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'
                            }`}
                            onClick={(e) => handleFoodIconClick(e, date, food.name)}
                          >
                            <IconComponent className="h-4 w-4" />
                          </div>
                        )
                      })}
                    </div>
                    {mealIdeas[dateString] && (
                      <div className="text-xs mt-2">
                        {mealIdeas[dateString].breakfast && <p>B: {mealIdeas[dateString].breakfast}</p>}
                        {mealIdeas[dateString].lunch && <p>L: {mealIdeas[dateString].lunch}</p>}
                        {mealIdeas[dateString].dinner && <p>D: {mealIdeas[dateString].dinner}</p>}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
      <MealIdeaModal
        isOpen={!!selectedDate}
        onClose={() => setSelectedDate(null)}
        onSave={(ideas) => {
          if (selectedDate) {
            addMealIdeas(selectedDate, ideas)
            setSelectedDate(null)
          }
        }}
        existingIdeas={selectedDate ? mealIdeas[selectedDate.toISOString().split('T')[0]] : null}
      />
    </div>
  )
}

interface MealIdeas {
  breakfast?: string;
  lunch?: string;
  dinner?: string;
}

interface MealIdeaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (ideas: MealIdeas) => void;
  existingIdeas: MealIdeas | null;
}

function MealIdeaModal({ isOpen, onClose, onSave, existingIdeas }: MealIdeaModalProps) {
  const [breakfast, setBreakfast] = useState(existingIdeas?.breakfast || '')
  const [lunch, setLunch] = useState(existingIdeas?.lunch || '')
  const [dinner, setDinner] = useState(existingIdeas?.dinner || '')

  const handleSave = () => {
    onSave({ breakfast, lunch, dinner })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Meal Ideas</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="breakfast">Breakfast</Label>
            <Input
              id="breakfast"
              value={breakfast}
              onChange={(e) => setBreakfast(e.target.value)}
              placeholder="Breakfast idea"
            />
          </div>
          <div>
            <Label htmlFor="lunch">Lunch</Label>
            <Input
              id="lunch"
              value={lunch}
              onChange={(e) => setLunch(e.target.value)}
              placeholder="Lunch idea"
            />
          </div>
          <div>
            <Label htmlFor="dinner">Dinner</Label>
            <Input
              id="dinner"
              value={dinner}
              onChange={(e) => setDinner(e.target.value)}
              placeholder="Dinner idea"
            />
          </div>
        </div>
        <div className="flex justify-end space-x-2 mt-4">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}