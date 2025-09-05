import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json()

    if (!code) {
      return NextResponse.json(
        { error: 'Code is required' },
        { status: 400 }
      )
    }

    const systemPrompt = `You are an expert code reviewer and educator. Analyze the provided code and generate exactly 10 questions that test the student's understanding of their implementation.

Requirements:
- Generate questions of varying difficulty levels (Easy, Medium, Hard)
- Focus on implementation understanding, not just syntax
- Include questions about best practices, optimization, and potential issues
- Questions should be relevant to the specific code provided
- Return response in JSON format with the following structure:

{
  "questions": [
    {
      "id": 1,
      "question": "Question text here",
      "difficulty": "Easy|Medium|Hard"
    }
  ]
}

Temperature: 0.5 to ensure consistent, relevant questions while maintaining some variety.`

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
            content: `Please analyze this code and generate 10 relevant questions:\n\n${code}`
          }
        ],
        temperature: 0.5,
        max_tokens: 2000
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
    let questionsData
    try {
      questionsData = JSON.parse(aiResponse)
    } catch (parseError) {
      // If parsing fails, create a structured response
      questionsData = {
        questions: [
          {
            id: 1,
            question: "What is the main purpose of this code?",
            difficulty: "Easy"
          },
          {
            id: 2,
            question: "Identify any potential issues or improvements in the implementation.",
            difficulty: "Medium"
          },
          {
            id: 3,
            question: "How could you optimize the performance of this code?",
            difficulty: "Hard"
          },
          {
            id: 4,
            question: "What error handling mechanisms are present in this code?",
            difficulty: "Medium"
          },
          {
            id: 5,
            question: "Explain the data structures used in this implementation.",
            difficulty: "Easy"
          },
          {
            id: 6,
            question: "What design patterns, if any, are implemented here?",
            difficulty: "Hard"
          },
          {
            id: 7,
            question: "How would you test this code effectively?",
            difficulty: "Medium"
          },
          {
            id: 8,
            question: "What are the input and output expectations for this code?",
            difficulty: "Easy"
          },
          {
            id: 9,
            question: "Identify any security concerns in this implementation.",
            difficulty: "Hard"
          },
          {
            id: 10,
            question: "How does this code handle edge cases?",
            difficulty: "Medium"
          }
        ]
      }
    }

    // Ensure we have exactly 10 questions with proper structure
    const questions = questionsData.questions?.slice(0, 10).map((q: any, index: number) => ({
      id: index + 1,
      question: q.question || `Question ${index + 1}`,
      difficulty: ['Easy', 'Medium', 'Hard'].includes(q.difficulty) ? q.difficulty : 'Medium',
      answer: '' // Empty answer field for student to fill
    })) || []

    return NextResponse.json({ questions })

  } catch (error) {
    console.error('Error generating questions:', error)
    return NextResponse.json(
      { error: 'Failed to generate questions' },
      { status: 500 }
    )
  }
}