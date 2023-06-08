import { defineStore } from "pinia";
import { ref } from "vue";
import { UserContext } from "../dataModels/users/userContext";

export const useUserContextStore = defineStore("userContext", () => {
    const userContext = ref(new UserContext());

    function setUserContext(newUserContext: UserContext) {
        userContext.value = newUserContext;
    }

    return { userContext, setUserContext };
});
