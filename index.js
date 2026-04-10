const express = require('express');
const fetch = require('node-fetch');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());  // To parse JSON bodies

// CORS headers to allow requests from different domains
app.setHeader('Access-Control-Allow-Origin', '*');
app.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
app.setHeader('Access-Control-Allow-Headers', '*');
app.setHeader('Access-Control-Max-Age', '86400');

// POST endpoint to handle financial details
app.post('/api/financial-details', async (req, res) => {
  const { message } = req.body; // Get the user input message
  
  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + process.env.GROQ_API_KEY, // Groq API key
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',  // The model you want to use
        messages: [
          { role: 'system', content: 'You are a professional AI accountant. Help users with taxes, invoices, expenses, and bookkeeping. Be clear and professional.' },
          { role: 'user', content: message } // User input passed to Groq API
        ],
        max_tokens: 1024 // Set max token length for response
      })
    });

    const data = await response.json();  // Parse the Groq API response

    if (data && data.choices && data.choices[0]) {
      return res.status(200).json({ reply: data.choices[0].message.content }); // Return reply from Groq API
    } else {
      return res.status(200).json({ reply: 'Sorry, I could not process that. Please try again.' });
    }

  } catch (err) {
    console.error('Error in processing request:', err);
    return res.status(500).json({ reply: 'Something went wrong. Please try again later.' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
