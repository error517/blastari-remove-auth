# Setting Up Google Gemini API for Blastari

This project uses Google's Gemini API for AI-powered content generation and website analysis. Follow these steps to set up your Gemini API key.

## Getting a Gemini API Key

1. Visit the [Google AI Studio](https://makersuite.google.com/app/apikey) or [Google Cloud Console](https://console.cloud.google.com/)
2. Sign in with your Google account
3. Create a new project or select an existing one
4. Enable the Gemini API for your project
5. Create an API key from the credentials section
6. Copy your API key

## Setting up Environment Variables

Create a `.env` file in the root of your project (if it doesn't exist already) and add your Gemini API key:

```
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

Make sure to replace `your_gemini_api_key_here` with the actual API key you obtained from Google.

## Important Notes

- **Never commit your API key to version control.** The `.env` file is included in `.gitignore` to prevent accidental commits.
- The Gemini API usage may have rate limits and pricing depending on your Google Cloud account status.
- For details on usage and limitations, refer to the [Google Gemini API documentation](https://ai.google.dev/docs).

## Troubleshooting

If you encounter issues with the API:

1. Verify your API key is correct
2. Check that you've enabled the Gemini API in your Google Cloud project
3. Check the console for error messages
4. Verify your quota and billing status on Google Cloud

## Switching Back to OpenAI

If you need to revert to OpenAI for any reason:

1. Install the OpenAI package: `npm install openai`
2. Set the OpenAI API key in your `.env` file: `VITE_OPENAI_API_KEY=your_openai_key_here`
3. Restore the OpenAI implementation in the codebase