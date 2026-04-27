const axios = require("axios")

const GROQ_API_KEY = process.env.CODEAI

const systemInstruction = `You are a senior code reviewer and programming mentor.

RESPONSE FORMAT (strict text format):
You MUST format your response exactly like this, using these exact labels:

TITLE: <write a 3-5 word title here, or write NULL if there is chat history>
MESSAGE:
<write your full markdown response here. Real newlines are allowed.>

MESSAGE RULES:
IF USER SUBMITS CODE:
- Start with: Your code score is X/100
- Then: Reviewer confidence score is X/100  
- 📋 Summary: 1-2 line explanation of what code does
- ⚠️ Issues Found: List each bug/issue with WHY it is a problem
- ✅ Improved Code: Full corrected version with proper indentation
- 🔄 What Changed: Bullet points explaining each fix in simple words
- 💡 Pro Tips: 1-3 best practices

IF USER ASKS A PROGRAMMING QUESTION (syntax, concept, error, how-to):
- Give a clear direct answer first
- Show a working code example
- Break down syntax step by step if needed
- Use simple analogies to explain complex concepts
- If about an error: explain cause and fix

IF FOLLOW-UP QUESTION: Use chat history as context, don't repeat.

IF NOT CODE-RELATED: Reply "I'm a code reviewer. Please share code or ask a programming question!"

STYLE: Be friendly, use simple language, explain technical terms, use emoji headers, indent code properly.`

async function generateContent(prompt, chatHistory = []) {
    try {
        const isNewChat = chatHistory.length === 0

        const messages = [
            {
                role: "system",
                content: systemInstruction
            }
        ]

        // Add context hint
        if (chatHistory.length > 0) {
            messages.push({
                role: "system",
                content: `Previous conversation context (${chatHistory.length} messages):`
            })
            messages.push(...chatHistory)
        }

        messages.push({
            role: "user",
            content: prompt
        })

        const response = await axios.post(
            "https://api.groq.com/openai/v1/chat/completions",
            {
                model: "llama-3.1-8b-instant",
                messages,
                temperature: 0.4,
                max_tokens: 2048
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${GROQ_API_KEY}`
                }
            }
        )

        const rawText = response.data.choices[0].message.content
        console.log("AI Raw Response:", rawText)

        let title = null
        let message = rawText

        // Parse TITLE: and MESSAGE: format
        const titleMatch = rawText.match(/TITLE:\s*(.*)/i)
        const messageMatch = rawText.match(/MESSAGE:\s*([\s\S]*)/i)

        if (titleMatch) {
            const parsedTitle = titleMatch[1].trim()
            if (parsedTitle && parsedTitle.toUpperCase() !== 'NULL') {
                title = parsedTitle
            }
        }

        if (messageMatch) {
            message = messageMatch[1].trim()
        } else if (titleMatch) {
            // If it had a title but no "MESSAGE:" tag, just remove the title line
            message = rawText.replace(/TITLE:\s*(.*)/i, '').trim()
        }

        return {
            title: isNewChat ? (title || prompt.substring(0, 30) + "...") : null,
            message
        }

    } catch (error) {
        console.error("Groq Error:", error.response?.data || error.message)
        return {
            title: null,
            message: "Something went wrong. Please try again."
        }
    }
}

module.exports = generateContent