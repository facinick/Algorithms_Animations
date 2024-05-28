import { useEffect, useMemo, useState } from "react";
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

  const percolation = useMemo(() =>  new Percolation(nRows, nCols), [])

  const [id, setId] = useState<Array<number>>(() => percolation.getData());

  const [open, setOpen] = useState<Array<boolean>>(() => percolation.getOpenData());

  const NODE_WIDTH = 50;
  const NODE_HEIGHT = 50;
  const GRID_WIDTH = NODE_WIDTH * nCols;
  const GRID_HEIGHT = NODE_HEIGHT * nRows;

  const onGridNodeClick = (p: number) => {
    percolation.openSite(p)
    setId([...percolation.getData()])
    setOpen([...percolation.getOpenData()])
  }

  useEffect(() =>  {
    const isPercolating = percolation.isPercolating()
    setPercolating(isPercolating)
  }, [open, percolation])

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
      >
        {
          id.map((node, index, id) => {
            if (index !== 0 && index !== nLength - 1) {
              return (
                <GridNode key={index} onClick={() => onGridNodeClick(index)} id={index} parentId={id[index]} open={open[index]} />
              )
            } else return null;
          })
        }
        {percolating && <span>Percolating!</span>}
      </div>
    </>
  )
}