import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { subject } = await request.json()

    if (!subject) {
      return NextResponse.json(
        { error: 'Subject material is required' },
        { status: 400 }
      )
    }

    const systemPrompt = `You are an educational content expert creating multiple-choice questions from academic material.

Requirements:
- Generate relevant MCQ questions based on the provided subject material
- Each question should have 4 options with only one correct answer
- Questions should test different levels of understanding (recall, comprehension, application)
- Ensure questions are clear and unambiguous
- Cover key concepts from the material

Return response in JSON format:
{
  "questions": [
    {
      "id": 1,
      "question": "Question text",
      "options": [
        {"id": "a", "text": "Option A"},
        {"id": "b", "text": "Option B"},
        {"id": "c", "text": "Option C"},
        {"id": "d", "text": "Option D"}
      ],
      "correctAnswer": "a"
    }
  ],
  "timeLimit": 1800
}

Generate 15-20 questions per exam. Questions and answer options should be randomized for anti-cheating.`

    const response = await fetch('https://oi-server.onrender.com/chat/completions', {
      method: 'POST',
      headers: {
        'customerId': 'cus_SGPn4uhjPI0F4w',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer xxx'
      },
      body: JSON.stringify({
        model: 'openrouter/anthropic/claude-sonnet-4',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: `Generate MCQ questions from this subject material:\n\n${subject}`
          }
        ],
        temperature: 0.5,
        max_tokens: 3000
      })
    })

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`)
    }

    const data = await response.json()
    const aiResponse = data.choices?.[0]?.message?.content

    if (!aiResponse) {
      throw new Error('No response from AI')
    }

    // Parse the JSON response from the AI
    let examData
    try {
      examData = JSON.parse(aiResponse)
    } catch (parseError) {
      // Fallback exam if parsing fails
      examData = {
        questions: [
          {
            id: 1,
            question: "What is the main topic covered in the provided material?",
            options: [
              { id: "a", text: "Basic concepts and fundamentals" },
              { id: "b", text: "Advanced theoretical frameworks" },
              { id: "c", text: "Practical applications and examples" },
              { id: "d", text: "Historical background and context" }
            ],
            correctAnswer: "a"
          },
          {
            id: 2,
            question: "Which of the following best describes the key principles discussed?",
            options: [
              { id: "a", text: "Theoretical models only" },
              { id: "b", text: "Practical implementation strategies" },
              { id: "c", text: "Historical evolution of concepts" },
              { id: "d", text: "Comparative analysis methods" }
            ],
            correctAnswer: "b"
          }
        ],
        timeLimit: 1800
      }
    }

    // Randomize questions and options for anti-cheating
    const shuffleArray = (array: any[]) => {
      const shuffled = [...array]
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
      }
      return shuffled
    }

    let questions = examData.questions || []
    
    // Ensure we have valid questions structure
    questions = questions.map((q: any, index: number) => {
      const shuffledOptions = shuffleArray(q.options || [
        { id: "a", text: "Option A" },
        { id: "b", text: "Option B" },
        { id: "c", text: "Option C" },
        { id: "d", text: "Option D" }
      ])
      
      return {
        id: index + 1,
        question: q.question || `Question ${index + 1}`,
        options: shuffledOptions.map((option: any, optIndex: number) => ({
          id: String.fromCharCode(97 + optIndex), // a, b, c, d
          text: option.text || `Option ${String.fromCharCode(65 + optIndex)}`
        })),
        correctAnswer: shuffledOptions.find((opt: any) => opt.id === q.correctAnswer)?.id || 'a',
        userAnswer: undefined,
        reported: false
      }
    }).slice(0, 20) // Limit to 20 questions

    // Randomize question order
    const shuffledQuestions = shuffleArray(questions)

    return NextResponse.json({
      questions: shuffledQuestions,
      timeLimit: examData.timeLimit || 1800 // 30 minutes default
    })

  } catch (error) {
    console.error('Error generating exam:', error)
    return NextResponse.json(
      { error: 'Failed to generate exam' },
      { status: 500 }
    )
  }
}