"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import Image from "next/image"

type PetImageType = 'idle' | 'hello' | 'stats' | 'fast' | 'congrats' | 'corner' | 'help';

interface PetImageProps {
  type: PetImageType;
  className?: string;
  onClick?: () => void;
}

const exampleProblems = [
  {
    question: "If a car travels 80 miles in 2 hours, what is its average speed?",
    solution: "To find the average speed, divide the distance by time: 80 miles ÷ 2 hours = 40 mph"
  },
  {
    question: "A rectangle has a length that is 2 times its width. If the perimeter is 48 inches, what is the width?",
    solution: "1. Let w = width, then length = 2w\n2. Perimeter = 2(length + width)\n3. 48 = 2(2w + w)\n4. 48 = 6w\n5. w = 8 inches"
  },
  {
    question: "If 2x + 5 = 15, what is the value of x?",
    solution: "1. Subtract 5 from both sides: 2x = 10\n2. Divide both sides by 2: x = 5"
  },
  {
    question: "A shirt costs $40. If it's discounted by 25%, what is the new price?",
    solution: "1. Calculate 25% of $40: $40 × 0.25 = $10\n2. Subtract the discount: $40 - $10 = $30"
  },
  {
    question: "If 3/4 of a number is 24, what is the number?",
    solution: "1. Let x be the number\n2. 3/4 × x = 24\n3. x = 24 ÷ (3/4)\n4. x = 24 × (4/3) = 32"
  },
  {
    question: "A recipe calls for 1/2 cup of flour. If you want to make 1.5 times the recipe, how much flour do you need?",
    solution: "1. Multiply the amount by 1.5\n2. 1/2 × 1.5 = 3/4 cup"
  }
]

const questions = [
  {
    question: "If a train travels 120 miles in 2 hours, what is its average speed?",
    options: ["30 mph", "60 mph", "90 mph", "120 mph"],
    correctAnswer: "60 mph"
  },
  {
    question: "A rectangle has a length that is 3 times its width. If the perimeter is 64 inches, what is the width?",
    options: ["8 inches", "10 inches", "12 inches", "16 inches"],
    correctAnswer: "8 inches"
  },
  {
    question: "If 3x + 7 = 22, what is the value of x?",
    options: ["3", "5", "7", "15"],
    correctAnswer: "5"
  },
  {
    question: "A book costs $24. If it's discounted by 25%, what is the new price?",
    options: ["$6", "$18", "$21", "$22"],
    correctAnswer: "$18"
  },
  {
    question: "If 2/5 of a number is 18, what is the number?",
    options: ["36", "40", "45", "50"],
    correctAnswer: "45"
  },
  {
    question: "A recipe calls for 3/4 cup of sugar. If you want to make 1.5 times the recipe, how much sugar do you need?",
    options: ["1 cup", "1 1/8 cups", "1 1/4 cups", "1 1/2 cups"],
    correctAnswer: "1 1/8 cups"
  }
]

  const PetImage: React.FC<PetImageProps> = ({ type, className = "", onClick = () => {} }) => {
    const imageMap: Record<PetImageType, string> = {
      idle: "/images/idle.PNG",
      hello: "/images/hello.PNG",
      stats: "/images/stats.PNG",
      fast: "/images/fast.PNG",
      congrats: "/images/congrats.PNG",
      corner: "/images/corner.PNG",
      help: "/images/help.PNG"
    };

  return (
    <div className="relative cursor-pointer" onClick={onClick}>
      <Image
        src={imageMap[type]}
        alt={`Teacher's Pet - ${type}`}
        width={150}
        height={150}
        className={`${className} ${type === 'help' ? 'w-32 h-32' : 'w-24 h-24'}`}
      />
    </div>
  )
}

