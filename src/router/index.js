import Vue from "vue";
import Router from "vue-router";

// 匯入頁面元件（你自己要建立 ExamPage.vue）
// import HomePage from "../views/HomePage.vue";
import ExamPage from "../views/ExamPage.vue";
import LearningPage from "@/views/LearningPage.vue";
import OilPage from "@/views/OilPage.vue";
import OilExamPage from "@/views/OilExamPage.vue";

Vue.use(Router);

export default new Router({
	mode: "history",
	routes: [
		{
			path: "/exam",
			name: "ExamPage",
			component: ExamPage,
		},
		{
			path: "/learn",
			name: "LearningPage",
			component: LearningPage,
		},
		{
			path: "/learnOil",
			name: "OilPage",
			component: OilPage,
		},
		{
			path: "/oilExam",
			name: "OilExamPage",
			component: OilExamPage,
		},
	],
});
