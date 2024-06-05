import classNames from "classnames";
import { motion } from "framer-motion";
import { SiteState } from "../Algorithm/Percolation";
import styles from "./GridNode.module.css";

interface Props {
  id: number;
  parentId: number;
  siteState: SiteState;
  onClick: () => void
  onMouseEnter?: React.MouseEventHandler<HTMLDivElement> | undefined
  onMouseLeave?: React.MouseEventHandler<HTMLDivElement> | undefined
}

export const GridNode = ({id, parentId, siteState, onClick, onMouseEnter, onMouseLeave}: Props): JSX.Element => {

  // classNames

  return (
    <>
      <motion.div 
        onClick={onClick}
        className={classNames(styles.gridnode, styles[siteState])}
        layoutId="node"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {/* {id} */}
      </motion.div>
    </>
  )
}