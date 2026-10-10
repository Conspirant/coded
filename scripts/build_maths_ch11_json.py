import json

questions = [
  {
    "id": "math_ch11_q1",
    "subject": "Mathematics",
    "chapter": "Statistics",
    "chapter_number": 11,
    "year": 2015,
    "question": "The mean deviation from the data $3, 10, 10, 4, 7, 10, 5$ is",
    "options": [
      "2",
      "2.57",
      "3",
      "3.75"
    ],
    "correct_answer": 1,
    "explanation": "Given data: $3, 10, 10, 4, 7, 10, 5$ ($n = 7$).\n$$\\bar{x} = \\frac{3 + 10 + 10 + 4 + 7 + 10 + 5}{7} = \\frac{49}{7} = 7$$\nAbsolute deviations $|x_i - \\bar{x}|$ are:\n$$|3 - 7| = 4, \\; |10 - 7| = 3, \\; |10 - 7| = 3, \\; |4 - 7| = 3, \\; |7 - 7| = 0, \\; |10 - 7| = 3, \\; |5 - 7| = 2$$\n$$\\sum |x_i - \\bar{x}| = 4 + 3 + 3 + 3 + 0 + 3 + 2 = 18$$\n$$\\text{Mean deviation from mean} = \\frac{\\sum |x_i - \\bar{x}|}{n} = \\frac{18}{7} \\approx 2.57$$",
    "needs_image": False
  },
  {
    "id": "math_ch11_q2",
    "subject": "Mathematics",
    "chapter": "Statistics",
    "chapter_number": 11,
    "year": 2019,
    "question": "Mean and standard deviation of $100$ items are $50$ and $4$ respectively. The sum of all squares of the items is",
    "options": [
      "251600",
      "266000",
      "256100",
      "261600"
    ],
    "correct_answer": 0,
    "explanation": "Given $n = 100$, mean $\\bar{x} = 50$, standard deviation $\\sigma = 4$.\n$$\\sigma^2 = \\frac{\\sum x_i^2}{n} - (\\bar{x})^2$$\n$$4^2 = \\frac{\\sum x_i^2}{100} - 50^2 \\implies 16 = \\frac{\\sum x_i^2}{100} - 2500$$\n$$\\frac{\\sum x_i^2}{100} = 2516 \\implies \\sum x_i^2 = 2516 \\times 100 = 251600$$",
    "needs_image": False
  },
  {
    "id": "math_ch11_q3",
    "subject": "Mathematics",
    "chapter": "Statistics",
    "chapter_number": 11,
    "year": 2020,
    "question": "The standard deviation of the data $6, 7, 8, 9, 10$ is",
    "options": [
      "√10",
      "2",
      "10",
      "√2"
    ],
    "correct_answer": 3,
    "explanation": "Mean $\\bar{x} = \\frac{6 + 7 + 8 + 9 + 10}{5} = \\frac{40}{5} = 8$.\n$$\\sum x_i^2 = 6^2 + 7^2 + 8^2 + 9^2 + 10^2 = 36 + 49 + 64 + 81 + 100 = 330$$\n$$\\sigma = \\sqrt{\\frac{\\sum x_i^2}{n} - (\\bar{x})^2} = \\sqrt{\\frac{330}{5} - 8^2} = \\sqrt{66 - 64} = \\sqrt{2}$$",
    "needs_image": False
  },
  {
    "id": "math_ch11_q4",
    "subject": "Mathematics",
    "chapter": "Statistics",
    "chapter_number": 11,
    "year": 2021,
    "question": "The Standard Deviation of the numbers $31, 32, 33, \\ldots, 46, 47$ is",
    "options": [
      "√(17/12)",
      "√((47² - 1)/12)",
      "2√6",
      "4√3"
    ],
    "correct_answer": 2,
    "explanation": "Standard deviation is invariant under a change of origin. Subtracting $30$ from each number yields the first $17$ natural numbers: $1, 2, 3, \\ldots, 17$ ($n = 17$).\nThe standard deviation of the first $n$ natural numbers is:\n$$\\sigma = \\sqrt{\\frac{n^2 - 1}{12}} = \\sqrt{\\frac{17^2 - 1}{12}} = \\sqrt{\\frac{288}{12}} = \\sqrt{24} = 2\\sqrt{6}$$",
    "needs_image": False
  },
  {
    "id": "math_ch11_q5",
    "subject": "Mathematics",
    "chapter": "Statistics",
    "chapter_number": 11,
    "year": 2022,
    "question": "If the standard deviation of the numbers $-1, 0, 1, k$ is $\\sqrt{5}$ where $k > 0$, then $k$ is equal to",
    "options": [
      "4√(5/3)",
      "2√(10/3)",
      "√6",
      "2√6"
    ],
    "correct_answer": 3,
    "explanation": "For the observations $-1, 0, 1, k$ ($n = 4$):\n$$\\bar{x} = \\frac{-1 + 0 + 1 + k}{4} = \\frac{k}{4}$$\n$$\\sum x_i^2 = (-1)^2 + 0^2 + 1^2 + k^2 = k^2 + 2$$\n$$\\sigma^2 = \\frac{\\sum x_i^2}{n} - (\\bar{x})^2 = \\frac{k^2 + 2}{4} - \\frac{k^2}{16} = \\frac{4k^2 + 8 - k^2}{16} = \\frac{3k^2 + 8}{16}$$\nGiven $\\sigma^2 = 5$:\n$$5 = \\frac{3k^2 + 8}{16} \\implies 80 = 3k^2 + 8 \\implies 3k^2 = 72 \\implies k^2 = 24$$\nSince $k > 0$, $k = \\sqrt{24} = 2\\sqrt{6}$.",
    "needs_image": False
  },
  {
    "id": "math_ch11_q6",
    "subject": "Mathematics",
    "chapter": "Statistics",
    "chapter_number": 11,
    "year": 2023,
    "question": "The mean of $100$ observations is $50$ and their standard deviation is $5$. Then the sum of squares of all observations is",
    "options": [
      "250000",
      "50000",
      "255000",
      "252500"
    ],
    "correct_answer": 3,
    "explanation": "Given $n = 100$, $\\bar{x} = 50$, $\\sigma = 5$.\n$$\\sigma^2 = \\frac{\\sum x_i^2}{n} - (\\bar{x})^2$$\n$$5^2 = \\frac{\\sum x_i^2}{100} - 50^2 \\implies 25 = \\frac{\\sum x_i^2}{100} - 2500$$\n$$\\frac{\\sum x_i^2}{100} = 2525 \\implies \\sum x_i^2 = 252500$$",
    "needs_image": False
  },
  {
    "id": "math_ch11_q7",
    "subject": "Mathematics",
    "chapter": "Statistics",
    "chapter_number": 11,
    "year": 2024,
    "question": "Let $a, b, c, d$ and $e$ be the observations with mean $m$ and standard deviation $S$. Then standard deviation of the observations $a+k, b+k, c+k, d+k$ and $e+k$ is",
    "options": [
      "kS",
      "S + k",
      "S/k",
      "S"
    ],
    "correct_answer": 3,
    "explanation": "Standard deviation measures the spread of values from the mean. When each observation is shifted by adding a constant $k$, the new mean becomes $m + k$, but the deviations $(x_i - \\bar{x})$ remain unchanged. Hence, the standard deviation is independent of change of origin and remains $S$.",
    "needs_image": False
  }
]

with open('src/data/pyq_maths_ch11.json', 'w', encoding='utf-8') as f:
    json.dump(questions, f, indent=2, ensure_ascii=False)

print(f"Successfully generated pyq_maths_ch11.json with {len(questions)} questions.")
