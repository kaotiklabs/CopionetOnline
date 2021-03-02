/*jshint esversion: 6 */

var docArray = [];
var uniqueGlobalDict = {};
var collisionGlobalDict = {};
var templateGlobalDict = {};

function ParseFile(file) {
  //console.log("Adding New File");
  bufDoc = new DocumentClass(file);
  docArray.push(bufDoc);

  //console.log("Extracting Raw Text");
  extractRawText(bufDoc);
}

//
//  VUE APP
//

// 1. Define route components.
const NotFoundComponent = {
  template: "<div>NotFoundComponent</div>",
};

// const DefaultView = { template: '<div>Default {{ $route.params.id }}</div>'}
// const DetailsView = { template: '<div>Details {{ $route.params.id }}</div>'}

const EditView = {
  template: "<div>Edit {{ $route.params.id }}</div>",
};
const RemoveView = {
  template: "<div>Remove {{ $route.params.id }}</div>",
};

// 2. Define some routes
const routes = [
  {
    path: "/",
    redirect: "/defaultview",
  },
  {
    path: "/defaultview",
    name: "defaultview",
    component: DefaultView,
  },
  {
    path: "*",
    component: NotFoundComponent,
  },
  {
    path: "/details/:id",
    component: DetailsView,
  },
  {
    path: "/edit/:id",
    component: EditView,
  },
  {
    path: "/remove/:id",
    component: RemoveView,
  },
];

// 3. Create the router instance and pass the `routes` option
const router = new VueRouter({
  routes, // short for `routes: routes`
});

const store = new Vuex.Store({
  state: {
    documents: docArray,
    collisions: collisionGlobalDict,
  },
  getters: {},
  mutations: {},
  actions: {},
});

// 4. Create and mount the root instance.
const app = new Vue({
  router,
  store, // VueX central data store
  data: {},
  methods: {
    goBack() {
      window.history.length > 1 ? this.$router.go(-1) : this.$router.push("/");
    },
  },
  filters: {},
}).$mount("#app");
