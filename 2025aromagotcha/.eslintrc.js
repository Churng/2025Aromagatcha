module.exports = {
	root: true,
	env: {
		node: true,
	},
	extends: [
		"plugin:vue/recommended", // 使用 Vue 2 的推薦配置
	],
	parserOptions: {
		parser: "@babel/eslint-parser", // 使用 Babel 作為解析器
		requireConfigFile: false, // 允許不需要 Babel 配置文件
	},
	rules: {
		// 可以在這裡自定義規則
	},
};
