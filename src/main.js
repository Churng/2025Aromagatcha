import Vue from "vue";
import App from "./App.vue";
import "bootstrap/dist/css/bootstrap.min.css"; // 引入 Bootstrap CSS
import "bootstrap/dist/js/bootstrap.bundle";
import "bootstrap"; // 引入 Bootstrap JS
import router from "./router";

Vue.config.productionTip = false;

new Vue({
	router,
	render: (h) => h(App),
}).$mount("#app");
