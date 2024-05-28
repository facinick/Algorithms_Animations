import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import useSound from "use-sound";
import waterDropSound from '../../assets/sounds/water_drop.mp3';
import { Percolation } from "./Algorithm/Percolation";
import { GridNode } from "./Node";
import styles from "./PercolatingGrid.module.css";

const SETTINGS = {
  ROWS: 12,
  COLS: 15,
}

export const PercolatingGrid = (): JSX.Element => {

  const nRows: number = SETTINGS.ROWS
  const nCols: number = SETTINGS.COLS
  const nLength = nRows * nCols + 2;

  const [percolating, setPercolating] = useState<boolean>(false);

  const percolation = useMemo(() => new Percolation(nRows, nCols), [nRows, nCols])

  const [id, setId] = useState<Array<number>>(() => percolation.getData());

  const [open, setOpen] = useState<Array<boolean>>(() => percolation.getOpenData());

  const [playWaterDropSound] = useSound(waterDropSound, {
    sprite: {
      drop1: [400, 1000],
      drop2: [1500, 2000],
      drop3: [2700, 2300],
    },
  });

  const [hoveredNode, setHoveredNode] = useState<number>(-1);
  const [hoveredNodeTimer, setHoveredNodeTimer] = useState<NodeJS.Timeout | null>(null);

  const NODE_WIDTH = 50;
  const NODE_HEIGHT = 50;
  const GRID_WIDTH = NODE_WIDTH * nCols;
  const GRID_HEIGHT = NODE_HEIGHT * nRows;

  const onGridNodeClick = (p: number) => {
    if (!percolation.isOpen(p)) {
      percolation.openSite(p)
      playWaterDropSound({
        id: "drop1"
      })
      setId([...percolation.getData()])
      setOpen([...percolation.getOpenData()])
    }
  }

  useEffect(() => {
    const isPercolating = percolation.isPercolating()
    setPercolating(isPercolating)
  }, [open, percolation])

  const handleMouseEnter = (index: number) => {
    // Clear any existing timer
    if (hoveredNodeTimer) {
      clearTimeout(hoveredNodeTimer);
    }
    // Set a new timer
    const timer = setTimeout(() => {
      setHoveredNode(index);
    }, 50); // Change 200 to the desired delay in milliseconds
    setHoveredNodeTimer(timer);
  };

  const handleMouseLeave = () => {
    // Clear the timer if the mouse leaves before the timer completes
    if (hoveredNodeTimer) {
      clearTimeout(hoveredNodeTimer);
      setHoveredNodeTimer(null);
    }
  };

  return (
    <>
      <div
        className={styles.grid}
        style={{
          width: GRID_WIDTH,
          height: GRID_HEIGHT,
          display: "grid",
          gridTemplateColumns: `repeat(${nCols}, ${NODE_WIDTH}px)`,
          gridTemplateRows: `repeat(${nRows}, ${NODE_HEIGHT}px)`,
        }}
        onMouseLeave={() => handleMouseLeave()}
      >
        {
          id.map((node, index, id) => {
            if (index !== 0 && index !== nLength - 1) {
              return (
                <div

                  style={{ position: "relative" }}>
                  {hoveredNode === index && (
                    <motion.div
                      layoutId="hovered-node"
                      className={styles['hovered-node']}
                      style={{
                        width: NODE_WIDTH,
                        height: NODE_HEIGHT,
                      }}
                    />
                  )}
                  <GridNode
                    key={index}
                    onClick={() => onGridNodeClick(index)}
                    id={index}
                    parentId={id[index]}
                    open={open[index]}
                    onMouseEnter={() =>
                      handleMouseEnter(index)}
                  />
                </div>
              )
            } else return null;
          })
        }
        {percolating && <span>Percolating!</span>}
      </div>
    </>
  )
}