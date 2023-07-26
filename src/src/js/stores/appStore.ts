import { defineStore } from "pinia";
import { ref, type Ref } from "vue";
import { UserContext } from "../dataModels/users/userContext";

export const useUserContextStore = defineStore("userContext", () => {
    const userContext: Ref<UserContext> = ref(new UserContext());

    function setUserContext(newUserContext: UserContext) {
        userContext.value = newUserContext;
    }

    return { userContext, setUserContext };
});
