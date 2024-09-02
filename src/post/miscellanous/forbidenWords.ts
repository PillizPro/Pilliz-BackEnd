// src/utils/forbiddenWords.ts
import { readFileSync } from 'fs'
import { join } from 'path'

function loadForbiddenWords(): string[] {
  const filePath = join('src/post/miscellanous', 'forbidenWords.json')
  const data = readFileSync(filePath, 'utf-8')
  const json = JSON.parse(data)
  return json.forbiddenWords
}

export function containsForbiddenWord(input: string): boolean {
  const forbiddenWords = loadForbiddenWords()
  const regex = new RegExp(forbiddenWords.join('|'), 'i')
  return regex.test(input)
}
