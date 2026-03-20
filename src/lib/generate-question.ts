import axios from 'axios';

export async function generateQuiz(): Promise<any> {
  try {
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content:
              'Kamu adalah pembuat soal kuis seperti Who Wants to Be a Millionaire dalam bahasa Indonesia.',
          },
          {
            role: 'user',
            content: `
Buatkan 20 soal kuis pengetahuan umum dalam bahasa Indonesia.

Rules:
- Setiap soal memiliki 4 pilihan jawaban
- Hanya ada 1 jawaban benar
- Kesulitan meningkat
- Gunakan difficulty: easy, medium, hard

Schema JSON:

[
{
question: string,
options: string[],
answer: string,
difficulty: "easy" | "medium" | "hard" | "very_hard"
}
]

Output hanya JSON valid tanpa penjelasan.
`,
          },
        ],
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
      },
    );

    const result = response.data.choices[0].message.content;

    const quiz = JSON.parse(String(result));

    // Mapping difficulty ke point rupiah
    const difficultyPoint: Record<string, number> = {
      easy: 1000,
      medium: 10000,
      hard: 14000,
      very_hard: 20000,
    };

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    const finalQuiz = quiz.map((q: any) => ({
      ...q,
      point: difficultyPoint[q.difficulty] || 1000,
    }));

    return finalQuiz;
  } catch (error: any) {
    console.error(error.response?.data || error.message);
    throw new Error('Groq API error');
  }
}
