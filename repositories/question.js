const { readFile, writeFile } = require('fs/promises')
const { v4 } = require('uuid')

const makeQuestionRepository = fileName => {
  const getQuestions = async () => {
    const fileContent = await readFile(fileName, { encoding: 'utf-8' })
    const questions = JSON.parse(fileContent)

    return questions
  }

  const getQuestionById = async questionId => {
    const fileContent = await readFile(fileName, { encoding: 'utf-8' })
    const questions = JSON.parse(fileContent)
    const questionById = questions.find(q => q.id === questionId)

    return questionById
  }

  const addQuestion = async question => {
    if (question.author && question.summary) {
      const fileContent = await readFile(fileName, { encoding: 'utf-8' })
      const questions = JSON.parse(fileContent)
      const object = {
        id: v4(),
        author: question.author,
        summary: question.summary,
        answers: []
      }
      const updatedFile = [...questions, object]
      await writeFile(fileName, JSON.stringify(updatedFile))

      return object
    } else {
      return
    }
  }

  const getAnswers = async questionId => {
    const fileContent = await readFile(fileName, { encoding: 'utf-8' })
    const questions = JSON.parse(fileContent)
    const questionById = questions.find(q => q.id === questionId)

    return questionById.answers
  }

  const getAnswer = async (questionId, answerId) => {
    const fileContent = await readFile(fileName, { encoding: 'utf-8' })
    const questions = JSON.parse(fileContent)
    const questionById = questions.find(q => q.id === questionId)
    const answerById = questionById.answers.find(a => a.id === answerId)

    return answerById
  }

  const addAnswer = async (questionId, answer) => {
    if (answer.author && answer.summary) {
      const fileContent = await readFile(fileName, { encoding: 'utf-8' })
      const questions = JSON.parse(fileContent)
      const questionById = questions.find(q => q.id === questionId)
      const object = {
        id: v4(),
        author: answer.author,
        summary: answer.summary
      }
      const updatedAnswers = [...questionById.answers, object]
      const updatedFile = questions.map(q =>
        q.id !== questionId ? q : { ...q, answers: updatedAnswers }
      )
      await writeFile(fileName, JSON.stringify(updatedFile))

      return object
    } else {
      return
    }
  }

  return {
    getQuestions,
    getQuestionById,
    addQuestion,
    getAnswers,
    getAnswer,
    addAnswer
  }
}

module.exports = { makeQuestionRepository }
