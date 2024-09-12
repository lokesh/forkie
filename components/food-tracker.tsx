'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { ChevronLeft, ChevronRight, Plus, X, Carrot, Apple, Egg, Wheat, Milk, Utensils } from 'lucide-react'

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const foodIcons = {
  'Vegetables': Carrot,
  'Fruits': Apple,
  'Protein': Egg,
  'Grains': Wheat,
  'Dairy': Milk
}

export function FoodTrackerComponent() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [foods, setFoods] = useState(['Vegetables', 'Fruits', 'Protein', 'Grains', 'Dairy'])
  const [trackedFoods, setTrackedFoods] = useState({})
  const [newFood, setNewFood] = useState('')

  const getWeekDates = (date) => {
    const week = []
    for (let i = 0; i < 7; i++) {
      const day = new Date(date)
      day.setDate(date.getDate() - date.getDay() + i)
      week.push(day)
    }
    return week
  }

  const weekDates = getWeekDates(currentDate)

  const toggleFood = (date, food) => {
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
    if (newFood && !foods.includes(newFood)) {
      setFoods([...foods, newFood])
      setNewFood('')
    }
  }

  const removeFood = (foodToRemove) => {
    setFoods(foods.filter(food => food !== foodToRemove))
  }

  const navigateWeek = (direction) => {
    const newDate = new Date(currentDate)
    newDate.setDate(currentDate.getDate() + direction * 7)
    setCurrentDate(newDate)
  }

  const getFoodIcon = (food) => {
    return foodIcons[food] || Utensils
  }

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
                    <div key={food} className="flex justify-between items-center">
                      <span>{food}</span>
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
                key={date}
                className={`${
                  isToday ? 'col-span-3 bg-gray-100' : 'col-span-1'
                } p-4 rounded-lg border ${isToday ? 'border-blue-500' : 'border-gray-200'}`}
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
                          key={food}
                          variant={trackedFoods[dateString]?.[food] ? "default" : "outline"}
                          className="w-full justify-start"
                          onClick={() => toggleFood(date, food)}
                        >
                          <IconComponent className="h-4 w-4 mr-2" />
                          {food}
                        </Button>
                      )
                    })}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-1">
                    {foods.map((food) => {
                      const IconComponent = getFoodIcon(food)
                      return (
                        <div
                          key={food}
                          className={`w-6 h-6 rounded-full flex items-center justify-center ${
                            trackedFoods[dateString]?.[food] ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'
                          }`}
                        >
                          <IconComponent className="h-4 w-4" />
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}