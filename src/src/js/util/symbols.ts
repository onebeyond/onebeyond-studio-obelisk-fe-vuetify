import type { ShowMethod } from "@js/types/toastTypes";
import type { ComputedRef, InjectionKey } from "vue";

export const ShowAlertKey: InjectionKey<ComputedRef<ShowMethod>> = Symbol("ShowAlertKey");
