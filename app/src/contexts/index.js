import { createContext } from "react";
import RootStore from "../stores/index";

const store = new RootStore();

window.store = store;

export const storeContext = createContext(store);
