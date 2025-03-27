import { mount } from "svelte";
import Notification from "./Notification.svelte";

const app = mount(Notification, { target: document.getElementById("app") });

export default app;
