import { motion } from "framer-motion";
import styles from "./GridNode.module.css";

interface Props {
  id: number;
  parentId: number;
  open: boolean;
  onClick: () => void
  onMouseEnter?: React.MouseEventHandler<HTMLDivElement> | undefined
  onMouseLeave?: React.MouseEventHandler<HTMLDivElement> | undefined
}

export const GridNode = ({id, parentId, open, onClick, onMouseEnter, onMouseLeave}: Props): JSX.Element => {

  return (
    <>
      <motion.div 
        onClick={onClick}
        className={styles.gridnode}
        layoutId="node"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        style={{
          backgroundColor: open ? "blue" : "grey"
        }}
      >
          {id}
      </motion.div>
    </>
  )
}