export default function Component() {
  const [currentPage, setCurrentPage] = useState(0)
  const [answers, setAnswers] = useState<string[]>(Array(questions.length).fill(''))
  const [confidence, setConfidence] = useState(3)
  const [estimatedTime, setEstimatedTime] = useState(15)
  const [showPet, setShowPet] = useState(false)
  const [petMessage, setPetMessage] = useState('')
  const [petImage, setPetImage] = useState<PetImageType>('idle')
  const [showExample, setShowExample] = useState(false)
  const [questionStartTime, setQuestionStartTime] = useState(Date.now())
  const [lastInteractionTime, setLastInteractionTime] = useState(Date.now())
  const [showingHelp, setShowingHelp] = useState(false)

  useEffect(() => {
    if (currentPage > 0 && currentPage <= questions.length) {
      setQuestionStartTime(Date.now())
      setLastInteractionTime(Date.now())
      setShowingHelp(false)
      setPetImage('idle')
    }
  }, [currentPage])

  useEffect(() => {
    if (currentPage > 0) {
      const timer = setInterval(() => {
        const timeSinceLastInteraction = (Date.now() - lastInteractionTime) / 1000
        if (timeSinceLastInteraction > 8 && !showExample && !showPet && !showingHelp) {
          setPetImage('help')
          setShowingHelp(true)
        }
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [currentPage, lastInteractionTime, showExample, showPet, showingHelp])

  const handleNext = () => {
    setCurrentPage(prev => prev + 1)
    setLastInteractionTime(Date.now())
    setPetImage('idle')
    setShowingHelp(false)
  }

  const handlePrevious = () => {
    setCurrentPage(prev => prev - 1)
    setLastInteractionTime(Date.now())
    setPetImage('idle')
    setShowingHelp(false)
  }

  const handleAnswer = (answer: string) => {
    const timeSpent = (Date.now() - questionStartTime) / 1000
    if (timeSpent < 2) {
      setShowPet(true)
      setPetMessage("Are you sure you read the question properly? Take your time!")
      setPetImage('fast')
      return
    }

    // Update the answers state directly
    setAnswers(prevAnswers => {
      const newAnswers = [...prevAnswers]
      if (newAnswers[currentPage - 1] !== '' && newAnswers[currentPage-1] !== answer) {
        setShowPet(true)
        setPetMessage("Statistics show that changing your answer has a high likelihood of causing the wrong answer to be selected. Are you sure?")
        setPetImage('stats')
      }
      newAnswers[currentPage - 1] = answer
      setAnswers(newAnswers)
      return newAnswers
    })
    setLastInteractionTime(Date.now())
    setShowingHelp(false)
  }

  const handlePetClick = () => {
    if (showingHelp) {
      setShowExample(true)
      setPetImage('idle')
      setShowingHelp(false)
    }
  }

  const closePetMessage = () => {
    setShowPet(false)
    setPetImage('idle')
    setLastInteractionTime(Date.now())
  }

  const closeExample = () => {
    setShowExample(false)
    setLastInteractionTime(Date.now())
  }

  if (currentPage === 0) {
    return (
      <Card className="w-full max-w-3xl mx-auto mt-8">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-6">
            <PetImage type="hello" className="w-32 h-32" />
          </div>
          <CardTitle className="text-2xl">Welcome to the Pre-Algebra Quiz!</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-center">Our teacher's pet will help you stay on task and achieve your learning goals.</p>
          <div className="mb-4">
            <Label>How confident do you feel about this assignment?</Label>
            <Slider
              value={[confidence]}
              onValueChange={(value) => setConfidence(value[0])}
              max={5}
              step={1}
              className="mt-2"
            />
            <div className="flex justify-between mt-1">
              <span>Not at all</span>
              <span>Very confident</span>
            </div>
          </div>
          <div>
            <Label>How long do you think it will take you to complete? (in minutes)</Label>
            <Slider
              value={[estimatedTime]}
              onValueChange={(value) => setEstimatedTime(value[0])}
              min={5}
              max={30}
              step={1}
              className="mt-2"
            />
            <div className="text-center mt-1">{estimatedTime} minutes</div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleNext} className="w-full">Start Quiz</Button>
        </CardFooter>
      </Card>
    )
  }

  if (currentPage > questions.length) {
    return (
      <Card className="w-full max-w-3xl mx-auto mt-8">
        <CardHeader>
          <CardTitle className="text-center">Quiz Completed!</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <div className="flex items-center justify-center mb-6">
            <PetImage type="congrats" className="w-32 h-32" />
          </div>
          <p className="text-xl font-bold mb-4">Yay you're done!!</p>
          <p>Thank you for completing the quiz. Your answers have been recorded.</p>
        </CardContent>
      </Card>
    )
  }

  const currentQuestion = questions[currentPage - 1]

  return (
    <div className="relative">
      <div className="fixed top-4 right-4 z-50">
        <PetImage 
          type={petImage} 
          className="w-24 h-24" 
          onClick={handlePetClick}
        />
      </div>
      <Card className="w-full max-w-3xl mx-auto mt-8">
        <CardHeader>
          <CardTitle>Question {currentPage} of {questions.length}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">{currentQuestion.question}</p>
          <RadioGroup value={answers[currentPage - 1]} onValueChange={handleAnswer}>
            {currentQuestion.options.map((option, index) => (
              <div key={index} className="mb-2">
                <RadioGroupItem
                  value={option}
                  id={`option-${index}`}
                  className="peer sr-only"
                />
                <Label
                  htmlFor={`option-${index}`}
                  className={`flex items-center w-full p-4 text-sm font-medium border rounded-lg cursor-pointer transition-all
                    ${answers[currentPage - 1] === option ? 'bg-primary text-primary-foreground border-2 border-primary shadow-md' : 'bg-white hover:bg-gray-100 '}`}
                >
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button onClick={handlePrevious} disabled={currentPage === 1}>Previous</Button>
          <Button onClick={handleNext}>{currentPage === questions.length ? 'Finish' : 'Next'}</Button>
        </CardFooter>
      </Card>
      {showPet && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-96">
            <CardHeader>
              <CardTitle className="flex items-center justify-center">
                <PetImage type={petImage} className="w-24 h-24" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center">{petMessage}</p>
            </CardContent>
            <CardFooter>
              <Button onClick={closePetMessage} className="w-full">Got it!</Button>
            </CardFooter>
          </Card>
        </div>
      )}
      {showExample && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-[32rem]">
            <CardHeader>
              <CardTitle className="flex items-center justify-center gap-4">
                <PetImage type="corner" className="w-24 h-24" />
                Capy's Corner
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="font-medium">Let's look at a similar example:</p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-medium mb-2">Question:</p>
                <p className="mb-4">{exampleProblems[currentPage - 1].question}</p>
                <p className="font-medium mb-2">Solution:</p>
                <p className="whitespace-pre-line">{exampleProblems[currentPage - 1].solution}</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={closeExample} className="w-full">Got it!</Button>
            
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  )
}