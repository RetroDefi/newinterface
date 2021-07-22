import { useContext } from "react";
import { Context } from "../../contexts/DataProvider";

const useDataAPY = () => {
  const { apyData } = useContext(Context);
  return apyData;
};

export default useDataAPY;
