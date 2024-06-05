import { WeightedQuickUnion } from "./WeightedQuickUnion";

export enum SiteState {
  OPEN="open",
  CLOSED="closed",
  FULL="full",
}

class Percolation {

  private ROWS: number;
  private COLS: number;

  private sites: WeightedQuickUnion
  private nSitesOpen: number = 0;

  private siteState: Array<SiteState>;

  private TOP_VIRTUAL_SITE_INDEX: number;
  private BOTTOM_VIRTUAL_SITE_INDEX: number;
  private FIRST_ROW_INDEX:number;
  private FIRST_COL_INDEX:number;
  private LAST_ROW_INDEX: number;
  private LAST_COL_INDEX: number;

  constructor(p: number, q: number) {
    this.ROWS = p;
    this.COLS = q;

    this.FIRST_ROW_INDEX = 0;
    this.FIRST_COL_INDEX = 0;
    this.LAST_ROW_INDEX = this.ROWS-1;
    this.LAST_COL_INDEX = this.COLS-1;
    this.TOP_VIRTUAL_SITE_INDEX = 0;
    this.BOTTOM_VIRTUAL_SITE_INDEX = this.ROWS * this.COLS + 2 - 1;

    this.sites = new WeightedQuickUnion(this.ROWS * this.COLS + 2);

    this.siteState = new Array<SiteState>(this.ROWS * this.COLS + 2).fill(SiteState.CLOSED)
    this.siteState[this.TOP_VIRTUAL_SITE_INDEX] = SiteState.FULL;
    this.siteState[this.BOTTOM_VIRTUAL_SITE_INDEX] = SiteState.OPEN;
  }

  public openSite(p: number): void {
    if(this.isOpen(p)) {
      return;
    }

    this.siteState[p] = SiteState.OPEN;
    this.nSitesOpen += 1;
    this.unionWithOpenNeighbours(p)
    this.flood(p)
  }

  // DFS Flood at p, if any neighbour is flooded, flood myself. Then flood all open neighbouts
  private flood(p: number): void {

    if(!this.shouldFlood(p)) {
      return;
    }

    const neighbors = this.getNetighbours(p)

    this.siteState[p] = SiteState.FULL;

    for (const neighbor of Object.values(neighbors)) {
      if (neighbor !== null && this.isOpen(neighbor) && !this.isFull(neighbor)) {
        this.flood(neighbor);
      }
    }
  }

  private shouldFlood(p: number): boolean {
    if(this.siteState[p] !== SiteState.OPEN) {
      return false
    }

    const neighbors = this.getNetighbours(p)

    for (const [position, id] of Object.entries(neighbors)) {

      // top virtal site is always flooded
      if((position === "top") && (id === null) && this.isFull(this.TOP_VIRTUAL_SITE_INDEX)) {
        console.log(`flood: ${p} because of ${id}`)
        return true
      }

      if (id !== null && this.isFull(id)) {
        console.log(`flood: ${p} because of ${id}`)
        return true
      }
    }

    return false
  }

  public getNSitesOpen(): number {
    return this.nSitesOpen;
  }

  public unionWithOpenNeighbours(p: number): void {

    const {row} = this.getRowColsFromIndex(p)
    const {left, right, top, bottom} = this.getNetighbours(p)

    // connect to virtual sites if they nearby -------
    if(row === this.LAST_ROW_INDEX) {
      this.sites.union(p, this.BOTTOM_VIRTUAL_SITE_INDEX)
    }

    if(row === this.FIRST_ROW_INDEX) {
      this.sites.union(p, this.TOP_VIRTUAL_SITE_INDEX)
    }

    // connect to open neighbours
    if(left && this.isOpen(left)) {
      this.sites.union(p, left)
    }

    if(right && this.isOpen(right)) {
      this.sites.union(p, right)
    }

    if(top && this.isOpen(top)) {
      this.sites.union(p, top)
    }

    if(bottom && this.isOpen(bottom)) {
      this.sites.union(p, bottom)
    }
  }

  public getNetighbours(p: number): {left: number | null, right: number | null, top: number | null, bottom: number | null} {

    const {row, col} = this.getRowColsFromIndex(p)

    const left = col === this.FIRST_COL_INDEX ? null : p-1
    const right = col === this.LAST_COL_INDEX ? null : p+1
    const top = row === this.FIRST_ROW_INDEX ? null : p-this.COLS
    const bottom = row === this.LAST_ROW_INDEX ? null : p+this.COLS

    return {
      left,
      right,
      top,
      bottom
    }
  }

  private getRowColsFromIndex(p: number): {row: number; col: number} {
    return {
      row: Math.floor((p-1) / this.COLS),
      col: (p-1) % this.COLS,
    }
  }

  public isOpen(p: number): boolean  {
    return (this.siteState[p] === SiteState.OPEN) || this.isFull(p);
  }

  public isPercolating(): boolean {
    return this.sites.connected(this.TOP_VIRTUAL_SITE_INDEX, this.BOTTOM_VIRTUAL_SITE_INDEX)
  }

  // a site is full, if any of it's neighbour is open and full.
  public isFull(p: number): boolean {
    return this.siteState[p] === SiteState.FULL;
  }

  public getPercolatingComponent(): number[] {
    return this.sites.findComponent(this.BOTTOM_VIRTUAL_SITE_INDEX)
  }

  public getData(): WeightedQuickUnion['id'] {
    return this.sites.getData()
  }

  public getSiteState(){
    return this.siteState;
  }
}

export { Percolation };
