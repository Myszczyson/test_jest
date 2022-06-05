const express = require('express')
const { urlencoded, json } = require('body-parser')
const makeRepositories = require('./middleware/repositories')

const STORAGE_FILE_PATH = 'questions.json'
const PORT = 3000

const app = express()

app.use(urlencoded({ extended: true }))
app.use(json())
app.use(makeRepositories(STORAGE_FILE_PATH))

app.get('/', (_, res) => {
  res.json({ message: 'Welcome to responder!' })
})

app.get('/questions', async (req, res) => {
  try {
    const questions = await req.repositories.questionRepo.getQuestions()
    res.json(questions)
  } catch (e) {
    res.status(500).send({ error: 'Something went wrong try again later!' })
  }
})

app.get('/questions/:questionId', async (req, res) => {
  try {
    const question = await req.repositories.questionRepo.getQuestionById(
      req.params.questionId
    )
    if (question) {
      res.json(question)
    } else {
      res.status(404).send('There is not such a question!')
    }
  } catch (e) {
    res.status(500).send('Something went wrong try again later!')
  }
})

app.post('/questions', async (req, res) => {
  try {
    const question = await req.repositories.questionRepo.addQuestion(req.body)
    if (question) {
      res.json(question)
    } else {
      res.status(404).send('Invalid author or summary')
    }
  } catch (e) {
    res.status(500).send('Something went wrong try again later!')
  }
})

app.get('/questions/:questionId/answers', async (req, res) => {
  const answers = await req.repositories.questionRepo.getAnswers(
    req.params.questionId
  )
  res.json(answers)
})

app.get('/questions/:questionId/answers/:answerId', async (req, res) => {
  try {
    const answer = await req.repositories.questionRepo.getAnswer(
      req.params.questionId,
      req.params.answerId
    )
    if (answer) {
      res.json(answer)
    } else {
      res.status(404).send('There is not such an answer or question!')
    }
  } catch (e) {
    res.status(500).send('Something went wrong try again later!')
  }
})

app.post('/questions/:questionId/answers', async (req, res) => {
  try {
    const answer = await req.repositories.questionRepo.addAnswer(
      req.params.questionId,
      req.body
    )
    if (answer) {
      res.json(answer)
    } else {
      res.status(404).send('Invalid author or summary')
    }
  } catch (e) {
    res.status(500).send('Something went wrong try again later!')
  }
})

app.listen(PORT, () => {
  console.log(`Responder app listening on port ${PORT}`)
})
