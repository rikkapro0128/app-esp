import { Notyf } from "notyf";

// Create an instance of Notyf
const notyf = new Notyf({
  position: { x: "center", y: "top" },
  dismissible: true,
  duration: 5000,
  types: [
    {
      type: "success",
      background: "rgb(123, 213, 85)",
    },
  ],
});

export default notyf;
