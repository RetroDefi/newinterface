import { useContext } from "react";
import firebase from "firebase/app";
import { Context } from "../contexts/Firebase";

const useFirebase = (): firebase.app.App => {
  const { app } = useContext(Context);
  return app;
};

export default useFirebase;
