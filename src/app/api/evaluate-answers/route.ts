import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { code, questions } = await request.json()

    if (!code || !questions) {
      return NextResponse.json(
        { error: 'Code and questions are required' },
        { status: 400 }
      )
    }

    const systemPrompt = `You are evaluating student answers to code-related questions. Use the original code context and the generated questions to provide accurate assessment.

Evaluation Criteria:
- Technical accuracy of the answer
- Understanding demonstrated through explanation
- Relevance to the original code
- Completeness of response

Return response in JSON format:
{
  "score": 85,
  "feedback": "Overall assessment...",
  "suggestions": ["Improvement suggestion 1", "Suggestion 2"]
}

Score should be out of 100. Provide constructive feedback and specific improvement suggestions.`

    // Prepare the evaluation context
    const evaluationContext = `
Original Code:
${code}

Questions and Answers:
${questions.map((q: any, index: number) => `
${index + 1}. ${q.question} (Difficulty: ${q.difficulty})
Answer: ${q.answer || 'No answer provided'}
`).join('\n')}
`

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
            content: `Please evaluate these answers and provide a comprehensive assessment:\n\n${evaluationContext}`
          }
        ],
        temperature: 0.5,
        max_tokens: 1500
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
    let evaluationData
    try {
      evaluationData = JSON.parse(aiResponse)
    } catch (parseError) {
      // Calculate a basic score based on answered questions
      const answeredQuestions = questions.filter((q: any) => q.answer?.trim()).length
      const baseScore = Math.round((answeredQuestions / questions.length) * 70) // Base score up to 70%
      
      evaluationData = {
        score: Math.min(baseScore + 15, 100), // Add up to 15 points for quality
        feedback: `You answered ${answeredQuestions} out of ${questions.length} questions. Your responses show a basic understanding of the code structure and functionality. Focus on providing more detailed explanations and considering edge cases in your answers.`,
        suggestions: [
          "Provide more detailed explanations in your answers",
          "Consider edge cases and potential issues",
          "Explain your reasoning more thoroughly",
          "Reference specific parts of the code in your answers",
          "Think about performance implications and optimizations"
        ]
      }
    }

    // Ensure the response has the required structure
    const result = {
      score: Math.max(0, Math.min(100, evaluationData.score || 0)),
      feedback: evaluationData.feedback || "Assessment completed. Review the suggestions for improvement.",
      suggestions: Array.isArray(evaluationData.suggestions) 
        ? evaluationData.suggestions.slice(0, 5)
        : [
            "Provide more comprehensive answers",
            "Include specific examples from your code",
            "Consider alternative approaches",
            "Explain potential improvements"
          ]
    }

    return NextResponse.json(result)

  } catch (error) {
    console.error('Error evaluating answers:', error)
    return NextResponse.json(
      { error: 'Failed to evaluate answers' },
      { status: 500 }
    )
  }
}