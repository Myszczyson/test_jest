const { writeFile, rm } = require('fs/promises')
const { makeQuestionRepository } = require('./question')

describe('question repository', () => {
  const TEST_QUESTIONS_FILE_PATH = 'test-questions.json'
  let questionRepo

  beforeAll(async () => {
    const testQuestions = [
      {
        id: '1',
        author: 'Jack London',
        summary: 'What is my name?',
        answers: []
      },
      {
        id: '2',
        author: 'Tim Doods',
        summary: 'Who are you?',
        answers: [
          {
            id: '1',
            author: 'Tim Doods',
            summary: 'Tim Doods'
          },

          {
            id: '2',
            author: 'David Monk',
            summary: 'David Monk'
          }
        ]
      }
    ]
    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions))
    questionRepo = makeQuestionRepository(TEST_QUESTIONS_FILE_PATH)
  })

  afterAll(async () => {
    await rm(TEST_QUESTIONS_FILE_PATH)
  })

  test('should return a list of 2 questions', async () => {
    expect(await questionRepo.getQuestions()).toHaveLength(2)
  })

  test('should return a question by id', async () => {
    expect(await questionRepo.getQuestionById('1')).toEqual({
      id: '1',
      author: 'Jack London',
      summary: 'What is my name?',
      answers: []
    })
  })

  test('should add question', async () => {
    const res = await questionRepo.addQuestion({
      author: 'David Monk',
      summary: 'Were am I?'
    })
    expect(res.id).toBeTruthy()
    expect(res.author).toBe('David Monk')
    expect(res.summary).toBe('Were am I?')
    expect(res.answers).toBeTruthy()
  })

  test('should return a list of 2 answers', async () => {
    expect(await questionRepo.getAnswers('2')).toHaveLength(2)
  })

  test('should return an answer by id', async () => {
    const res = await questionRepo.getAnswer('2', '1')
    expect(res.id).toBeTruthy()
    expect(res.author).toBe('Tim Doods')
    expect(res.summary).toBe('Tim Doods')
  })

  test('should add answer to question', async () => {
    const res = await questionRepo.addAnswer('1', {
      author: 'David Monk',
      summary: 'Were am I?'
    })
    expect(res.id).toBeTruthy()
    expect(res.author).toBe('David Monk')
    expect(res.summary).toBe('Were am I?')
    expect(await questionRepo.getAnswers('1')).toHaveLength(1)
  })
})
