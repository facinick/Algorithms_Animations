import { WeightedQuickUnion } from "./WeightedQuickUnion";

class Percolation {

  private ROWS: number;
  private COLS: number;

  private sites: WeightedQuickUnion
  private open: Array<boolean>;
  private full: Array<boolean>;
  private nSitesOpen: number = 0;

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
    this.open = new Array<boolean>().fill(false)
    this.open[this.TOP_VIRTUAL_SITE_INDEX] = true;
    this.open[this.BOTTOM_VIRTUAL_SITE_INDEX] = true;

    this.full = new Array<boolean>().fill(false)
    this.full[this.TOP_VIRTUAL_SITE_INDEX] = true;
  }

  public openSite(p: number): void {
    if(this.isOpen(p)) {
      return;
    }

    this.open[p] = true;
    this.nSitesOpen += 1;
    this.unionWithOpenNeighbours(p)
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
    return this.open[p];
  }

  public isPercolating(): boolean {
    return this.sites.connected(this.TOP_VIRTUAL_SITE_INDEX, this.BOTTOM_VIRTUAL_SITE_INDEX)
  }

  // a site is full, if any of it's neighbour is open and full.
  public isFull(p: number): boolean {
    return this.sites.connected(p, this.TOP_VIRTUAL_SITE_INDEX)
  }

  public getPercolatingComponent(): number[] {
    return this.sites.findComponent(this.BOTTOM_VIRTUAL_SITE_INDEX)
  }

  public getData(): WeightedQuickUnion['id'] {
    return this.sites.getData()
  }

  public getOpenData(): Array<boolean> {
    return this.open;
  }
}

export { Percolation };
