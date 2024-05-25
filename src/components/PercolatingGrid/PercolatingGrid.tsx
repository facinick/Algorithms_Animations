import { useEffect, useState } from "react";
import { GridNode } from "./Node";
import styles from "./PercolatingGrid.module.css";

export const PercolatingGrid = (): JSX.Element => {

  const nRows: number = 3;
  const nCols: number = 3;
  const nLength = nRows * nCols + 2;
  const [percolating, setPercolating] = useState<boolean>(false);

  const [nOpenSites, setNOpenSites] = useState<number>(0)

  const [id, setId] = useState<Array<number>>(() => {
    const idArray = Array(nLength).fill(0);
    for (let i = 0; i < nLength; i++) {
      idArray[i] = i;
    }
    return idArray;
  });

  const [open, setOpen] = useState<Array<boolean>>(() => {
    const openArray = Array(nLength).fill(false);
    openArray[0] = true;
    openArray[nLength - 1] = true;
    return openArray;
  });

  const [weight, setWeight] = useState<Array<number>>(Array(nLength).fill(1));

  // ok
  const find = (p: number): number => {
    let child = p;
    let parent = id[p];

    // in case we find root element, it's value will point to it's own id. 
    // child is the element / id / node
    // parent is the value of that id in array, id of another element. sighs
    while (child !== parent) {
      child = parent
      parent = id[child]
    }
    return parent;
  }

  // only command, ok
  const union = (p: number, q: number): void => {
    const rootP = find(p)
    const rootQ = find(q)

    if (rootP === rootQ) {
      return;
    }

    const copyId = Array.from(id);
    const copyWeight = Array.from(weight);

    // p is in smaller tree, make p's root's parent q's root
    if (copyWeight[rootP] < copyWeight[rootQ]) {
      copyId[rootP] = rootQ
      copyWeight[rootQ] = copyWeight[rootQ] + copyWeight[rootP]
    } else {
      copyId[rootQ] = rootP
      copyWeight[rootP] = copyWeight[rootQ] + copyWeight[rootP]
    }

    setId(copyId)
    setWeight(copyWeight)
  }

  // ok
  const isOpen = (p: number): boolean => {
    return open[p];
  }

  // ok
  const connected = (p: number, q: number): boolean => {
    return find(p) === find(q);
  }

  // ok
  const isPercolating = (): boolean => {
    const VIRTUAL_SITE_FIRST_INDEX = 0
    const VIRTUAL_SITE_LAST_INDEX = nLength - 1;
    return connected(VIRTUAL_SITE_FIRST_INDEX, VIRTUAL_SITE_LAST_INDEX)
  }

  // ok
  const openSite = (p: number): void => {
    if (isOpen(p)) {
      return;
    }

    const copyOpen = Array.from(open);
    copyOpen[p] = true
    setOpen(copyOpen)
    setNOpenSites((nOpenSites) => nOpenSites + 1)

    const VIRTUAL_SITE_FIRST_INDEX = 0
    const VIRTUAL_SITE_LAST_INDEX = nLength - 1;

    const FIRST_ROW_INDEX = 0;
    const FIRST_COL_INDEX = 0;
    const LAST_ROW_INDEX = nRows - 1;
    const LAST_COL_INDEX = nCols - 1;

    // now union with all adjacent OPEN neighbours
    const P_ROW = Math.floor((p - 1) / nCols);
    const P_COL = (p - 1) % nCols;

    // left ======================================================
    // left most i.e. no left neighbour
    if (P_COL === FIRST_COL_INDEX) {
      // continue
    }
    // there is a left cell
    else {
      // if open, union
      if (isOpen(p - 1)) {
        console.log(`Connecting ${p} & ${p - 1}`)
        union(p, p - 1)
      }
    }
    // right ======================================================
    // right most i.e. no right neighbour
    if (P_COL === LAST_COL_INDEX) {
      // continue
    }
    // there is a right cell
    else {
      // if open, union
      if (isOpen(p + 1)) {
        console.log(`Connecting ${p} & ${p + 1}`)
        union(p, p + 1)
      }
    }

    // top ======================================================
    // top most i.e. no top neighbour except virtual cell
    if (P_ROW === FIRST_ROW_INDEX) {
      // if open, union
      if (isOpen(VIRTUAL_SITE_FIRST_INDEX)) {
        console.log(`Connecting ${p} & ${VIRTUAL_SITE_FIRST_INDEX}`)
        union(p, VIRTUAL_SITE_FIRST_INDEX)
      }
    }
    // there is a top cell
    else {
      // if open, union
      if (isOpen(p - nCols)) {
        console.log(`Connecting ${p} & ${p - nCols}`)
        union(p, p - nCols)
      }
    }

    // bottom ======================================================
    // bottom most i.e. no bottom neighbour except virtual cell
    if (P_ROW === LAST_ROW_INDEX) {
      // if open, union
      if (isOpen(VIRTUAL_SITE_LAST_INDEX)) {
        console.log(`Connecting ${p} & ${VIRTUAL_SITE_LAST_INDEX}`)
        union(p, VIRTUAL_SITE_LAST_INDEX)
      }
    }
    // there is a bottom cell
    else {
      // if open, union
      if (isOpen(p + nCols)) {
        console.log(`Connecting ${p} & ${p + nCols}`)
        union(p, p + nCols)
      }
    }
  }

  const display = (): void => {
    const padding = 1; // Adjust based on desired spacing around digits
    const maxDigitWidth = 2;
    for (let row = 0; row < nRows; row++) {
      let result = "";
      for (let col = 0; col < nCols; col++) {
        const index = row * nCols + col + 1;
        const element = id[index];
        result += element.toString().padStart(maxDigitWidth + padding * 2, " ");
      }
      console.log(result);
    }
  }

  const NODE_WIDTH = 50;
  const NODE_HEIGHT = 50;

  const GRID_WIDTH = NODE_WIDTH * nCols;
  const GRID_HEIGHT = NODE_HEIGHT * nRows;

  const onGridNodeClick = (p: number) => {
    openSite(p)
  }

  useEffect(() => {
    display()
    console.log(id)
    if(isPercolating()) {
      alert("perrr")
      setPercolating(true)
    }
  }, [nOpenSites, id])

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
            }
          })
        }
        {percolating && <span>Percolating!</span>}
        {nOpenSites}
      </div>
    </>
  )
}