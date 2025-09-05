import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { questions } = await request.json()

    if (!questions || !Array.isArray(questions)) {
      return NextResponse.json(
        { error: 'Questions are required' },
        { status: 400 }
      )
    }

    // Calculate exam results
    const totalQuestions = questions.length
    const answeredQuestions = questions.filter((q: any) => q.userAnswer).length
    
    let correctAnswers = 0
    const questionResults = questions.map((q: any) => {
      const isCorrect = q.userAnswer === q.correctAnswer
      if (isCorrect) correctAnswers++
      
      return {
        question: q.question,
        userAnswer: q.userAnswer || 'Not answered',
        correctAnswer: q.correctAnswer,
        isCorrect: isCorrect
      }
    })

    // Calculate score out of 100
    const score = Math.round((correctAnswers / totalQuestions) * 100)
    
    // Generate feedback based on performance
    let feedback = ''
    if (score >= 90) {
      feedback = 'Excellent performance! You have demonstrated a comprehensive understanding of the material.'
    } else if (score >= 80) {
      feedback = 'Good work! You show a solid grasp of the concepts with room for minor improvements.'
    } else if (score >= 70) {
      feedback = 'Satisfactory performance. You understand the basic concepts but should review some areas for better mastery.'
    } else if (score >= 60) {
      feedback = 'Fair performance. You have a basic understanding but need to study more to improve your grasp of the material.'
    } else {
      feedback = 'Additional study is needed. Review the material thoroughly and consider seeking additional help to improve understanding.'
    }

    // Add completion rate context
    if (answeredQuestions < totalQuestions) {
      feedback += ` You answered ${answeredQuestions} out of ${totalQuestions} questions. Make sure to complete all questions in future attempts.`
    }

    const result = {
      score: score,
      totalQuestions: totalQuestions,
      correctAnswers: correctAnswers,
      feedback: feedback,
      questionResults: questionResults
    }

    return NextResponse.json(result)

  } catch (error) {
    console.error('Error evaluating exam:', error)
    return NextResponse.json(
      { error: 'Failed to evaluate exam' },
      { status: 500 }
    )
  }
}