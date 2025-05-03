# tcg_shogi

### 参考資料
1. https://qiita.com/YutaManaka/items/60bed57196386ccce931
2. 

---
# プロンプト履歴

<details><summary>#1：ChatGPT</summary>

```
5マス将棋を生成AIに作ってもらう場合のプロンプトを考えて
```

* 結果として #2 が出力された。たたき台としては十分だと思う

</details>

<details><summary>#2：Claude</summary>

```
5x5の将棋ボードを使ったシンプルな将棋ゲームを作成してほしい。以下の要素を含めてください：
1. プレイヤーは各自、王、飛車、角の3つの駒を持つ。
2. 駒の動きとルールは通常の将棋に基づくが、ボードは5x5のサイズ。
3. ゲームの目的は相手の王を取ること。
4. 取った駒はそのままゲームから除外される。
5. プレイヤーが交互に駒を動かすターン制で、勝者が決まるまで繰り返す。
6. ゲームの開始時にランダムに駒の配置を決定する機能も追加してほしい。
このゲームのルールや駒の動きについて、具体的に説明して、簡単にプレイできるインターフェースを提案してください。
```

* この出力結果をよく推敲していなかったせいで 4. のような従来の将棋からは外れるような指示をしてしまった。見直し大事。

</details>


---

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```
