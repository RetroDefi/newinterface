import { useContext } from "react";
import { Context } from "../../contexts/Web3SideProvider";
import { Web3Provider } from "@ethersproject/providers";

const useSideWeb3 = (): { polygon: Web3Provider } => {
  const { polygon } = useContext(Context);
  return { polygon };
};

export default useSideWeb3;
