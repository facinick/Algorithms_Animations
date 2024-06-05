import { useEffect, useMemo, useState } from "react";
import { Percolation, SiteState } from "./Algorithm/Percolation";
import { GridNode } from "./Node";
import styles from "./PercolatingGrid.module.css";

const SETTINGS = {
  ROWS: 10,
  COLS: 10,
}

export const PercolatingGrid = (): JSX.Element => {

  const nRows: number = SETTINGS.ROWS
  const nCols: number = SETTINGS.COLS
  const nLength = nRows * nCols + 2;

  const [percolating, setPercolating] = useState<boolean>(false);

  const percolation = useMemo(() => new Percolation(nRows, nCols), [nRows, nCols])

  const [id, setId] = useState<Array<number>>(() => percolation.getData());

  const [siteState, setSiteState] = useState<Array<SiteState>>(() => percolation.getSiteState());

  // const [playWaterDropSound] = useSound(waterDropSound, {
  //   sprite: {
  //     drop1: [400, 1000],
  //     drop2: [1500, 2000],
  //     drop3: [2700, 2300],
  //   },
  // });

  const [hoveredNode, setHoveredNode] = useState<number>(-1);
  const [hoveredNodeTimer, setHoveredNodeTimer] = useState<NodeJS.Timeout | null>(null);

  const NODE_WIDTH = 30;
  const NODE_HEIGHT = 30;
  const GRID_WIDTH = NODE_WIDTH * nCols;
  const GRID_HEIGHT = NODE_HEIGHT * nRows;

  const onGridNodeClick = (p: number) => {
    if (!percolation.isOpen(p)) {
      percolation.openSite(p)
      // playWaterDropSound({
      //   id: "drop1"
      // })
      setId([...percolation.getData()])
      setSiteState([...percolation.getSiteState()])
    }
  }

  useEffect(() => {
    const isPercolating = percolation.isPercolating()
    setPercolating(isPercolating)
    if(isPercolating) {
     console.log(percolation.getPercolatingComponent())
    }
  }, [siteState, percolation])

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
        // onMouseLeave={() => handleMouseLeave()}
      >
        {
          id.map((_, index, id) => {
            if (index !== 0 && index !== nLength - 1) {
              return (
                <GridNode
                    key={index}
                    onClick={() => onGridNodeClick(index)}
                    id={index}
                    parentId={id[index]}
                    siteState={siteState[index]}
                    // onMouseEnter={() =>
                    //   handleMouseEnter(index)}
                  />
              )
            } else return null;
          })
        }
        {percolating && <span>Percolating!</span>}
      </div>
    </>
  )
}