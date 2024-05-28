import { motion } from "framer-motion";
import styles from "./GridNode.module.css";

interface Props {
  id: number;
  parentId: number;
  open: boolean;
  onClick: () => void
}

export const GridNode = ({id, parentId, open, onClick}: Props): JSX.Element => {

  return (
    <>
      <motion.div 
      onClick={onClick}
      className={styles.gridnode}
      style={{
        backgroundColor: open ? "blue" : "grey"
      }}
      >
        {id}
      </motion.div>
    </>
  )
}