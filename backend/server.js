// const express = require('express');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// const { OpenAI } = require('langchain/llms/openai');
// const { PromptTemplate } = require('langchain/prompts');

// const app = express();
// app.use(cors());
// app.use(bodyParser.json());

// // LangChain のモデル初期化
// const model = new OpenAI({
//   openAIApiKey: process.env.REACT_APP_OPENAI_API_KEY,
//   temperature: 0.7, // 応答の多様性を制御
//   modelName: 'gpt-4o-mini', // モデルを指定
// });

// // POSTエンドポイント
// app.post('/api/gpt', async (req, res) => {
//   const { question } = req.body;

//   if (!question || question.trim() === '') {
//     return res.status(400).json({ error: '質問を入力してください。' });
//   }

//   try {
//     // LangChainを使ってプロンプトを構築
//     const template = '質問: {question}\n回答:';
//     const prompt = new PromptTemplate({
//       inputVariables: ['question'],
//       template,
//     });

//     // プロンプトを生成
//     const promptText = await prompt.format({ question });

//     // モデルを呼び出して応答を取得
//     const response = await model.call(promptText);

//     res.json({ answer: response });
//   } catch (error) {
//     console.error('エラーが発生しました:', error);
//     res.status(500).json({ error: 'エラーが発生しました。もう一度お試しください。' });
//   }
// });

// // サーバー起動
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });


const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { OpenAI } = require('langchain/llms/openai');
const { PromptTemplate } = require('langchain/prompts');


const rolePrompts = {
  facilitator: 'あなたは議論のファシリテータです。以下の議題に基づき、全体の流れを管理し、メンバーが議論しやすいようにサポートしてください。\n議題: {topic}',
  timeKeeper: 'あなたはタイムキーパーです。議論が時間内に終わるよう管理してください。進行に合わせて助言を行ってください。\n議題: {topic}',
  summarizer: 'あなたは要約者です。議論の要点をまとめてください。\n議題: {topic}',
  ideaGenerator: 'あなたは新しいアイデアを出す人です。以下の議題について、新しい視点や独自の解決策を考案してください。\n議題: {topic}',
  webResearcher: 'あなたは研究者です。以下のアイデアがWeb上に存在するか、または類似情報があるかを調査してください。\nアイデア: {idea}',
};

const safeCall = async (prompt) => {
  try {
    return await model.call(prompt);
  } catch (error) {
    console.error('モデル呼び出しに失敗:', error);
    return 'エラーが発生しました。'; // エラーメッセージを返却
  }
};

const manageDiscussion = async (topic) => {
  const facilitatorResponse = await safeCall(rolePrompts.facilitator.replace('{topic}', topic));
  const timeKeeperResponse = await safeCall(rolePrompts.timeKeeper.replace('{topic}', topic));
  const ideaGeneratorResponse = await safeCall(rolePrompts.ideaGenerator.replace('{topic}', topic));
  
  const ideaText = ideaGeneratorResponse && ideaGeneratorResponse.trim()
    ? ideaGeneratorResponse.trim()
    : '新しいアイデアを考案中';

  const webResearcherResponse = await safeCall(
    rolePrompts.webResearcher.replace('{idea}', ideaText)
  );

  const summarizerResponse = await safeCall(rolePrompts.summarizer.replace('{topic}', topic));

  return {
    facilitator: facilitatorResponse,
    timeKeeper: timeKeeperResponse,
    ideaGenerator: ideaGeneratorResponse,
    webResearcher: webResearcherResponse,
    summarizer: summarizerResponse,
  };
};

const app = express();
app.use(cors());
app.use(bodyParser.json());

// LangChain のモデル初期化
const model = new OpenAI({
  openAIApiKey: process.env.REACT_APP_OPENAI_API_KEY,
  temperature: 0.7, // 応答の多様性を制御
  modelName: 'gpt-4o-mini', // モデルを指定
});

// POSTエンドポイント
// app.post('/api/gpt', async (req, res) => {
//   const { topic } = req.body;

//   if (!topic || topic.trim() === '') {
//     return res.status(400).json({ error: '議題を入力してください。' });
//   }

//   try {
//     const discussionResults = await manageDiscussion(topic);
//     res.json(discussionResults);
//   } catch (error) {
//     console.error('エラーが発生しました:', error);
//     res.status(500).json({ error: 'エラーが発生しました。もう一度お試しください。' });
//   }
// });

app.post('/api/gpt', async (req, res) => {
  const { question } = req.body;

  if (!question || question.trim() === '') {
    return res.status(400).json({ error: '質問を入力してください。' });
  }

  try {
    // LangChainを使ってプロンプトを構築
    const template = '質問: {question}\n回答:';
    const prompt = new PromptTemplate({
      inputVariables: ['question'],
      template,
    });

    // プロンプトを生成
    const promptText = await prompt.format({ question });

    // モデルを呼び出して応答を取得
    const response = await model.call(promptText);

    res.json({ answer: response });
  } catch (error) {
    console.error('エラーが発生しました:', error);
    res.status(500).json({ error: 'エラーが発生しました。もう一度お試しください。' });
  }
});

// サーバー起動
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});