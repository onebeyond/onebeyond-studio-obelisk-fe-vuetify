const Vue = require("vue");
import VeeValidate from "vee-validate";
import SessionTimeoutComponent from "@components/util/sessionTimeout.vue";
import UserContextSetter from "@components/util/userContextSetter.vue";
import AlertModal from "@components/util/alertModal.vue";
import "regenerator-runtime/runtime";

Vue.use(VeeValidate);
Vue.component("session-timeout", SessionTimeoutComponent);
Vue.component("user-context", UserContextSetter);
Vue.component("v-alertModal", AlertModal);
