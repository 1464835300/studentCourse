import { createRouter, createWebHashHistory } from "vue-router";
const viteComponents = import.meta.glob("../views/**/*.vue");
console.log(viteComponents);
const routesList = [];
for (const [key, value] of Object.entries(viteComponents)) {
    let obj = {
        path: key.replace("../views", "").replace(".vue", ""),
        name: key.match(/\/\w+.vue$/, "")[0].replace(".vue", ""),
        component: viteComponents[key]
    }
    routesList.push(obj)
}
const router = createRouter({
    history: createWebHashHistory(),
    routes: routesList
});
export default router;