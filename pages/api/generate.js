import { Configuration, OpenAIApi } from 'openai'

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
})
const openai = new OpenAIApi(configuration)

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message:
          'OpenAI API key not configured, please follow instructions in README.md'
      }
    })
    return
  }

  const variable = req.body.variable || ''
  const casing = req.body.case || ''
  if (variable.trim().length === 0 || casing.trim().length === 0) {
    res.status(400).json({
      error: {
        message: 'Please submit a valid form'
      }
    })
    return
  }

  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: generatePrompt(variable, casing),
      temperature: 0.6
    })
    res.status(200).json({ result: completion.data.choices[0].message.content })
  } catch (error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data)
      res.status(error.response.status).json(error.response.data)
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`)
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.'
        }
      })
    }
  }
}

function generatePrompt(variable, casing) {
  const capitalizedVariable =
    variable[0].toUpperCase() + variable.slice(1).toLowerCase()
  return [
    {
      role: 'system',
      content:
        'You are an expert senior programmer with years of experience naming variables in different programming lenguages'
    },
    {
      role: 'user',
      content: `Suggest three names for a code variable that are hilarious. Complete only the three names, comma separeted. Use ${casing} case.

                Variable: For loops
                Names: i, ii, iii, iiii, iiiii
                Varibale: Speed
                Names: direction_change_velocity_retainment_coyote_time
                Varibale: Color
                Names: gray, grayPlus, grayPlusLight, grayDoublePlusLight
                Varibale: Int
                Names: tint
                Varibale: String builder object
                Names: bobTheBuilder
                Variable: ${capitalizedVariable}
                Names:`
    }
  ]
}
