import { useContext } from "react";
import { Context } from "../contexts/BunnyProvider";

const useBunny = () => {
  const { bunny } = useContext(Context);
  return bunny;
};

export default useBunny;
